function validateLogin() {
    // Retrieve user data and activated users from local storage
    const storedData = localStorage.getItem("sbiUserData");
    const activatedUsers = JSON.parse(localStorage.getItem("activatedUsers")) || [];

    // Check if any user data exists
    if (!storedData) {
        alert("No user data found. Please register first!");
        return;
    }

    const storedUserData = JSON.parse(storedData);

    // Retrieve input values
    const loginUsername = document.getElementById("loginAccountNumber").value.trim(); // login by username
    const loginPassword = document.getElementById("loginPassword").value.trim();
    const captchaInput = document.getElementById("captcha").value.trim();
    const generatedCaptcha = document.getElementById("captcha-text").innerText.trim();

    // Ensure username and password are entered
    if (!loginUsername || !loginPassword) {
        alert("Please enter both username and password.");
        return;
    }

    // Validate CAPTCHA
    if (captchaInput !== generatedCaptcha) {
        alert("Captcha is incorrect. Please try again.");
        generateCaptcha(); // Regenerate CAPTCHA after incorrect input
        return;
    }

    // Check if the user is activated
    if (!activatedUsers.includes(loginUsername)) {
        alert("User is not activated! Please activate your account first.");
        return;
    }

    // Validate login credentials using username and password
    const user = storedUserData.find(
        (user) => user.username === loginUsername && user.password === loginPassword
    );

    if (user) {
        // Check if the user's account is locked
        if (user.isLocked) {
            alert("Your account is locked. Please contact support to unlock it.");
            return;
        }

        // Store the username in localStorage
        localStorage.setItem("loggedInUser", loginUsername);

        // Retrieve accountHolderName from the matched user object
        const accountHolderName = user.accountHolderName;

        // Display login success message with account holder's name
        alert("Login successful! Welcome, " + accountHolderName);

        // Redirect to the transaction page
        window.location.href = "transaction.html";
    } else {
        alert("Invalid username or password.");
    }
}

// Generate a random CAPTCHA
function generateCaptcha() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    document.getElementById("captcha-text").innerText = captcha;
}

// Initialize CAPTCHA
generateCaptcha();
