// Generate a random CAPTCHA when the page loads
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById('captcha-text').innerText = captcha;
}

// Validate CAPTCHA and send activation request
async function validateForm(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.querySelector("input[name='username']").value.trim();
    const cifNumber = document.querySelector("input[name='cif_number']").value.trim();
    const dob = document.querySelector("input[name='dob']").value.trim();
    const userCaptcha = document.getElementById('captcha').value.trim();
    const generatedCaptcha = document.getElementById('captcha-text').innerText.trim();

    // Validate mandatory fields
    if (!username || !cifNumber || !dob || !userCaptcha) {
        alert("Please fill in all required fields.");
        return;
    }

    // Validate CAPTCHA
    if (userCaptcha !== generatedCaptcha) {
        alert("CAPTCHA verification failed. Please try again.");
        generateCaptcha(); // Refresh the CAPTCHA
        return;
    }

    try {
        const response = await fetch("https://bank-back-ict4.onrender.com/activate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, cifNumber, dob })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(`Activation failed: ${result.error}`);
            return;
        }

        alert("User activated successfully! You can now log in.");
        window.location.href = "login.html"; // Redirect to login page

    } catch (error) {
        console.error("❌ Activation Error:", error);
        alert("Server error! Please try again later.");
    }
}

// Initialize CAPTCHA and attach event listener to form
document.addEventListener("DOMContentLoaded", function () {
    generateCaptcha();

    const form = document.getElementById("activationForm");
    if (form) {
        form.addEventListener("submit", validateForm);
    } else {
        console.error("Form element with id 'activationForm' not found.");
    }
});
