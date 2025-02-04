document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signupForm");

    if (form) {
        form.addEventListener("submit", storeFormData);
    } else {
        console.error("Form element with id 'signupForm' not found.");
    }
});

async function storeFormData(event) {
    event.preventDefault(); // Prevent page reload

    console.log("Form submitted");

    // Get form values safely
    const getFieldValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : ""; // Ensure it never returns null
    };

    // Capture user input
    const userData = {
        name: getFieldValue("accountHolderName"), // Backend expects 'name'
        accountNumber: getFieldValue("accountNumber"),
        accountType: getFieldValue("accountType"),
        cifNumber: getFieldValue("cifNumber"),
        branchCode: getFieldValue("branchCode"),
        country: getFieldValue("country"),
        mobileNumber: getFieldValue("mobileNumber"),
        username: getFieldValue("username"),
        password: getFieldValue("password"),
        email: getFieldValue("mail"),  
        dob: getFieldValue("date"),  
    };

    const confirmPassword = getFieldValue("confirmPassword"); // Get confirm password separately

    console.log("Captured User Data:", userData);

    // Check if any field is empty
    if (Object.values(userData).some(value => value === "")) {
        alert("Please fill all mandatory fields.");
        return;
    }

    // Check if passwords match
    if (userData.password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(userData.password)) {
        alert("Password must be at least 8 characters long and contain an uppercase letter, lowercase letter, and a number.");
        return;
    }

    // Validate Mobile Number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(userData.mobileNumber)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    try {
        const response = await fetch("https://bank-back-ict4.onrender.com/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData), // confirmPassword is not included here
        });

        const result = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "login.html";
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("❌ Error during signup:", error);
        alert("Server error! Please try again later.");
    }
}
