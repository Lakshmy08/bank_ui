// Generate a random CAPTCHA when the page loads
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let captcha = '';
    for (let i = 0; i < 5; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById('captcha-text').innerText = captcha;
}

// Validate CAPTCHA and activate the user
function validateForm(event) {
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

    // Retrieve existing activated users and data
    let activatedUsers = JSON.parse(localStorage.getItem("activatedUsers")) || [];
    let activatedData = JSON.parse(localStorage.getItem("activatedData")) || []; // Store additional activation data

    // Check if the user is already activated
    if (activatedUsers.includes(username)) {
        if (!sessionStorage.getItem("alreadyActivated")) {
            alert("User is already activated. You can log in."); // Show alert
            sessionStorage.setItem("alreadyActivated", "true"); // Set session flag
        }
        window.location.href = "login.html"; // Redirect to login page
        return; // Exit function
    }

    // Add the user to the activated list and store additional activation data
    activatedUsers.push(username);
    activatedData.push({ username, cifNumber, dob });

    // Save to localStorage
    localStorage.setItem("activatedUsers", JSON.stringify(activatedUsers));
    localStorage.setItem("activatedData", JSON.stringify(activatedData));

    // Show activation success message
    alert("User activated successfully! You can now log in.");
    window.location.href = "login.html"; // Redirect to login page
}

// Initialize CAPTCHA and attach event listener to form
window.onload = function () {
    generateCaptcha();

    const form = document.getElementById("myForm");

    // Ensure only one event listener is attached to the form
    form.addEventListener("submit", validateForm);
};
