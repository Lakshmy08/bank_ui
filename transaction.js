document.addEventListener("DOMContentLoaded", async () => {
    const contentArea = document.getElementById("contentArea");
    const authToken = localStorage.getItem("authToken");

    // Function to redirect to login on authentication failure
    const redirectToLogin = (message = "Authentication failed. Please log in.") => {
        alert(message);
        localStorage.removeItem("authToken");
        window.location.href = "index.html";
    };

    // Fetch Wrapper with Better Error Handling
    const safeFetch = async (url, options = {}) => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    "Authorization": `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Fetch error to ${url}:`, error);
            throw error;
        }
    };

    // Validate authentication on page load
    if (!authToken) {
        redirectToLogin("No authentication token found.");
        return;
    }

    // Fetch User Data
    const fetchUserData = async () => {
        try {
            const data = await safeFetch("https://bank-back-ict4.onrender.com/balance");
            document.getElementById("greeting").innerHTML = `Welcome, ${data.accountHolderName}`;
            return data;
        } catch (error) {
            redirectToLogin(error.message);
            return null;
        }
    };

    let accountBalance = await fetchUserData();

    // Load User Details
    const loadUserDetails = async () => {
        try {
            const user = await safeFetch("https://bank-back-ict4.onrender.com/balance");

            contentArea.innerHTML = `
                <h2>User Details</h2>
                <p><strong>Account Holder Name:</strong> ${user.accountHolderName}</p>
                <p><strong>Account Number:</strong> ${user.accountNumber}</p>
                <p><strong>Account Type:</strong> ${user.accountType}</p>
                <p><strong>CIF Number:</strong> ${user.cifNumber}</p>
                <p><strong>Branch Code:</strong> ${user.branchCode}</p>
                <p><strong>Country:</strong> ${user.country}</p>
                <p><strong>Mobile Number:</strong> ${user.mobileNumber}</p>
                <p><strong>Current Balance:</strong> ₹${user.balance}</p>
            `;
        } catch (error) {
            contentArea.innerHTML = `<h2>Error Loading User Details</h2><p>${error.message}</p>`;
        }
    };

    // Load Withdraw Form
    const loadWithdraw = () => {
        contentArea.innerHTML = `
            <h2>Withdraw</h2>
            <form id="withdrawForm">
                <input type="number" id="withdrawAmount" min="1" required>
                <button type="submit">Withdraw</button>
            </form>
        `;

        document.getElementById("withdrawForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const withdrawButton = event.target.querySelector("button");
            withdrawButton.disabled = true;

            const amount = parseFloat(document.getElementById("withdrawAmount").value);
            try {
                const data = await safeFetch("https://bank-back-ict4.onrender.com/withdraw", {
                    method: "POST",
                    body: JSON.stringify({ amount })
                });
                alert("Withdrawal successful!");
                accountBalance = data.balance;
                loadUserDetails();
            } catch (error) {
                alert(error.message);
            } finally {
                withdrawButton.disabled = false;
            }
        });
    };

    // Load Deposit Form
    const loadDeposit = () => {
        contentArea.innerHTML = `
            <h2>Deposit</h2>
            <form id="depositForm">
                <input type="number" id="depositAmount" min="1" required>
                <button type="submit">Deposit</button>
            </form>
        `;

        document.getElementById("depositForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const depositButton = event.target.querySelector("button");
            depositButton.disabled = true;

            const amount = parseFloat(document.getElementById("depositAmount").value);
            try {
                const data = await safeFetch("https://bank-back-ict4.onrender.com/deposit", {
                    method: "POST",
                    body: JSON.stringify({ amount })
                });
                alert("Deposit successful!");
                accountBalance = data.balance;
                loadUserDetails();
            } catch (error) {
                alert(error.message);
            } finally {
                depositButton.disabled = false;
            }
        });
    };

    // Load Transaction History
    const loadTransactionHistory = async () => {
        try {
            const data = await safeFetch("https://bank-back-ict4.onrender.com/transactions");

            contentArea.innerHTML = `<h2>Transaction History</h2>`;
            data.transactions.forEach(txn => {
                contentArea.innerHTML += `<p>${txn.date} - ${txn.type} - ₹${txn.amount}</p>`;
            });
        } catch (error) {
            contentArea.innerHTML = `<h2>Error Loading Transactions</h2><p>${error.message}</p>`;
        }
    };

    // Load Transfer Funds Form
    const loadTransfer = () => {
        contentArea.innerHTML = `
            <h2>Transfer Funds</h2>
            <form id="transferForm">
                <label>Recipient Account Number:</label>
                <input type="text" id="recipientAccount" required><br><br>
                <label>Amount:</label>
                <input type="number" id="transferAmount" min="1" required><br><br>
                <button type="submit">Transfer</button>
            </form>
        `;

        document.getElementById("transferForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const transferButton = event.target.querySelector("button");
            transferButton.disabled = true;

            const recipientAccount = document.getElementById("recipientAccount").value.trim();
            const amount = parseFloat(document.getElementById("transferAmount").value);

            try {
                const data = await safeFetch("https://bank-back-ict4.onrender.com/transfer", {
                    method: "POST",
                    body: JSON.stringify({ accountNumber: recipientAccount, amount })
                });

                alert("Transfer successful!");
                accountBalance = data.senderBalance;
                loadUserDetails();
            } catch (error) {
                alert(error.message);
            } finally {
                transferButton.disabled = false;
            }
        });
    };

    // Navigation Event Listeners
    document.getElementById("userDetailsLink")?.addEventListener("click", loadUserDetails);
    document.getElementById("withdrawLink")?.addEventListener("click", loadWithdraw);
    document.getElementById("depositLink")?.addEventListener("click", loadDeposit);
    document.getElementById("transactionHistoryLink")?.addEventListener("click", loadTransactionHistory);
    document.getElementById("transferLink")?.addEventListener("click", loadTransfer);

    // Delete Account Feature
    document.getElementById("deleteAccount")?.addEventListener("click", async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone!")) return;

        try {
            await safeFetch("https://bank-back-ict4.onrender.com/delete-account", { method: "DELETE" });
            alert("Account deleted successfully.");
            localStorage.removeItem("authToken");
            window.location.href = "index.html";
        } catch (error) {
            alert("Account deletion failed: " + error.message);
        }
    });

    // Load User Details Initially
    loadUserDetails();
});
