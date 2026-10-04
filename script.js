import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";


// Firebase Configuration

const firebaseConfig = {
    apiKey: "AIzaSyCTAnu8HIWF3W3lf7-yGiQbnT8T8QbNo7o",
    authDomain: "vendor-management-system-11deb.firebaseapp.com",

    // IMPORTANT:
    // Replace this with your Firebase Realtime Database URL.
    databaseURL: "YOUR_REALTIME_DATABASE_URL",

    projectId: "vendor-management-system-11deb",
    storageBucket: "vendor-management-system-11deb.firebasestorage.app",
    messagingSenderId: "1082627447147",
    appId: "1:1082627447147:web:d535f47c763ac90948142e"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);

const vendorsRef = ref(database, "vendors");

let vendors = {};


// Load Vendors

onValue(vendorsRef, (snapshot) => {

    vendors = snapshot.val() || {};

    displayVendors();
    updateStatistics();
    displayContracts();

});


// Open Modal

window.openModal = function (vendor = null) {

    document.getElementById("vendorModal").classList.add("show");

    if (vendor) {

        document.getElementById("modalTitle").textContent = "Edit Vendor";

        document.getElementById("vendorId").value = vendor.id;
        document.getElementById("companyName").value = vendor.companyName || "";
        document.getElementById("contactPerson").value = vendor.contactPerson || "";
        document.getElementById("email").value = vendor.email || "";
        document.getElementById("phone").value = vendor.phone || "";
        document.getElementById("category").value = vendor.category || "";
        document.getElementById("service").value = vendor.service || "";
        document.getElementById("contractValue").value = vendor.contractValue || "";
        document.getElementById("contractExpiry").value = vendor.contractExpiry || "";
        document.getElementById("rating").value = vendor.rating || "5";
        document.getElementById("status").value = vendor.status || "Active";
        document.getElementById("details").value = vendor.details || "";

    } else {

        document.getElementById("modalTitle").textContent = "Add Vendor";

        document.getElementById("vendorForm").reset();

        document.getElementById("vendorId").value = "";

    }

};


// Close Modal

window.closeModal = function () {

    document.getElementById("vendorModal").classList.remove("show");

};


// Save Vendor

document.getElementById("vendorForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const vendorId = document.getElementById("vendorId").value;

    const vendorData = {

        companyName: document.getElementById("companyName").value.trim(),

        contactPerson: document.getElementById("contactPerson").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        category: document.getElementById("category").value,

        service: document.getElementById("service").value.trim(),

        contractValue: Number(
            document.getElementById("contractValue").value
        ),

        contractExpiry: document.getElementById("contractExpiry").value,

        rating: Number(
            document.getElementById("rating").value
        ),

        status: document.getElementById("status").value,

        details: document.getElementById("details").value.trim(),

        updatedAt: new Date().toISOString()

    };


    try {

        if (vendorId) {

            await update(
                ref(database, "vendors/" + vendorId),
                vendorData
            );

            showToast("Vendor updated successfully");

        } else {

            const newVendor = push(vendorsRef);

            vendorData.createdAt = new Date().toISOString();

            await set(newVendor, vendorData);

            showToast("Vendor added successfully");

        }

        closeModal();

    } catch (error) {

        console.error(error);

        showToast("Unable to save vendor");

    }

});


// Display Vendors

window.displayVendors = function () {

    const tableBody = document.getElementById("vendorTableBody");

    const searchText =
        document.getElementById("searchInput").value
        .toLowerCase()
        .trim();

    const category =
        document.getElementById("categoryFilter").value;

    const status =
        document.getElementById("statusFilter").value;


    const vendorList = Object.entries(vendors)

        .map(([id, vendor]) => ({
            id,
            ...vendor
        }))

        .filter(vendor => {

            const searchMatch =

                vendor.companyName?.toLowerCase().includes(searchText) ||

                vendor.contactPerson?.toLowerCase().includes(searchText) ||

                vendor.service?.toLowerCase().includes(searchText) ||

                vendor.email?.toLowerCase().includes(searchText);


            const categoryMatch =
                category === "all" ||
                vendor.category === category;


            const statusMatch =
                status === "all" ||
                vendor.status === status;


            return searchMatch && categoryMatch && statusMatch;

        });


    if (vendorList.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    No vendors found.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = vendorList.map(vendor => {

        const stars =
            "★".repeat(Number(vendor.rating || 0)) +
            "☆".repeat(5 - Number(vendor.rating || 0));


        return `

            <tr>

                <td>
                    <div class="vendor-name">
                        ${escapeHTML(vendor.companyName)}
                    </div>

                    <div class="contact">
                        ${escapeHTML(vendor.contactPerson)}
                    </div>
                </td>


                <td>
                    <span class="category">
                        ${escapeHTML(vendor.category)}
                    </span>
                </td>


                <td>
                    ${escapeHTML(vendor.service)}
                </td>


                <td>
                    ₹${Number(vendor.contractValue || 0).toLocaleString("en-IN")}
                </td>


                <td>
                    ${formatDate(vendor.contractExpiry)}
                </td>


                <td>
                    <span class="rating">
                        ${stars}
                    </span>
                </td>


                <td>

                    <span class="status ${
                        vendor.status === "Active"
                            ? "active"
                            : "inactive"
                    }">

                        ${escapeHTML(vendor.status)}

                    </span>

                </td>


                <td>

                    <button
                        class="action-btn edit-btn"
                        onclick='editVendor("${vendor.id}")'
                    >
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick='deleteVendor("${vendor.id}")'
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    }).join("");

};


// Edit Vendor

window.editVendor = function (id) {

    const vendor = vendors[id];

    if (!vendor) return;

    openModal({
        id,
        ...vendor
    });

};


// Delete Vendor

window.deleteVendor = async function (id) {

    const vendor = vendors[id];

    if (!vendor) return;


    const confirmed = confirm(
        `Delete "${vendor.companyName}"?`
    );


    if (!confirmed) return;


    try {

        await remove(
            ref(database, "vendors/" + id)
        );

        showToast("Vendor deleted successfully");

    } catch (error) {

        console.error(error);

        showToast("Unable to delete vendor");

    }

};


// Statistics

function updateStatistics() {

    const vendorList = Object.values(vendors);

    const total = vendorList.length;

    const active =
        vendorList.filter(
            vendor => vendor.status === "Active"
        ).length;

    const inactive =
        vendorList.filter(
            vendor => vendor.status === "Inactive"
        ).length;

    const totalValue =
        vendorList.reduce(
            (sum, vendor) =>
                sum + Number(vendor.contractValue || 0),
            0
        );


    document.getElementById("totalVendors").textContent = total;

    document.getElementById("activeVendors").textContent = active;

    document.getElementById("inactiveVendors").textContent = inactive;

    document.getElementById("totalValue").textContent =
        "₹" + totalValue.toLocaleString("en-IN");

}


// Contract Overview

function displayContracts() {

    const container =
        document.getElementById("contractOverview");


    const vendorList = Object.entries(vendors)

        .map(([id, vendor]) => ({
            id,
            ...vendor
        }))

        .filter(vendor => vendor.contractExpiry)

        .sort(
            (a, b) =>
                new Date(a.contractExpiry) -
                new Date(b.contractExpiry)
        );


    if (vendorList.length === 0) {

        container.innerHTML = `
            <p class="empty-message">
                No contract information available.
            </p>
        `;

        return;

    }


    container.innerHTML = vendorList.map(vendor => {

        const expiryDate =
            new Date(vendor.contractExpiry);

        const today = new Date();

        const difference =
            Math.ceil(
                (expiryDate - today) /
                (1000 * 60 * 60 * 24)
            );


        let className = "";

        if (difference < 0) {

            className = "expired";

        } else if (difference <= 30) {

            className = "warning";

        }


        return `

            <div class="contract-item">

                <div>

                    <div class="contract-name">
                        ${escapeHTML(vendor.companyName)}
                    </div>

                    <div class="contract-service">
                        ${escapeHTML(vendor.service)}
                    </div>

                </div>


                <div class="expiry ${className}">

                    <span>Contract Expiry</span>

                    <strong>
                        ${formatDate(vendor.contractExpiry)}
                    </strong>

                </div>

            </div>

        `;

    }).join("");

}


// Format Date

function formatDate(dateString) {

    if (!dateString) return "-";

    const date = new Date(dateString);

    if (isNaN(date)) return "-";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}


// Escape HTML

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// Toast Message

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// Close modal when clicking outside

document
    .getElementById("vendorModal")
    .addEventListener("click", function (event) {

        if (event.target === this) {

            closeModal();

        }

    });
