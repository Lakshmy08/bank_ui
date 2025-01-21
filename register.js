function page() {
    const dem = document.getElementById("dropdown").value;
    if (dem == "new user") {
        window.location.href = "new.html"; // Redirect to register.html
    } else if (dem == "user activation") {
        window.location.href = "user_activation.html"; // Redirect to user_activation.html
    } else {
        alert("Please select an option first!"); // Show an alert if no option is selected
    }
}
