document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("lockUnlockForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const action = document.getElementById("action").value; // lock-user or unlock-user
        const adminUsername = document.getElementById("adminUsername").value.trim();
        const adminPassword = document.getElementById("adminPassword").value.trim();
        const accountNumber = document.getElementById("accountNumber").value.trim();

        if (!adminUsername || !adminPassword || !accountNumber) {
            alert("Please fill out all fields.");
            return;
        }

        const url = `https://bank-back-ict4.onrender.com/${action}-user`;
        const requestData = {
            adminUsername,
            adminPassword,
            accountNumber
        };

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                const responseData = await response.json();
                alert(responseData.message);
            } else {
                const errorData = await response.json();
                alert(errorData.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send request: " + error.message);
        }
    });
});
