// ========================================
// NAVENTRA ADMINISTRATOR DASHBOARD
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // ELEMENTS
    // ========================================

    var sidebar =
        document.getElementById("adminSidebar");

    var menuButton =
        document.getElementById("adminMenuBtn");

    var pageTitle =
        document.getElementById("adminPageTitle");

    var navLinks =
        document.querySelectorAll(".admin-nav-link");

    var sections =
        document.querySelectorAll(".admin-section");


    // ========================================
    // PAGE NAVIGATION
    // ========================================

    function showAdminPage(pageId, pageTitle) {

    console.log("ADMIN NAVIGATION:", pageId);

    var sections = document.querySelectorAll(".admin-section");

    sections.forEach(function(section) {

        section.classList.remove("active");

        section.style.setProperty(
            "display",
            "none",
            "important"
        );

    });


    var selectedSection =
        document.getElementById(pageId);

    if (selectedSection) {

        selectedSection.classList.add("active");

        selectedSection.style.setProperty(
            "display",
            "block",
            "important"
        );

        console.log(
            "Showing admin section:",
            selectedSection.id
        );

    } else {

        console.error(
            "Admin section NOT FOUND:",
            pageId
        );

    }


    var navLinks =
        document.querySelectorAll(".admin-nav-link");


    navLinks.forEach(function(link) {

        link.classList.remove("active");

    });


    var activeLink =
        document.querySelector(
            '.admin-nav-link[data-page="' +
            pageId +
            '"]'
        );


    if (activeLink) {

        activeLink.classList.add("active");

    }


    var titleElement =
        document.getElementById("adminPageTitle");


    if (titleElement) {

        titleElement.textContent =
            pageTitle || "Administration";

    }


    window.scrollTo(0, 0);

}

    // ========================================
    // SIDEBAR NAVIGATION
    // ========================================

    navLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                var pageId =
                    link.getAttribute("data-page");

                var title =
                    link.getAttribute("data-title");


                if (!pageId) {
                    return;
                }


                showAdminPage(
                    pageId,
                    title
                );

            }
        );

    });


    // ========================================
    // QUICK ACTIONS
    // ========================================

    var actionButtons =
        document.querySelectorAll(
            ".admin-action-card, " +
            ".admin-mini-stat, " +
            ".admin-view-all-btn"
        );


    actionButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                var pageId =
                    button.getAttribute("data-page");


                if (!pageId) {
                    return;
                }


                var matchingLink =
                    document.querySelector(
                        '.admin-nav-link[data-page="' +
                        pageId +
                        '"]'
                    );


                var title =
                    matchingLink
                        ? matchingLink.getAttribute("data-title")
                        : "Administration";


                showAdminPage(
                    pageId,
                    title
                );

            }
        );

    });


    // ========================================
    // MOBILE MENU
    // ========================================

    if (menuButton && sidebar) {

        menuButton.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle("open");

            }
        );

    }


    // ========================================
    // DARK MODE
    // ========================================

    function toggleDarkMode() {

        document.body.classList.toggle(
            "admin-dark-mode"
        );


        var isDark =
            document.body.classList.contains(
                "admin-dark-mode"
            );


        localStorage.setItem(
            "naventraAdminDarkMode",
            isDark
                ? "enabled"
                : "disabled"
        );

    }


    var savedDarkMode =
        localStorage.getItem(
            "naventraAdminDarkMode"
        );


    if (savedDarkMode === "enabled") {

        document.body.classList.add(
            "admin-dark-mode"
        );

    }


    var darkButtons =
        document.querySelectorAll(
            "#adminDarkModeBtn, #topDarkModeBtn"
        );


    darkButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            toggleDarkMode
        );

    });


    // ========================================
    // LOGOUT
    // ========================================

    var logoutButton =
        document.getElementById(
            "adminLogoutBtn"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async function () {

                var confirmed =
                    confirm(
                        "Are you sure you want to log out?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    var result =
                        await supabaseClient.auth.signOut();


                    if (result.error) {

                        console.error(
                            "Logout error:",
                            result.error
                        );

                        alert(
                            "Could not log out. Please try again."
                        );

                        return;

                    }


                    window.location.href =
                        "login.html";


                } catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                    alert(
                        "Something went wrong while logging out."
                    );

                }

            }
        );

    }


    // ========================================
    // NOTIFICATION BUTTONS
    // ========================================

    var notificationButtons =
        document.querySelectorAll(
            "#adminNotificationBtn, #topNotificationBtn"
        );


    notificationButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                showAdminPage(
                    "admin-dashboard",
                    "Administration"
                );


                alert(
                    "Notifications will be connected to the Administrator notification center."
                );

            }
        );

    });


    // ========================================
    // LOAD DASHBOARD DATA
    // ========================================

    loadAdminDashboardData();


    // ========================================
    // INITIAL PAGE
    // ========================================

    showAdminPage(
        "admin-dashboard",
        "Administration"
    );


    console.log(
        "Naventra Administrator Dashboard loaded successfully."
    );

});


// ========================================
// ADMIN DASHBOARD DATA
// ========================================

async function loadAdminDashboardData() {

    try {

        // ========================================
        // LOAD LOST & FOUND ITEMS
        // ========================================

        var itemsResult =
            await supabaseClient
                .from("lost_items")
                .select("*");


        if (itemsResult.error) {

            console.error(
                "Could not load Lost & Found items:",
                itemsResult.error
            );

        }


        var items =
            itemsResult.data || [];


        // ========================================
        // TOTAL ITEMS
        // ========================================

        var totalItems =
            items.length;


        var totalItemsElement =
            document.getElementById(
                "adminTotalItems"
            );


        if (totalItemsElement) {

            totalItemsElement.textContent =
                totalItems;

        }


        // ========================================
        // RETURNED ITEMS
        // ========================================

        var returnedItems =
            items.filter(function (item) {

                var status =
                    (
                        item.status || ""
                    )
                        .toLowerCase()
                        .trim();


                return (
                    status === "returned" ||
                    status === "collected"
                );

            });


        var returnedCount =
            returnedItems.length;


        var returnedElement =
            document.getElementById(
                "adminReturnedItems"
            );


        if (returnedElement) {

            returnedElement.textContent =
                returnedCount;

        }


        // ========================================
        // CATEGORY COUNTS
        // ========================================

        loadCategoryCounts(items);


        // ========================================
        // LOAD CLAIMS
        // ========================================

        var claimsResult =
            await supabaseClient
                .from("lost_found_claims")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (claimsResult.error) {

            console.error(
                "Could not load claims:",
                claimsResult.error
            );

        }


        var claims =
            claimsResult.data || [];


        // ========================================
        // TOTAL CLAIMS
        // ========================================

        var totalClaimsElement =
            document.getElementById(
                "adminTotalClaims"
            );


        if (totalClaimsElement) {

            totalClaimsElement.textContent =
                claims.length;

        }


        // ========================================
        // PENDING CLAIMS
        // ========================================

        var pendingClaims =
            claims.filter(function (claim) {

                var status =
                    (
                        claim.status || ""
                    )
                        .toLowerCase()
                        .trim();


                return (
                    status === "pending" ||
                    status === "pending verification" ||
                    status === "claim pending"
                );

            });


        var pendingClaimsElement =
            document.getElementById(
                "adminPendingClaims"
            );


        if (pendingClaimsElement) {

            pendingClaimsElement.textContent =
                pendingClaims.length;

        }


        // ========================================
        // RECOVERY RATE
        // ========================================

        var recoveryRate =
            totalItems > 0
                ? Math.round(
                    (
                        returnedCount /
                        totalItems
                    ) * 100
                )
                : 0;


        var recoveryElement =
            document.getElementById(
                "adminRecoveryRate"
            );


        if (recoveryElement) {

            recoveryElement.textContent =
                recoveryRate + "%";

        }


        // ========================================
        // RECENT CLAIMS
        // ========================================

        renderRecentClaims(claims);


        // ========================================
        // ANNOUNCEMENT COUNT
        // ========================================

        var announcementsResult =
            await supabaseClient
                .from("announcements")
                .select("id", {
                    count: "exact",
                    head: true
                });


        var announcementCount =
            announcementsResult.count || 0;


        var announcementElement =
            document.getElementById(
                "adminAnnouncementCount"
            );


        if (announcementElement) {

            announcementElement.textContent =
                announcementCount;

        }


        // ========================================
        // EVENT COUNT
        // ========================================

        var eventsResult =
            await supabaseClient
                .from("events")
                .select("id", {
                    count: "exact",
                    head: true
                });


        var eventCount =
            eventsResult.count || 0;


        var eventElement =
            document.getElementById(
                "adminEventCount"
            );


        if (eventElement) {

            eventElement.textContent =
                eventCount;

        }


        // ========================================
        // USER COUNT
        // ========================================

        var usersResult =
            await supabaseClient
                .from("profiles")
                .select("id", {
                    count: "exact",
                    head: true
                });


        var userCount =
            usersResult.count || 0;


        var userElement =
            document.getElementById(
                "adminUserCount"
            );


        if (userElement) {

            userElement.textContent =
                userCount;

        }


        console.log(
            "Admin dashboard data loaded successfully."
        );


    } catch (error) {

        console.error(
            "Admin dashboard loading error:",
            error
        );

    }

}


// ========================================
// CATEGORY COUNTS
// ========================================

function loadCategoryCounts(items) {

    var categoryList =
        document.getElementById(
            "adminCategoryList"
        );


    if (!categoryList) {
        return;
    }


    var categoryCounts = {};


    items.forEach(function (item) {

        var category =
            (
                item.category ||
                "Other"
            )
                .trim();


        if (!category) {
            category = "Other";
        }


        categoryCounts[category] =
            (
                categoryCounts[category] ||
                0
            ) + 1;

    });


    var categories =
        Object.keys(categoryCounts);


    if (!categories.length) {

        categoryList.innerHTML = `
            <div class="admin-empty">
                No Lost & Found data available yet.
            </div>
        `;

        return;
    }


    categories.sort(function (a, b) {

        return (
            categoryCounts[b] -
            categoryCounts[a]
        );

    });


    categoryList.innerHTML =
        categories
            .map(function (category) {

                var count =
                    categoryCounts[category];


                var percentage =
                    items.length > 0
                        ? Math.round(
                            (
                                count /
                                items.length
                            ) * 100
                        )
                        : 0;


                return `

                    <div class="admin-category-row">

                        <div class="admin-category-info">

                            <span>
                                ${category}
                            </span>

                            <strong>
                                ${count}
                            </strong>

                        </div>


                        <div class="admin-category-bar">

                            <div
                                class="admin-category-bar-fill"
                                style="width:${percentage}%"
                            ></div>

                        </div>


                        <small>
                            ${percentage}%
                        </small>

                    </div>

                `;

            })
            .join("");

}


// ========================================
// RECENT CLAIMS
// ========================================

function renderRecentClaims(claims) {

    var tableBody =
        document.getElementById(
            "adminRecentClaims"
        );


    if (!tableBody) {
        return;
    }


    if (!claims.length) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="admin-table-loading"
                >
                    No claims found.
                </td>

            </tr>

        `;

        return;
    }


    var recentClaims =
        claims.slice(0, 5);


    tableBody.innerHTML =
        recentClaims
            .map(function (claim) {

                var date =
                    claim.created_at
                        ? new Date(
                            claim.created_at
                        ).toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )
                        : "Unknown";


                var status =
                    claim.status ||
                    "Pending";


                var statusClass =
                    status
                        .toLowerCase()
                        .replace(
                            /\s+/g,
                            "-"
                        );


                return `

                    <tr>

                        <td>
                            ${claim.item_name || "Unnamed Item"}
                        </td>

                        <td>
                            ${claim.full_name || "Unknown"}
                        </td>

                        <td>
                            ${date}
                        </td>

                        <td>

                            <span
                                class="admin-claim-status ${statusClass}"
                            >
                                ${status}
                            </span>

                        </td>

                    </tr>

                `;

            })
            .join("");

}
// ========================================
// NAVENTRA ADMIN - LOST & FOUND
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var lostGrid =
            document.getElementById("adminLostGrid");

        if (!lostGrid) {
            return;
        }


        var searchInput =
            document.getElementById("adminLostSearch");

        var categoryFilter =
            document.getElementById("adminLostCategory");

        var statusFilter =
            document.getElementById("adminLostStatus");

        var countElement =
            document.getElementById("adminLostCount");


        var addButton =
            document.getElementById("adminAddLostItemBtn");

        var modal =
            document.getElementById("adminLostModal");

        var modalClose =
            document.getElementById("adminLostModalClose");

        var cancelButton =
            document.getElementById("adminLostCancelBtn");

        var form =
            document.getElementById("adminLostForm");


        var detailsModal =
            document.getElementById(
                "adminLostDetailsModal"
            );

        var detailsClose =
            document.getElementById(
                "adminLostDetailsClose"
            );

        var detailsContent =
            document.getElementById(
                "adminLostDetailsContent"
            );


        var modalTitle =
            document.getElementById(
                "adminLostModalTitle"
            );


        var adminLostItems = [];


        // ========================================
        // CHECK SUPABASE
        // ========================================

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {

            console.error(
                "Supabase client is not available."
            );

            lostGrid.innerHTML = `
                <div class="admin-lost-empty">

                    <div class="admin-lost-empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Supabase connection unavailable
                    </h3>

                    <p>
                        Please check your Supabase setup.
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // LOAD ITEMS
        // ========================================

        async function loadAdminLostItems() {

            lostGrid.innerHTML = `
                <div class="admin-loading">
                    Loading Lost & Found items...
                </div>
            `;


            try {

                var result =
                    await supabaseClient
                        .from("lost_items")
                        .select("*")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (result.error) {

                    console.error(
                        "ADMIN LOST & FOUND ERROR:",
                        result.error
                    );

                    throw result.error;

                }


                adminLostItems =
                    result.data || [];


                updateLostStatistics();

                renderAdminLostItems();


            } catch (error) {

                console.error(
                    "Could not load Lost & Found:",
                    error
                );

                lostGrid.innerHTML = `
                    <div class="admin-lost-empty">

                        <div class="admin-lost-empty-icon">
                            ⚠️
                        </div>

                        <h3>
                            Could not load items
                        </h3>

                        <p>
                            ${error.message || "Please try again."}
                        </p>

                    </div>
                `;

            }

        }


        // ========================================
        // STATISTICS
        // ========================================

        function updateLostStatistics() {

            var total =
                adminLostItems.length;


            var available =
                adminLostItems.filter(
                    function (item) {

                        var status =
                            String(
                                item.status || ""
                            )
                                .toLowerCase()
                                .trim();

                        return (
                            status === "found" ||
                            status === "available"
                        );

                    }
                ).length;


            var pending =
                adminLostItems.filter(
                    function (item) {

                        var status =
                            String(
                                item.status || ""
                            )
                                .toLowerCase()
                                .trim();

                        return (
                            status === "claim pending" ||
                            status === "pending" ||
                            status === "pending verification"
                        );

                    }
                ).length;


            var returned =
                adminLostItems.filter(
                    function (item) {

                        var status =
                            String(
                                item.status || ""
                            )
                                .toLowerCase()
                                .trim();

                        return (
                            status === "returned" ||
                            status === "collected"
                        );

                    }
                ).length;


            var totalElement =
                document.getElementById(
                    "adminLostTotal"
                );

            var availableElement =
                document.getElementById(
                    "adminLostAvailable"
                );

            var pendingElement =
                document.getElementById(
                    "adminLostPending"
                );

            var returnedElement =
                document.getElementById(
                    "adminLostReturned"
                );


            if (totalElement) {
                totalElement.textContent = total;
            }

            if (availableElement) {
                availableElement.textContent = available;
            }

            if (pendingElement) {
                pendingElement.textContent = pending;
            }

            if (returnedElement) {
                returnedElement.textContent = returned;
            }

        }


        // ========================================
        // CREATE CARD
        // ========================================

        function createAdminLostCard(item) {

            var status =
                item.status || "Found";


            var statusClass =
                String(status)
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            var imageHTML =
                item.image_url
                    ? `
                        <img
                            src="${item.image_url}"
                            alt="${item.item_name || "Found item"}"
                            class="admin-lost-image"
                        >
                    `
                    : `
                        <div class="admin-lost-image-placeholder">
                            📦
                        </div>
                    `;


            var foundDate =
                item.date_found
                    ? new Date(
                        item.date_found
                    ).toLocaleDateString(
                        undefined,
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "Unknown date";


            return `

                <article
                    class="admin-lost-card"
                >

                    <div class="admin-lost-image-wrap">

                        ${imageHTML}

                        <span
                            class="admin-lost-status ${statusClass}"
                        >
                            ${status}
                        </span>

                    </div>


                    <div class="admin-lost-content">

                        <span class="admin-lost-category">
                            ${item.category || "Other"}
                        </span>


                        <h3>
                            ${item.item_name || "Unnamed Item"}
                        </h3>


                        <p class="admin-lost-description">
                            ${
                                item.description ||
                                "No description provided."
                            }
                        </p>


                        <div class="admin-lost-meta">

                            <span>
                                📍
                                ${
                                    item.location_found ||
                                    "Unknown location"
                                }
                            </span>

                            <span>
                                📅
                                ${foundDate}
                            </span>

                        </div>


                        <div class="admin-lost-actions">

                            <button
                                type="button"
                                class="admin-lost-action-btn"
                                data-action="details"
                                data-item-id="${item.id}"
                            >
                                View Details
                            </button>


                            <button
                                type="button"
                                class="admin-lost-action-btn admin-lost-edit-btn"
                                data-action="edit"
                                data-item-id="${item.id}"
                            >
                                Edit
                            </button>


                            <button
                                type="button"
                                class="admin-lost-action-btn admin-lost-delete-btn"
                                data-action="delete"
                                data-item-id="${item.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </article>

            `;

        }


        // ========================================
        // RENDER
        // ========================================

        function renderAdminLostItems() {

            var searchTerm =
                searchInput
                    ? searchInput.value
                        .trim()
                        .toLowerCase()
                    : "";


            var selectedCategory =
                categoryFilter
                    ? categoryFilter.value
                    : "all";


            var selectedStatus =
                statusFilter
                    ? statusFilter.value
                    : "all";


            var filteredItems =
                adminLostItems.filter(
                    function (item) {

                        var searchableText = `

                            ${item.item_name || ""}

                            ${item.category || ""}

                            ${item.description || ""}

                            ${item.location_found || ""}

                            ${item.additional_notes || ""}

                        `.toLowerCase();


                        var matchesSearch =
                            !searchTerm ||
                            searchableText.includes(
                                searchTerm
                            );


                        var matchesCategory =
                            selectedCategory === "all" ||
                            String(
                                item.category || ""
                            ).toLowerCase() ===
                            selectedCategory.toLowerCase();


                        var matchesStatus =
                            selectedStatus === "all" ||
                            String(
                                item.status || ""
                            ).toLowerCase() ===
                            selectedStatus.toLowerCase();


                        return (
                            matchesSearch &&
                            matchesCategory &&
                            matchesStatus
                        );

                    }
                );


            if (countElement) {

                countElement.textContent =
                    filteredItems.length +
                    (
                        filteredItems.length === 1
                            ? " item"
                            : " items"
                    );

            }


            if (!filteredItems.length) {

                lostGrid.innerHTML = `

                    <div class="admin-lost-empty">

                        <div class="admin-lost-empty-icon">
                            📦
                        </div>

                        <h3>
                            No items found
                        </h3>

                        <p>
                            No Lost & Found items match your search or filters.
                        </p>

                    </div>

                `;

                return;
            }


            lostGrid.innerHTML =
                filteredItems
                    .map(createAdminLostCard)
                    .join("");

        }


        // ========================================
        // OPEN ADD MODAL
        // ========================================

        function openAddModal() {

            if (!modal || !form) {
                return;
            }


            form.reset();


            document.getElementById(
                "adminLostItemId"
            ).value = "";


            modalTitle.textContent =
                "Add Found Item";


            modal.classList.add("show");


            var dateInput =
                document.getElementById(
                    "adminLostDate"
                );


            if (dateInput) {

                dateInput.value =
                    new Date()
                        .toISOString()
                        .split("T")[0];

            }

        }


        // ========================================
        // OPEN EDIT MODAL
        // ========================================

        function openEditModal(item) {

            if (!modal || !form) {
                return;
            }


            document.getElementById(
                "adminLostItemId"
            ).value =
                item.id || "";


            document.getElementById(
                "adminLostItemName"
            ).value =
                item.item_name || "";


            document.getElementById(
                "adminLostItemCategory"
            ).value =
                item.category || "";


            document.getElementById(
                "adminLostLocation"
            ).value =
                item.location_found || "";


            document.getElementById(
                "adminLostDate"
            ).value =
                item.date_found || "";


            document.getElementById(
                "adminLostStatusInput"
            ).value =
                item.status || "Found";


            document.getElementById(
                "adminLostImage"
            ).value =
                item.image_url || "";


            document.getElementById(
                "adminLostDescription"
            ).value =
                item.description || "";


            document.getElementById(
                "adminLostNotes"
            ).value =
                item.additional_notes || "";


            modalTitle.textContent =
                "Edit Found Item";


            modal.classList.add("show");

        }


        // ========================================
        // CLOSE MODALS
        // ========================================

        function closeModal() {

            if (modal) {
                modal.classList.remove("show");
            }

        }


        function closeDetailsModal() {

            if (detailsModal) {
                detailsModal.classList.remove("show");
            }

        }


        // ========================================
        // SAVE ITEM
        // ========================================

        if (form) {

            form.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    var itemId =
                        document.getElementById(
                            "adminLostItemId"
                        ).value;


                    var itemData = {

                        item_name:
                            document.getElementById(
                                "adminLostItemName"
                            ).value.trim(),

                        category:
                            document.getElementById(
                                "adminLostItemCategory"
                            ).value,

                        location_found:
                            document.getElementById(
                                "adminLostLocation"
                            ).value.trim(),

                        date_found:
                            document.getElementById(
                                "adminLostDate"
                            ).value,

                        status:
                            document.getElementById(
                                "adminLostStatusInput"
                            ).value,

                        image_url:
                            document.getElementById(
                                "adminLostImage"
                            ).value.trim(),

                        description:
                            document.getElementById(
                                "adminLostDescription"
                            ).value.trim(),

                        additional_notes:
                            document.getElementById(
                                "adminLostNotes"
                            ).value.trim()

                    };
const { data: { user }, error: userError } =
    await supabaseClient.auth.getUser();

if (userError || !user) {
    alert("You must be logged in to add a Lost & Found item.");
    return;
}

itemData.uploaded_by = user.id;

                    try {

                        var result;


                        if (itemId) {

                            result =
                                await supabaseClient
                                    .from("lost_items")
                                    .update(itemData)
                                    .eq(
                                        "id",
                                        itemId
                                    );

                        } else {

                            result =
                                await supabaseClient
                                    .from("lost_items")
                                    .insert(
                                        itemData
                                    );

                        }


                        if (result.error) {

                            console.error(
                                "Could not save Lost & Found item:",
                                result.error
                            );

                            alert(
                                "Could not save the item: " +
                                result.error.message
                            );

                            return;

                        }


                        alert(
                            itemId
                                ? "Item updated successfully."
                                : "Item added successfully."
                        );


                        closeModal();

                        await loadAdminLostItems();


                    } catch (error) {

                        console.error(
                            "Save Lost & Found error:",
                            error
                        );

                        alert(
                            "Something went wrong while saving the item."
                        );

                    }

                }
            );

        }


        // ========================================
        // CARD ACTIONS
        // ========================================

        lostGrid.addEventListener(
            "click",
            async function (event) {

                var button =
                    event.target.closest(
                        "button[data-action]"
                    );


                if (!button) {
                    return;
                }


                var itemId =
                    button.getAttribute(
                        "data-item-id"
                    );


                var action =
                    button.getAttribute(
                        "data-action"
                    );


                var item =
                    adminLostItems.find(
                        function (currentItem) {

                            return String(
                                currentItem.id
                            ) === String(itemId);

                        }
                    );


                if (!item) {
                    return;
                }


                // DETAILS

                if (action === "details") {

                    showItemDetails(item);

                }


                // EDIT

                if (action === "edit") {

                    openEditModal(item);

                }


                // DELETE

                if (action === "delete") {

                    var confirmed =
                        confirm(
                            "Are you sure you want to delete this Lost & Found item?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    try {

                        var result =
                            await supabaseClient
                                .from("lost_items")
                                .delete()
                                .eq(
                                    "id",
                                    itemId
                                );


                        if (result.error) {

                            console.error(
                                "Delete item error:",
                                result.error
                            );

                            alert(
                                "Could not delete item: " +
                                result.error.message
                            );

                            return;

                        }


                        await loadAdminLostItems();


                    } catch (error) {

                        console.error(
                            "Delete item error:",
                            error
                        );

                        alert(
                            "Something went wrong while deleting the item."
                        );

                    }

                }

            }
        );


        // ========================================
        // DETAILS
        // ========================================

        function showItemDetails(item) {

            if (!detailsModal || !detailsContent) {
                return;
            }


            var foundDate =
                item.date_found
                    ? new Date(
                        item.date_found
                    ).toLocaleDateString()
                    : "Unknown";


            var image =
                item.image_url
                    ? `
                        <img
                            src="${item.image_url}"
                            class="admin-detail-image"
                            alt="Found item"
                        >
                    `
                    : "";


            detailsContent.innerHTML = `

                ${image}

                <div class="admin-detail-grid">

                    <div class="admin-detail-item">
                        <small>Item</small>
                        <strong>
                            ${item.item_name || "Unnamed"}
                        </strong>
                    </div>

                    <div class="admin-detail-item">
                        <small>Category</small>
                        <strong>
                            ${item.category || "Other"}
                        </strong>
                    </div>

                    <div class="admin-detail-item">
                        <small>Location Found</small>
                        <strong>
                            ${item.location_found || "Unknown"}
                        </strong>
                    </div>

                    <div class="admin-detail-item">
                        <small>Date Found</small>
                        <strong>
                            ${foundDate}
                        </strong>
                    </div>

                    <div class="admin-detail-item">
                        <small>Status</small>
                        <strong>
                            ${item.status || "Found"}
                        </strong>
                    </div>

                    <div class="admin-detail-item">
                        <small>Reported By</small>
                        <strong>
                            ${
                                item.uploaded_by ||
                                item.created_by ||
                                "School Staff"
                            }
                        </strong>
                    </div>

                </div>


                <div class="admin-detail-item" style="margin-top:14px;">

                    <small>
                        Description
                    </small>

                    <strong>
                        ${
                            item.description ||
                            "No description provided."
                        }
                    </strong>

                </div>


                ${
                    item.additional_notes
                        ? `
                            <div
                                class="admin-detail-item"
                                style="margin-top:14px;"
                            >

                                <small>
                                    Additional Notes
                                </small>

                                <strong>
                                    ${item.additional_notes}
                                </strong>

                            </div>
                        `
                        : ""
                }

            `;


            detailsModal.classList.add("show");

        }


        // ========================================
        // BUTTON EVENTS
        // ========================================

        if (addButton) {

            addButton.addEventListener(
                "click",
                openAddModal
            );

        }


        if (modalClose) {

            modalClose.addEventListener(
                "click",
                closeModal
            );

        }


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                closeModal
            );

        }


        if (detailsClose) {

            detailsClose.addEventListener(
                "click",
                closeDetailsModal
            );

        }


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderAdminLostItems
            );

        }


        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                renderAdminLostItems
            );

        }


        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                renderAdminLostItems
            );

        }


        // Close when clicking outside modal

        [modal, detailsModal].forEach(
            function (currentModal) {

                if (!currentModal) {
                    return;
                }


                currentModal.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target ===
                            currentModal
                        ) {

                            currentModal.classList.remove(
                                "show"
                            );

                        }

                    }
                );

            }
        );


        // ========================================
        // START
        // ========================================

        loadAdminLostItems();

    }
);
// ========================================
// NAVENTRA ADMIN - CLAIM MANAGEMENT
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var claimsList =
            document.getElementById(
                "adminClaimsList"
            );

        if (!claimsList) {
            return;
        }


        var claimsCount =
            document.getElementById(
                "adminClaimsCount"
            );

        var pendingCount =
            document.getElementById(
                "adminPendingClaimCount"
            );

        var approvedCount =
            document.getElementById(
                "adminApprovedClaimCount"
            );

        var returnedCount =
            document.getElementById(
                "adminReturnedClaimCount"
            );


        var claimTabs =
            document.querySelectorAll(
                ".admin-claim-tab"
            );


        var adminClaims = [];

        var currentClaimFilter = "all";


        // ========================================
        // STATUS NORMALIZER
        // ========================================

        function normalizeStatus(status) {

            var value =
                String(
                    status || ""
                )
                    .toLowerCase()
                    .trim();

            if (
                value === "pending" ||
                value === "claim pending" ||
                value === "pending verification"
            ) {
                return "pending";
            }

            if (
                value === "more info needed" ||
                value === "more_info_needed"
            ) {
                return "more info needed";
            }

            if (value === "approved") {
                return "approved";
            }

            if (value === "rejected") {
                return "rejected";
            }

            if (value === "returned") {
                return "returned";
            }

            return value;
        }


        // ========================================
        // STATUS LABEL
        // ========================================

        function getStatusLabel(status) {

            var normalized =
                normalizeStatus(status);

            if (normalized === "pending") {
                return "Pending Verification";
            }

            if (
                normalized === "more info needed"
            ) {
                return "More Info Needed";
            }

            if (normalized === "approved") {
                return "Approved";
            }

            if (normalized === "rejected") {
                return "Rejected";
            }

            if (normalized === "returned") {
                return "Returned";
            }

            return status || "Pending Verification";

        }


        // ========================================
        // STATUS CLASS
        // ========================================

        function getStatusClass(status) {

            return getStatusLabel(status)
                .toLowerCase()
                .replace(/\s+/g, "-");

        }


        // ========================================
        // DATE
        // ========================================

        function formatDate(value) {

            if (!value) {
                return "Unknown date";
            }

            var date =
                new Date(value);

            if (
                isNaN(
                    date.getTime()
                )
            ) {
                return "Unknown date";
            }

            return date.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

        }


        // ========================================
        // LOAD CLAIMS
        // ========================================

        async function loadAdminClaims() {

            claimsList.innerHTML = `
                <div class="admin-loading">
                    Loading claims...
                </div>
            `;


            try {

                var result =
                    await supabaseClient
                        .from("lost_found_claims")
                        .select("*")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (result.error) {

                    console.error(
                        "ADMIN CLAIMS ERROR:",
                        result.error
                    );

                    claimsList.innerHTML = `
                        <div class="admin-claims-empty">

                            <div class="admin-claims-empty-icon">
                                ⚠️
                            </div>

                            <h3>
                                Could not load claims
                            </h3>

                            <p>
                                ${result.error.message}
                            </p>

                        </div>
                    `;

                    return;
                }


                adminClaims =
                    result.data || [];


                updateSummary();

                renderAdminClaims();


            } catch (error) {

                console.error(
                    "ADMIN CLAIMS ERROR:",
                    error
                );

                claimsList.innerHTML = `
                    <div class="admin-claims-empty">

                        <div class="admin-claims-empty-icon">
                            ⚠️
                        </div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            ${error.message || "Unable to load claims."}
                        </p>

                    </div>
                `;

            }

        }


        // ========================================
        // SUMMARY
        // ========================================

        function updateSummary() {

            var pending =
                adminClaims.filter(
                    function (claim) {
                        return (
                            normalizeStatus(
                                claim.status
                            ) === "pending"
                        );
                    }
                ).length;


            var approved =
                adminClaims.filter(
                    function (claim) {
                        return (
                            normalizeStatus(
                                claim.status
                            ) === "approved"
                        );
                    }
                ).length;


            var returned =
                adminClaims.filter(
                    function (claim) {
                        return (
                            normalizeStatus(
                                claim.status
                            ) === "returned"
                        );
                    }
                ).length;


            if (pendingCount) {
                pendingCount.textContent =
                    pending;
            }

            if (approvedCount) {
                approvedCount.textContent =
                    approved;
            }

            if (returnedCount) {
                returnedCount.textContent =
                    returned;
            }

        }


        // ========================================
        // FILTER
        // ========================================

        function getFilteredClaims() {

            return adminClaims.filter(
                function (claim) {

                    if (
                        currentClaimFilter ===
                        "all"
                    ) {
                        return true;
                    }


                    var status =
                        normalizeStatus(
                            claim.status
                        );


                    if (
                        currentClaimFilter ===
                        "pending"
                    ) {
                        return status === "pending";
                    }


                    return (
                        status ===
                        currentClaimFilter
                    );

                }
            );

        }


        // ========================================
        // RENDER
        // ========================================

        function renderAdminClaims() {

            var filteredClaims =
                getFilteredClaims();


            if (claimsCount) {

                claimsCount.textContent =
                    filteredClaims.length;

            }


            if (!filteredClaims.length) {

                claimsList.innerHTML = `

                    <div class="admin-claims-empty">

                        <div class="admin-claims-empty-icon">
                            📋
                        </div>

                        <h3>
                            No claims found
                        </h3>

                        <p>
                            There are no claims matching this filter.
                        </p>

                    </div>

                `;

                return;
            }


            claimsList.innerHTML =
                filteredClaims
                    .map(
                        createClaimCard
                    )
                    .join("");

        }


        // ========================================
        // CREATE CARD
        // ========================================

        function createClaimCard(claim) {

            var status =
                getStatusLabel(
                    claim.status
                );


            var statusClass =
                getStatusClass(
                    claim.status
                );


            var normalized =
                normalizeStatus(
                    claim.status
                );


            var actionsHTML = "";


            // ------------------------------------
            // PENDING
            // ------------------------------------

            if (
                normalized === "pending"
            ) {

                actionsHTML = `

                    <button
                        type="button"
                        class="admin-claim-action approve"
                        data-claim-action="approved"
                        data-claim-id="${claim.id}"
                    >
                        ✓ Approve
                    </button>

                    <button
                        type="button"
                        class="admin-claim-action reject"
                        data-claim-action="rejected"
                        data-claim-id="${claim.id}"
                    >
                        ✕ Reject
                    </button>

                    <button
                        type="button"
                        class="admin-claim-action more-info"
                        data-claim-action="more info needed"
                        data-claim-id="${claim.id}"
                    >
                        📝 More Info
                    </button>

                `;

            }


            // ------------------------------------
            // MORE INFO
            // ------------------------------------

            if (
                normalized === "more info needed"
            ) {

                actionsHTML = `

                    <button
                        type="button"
                        class="admin-claim-action approve"
                        data-claim-action="approved"
                        data-claim-id="${claim.id}"
                    >
                        ✓ Approve
                    </button>

                    <button
                        type="button"
                        class="admin-claim-action reject"
                        data-claim-action="rejected"
                        data-claim-id="${claim.id}"
                    >
                        ✕ Reject
                    </button>

                `;

            }


            // ------------------------------------
            // APPROVED
            // ------------------------------------

            if (
                normalized === "approved"
            ) {

                actionsHTML = `

                    <button
                        type="button"
                        class="admin-claim-action return"
                        data-claim-action="returned"
                        data-claim-id="${claim.id}"
                    >
                        📦 Mark Returned
                    </button>

                `;

            }


            return `

                <article class="admin-claim-card">

                    <div class="admin-claim-card-top">

                        <div class="admin-claim-item">

                            <div class="admin-claim-item-icon">
                                📦
                            </div>

                            <div>

                                <h3>
                                    ${
                                        claim.item_name ||
                                        "Unnamed Item"
                                    }
                                </h3>

                                <span>
                                    Claim submitted
                                    ${formatDate(
                                        claim.created_at
                                    )}
                                </span>

                            </div>

                        </div>


                        <span
                            class="admin-claim-badge ${statusClass}"
                        >
                            ${status}
                        </span>

                    </div>


                    <div class="admin-claim-details">

                        <div class="admin-claim-detail">

                            <span class="admin-claim-detail-label">
                                Student
                            </span>

                            <span class="admin-claim-detail-value">
                                ${
                                    claim.full_name ||
                                    "Unknown"
                                }
                            </span>

                        </div>


                        <div class="admin-claim-detail">

                            <span class="admin-claim-detail-label">
                                Class
                            </span>

                            <span class="admin-claim-detail-value">
                                ${
                                    claim.class ||
                                    "Not provided"
                                }
                            </span>

                        </div>


                        <div class="admin-claim-detail">

                            <span class="admin-claim-detail-label">
                                Contact
                            </span>

                            <span class="admin-claim-detail-value">
                                ${
                                    claim.contact_info ||
                                    "Not provided"
                                }
                            </span>

                        </div>

                    </div>


                    <div class="admin-claim-reason">

                        <span class="admin-claim-reason-label">
                            Claim Reason
                        </span>

                        <p>
                            ${
                                claim.reason ||
                                "No reason provided."
                            }
                        </p>

                    </div>


                    ${
                        actionsHTML
                            ? `
                                <div class="admin-claim-actions">
                                    ${actionsHTML}
                                </div>
                            `
                            : ""
                    }

                </article>

            `;

        }


        // ========================================
        // TAB EVENTS
        // ========================================

        claimTabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        claimTabs.forEach(
                            function (button) {

                                button.classList.remove(
                                    "active"
                                );

                            }
                        );


                        tab.classList.add(
                            "active"
                        );


                        currentClaimFilter =
                            tab.getAttribute(
                                "data-claim-filter"
                            ) || "all";


                        renderAdminClaims();

                    }
                );

            }
        );


        // ========================================
        // CLAIM ACTIONS
        // ========================================

        claimsList.addEventListener(
            "click",
            async function (event) {

                var button =
                    event.target.closest(
                        "[data-claim-action]"
                    );


                if (!button) {
                    return;
                }


                var claimId =
                    button.getAttribute(
                        "data-claim-id"
                    );


                var newStatus =
                    button.getAttribute(
                        "data-claim-action"
                    );


                if (
                    !claimId ||
                    !newStatus
                ) {
                    return;
                }


                var label =
                    getStatusLabel(
                        newStatus
                    );


                var confirmed =
                    confirm(
                        "Change this claim to " +
                        label +
                        "?"
                    );


                if (!confirmed) {
                    return;
                }


                button.disabled = true;


                try {

                    var result =
                        await supabaseClient
                            .from(
                                "lost_found_claims"
                            )
                            .update({
                                status: newStatus
                            })
                            .eq(
                                "id",
                                claimId
                            )
                            .select();


                    if (result.error) {

                        console.error(
                            "CLAIM UPDATE ERROR:",
                            result.error
                        );

                        alert(
                            "Could not update the claim: " +
                            result.error.message
                        );

                        button.disabled = false;

                        return;
                    }


                    if (
                        !result.data ||
                        result.data.length === 0
                    ) {

                        alert(
                            "The claim was not updated. Please check the administrator permissions."
                        );

                        button.disabled = false;

                        return;
                    }


                    alert(
                        "Claim updated successfully."
                    );


                    await loadAdminClaims();

                } catch (error) {

                    console.error(
                        "CLAIM UPDATE ERROR:",
                        error
                    );

                    alert(
                        "Something went wrong while updating the claim."
                    );

                    button.disabled = false;

                }

            }
        );


        // ========================================
        // START
        // ========================================

        loadAdminClaims();

    }
);
// ========================================
// NAVENTRA ADMIN - USER MANAGEMENT
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    var usersTableBody =
        document.getElementById("adminUsersTableBody");

    if (!usersTableBody) {
        return;
    }

    var searchInput =
        document.getElementById("adminUserSearch");

    var roleFilter =
        document.getElementById("adminUserRole");

    var usersCount =
        document.getElementById("adminUsersCount");

    var inviteButton =
        document.getElementById("adminInviteUserBtn");

    var adminUsers = [];


    // ========================================
    // LOAD USERS
    // ========================================

    async function loadAdminUsers() {

        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="admin-table-loading">
                    Loading users...
                </td>
            </tr>
        `;

        try {

            var result =
                await supabaseClient
                    .from("profiles")
                    .select("*")
                    .order("created_at", {
                        ascending: false
                    });


            if (result.error) {

                console.error(
                    "ADMIN USERS ERROR:",
                    result.error
                );

                usersTableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="admin-table-loading">
                            Could not load users.
                        </td>
                    </tr>
                `;

                return;
            }


            adminUsers = result.data || [];

            renderAdminUsers();


        } catch (error) {

            console.error(
                "USER MANAGEMENT ERROR:",
                error
            );

            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-table-loading">
                        Something went wrong while loading users.
                    </td>
                </tr>
            `;

        }

    }


    // ========================================
    // RENDER USERS
    // ========================================

    function renderAdminUsers() {

        var searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        var selectedRole =
            roleFilter
                ? roleFilter.value
                : "all";


        var filteredUsers =
            adminUsers.filter(function (user) {

                var name =
                    (user.full_name || "")
                        .toLowerCase();

                var email =
                    (user.email || "")
                        .toLowerCase();

                var role =
                    (user.role || "")
                        .toLowerCase();


                var matchesSearch =
                    !searchTerm ||
                    name.includes(searchTerm) ||
                    email.includes(searchTerm);


                var matchesRole =
                    selectedRole === "all" ||
                    role === selectedRole;


                return (
                    matchesSearch &&
                    matchesRole
                );

            });


        if (usersCount) {

            usersCount.textContent =
                filteredUsers.length;

        }


        if (!filteredUsers.length) {

            usersTableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="admin-table-loading">
                        No users found.
                    </td>
                </tr>
            `;

            return;

        }


        usersTableBody.innerHTML =
            filteredUsers.map(function (user) {

                var role =
                    (user.role || "student")
                        .toLowerCase();


                var roleLabel =
                    role === "admin"
                        ? "Administrator"
                        : role.charAt(0).toUpperCase() +
                          role.slice(1);


                return `

                    <tr>

                        <td>

                            <div class="admin-user-name">

                                <div class="admin-user-avatar">
                                    ${
                                        (user.full_name || "U")
                                            .charAt(0)
                                            .toUpperCase()
                                    }
                                </div>

                                <strong>
                                    ${
                                        user.full_name ||
                                        "Unnamed User"
                                    }
                                </strong>

                            </div>

                        </td>


                        <td>
                            ${user.email || "Not available"}
                        </td>


                        <td>

                            <span class="admin-user-role ${role}">
                                ${roleLabel}
                            </span>

                        </td>


                        <td>
                            ${roleLabel}
                        </td>


                        <td>

                            <button
                                type="button"
                                class="admin-user-action"
                                data-user-id="${user.id}"
                            >
                                View
                            </button>

                        </td>

                    </tr>

                `;

            }).join("");

    }


    // ========================================
    // SEARCH
    // ========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderAdminUsers
        );

    }


    // ========================================
    // ROLE FILTER
    // ========================================

    if (roleFilter) {

        roleFilter.addEventListener(
            "change",
            renderAdminUsers
        );

    }


   // ========================================
// INVITE USER MODAL
// ========================================

var inviteModal =
    document.getElementById("adminInviteModal");

var inviteForm =
    document.getElementById("adminInviteForm");

var inviteClose =
    document.getElementById("adminInviteClose");

var inviteCancel =
    document.getElementById("adminInviteCancel");


function closeInviteModal() {

    if (inviteModal) {

        inviteModal.classList.remove("show");

    }

}


if (inviteButton && inviteModal) {

    inviteButton.addEventListener(
        "click",
        function () {

            inviteModal.classList.add("show");

        }
    );

}


if (inviteClose) {

    inviteClose.addEventListener(
        "click",
        closeInviteModal
    );

}


if (inviteCancel) {

    inviteCancel.addEventListener(
        "click",
        closeInviteModal
    );

}


if (inviteModal) {

    inviteModal.addEventListener(
        "click",
        function (event) {

            if (event.target === inviteModal) {

                closeInviteModal();

            }

        }
    );

}


// ========================================
// SUBMIT INVITATION
// ========================================

if (inviteForm) {

    inviteForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            var fullName =
                document.getElementById(
                    "inviteFullName"
                ).value.trim();


            var email =
                document.getElementById(
                    "inviteEmail"
                ).value.trim();


            var role =
                document.getElementById(
                    "inviteRole"
                ).value;


            if (!fullName || !email || !role) {

                alert(
                    "Please complete all fields."
                );

                return;

            }


            try {

                var {
                    data: {
                        user
                    }
                } =
                    await supabaseClient.auth.getUser();


                if (!user) {

                    alert(
                        "Your administrator session could not be verified."
                    );

                    return;

                }


                var result =
                    await supabaseClient
                        .from("user_invitations")
                        .insert({
                            full_name: fullName,
                            email: email,
                            role: role,
                            status: "pending",
                            invited_by: user.id
                        });


                if (result.error) {

                    console.error(
                        "INVITATION ERROR:",
                        result.error
                    );

                    alert(
                        "Could not create invitation: " +
                        result.error.message
                    );

                    return;

                }


                alert(
                    "Invitation created successfully."
                );


                inviteForm.reset();

                closeInviteModal();


            } catch (error) {

                console.error(
                    "INVITATION ERROR:",
                    error
                );

                alert(
                    "Something went wrong while creating the invitation."
                );

            }

        }
    );

}


    // ========================================
    // START
    // ========================================

    loadAdminUsers();

});

// ========================================
// NAVENTRA ADMIN - ANNOUNCEMENTS
// FINAL VERSION
// ========================================

(function () {

    function initAdminAnnouncements() {

        console.log("📢 Announcement JS initialized");

        // ========================================
        // ELEMENTS
        // ========================================

        var list =
            document.getElementById("adminAnnouncementsList");

        var count =
            document.getElementById("adminAnnouncementsCount");

        var search =
            document.getElementById("adminAnnouncementSearch");

        var filter =
            document.getElementById("adminAnnouncementFilter");

        var createButton = document.getElementById(
    "admin-create-announcement-button"
);

        var modal =
            document.getElementById("adminAnnouncementModal");

        var closeButton = document.getElementById(
    "admin-create-announcement-button-close"
);
        var cancelBtn =
            document.getElementById("adminCancelAnnouncementBtn");

        var form =
            document.getElementById("adminAnnouncementForm");

        var modalTitle =
            document.getElementById("adminAnnouncementModalTitle");

        var idInput =
            document.getElementById("adminAnnouncementId");

        var titleInput =
            document.getElementById("adminAnnouncementTitle");

        var contentInput =
            document.getElementById("adminAnnouncementContent");

        var categoryInput =
            document.getElementById("adminAnnouncementCategory");

        var priorityInput =
            document.getElementById("adminAnnouncementPriority");

        var audienceInput =
            document.getElementById("adminAnnouncementAudience");

        var expiresInput =
            document.getElementById("adminAnnouncementExpires");

        var publishedInput =
            document.getElementById("adminAnnouncementPublished");

        var attachmentInput =
            document.getElementById("adminAnnouncementAttachment");


        // ========================================
        // CHECK HTML
        // ========================================

        if (!list) {
            console.error(
                "❌ adminAnnouncementsList was NOT found."
            );
            return;
        }

        console.log("✅ Announcement HTML found");


        var announcements = [];

window.adminAnnouncements = announcements;


        // ========================================
        // LOAD
        // ========================================

        async function loadAnnouncements() {

            list.innerHTML = `
                <div class="admin-loading">
                    Loading announcements...
                </div>
            `;

            try {

                var result =
                    await supabaseClient
                        .from("announcements")
                        .select("*")
                        .order("created_at", {
                            ascending: false
                        });


                if (result.error) {

                    console.error(
                        "❌ ANNOUNCEMENTS LOAD ERROR:",
                        result.error
                    );

                    list.innerHTML = `
                        <div class="admin-claims-empty">
                            <h3>Could not load announcements</h3>
                            <p>${result.error.message}</p>
                        </div>
                    `;

                    return;
                }


                announcements =
    result.data || [];
    window.adminAnnouncements =
    announcements;



                renderAnnouncements();


            } catch (error) {

                console.error(
                    "❌ ANNOUNCEMENTS ERROR:",
                    error
                );

                list.innerHTML = `
                    <div class="admin-claims-empty">
                        <h3>Something went wrong</h3>
                        <p>${error.message}</p>
                    </div>
                `;

            }

        }


        //========================================
        // RENDER
        // ========================================

        function renderAnnouncements() {

            var searchText =
                search
                    ? search.value.trim().toLowerCase()
                    : "";

            var selectedFilter =
                filter
                    ? filter.value
                    : "all";


            var filtered =
                announcements.filter(function (item) {

                    var text = (
                        (item.title || "") +
                        " " +
                        (item.content || "") +
                        " " +
                        (item.category || "")
                    ).toLowerCase();


                    var matchesSearch =
                        !searchText ||
                        text.includes(searchText);


                    var matchesFilter = true;


                    if (
                        selectedFilter === "published"
                    ) {

                        matchesFilter =
                            item.is_published === true;

                    }


                    if (
                        selectedFilter === "draft"
                    ) {

                        matchesFilter =
                            item.is_published !== true;

                    }


                    return (
                        matchesSearch &&
                        matchesFilter
                    );

                });


            if (count) {
                count.textContent =
                    filtered.length;
            }


            if (!filtered.length) {

                list.innerHTML = `
                    <div class="admin-claims-empty">

                        <div class="admin-claims-empty-icon">
                            📢
                        </div>

                        <h3>
                            No announcements found
                        </h3>

                        <p>
                            Create your first school announcement.
                        </p>

                    </div>
                `;

                return;
            }


            list.innerHTML =
                filtered
                    .map(createAnnouncementCard)
                    .join("");

        }


        // ========================================
        // CARD
        // ========================================

        function createAnnouncementCard(item) {

            var status =
                item.is_published
                    ? "Published"
                    : "Draft";


            var category =
                item.category ||
                "General";


            var priority =
                item.priority ||
                "normal";


            var audience =
                item.target_audience ||
                "everyone";


            var date =
                item.created_at
                    ? new Date(
                        item.created_at
                    ).toLocaleDateString(
                        undefined,
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "Unknown date";


            return `

                <article class="admin-announcement-card">

                    <div class="admin-announcement-card-top">

                        <div>

                            <span class="admin-announcement-category">
                                ${category}
                            </span>

                            <h3>
                                ${item.title || "Untitled Announcement"}
                            </h3>

                        </div>

                        <span class="admin-announcement-status ${status.toLowerCase()}">
                            ${status}
                        </span>

                    </div>


                    <p class="admin-announcement-content">
                        ${item.content || "No content provided."}
                    </p>


                    <div class="admin-announcement-meta">

                        <span>
                            🎯 ${audience}
                        </span>

                        <span>
                            ⚡ ${priority}
                        </span>

                        <span>
                            📅 ${date}
                        </span>

                    </div>


                    <div class="admin-announcement-actions">

                        <button
                            type="button"
                            class="admin-announcement-edit"
                            data-announcement-action="edit"
                            data-announcement-id="${item.id}"
                        >
                            ✏️ Edit
                        </button>


                        <button
                            type="button"
                            class="admin-announcement-toggle"
                            data-announcement-action="toggle"
                            data-announcement-id="${item.id}"
                        >
                            ${
                                item.is_published
                                    ? "🚫 Unpublish"
                                    : "📢 Publish"
                            }
                        </button>


                        <button
                            type="button"
                            class="admin-announcement-delete"
                            data-announcement-action="delete"
                            data-announcement-id="${item.id}"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </article>

            `;

        }


        // ========================================
        // CREATE MODAL
        // ========================================

        function openCreateModal() {

    console.log("🟢 CREATE ANNOUNCEMENT CLICKED");

    if (!modal) {
        console.error("❌ Announcement modal not found");
        return;
    }

    // Clear previous announcement ID
    if (idInput) {
        idInput.value = "";
    }

    // Reset the form
    if (form) {
        form.reset();
    }

    // IMPORTANT: reset ID again after form.reset()
    if (idInput) {
        idInput.value = "";
    }

    // Set CREATE title
    if (modalTitle) {
        modalTitle.textContent = "Create Announcement";
    }

    // Default values
    if (categoryInput) {
        categoryInput.value = "General";
    }

    if (priorityInput) {
        priorityInput.value = "normal";
    }

    if (audienceInput) {
        audienceInput.value = "everyone";
    }

    if (publishedInput) {
        publishedInput.checked = true;
    }

    if (expiresInput) {
        expiresInput.value = "";
    }

    if (attachmentInput) {
        attachmentInput.value = "";
    }

    // Finally open modal
    modal.classList.add("open");

    console.log("✅ Create Announcement modal opened");
}

        // ========================================
        // EDIT MODAL
        // ========================================

        function openEditModal(id) {

            var item =
                announcements.find(function (announcement) {

                    return String(
                        announcement.id
                    ) === String(id);

                });


            if (!item) {
                return;
            }


            if (modalTitle) {
                modalTitle.textContent =
                    "Edit Announcement";
            }


            idInput.value =
                item.id || "";


            titleInput.value =
                item.title || "";


            contentInput.value =
                item.content || "";


            categoryInput.value =
                item.category || "General";


            priorityInput.value =
                item.priority || "normal";


            audienceInput.value =
                item.target_audience ||
                "everyone";


            publishedInput.checked =
                item.is_published === true;


            attachmentInput.value =
                item.attachment_url || "";


            expiresInput.value = "";


            if (item.expires_at) {

                var date =
                    new Date(item.expires_at);

                if (!isNaN(date.getTime())) {

                    expiresInput.value =
                        new Date(
                            date.getTime() -
                            date.getTimezoneOffset() * 60000
                        )
                            .toISOString()
                            .slice(0, 16);

                }

            }


            modal.classList.add("open");

        }


        // ========================================
        // CLOSE
        // ========================================

        function closeModal() {

            if (modal) {
                modal.classList.remove("open");
            }

        }


        

        // ========================================
        // CLOSE BUTTON
        // ========================================

        if (closeButton) {

    closeButton.addEventListener("click", function () {

        modal.classList.remove("open");

    });

}

        // ========================================
        // CANCEL
        // ========================================

        if (cancelBtn) {

            cancelBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closeModal();

                }
            );

        }


        // ========================================
        // SEARCH
        // ========================================

        if (search) {

            search.addEventListener(
                "input",
                renderAnnouncements
            );

        }


        // ========================================
        // FILTER
        // ========================================

        if (filter) {

            filter.addEventListener(
                "change",
                renderAnnouncements
            );

        }


        // ========================================
        // SAVE
        // ========================================

        if (form) {

            form.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();

                    console.log(
                        "🟢 SAVING ANNOUNCEMENT"
                    );


                    try {

                        var userResult =
                            await supabaseClient
                                .auth
                                .getUser();


                        if (
                            userResult.error ||
                            !userResult.data.user
                        ) {

                            alert(
                                "You must be logged in."
                            );

                            return;

                        }


                        var user =
                            userResult.data.user;


                        var id =
                            idInput.value.trim();


                        var data = {

                            title:
                                titleInput.value.trim(),

                            content:
                                contentInput.value.trim(),

                            category:
                                categoryInput.value,

                            priority:
                                priorityInput.value,

                            target_audience:
                                audienceInput.value,

                            is_published:
                                publishedInput.checked,

                            published_by:
                                user.id,

                            published_at:
                                publishedInput.checked
                                    ? new Date().toISOString()
                                    : null,

                            expires_at:
                                expiresInput.value
                                    ? new Date(
                                        expiresInput.value
                                    ).toISOString()
                                    : null,

                            attachment_url:
                                attachmentInput.value.trim() ||
                                null

                        };


                        var result;


                        if (id) {

                            result =
                                await supabaseClient
                                    .from("announcements")
                                    .update(data)
                                    .eq("id", id);

                        } else {

                            result =
                                await supabaseClient
                                    .from("announcements")
                                    .insert(data);

                        }


                        if (result.error) {

                            console.error(
                                "❌ ANNOUNCEMENT SAVE ERROR:",
                                result.error
                            );

                            alert(
                                "Could not save announcement: " +
                                result.error.message
                            );

                            return;

                        }


                        alert(
                            id
                                ? "Announcement updated successfully."
                                : "Announcement created successfully."
                        );


                        closeModal();

                        await loadAnnouncements();

                    } catch (error) {

                        console.error(
                            "❌ ANNOUNCEMENT SAVE ERROR:",
                            error
                        );

                        alert(
                            "Something went wrong: " +
                            error.message
                        );

                    }

                }
            );

        }


        // ========================================
        // CARD BUTTONS
        // ========================================

        list.addEventListener(
            "click",
            async function (event) {

                var button =
                    event.target.closest(
                        "[data-announcement-action]"
                    );


                if (!button) {
                    return;
                }


                var id =
                    button.getAttribute(
                        "data-announcement-id"
                    );


                var action =
                    button.getAttribute(
                        "data-announcement-action"
                    );


                if (!id || !action) {
                    return;
                }


                // EDIT

                if (action === "edit") {

                    openEditModal(id);

                    return;

                }


                // DELETE

                if (action === "delete") {

                    if (
                        !confirm(
                            "Delete this announcement?"
                        )
                    ) {
                        return;
                    }


                    var result =
                        await supabaseClient
                            .from("announcements")
                            .delete()
                            .eq("id", id);


                    if (result.error) {

                        alert(
                            "Could not delete announcement: " +
                            result.error.message
                        );

                        return;

                    }


                    alert(
                        "Announcement deleted successfully."
                    );


                    await loadAnnouncements();

                    return;

                }


                // PUBLISH / UNPUBLISH

                if (action === "toggle") {

                    var item =
                        announcements.find(
                            function (announcement) {

                                return String(
                                    announcement.id
                                ) === String(id);

                            }
                        );


                    if (!item) {
                        return;
                    }


                    var newStatus =
                        !item.is_published;


                    var result =
                        await supabaseClient
                            .from("announcements")
                            .update({

                                is_published:
                                    newStatus,

                                published_at:
                                    newStatus
                                        ? new Date().toISOString()
                                        : null

                            })
                            .eq("id", id);


                    if (result.error) {

                        alert(
                            "Could not update announcement: " +
                            result.error.message
                        );

                        return;

                    }


                    await loadAnnouncements();

                }

            }
        );


                                // ========================================
        // START
        // ========================================

        loadAnnouncements();

    }

    // ========================================
    // INITIALIZE
    // ========================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initAdminAnnouncements
        );

    } else {

        initAdminAnnouncements();

    }

})();
// ========================================
// NAVENTRA - ANNOUNCEMENT BUTTON FIX
// ========================================

document.addEventListener("click", function (event) {

    // CREATE ANNOUNCEMENT
    var createButton = event.target.closest(
        "#admin-create-announcement-button"
    );

    if (createButton) {

        console.log("CREATE ANNOUNCEMENT BUTTON CLICKED");

        var modal = document.getElementById(
            "adminAnnouncementModal"
        );

        if (!modal) {

            console.error(
                "Announcement modal was NOT found."
            );

            return;
        }

        modal.classList.add("open");

        console.log(
            "Announcement modal opened."
        );

        return;
    }


    // CLOSE ANNOUNCEMENT
    var closeButton = event.target.closest(
        "#admin-create-announcement-button-close"
    );

    if (closeButton) {

        console.log("CLOSE ANNOUNCEMENT BUTTON CLICKED");

        var modal = document.getElementById(
            "adminAnnouncementModal"
        );

        if (modal) {
            modal.classList.remove("open");
        }

    }

});
// ========================================
// ANNOUNCEMENT CREATE BUTTON - DIRECT FIX
// ========================================

document.addEventListener("click", function (event) {

    var button = event.target.closest(
        "#adminCreateAnnouncementBtn"
    );

    if (!button) {
        return;
    }

    console.log("CREATE ANNOUNCEMENT CLICKED");

    var modal = document.getElementById(
        "adminAnnouncementModal"
    );

    if (!modal) {
        console.error(
            "Announcement modal not found."
        );
        return;
    }

    modal.classList.add("open");

});
// ========================================
// ANNOUNCEMENT EDIT BUTTON - DIRECT FIX
// ========================================

document.addEventListener("click", function (event) {

    var button = event.target.closest(
        "[data-announcement-action='edit']"
    );

    if (!button) {
        return;
    }

    console.log("EDIT ANNOUNCEMENT CLICKED");

    var id =
        button.getAttribute(
            "data-announcement-id"
        );

    console.log(
        "Editing announcement:",
        id
    );

    var modal =
        document.getElementById(
            "adminAnnouncementModal"
        );

    if (!modal) {
        console.error(
            "Announcement modal not found."
        );
        return;
    }

    var item =
        window.adminAnnouncements &&
        window.adminAnnouncements.find(
            function (announcement) {
                return String(
                    announcement.id
                ) === String(id);
            }
        );

    if (!item) {
        console.error(
            "Announcement data not found:",
            id
        );
        return;
    }

    document.getElementById(
        "adminAnnouncementId"
    ).value = item.id || "";

    document.getElementById(
        "adminAnnouncementTitle"
    ).value = item.title || "";

    document.getElementById(
        "adminAnnouncementContent"
    ).value = item.content || "";

    document.getElementById(
        "adminAnnouncementCategory"
    ).value =
        item.category || "General";

    document.getElementById(
        "adminAnnouncementPriority"
    ).value =
        item.priority || "normal";

    document.getElementById(
        "adminAnnouncementAudience"
    ).value =
        item.target_audience || "everyone";

    document.getElementById(
        "adminAnnouncementPublished"
    ).checked =
        item.is_published === true;

    document.getElementById(
        "adminAnnouncementAttachment"
    ).value =
        item.attachment_url || "";

    document.getElementById(
        "adminAnnouncementModalTitle"
    ).textContent =
        "Edit Announcement";

    modal.classList.add("open");

});
// ========================================
// CLOSE ANNOUNCEMENT MODAL
// ========================================

document.addEventListener("click", function (event) {

    var button = event.target.closest(
        "#adminCloseAnnouncementModal"
    );

    if (!button) {
        return;
    }

    var modal =
        document.getElementById(
            "adminAnnouncementModal"
        );

    if (modal) {
        modal.classList.remove("open");
    }

});
document.addEventListener("click", function (event) {

    var button = event.target.closest(
        "#adminCancelAnnouncementBtn"
    );

    if (!button) {
        return;
    }

    var modal =
        document.getElementById(
            "adminAnnouncementModal"
        );

    if (modal) {
        modal.classList.remove("open");
    }

});
// ========================================
// NAVENTRA - CREATE ANNOUNCEMENT BUTTON FIX
// ========================================

document.addEventListener("click", function (event) {

    var createButton = event.target.closest(
        "#adminCreateAnnouncementBtn"
    );

    if (!createButton) {
        return;
    }

    console.log(
        "CREATE ANNOUNCEMENT BUTTON CLICKED"
    );

    var modal = document.getElementById(
        "adminAnnouncementModal"
    );

    if (!modal) {

        console.error(
            "ERROR: adminAnnouncementModal NOT FOUND"
        );

        return;
    }

    var form = document.getElementById(
        "adminAnnouncementForm"
    );

    var idInput = document.getElementById(
        "adminAnnouncementId"
    );

    var modalTitle = document.getElementById(
        "adminAnnouncementModalTitle"
    );

    if (form) {
        form.reset();
    }

    if (idInput) {
        idInput.value = "";
    }

    if (modalTitle) {
        modalTitle.textContent =
            "Create Announcement";
    }

    var publishedInput =
        document.getElementById(
            "adminAnnouncementPublished"
        );

    if (publishedInput) {
        publishedInput.checked = true;
    }

    modal.classList.add("open");

});
// ========================================
// NAVENTRA - EDIT ANNOUNCEMENT BUTTON FIX
// ========================================

document.addEventListener("click", function (event) {

    var editButton = event.target.closest(
        "[data-announcement-action='edit']"
    );

    if (!editButton) {
        return;
    }

    console.log(
        "EDIT ANNOUNCEMENT BUTTON CLICKED"
    );

    var id =
        editButton.getAttribute(
            "data-announcement-id"
        );

    console.log(
        "Announcement ID:",
        id
    );

    var modal =
        document.getElementById(
            "adminAnnouncementModal"
        );

    if (!modal) {
        console.error(
            "ERROR: Announcement modal NOT FOUND"
        );
        return;
    }

    var item =
        window.adminAnnouncements &&
        window.adminAnnouncements.find(
            function (announcement) {

                return String(
                    announcement.id
                ) === String(id);

            }
        );

    if (!item) {

        console.error(
            "ERROR: Announcement data NOT FOUND"
        );

        return;
    }

    document.getElementById(
        "adminAnnouncementId"
    ).value =
        item.id || "";

    document.getElementById(
        "adminAnnouncementTitle"
    ).value =
        item.title || "";

    document.getElementById(
        "adminAnnouncementContent"
    ).value =
        item.content || "";

    document.getElementById(
        "adminAnnouncementCategory"
    ).value =
        item.category || "General";

    document.getElementById(
        "adminAnnouncementPriority"
    ).value =
        item.priority || "normal";

    document.getElementById(
        "adminAnnouncementAudience"
    ).value =
        item.target_audience || "everyone";

    document.getElementById(
        "adminAnnouncementPublished"
    ).checked =
        item.is_published === true;

    document.getElementById(
        "adminAnnouncementAttachment"
    ).value =
        item.attachment_url || "";

    document.getElementById(
        "adminAnnouncementModalTitle"
    ).textContent =
        "Edit Announcement";

    modal.classList.add("open");

});
document.addEventListener("click", function (event) {

    var closeButton = event.target.closest(
        "#adminCloseAnnouncementModal"
    );

    var cancelButton = event.target.closest(
        "#adminCancelAnnouncementBtn"
    );

    if (!closeButton && !cancelButton) {
        return;
    }

    var modal =
        document.getElementById(
            "adminAnnouncementModal"
        );

    if (modal) {
        modal.classList.remove("open");
    }

});


// ========================================
// NAVENTRA ADMIN - EVENTS
// FINAL VERSION
// ========================================

(function () {

    function initAdminEvents() {

        console.log("📅 Events JS initialized");


        // ========================================
        // ELEMENTS
        // ========================================

        var list =
            document.getElementById("adminEventsList");

        var count =
            document.getElementById("adminEventsCount");

        var search =
            document.getElementById("adminEventSearch");

        var filter =
            document.getElementById("adminEventFilter");

        var createBtn =
            document.getElementById("adminCreateEventBtn");

        var modal =
            document.getElementById("adminEventModal");

        var closeBtn =
            document.getElementById("adminCloseEventModal");

        var cancelBtn =
            document.getElementById("adminCancelEventBtn");

        var form =
            document.getElementById("adminEventForm");

        var modalTitle =
            document.getElementById("adminEventModalTitle");

        var idInput =
            document.getElementById("adminEventId");

        var titleInput =
            document.getElementById("adminEventTitle");

        var descriptionInput =
            document.getElementById("adminEventDescription");

        var categoryInput =
            document.getElementById("adminEventCategory");

        var dateInput =
            document.getElementById("adminEventDate");

        var startTimeInput =
            document.getElementById("adminEventStartTime");

        var endTimeInput =
            document.getElementById("adminEventEndTime");

        var locationInput =
            document.getElementById("adminEventLocation");

        var imageInput =
            document.getElementById("adminEventImage");

        var registrationInput =
            document.getElementById("adminEventRegistration");

        var registrationDeadlineInput =
            document.getElementById(
                "adminEventRegistrationDeadline"
            );

        var maxParticipantsInput =
            document.getElementById(
                "adminEventMaxParticipants"
            );

        var statusInput =
            document.getElementById("adminEventStatus");


        // ========================================
        // SAFETY CHECK
        // ========================================

        if (!list) {

            console.error(
                "❌ adminEventsList was NOT found."
            );

            return;
        }


        if (!modal) {

            console.error(
                "❌ adminEventModal was NOT found."
            );

            return;
        }


        console.log("✅ Events HTML found");


        // ========================================
        // DATA
        // ========================================

        var events = [];


        // ========================================
        // LOAD EVENTS
        // ========================================

        async function loadEvents() {

            list.innerHTML = `
                <div class="admin-loading">
                    Loading events...
                </div>
            `;


            try {

                if (
                    typeof supabaseClient ===
                    "undefined"
                ) {

                    throw new Error(
                        "Supabase client is not available."
                    );

                }


                var result =
                    await supabaseClient
                        .from("events")
                        .select("*")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (result.error) {

                    console.error(
                        "❌ EVENTS LOAD ERROR:",
                        result.error
                    );


                    list.innerHTML = `
                        <div class="admin-claims-empty">

                            <div class="admin-claims-empty-icon">
                                ⚠️
                            </div>

                            <h3>
                                Could not load events
                            </h3>

                            <p>
                                ${result.error.message}
                            </p>

                        </div>
                    `;

                    return;
                }


                events =
                    result.data || [];


                console.log(
                    "✅ Events loaded:",
                    events.length
                );


                renderEvents();


            } catch (error) {

                console.error(
                    "❌ EVENTS LOAD ERROR:",
                    error
                );


                list.innerHTML = `
                    <div class="admin-claims-empty">

                        <div class="admin-claims-empty-icon">
                            ⚠️
                        </div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            ${error.message}
                        </p>

                    </div>
                `;

            }

        }


        // ========================================
        // FORMAT DATE
        // ========================================

        function formatDate(dateValue) {

            if (!dateValue) {
                return "Unknown date";
            }


            var date =
                new Date(dateValue);


            if (
                isNaN(
                    date.getTime()
                )
            ) {

                return "Unknown date";

            }


            return date.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

        }


        // ========================================
        // FORMAT TIME
        // ========================================

        function formatTime(timeValue) {

            if (!timeValue) {
                return "";
            }


            var parts =
                timeValue.split(":");


            if (parts.length < 2) {
                return timeValue;
            }


            var hours =
                parseInt(
                    parts[0],
                    10
                );


            var minutes =
                parts[1];


            if (isNaN(hours)) {
                return timeValue;
            }


            var suffix =
                hours >= 12
                    ? "PM"
                    : "AM";


            var displayHour =
                hours % 12 || 12;


            return (
                displayHour +
                ":" +
                minutes +
                " " +
                suffix
            );

        }


        // ========================================
        // RENDER EVENTS
        // ========================================

        function renderEvents() {

            var searchText =
                search
                    ? search.value
                        .trim()
                        .toLowerCase()
                    : "";


            var selectedFilter =
                filter
                    ? filter.value
                    : "all";


            var filtered =
                events.filter(
                    function (event) {

                        var searchableText = (

                            (event.title || "") +
                            " " +
                            (event.description || "") +
                            " " +
                            (event.category || "") +
                            " " +
                            (event.location || "")

                        ).toLowerCase();


                        var matchesSearch =
                            !searchText ||
                            searchableText.includes(
                                searchText
                            );


                        var matchesFilter =
                            selectedFilter === "all" ||
                            (
                                event.status ||
                                "upcoming"
                            ).toLowerCase() ===
                            selectedFilter;


                        return (
                            matchesSearch &&
                            matchesFilter
                        );

                    }
                );


            if (count) {

                count.textContent =
                    filtered.length;

            }


            if (!filtered.length) {

                list.innerHTML = `
                    <div class="admin-claims-empty">

                        <div class="admin-claims-empty-icon">
                            📅
                        </div>

                        <h3>
                            No events found
                        </h3>

                        <p>
                            Create your first school event.
                        </p>

                    </div>
                `;

                return;
            }


            list.innerHTML =
                filtered
                    .map(
                        createEventCard
                    )
                    .join("");

        }


        // ========================================
        // CREATE EVENT CARD
        // ========================================

        function createEventCard(event) {

            var status =
                event.status ||
                "upcoming";


            var category =
                event.category ||
                "General";


            var date =
                formatDate(
                    event.event_date
                );


            var startTime =
                formatTime(
                    event.start_time
                );


            var endTime =
                formatTime(
                    event.end_time
                );


            var timeText =
                endTime
                    ? startTime +
                      " - " +
                      endTime
                    : startTime;


            var registrationText =
                event.registration_required
                    ? "Registration required"
                    : "No registration";


            return `

                <article
                    class="admin-event-card"
                >

                    <div
                        class="admin-event-card-top"
                    >

                        <div>

                            <span
                                class="admin-event-category"
                            >
                                ${category}
                            </span>

                            <h3>
                                ${
                                    event.title ||
                                    "Untitled Event"
                                }
                            </h3>

                        </div>


                        <span
                            class="admin-event-status ${status.toLowerCase()}"
                        >
                            ${status}
                        </span>

                    </div>


                    <p
                        class="admin-event-description"
                    >
                        ${
                            event.description ||
                            "No description provided."
                        }
                    </p>


                    <div
                        class="admin-event-meta"
                    >

                        <span>
                            📅 ${date}
                        </span>

                        <span>
                            🕐 ${timeText}
                        </span>

                        <span>
                            📍 ${
                                event.location ||
                                "No location"
                            }
                        </span>

                        <span>
                            📝 ${registrationText}
                        </span>

                    </div>


                    ${
                        event.registration_required &&
                        event.max_participants
                            ? `
                                <div class="admin-event-meta">
                                    👥 Maximum participants:
                                    ${event.max_participants}
                                </div>
                              `
                            : ""
                    }


                    <div
                        class="admin-event-actions"
                    >

                        <button
                            type="button"
                            class="admin-secondary-btn"
                            data-event-action="edit"
                            data-event-id="${event.id}"
                        >
                            ✏️ Edit
                        </button>


                        <button
                            type="button"
                            class="admin-secondary-btn"
                            data-event-action="status"
                            data-event-id="${event.id}"
                        >
                            ${
                                status === "cancelled"
                                    ? "🔄 Restore"
                                    : "🔄 Change Status"
                            }
                        </button>


                        <button
                            type="button"
                            class="admin-danger-btn"
                            data-event-action="delete"
                            data-event-id="${event.id}"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </article>

            `;

        }


        // ========================================
        // OPEN CREATE MODAL
        // ========================================

        function openCreateModal() {

            console.log(
                "🟢 CREATE EVENT CLICKED"
            );


            if (form) {
                form.reset();
            }


            if (idInput) {
                idInput.value = "";
            }


            if (modalTitle) {

                modalTitle.textContent =
                    "Create Event";

            }


            if (statusInput) {

                statusInput.value =
                    "upcoming";

            }


            if (registrationInput) {

                registrationInput.checked =
                    false;

            }


            if (
                registrationDeadlineInput
            ) {

                registrationDeadlineInput.value =
                    "";

            }


            if (
                maxParticipantsInput
            ) {

                maxParticipantsInput.value =
                    "";

            }


            modal.classList.add("open");


            console.log(
                "✅ Event modal opened"
            );

        }


        // ========================================
        // OPEN EDIT MODAL
        // ========================================

        function openEditModal(id) {

            console.log(
                "✏️ EDIT EVENT:",
                id
            );


            var event =
                events.find(
                    function (item) {

                        return String(
                            item.id
                        ) === String(id);

                    }
                );


            if (!event) {

                console.error(
                    "❌ Event not found:",
                    id
                );

                return;
            }


            if (modalTitle) {

                modalTitle.textContent =
                    "Edit Event";

            }


            idInput.value =
                event.id || "";


            titleInput.value =
                event.title || "";


            descriptionInput.value =
                event.description || "";


            categoryInput.value =
                event.category || "Academic";


            dateInput.value =
                event.event_date || "";


            startTimeInput.value =
                event.start_time
                    ? event.start_time
                        .slice(0, 5)
                    : "";


            endTimeInput.value =
                event.end_time
                    ? event.end_time
                        .slice(0, 5)
                    : "";


            locationInput.value =
                event.location || "";


            imageInput.value =
                event.image_url || "";


            registrationInput.checked =
                event.registration_required === true;


            maxParticipantsInput.value =
                event.max_participants ||
                "";


            statusInput.value =
                event.status ||
                "upcoming";


            registrationDeadlineInput.value =
                "";


            if (
                event.registration_deadline
            ) {

                var deadline =
                    new Date(
                        event.registration_deadline
                    );


                if (
                    !isNaN(
                        deadline.getTime()
                    )
                ) {

                    registrationDeadlineInput.value =
                        new Date(
                            deadline.getTime() -
                            deadline.getTimezoneOffset() *
                            60000
                        )
                            .toISOString()
                            .slice(0, 16);

                }

            }


            modal.classList.add("open");


            console.log(
                "✅ Edit event modal opened"
            );

        }


        // ========================================
        // CLOSE MODAL
        // ========================================

        function closeModal() {

            if (modal) {

                modal.classList.remove(
                    "open"
                );

            }

        }


        // ========================================
        // CREATE BUTTON
        // ========================================

        if (createBtn) {

            createBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    openCreateModal();

                }
            );


            console.log(
                "✅ Create Event button connected"
            );

        } else {

            console.error(
                "❌ Create Event button NOT found"
            );

        }


        // ========================================
        // CLOSE BUTTON
        // ========================================

        if (closeBtn) {

            closeBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closeModal();

                }
            );

        }


        // ========================================
        // CANCEL BUTTON
        // ========================================

        if (cancelBtn) {

            cancelBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    closeModal();

                }
            );

        }


        // ========================================
        // SEARCH
        // ========================================

        if (search) {

            search.addEventListener(
                "input",
                renderEvents
            );

        }


        // ========================================
        // FILTER
        // ========================================

        if (filter) {

            filter.addEventListener(
                "change",
                renderEvents
            );

        }


        // ========================================
        // SAVE EVENT
        // ========================================

        if (form) {

            form.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    console.log(
                        "🟢 SAVING EVENT"
                    );


                    try {

                        // --------------------------------
                        // GET LOGGED-IN USER
                        // --------------------------------

                        var userResult =
                            await supabaseClient
                                .auth
                                .getUser();


                        if (
                            userResult.error ||
                            !userResult.data.user
                        ) {

                            alert(
                                "You must be logged in."
                            );

                            return;

                        }


                        var user =
                            userResult.data.user;


                        // --------------------------------
                        // EVENT ID
                        // --------------------------------

                        var id =
                            idInput.value.trim();


                        // --------------------------------
                        // BUILD DATA
                        // --------------------------------

                        var eventData = {

                            title:
                                titleInput.value.trim(),

                            description:
                                descriptionInput.value.trim(),

                            category:
                                categoryInput.value,

                            event_date:
                                dateInput.value,

                            start_time:
                                startTimeInput.value,

                            end_time:
                                endTimeInput.value ||
                                null,

                            location:
                                locationInput.value.trim(),

                            organizer_id:
                                user.id,

                            image_url:
                                imageInput.value.trim() ||
                                null,

                            registration_required:
                                registrationInput.checked,

                            registration_deadline:
                                registrationInput.checked &&
                                registrationDeadlineInput.value
                                    ? new Date(
                                        registrationDeadlineInput.value
                                    ).toISOString()
                                    : null,

                            max_participants:
                                registrationInput.checked &&
                                maxParticipantsInput.value
                                    ? parseInt(
                                        maxParticipantsInput.value,
                                        10
                                    )
                                    : null,

                            status:
                                statusInput.value,

                            upadated_at:
                                new Date().toISOString()

                        };


                        console.log(
                            "📦 EVENT DATA:",
                            eventData
                        );


                        // --------------------------------
                        // UPDATE OR INSERT
                        // --------------------------------

                        var result;


                        if (id) {

                            result =
                                await supabaseClient
                                    .from("events")
                                    .update(eventData)
                                    .eq(
                                        "id",
                                        id
                                    );

                        } else {

                            result =
                                await supabaseClient
                                    .from("events")
                                    .insert(
                                        eventData
                                    );

                        }


                        // --------------------------------
                        // CHECK ERROR
                        // --------------------------------

                        if (result.error) {

                            console.error(
                                "❌ EVENT SAVE ERROR:",
                                result.error
                            );


                            alert(
                                "Could not save event: " +
                                result.error.message
                            );

                            return;

                        }


                        console.log(
                            "✅ EVENT SAVED"
                        );


                        alert(
                            id
                                ? "Event updated successfully."
                                : "Event created successfully."
                        );


                        closeModal();


                        await loadEvents();

                    } catch (error) {

                        console.error(
                            "❌ EVENT SAVE ERROR:",
                            error
                        );


                        alert(
                            "Something went wrong while saving the event: " +
                            error.message
                        );

                    }

                }
            );

        }


        // ========================================
        // CARD ACTIONS
        // ========================================

        list.addEventListener(
            "click",
            async function (event) {

                var button =
                    event.target.closest(
                        "[data-event-action]"
                    );


                if (!button) {
                    return;
                }


                var id =
                    button.getAttribute(
                        "data-event-id"
                    );


                var action =
                    button.getAttribute(
                        "data-event-action"
                    );


                if (!id || !action) {
                    return;
                }


                // ====================================
                // EDIT
                // ====================================

                if (
                    action === "edit"
                ) {

                    openEditModal(id);

                    return;

                }


                // ====================================
                // DELETE
                // ====================================

                if (
                    action === "delete"
                ) {

                    var confirmed =
                        confirm(
                            "Delete this event?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    try {

                        var deleteResult =
                            await supabaseClient
                                .from("events")
                                .delete()
                                .eq(
                                    "id",
                                    id
                                );


                        if (
                            deleteResult.error
                        ) {

                            console.error(
                                "❌ DELETE EVENT ERROR:",
                                deleteResult.error
                            );


                            alert(
                                "Could not delete event: " +
                                deleteResult.error.message
                            );

                            return;

                        }


                        alert(
                            "Event deleted successfully."
                        );


                        await loadEvents();

                    } catch (error) {

                        console.error(
                            "❌ DELETE EVENT ERROR:",
                            error
                        );


                        alert(
                            "Something went wrong: " +
                            error.message
                        );

                    }


                    return;

                }


                // ====================================
                // CHANGE STATUS
                // ====================================

                if (
                    action === "status"
                ) {

                    var selected =
                        events.find(
                            function (item) {

                                return String(
                                    item.id
                                ) === String(id);

                            }
                        );


                    if (!selected) {
                        return;
                    }


                    var currentStatus =
                        selected.status ||
                        "upcoming";


                    var nextStatus;


                    if (
                        currentStatus ===
                        "upcoming"
                    ) {

                        nextStatus =
                            "ongoing";

                    } else if (
                        currentStatus ===
                        "ongoing"
                    ) {

                        nextStatus =
                            "completed";

                    } else if (
                        currentStatus ===
                        "completed"
                    ) {

                        nextStatus =
                            "cancelled";

                    } else {

                        nextStatus =
                            "upcoming";

                    }


                    var statusResult =
                        await supabaseClient
                            .from("events")
                            .update({

                                status:
                                    nextStatus,

                                upadated_at:
                                    new Date().toISOString()

                            })
                            .eq(
                                "id",
                                id
                            );


                    if (
                        statusResult.error
                    ) {

                        console.error(
                            "❌ STATUS UPDATE ERROR:",
                            statusResult.error
                        );


                        alert(
                            "Could not update event: " +
                            statusResult.error.message
                        );

                        return;

                    }


                    alert(
                        "Event status changed to " +
                        nextStatus +
                        "."
                    );


                    await loadEvents();

                }

            }
        );


        // ========================================
        // START
        // ========================================

        loadEvents();

    }


    // ========================================
    // INITIALIZE
    // ========================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initAdminEvents
        );

    } else {

        initAdminEvents();

    }

})();

// ========================================
// NAVENTRA ADMIN - REPORTS
// READ ONLY
// ========================================

(function () {

    function initAdminReports() {

        console.log("📊 Reports JS initialized");


        // ========================================
        // ELEMENTS
        // ========================================

        var section =
            document.getElementById("admin-reports");

        if (!section) {

            console.log(
                "⏳ Reports section not found."
            );

            return;
        }


        var students =
            document.getElementById("reportStudents");

        var events =
            document.getElementById("reportEvents");

        var announcements =
            document.getElementById("reportAnnouncements");

        var lostFound =
            document.getElementById("reportLostFound");

        var upcoming =
            document.getElementById("reportUpcomingEvents");

        var ongoing =
            document.getElementById("reportOngoingEvents");

        var completed =
            document.getElementById("reportCompletedEvents");

        var cancelled =
            document.getElementById("reportCancelledEvents");

        var publishedAnnouncements =
            document.getElementById(
                "reportPublishedAnnouncements"
            );

        var draftAnnouncements =
            document.getElementById(
                "reportDraftAnnouncements"
            );

        var lostFoundTotal =
            document.getElementById(
                "reportLostFoundTotal"
            );

        var claimedItems =
            document.getElementById(
                "reportClaimedItems"
            );

        var unclaimedItems =
            document.getElementById(
                "reportUnclaimedItems"
            );

        var status =
            document.getElementById(
                "reportsStatus"
            );


        // ========================================
        // LOAD REPORTS
        // ========================================

        async function loadReports() {

            console.log("📊 Loading reports...");


            try {

                if (
                    typeof supabaseClient === "undefined" ||
                    !supabaseClient
                ) {

                    throw new Error(
                        "Supabase client is not available."
                    );

                }


                // ====================================
                // PROFILES
                // ====================================

                var profileResult =
                    await supabaseClient
                        .from("profiles")
                        .select("id, role");


                if (profileResult.error) {

                    console.error(
                        "❌ Profiles report error:",
                        profileResult.error
                    );

                }


                var profiles =
                    profileResult.data || [];


                var studentCount =
                    profiles.filter(
                        function (profile) {

                            return profile.role === "student";

                        }
                    ).length;


                if (students) {
                    students.textContent =
                        studentCount;
                }


                // ====================================
                // EVENTS
                // ====================================

                var eventResult =
                    await supabaseClient
                        .from("events")
                        .select("id, status");


                if (eventResult.error) {

                    console.error(
                        "❌ Events report error:",
                        eventResult.error
                    );

                }


                var eventData =
                    eventResult.data || [];


                if (events) {
                    events.textContent =
                        eventData.length;
                }


                var upcomingCount = 0;
                var ongoingCount = 0;
                var completedCount = 0;
                var cancelledCount = 0;


                eventData.forEach(
                    function (event) {

                        var eventStatus =
                            String(
                                event.status || ""
                            ).toLowerCase();


                        if (
                            eventStatus === "upcoming"
                        ) {

                            upcomingCount++;

                        } else if (
                            eventStatus === "ongoing"
                        ) {

                            ongoingCount++;

                        } else if (
                            eventStatus === "completed"
                        ) {

                            completedCount++;

                        } else if (
                            eventStatus === "cancelled"
                        ) {

                            cancelledCount++;

                        }

                    }
                );


                if (upcoming) {
                    upcoming.textContent =
                        upcomingCount;
                }

                if (ongoing) {
                    ongoing.textContent =
                        ongoingCount;
                }

                if (completed) {
                    completed.textContent =
                        completedCount;
                }

                if (cancelled) {
                    cancelled.textContent =
                        cancelledCount;
                }


                // ====================================
                // ANNOUNCEMENTS
                // ====================================

                var announcementResult =
                    await supabaseClient
                        .from("announcements")
                        .select("id, is_published");


                if (announcementResult.error) {

                    console.error(
                        "❌ Announcements report error:",
                        announcementResult.error
                    );

                }


                var announcementData =
                    announcementResult.data || [];


                if (announcements) {

                    announcements.textContent =
                        announcementData.length;

                }


                var publishedCount = 0;
                var draftCount = 0;


                announcementData.forEach(
                    function (announcement) {

                        if (
                            announcement.is_published === true
                        ) {

                            publishedCount++;

                        } else {

                            draftCount++;

                        }

                    }
                );


                if (publishedAnnouncements) {

                    publishedAnnouncements.textContent =
                        publishedCount;

                }


                if (draftAnnouncements) {

                    draftAnnouncements.textContent =
                        draftCount;

                }


                // ====================================
                // LOST & FOUND
                // ====================================

                var lostFoundResult =
                    await supabaseClient
                        .from("lost_items")
                        .select("*");


                if (lostFoundResult.error) {

                    console.error(
                        "❌ Lost & Found report error:",
                        lostFoundResult.error
                    );

                }


                var lostFoundData =
                    lostFoundResult.data || [];


                if (lostFound) {

                    lostFound.textContent =
                        lostFoundData.length;

                }


                if (lostFoundTotal) {

                    lostFoundTotal.textContent =
                        lostFoundData.length;

                }


                var claimedCount = 0;
                var unclaimedCount = 0;


                lostFoundData.forEach(
                    function (item) {

                        var itemStatus =
                            String(
                                item.status || ""
                            ).toLowerCase();


                        if (
                            itemStatus === "claimed" ||
                            itemStatus === "resolved"
                        ) {

                            claimedCount++;

                        } else {

                            unclaimedCount++;

                        }

                    }
                );


                if (claimedItems) {

                    claimedItems.textContent =
                        claimedCount;

                }


                if (unclaimedItems) {

                    unclaimedItems.textContent =
                        unclaimedCount;

                }


                // ====================================
                // SUCCESS
                // ====================================

                if (status) {

                    status.textContent =
                        "Reports loaded successfully.";

                }


                console.log(
                    "✅ Reports loaded successfully."
                );


            } catch (error) {

                console.error(
                    "❌ REPORTS ERROR:",
                    error
                );


                if (status) {

                    status.textContent =
                        "Some report data could not be loaded.";

                }

            }

        }


        // ========================================
        // START
        // ========================================

        loadReports();

    }


    // ========================================
    // INITIALIZE
    // ========================================

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initAdminReports
        );

    } else {

        initAdminReports();

    }

})();



// ========================================
// NAVENTRA ADMIN - CAREER ANALYTICS
// FINAL STABLE VERSION
// READ ONLY
// ========================================

(function () {

    function initCareerAnalytics() {

        console.log("📊 Career Analytics initialized");

        // ========================================
        // GET ELEMENTS
        // ========================================

        var section =
            document.getElementById("admin-career-analytics");

        var total =
            document.getElementById("careerAnalyticsTotal");

        var students =
            document.getElementById("careerAnalyticsStudents");

        var average =
            document.getElementById("careerAnalyticsAverage");

        var topCareer =
            document.getElementById("careerAnalyticsTopCareer");

        var search =
            document.getElementById("careerAnalyticsSearch");

        var tableBody =
            document.getElementById("careerAnalyticsTableBody");

        var distributionCanvas =
            document.getElementById("careerDistributionChart");

        var mathsCanvas =
            document.getElementById("careerMathsChart");


        // ========================================
        // CHECK HTML
        // ========================================

        if (!section) {
            console.log("⏳ Career Analytics section not found yet.");
            return;
        }

        if (!tableBody) {
            console.error("❌ Career Analytics table body not found.");
            return;
        }

        if (
            typeof supabaseClient === "undefined" ||
            !supabaseClient
        ) {
            console.error("❌ Supabase client is not available.");
            return;
        }

        console.log("✅ Career Analytics HTML found");


        // ========================================
        // DATA
        // ========================================

        var careerResults = [];

        var distributionChart = null;

        var mathsChart = null;


        // ========================================
        // LOAD CAREER ASSESSMENTS
        // ========================================

        async function loadCareerResults() {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Loading career analytics...
                    </td>
                </tr>
            `;

            try {

                console.log(
                    "📊 Loading career assessments..."
                );


                var result =
                    await supabaseClient
                        .from("career_assessments")
                        .select(
                            "id, student_id, created_at, attempt_number, status, answers"
                        )
                        .eq("status", "completed")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (result.error) {

                    console.error(
                        "❌ Career Assessments Error:",
                        result.error
                    );

                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="5">
                                Unable to load career analytics.
                            </td>
                        </tr>
                    `;

                    return;
                }


                careerResults = [];


                // ========================================
                // CONVERT ASSESSMENTS
                // ========================================

                (result.data || []).forEach(
                    function (assessment) {

                        var saved =
                            assessment.answers;


                        // Handle nested answers object

                        if (
                            saved &&
                            saved.answers
                        ) {
                            saved =
                                saved.answers;
                        }


                        if (!saved) {
                            return;
                        }


                        var ranked =
                            saved.rankedCategories;


                        if (
                            !Array.isArray(ranked) ||
                            !ranked.length
                        ) {
                            return;
                        }


                        // ========================================
                        // TOP CAREER
                        // ========================================

                        var topCategory =
                            ranked[0];


                        var careerName =
                            topCategory &&
                            topCategory[0]
                                ? String(
                                    topCategory[0]
                                )
                                : "Unknown";


                        var topScore =
                            topCategory &&
                            topCategory[1] !== undefined
                                ? Number(
                                    topCategory[1]
                                )
                                : 0;


                        // ========================================
                        // FIND HIGHEST SCORE
                        // ========================================

                        var maxScore =
                            ranked.reduce(
                                function (
                                    max,
                                    item
                                ) {

                                    var score =
                                        Number(
                                            item[1]
                                        ) || 0;

                                    return Math.max(
                                        max,
                                        score
                                    );

                                },
                                0
                            );


                        // ========================================
                        // MATCH PERCENTAGE
                        // ========================================

                        var matchPercentage =
                            maxScore > 0
                                ? Math.round(
                                    (
                                        topScore /
                                        maxScore
                                    ) * 100
                                )
                                : 0;


                        // ========================================
                        // ADD RESULT
                        // ========================================

                        careerResults.push({

                            id:
                                assessment.id,

                            student_id:
                                assessment.student_id,

                            created_at:
                                assessment.created_at,

                            attempt_number:
                                assessment.attempt_number,

                            career_name:
                                careerName,

                            maths_percentage:
                                null,

                            match_percentage:
                                matchPercentage,

                            rank:
                                1,

                            strengths:
                                "Top career match"

                        });

                    }
                );


                console.log(
                    "✅ Career assessments loaded:",
                    careerResults.length
                );


                updateCards();

                renderTable();

                renderCharts();

            } catch (error) {

                console.error(
                    "❌ Career Analytics Error:",
                    error
                );

                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5">
                            Something went wrong while loading career analytics.
                        </td>
                    </tr>
                `;

            }

        }


        // ========================================
        // UPDATE CARDS
        // ========================================

        function updateCards() {

            // TOTAL RESULTS

            if (total) {

                total.textContent =
                    careerResults.length;

            }


            // UNIQUE STUDENTS

            var studentIds =
                new Set();


            careerResults.forEach(
                function (item) {

                    if (item.student_id) {

                        studentIds.add(
                            String(
                                item.student_id
                            )
                        );

                    }

                }
            );


            if (students) {

                students.textContent =
                    studentIds.size;

            }


            // ========================================
            // TOP CAREER
            // ========================================

            var careerCounts = {};


            careerResults.forEach(
                function (item) {

                    var career =
                        String(
                            item.career_name ||
                            "Unknown"
                        ).trim();


                    careerCounts[career] =
                        (
                            careerCounts[career] ||
                            0
                        ) + 1;

                }
            );


            var careerNames =
                Object.keys(
                    careerCounts
                );


            careerNames.sort(
                function (a, b) {

                    return (
                        careerCounts[b] -
                        careerCounts[a]
                    );

                }
            );


            if (topCareer) {

                topCareer.textContent =
                    careerNames.length
                        ? careerNames[0]
                        : "—";

            }


            // ========================================
            // AVERAGE MATCH
            // ========================================

            var matchTotal = 0;

            var matchCount = 0;


            careerResults.forEach(
                function (item) {

                    var match =
                        Number(
                            item.match_percentage
                        );


                    if (!isNaN(match)) {

                        matchTotal += match;

                        matchCount++;

                    }

                }
            );


            if (average) {

                average.textContent =
                    matchCount
                        ? (
                            matchTotal /
                            matchCount
                        ).toFixed(1) + "%"
                        : "0%";

            }

        }


        // ========================================
        // FILTER
        // ========================================

        function getFilteredResults() {

            var searchText =
                search
                    ? search.value
                        .trim()
                        .toLowerCase()
                    : "";


            if (!searchText) {

                return careerResults;

            }


            return careerResults.filter(
                function (item) {

                    return String(
                        item.career_name ||
                        ""
                    )
                        .toLowerCase()
                        .includes(
                            searchText
                        );

                }
            );

        }


        // ========================================
        // FORMAT DATE
        // ========================================

        function formatDate(value) {

            if (!value) {
                return "—";
            }


            var date =
                new Date(value);


            if (
                isNaN(
                    date.getTime()
                )
            ) {
                return "—";
            }


            return date.toLocaleDateString(
                undefined,
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );

        }


        // ========================================
        // RENDER TABLE
        // ========================================

        function renderTable() {

            var filtered =
                getFilteredResults();


            if (!filtered.length) {

                tableBody.innerHTML = `
                    <tr>
                        <td
                            colspan="5"
                            class="career-analytics-empty"
                        >
                            No career results found.
                        </td>
                    </tr>
                `;

                return;
            }


            tableBody.innerHTML =
                filtered
                    .map(
                        function (item) {

                            return `

                                <tr>

                                    <td>
                                        ${
                                            item.career_name ||
                                            "Unknown"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            item.match_percentage !== null
                                                ? item.match_percentage + "%"
                                                : "—"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            item.rank ??
                                            "—"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            item.strengths ||
                                            "Top career match"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            formatDate(
                                                item.created_at
                                            )
                                        }
                                    </td>

                                </tr>

                            `;

                        }
                    )
                    .join("");

        }


      
// ========================================
// RENDER CHARTS
// ========================================

function renderCharts() {

    if (typeof Chart === "undefined") {
        console.error("❌ Chart.js is not loaded.");
        return;
    }

    console.log("📈 Chart.js detected.");

    // ========================================
    // CHECK CANVASES
    // ========================================

    if (!distributionCanvas) {
        console.error(
            "❌ careerDistributionChart canvas not found."
        );
    }

    if (!mathsCanvas) {
        console.error(
            "❌ careerMathsChart canvas not found."
        );
    }

    // ========================================
    // CAREER DISTRIBUTION CHART
    // ========================================

    var careerCounts = {};

    careerResults.forEach(function (item) {

        var career =
            String(
                item.career_name || "Unknown"
            ).trim();

        careerCounts[career] =
            (careerCounts[career] || 0) + 1;

    });

    var careerNames =
        Object.keys(careerCounts);

    careerNames.sort(function (a, b) {

        return (
            careerCounts[b] -
            careerCounts[a]
        );

    });

    var topCareers =
        careerNames.slice(0, 8);


    if (distributionCanvas) {

        if (distributionChart) {
            distributionChart.destroy();
        }

        distributionChart =
            new Chart(
                distributionCanvas,
                {
                    type: "bar",

                    data: {
                        labels: topCareers,

                        datasets: [
                            {
                                label: "Students",

                                data:
                                    topCareers.map(
                                        function (career) {
                                            return careerCounts[career];
                                        }
                                    ),

                                borderWidth: 1
                            }
                        ]
                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                display: false
                            },

                            title: {
                                display: true,
                                text: "Career Distribution"
                            }

                        },

                        scales: {

                            y: {
                                beginAtZero: true,

                                ticks: {
                                    precision: 0
                                }

                            }

                        }

                    }

                }
            );

        console.log(
            "✅ Career Distribution chart created."
        );

    }


    // ========================================
    // MATCH PERFORMANCE CHART
    // ========================================

    var matchBuckets = {

        "0-20%": 0,

        "21-40%": 0,

        "41-60%": 0,

        "61-80%": 0,

        "81-100%": 0

    };


    careerResults.forEach(function (item) {

        var match =
            Number(
                item.match_percentage
            );

        if (isNaN(match)) {
            return;
        }

        if (match <= 20) {

            matchBuckets["0-20%"]++;

        } else if (match <= 40) {

            matchBuckets["21-40%"]++;

        } else if (match <= 60) {

            matchBuckets["41-60%"]++;

        } else if (match <= 80) {

            matchBuckets["61-80%"]++;

        } else {

            matchBuckets["81-100%"]++;

        }

    });


    if (mathsCanvas) {

        if (mathsChart) {
            mathsChart.destroy();
        }

        mathsChart =
            new Chart(
                mathsCanvas,
                {
                    type: "line",

                    data: {

                        labels:
                            Object.keys(
                                matchBuckets
                            ),

                        datasets: [
                            {
                                label:
                                    "Students",

                                data:
                                    Object.values(
                                        matchBuckets
                                    ),

                                borderWidth: 2,

                                tension: 0.3,

                                fill: false
                            }
                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            title: {
                                display: true,
                                text:
                                    "Career Match Performance"
                            }

                        },

                        scales: {

                            y: {

                                beginAtZero: true,

                                ticks: {
                                    precision: 0
                                }

                            }

                        }

                    }

                }
            );

        console.log(
            "✅ Career Match chart created."
        );

    }

}



        // ========================================
        // SEARCH
        // ========================================

        if (search) {

            search.addEventListener(
                "input",
                renderTable
            );

        }


        // ========================================
        // INITIAL LOAD
        // ========================================

        loadCareerResults();

    }


    // ========================================
    // INITIALIZE
    // ========================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCareerAnalytics
        );

    } else {

        initCareerAnalytics();

    }

})();
/* ==========================================
   SCHOOL DIGITAL PULSE
   ========================================== */

async function loadAdminSchoolPulse() {
    const page = document.getElementById("admin-school-pulse");

    if (!page) return;

    const studentsEl = document.getElementById("adminPulseStudents");
    const facultyEl = document.getElementById("adminPulseFaculty");
    const careerEl = document.getElementById("adminPulseCareer");
    const achievementsEl = document.getElementById("adminPulseAchievements");

    const activityContainer = document.getElementById("adminPulseActivity");

    const insightTitle = document.getElementById("adminPulseInsightTitle");
    const insightText = document.getElementById("adminPulseInsightText");

    if (
        !studentsEl ||
        !facultyEl ||
        !careerEl ||
        !achievementsEl ||
        !activityContainer
    ) {
        return;
    }

    async function getSchoolPulseData() {

        const [
            profilesResult,
            assessmentsResult,
            achievementsResult,
            savedCareersResult
        ] = await Promise.all([

            supabaseClient
                .from("profiles")
                .select("id, full_name, role, class"),

            supabaseClient
                .from("career_assessments")
                .select("id, student_id, status, attempt_number")
                .eq("status", "completed"),

            supabaseClient
                .from("achievements")
                .select("*"),

            supabaseClient
                .from("saved_careers")
                .select("id, student_id, career_name, career_category")
        ]);

        if (profilesResult.error) {
            throw profilesResult.error;
        }

        if (assessmentsResult.error) {
            throw assessmentsResult.error;
        }

        if (achievementsResult.error) {
            throw achievementsResult.error;
        }

        if (savedCareersResult.error) {
            throw savedCareersResult.error;
        }

        return {
            profiles: profilesResult.data || [],
            assessments: assessmentsResult.data || [],
            achievements: achievementsResult.data || [],
            savedCareers: savedCareersResult.data || []
        };
    }


    function renderSummary(data) {

        const students = data.profiles.filter(function (profile) {
            return profile.role === "student";
        });

        const faculty = data.profiles.filter(function (profile) {
            return profile.role === "teacher";
        });

        const studentsWithAssessment = new Set(
            data.assessments.map(function (assessment) {
                return assessment.student_id;
            })
        );

        const careerPercentage = students.length
            ? Math.round(
                (studentsWithAssessment.size / students.length) * 100
            )
            : 0;

        studentsEl.textContent = students.length;
        facultyEl.textContent = faculty.length;
        careerEl.textContent = careerPercentage + "%";
        achievementsEl.textContent = data.achievements.length;

        return {
            students,
            faculty,
            studentsWithAssessment,
            careerPercentage
        };
    }


    function renderActivity(data, summary) {

        const savedCareerCount = data.savedCareers.length;

        const uniqueCareerCount = new Set(
            data.savedCareers
                .map(function (career) {
                    return career.career_name;
                })
                .filter(Boolean)
        ).size;

        const achievementStudents = new Set(
            data.achievements.map(function (achievement) {
                return achievement.student_id;
            })
        ).size;

        activityContainer.innerHTML = `

            <article class="admin-pulse-activity-card">

                <div class="admin-pulse-activity-icon">
                    🎯
                </div>

                <h3>Career Exploration</h3>

                <p>
                    Students who have completed a NAVENTRA career assessment.
                </p>

                <div class="admin-pulse-activity-value">
                    ${summary.studentsWithAssessment.size}
                </div>

                <div class="admin-pulse-activity-meta">
                    ${summary.careerPercentage}% of student accounts
                </div>

            </article>


            <article class="admin-pulse-activity-card">

                <div class="admin-pulse-activity-icon">
                    🧭
                </div>

                <h3>Career Interests</h3>

                <p>
                    Career interests saved by students while exploring NAVENTRA.
                </p>

                <div class="admin-pulse-activity-value">
                    ${savedCareerCount}
                </div>

                <div class="admin-pulse-activity-meta">
                    ${uniqueCareerCount} unique career${uniqueCareerCount === 1 ? "" : "s"}
                </div>

            </article>


            <article class="admin-pulse-activity-card">

                <div class="admin-pulse-activity-icon">
                    🏆
                </div>

                <h3>Achievement Activity</h3>

                <p>
                    Student achievements currently recorded in NAVENTRA.
                </p>

                <div class="admin-pulse-activity-value">
                    ${data.achievements.length}
                </div>

                <div class="admin-pulse-activity-meta">
                    ${achievementStudents} student${achievementStudents === 1 ? "" : "s"} with achievements
                </div>

            </article>
        `;
    }


    function generateInsight(data, summary) {

        if (!summary.students.length) {

            insightTitle.textContent = "Start building the school pulse";

            insightText.textContent =
                "NAVENTRA does not have student activity data available yet. Once students begin using the platform, school-wide patterns will appear here.";

            return;
        }


        const careerRate = summary.careerPercentage;

        const savedCareerCount = data.savedCareers.length;

        const achievementCount = data.achievements.length;


        if (careerRate >= 75) {

            insightTitle.textContent =
                "Strong career exploration activity";

            insightText.textContent =
                careerRate +
                "% of students have completed a career assessment. NAVENTRA is seeing strong participation in career exploration across the student community.";

            return;
        }


        if (careerRate >= 40) {

            insightTitle.textContent =
                "Career exploration is growing";

            insightText.textContent =
                careerRate +
                "% of students have completed a career assessment, with " +
                savedCareerCount +
                " career interests currently saved. The school is building a useful picture of student interests.";

            return;
        }


        if (achievementCount > 0) {

            insightTitle.textContent =
                "Student activity is beginning to build";

            insightText.textContent =
                "NAVENTRA currently records " +
                achievementCount +
                " achievement" +
                (achievementCount === 1 ? "" : "s") +
                ". As more students explore careers and record achievements, the school pulse will become more informative.";

            return;
        }


        insightTitle.textContent =
            "NAVENTRA is establishing its school pulse";

        insightText.textContent =
            "Student activity is still developing. Career exploration, saved interests, and achievements will gradually create a clearer picture of how the school is using NAVENTRA.";
    }


    async function updateSchoolPulse() {

        activityContainer.innerHTML = `
            <div class="admin-pulse-loading">
                <div>✨</div>
                <h3>NAVENTRA is reading school activity...</h3>
                <p>Analyzing available student and faculty data.</p>
            </div>
        `;

        try {

            const data = await getSchoolPulseData();

            const summary = renderSummary(data);

            renderActivity(data, summary);

            generateInsight(data, summary);

            console.log(
                "🏫 NAVENTRA School Digital Pulse loaded:",
                summary.students.length,
                "students,",
                summary.faculty.length,
                "faculty"
            );

        } catch (error) {

            console.error(
                "School Digital Pulse error:",
                error
            );

            studentsEl.textContent = "—";
            facultyEl.textContent = "—";
            careerEl.textContent = "—";
            achievementsEl.textContent = "—";

            activityContainer.innerHTML = `
                <div class="admin-pulse-loading">
                    <div>⚠️</div>
                    <h3>Could not load school pulse</h3>
                    <p>
                        NAVENTRA could not access the required school activity data.
                    </p>
                </div>
            `;

            insightTitle.textContent =
                "School activity is temporarily unavailable";

            insightText.textContent =
                "NAVENTRA could not retrieve the information required to generate the school-wide digital pulse.";
        }
    }


    await updateSchoolPulse();
}


if (document.getElementById("admin-school-pulse")) {
    loadAdminSchoolPulse();
}
/* =========================================================
   NAVENTRA — CAREER TREND MAP
   ========================================================= */

async function loadAdminCareerTrendMap() {

    const page = document.getElementById("admin-career-trends");

    if (!page) return;


    const totalInterestsEl =
        document.getElementById("adminTrendTotalInterests");

    const uniqueCareersEl =
        document.getElementById("adminTrendUniqueCareers");

    const studentsEl =
        document.getElementById("adminTrendStudents");

    const topCareerEl =
        document.getElementById("adminTrendTopCareer");

    const careerList =
        document.getElementById("adminCareerTrendList");

    const categoryList =
        document.getElementById("adminCareerCategoryList");

    const insightTitle =
        document.getElementById("adminCareerTrendInsightTitle");

    const insightText =
        document.getElementById("adminCareerTrendInsightText");


    if (
        !totalInterestsEl ||
        !uniqueCareersEl ||
        !studentsEl ||
        !topCareerEl ||
        !careerList ||
        !categoryList
    ) {
        return;
    }


    async function getCareerTrendData() {

        const [
            savedCareersResult,
            profilesResult
        ] = await Promise.all([

            supabaseClient
                .from("saved_careers")
                .select(
                    "id, student_id, career_name, career_category"
                ),

            supabaseClient
                .from("profiles")
                .select(
                    "id, full_name, role, class"
                )
                .eq("role", "student")
        ]);


        if (savedCareersResult.error) {
            throw savedCareersResult.error;
        }

        if (profilesResult.error) {
            throw profilesResult.error;
        }


        return {
            savedCareers: savedCareersResult.data || [],
            students: profilesResult.data || []
        };
    }


    function analyzeCareerTrends(data) {

        const careerCounts = {};
        const categoryCounts = {};

        const studentsWithCareers = new Set();


        data.savedCareers.forEach(function (career) {

            const careerName =
                career.career_name || "Unknown Career";

            const careerCategoryMap = {
    "Education & Learning": "Education & Learning",
    "Psychology & Human Behaviour": "Psychology & Human Behaviour",
    "Media & Communication": "Media & Communication",

    "Medicine & Healthcare": "Healthcare & Medicine",
    "Technology & Computing": "Technology & Computing",
    "Engineering": "Engineering",
    "Business & Management": "Business & Management",
    "Law & Justice": "Law & Justice",
    "Science & Research": "Science & Research",
    "Arts & Design": "Arts & Design",
    "Media & Entertainment": "Media & Entertainment",
    "Social Sciences": "Social Sciences",
    "Architecture & Design": "Architecture & Design",
    "Hospitality & Tourism": "Hospitality & Tourism",
    "Environment & Sustainability": "Environment & Sustainability",
    "Sports & Fitness": "Sports & Fitness",
    "Government & Public Service": "Government & Public Service"
};

const category =
    careerCategoryMap[career.career_name] ||
    career.career_category ||
    "Other";


            careerCounts[careerName] =
                (careerCounts[careerName] || 0) + 1;


            categoryCounts[category] =
                (categoryCounts[category] || 0) + 1;


            if (career.student_id) {
                studentsWithCareers.add(
                    career.student_id
                );
            }
        });


        const sortedCareers =
            Object.entries(careerCounts)
                .sort(function (a, b) {
                    return b[1] - a[1];
                });


        const sortedCategories =
            Object.entries(categoryCounts)
                .sort(function (a, b) {
                    return b[1] - a[1];
                });


        return {
            careerCounts,
            categoryCounts,
            sortedCareers,
            sortedCategories,
            studentsWithCareers
        };
    }


    function renderSummary(data, analysis) {

        totalInterestsEl.textContent =
            data.savedCareers.length;


        uniqueCareersEl.textContent =
            analysis.sortedCareers.length;


        studentsEl.textContent =
            analysis.studentsWithCareers.size;


        topCareerEl.textContent =
            analysis.sortedCareers.length
                ? analysis.sortedCareers[0][0]
                : "—";
    }


    function renderCareerList(analysis) {

        if (!analysis.sortedCareers.length) {

            careerList.innerHTML = `
                <div class="admin-career-trend-loading">

                    <div>🧭</div>

                    <h3>No career interests yet</h3>

                    <p>
                        Saved career interests will appear here
                        as students explore NAVENTRA.
                    </p>

                </div>
            `;

            return;
        }


        const topCareers =
            analysis.sortedCareers.slice(0, 10);


        careerList.innerHTML =
            topCareers.map(function (entry, index) {

                const careerName = entry[0];
                const count = entry[1];


                return `

                    <article class="admin-career-trend-item">

                        <div class="admin-career-trend-rank">
                            ${index + 1}
                        </div>


                        <div class="admin-career-trend-main">

                            <strong>
                                ${careerName}
                            </strong>

                            <span>
                                ${count === 1
                                    ? "1 saved interest"
                                    : count + " saved interests"}
                            </span>

                        </div>


                        <div class="admin-career-trend-count">

                            <strong>
                                ${count}
                            </strong>

                            <span>
                                ${count === 1
                                    ? "student"
                                    : "students"}
                            </span>

                        </div>

                    </article>

                `;

            }).join("");
    }


    function renderCategories(analysis) {

        if (!analysis.sortedCategories.length) {

            categoryList.innerHTML = `
                <div class="admin-career-trend-loading">

                    <div>📊</div>

                    <h3>No categories available</h3>

                    <p>
                        Career categories will appear here
                        once students save career interests.
                    </p>

                </div>
            `;

            return;
        }


        const maximum =
            analysis.sortedCategories[0][1];


        categoryList.innerHTML =
            analysis.sortedCategories
                .slice(0, 9)
                .map(function (entry) {

                    const category = entry[0];
                    const count = entry[1];

                    const percentage =
                        maximum
                            ? Math.round(
                                (count / maximum) * 100
                            )
                            : 0;


                    return `

                        <article
                            class="admin-career-category-card"
                        >

                            <div
                                class="admin-career-category-top"
                            >

                                <span
                                    class="admin-career-category-name"
                                >
                                    ${category}
                                </span>

                                <span
                                    class="admin-career-category-count"
                                >
                                    ${count}
                                </span>

                            </div>


                            <div
                                class="admin-career-category-bar"
                            >

                                <div
                                    class="admin-career-category-fill"
                                    style="width: ${percentage}%"
                                ></div>

                            </div>


                            <div
                                class="admin-career-category-meta"
                            >
                                ${count === 1
                                    ? "1 saved interest"
                                    : count + " saved interests"}
                            </div>

                        </article>

                    `;

                })
                .join("");
    }


    function generateCareerInsight(analysis) {

        if (!analysis.sortedCareers.length) {

            insightTitle.textContent =
                "Career trends are waiting to emerge";

            insightText.textContent =
                "There are no saved career interests yet. As students explore NAVENTRA, this space will reveal the school's emerging career interests.";

            return;
        }


        const topCareer =
            analysis.sortedCareers[0][0];

        const topCareerCount =
            analysis.sortedCareers[0][1];


        const topCategory =
            analysis.sortedCategories.length
                ? analysis.sortedCategories[0][0]
                : "multiple areas";


        if (topCareerCount >= 3) {

            insightTitle.textContent =
                topCareer + " is currently leading";

            insightText.textContent =
                topCareer +
                " has been saved " +
                topCareerCount +
                " times, making it the most explored career in the current NAVENTRA dataset. " +
                topCategory +
                " is currently the strongest career category.";

            return;
        }


        if (analysis.sortedCareers.length >= 3) {

            insightTitle.textContent =
                "Students are exploring diverse paths";

            insightText.textContent =
                "The current career landscape includes " +
                analysis.sortedCareers.length +
                " different career interests. No single path dominates yet, suggesting a broad range of student interests.";

            return;
        }


        insightTitle.textContent =
            "Early career interests are emerging";

        insightText.textContent =
            "Students have begun saving career interests in NAVENTRA. As more students explore the platform, clearer school-wide career patterns will emerge.";
    }


    async function updateCareerTrendMap() {

        careerList.innerHTML = `
            <div class="admin-career-trend-loading">

                <div>🧬</div>

                <h3>Mapping career interests...</h3>

                <p>
                    NAVENTRA is analyzing saved career interests
                    across the school.
                </p>

            </div>
        `;


        try {

            const data =
                await getCareerTrendData();


            const analysis =
                analyzeCareerTrends(data);


            renderSummary(
                data,
                analysis
            );


            renderCareerList(
                analysis
            );


            renderCategories(
                analysis
            );


            generateCareerInsight(
                analysis
            );


            console.log(
                "🧬 NAVENTRA Career Trend Map loaded:",
                data.savedCareers.length,
                "saved interests,",
                analysis.sortedCareers.length,
                "unique careers."
            );

        } catch (error) {

            console.error(
                "Career Trend Map error:",
                error
            );


            totalInterestsEl.textContent = "—";
            uniqueCareersEl.textContent = "—";
            studentsEl.textContent = "—";
            topCareerEl.textContent = "—";


            careerList.innerHTML = `
                <div class="admin-career-trend-loading">

                    <div>⚠️</div>

                    <h3>
                        Could not load career trends
                    </h3>

                    <p>
                        NAVENTRA could not access
                        the saved career information.
                    </p>

                </div>
            `;


            categoryList.innerHTML = "";


            insightTitle.textContent =
                "Career trends are temporarily unavailable";


            insightText.textContent =
                "NAVENTRA could not retrieve the information required to generate the school-wide career trend map.";
        }
    }


    await updateCareerTrendMap();
}


if (document.getElementById("admin-career-trends")) {
    loadAdminCareerTrendMap();
}
// =========================================================
// NAVENTRA ADMIN - LOST & FOUND INTELLIGENCE
// =========================================================

async function loadAdminLostFoundIntelligence() {

    var page =
        document.getElementById(
            "admin-lost-found-intelligence"
        );

    if (!page) {
        return;
    }


    var totalEl =
        document.getElementById(
            "adminLFITotalItems"
        );

    var activeEl =
        document.getElementById(
            "adminLFIActiveItems"
        );

    var claimsEl =
        document.getElementById(
            "adminLFIClaims"
        );

    var recoveryEl =
        document.getElementById(
            "adminLFIRecoveryRate"
        );

    var topCategoryEl =
        document.getElementById(
            "adminLFITopCategory"
        );

    var topCategoryTextEl =
        document.getElementById(
            "adminLFITopCategoryText"
        );

    var topLocationEl =
        document.getElementById(
            "adminLFITopLocation"
        );

    var topLocationTextEl =
        document.getElementById(
            "adminLFITopLocationText"
        );

    var topItemEl =
        document.getElementById(
            "adminLFITopItem"
        );

    var topItemTextEl =
        document.getElementById(
            "adminLFITopItemText"
        );

    var pendingRecoveryEl =
        document.getElementById(
            "adminLFIPendingRecovery"
        );

    var categoryList =
        document.getElementById(
            "adminLFICategoryList"
        );

    var locationList =
        document.getElementById(
            "adminLFILocationList"
        );

    var insightTitle =
        document.getElementById(
            "adminLFIInsightTitle"
        );

    var insightText =
        document.getElementById(
            "adminLFIInsightText"
        );


    if (
        !totalEl ||
        !activeEl ||
        !claimsEl ||
        !recoveryEl ||
        !categoryList ||
        !locationList
    ) {
        return;
    }


    try {

        categoryList.innerHTML = `
            <div class="admin-lfi-loading">
                <div>🔍</div>
                <h3>Analyzing Lost & Found patterns...</h3>
                <p>NAVENTRA is studying available recovery data.</p>
            </div>
        `;


        var itemsResult =
            await supabaseClient
                .from("lost_items")
                .select("*");


        if (itemsResult.error) {
            throw itemsResult.error;
        }


        var claimsResult =
            await supabaseClient
                .from("lost_found_claims")
                .select("*");


        if (claimsResult.error) {
            throw claimsResult.error;
        }


        var items =
            itemsResult.data || [];

        var claims =
            claimsResult.data || [];


        // =================================================
        // BASIC COUNTS
        // =================================================

        var totalItems =
            items.length;


        var returnedItems =
            items.filter(function (item) {

                var status =
                    String(
                        item.status || ""
                    )
                        .toLowerCase()
                        .trim();

                return (
                    status === "returned" ||
                    status === "collected"
                );

            });


        var activeItems =
            items.filter(function (item) {

                var status =
                    String(
                        item.status || ""
                    )
                        .toLowerCase()
                        .trim();

                return (
                    status !== "returned" &&
                    status !== "collected"
                );

            });


        var recoveryRate =
            totalItems > 0
                ? Math.round(
                    (
                        returnedItems.length /
                        totalItems
                    ) * 100
                )
                : 0;


        totalEl.textContent =
            totalItems;

        activeEl.textContent =
            activeItems.length;

        claimsEl.textContent =
            claims.length;

        recoveryEl.textContent =
            recoveryRate + "%";

        pendingRecoveryEl.textContent =
            activeItems.length;


        // =================================================
        // CATEGORY COUNTS
        // =================================================

        var categoryCounts = {};


        items.forEach(function (item) {

            var category =
                String(
                    item.category || "Other"
                ).trim();

            if (!category) {
                category = "Other";
            }

            categoryCounts[category] =
                (
                    categoryCounts[category] ||
                    0
                ) + 1;

        });


        var sortedCategories =
            Object.entries(
                categoryCounts
            ).sort(function (a, b) {

                return b[1] - a[1];

            });


        // =================================================
        // LOCATION COUNTS
        // =================================================

        var locationCounts = {};


        items.forEach(function (item) {

            var location =
                String(
                    item.location_found ||
                    "Unknown location"
                ).trim();

            if (!location) {
                location = "Unknown location";
            }

            locationCounts[location] =
                (
                    locationCounts[location] ||
                    0
                ) + 1;

        });


        var sortedLocations =
            Object.entries(
                locationCounts
            ).sort(function (a, b) {

                return b[1] - a[1];

            });


        // =================================================
        // ITEM NAME COUNTS
        // =================================================

        var itemCounts = {};


        items.forEach(function (item) {

            var name =
                String(
                    item.item_name ||
                    "Unnamed Item"
                ).trim();

            if (!name) {
                name = "Unnamed Item";
            }


            itemCounts[name] =
                (
                    itemCounts[name] ||
                    0
                ) + 1;

        });


        var sortedItems =
            Object.entries(
                itemCounts
            ).sort(function (a, b) {

                return b[1] - a[1];

            });


        // =================================================
        // TOP CATEGORY
        // =================================================

        if (sortedCategories.length) {

            var topCategory =
                sortedCategories[0];

            topCategoryEl.textContent =
                topCategory[0];

            topCategoryTextEl.textContent =
                topCategory[1] +
                (
                    topCategory[1] === 1
                        ? " item belongs to this category."
                        : " items belong to this category."
                );

        }


        // =================================================
        // TOP LOCATION
        // =================================================

        if (sortedLocations.length) {

            var topLocation =
                sortedLocations[0];

            topLocationEl.textContent =
                topLocation[0];

            topLocationTextEl.textContent =
                topLocation[1] +
                (
                    topLocation[1] === 1
                        ? " item reported here."
                        : " items reported here."
                );

        }


        // =================================================
        // TOP ITEM
        // =================================================

        if (sortedItems.length) {

            var topItem =
                sortedItems[0];

            topItemEl.textContent =
                topItem[0];

            topItemTextEl.textContent =
                topItem[1] +
                (
                    topItem[1] === 1
                        ? " occurrence recorded."
                        : " occurrences recorded."
                );

        }


        // =================================================
        // CATEGORY LIST
        // =================================================

        if (!sortedCategories.length) {

            categoryList.innerHTML = `
                <div class="admin-lfi-loading">
                    <div>📦</div>
                    <h3>No category data yet</h3>
                    <p>Categories will appear as items are recorded.</p>
                </div>
            `;

        } else {

            var maxCategory =
                sortedCategories[0][1];


            categoryList.innerHTML =
                sortedCategories
                    .slice(0, 8)
                    .map(function (entry) {

                        var category =
                            entry[0];

                        var count =
                            entry[1];

                        var percentage =
                            maxCategory > 0
                                ? Math.round(
                                    (
                                        count /
                                        maxCategory
                                    ) * 100
                                )
                                : 0;


                        return `
                            <article class="admin-lfi-category-item">

                                <div class="admin-lfi-row-top">

                                    <span class="admin-lfi-row-name">
                                        ${category}
                                    </span>

                                    <span class="admin-lfi-row-count">
                                        ${count}
                                    </span>

                                </div>

                                <div class="admin-lfi-row-bar">

                                    <div
                                        class="admin-lfi-row-fill"
                                        style="width:${percentage}%"
                                    ></div>

                                </div>

                                <span class="admin-lfi-row-meta">
                                    ${count === 1
                                        ? "1 recorded item"
                                        : count + " recorded items"}
                                </span>

                            </article>
                        `;

                    })
                    .join("");

        }


        // =================================================
        // LOCATION LIST
        // =================================================

        if (!sortedLocations.length) {

            locationList.innerHTML = `
                <div class="admin-lfi-loading">
                    <div>📍</div>
                    <h3>No location data yet</h3>
                    <p>Locations will appear as items are recorded.</p>
                </div>
            `;

        } else {

            var maxLocation =
                sortedLocations[0][1];


            locationList.innerHTML =
                sortedLocations
                    .slice(0, 8)
                    .map(function (entry) {

                        var location =
                            entry[0];

                        var count =
                            entry[1];

                        var percentage =
                            maxLocation > 0
                                ? Math.round(
                                    (
                                        count /
                                        maxLocation
                                    ) * 100
                                )
                                : 0;


                        return `
                            <article class="admin-lfi-location-item">

                                <div class="admin-lfi-row-top">

                                    <span class="admin-lfi-row-name">
                                        📍 ${location}
                                    </span>

                                    <span class="admin-lfi-row-count">
                                        ${count}
                                    </span>

                                </div>

                                <div class="admin-lfi-row-bar">

                                    <div
                                        class="admin-lfi-row-fill"
                                        style="width:${percentage}%"
                                    ></div>

                                </div>

                                <span class="admin-lfi-row-meta">
                                    ${count === 1
                                        ? "1 reported item"
                                        : count + " reported items"}
                                </span>

                            </article>
                        `;

                    })
                    .join("");

        }


        // =================================================
        // NAVENTRA INSIGHT
        // =================================================

        if (!items.length) {

            insightTitle.textContent =
                "Lost & Found patterns are waiting to emerge";

            insightText.textContent =
                "There are no Lost & Found records yet. As items are reported, NAVENTRA will identify recurring categories, locations, and recovery patterns.";

        } else if (recoveryRate >= 70) {

            insightTitle.textContent =
                "Strong recovery activity";

            insightText.textContent =
                recoveryRate +
                "% of recorded Lost & Found items have been marked as returned or collected. The current recovery pattern is encouraging.";

        } else if (recoveryRate >= 40) {

            insightTitle.textContent =
                "Recovery activity is developing";

            insightText.textContent =
                recoveryRate +
                "% of recorded items have been recovered. NAVENTRA can help identify where additional attention may improve recovery.";

        } else {

            insightTitle.textContent =
                "More items may need recovery attention";

            insightText.textContent =
                recoveryRate +
                "% of recorded items have been returned or collected. The remaining active items may benefit from continued follow-up.";

        }


        console.log(
            "🔍 NAVENTRA Lost & Found Intelligence loaded:",
            totalItems,
            "items,",
            claims.length,
            "claims."
        );


    } catch (error) {

        console.error(
            "Lost & Found Intelligence error:",
            error
        );


        totalEl.textContent = "—";
        activeEl.textContent = "—";
        claimsEl.textContent = "—";
        recoveryEl.textContent = "—";
        pendingRecoveryEl.textContent = "—";


        categoryList.innerHTML = `
            <div class="admin-lfi-loading">
                <div>⚠️</div>
                <h3>Could not load Lost & Found intelligence</h3>
                <p>NAVENTRA could not access the required Lost & Found information.</p>
            </div>
        `;


        locationList.innerHTML = "";


        insightTitle.textContent =
            "Intelligence is temporarily unavailable";

        insightText.textContent =
            "NAVENTRA could not retrieve the Lost & Found information required for this analysis.";

    }

}


if (
    document.getElementById(
        "admin-lost-found-intelligence"
    )
) {

    loadAdminLostFoundIntelligence();

}
async function loadAdminFaculty() {

    var page = document.getElementById("admin-faculty");

    if (!page) return;


    var totalEl =
        document.getElementById("adminFacultyTotal");

    var subjectsEl =
        document.getElementById("adminFacultySubjects");

    var departmentsEl =
        document.getElementById("adminFacultyDepartments");

    var activeEl =
        document.getElementById("adminFacultyActive");

    var list =
        document.getElementById("adminFacultyList");

    var searchInput =
        document.getElementById("adminFacultySearch");

    var statusFilter =
        document.getElementById("adminFacultyStatusFilter");


    var addBtn =
        document.getElementById("adminFacultyAddBtn");

    var modal =
        document.getElementById("adminFacultyModal");

    var closeBtn =
        document.getElementById("adminFacultyCloseBtn");

    var cancelBtn =
        document.getElementById("adminFacultyCancelBtn");

    var form =
        document.getElementById("adminFacultyForm");


    if (
        !totalEl ||
        !subjectsEl ||
        !departmentsEl ||
        !activeEl ||
        !list
    ) return;


    var facultyData = [];


    async function fetchFaculty() {

        list.innerHTML = `
            <div class="admin-faculty-loading">
                <div>✨</div>
                <h3>Loading faculty directory...</h3>
                <p>NAVENTRA is retrieving faculty information.</p>
            </div>
        `;


        var result =
            await supabaseClient
                .from("faculty_profiles")
                .select("*")
                .order("full_name", {
                    ascending: true
                });


        if (result.error) {
            throw result.error;
        }


        facultyData =
            result.data || [];


        renderFaculty();
    }


    function renderFaculty() {

        var search =
            String(
                searchInput.value || ""
            )
                .toLowerCase()
                .trim();


        var selectedStatus =
            statusFilter.value;


        var filtered =
            facultyData.filter(function(faculty) {

                var searchable =
                    [
                        faculty.full_name,
                        faculty.subject,
                        faculty.department,
                        faculty.classes
                    ]
                        .join(" ")
                        .toLowerCase();


                var matchesSearch =
                    !search ||
                    searchable.includes(search);


                var matchesStatus =
                    selectedStatus === "all" ||
                    faculty.status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            });


        var subjects =
            new Set(
                facultyData
                    .map(function(f) {
                        return String(
                            f.subject || ""
                        ).trim();
                    })
                    .filter(Boolean)
            );


        var departments =
            new Set(
                facultyData
                    .map(function(f) {
                        return String(
                            f.department || ""
                        ).trim();
                    })
                    .filter(Boolean)
            );


        var active =
            facultyData.filter(function(f) {
                return f.status === "active";
            });


        totalEl.textContent =
            facultyData.length;

        subjectsEl.textContent =
            subjects.size;

        departmentsEl.textContent =
            departments.size;

        activeEl.textContent =
            active.length;


        if (!filtered.length) {

            list.innerHTML = `
                <div class="admin-faculty-loading">
                    <div>👩‍🏫</div>
                    <h3>No faculty found</h3>
                    <p>
                        Try changing your search or add a new faculty member.
                    </p>
                </div>
            `;

            return;
        }


        list.innerHTML =
            filtered.map(function(faculty) {

                var initials =
                    getFacultyInitials(
                        faculty.full_name
                    );


                return `
                    <article
                        class="admin-faculty-card"
                    >

                        <div
                            class="admin-faculty-card-top"
                        >

                            <div
                                class="admin-faculty-person"
                            >

                                <div
                                    class="admin-faculty-avatar"
                                >
                                    ${initials}
                                </div>

                                <div>

                                    <h3
                                        class="admin-faculty-name"
                                    >
                                        ${escapeFacultyHTML(
                                            faculty.full_name
                                        )}
                                    </h3>

                                    <div
                                        class="admin-faculty-role"
                                    >
                                        ${escapeFacultyHTML(
                                            faculty.subject ||
                                            "Faculty Member"
                                        )}
                                    </div>

                                </div>

                            </div>


                            <span
                                class="admin-faculty-status ${faculty.status === "active" ? "active" : "inactive"}"
                            >
                                ${faculty.status || "active"}
                            </span>

                        </div>


                        <div
                            class="admin-faculty-details"
                        >

                            <div
                                class="admin-faculty-detail"
                            >
                                <span>
                                    Department
                                </span>

                                <strong>
                                    ${escapeFacultyHTML(
                                        faculty.department ||
                                        "Not assigned"
                                    )}
                                </strong>
                            </div>


                            <div
                                class="admin-faculty-detail"
                            >
                                <span>
                                    Classes
                                </span>

                                <strong>
                                    ${escapeFacultyHTML(
                                        faculty.classes ||
                                        "Not assigned"
                                    )}
                                </strong>
                            </div>


                            <div
                                class="admin-faculty-detail"
                            >
                                <span>
                                    Email
                                </span>

                                <strong>
                                    ${escapeFacultyHTML(
                                        faculty.email ||
                                        "Not provided"
                                    )}
                                </strong>
                            </div>


                            <div
                                class="admin-faculty-detail"
                            >
                                <span>
                                    Phone
                                </span>

                                <strong>
                                    ${escapeFacultyHTML(
                                        faculty.phone ||
                                        "Not provided"
                                    )}
                                </strong>
                            </div>

                        </div>


                        <div
                            class="admin-faculty-card-actions"
                        >

                            <button
                                class="admin-faculty-edit-btn"
                                data-faculty-edit="${faculty.id}"
                            >
                                ✏️ Edit
                            </button>

                            <button
                                class="admin-faculty-delete-btn"
                                data-faculty-delete="${faculty.id}"
                            >
                                🗑 Delete
                            </button>

                        </div>

                    </article>
                `;

            }).join("");


        document
            .querySelectorAll(
                "[data-faculty-edit]"
            )
            .forEach(function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        openEditFaculty(
                            button.getAttribute(
                                "data-faculty-edit"
                            )
                        );

                    }
                );

            });


        document
            .querySelectorAll(
                "[data-faculty-delete]"
            )
            .forEach(function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        deleteFaculty(
                            button.getAttribute(
                                "data-faculty-delete"
                            )
                        );

                    }
                );

            });

    }


    function getFacultyInitials(name) {

        var words =
            String(name || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);


        if (!words.length) return "F";


        return words
            .slice(0, 2)
            .map(function(word) {
                return word.charAt(0);
            })
            .join("")
            .toUpperCase();

    }


    function escapeFacultyHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function openModal() {

        modal.classList.add("open");

    }


    function closeModal() {

        modal.classList.remove("open");

        form.reset();

        document.getElementById(
            "adminFacultyId"
        ).value = "";

        document.getElementById(
            "adminFacultyModalTitle"
        ).textContent = "Add Faculty";

    }


    function openEditFaculty(id) {

        var faculty =
            facultyData.find(function(item) {
                return item.id === id;
            });


        if (!faculty) return;


        document.getElementById(
            "adminFacultyId"
        ).value = faculty.id;


        document.getElementById(
            "adminFacultyName"
        ).value = faculty.full_name || "";


        document.getElementById(
            "adminFacultySubject"
        ).value = faculty.subject || "";


        document.getElementById(
            "adminFacultyDepartment"
        ).value = faculty.department || "";


        document.getElementById(
            "adminFacultyClasses"
        ).value = faculty.classes || "";


        document.getElementById(
            "adminFacultyEmail"
        ).value = faculty.email || "";


        document.getElementById(
            "adminFacultyPhone"
        ).value = faculty.phone || "";


        document.getElementById(
            "adminFacultyStatus"
        ).value =
            faculty.status || "active";


        document.getElementById(
            "adminFacultyModalTitle"
        ).textContent = "Edit Faculty";


        openModal();

    }


    async function saveFaculty(event) {

        event.preventDefault();


        var id =
            document.getElementById(
                "adminFacultyId"
            ).value;


        var faculty = {

            full_name:
                document.getElementById(
                    "adminFacultyName"
                ).value.trim(),

            subject:
                document.getElementById(
                    "adminFacultySubject"
                ).value.trim(),

            department:
                document.getElementById(
                    "adminFacultyDepartment"
                ).value.trim(),

            classes:
                document.getElementById(
                    "adminFacultyClasses"
                ).value.trim(),

            email:
                document.getElementById(
                    "adminFacultyEmail"
                ).value.trim(),

            phone:
                document.getElementById(
                    "adminFacultyPhone"
                ).value.trim(),

            status:
                document.getElementById(
                    "adminFacultyStatus"
                ).value,

            updated_at:
                new Date().toISOString()

        };


        try {

            var result;


            if (id) {

                result =
                    await supabaseClient
                        .from("faculty_profiles")
                        .update(faculty)
                        .eq("id", id);

            } else {

                result =
                    await supabaseClient
                        .from("faculty_profiles")
                        .insert(faculty);

            }


            if (result.error) {
                throw result.error;
            }


            closeModal();

            await fetchFaculty();


        } catch (error) {

            console.error(
                "Faculty save error:",
                error
            );

            alert(
                "Could not save faculty information."
            );

        }

    }


    async function deleteFaculty(id) {

        var faculty =
            facultyData.find(function(item) {
                return item.id === id;
            });


        if (!faculty) return;


        var confirmed =
            confirm(
                "Remove " +
                faculty.full_name +
                " from the faculty directory?"
            );


        if (!confirmed) return;


        try {

            var result =
                await supabaseClient
                    .from("faculty_profiles")
                    .delete()
                    .eq("id", id);


            if (result.error) {
                throw result.error;
            }


            await fetchFaculty();


        } catch (error) {

            console.error(
                "Faculty delete error:",
                error
            );

            alert(
                "Could not remove this faculty member."
            );

        }

    }


    addBtn.addEventListener(
        "click",
        function() {

            form.reset();

            document.getElementById(
                "adminFacultyId"
            ).value = "";

            document.getElementById(
                "adminFacultyModalTitle"
            ).textContent = "Add Faculty";

            openModal();

        }
    );


    closeBtn.addEventListener(
        "click",
        closeModal
    );


    cancelBtn.addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {
                closeModal();
            }

        }
    );


    form.addEventListener(
        "submit",
        saveFaculty
    );


    searchInput.addEventListener(
        "input",
        renderFaculty
    );


    statusFilter.addEventListener(
        "change",
        renderFaculty
    );


    try {

        await fetchFaculty();


        console.log(
            "👩‍🏫 NAVENTRA Faculty Management loaded."
        );

    } catch (error) {

        console.error(
            "Faculty Management error:",
            error
        );


        list.innerHTML = `
            <div class="admin-faculty-loading">
                <div>⚠️</div>
                <h3>
                    Could not load faculty directory
                </h3>
                <p>
                    NAVENTRA could not access the faculty database.
                </p>
            </div>
        `;

    }

}


if (
    document.getElementById(
        "admin-faculty"
    )
) {

    loadAdminFaculty();

}
function openModal() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "";

    form.reset();

    document.getElementById("adminFacultyId").value = "";

    document.getElementById("adminFacultyModalTitle").textContent =
        "Add Faculty";
}

function openEditFaculty(id) {

    var faculty = facultyData.find(function(item) {
        return item.id === id;
    });

    if (!faculty) return;

    document.getElementById("adminFacultyId").value =
        faculty.id;

    document.getElementById("adminFacultyName").value =
        faculty.full_name || "";

    document.getElementById("adminFacultySubject").value =
        faculty.subject || "";

    document.getElementById("adminFacultyDepartment").value =
        faculty.department || "";

    document.getElementById("adminFacultyClasses").value =
        faculty.classes || "";

    document.getElementById("adminFacultyEmail").value =
        faculty.email || "";

    document.getElementById("adminFacultyPhone").value =
        faculty.phone || "";

    document.getElementById("adminFacultyStatus").value =
        faculty.status || "active";

    document.getElementById("adminFacultyModalTitle").textContent =
        "Edit Faculty";

    openModal();
}