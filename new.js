function storeFormData() {
    console.log("Form submitted");
    const accountNumber = document.getElementById("accountNumber").value.trim();
    const accountHolderName = document.getElementById("accountHolderName").value.trim();
    const accountType = document.getElementById("accountType").value.trim();
    const cifNumber = document.getElementById("cifNumber").value.trim();
    const branchCode = document.getElementById("branchCode").value.trim();
    const country = document.getElementById("country").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const email = document.getElementById("mail").value.trim();

    // Check mandatory fields
    if (!accountNumber || !accountHolderName || !accountType || !cifNumber || !branchCode || !username || !password || !confirmPassword || !email) {
        alert("Please fill all mandatory fields.");
        return;
    }

    // Check password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Password validation: must be at least 8 characters, contain one capital letter, one number, and one lowercase letter
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.");
        return;
    }

    // Validate mobile number
    if (mobileNumber && !/^\d{10}$/.test(mobileNumber)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Retrieve existing data from localStorage or initialize an empty array
    let existingData = JSON.parse(localStorage.getItem("sbiUserData"));

    // Ensure existingData is an array
    if (!Array.isArray(existingData)) {
        existingData = [];
    }

    // Check if account number already exists
    const accountExists = existingData.some(user => user.accountNumber === accountNumber);
    if (accountExists) {
        alert("Account number already exists.");
        return;
    }

    // Create user data object
    const userData = {
        accountNumber,
        accountHolderName,
        accountType,
        cifNumber,
        branchCode,
        country,
        mobileNumber,
        username,
        password,
        email,
    };

    // Add the new user data to the array
    existingData.push(userData);

    // Save the updated array back to localStorage
    localStorage.setItem("sbiUserData", JSON.stringify(existingData));

    alert("Registration successful!");
    window.location.href = "login.html"; // Redirect to login page
}
