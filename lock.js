document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("lockUnlockForm");

    // Retrieve the stored user data from localStorage (array of objects)
    let storedUserData = JSON.parse(localStorage.getItem("sbiUserData")) || [];

    // If no data exists in localStorage, alert the user
    if (storedUserData.length === 0) {
        alert("No user data found. Please register first.");
        return;
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form input values
        const action = document.getElementById("action").value; // lock or unlock
        const username = document.getElementById("username").value.trim();
        const accountNumber = document.getElementById("accountNumber").value.trim();
        const password = document.getElementById("password").value;

        // Find the specific user in the stored data
        const user = storedUserData.find(
            (u) => u.username === username && u.accountNumber === accountNumber
        );

        if (!user) {
            alert("User not found. Please check your credentials.");
            return;
        }

        // Check if the password matches
        if (user.password !== password) {
            alert("Incorrect password.");
            return;
        }

        // Handle lock and unlock actions
        if (action === "lock") {
            if (user.isLocked) {
                alert("This account is already locked.");
            } else {
                user.isLocked = true;
                alert("Account locked successfully.");
            }
        } else if (action === "unlock") {
            if (!user.isLocked) {
                alert("This account is already unlocked.");
            } else {
                user.isLocked = false;
                alert("Account unlocked successfully.");
            }
        }

        // Update localStorage with the modified data
        localStorage.setItem("sbiUserData", JSON.stringify(storedUserData));
    });
});
