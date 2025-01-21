// Load user data from local storage
function retrievePassword(event) {
    event.preventDefault();

    // Input values
    const accountNumber = document.getElementById("accountNumber").value.trim();
    const username = document.getElementById("username").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const cifNumber = document.getElementById("cifNumber").value.trim();

    // Fetch stored data (array of user objects)
    const storedData = localStorage.getItem("sbiUserData");
    if (!storedData) {
        document.getElementById("message").textContent = "No user data found. Please register first.";
        return;
    }

    const userData = JSON.parse(storedData);

    // Find the user that matches the input details
    const user = userData.find(
        (user) =>
            user.accountNumber === accountNumber &&
            user.username === username &&
            user.mobileNumber === mobileNumber &&
            user.cifNumber === cifNumber
    );

    if (user) {
        // Display password and login link
        document.getElementById("message").innerHTML = `
            Your password is: <b>${user.password}</b>.<br>
            <a href="login.html">Click here to login</a>.
        `;
    } else {
        document.getElementById("message").textContent = "Details do not match. Please try again.";
    }
}

// Attach event listener to the form
document.getElementById("forgot-password-form").addEventListener("submit", retrievePassword);
