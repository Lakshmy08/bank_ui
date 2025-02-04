document.getElementById('forgot-password-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const accountNumber = document.getElementById('accountNumber').value;
    const username = document.getElementById('username').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const cifNumber = document.getElementById('cifNumber').value;
    const messageElement = document.getElementById('message');

    try {
        const response = await fetch('https://bank-back-ict4.onrender.com/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accountNumber, username, mobileNumber, cifNumber })
        });

        const data = await response.json();

        if (response.ok) {
            messageElement.style.color = 'green';
            messageElement.textContent = `Temporary Password: ${data.tempPassword}`;
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = data.error;
        }
    } catch (error) {
        console.error('Error:', error);
        messageElement.style.color = 'red';
        messageElement.textContent = 'An error occurred. Please try again later.';
    }
});
