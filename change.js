document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent form from reloading the page

            const oldPassword = document.querySelector('input[name="oldPassword"]').value;
            const newPassword = document.querySelector('input[name="newPassword"]').value;
            const messageElement = document.createElement('p');
            document.body.appendChild(messageElement);

            // Validate that both passwords are provided
            if (!oldPassword || !newPassword) {
                messageElement.style.color = 'red';
                messageElement.textContent = 'Both old and new passwords are required.';
                return;
            }

            // Get the token from localStorage and check if it exists
            const token = localStorage.getItem('authToken');
            console.log("Retrieved Token:", token); // Debugging line
            if (!token) {
                messageElement.style.color = 'red';
                messageElement.textContent = 'No authentication token found. Please log in.';
                return;
            }

            // Optional: Check if token has expired
            function decodeToken(token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.exp * 1000 < Date.now();  // Check if expired
            }

            if (decodeToken(token)) {
                messageElement.style.color = 'red';
                messageElement.textContent = 'Your session has expired. Please log in again.';
                return;
            }

            try {
                const response = await fetch('https://bank-back-ict4.onrender.com/change-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Assuming user is authenticated
                    },
                    body: JSON.stringify({ oldPassword, newPassword })
                });

                const data = await response.json();

                if (response.ok) {
                    messageElement.style.color = 'green';
                    messageElement.textContent = data.message;

                    // Optionally, clear the message after 5 seconds
                    setTimeout(() => {
                        messageElement.remove();
                    }, 5000);
                } else {
                    messageElement.style.color = 'red';
                    messageElement.textContent = data.error || 'An error occurred. Please try again.';
                }
            } catch (error) {
                console.error('Error:', error);
                messageElement.style.color = 'red';
                messageElement.textContent = 'An error occurred. Please try again later.';
            }
        });
    } else {
        console.error('Form element not found.');
    }
});
