document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the logged-in user data from localStorage
    const allUsersData = JSON.parse(localStorage.getItem("sbiUserData")) || [];
    const loggedInUser = localStorage.getItem("loggedInUser");
    const currentUser = allUsersData.find(user => user.username === loggedInUser);

    // Find the greeting element
    const greetingElement = document.getElementById("greeting");

    // Check if user data exists and display the greeting
    if (currentUser && currentUser.accountHolderName) {
        greetingElement.innerHTML = `Welcome, ${currentUser.accountHolderName}`;
    } else {
        greetingElement.innerHTML = "Welcome!";
        return; // Exit if no logged-in user
    }

    const contentArea = document.getElementById("contentArea");

    // Initialize transaction history and balance
    let transactionHistory = currentUser.transactionHistory || [];
    let accountBalance = currentUser.accountBalance || 10000; // Default initial balance

    // Function to save user data persistently
    const saveUserData = () => {
        localStorage.setItem("sbiUserData", JSON.stringify(allUsersData));
    };

    const saveTransactionHistory = (type, amount, toAccount = "") => {
        const transaction = {
            type,
            amount,
            toAccount,
            date: new Date().toLocaleString(),
        };
        transactionHistory.push(transaction);
        currentUser.transactionHistory = transactionHistory;
        saveUserData(); // Save updated user data
    };

    const loadUserDetails = () => {
        contentArea.innerHTML = `
            <h2>User Details</h2>
            <p><strong>Account Holder Name:</strong> ${currentUser.accountHolderName}</p>
            <p><strong>Account Number:</strong> ${currentUser.accountNumber}</p>
            <p><strong>Account Type:</strong> ${currentUser.accountType}</p>
            <p><strong>CIF Number:</strong> ${currentUser.cifNumber}</p>
            <p><strong>Branch Code:</strong> ${currentUser.branchCode}</p>
            <p><strong>Country:</strong> ${currentUser.country}</p>
            <p><strong>Mobile Number:</strong> ${currentUser.mobileNumber}</p>
            <p><strong>Current Balance:</strong> ₹${accountBalance}</p>
        `;
    };

    const loadWithdraw = () => {
        contentArea.innerHTML = `
            <h2>Withdraw</h2>
            <form id="withdrawForm">
                <label for="withdrawAmount">Enter amount to withdraw:</label><br>
                <input type="number" id="withdrawAmount" min="1" required><br><br>
                <button type="submit">Withdraw</button>
            </form>
        `;

        document.getElementById("withdrawForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const withdrawAmount = parseFloat(document.getElementById("withdrawAmount").value);
            if (withdrawAmount > accountBalance) {
                alert("Insufficient balance!");
            } else {
                accountBalance -= withdrawAmount;
                saveTransactionHistory("Withdrawal", withdrawAmount);
                currentUser.accountBalance = accountBalance;
                saveUserData();
                alert(`₹${withdrawAmount} withdrawn successfully!`);
                loadUserDetails();
            }
        });
    };

    const loadDeposit = () => {
        contentArea.innerHTML = `
            <h2>Deposit</h2>
            <form id="depositForm">
                <label for="depositAmount">Enter amount to deposit:</label><br>
                <input type="number" id="depositAmount" min="1" required><br><br>
                <button type="submit">Deposit</button>
            </form>
        `;

        document.getElementById("depositForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const depositAmount = parseFloat(document.getElementById("depositAmount").value);
            accountBalance += depositAmount;
            saveTransactionHistory("Deposit", depositAmount);
            currentUser.accountBalance = accountBalance;
            saveUserData();
            alert(`₹${depositAmount} deposited successfully!`);
            loadUserDetails();
        });
    };

    const loadSend = () => {
        contentArea.innerHTML = `
            <h2>Send Money</h2>
            <form id="sendForm">
                <label for="toAccount">Enter recipient's account number:</label><br>
                <input type="text" id="toAccount" required><br><br>
                <label for="sendAmount">Enter amount to send:</label><br>
                <input type="number" id="sendAmount" min="1" required><br><br>
                <button type="submit">Send</button>
            </form>
        `;

        document.getElementById("sendForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const toAccount = document.getElementById("toAccount").value.trim();
            const sendAmount = parseFloat(document.getElementById("sendAmount").value);
            if (sendAmount > accountBalance) {
                alert("Insufficient balance!");
            } else {
                accountBalance -= sendAmount;
                saveTransactionHistory("Send", sendAmount, toAccount);
                currentUser.accountBalance = accountBalance;
                saveUserData();
                alert(`₹${sendAmount} sent successfully to account ${toAccount}!`);
                loadUserDetails();
            }
        });
    };

    const loadTransactionHistory = () => {
        if (transactionHistory.length === 0) {
            contentArea.innerHTML = "<h2>Transaction History</h2><p>No transactions found.</p>";
            return;
        }
        contentArea.innerHTML = `
            <h2>Transaction History</h2>
            <table border="1" style="width: 100%; text-align: left;">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>To Account</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactionHistory
                        .map(
                            (txn) => `
                        <tr>
                            <td>${txn.date}</td>
                            <td>${txn.type}</td>
                            <td>₹${txn.amount}</td>
                            <td>${txn.toAccount || "N/A"}</td>
                        </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
        `;
    };

    // Attach menu link handlers
    document.getElementById("userDetailsLink").addEventListener("click", loadUserDetails);
    document.getElementById("withdrawLink").addEventListener("click", loadWithdraw);
    document.getElementById("depositLink").addEventListener("click", loadDeposit);
    document.getElementById("sendLink").addEventListener("click", loadSend);
    document.getElementById("transactionHistoryLink").addEventListener("click", loadTransactionHistory);

    // Load default content on page load
    loadUserDetails();
});
