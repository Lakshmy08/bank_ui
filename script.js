// Function to handle language selection
// function selectLanguage(language) {
//     alert(`You selected ${language}`);

//     const popup = document.getElementById("language-popup");
//     if (popup) popup.classList.add("hidden");

//     const main = document.getElementById("main");
//     if (main) main.classList.add("active");
// }

// // Function to toggle between Hindi and English
// function changeLanguage() {
//     var button = document.getElementById("b1");
//     if (button) {
//         button.innerHTML = button.innerHTML === "हिंदी" ? "English" : "हिंदी";
//     }
// }

// Function to toggle dropdown visibility
function toggleDropdown(button, dropdown) {
    if (!dropdown) return;

    // Close all other dropdowns before toggling the current one
    document.querySelectorAll(".dropdown-menu").forEach(menu => {
        if (menu !== dropdown) {
            menu.classList.remove("show");
        }
    });

    // Toggle the visibility of the clicked dropdown
    dropdown.classList.toggle("show");

    // Position the dropdown correctly relative to its trigger
    if (dropdown.classList.contains("show")) {
        const rect = button.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + window.scrollY - 80}px`; // Slightly above
        dropdown.style.left = `${rect.left + window.scrollX - 90}px`; // Align with button
    }
}

// Event listeners for navigation buttons
document.addEventListener("DOMContentLoaded", function () {
    const dropdownMappings = [
        { triggerId: "services-btn", dropdownId: "services-dropdown" },
        { triggerId: "faq-btn", dropdownId: "faq-dropdown" },
        { triggerId: "service", dropdownId: "service-dropdown" },
        { triggerId: "loan-dropdown-btn", dropdownId: "loan-dropdown" } // Added the Loan dropdown mapping
    ];

    dropdownMappings.forEach(({ triggerId, dropdownId }) => {
        const trigger = document.getElementById(triggerId);
        const dropdown = document.getElementById(dropdownId);

        if (trigger && dropdown) {
            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                toggleDropdown(trigger, dropdown);
            });
        }
    });

    // Close all dropdowns when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest("#nav2")) {
            document.querySelectorAll(".dropdown-menu").forEach(menu => {
                menu.classList.remove("show");
            });
        }
    });
});
// Get elements
const modal = document.getElementById("myModal");
const openModalLink = document.getElementById("openModalLink");
const closeBtn = document.querySelector(".close");
const cancelBtn = document.getElementById("cancelBtn");
const okBtn = document.getElementById("okBtn");

// Open modal when link is clicked
openModalLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    modal.style.display = "block";
});

// Close modal when 'X' is clicked
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when 'Cancel' button is clicked
cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when user clicks outside modal content
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Redirect to another page when 'OK' button is clicked
okBtn.addEventListener("click", () => {
    window.location.href = "register.html"; // Change to the desired URL
});
