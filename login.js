async function validateLogin(event) {
    event.preventDefault(); // Prevent form submission

    const form = event.target;
    const loginUsername = form.loginAccountNumber.value.trim();
    const loginPassword = form.loginPassword.value.trim();
    const captchaInput = form.captcha.value.trim();
    const captchaTextElement = document.getElementById("captcha-text");

    if (!loginUsername || !loginPassword) {
        alert("Please enter both username and password.");
        return;
    }

    if (!captchaTextElement) {
        alert("Captcha is missing. Please refresh the page.");
        return;
    }

    const generatedCaptcha = captchaTextElement.innerText.trim();

    if (captchaInput !== generatedCaptcha) {
        alert("Captcha is incorrect. Please try again.");
        generateCaptcha();
        return;
    }

    try {
        const loginButton = form.querySelector("button[type='submit']");
        loginButton.disabled = true; // Prevent multiple clicks

        const response = await fetch("https://bank-back-ict4.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Login failed.");
        }

        localStorage.setItem("authToken", result.token);
        localStorage.setItem("loggedInUser", JSON.stringify(result.user));

        alert(`Login successful! Welcome, ${result.user.name}`);
        window.location.href = "transaction.html";
    } catch (error) {
        console.error("❌ Login Error:", error);
        alert(error.message || "Server error! Please try again later.");
    } finally {
        form.querySelector("button[type='submit']").disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", validateLogin);
    } else {
        console.error("Form element with id 'loginForm' not found.");
    }
});

// Generate a random CAPTCHA
function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captcha = "";
    for (let i = 5; i > 0; i--) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const captchaText = document.getElementById("captcha-text");
    if (captchaText) {
        captchaText.innerText = captcha;
    } else {
        console.error("Captcha text element not found.");
    }
}

// Initialize CAPTCHA
generateCaptcha();
