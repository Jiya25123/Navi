// ========================================
// NAVENTRA NOTIFICATION HELPER
// ========================================

async function createNotification(notificationData) {

    try {

        var result =
            await supabaseClient
                .from("notifications")
                .insert({
                    user_id:
                        notificationData.userId,

                    title:
                        notificationData.title,

                    message:
                        notificationData.message,

                    type:
                        notificationData.type,

                    priority:
                        notificationData.priority || "normal",

                    is_read:
                        false,

                    link:
                        notificationData.link || null,

                    related_id:
                        notificationData.relatedId || null,

                    related_type:
                        notificationData.relatedType || null,

                    expires_at:
                        notificationData.expiresAt || null
                });


        if (result.error) {

            console.error(
                "Could not create notification:",
                result.error
            );

            return false;

        }


        return true;

    } catch (error) {

        console.error(
            "Notification creation error:",
            error
        );

        return false;

    }

}


// ========================================
// NAVENTRA TEACHER DASHBOARD NAVIGATION
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    var sidebarLinks =
        document.querySelectorAll(".teacher-sidebar-link");

    var sections =
        document.querySelectorAll(".teacher-section");

    var pageTitle =
        document.getElementById("teacherPageTitle");

    var sidebar =
        document.getElementById("teacherSidebar");

    var menuButton =
        document.getElementById("teacherMenuBtn");


    // ========================================
    // SWITCH TEACHER PAGE
    // ========================================

    function showTeacherPage(pageId, title) {

        // Hide all sections
        sections.forEach(function (section) {

            section.classList.remove("active");

        });


        // Show selected section
        var selectedSection =
            document.getElementById(pageId);

        if (selectedSection) {

            selectedSection.classList.add("active");

        }


        // Remove active from all menu buttons
        sidebarLinks.forEach(function (link) {

            link.classList.remove("active");

        });


        // Add active to selected menu button
        var selectedLink =
            document.querySelector(
                '.teacher-sidebar-link[data-page="' +
                pageId +
                '"]'
            );

        if (selectedLink) {

            selectedLink.classList.add("active");

        }


        // Change header title
        if (pageTitle) {

            pageTitle.textContent =
                title || "Dashboard";

        }


        // Close mobile sidebar
        if (sidebar) {

            sidebar.classList.remove("open");

        }


        window.scrollTo(0, 0);

    }


    // ========================================
    // SIDEBAR BUTTONS
    // ========================================

    sidebarLinks.forEach(function (link) {

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


                showTeacherPage(
                    pageId,
                    title
                );

            }
        );

    });


    // ========================================
    // QUICK ACTION BUTTONS
    // ========================================

    const actionButtons =
    document.querySelectorAll(
        ".teacher-action-card, .teacher-view-all-btn, .teacher-intelligence-card"
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


                var link =
                    document.querySelector(
                        '.teacher-sidebar-link[data-page="' +
                        pageId +
                        '"]'
                    );


                var title = "Dashboard";


                if (link) {

                    title =
                        link.getAttribute("data-title") ||
                        "Dashboard";

                }


                showTeacherPage(
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
    // INITIAL PAGE
    // ========================================

    showTeacherPage(
        "teacher-dashboard",
        "Dashboard"
    );


    console.log(
        "Teacher Portal navigation loaded successfully."
    );

});

// ========================================
// TEACHER LOST & FOUND
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var lostItemsGrid =
            document.getElementById(
                "teacherLostItemsGrid"
            );

        if (!lostItemsGrid) {
            return;
        }


        var searchInput =
            document.getElementById(
                "teacherLostItemSearch"
            );

        var categoryFilter =
            document.getElementById(
                "teacherLostItemCategory"
            );

        var statusFilter =
            document.getElementById(
                "teacherLostItemStatus"
            );

        var itemCount =
            document.getElementById(
                "teacherLostItemCount"
            );


        var teacherLostItems = [];


        // ========================================
        // LOAD ITEMS
        // ========================================

        async function loadTeacherLostItems() {

            lostItemsGrid.innerHTML = `
                <div class="teacher-loading-state">
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


                var items = result.data;
                var error = result.error;


                if (error) {

                    console.error(
                        "Could not load Lost & Found items:",
                        error
                    );


                    lostItemsGrid.innerHTML = `
                        <div class="teacher-empty-state">
                            <div>⚠️</div>

                            <h3>
                                Could not load items
                            </h3>

                            <p>
                                Please try refreshing the page.
                            </p>
                        </div>
                    `;

                    return;
                }


                teacherLostItems =
                    items || [];


                renderTeacherLostItems();

            } catch (error) {

                console.error(
                    "Lost & Found loading error:",
                    error
                );


                lostItemsGrid.innerHTML = `
                    <div class="teacher-empty-state">
                        <div>⚠️</div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            Please try again.
                        </p>
                    </div>
                `;

            }

        }


        // ========================================
        // CREATE ITEM CARD
        // ========================================

        function createTeacherLostItemCard(item) {

            var status =
                item.status || "Found";


            var statusClass =
                status
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            var imageHTML =
                item.image_url
                    ? `
                        <img
                            src="${item.image_url}"
                            alt="${item.item_name || "Found item"}"
                            class="teacher-lost-item-image"
                        >
                    `
                    : `
                        <div class="teacher-lost-item-image-placeholder">
                            📦
                        </div>
                    `;


            return `

                <article
                    class="teacher-lost-item-card"
                >

                    <div class="teacher-lost-item-image-wrap">

                        ${imageHTML}

                        <span
                            class="teacher-item-status ${statusClass}"
                        >
                            ${status}
                        </span>

                    </div>


                    <div class="teacher-lost-item-content">

                        <span class="teacher-item-category">
                            ${item.category || "Other"}
                        </span>


                        <h3>
                            ${item.item_name || "Unnamed Item"}
                        </h3>


                        <p>
                            ${
                                item.description ||
                                "No description provided."
                            }
                        </p>


                        <div class="teacher-lost-item-meta">

                            <span>
                                📍
                                ${item.location_found || "Unknown location"}
                            </span>

                            <span>
                                📅
                                ${item.date_found || "Unknown date"}
                            </span>

                        </div>


                        ${
                            item.additional_notes
                            ? `
                                <div class="teacher-item-notes">
                                    📝 ${item.additional_notes}
                                </div>
                            `
                            : ""
                        }


                        <div class="teacher-lost-item-actions">

                            <button
                                type="button"
                                class="teacher-secondary-btn"
                                data-item-id="${item.id}"
                            >
                                View Details
                            </button>


                            ${
                                status.toLowerCase() ===
                                "claim pending"
                                ? `
                                    <button
                                        type="button"
                                        class="teacher-primary-small-btn"
                                        data-page="teacher-claims"
                                    >
                                        View Claim
                                    </button>
                                `
                                : ""
                            }

                        </div>

                    </div>

                </article>

            `;

        }


        // ========================================
        // RENDER ITEMS
        // ========================================

        function renderTeacherLostItems() {

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
                teacherLostItems.filter(
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
                            (
                                item.category || ""
                            ).toLowerCase() ===
                            selectedCategory.toLowerCase();


                        var matchesStatus =
                            selectedStatus === "all" ||
                            (
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


            if (itemCount) {

                itemCount.textContent =
                    filteredItems.length +
                    (
                        filteredItems.length === 1
                            ? " item"
                            : " items"
                    );

            }


            if (!filteredItems.length) {

                lostItemsGrid.innerHTML = `

                    <div class="teacher-empty-state">

                        <div>
                            🔍
                        </div>

                        <h3>
                            No items found
                        </h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                    </div>

                `;

                return;
            }


            lostItemsGrid.innerHTML =
                filteredItems
                    .map(
                        createTeacherLostItemCard
                    )
                    .join("");

        }


        // ========================================
        // SEARCH
        // ========================================

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderTeacherLostItems
            );

        }


        // ========================================
        // CATEGORY FILTER
        // ========================================

        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                renderTeacherLostItems
            );

        }


        // ========================================
        // STATUS FILTER
        // ========================================

        if (statusFilter) {

            statusFilter.addEventListener(
                "change",
                renderTeacherLostItems
            );

        }


        // ========================================
        // START
        // ========================================

        loadTeacherLostItems();

    }
);

// ========================================
// NAVENTRA TEACHER - UPLOAD FOUND ITEM
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    var uploadForm =
        document.getElementById("teacherUploadItemForm");

    if (!uploadForm) {
        return;
    }


    var uploadMessage =
        document.getElementById("teacherUploadMessage");


    uploadForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ========================================
            // GET CURRENT TEACHER
            // ========================================

            var userResult =
                await supabaseClient.auth.getUser();

            var user = userResult.data.user;
            var userError = userResult.error;


            if (userError || !user) {

                showUploadMessage(
                    "Please log in again before uploading an item.",
                    "error"
                );

                return;
            }


            // ========================================
            // GET FORM VALUES
            // ========================================

            var itemName =
                document.getElementById(
                    "teacherItemName"
                ).value.trim();


            var category =
                document.getElementById(
                    "teacherItemCategory"
                ).value;


            var locationFound =
                document.getElementById(
                    "teacherItemLocation"
                ).value;


            var dateFound =
                document.getElementById(
                    "teacherItemDate"
                ).value;


            var description =
                document.getElementById(
                    "teacherItemDescription"
                ).value.trim();


            var additionalNotes =
                document.getElementById(
                    "teacherItemNotes"
                ).value.trim();


            
var imageFileInput =
    document.getElementById(
        "teacherItemImage"
    );

var imageFile =
    imageFileInput &&
    imageFileInput.files.length > 0
        ? imageFileInput.files[0]
        : null;




            // ========================================
            // BASIC VALIDATION
            // ========================================

            if (
                !itemName ||
                !category ||
                !locationFound ||
                !dateFound ||
                !description
            ) {

                showUploadMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            // ========================================
            // LOADING STATE
            // ========================================

            var submitButton =
                uploadForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Publishing...";

            }


            showUploadMessage(
                "Publishing found item...",
                "loading"
            );


            try {

               
// ========================================
// UPLOAD IMAGE TO SUPABASE STORAGE
// ========================================

var imageUrl = null;


if (imageFile) {

    var fileExtension =
        imageFile.name
            .split(".")
            .pop()
            .toLowerCase();


    var fileName =
        user.id +
        "_" +
        Date.now() +
        "." +
        fileExtension;


    var uploadResult =
        await supabaseClient.storage
            .from("lost-items")
            .upload(
                fileName,
                imageFile,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (uploadResult.error) {

        console.error(
            "Could not upload image:",
            uploadResult.error
        );


        showUploadMessage(
            "Could not upload the image. Please try again.",
            "error"
        );

        return;
    }


    var publicUrlResult =
        supabaseClient.storage
            .from("lost-items")
            .getPublicUrl(fileName);


    imageUrl =
        publicUrlResult.data.publicUrl;

}




                // ========================================
                // INSERT INTO LOST_ITEMS
                // ========================================

                var result =
                    await supabaseClient
                        .from("lost_items")
                        .insert([
                            {
                                item_name: itemName,
                                category: category,
                                description: description,
                                location_found: locationFound,
                                date_found: dateFound,
                                image_url: imageUrl || null,
                                status: "Found",
                                uploaded_by: user.id,
                                additional_notes:
                                    additionalNotes || null
                            }
                        ])
                        .select()
                        .single();


                var data = result.data;
                var error = result.error;


                // ========================================
                // HANDLE ERROR
                // ========================================

                if (error) {

                    console.error(
                        "Could not publish found item:",
                        error
                    );


                    showUploadMessage(
                        "Could not publish the item. Please try again.",
                        "error"
                    );


                    return;
                }


                // ========================================
                // SUCCESS
                // ========================================

                console.log(
                    "Found item published successfully:",
                    data
                );


                showUploadMessage(
                    "✓ Found item published successfully!",
                    "success"
                );


                // Reset form

                uploadForm.reset();


                // ========================================
                // GO TO LOST & FOUND
                // ========================================

                setTimeout(
                    function () {

                        var lostFoundButton =
                            document.querySelector(
                                '.teacher-sidebar-link[data-page="teacher-lost-found"]'
                            );


                        if (lostFoundButton) {

                            lostFoundButton.click();

                        }

                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Upload found item error:",
                    error
                );


                showUploadMessage(
                    "Something went wrong. Please try again.",
                    "error"
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "📤 Publish to Lost & Found";

                }

            }

        }
    );


    // ========================================
    // MESSAGE HELPER
    // ========================================

    function showUploadMessage(message, type) {

        if (!uploadMessage) {
            return;
        }


        uploadMessage.textContent =
            message;


        uploadMessage.className =
            "teacher-upload-message " +
            type;

    }

});

// ========================================
// NAVENTRA TEACHER - CLAIM VERIFICATION
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    var claimsList =
        document.getElementById("teacherClaimsList");

    if (!claimsList) {
        return;
    }

    var searchInput =
        document.getElementById("teacherClaimSearch");

    var statusFilter =
        document.getElementById("teacherClaimStatusFilter");

    var claimsCount =
        document.getElementById("teacherClaimsCount");

    var pendingCount =
        document.getElementById("teacherClaimsPendingCount");

    var verifiedCount =
        document.getElementById("teacherClaimsVerifiedCount");

    var rejectedCount =
        document.getElementById("teacherClaimsRejectedCount");


    var teacherClaims = [];


    // ========================================
    // LOAD CLAIMS
    // ========================================

    async function loadTeacherClaims() {

        claimsList.innerHTML = `
            <div class="teacher-loading-state">
                Loading student claims...
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

            var data = result.data;
            var error = result.error;


            if (error) {

                console.error(
                    "Could not load claims:",
                    error
                );

                claimsList.innerHTML = `
                    <div class="teacher-empty-state">
                        <div>⚠️</div>

                        <h3>
                            Could not load claims
                        </h3>

                        <p>
                            Please try refreshing the page.
                        </p>
                    </div>
                `;

                return;
            }


            teacherClaims = data || [];

            updateClaimStatistics();

            renderTeacherClaims();

        } catch (error) {

            console.error(
                "Claim loading error:",
                error
            );

            claimsList.innerHTML = `
                <div class="teacher-empty-state">
                    <div>⚠️</div>

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        Please try again.
                    </p>
                </div>
            `;

        }

    }


    // ========================================
    // STATISTICS
    // ========================================

    function updateClaimStatistics() {

        var pending = 0;
        var verified = 0;
        var rejected = 0;


        teacherClaims.forEach(function (claim) {

            var status =
                (claim.status || "")
                    .toLowerCase()
                    .trim();


            if (status === "pending") {

                pending++;

            } else if (
                status === "verified"
            ) {

                verified++;

            } else if (
                status === "rejected"
            ) {

                rejected++;

            }

        });


        if (pendingCount) {
            pendingCount.textContent = pending;
        }

        if (verifiedCount) {
            verifiedCount.textContent = verified;
        }

        if (rejectedCount) {
            rejectedCount.textContent = rejected;
        }

    }


    // ========================================
    // CREATE CLAIM CARD
    // ========================================

    function createClaimCard(claim) {

        var status =
            claim.status || "Pending";

        var normalizedStatus =
            status
                .toLowerCase()
                .trim()
                .replace(/\s+/g, "-");


        var createdDate =
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
                : "Unknown date";


        var actionButtons = "";


        if (
            status.toLowerCase() === "pending"
        ) {

            actionButtons = `

                <div class="teacher-claim-actions">

                    <button
                        type="button"
                        class="teacher-claim-approve-btn"
                        data-claim-id="${claim.id}"
                    >
                        ✓ Approve
                    </button>

                    <button
                        type="button"
                        class="teacher-claim-reject-btn"
                        data-claim-id="${claim.id}"
                    >
                        ✕ Reject
                    </button>

                    <button
                        type="button"
                        class="teacher-claim-info-btn"
                        data-claim-id="${claim.id}"
                    >
                        💬 More Information
                    </button>

                </div>

            `;

        }


        return `

            <article
                class="teacher-claim-card"
                data-claim-id="${claim.id}"
            >

                <div class="teacher-claim-card-top">

                    <div class="teacher-claim-item">

                        <div class="teacher-claim-item-icon">
                            📦
                        </div>

                        <div>

                            <span>
                                CLAIM FOR
                            </span>

                            <h3>
                                ${claim.item_name || "Unnamed Item"}
                            </h3>

                        </div>

                    </div>


                    <span
                        class="teacher-claim-status ${normalizedStatus}"
                    >
                        ${status}
                    </span>

                </div>


                <div class="teacher-claim-details">

                    <div class="teacher-claim-detail">

                        <span>👤</span>

                        <div>
                            <small>Student</small>
                            <strong>
                                ${claim.full_name || "Unknown"}
                            </strong>
                        </div>

                    </div>


                    <div class="teacher-claim-detail">

                        <span>🎓</span>

                        <div>
                            <small>Class</small>
                            <strong>
                                ${claim.class || "Not provided"}
                            </strong>
                        </div>

                    </div>


                    <div class="teacher-claim-detail">

                        <span>📞</span>

                        <div>
                            <small>Contact</small>
                            <strong>
                                ${claim.contact_info || "Not provided"}
                            </strong>
                        </div>

                    </div>


                    <div class="teacher-claim-detail">

                        <span>📅</span>

                        <div>
                            <small>Submitted</small>
                            <strong>
                                ${createdDate}
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="teacher-claim-reason">

                    <span>
                        Why does the student believe this item is theirs?
                    </span>

                    <p>
                        ${claim.reason || "No reason provided."}
                    </p>

                </div>


                ${actionButtons}

            </article>

        `;

    }


    // ========================================
    // RENDER CLAIMS
    // ========================================

    function renderTeacherClaims() {

        var searchTerm =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        var selectedStatus =
            statusFilter
                ? statusFilter.value
                    .toLowerCase()
                : "all";


        var filteredClaims =
            teacherClaims.filter(
                function (claim) {

                    var searchableText = `

                        ${claim.item_name || ""}

                        ${claim.full_name || ""}

                        ${claim.class || ""}

                        ${claim.contact_info || ""}

                        ${claim.reason || ""}

                    `.toLowerCase();


                    var matchesSearch =
                        !searchTerm ||
                        searchableText.includes(
                            searchTerm
                        );


                    var claimStatus =
                        (
                            claim.status || ""
                        )
                            .toLowerCase()
                            .trim();


                    var matchesStatus =
                        selectedStatus === "all" ||
                        claimStatus === selectedStatus;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );


        if (claimsCount) {

            claimsCount.textContent =
                filteredClaims.length +
                (
                    filteredClaims.length === 1
                        ? " claim"
                        : " claims"
                );

        }


        if (!filteredClaims.length) {

            claimsList.innerHTML = `

                <div class="teacher-empty-state">

                    <div>📋</div>

                    <h3>
                        No claims found
                    </h3>

                    <p>
                        There are no claims matching
                        your search or filter.
                    </p>

                </div>

            `;

            return;
        }


        claimsList.innerHTML =
            filteredClaims
                .map(createClaimCard)
                .join("");


        attachClaimActions();

    }


    // ========================================
    // CLAIM ACTIONS
    // ========================================

    function attachClaimActions() {

        var approveButtons =
            document.querySelectorAll(
                ".teacher-claim-approve-btn"
            );

        var rejectButtons =
            document.querySelectorAll(
                ".teacher-claim-reject-btn"
            );

        var infoButtons =
            document.querySelectorAll(
                ".teacher-claim-info-btn"
            );


        approveButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        updateClaimStatus(
                            button.getAttribute(
                                "data-claim-id"
                            ),
                            "verified"
                        );

                    }
                );

            }
        );


        rejectButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        updateClaimStatus(
                            button.getAttribute(
                                "data-claim-id"
                            ),
                            "rejected"
                        );

                    }
                );

            }
        );


        infoButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        requestMoreInformation(
                            button.getAttribute(
                                "data-claim-id"
                            )
                        );

                    }
                );

            }
        );

    }


    // ========================================
    // UPDATE CLAIM STATUS
    // ========================================

    async function updateClaimStatus(
        claimId,
        newStatus
    ) {

        try {

            var result =
                await supabaseClient
                    .from("lost_found_claims")
                    .update({
                        status: newStatus
                    })
                    .eq("id", claimId);


            if (result.error) {

                console.error(
                    "Could not update claim:",
                    result.error
                );

                alert(
                    "Could not update the claim. Please try again."
                );

                return;
            }


            var claim =
                teacherClaims.find(
                    function (item) {
                        return item.id === claimId;
                    }
                );


            if (claim) {
                claim.status = newStatus;
            }


            updateClaimStatistics();

            renderTeacherClaims();

        } catch (error) {

            console.error(
                "Claim update error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        }

    }


    // ========================================
    // REQUEST MORE INFORMATION
    // ========================================

    async function requestMoreInformation(
        claimId
    ) {

        await updateClaimStatus(
            claimId,
            "more information"
        );

    }


    // ========================================
    // SEARCH + FILTER
    // ========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderTeacherClaims
        );

    }


    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            renderTeacherClaims
        );

    }


    // ========================================
    // START
    // ========================================

    loadTeacherClaims();

    // ========================================
    // RESOURCES
    // ========================================

    var resourceForm =
        document.getElementById("resourceForm");

    var openResourceFormBtn =
        document.getElementById("openResourceFormBtn");

    var closeResourceFormBtn =
        document.getElementById("closeResourceFormBtn");

    var cancelResourceBtn =
        document.getElementById("cancelResourceBtn");

    var resourceFormCard =
        document.getElementById("resourceFormCard");

    var teacherResourcesList =
        document.getElementById("teacherResourcesList");

    var teacherResourcesCount =
        document.getElementById("teacherResourcesCount");

    var teacherResourceSearch =
        document.getElementById("teacherResourceSearch");

    var teacherResourceCategoryFilter =
        document.getElementById(
            "teacherResourceCategoryFilter"
        );


    var teacherResources = [];


    // ========================================
    // OPEN RESOURCE FORM
    // ========================================

    if (openResourceFormBtn) {

        openResourceFormBtn.addEventListener(
            "click",
            function () {

                resourceFormCard.style.display =
                    "block";

                openResourceFormBtn.style.display =
                    "none";

                resourceFormCard.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    // ========================================
    // CLOSE RESOURCE FORM
    // ========================================

    function closeResourceForm() {

        if (resourceFormCard) {

            resourceFormCard.style.display =
                "none";

        }

        if (openResourceFormBtn) {

            openResourceFormBtn.style.display =
                "inline-flex";

        }

    }


    if (closeResourceFormBtn) {

        closeResourceFormBtn.addEventListener(
            "click",
            closeResourceForm
        );

    }


    if (cancelResourceBtn) {

        cancelResourceBtn.addEventListener(
            "click",
            closeResourceForm
        );

    }


    // ========================================
    // LOAD TEACHER RESOURCES
    // ========================================

    async function loadTeacherResources() {

        if (!teacherResourcesList) {
            return;
        }


        teacherResourcesList.innerHTML = `
            <div class="teacher-resources-loading">
                Loading resources...
            </div>
        `;


        try {

            var result =
                await supabaseClient
                    .from("resources")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            var data = result.data;
            var error = result.error;


            if (error) {

                console.error(
                    "Could not load resources:",
                    error
                );

                teacherResourcesList.innerHTML = `
                    <div class="teacher-resources-empty">
                        <div class="teacher-resources-empty-icon">
                            ⚠️
                        </div>

                        <h3>
                            Could not load resources
                        </h3>

                        <p>
                            Please refresh the page and try again.
                        </p>
                    </div>
                `;

                return;

            }


            teacherResources =
                data || [];


            renderTeacherResources();


        } catch (error) {

            console.error(
                "Resource loading error:",
                error
            );


            teacherResourcesList.innerHTML = `
                <div class="teacher-resources-empty">
                    <div class="teacher-resources-empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Something went wrong
                    </h3>

                    <p>
                        Please try again.
                    </p>
                </div>
            `;

        }

    }


    // ========================================
    // CREATE RESOURCE CARD
    // ========================================

    function createResourceCard(resource) {

        var resourceDate =
            resource.created_at
                ? new Date(
                    resource.created_at
                ).toLocaleDateString(
                    undefined,
                    {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    }
                )
                : "Unknown date";


        var statusText =
            resource.is_published
                ? "Published"
                : "Draft";


        var statusClass =
            resource.is_published
                ? "published"
                : "draft";


        var resourceLink = "";


        if (resource.file_url) {

            resourceLink = `
                <a
                    href="${resource.file_url}"
                    target="_blank"
                    rel="noopener"
                    class="teacher-resource-open-btn"
                >
                    Open Resource
                </a>
            `;

        } else if (
            resource.external_url
        ) {

            resourceLink = `
                <a
                    href="${resource.external_url}"
                    target="_blank"
                    rel="noopener"
                    class="teacher-resource-open-btn"
                >
                    Open Link
                </a>
            `;

        }


        return `

            <article
                class="teacher-resource-card"
                data-resource-id="${resource.id}"
            >

                <div class="teacher-resource-card-icon">
                    📚
                </div>


                <div class="teacher-resource-card-content">

                    <div class="teacher-resource-card-top">

                        <div>

                            <span class="teacher-resource-category">
                                ${resource.category || "General"}
                            </span>

                            <h3>
                                ${resource.title || "Untitled Resource"}
                            </h3>

                        </div>


                        <span
                            class="teacher-resource-status ${statusClass}"
                        >
                            ${statusText}
                        </span>

                    </div>


                    <p>
                        ${resource.description || "No description provided."}
                    </p>


                    <div class="teacher-resource-meta">

                        <span>
                            📄 ${resource.resource_type || "Resource"}
                        </span>

                        <span>
                            🎓 ${resource.target_audience || "All Students"}
                        </span>

                        <span>
                            📅 ${resourceDate}
                        </span>

                        <span>
                            ⬇️ ${resource.download_count || 0}
                        </span>

                    </div>


                    <div class="teacher-resource-card-actions">

                        ${resourceLink}

                        <button
                            type="button"
                            class="teacher-resource-delete-btn"
                            data-resource-id="${resource.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </article>

        `;

    }


    // ========================================
    // RENDER RESOURCES
    // ========================================

    function renderTeacherResources() {

        if (!teacherResourcesList) {
            return;
        }


        var searchTerm =
            teacherResourceSearch
                ? teacherResourceSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        var selectedCategory =
            teacherResourceCategoryFilter
                ? teacherResourceCategoryFilter.value
                : "all";


        var filteredResources =
            teacherResources.filter(
                function (resource) {

                    var searchableText = `

                        ${resource.title || ""}

                        ${resource.description || ""}

                        ${resource.category || ""}

                        ${resource.resource_type || ""}

                    `.toLowerCase();


                    var matchesSearch =
                        !searchTerm ||
                        searchableText.includes(
                            searchTerm
                        );


                    var matchesCategory =
                        selectedCategory === "all" ||
                        resource.category ===
                        selectedCategory;


                    return (
                        matchesSearch &&
                        matchesCategory
                    );

                }
            );


        if (teacherResourcesCount) {

            teacherResourcesCount.textContent =
                filteredResources.length +
                (
                    filteredResources.length === 1
                        ? " resource"
                        : " resources"
                );

        }


        if (!filteredResources.length) {

            teacherResourcesList.innerHTML = `

                <div class="teacher-resources-empty">

                    <div class="teacher-resources-empty-icon">
                        📚
                    </div>

                    <h3>
                        No resources found
                    </h3>

                    <p>
                        Add a resource to share learning
                        materials with your students.
                    </p>

                </div>

            `;

            return;

        }


        teacherResourcesList.innerHTML =
            filteredResources
                .map(createResourceCard)
                .join("");


        attachResourceActions();

    }


    // ========================================
    // DELETE RESOURCE
    // ========================================

    function attachResourceActions() {

        var deleteButtons =
            document.querySelectorAll(
                ".teacher-resource-delete-btn"
            );


        deleteButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        var resourceId =
                            button.getAttribute(
                                "data-resource-id"
                            );


                        deleteResource(
                            resourceId
                        );

                    }
                );

            }
        );

    }


    async function deleteResource(
        resourceId
    ) {

        var confirmed =
            confirm(
                "Delete this resource?"
            );


        if (!confirmed) {
            return;
        }


        try {

            var result =
                await supabaseClient
                    .from("resources")
                    .delete()
                    .eq("id", resourceId);


            if (result.error) {

                console.error(
                    "Could not delete resource:",
                    result.error
                );

                alert(
                    "Could not delete the resource."
                );

                return;

            }


            teacherResources =
                teacherResources.filter(
                    function (resource) {
                        return resource.id !== resourceId;
                    }
                );


            renderTeacherResources();


        } catch (error) {

            console.error(
                "Resource deletion error:",
                error
            );

            alert(
                "Something went wrong."
            );

        }

    }


    // ========================================
    // SEARCH
    // ========================================

    if (teacherResourceSearch) {

        teacherResourceSearch.addEventListener(
            "input",
            renderTeacherResources
        );

    }


    if (teacherResourceCategoryFilter) {

        teacherResourceCategoryFilter.addEventListener(
            "change",
            renderTeacherResources
        );

    }


    // ========================================
    // UPLOAD RESOURCE
    // ========================================

    if (resourceForm) {

        resourceForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                var title =
                    document.getElementById(
                        "resourceTitle"
                    ).value.trim();


                var description =
                    document.getElementById(
                        "resourceDescription"
                    ).value.trim();


                var category =
                    document.getElementById(
                        "resourceCategory"
                    ).value;


                var resourceType =
                    document.getElementById(
                        "resourceType"
                    ).value;


                var targetAudience =
                    document.getElementById(
                        "resourceAudience"
                    ).value;


                var externalUrl =
                    document.getElementById(
                        "resourceExternalUrl"
                    ).value.trim();


                var fileInput =
                    document.getElementById(
                        "resourceFile"
                    );


                var published =
                    document.getElementById(
                        "resourcePublished"
                    ).checked;


                var file =
                    fileInput.files[0];


                var saveButton =
                    document.getElementById(
                        "saveResourceBtn"
                    );


                try {

                    saveButton.disabled =
                        true;

                    saveButton.textContent =
                        "Uploading...";


                    // Get logged-in teacher
                    var userResult =
                        await supabaseClient.auth.getUser();


                    var user =
                        userResult.data.user;
                        console.log("LOGGED IN USER:", user);
console.log("USER ID:", user ? user.id : null);


                    if (!user) {

                        alert(
                            "You must be logged in."
                        );

                        return;

                    }


                    var fileUrl =
                        null;


                    // ====================================
                    // UPLOAD FILE
                    // ====================================

                    if (file) {

                        var safeFileName =
                            file.name
                                .replace(
                                    /[^a-zA-Z0-9._-]/g,
                                    "_"
                                );


                        var filePath =
                            user.id +
                            "/" +
                            Date.now() +
                            "_" +
                            safeFileName;


                        var uploadResult =
                            await supabaseClient
                                .storage
                                .from("resources")
                                .upload(
                                    filePath,
                                    file
                                );


                        if (uploadResult.error) {

                            console.error(
                                "Resource file upload error:",
                                uploadResult.error
                            );

                            alert(
                                "Could not upload the file."
                            );

                            return;

                        }


                        var publicUrlResult =
                            supabaseClient
                                .storage
                                .from("resources")
                                .getPublicUrl(
                                    filePath
                                );


                        fileUrl =
                            publicUrlResult.data.publicUrl;

                    }


                  

// ====================================
// INSERT RESOURCE
// ====================================

var insertResult =
    await supabaseClient
        .from("resources")
        .insert({

                                title:
                                    title,

                                description:
                                    description,

                                category:
                                    category,

                                resource_type:
                                    resourceType,

                                file_url:
                                    fileUrl,

                                external_url:
                                    externalUrl ||
                                    null,

                                uploaded_by:
                                    user.id,

                                target_audience:
                                    targetAudience,

                                is_published:
                                    published,

                                download_count:
                                    0

                            })
                            .select()
                            .single();


                    if (insertResult.error) {

                        console.error(
                            "Could not create resource:",
                            insertResult.error
                        );

                        alert(
                            "Could not publish the resource."
                        );

                        return;

                    }


                    teacherResources.unshift(
    insertResult.data
);


// ====================================
// CREATE RESOURCE NOTIFICATION
// ====================================

var studentsResult =
    await supabaseClient
        .from("profiles")
        .select("id")
        .eq("role", "student");


if (studentsResult.error) {

    console.error(
        "Could not load students for notification:",
        studentsResult.error
    );

} else {

    var students =
        studentsResult.data || [];


    for (var i = 0; i < students.length; i++) {

        await createNotification({

            userId:
                students[i].id,

            title:
                "📚 New Resource Available",

            message:
                `"${title}" has been published and is now available in Resources.`,

            type:
                "resource",

            priority:
                "normal",

            link:
                "resources",

            relatedId:
                insertResult.data.id,

            relatedType:
                "resource"

        });

    }

}


renderTeacherResources();


                    resourceForm.reset();


                    document.getElementById(
                        "resourcePublished"
                    ).checked = true;


                    closeResourceForm();


                    alert(
                        "Resource published successfully!"
                    );


                } catch (error) {

                    console.error(
                        "Resource upload error:",
                        error
                    );

                    alert(
                        "Something went wrong while uploading the resource."
                    );

                } finally {

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Publish Resource";

                }

            }
        );

    }


    // ========================================
    // START RESOURCES
    // ========================================

    loadTeacherResources();

});

// ========================================
// NAVENTRA TEACHER - ANNOUNCEMENTS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var announcementsList =
            document.getElementById(
                "teacherAnnouncementsList"
            );

        if (!announcementsList) {
            return;
        }


        var announcementForm =
            document.getElementById(
                "announcementForm"
            );

        var openAnnouncementFormBtn =
            document.getElementById(
                "openAnnouncementFormBtn"
            );

        var closeAnnouncementFormBtn =
            document.getElementById(
                "closeAnnouncementFormBtn"
            );

        var cancelAnnouncementBtn =
            document.getElementById(
                "cancelAnnouncementBtn"
            );

        var announcementFormCard =
            document.getElementById(
                "announcementFormCard"
            );

        var announcementSearch =
            document.getElementById(
                "teacherAnnouncementSearch"
            );

        var announcementTypeFilter =
            document.getElementById(
                "teacherAnnouncementTypeFilter"
            );

        var announcementStatusFilter =
            document.getElementById(
                "teacherAnnouncementStatusFilter"
            );

        var announcementCount =
            document.getElementById(
                "teacherAnnouncementsCount"
            );

        var announcementFormMessage =
            document.getElementById(
                "announcementFormMessage"
            );


        var teacherAnnouncements = [];


        // ========================================
        // OPEN FORM
        // ========================================

        if (openAnnouncementFormBtn) {

            openAnnouncementFormBtn.addEventListener(
                "click",
                function () {

                    announcementFormCard.style.display =
                        "block";

                    openAnnouncementFormBtn.style.display =
                        "none";

                    announcementFormCard.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }


        // ========================================
        // CLOSE FORM
        // ========================================

        function closeAnnouncementForm() {

            if (announcementFormCard) {

                announcementFormCard.style.display =
                    "none";

            }

            if (openAnnouncementFormBtn) {

                openAnnouncementFormBtn.style.display =
                    "inline-flex";

            }

            if (announcementFormMessage) {

                announcementFormMessage.textContent =
                    "";

            }

        }


        if (closeAnnouncementFormBtn) {

            closeAnnouncementFormBtn.addEventListener(
                "click",
                closeAnnouncementForm
            );

        }


        if (cancelAnnouncementBtn) {

            cancelAnnouncementBtn.addEventListener(
                "click",
                closeAnnouncementForm
            );

        }


        // ========================================
        // LOAD ANNOUNCEMENTS
        // ========================================

        async function loadTeacherAnnouncements() {

            announcementsList.innerHTML = `
                <div class="teacher-loading-state">
                    Loading announcements...
                </div>
            `;


            try {

                var result =
                    await supabaseClient
                        .from("announcements")
                        .select("*")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (result.error) {

                    console.error(
                        "Could not load announcements:",
                        result.error
                    );

                    announcementsList.innerHTML = `
                        <div class="teacher-announcements-empty">
                            <div class="teacher-announcements-empty-icon">
                                ⚠️
                            </div>

                            <h3>
                                Could not load announcements
                            </h3>

                            <p>
                                Please refresh the page and try again.
                            </p>
                        </div>
                    `;

                    return;

                }


                teacherAnnouncements =
                    result.data || [];


                renderTeacherAnnouncements();


            } catch (error) {

                console.error(
                    "Announcement loading error:",
                    error
                );

            }

        }


        // ========================================
        // CREATE ANNOUNCEMENT CARD
        // ========================================

        function createAnnouncementCard(
            announcement
        ) {

            var published =
                announcement.is_published === true;


            var statusText =
                published
                    ? "Published"
                    : "Draft";


            var statusClass =
                published
                    ? "published"
                    : "draft";


            var createdDate =
                announcement.created_at
                    ? new Date(
                        announcement.created_at
                    ).toLocaleDateString(
                        undefined,
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    )
                    : "Unknown date";


            var priority =
                announcement.priority ||
                "normal";


            return `

                <article
                    class="teacher-announcement-card"
                    data-announcement-id="${announcement.id}"
                >

                    <div class="teacher-announcement-card-top">

                        <div>

                            <span class="teacher-announcement-category">
                                ${announcement.type || "General"}
                            </span>

                            <h3>
                                ${announcement.title || "Untitled Announcement"}
                            </h3>

                        </div>


                        <span
                            class="teacher-announcement-status ${statusClass}"
                        >
                            ${statusText}
                        </span>

                    </div>


                    <div class="teacher-announcement-card-message">
                        ${announcement.message || ""}
                    </div>


                    <div class="teacher-announcement-meta">

                        <span>
                            📅 ${createdDate}
                        </span>

                        <span
                            class="teacher-announcement-priority ${priority}"
                        >
                            ⚡ ${priority}
                        </span>

                    </div>


                    <div class="teacher-announcement-actions">

                        <button
                            type="button"
                            class="teacher-announcement-delete-btn"
                            data-announcement-id="${announcement.id}"
                        >
                            Delete
                        </button>

                    </div>

                </article>

            `;

        }


        // ========================================
        // RENDER
        // ========================================

        function renderTeacherAnnouncements() {

            var searchTerm =
                announcementSearch
                    ? announcementSearch.value
                        .trim()
                        .toLowerCase()
                    : "";


            var selectedType =
                announcementTypeFilter
                    ? announcementTypeFilter.value
                    : "all";


            var selectedStatus =
                announcementStatusFilter
                    ? announcementStatusFilter.value
                    : "all";


            var filtered =
                teacherAnnouncements.filter(
                    function (announcement) {

                        var searchableText = `

                            ${announcement.title || ""}

                            ${announcement.message || ""}

                            ${announcement.type || ""}

                        `.toLowerCase();


                        var matchesSearch =
                            !searchTerm ||
                            searchableText.includes(
                                searchTerm
                            );


                        var matchesType =
                            selectedType === "all" ||
                            announcement.type ===
                            selectedType;


                        var announcementStatus =
                            announcement.is_published
                                ? "published"
                                : "draft";


                        var matchesStatus =
                            selectedStatus === "all" ||
                            announcementStatus ===
                            selectedStatus;


                        return (
                            matchesSearch &&
                            matchesType &&
                            matchesStatus
                        );

                    }
                );


            if (announcementCount) {

                announcementCount.textContent =
                    filtered.length +
                    (
                        filtered.length === 1
                            ? " announcement"
                            : " announcements"
                    );

            }


            if (!filtered.length) {

                announcementsList.innerHTML = `

                    <div class="teacher-announcements-empty">

                        <div class="teacher-announcements-empty-icon">
                            📢
                        </div>

                        <h3>
                            No announcements found
                        </h3>

                        <p>
                            Create an announcement to share an update with students.
                        </p>

                    </div>

                `;

                return;

            }


            announcementsList.innerHTML =
                filtered
                    .map(
                        createAnnouncementCard
                    )
                    .join("");


            attachAnnouncementActions();

        }


        // ========================================
        // DELETE
        // ========================================

        function attachAnnouncementActions() {

            document
                .querySelectorAll(
                    ".teacher-announcement-delete-btn"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                deleteAnnouncement(
                                    button.getAttribute(
                                        "data-announcement-id"
                                    )
                                );

                            }
                        );

                    }
                );

        }


        async function deleteAnnouncement(
            announcementId
        ) {

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
                    .eq(
                        "id",
                        announcementId
                    );


            if (result.error) {

                console.error(
                    "Could not delete announcement:",
                    result.error
                );

                alert(
                    "Could not delete the announcement."
                );

                return;

            }


            teacherAnnouncements =
                teacherAnnouncements.filter(
                    function (announcement) {

                        return (
                            announcement.id !==
                            announcementId
                        );

                    }
                );


            renderTeacherAnnouncements();

        }


        // ========================================
        // SEARCH
        // ========================================

        if (announcementSearch) {

            announcementSearch.addEventListener(
                "input",
                renderTeacherAnnouncements
            );

        }


        if (announcementTypeFilter) {

            announcementTypeFilter.addEventListener(
                "change",
                renderTeacherAnnouncements
            );

        }


        if (announcementStatusFilter) {

            announcementStatusFilter.addEventListener(
                "change",
                renderTeacherAnnouncements
            );

        }


        // ========================================
        // CREATE
        // ========================================

        if (announcementForm) {

            announcementForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    var title =
                        document.getElementById(
                            "announcementTitle"
                        ).value.trim();


                    var message =
                        document.getElementById(
                            "announcementMessage"
                        ).value.trim();


                    var type =
                        document.getElementById(
                            "announcementType"
                        ).value;


                    var priority =
                        document.getElementById(
                            "announcementPriority"
                        ).value;


                    var expiryInput =
                        document.getElementById(
                            "announcementExpiry"
                        );


                    var isPublished =
                        document.getElementById(
                            "announcementPublished"
                        ).checked;


                    var saveButton =
                        document.getElementById(
                            "saveAnnouncementBtn"
                        );


                    if (
                        !title ||
                        !message ||
                        !type
                    ) {

                        showAnnouncementMessage(
                            "Please complete all required fields.",
                            "error"
                        );

                        return;

                    }


                    try {

                        saveButton.disabled =
                            true;

                        saveButton.textContent =
                            "Publishing...";


                        showAnnouncementMessage(
                            "Publishing announcement...",
                            "loading"
                        );


                        var userResult =
                            await supabaseClient.auth.getUser();


                        var user =
                            userResult.data.user;


                        if (!user) {

                            showAnnouncementMessage(
                                "Please log in again.",
                                "error"
                            );

                            return;

                        }


                        var expiresAt =
                            expiryInput &&
                            expiryInput.value
                                ? new Date(
                                    expiryInput.value
                                ).toISOString()
                                : null;


                        var insertResult =
                            await supabaseClient
                                .from("announcements")
                                .insert({

                                    title:
                                        title,

                                    message:
                                        message,

                                    type:
                                        type,

                                    priority:
                                        priority,

                                    expires_at:
                                        expiresAt,

                                    created_by:
                                        user.id,

                                    is_published:
                                        isPublished,

                                    published_at:
                                        isPublished
                                            ? new Date().toISOString()
                                            : null

                                })
                                .select()
                                .single();


                        if (insertResult.error) {

                            console.error(
                                "Could not create announcement:",
                                insertResult.error
                            );

                            showAnnouncementMessage(
                                "Could not publish the announcement.",
                                "error"
                            );

                            return;

                        }


                        teacherAnnouncements.unshift(
                            insertResult.data
                        );


                        renderTeacherAnnouncements();


                        announcementForm.reset();


                        document.getElementById(
                            "announcementPublished"
                        ).checked = true;


                        showAnnouncementMessage(
                            "Announcement published successfully!",
                            "success"
                        );


                        setTimeout(
                            closeAnnouncementForm,
                            800
                        );


                    } catch (error) {

                        console.error(
                            "Announcement creation error:",
                            error
                        );

                        showAnnouncementMessage(
                            "Something went wrong.",
                            "error"
                        );

                    } finally {

                        saveButton.disabled =
                            false;

                        saveButton.textContent =
                            "Publish Announcement";

                    }

                }
            );

        }


        // ========================================
        // FORM MESSAGE
        // ========================================

        function showAnnouncementMessage(
            message,
            type
        ) {

            if (!announcementFormMessage) {
                return;
            }


            announcementFormMessage.textContent =
                message;


            announcementFormMessage.style.color =
                type === "error"
                    ? "#b42318"
                    : type === "success"
                        ? "#26733c"
                        : "#777";

        }


        // ========================================
        // START
        // ========================================

        loadTeacherAnnouncements();

    }
);
// ========================================
// NAVENTRA TEACHER - NOTIFICATIONS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var notificationsList =
            document.getElementById(
                "teacherNotificationsList"
            );

        if (!notificationsList) {
            return;
        }


        var searchInput =
            document.getElementById(
                "teacherNotificationSearch"
            );


        var filterSelect =
            document.getElementById(
                "teacherNotificationFilter"
            );


        var countElement =
            document.getElementById(
                "teacherNotificationCount"
            );


        var markAllButton =
            document.getElementById(
                "markAllNotificationsReadBtn"
            );


        var teacherNotifications = [];


        // ========================================
        // GET CURRENT TEACHER
        // ========================================

        async function getCurrentTeacher() {

            var result =
                await supabaseClient.auth.getUser();


            if (result.error) {

                console.error(
                    "Could not get logged-in user:",
                    result.error
                );

                return null;

            }


            return result.data.user || null;

        }


        // ========================================
        // LOAD NOTIFICATIONS
        // ========================================

        async function loadTeacherNotifications() {

            notificationsList.innerHTML = `
                <div class="teacher-notifications-loading">
                    Loading notifications...
                </div>
            `;


            try {

                var user =
                    await getCurrentTeacher();


                if (!user) {

                    notificationsList.innerHTML = `
                        <div class="teacher-notifications-empty">

                            <div class="teacher-notifications-empty-icon">
                                🔐
                            </div>

                            <h3>
                                Please log in
                            </h3>

                            <p>
                                You must be logged in to view notifications.
                            </p>

                        </div>
                    `;

                    return;

                }


                var result =
                    await supabaseClient
                        .from("notifications")
                        .select("*")
                        .eq("user_id", user.id)
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        );


                if (result.error) {

                    console.error(
                        "Could not load notifications:",
                        result.error
                    );


                    notificationsList.innerHTML = `
                        <div class="teacher-notifications-empty">

                            <div class="teacher-notifications-empty-icon">
                                ⚠️
                            </div>

                            <h3>
                                Could not load notifications
                            </h3>

                            <p>
                                Please refresh the page and try again.
                            </p>

                        </div>
                    `;

                    return;

                }


                teacherNotifications =
                    result.data || [];


                renderTeacherNotifications();


            } catch (error) {

                console.error(
                    "Notification loading error:",
                    error
                );


                notificationsList.innerHTML = `
                    <div class="teacher-notifications-empty">

                        <div class="teacher-notifications-empty-icon">
                            ⚠️
                        </div>

                        <h3>
                            Something went wrong
                        </h3>

                        <p>
                            Please try again.
                        </p>

                    </div>
                `;

            }

        }


        // ========================================
        // FORMAT DATE
        // ========================================

        function formatNotificationDate(
            dateValue
        ) {

            if (!dateValue) {
                return "Unknown date";
            }


            var date =
                new Date(dateValue);


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
        // NOTIFICATION ICON
        // ========================================

        function getNotificationIcon(
            type
        ) {

            var normalizedType =
                (
                    type || ""
                )
                    .toLowerCase();


            if (
                normalizedType.includes(
                    "announcement"
                )
            ) {
                return "📢";
            }


            if (
                normalizedType.includes(
                    "claim"
                )
            ) {
                return "📋";
            }


            if (
                normalizedType.includes(
                    "resource"
                )
            ) {
                return "📚";
            }


            if (
                normalizedType.includes(
                    "event"
                )
            ) {
                return "📅";
            }


            if (
                normalizedType.includes(
                    "warning"
                )
            ) {
                return "⚠️";
            }


            return "🔔";

        }


        // ========================================
        // CREATE CARD
        // ========================================

        function createNotificationCard(
            notification
        ) {

            var isUnread =
                !notification.is_read;


            var cardClass =
                isUnread
                    ? "unread"
                    : "read";


            var icon =
                getNotificationIcon(
                    notification.type
                );


            var readButton =
                isUnread
                    ? `
                        <button
                            type="button"
                            class="teacher-notification-read-btn"
                            data-notification-id="${notification.id}"
                        >
                            ✓ Mark as Read
                        </button>
                    `
                    : "";


            return `

                <article
                    class="teacher-notification-card ${cardClass}"
                    data-notification-id="${notification.id}"
                >

                    <div class="teacher-notification-icon">
                        ${icon}
                    </div>


                    <div class="teacher-notification-content">

                        <div class="teacher-notification-top">

                            <div>

                                <h3>
                                    ${notification.title || "Notification"}
                                </h3>

                                <p class="teacher-notification-message">
                                    ${
                                        notification.message ||
                                        "No message provided."
                                    }
                                </p>

                            </div>


                            <span class="teacher-notification-date">
                                ${
                                    formatNotificationDate(
                                        notification.created_at
                                    )
                                }
                            </span>

                        </div>


                        <div class="teacher-notification-actions">

                            ${readButton}

                            <button
                                type="button"
                                class="teacher-notification-delete-btn"
                                data-notification-id="${notification.id}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>


                    ${
                        isUnread
                        ? `
                            <span
                                class="teacher-notification-unread-dot"
                                title="Unread"
                            ></span>
                        `
                        : ""
                    }

                </article>

            `;

        }


        // ========================================
        // RENDER
        // ========================================

        function renderTeacherNotifications() {

            var searchTerm =
                searchInput
                    ? searchInput.value
                        .trim()
                        .toLowerCase()
                    : "";


            var selectedFilter =
                filterSelect
                    ? filterSelect.value
                    : "all";


            var filteredNotifications =
                teacherNotifications.filter(
                    function (notification) {

                        var searchableText = `

                            ${notification.title || ""}

                            ${notification.message || ""}

                            ${notification.type || ""}

                            ${notification.priority || ""}

                        `.toLowerCase();


                        var matchesSearch =
                            !searchTerm ||
                            searchableText.includes(
                                searchTerm
                            );


                        var matchesFilter = true;


                        if (
                            selectedFilter ===
                            "unread"
                        ) {

                            matchesFilter =
                                !notification.is_read;

                        } else if (
                            selectedFilter ===
                            "read"
                        ) {

                            matchesFilter =
                                notification.is_read;

                        }


                        return (
                            matchesSearch &&
                            matchesFilter
                        );

                    }
                );


            var unreadCount =
                teacherNotifications.filter(
                    function (notification) {
                        return !notification.is_read;
                    }
                ).length;


            if (countElement) {

                countElement.textContent =
                    filteredNotifications.length +
                    (
                        filteredNotifications.length === 1
                            ? " notification"
                            : " notifications"
                    ) +
                    (
                        unreadCount > 0
                            ? " • " +
                              unreadCount +
                              " unread"
                            : ""
                    );

            }


            if (
                !filteredNotifications.length
            ) {

                notificationsList.innerHTML = `

                    <div class="teacher-notifications-empty">

                        <div class="teacher-notifications-empty-icon">
                            🔔
                        </div>

                        <h3>
                            No notifications found
                        </h3>

                        <p>
                            You don't have any notifications matching this filter.
                        </p>

                    </div>

                `;

                return;

            }


            notificationsList.innerHTML =
                filteredNotifications
                    .map(
                        createNotificationCard
                    )
                    .join("");


            attachNotificationActions();

        }


        // ========================================
        // MARK AS READ
        // ========================================

        async function markNotificationAsRead(
            notificationId
        ) {

            var result =
                await supabaseClient
                    .from("notifications")
                    .update({
                        is_read: true,
                        read_at: new Date().toISOString()
                    })
                    .eq(
                        "id",
                        notificationId
                    );


            if (result.error) {

                console.error(
                    "Could not mark notification as read:",
                    result.error
                );

                alert(
                    "Could not mark the notification as read."
                );

                return;

            }


            var notification =
                teacherNotifications.find(
                    function (item) {
                        return item.id === notificationId;
                    }
                );


            if (notification) {

                notification.is_read = true;

                notification.read_at =
                    new Date().toISOString();

            }


            renderTeacherNotifications();

        }


        // ========================================
        // DELETE
        // ========================================

        async function deleteTeacherNotification(
            notificationId
        ) {

            var confirmed =
                confirm(
                    "Delete this notification?"
                );


            if (!confirmed) {
                return;
            }


            var result =
                await supabaseClient
                    .from("notifications")
                    .delete()
                    .eq(
                        "id",
                        notificationId
                    );


            if (result.error) {

                console.error(
                    "Could not delete notification:",
                    result.error
                );

                alert(
                    "Could not delete the notification."
                );

                return;

            }


            teacherNotifications =
                teacherNotifications.filter(
                    function (notification) {

                        return (
                            notification.id !==
                            notificationId
                        );

                    }
                );


            renderTeacherNotifications();

        }


        // ========================================
        // MARK ALL AS READ
        // ========================================

        async function markAllNotificationsAsRead() {

            var user =
                await getCurrentTeacher();


            if (!user) {
                return;
            }


            var unreadNotifications =
                teacherNotifications.filter(
                    function (notification) {
                        return !notification.is_read;
                    }
                );


            if (
                !unreadNotifications.length
            ) {

                alert(
                    "All notifications are already read."
                );

                return;

            }


            var result =
                await supabaseClient
                    .from("notifications")
                    .update({
                        is_read: true,
                        read_at: new Date().toISOString()
                    })
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "is_read",
                        false
                    );


            if (result.error) {

                console.error(
                    "Could not mark all notifications as read:",
                    result.error
                );

                alert(
                    "Could not mark all notifications as read."
                );

                return;

            }


            teacherNotifications.forEach(
                function (notification) {

                    notification.is_read =
                        true;

                    notification.read_at =
                        new Date().toISOString();

                }
            );


            renderTeacherNotifications();

        }


        // ========================================
        // BUTTON ACTIONS
        // ========================================

        function attachNotificationActions() {

            var readButtons =
                document.querySelectorAll(
                    ".teacher-notification-read-btn"
                );


            var deleteButtons =
                document.querySelectorAll(
                    ".teacher-notification-delete-btn"
                );


            readButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            markNotificationAsRead(
                                button.getAttribute(
                                    "data-notification-id"
                                )
                            );

                        }
                    );

                }
            );


            deleteButtons.forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteTeacherNotification(
                                button.getAttribute(
                                    "data-notification-id"
                                )
                            );

                        }
                    );

                }
            );

        }


        // ========================================
        // SEARCH
        // ========================================

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderTeacherNotifications
            );

        }


        // ========================================
        // FILTER
        // ========================================

        if (filterSelect) {

            filterSelect.addEventListener(
                "change",
                renderTeacherNotifications
            );

        }


        // ========================================
        // MARK ALL
        // ========================================

        if (markAllButton) {

            markAllButton.addEventListener(
                "click",
                markAllNotificationsAsRead
            );

        }


        // ========================================
        // START
        // ========================================

        loadTeacherNotifications();

    }
);
// ========================================
// NAVENTRA TEACHER - PROFILE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        var profilePage =
            document.getElementById(
                "teacher-profile"
            );

        if (!profilePage) {
            return;
        }


        // ========================================
        // ELEMENTS
        // ========================================

        var editButton =
            document.getElementById(
                "teacherProfileEditBtn"
            );

        var editCard =
            document.getElementById(
                "teacherProfileEditCard"
            );

        var cancelButton =
            document.getElementById(
                "teacherProfileCancelBtn"
            );

        var profileForm =
            document.getElementById(
                "teacherProfileForm"
            );

        var saveButton =
            document.getElementById(
                "teacherProfileSaveBtn"
            );

        var message =
            document.getElementById(
                "teacherProfileFormMessage"
            );


        // ========================================
        // PROFILE ELEMENTS
        // ========================================

        var profileAvatar =
            document.getElementById(
                "teacherProfileAvatar"
            );

        var profileName =
            document.getElementById(
                "teacherProfileName"
            );

        var profileEmail =
            document.getElementById(
                "teacherProfileEmail"
            );

        var profileFullName =
            document.getElementById(
                "teacherProfileFullName"
            );

        var profileEmailValue =
            document.getElementById(
                "teacherProfileEmailValue"
            );

        var profileRole =
            document.getElementById(
                "teacherProfileRoleValue"
            );

        var profileUserId =
            document.getElementById(
                "teacherProfileUserId"
            );

        var profileCreatedAt =
            document.getElementById(
                "teacherProfileCreatedAt"
            );


        // ========================================
        // FORM ELEMENTS
        // ========================================

        var nameInput =
            document.getElementById(
                "teacherProfileNameInput"
            );

        var emailInput =
            document.getElementById(
                "teacherProfileEmailInput"
            );


        // ========================================
        // LOAD PROFILE
        // ========================================

        async function loadTeacherProfile() {

            try {

                var userResult =
                    await supabaseClient.auth.getUser();


                var user =
                    userResult.data.user;


                if (userResult.error || !user) {

                    showProfileMessage(
                        "Please log in again.",
                        "error"
                    );

                    return;
                }


                // ====================================
                // GET PROFILE
                // ====================================

                var profileResult =
                    await supabaseClient
                        .from("profiles")
                        .select("*")
                        .eq(
                            "id",
                            user.id
                        )
                        .single();


                var profile =
                    profileResult.data;


                var profileError =
                    profileResult.error;


                if (
                    profileError &&
                    profileError.code !== "PGRST116"
                ) {

                    console.error(
                        "Could not load teacher profile:",
                        profileError
                    );

                    showProfileMessage(
                        "Could not load your profile.",
                        "error"
                    );

                    return;
                }


                // ====================================
                // PROFILE DATA
                // ====================================

                var fullName =
                    profile &&
                    profile.full_name
                        ? profile.full_name
                        : (
                            user.user_metadata &&
                            user.user_metadata.full_name
                        )
                            ? user.user_metadata.full_name
                            : "Teacher";


                var role =
                    profile &&
                    profile.role
                        ? profile.role
                        : "teacher";


                var email =
                    user.email ||
                    "No email available";


                // ====================================
                // DISPLAY NAME
                // ====================================

                profileName.textContent =
                    fullName;

                profileFullName.textContent =
                    fullName;

                profileEmail.textContent =
                    email;

                profileEmailValue.textContent =
                    email;

                profileRole.textContent =
                    role.charAt(0).toUpperCase() +
                    role.slice(1);


                profileUserId.textContent =
                    user.id;


                // ====================================
                // CREATED DATE
                // ====================================

                if (
                    profile &&
                    profile.created_at
                ) {

                    profileCreatedAt.textContent =
                        new Date(
                            profile.created_at
                        ).toLocaleDateString(
                            undefined,
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        );

                } else {

                    profileCreatedAt.textContent =
                        "Not available";

                }


                // ====================================
                // AVATAR
                // ====================================

                var firstLetter =
                    fullName
                        .trim()
                        .charAt(0)
                        .toUpperCase();


                profileAvatar.textContent =
                    firstLetter || "T";


                // ====================================
                // FORM
                // ====================================

                nameInput.value =
                    fullName;

                emailInput.value =
                    email;


            } catch (error) {

                console.error(
                    "Teacher profile error:",
                    error
                );

                showProfileMessage(
                    "Something went wrong while loading your profile.",
                    "error"
                );

            }

        }


        // ========================================
        // SHOW MESSAGE
        // ========================================

        function showProfileMessage(
            text,
            type
        ) {

            if (!message) {
                return;
            }


            message.textContent =
                text;


            message.className =
                "teacher-profile-form-message " +
                type;

        }


        // ========================================
        // OPEN EDIT FORM
        // ========================================

        if (editButton) {

            editButton.addEventListener(
                "click",
                function () {

                    editCard.style.display =
                        "block";

                    editCard.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }


        // ========================================
        // CANCEL EDIT
        // ========================================

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                function () {

                    editCard.style.display =
                        "none";

                    if (message) {

                        message.textContent =
                            "";

                        message.className =
                            "teacher-profile-form-message";

                    }

                }
            );

        }


        // ========================================
        // SAVE PROFILE
        // ========================================

        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                async function (event) {

                    event.preventDefault();


                    var newName =
                        nameInput.value.trim();


                    if (!newName) {

                        showProfileMessage(
                            "Please enter your full name.",
                            "error"
                        );

                        return;

                    }


                    saveButton.disabled =
                        true;

                    saveButton.textContent =
                        "Saving...";


                    try {

                        // ====================================
                        // GET USER
                        // ====================================

                        var userResult =
                            await supabaseClient
                                .auth
                                .getUser();


                        var user =
                            userResult.data.user;


                        if (
                            userResult.error ||
                            !user
                        ) {

                            showProfileMessage(
                                "Please log in again.",
                                "error"
                            );

                            return;

                        }


                        // ====================================
                        // UPDATE PROFILE
                        // ====================================

                        var updateResult =
                            await supabaseClient
                                .from("profiles")
                                .update({
                                    full_name:
                                        newName
                                })
                                .eq(
                                    "id",
                                    user.id
                                );


                        if (updateResult.error) {

                            console.error(
                                "Could not update teacher profile:",
                                updateResult.error
                            );

                            showProfileMessage(
                                "Could not save your profile.",
                                "error"
                            );

                            return;

                        }


                        // ====================================
                        // UPDATE SCREEN
                        // ====================================

                        profileName.textContent =
                            newName;

                        profileFullName.textContent =
                            newName;


                        profileAvatar.textContent =
                            newName
                                .charAt(0)
                                .toUpperCase();


                        showProfileMessage(
                            "✓ Profile updated successfully.",
                            "success"
                        );


                        setTimeout(
                            function () {

                                editCard.style.display =
                                    "none";

                                message.textContent =
                                    "";

                                message.className =
                                    "teacher-profile-form-message";

                            },
                            1200
                        );


                    } catch (error) {

                        console.error(
                            "Profile update error:",
                            error
                        );

                        showProfileMessage(
                            "Something went wrong. Please try again.",
                            "error"
                        );

                    } finally {

                        saveButton.disabled =
                            false;

                        saveButton.textContent =
                            "💾 Save Changes";

                    }

                }
            );

        }


        // ========================================
        // START
        // ========================================

        loadTeacherProfile();

    }
);
// ========================================
// NAVENTRA — OPPORTUNITY MATCHER
// ========================================

async function loadOpportunityMatcher() {

    const page =
        document.getElementById(
            "teacher-opportunity-matcher"
        );

    if (!page) {
        return;
    }


    const opportunitySelect =
        document.getElementById(
            "opportunitySelect"
        );

    const matchResults =
        document.getElementById(
            "opportunityMatchResults"
        );

    const matchCount =
        document.getElementById(
            "opportunityMatchCount"
        );

    const matchTitle =
        document.getElementById(
            "opportunityMatchTitle"
        );

    const matchSummary =
        document.getElementById(
            "opportunityMatchSummary"
        );


    if (!opportunitySelect || !matchResults) {
        return;
    }


    // ========================================
    // OPPORTUNITY DEFINITIONS
    // ========================================

    const opportunityDefinitions = {

        "science-exhibition": {

            title: "Science Exhibition",

            icon: "🧪",

            description:
                "Students with strong scientific thinking, research interests, analytical skills, and science-related career interests.",

            categories: [
                "science",
                "engineering",
                "environment",
                "healthcare"
            ],

            keywords: [
                "science",
                "biology",
                "chemistry",
                "physics",
                "research",
                "medicine",
                "health",
                "engineering",
                "environment"
            ]

        },


        "coding-competition": {

            title: "Coding Competition",

            icon: "💻",

            description:
                "Students with technology interests, problem-solving abilities, engineering interests, and computer-related career goals.",

            categories: [
                "technology",
                "engineering",
                "business"
            ],

            keywords: [
                "technology",
                "coding",
                "computer",
                "software",
                "programming",
                "engineering",
                "data",
                "artificial intelligence",
                "web"
            ]

        },


        "debate": {

            title: "Debate Competition",

            icon: "🎤",

            description:
                "Students with communication, leadership, analytical thinking, people skills, and strong interest in public-facing careers.",

            categories: [
                "leadership",
                "psychology",
                "education",
                "business",
                "management",
                "media"
            ],

            keywords: [
                "law",
                "politics",
                "leadership",
                "communication",
                "journalism",
                "psychology",
                "business",
                "education",
                "media"
            ]

        },


        "art-exhibition": {

            title: "Art Exhibition",

            icon: "🎨",

            description:
                "Students with creative thinking, design interests, visual communication, and artistic career interests.",

            categories: [
                "creative",
                "design",
                "media"
            ],

            keywords: [
                "art",
                "design",
                "creative",
                "fashion",
                "animation",
                "photography",
                "media",
                "film",
                "illustration"
            ]

        },


        "sports-event": {

            title: "Sports Event",

            icon: "🏆",

            description:
                "Students interested in sports, health, teamwork, leadership, physical performance, and related fields.",

            categories: [
                "healthcare",
                "leadership",
                "management"
            ],

            keywords: [
                "sports",
                "fitness",
                "athlete",
                "health",
                "team",
                "leadership",
                "physical"
            ]

        },


        "leadership-program": {

            title: "Student Leadership Program",

            icon: "👑",

            description:
                "Students demonstrating leadership, organization, communication, teamwork, responsibility, and management interests.",

            categories: [
                "leadership",
                "management",
                "business",
                "education",
                "psychology"
            ],

            keywords: [
                "leadership",
                "management",
                "business",
                "organization",
                "communication",
                "team",
                "education"
            ]

        },


        "volunteering": {

            title: "Community Volunteering",

            icon: "🤝",

            description:
                "Students interested in helping people, healthcare, education, community work, psychology, and environmental causes.",

            categories: [
                "healthcare",
                "psychology",
                "education",
                "environment",
                "leadership"
            ],

            keywords: [
                "health",
                "medicine",
                "helping",
                "community",
                "education",
                "children",
                "psychology",
                "environment",
                "social"
            ]

        }

    };


    // ========================================
    // LOAD ALL STUDENT DATA
    // ========================================

    async function getStudentData() {

        try {

            const [

                profilesResult,

                assessmentsResult,

                achievementsResult,

                savedCareersResult

            ] = await Promise.all([

                supabaseClient
                    .from("profiles")
                    .select(
                        "id, full_name, role, class"
                    )
                    .eq("role", "student"),


                supabaseClient
                    .from("career_assessments")
                    .select("*")
                    .eq("status", "completed")
                    .order(
                        "attempt_number",
                        {
                            ascending: false
                        }
                    ),


                supabaseClient
                    .from("achievements")
                    .select("*")
                    .order(
                        "achievement_date",
                        {
                            ascending: false
                        }
                    ),


                supabaseClient
                    .from("saved_careers")
                    .select("*")
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    )

            ]);


            if (profilesResult.error) {

                throw new Error(
                    "Could not load student profiles: " +
                    profilesResult.error.message
                );

            }


            if (assessmentsResult.error) {

                throw new Error(
                    "Could not load career assessments: " +
                    assessmentsResult.error.message
                );

            }


            if (achievementsResult.error) {

                throw new Error(
                    "Could not load achievements: " +
                    achievementsResult.error.message
                );

            }


            if (savedCareersResult.error) {

                throw new Error(
                    "Could not load saved careers: " +
                    savedCareersResult.error.message
                );

            }


            return {

                profiles:
                    profilesResult.data || [],

                assessments:
                    assessmentsResult.data || [],

                achievements:
                    achievementsResult.data || [],

                savedCareers:
                    savedCareersResult.data || []

            };

        } catch (error) {

            console.error(
                "Opportunity Matcher data error:",
                error
            );

            throw error;

        }

    }


    // ========================================
    // GET LATEST ASSESSMENT PER STUDENT
    // ========================================

    function getLatestAssessments(
        assessments
    ) {

        const latest = {};


        assessments.forEach(
            assessment => {

                if (
                    !assessment.student_id
                ) {
                    return;
                }


                const existing =
                    latest[
                        assessment.student_id
                    ];


                if (
                    !existing ||
                    (
                        Number(
                            assessment.attempt_number || 0
                        ) >
                        Number(
                            existing.attempt_number || 0
                        )
                    )
                ) {

                    latest[
                        assessment.student_id
                    ] =
                        assessment;

                }

            }
        );


        return latest;

    }


    // ========================================
    // CALCULATE ASSESSMENT SKILLS
    // ========================================

    function calculateAssessmentSkills(
        assessment
    ) {

        if (
            !assessment ||
            !assessment.answers ||
            !assessment.answers.answers
        ) {

            return [];

        }


        const responses =
            assessment.answers.answers.responses;


        if (
            !Array.isArray(responses)
        ) {

            return [];

        }


        const categoryScores = {};


        if (
            !Array.isArray(
                window.careerAssessmentQuestions
            ) &&
            !Array.isArray(
                careerAssessmentQuestions
            )
        ) {

            return [];

        }


        const questions =
            Array.isArray(
                window.careerAssessmentQuestions
            )
                ? window.careerAssessmentQuestions
                : careerAssessmentQuestions;


        questions.forEach(
            function (
                question,
                questionIndex
            ) {

                const answer =
                    responses[
                        questionIndex
                    ];


                if (
                    answer === undefined ||
                    answer === null
                ) {

                    return;

                }


                const selectedIndexes =
                    Array.isArray(answer)
                        ? answer
                        : [answer];


                selectedIndexes.forEach(
                    function (selectedIndex) {

                        const option =
                            question.options &&
                            question.options[
                                selectedIndex
                            ];


                        if (!option) {
                            return;
                        }


                        Object.entries(
                            option.scores || {}
                        ).forEach(
                            function (
                                [
                                    category,
                                    score
                                ]
                            ) {

                                categoryScores[
                                    category
                                ] =
                                    (
                                        categoryScores[
                                            category
                                        ] || 0
                                    ) +
                                    Number(score || 0);

                            }
                        );

                    }
                );

            }
        );


        return Object.entries(
            categoryScores
        )
            .sort(
                function (a, b) {
                    return b[1] - a[1];
                }
            )
            .map(
                function (entry) {
                    return {
                        category: entry[0],
                        score: entry[1]
                    };
                }
            );

    }


    // ========================================
    // GET STUDENT MATCH
    // ========================================

    function calculateStudentMatch(
        student,
        assessment,
        achievements,
        savedCareers,
        opportunity
    ) {

        let score = 0;

        const evidence = [];

        const assessmentSkills =
            calculateAssessmentSkills(
                assessment
            );


        // ------------------------------------
// ASSESSMENT MATCH
// ------------------------------------

const skillNames = {

    technology:
        "Technology & Digital Thinking",

    engineering:
        "Engineering & Problem Solving",

    science:
        "Scientific Thinking",

    healthcare:
        "Healthcare & Wellbeing",

    psychology:
        "Understanding People",

    business:
        "Business Thinking",

    management:
        "Organization & Planning",

    leadership:
        "Leadership",

    creative:
        "Creativity",

    design:
        "Design & Visual Thinking",

    media:
        "Media & Storytelling",

    education:
        "Teaching & Learning",

    environment:
        "Environmental Thinking"

};


const matchingSkills =
    assessmentSkills.filter(
        function (skill) {

            return opportunity.categories
                .includes(
                    skill.category
                );

        }
    );


if (matchingSkills.length) {

    score += Math.min(
        40,
        matchingSkills.length * 12
    );


    const strongestSkill =
        matchingSkills[0];


    const readableSkill =
        skillNames[
            strongestSkill.category
        ] ||
        strongestSkill.category;


    evidence.push({

        icon: "🧠",

        label: "Strength",

        text:
            readableSkill

    });

}


        // ------------------------------------
        // SAVED CAREERS
        // ------------------------------------

        const studentCareers =
            savedCareers.filter(
                function (career) {

                    return career.student_id ===
                        student.id;

                }
            );


        const matchingCareers =
            studentCareers.filter(
                function (career) {

                    const careerText =
                        (
                            (
                                career.career_name ||
                                ""
                            ) +
                            " " +
                            (
                                career.career_category ||
                                ""
                            )
                        ).toLowerCase();


                    return opportunity.keywords
                        .some(
                            function (keyword) {

                                return careerText
                                    .includes(
                                        keyword
                                    );

                            }
                        );

                }
            );


        if (matchingCareers.length) {

    score += Math.min(
        25,
        matchingCareers.length * 12
    );


    const careerNames =
        matchingCareers
            .slice(0, 2)
            .map(
                function (career) {

                    return career.career_name;

                }
            )
            .filter(Boolean);


    if (careerNames.length) {

        evidence.push({

            icon: "🎯",

            label: "Career Interest",

            text:
                careerNames.join(" • ")

        });

    }

}


        // ------------------------------------
        // ACHIEVEMENTS
        // ------------------------------------

        const studentAchievements =
            achievements.filter(
                function (achievement) {

                    return achievement.student_id ===
                        student.id;

                }
            );


        const matchingAchievements =
            studentAchievements.filter(
                function (achievement) {

                    const achievementText =
                        JSON.stringify(
                            achievement
                        ).toLowerCase();


                    return opportunity.keywords
                        .some(
                            function (keyword) {

                                return achievementText
                                    .includes(
                                        keyword
                                    );

                            }
                        );

                }
            );


        if (matchingAchievements.length) {

    score += Math.min(
        25,
        matchingAchievements.length * 10
    );


    const achievement =
        matchingAchievements[0];


    const achievementName =
        achievement.title ||
        achievement.name ||
        achievement.achievement_name ||
        achievement.description ||
        "Relevant achievement";


    evidence.push({

        icon: "🏆",

        label: "Achievement",

        text:
            achievementName

    });

}


        // ------------------------------------
        // BASE PROFILE SIGNAL
        // ------------------------------------

        if (assessment) {

            score += 5;

        }


        // ------------------------------------
        // CAP SCORE
        // ------------------------------------

        score =
            Math.min(
                100,
                Math.round(score)
            );


        // ------------------------------------
        // MATCH REASON
        // ------------------------------------

        let reason =
    "NAVENTRA found relevant signals in this student's profile that connect with this opportunity.";


const reasonParts = [];


if (matchingSkills.length) {

    const strongestSkill =
        skillNames[
            matchingSkills[0].category
        ] ||
        matchingSkills[0].category;


    reasonParts.push(
        strongestSkill.toLowerCase()
    );

}


if (matchingCareers.length) {

    const careerName =
        matchingCareers[0].career_name;


    if (careerName) {

        reasonParts.push(
            "an interest in " +
            careerName
        );

    }

}


if (matchingAchievements.length) {

    reasonParts.push(
        "relevant achievement experience"
    );

}


if (reasonParts.length === 3) {

    reason =
        "Strong " +
        reasonParts[0] +
        ", " +
        reasonParts[1] +
        ", and " +
        reasonParts[2] +
        " make this student a promising fit for the " +
        opportunity.title +
        ".";

} else if (reasonParts.length === 2) {

    reason =
        "This student's " +
        reasonParts[0] +
        " and " +
        reasonParts[1] +
        " connect meaningfully with the " +
        opportunity.title +
        ".";

} else if (reasonParts.length === 1) {

    reason =
        "The student's " +
        reasonParts[0] +
        " shows a meaningful connection with the " +
        opportunity.title +
        ".";

}


// ========================================
// RETURN MATCH RESULT
// ========================================

return {
    student: student,
    score: score,
    evidence: evidence,
    reason: reason
};

}




    // ========================================
    // RENDER MATCHES
    // ========================================

    function renderMatches(
        matches,
        opportunity
    ) {

        if (matchCount) {

            matchCount.textContent =
                matches.length;

        }


        if (matchTitle) {

            matchTitle.textContent =
                "Students who may be a strong fit";

        }


        if (matchSummary) {

            matchSummary.textContent =
                opportunity.description;

        }


        if (!matches.length) {

            matchResults.innerHTML = `

                <div class="opportunity-empty-state">

                    <div class="opportunity-empty-icon">
                        🔎
                    </div>

                    <h3>
                        No strong matches found
                    </h3>

                    <p>
                        NAVENTRA could not find enough
                        relevant information for this
                        opportunity yet.
                    </p>

                </div>

            `;

            return;

        }


        matchResults.innerHTML =
            matches.map(
                function (match) {

                    const student =
                        match.student;


                    const fullName =
                        student.full_name ||
                        "Student";


                    const initials =
                        fullName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map(
                                function (name) {
                                    return name[0];
                                }
                            )
                            .join("")
                            .toUpperCase();


                    const evidenceHTML =
                        match.evidence.length

                            ? `
                                <div class="opportunity-evidence">

                                    ${match.evidence
                                        .slice(0, 3)
                                        .map(
                                            function (item) {

                                                return `
                                                    <div class="opportunity-evidence-row">

                                                        <span class="opportunity-evidence-icon">
                                                            ${item.icon}
                                                        </span>

                                                        <span>
    <strong>
        ${item.label || "Signal"}
    </strong>
    <br>
    ${item.text}
</span>

                                                    </div>
                                                `;

                                            }
                                        )
                                        .join("")}

                                </div>
                            `

                            : "";


                    return `

                        <article
                            class="opportunity-student-card"
                        >

                            <div
                                class="opportunity-student-header"
                            >

                                <div
                                    class="opportunity-student-info"
                                >

                                    <div
                                        class="opportunity-student-avatar"
                                    >
                                        ${initials || "ST"}
                                    </div>

                                    <div>

                                        <h3
                                            class="opportunity-student-name"
                                        >
                                            ${fullName}
                                        </h3>

                                        <span
                                            class="opportunity-student-class"
                                        >
                                            ${student.class || "Class not provided"}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    class="opportunity-match-score"
                                >

                                    ${match.score}%

                                    <span>
                                        RELEVANCE
                                    </span>

                                </div>

                            </div>


                            ${evidenceHTML}


                            <div
                                class="opportunity-match-reason"
                            >

                                <span
                                    class="opportunity-match-reason-label"
                                >
                                    WHY THIS MATCH
                                </span>

                                <p>
                                    ${match.reason}
                                </p>

                            </div>

                        </article>

                    `;

                }
            ).join("");

    }


    // ========================================
    // RUN MATCHING
    // ========================================

    async function runOpportunityMatcher() {

        const selectedOpportunity =
            opportunitySelect.value;


        const opportunity =
            opportunityDefinitions[
                selectedOpportunity
            ];


        if (!opportunity) {
            return;
        }


        matchResults.innerHTML = `

            <div class="opportunity-empty-state">

                <div class="opportunity-empty-icon">
                    ✨
                </div>

                <h3>
                    NAVENTRA is analyzing student profiles...
                </h3>

                <p>
                    Checking assessment strengths,
                    career interests, and achievements.
                </p>

            </div>

        `;


        if (matchCount) {

            matchCount.textContent = "…";

        }


        try {

            const data =
                await getStudentData();


            const latestAssessments =
                getLatestAssessments(
                    data.assessments
                );


            const matches =
                data.profiles
                    .map(
                        function (student) {

                            return calculateStudentMatch(

                                student,

                                latestAssessments[
                                    student.id
                                ],

                                data.achievements,

                                data.savedCareers,

                                opportunity

                            );

                        }
                    )
                    .filter(
                        function (match) {

                            return match.score >= 20;

                        }
                    )
                    .sort(
                        function (a, b) {

                            return b.score - a.score;

                        }
                    );


            renderMatches(
                matches,
                opportunity
            );


        } catch (error) {

            console.error(
                "Opportunity Matcher error:",
                error
            );


            if (matchCount) {
                matchCount.textContent = "0";
            }


            matchResults.innerHTML = `

                <div class="opportunity-empty-state">

                    <div class="opportunity-empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Could not load student matches
                    </h3>

                    <p>
                        NAVENTRA could not access the
                        required student information.
                        Check the browser console for details.
                    </p>

                </div>

            `;

        }

    }


    // ========================================
    // DROPDOWN EVENT
    // ========================================

    opportunitySelect.addEventListener(
        "change",
        runOpportunityMatcher
    );


    // ========================================
    // INITIAL STATE
    // ========================================

    console.log(
        "💡 NAVENTRA Opportunity Matcher loaded."
    );

}


// ========================================
// START OPPORTUNITY MATCHER
// ========================================

if (document.getElementById("teacher-opportunity-matcher")) {
    loadOpportunityMatcher();
}

// ========================================
// END OPPORTUNITY MATCHER
// ========================================
// ========================================
// NAVENTRA — CLASS PULSE
// ========================================

async function loadClassPulse() {

    const page =
        document.getElementById(
            "teacher-class-pulse"
        );

    if (!page) {
        return;
    }


    const classSelect =
        document.getElementById(
            "classPulseSelect"
        );

    const studentsCount =
        document.getElementById(
            "classPulseStudents"
        );

    const careerPercentage =
        document.getElementById(
            "classPulseCareer"
        );

    const achievementsCount =
        document.getElementById(
            "classPulseAchievements"
        );

    const savedCareersCount =
        document.getElementById(
            "classPulseSavedCareers"
        );

    const signalsContainer =
        document.getElementById(
            "classPulseSignals"
        );

    const interestsContainer =
        document.getElementById(
            "classPulseInterests"
        );


    if (
        !classSelect ||
        !studentsCount ||
        !careerPercentage ||
        !achievementsCount ||
        !savedCareersCount ||
        !signalsContainer ||
        !interestsContainer
    ) {
        return;
    }


    // ========================================
    // LOAD STUDENT DATA
    // ========================================

    async function getClassPulseData() {

        const [
            profilesResult,
            assessmentsResult,
            achievementsResult,
            savedCareersResult
        ] = await Promise.all([

            supabaseClient
                .from("profiles")
                .select(
                    "id, full_name, role, class"
                )
                .eq(
                    "role",
                    "student"
                ),

            supabaseClient
                .from("career_assessments")
                .select(
                    "id, student_id, status, attempt_number"
                )
                .eq(
                    "status",
                    "completed"
                ),

            
                supabaseClient
    .from("achievements")
    .select("*"),

            supabaseClient
                .from("saved_careers")
                .select(
                    "id, student_id, career_name, career_category"
                )

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

            profiles:
                profilesResult.data || [],

            assessments:
                assessmentsResult.data || [],

            achievements:
                achievementsResult.data || [],

            savedCareers:
                savedCareersResult.data || []

        };

    }


    // ========================================
    // POPULATE CLASS DROPDOWN
    // ========================================

    function populateClassDropdown(
        profiles
    ) {

        const classes = [
            ...new Set(
                profiles
                    .map(
                        student =>
                            student.class
                    )
                    .filter(Boolean)
            )
        ].sort();


        classSelect.innerHTML = `

            <option value="all">
                All Students
            </option>

            ${classes.map(
                function (className) {

                    return `
                        <option value="${className}">
                            ${className}
                        </option>
                    `;

                }
            ).join("")}

        `;

    }


    // ========================================
    // ANALYZE CLASS
    // ========================================

    function analyzeClass(
        data,
        selectedClass
    ) {

        const students =
            selectedClass === "all"
                ? data.profiles
                : data.profiles.filter(
                    student =>
                        student.class ===
                        selectedClass
                );


        const studentIds =
            new Set(
                students.map(
                    student =>
                        student.id
                )
            );


        const assessments =
            data.assessments.filter(
                assessment =>
                    studentIds.has(
                        assessment.student_id
                    )
            );


        const achievements =
            data.achievements.filter(
                achievement =>
                    studentIds.has(
                        achievement.student_id
                    )
            );


        const savedCareers =
            data.savedCareers.filter(
                career =>
                    studentIds.has(
                        career.student_id
                    )
            );


        const studentsWithAssessment =
            new Set(
                assessments.map(
                    assessment =>
                        assessment.student_id
                )
            );


        const studentsWithCareers =
            new Set(
                savedCareers.map(
                    career =>
                        career.student_id
                )
            );


        return {

            students,

            assessments,

            achievements,

            savedCareers,

            studentsWithAssessment,

            studentsWithCareers

        };

    }


    // ========================================
    // RENDER STATS
    // ========================================

    function renderStats(
        analysis
    ) {

        const totalStudents =
            analysis.students.length;


        const assessmentStudents =
            analysis.studentsWithAssessment.size;


        const careerPercentage =
            totalStudents
                ? Math.round(
                    (
                        assessmentStudents /
                        totalStudents
                    ) * 100
                )
                : 0;


        studentsCount.textContent =
            totalStudents;


        careerPercentageElement =
            careerPercentage;


        document.getElementById(
            "classPulseCareer"
        ).textContent =
            careerPercentage + "%";


        achievementsCount.textContent =
            analysis.achievements.length;


        savedCareersCount.textContent =
            analysis.savedCareers.length;

    }


    // ========================================
    // RENDER LEARNING SIGNALS
    // ========================================

    function renderSignals(
        analysis
    ) {

        const total =
            analysis.students.length;


        if (!total) {

            signalsContainer.innerHTML = `

                <div class="class-pulse-empty-state">

                    <div>
                        📊
                    </div>

                    <h3>
                        No students found
                    </h3>

                    <p>
                        There is no student data available
                        for this selection yet.
                    </p>

                </div>

            `;

            return;

        }


        const assessmentRate =
            Math.round(
                (
                    analysis.studentsWithAssessment.size /
                    total
                ) * 100
            );


        const careerRate =
            Math.round(
                (
                    analysis.studentsWithCareers.size /
                    total
                ) * 100
            );


        const studentsWithAchievements =
    new Set(
        analysis.achievements.map(
            achievement =>
                achievement.student_id
        )
    );

const achievementRate =
    Math.round(
        (
            studentsWithAchievements.size /
            total
        ) * 100
    );

        const signals = [

            {

                icon: "🎯",

                title:
                    "Career Exploration",

                percentage:
                    assessmentRate,

                description:
                    assessmentRate +
                    "% of students have completed a career assessment."

            },


            {

                icon: "🧭",

                title:
                    "Career Interests",

                percentage:
                    careerRate,

                description:
                    careerRate +
                    "% of students have saved at least one career interest."

            },


            {

                icon: "🏆",

                title:
                    "Achievement Activity",

                percentage:
                    achievementRate,

                description:
    achievementRate +
    "% of students have at least one achievement recorded."

            }

        ];


        signalsContainer.innerHTML =
            signals.map(
                function (signal) {

                    return `

                        <article
                            class="class-pulse-signal-card"
                        >

                            <div
                                class="class-pulse-signal-header"
                            >

                                <div
                                    class="class-pulse-signal-icon"
                                >
                                    ${signal.icon}
                                </div>

                                <div>

                                    <h3>
                                        ${signal.title}
                                    </h3>

                                    <span>
                                        ${signal.percentage}% class signal
                                    </span>

                                </div>

                            </div>


                            <div
                                class="class-pulse-progress"
                            >

                                <div
                                    class="class-pulse-progress-fill"
                                    style="width: ${signal.percentage}%"
                                ></div>

                            </div>


                            <p
                                class="class-pulse-signal-description"
                            >
                                ${signal.description}
                            </p>

                        </article>

                    `;

                }
            ).join("");

    }


    // ========================================
    // RENDER INTERESTS
    // ========================================

    function renderInterests(
        analysis
    ) {

        if (
            !analysis.savedCareers.length
        ) {

            interestsContainer.innerHTML = `

                <div class="class-pulse-empty-state">

                    <div>
                        🧭
                    </div>

                    <h3>
                        No saved career interests yet
                    </h3>

                    <p>
                        Career interests will appear here
                        as students explore NAVENTRA.
                    </p>

                </div>

            `;

            return;

        }


        const careerCounts = {};


        analysis.savedCareers.forEach(
            function (career) {

                const name =
                    career.career_name ||
                    "Unknown Career";


                careerCounts[name] =
                    (
                        careerCounts[name] ||
                        0
                    ) + 1;

            }
        );


        const sortedCareers =
            Object.entries(
                careerCounts
            )
                .sort(
                    function (a, b) {

                        return b[1] - a[1];

                    }
                )
                .slice(0, 8);


        interestsContainer.innerHTML =
            sortedCareers.map(
                function (entry, index) {

                    const careerName =
                        entry[0];

                    const count =
                        entry[1];


                    const icons = [
                        "💡",
                        "🎯",
                        "🧠",
                        "💻",
                        "🩺",
                        "🎨",
                        "🌱",
                        "📚"
                    ];


                    return `

                        <div
                            class="class-pulse-interest-item"
                        >

                            <div
                                class="class-pulse-interest-icon"
                            >
                                ${icons[index] || "✨"}
                            </div>

                            <div
                                class="class-pulse-interest-content"
                            >

                                <strong>
                                    ${careerName}
                                </strong>

                                <span>
                                    ${count}
                                    student${count === 1 ? "" : "s"}
                                    interested
                                </span>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    }


    // ========================================
    // UPDATE CLASS PULSE
    // ========================================

    async function updateClassPulse() {

    try {

        signalsContainer.innerHTML = `
            <div class="class-pulse-empty-state">
                <div>✨</div>
                <h3>NAVENTRA is reading the class pulse...</h3>
                <p>Analyzing available student activity.</p>
            </div>
        `;

        const data = await getClassPulseData();

        populateClassDropdown(data.profiles);

        const selectedClass = classSelect.value;

        const analysis = analyzeClass(
            data,
            selectedClass
        );

        renderStats(analysis);
        renderSignals(analysis);
        renderInterests(analysis);

    } catch (error) {

        console.error(
            "Class Pulse error:",
            error
        );

    }

}


    console.log(
        "📊 NAVENTRA Class Pulse loaded."
    );

}


// ========================================
// START CLASS PULSE
// ========================================

if (
    document.getElementById(
        "teacher-class-pulse"
    )
) {

    loadClassPulse();

}
// ========================================
// NAVENTRA — STUDENT STRENGTH RADAR
// ========================================

async function loadStudentStrengthRadar() {

    const page =
        document.getElementById(
            "teacher-strength-radar"
        );

    if (!page) {
        return;
    }

    const studentSelect =
        document.getElementById(
            "strengthRadarStudent"
        );

    const emptyState =
        document.getElementById(
            "strengthRadarEmpty"
        );

    const content =
        document.getElementById(
            "strengthRadarContent"
        );

    const studentName =
        document.getElementById(
            "strengthRadarStudentName"
        );

    const studentClass =
        document.getElementById(
            "strengthRadarStudentClass"
        );

    const strengthsContainer =
        document.getElementById(
            "strengthRadarStrengths"
        );

    const careersContainer =
        document.getElementById(
            "strengthRadarCareers"
        );

    const achievementsContainer =
        document.getElementById(
            "strengthRadarAchievements"
        );

    const growthContainer =
        document.getElementById(
            "strengthRadarGrowth"
        );

    if (
        !studentSelect ||
        !emptyState ||
        !content ||
        !studentName ||
        !studentClass ||
        !strengthsContainer ||
        !careersContainer ||
        !achievementsContainer ||
        !growthContainer
    ) {
        return;
    }


    // ========================================
    // LOAD STUDENTS
    // ========================================

    async function loadStudents() {

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select(
                "id, full_name, role, class"
            )
            .eq(
                "role",
                "student"
            )
            .order(
                "full_name",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }

        studentSelect.innerHTML = `
            <option value="">
                Select a student
            </option>
        `;

        (data || []).forEach(
            function (student) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    student.id;

                option.textContent =
                    student.full_name ||
                    "Unnamed Student";

                studentSelect.appendChild(
                    option
                );
            }
        );

        return data || [];
    }


    // ========================================
    // LOAD STUDENT DATA
    // ========================================

    async function loadStudentData(
        studentId
    ) {

        const [
            profileResult,
            assessmentResult,
            achievementsResult,
            savedCareersResult
        ] = await Promise.all([

            supabaseClient
                .from("profiles")
                .select("*")
                .eq(
                    "id",
                    studentId
                )
                .maybeSingle(),

            supabaseClient
                .from("career_assessments")
                .select("*")
                .eq(
                    "student_id",
                    studentId
                )
                .eq(
                    "status",
                    "completed"
                )
                .order(
                    "attempt_number",
                    {
                        ascending: false
                    }
                )
                .limit(1)
                .maybeSingle(),

            supabaseClient
                .from("achievements")
                .select("*")
                .eq(
                    "student_id",
                    studentId
                )
                .order(
                    "achievement_date",
                    {
                        ascending: false
                    }
                ),

            supabaseClient
                .from("saved_careers")
                .select("*")
                .eq(
                    "student_id",
                    studentId
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )

        ]);


        if (profileResult.error) {
            throw profileResult.error;
        }

        if (assessmentResult.error) {
            throw assessmentResult.error;
        }

        if (achievementsResult.error) {
            throw achievementsResult.error;
        }

        if (savedCareersResult.error) {
            throw savedCareersResult.error;
        }


        return {

            profile:
                profileResult.data,

            assessment:
                assessmentResult.data,

            achievements:
                achievementsResult.data || [],

            savedCareers:
                savedCareersResult.data || []

        };
    }


    // ========================================
    // CREATE STRENGTH INSIGHTS
    // ========================================

    // ========================================
// BUILD INTELLIGENT STRENGTH PROFILE
// ========================================

function buildStrengths(data) {

    const strengthScores = {};
    const strengthEvidence = {};

    function addStrength(
        name,
        icon,
        points,
        description
    ) {

        if (!strengthScores[name]) {
            strengthScores[name] = 0;
            strengthEvidence[name] = {
                icon: icon,
                description: description
            };
        }

        strengthScores[name] += points;
    }


    // ========================================
    // ASSESSMENT SIGNALS
    // ========================================

    if (
        data.assessment &&
        data.assessment.answers
    ) {

        const answers =
            data.assessment.answers;


        /*
         * NAVENTRA tries to understand the
         * structure of the assessment rather
         * than assuming one exact database format.
         */

        Object.values(
            answers
        ).forEach(
            function(answer) {

                if (!answer) {
                    return;
                }


                const text =
                    typeof answer === "string"
                        ? answer.toLowerCase()
                        : JSON.stringify(
                            answer
                        ).toLowerCase();


                // --------------------------------
                // ANALYTICAL THINKING
                // --------------------------------

                if (
                    text.includes("science") ||
                    text.includes("research") ||
                    text.includes("analysis") ||
                    text.includes("analytical") ||
                    text.includes("problem") ||
                    text.includes("logic") ||
                    text.includes("mathematics") ||
                    text.includes("math") ||
                    text.includes("technology")
                ) {

                    addStrength(
                        "Analytical Thinking",
                        "🔍",
                        3,
                        "Assessment responses suggest an interest in reasoning, investigation, or solving complex problems."
                    );

                }


                // --------------------------------
                // CREATIVE THINKING
                // --------------------------------

                if (
                    text.includes("creative") ||
                    text.includes("design") ||
                    text.includes("art") ||
                    text.includes("writing") ||
                    text.includes("story") ||
                    text.includes("imagination") ||
                    text.includes("media") ||
                    text.includes("content")
                ) {

                    addStrength(
                        "Creative Thinking",
                        "💡",
                        3,
                        "Assessment responses suggest curiosity toward creating, designing, imagining, or expressing new ideas."
                    );

                }


                // --------------------------------
                // COMMUNICATION
                // --------------------------------

                if (
                    text.includes("communication") ||
                    text.includes("speaking") ||
                    text.includes("language") ||
                    text.includes("writing") ||
                    text.includes("debate") ||
                    text.includes("presentation") ||
                    text.includes("people") ||
                    text.includes("social")
                ) {

                    addStrength(
                        "Communication",
                        "🗣️",
                        3,
                        "Assessment responses suggest an interest in expressing ideas and connecting with others."
                    );

                }


                // --------------------------------
                // LEADERSHIP
                // --------------------------------

                if (
                    text.includes("leadership") ||
                    text.includes("leader") ||
                    text.includes("organize") ||
                    text.includes("team") ||
                    text.includes("responsibility") ||
                    text.includes("decision")
                ) {

                    addStrength(
                        "Leadership",
                        "👑",
                        3,
                        "Assessment responses suggest an interest in taking responsibility, organizing, or guiding others."
                    );

                }


                // --------------------------------
                // SOCIAL & EMPATHETIC THINKING
                // --------------------------------

                if (
                    text.includes("helping") ||
                    text.includes("care") ||
                    text.includes("health") ||
                    text.includes("psychology") ||
                    text.includes("counselling") ||
                    text.includes("counseling") ||
                    text.includes("community") ||
                    text.includes("empathy") ||
                    text.includes("human")
                ) {

                    addStrength(
                        "Social & Empathetic Thinking",
                        "🤝",
                        3,
                        "Assessment responses suggest an interest in understanding, supporting, or working with people."
                    );

                }


                // --------------------------------
                // SCIENTIFIC THINKING
                // --------------------------------

                if (
                    text.includes("biology") ||
                    text.includes("chemistry") ||
                    text.includes("physics") ||
                    text.includes("laboratory") ||
                    text.includes("experiment") ||
                    text.includes("scientific")
                ) {

                    addStrength(
                        "Scientific Thinking",
                        "🔬",
                        3,
                        "Assessment responses suggest curiosity about evidence, experiments, and understanding how things work."
                    );

                }

            }
        );

    }


    // ========================================
    // SAVED CAREER SIGNALS
    // ========================================

    data.savedCareers.forEach(
        function(career) {

            const category =
                (
                    career.career_category ||
                    ""
                ).toLowerCase();

            const name =
                (
                    career.career_name ||
                    ""
                ).toLowerCase();

            const combined =
                category +
                " " +
                name;


            if (
                combined.includes("technology") ||
                combined.includes("computer") ||
                combined.includes("engineering") ||
                combined.includes("science")
            ) {

                addStrength(
                    "Analytical Thinking",
                    "🔍",
                    2,
                    "Saved career interests show curiosity toward analytical, scientific, or technical pathways."
                );

            }


            if (
                combined.includes("media") ||
                combined.includes("communication") ||
                combined.includes("journal") ||
                combined.includes("writing")
            ) {

                addStrength(
                    "Communication",
                    "🗣️",
                    2,
                    "Saved career interests show an interest in communication, expression, or sharing ideas."
                );

            }


            if (
                combined.includes("education") ||
                combined.includes("teaching") ||
                combined.includes("psychology") ||
                combined.includes("human") ||
                combined.includes("health")
            ) {

                addStrength(
                    "Social & Empathetic Thinking",
                    "🤝",
                    2,
                    "Saved career interests show an interest in people, learning, wellbeing, or helping others."
                );

            }


            if (
                combined.includes("art") ||
                combined.includes("design") ||
                combined.includes("creative") ||
                combined.includes("fashion")
            ) {

                addStrength(
                    "Creative Thinking",
                    "💡",
                    2,
                    "Saved career interests show an interest in creative expression and design."
                );

            }


            if (
                combined.includes("business") ||
                combined.includes("management") ||
                combined.includes("leadership") ||
                combined.includes("entrepreneur")
            ) {

                addStrength(
                    "Leadership",
                    "👑",
                    2,
                    "Saved career interests show curiosity toward leadership, organization, or initiative."
                );

            }

        }
    );


    // ========================================
    // ACHIEVEMENT SIGNAL
    // ========================================

    if (
        data.achievements.length > 0
    ) {

        addStrength(
            "Initiative & Achievement",
            "🏆",
            Math.min(
                data.achievements.length * 2,
                6
            ),
            "Recorded achievements indicate active participation, initiative, or accomplishment."
        );

    }


    // ========================================
    // SORT BY SIGNAL STRENGTH
    // ========================================

    const rankedStrengths =
    Object.entries(
        strengthScores
    )
    .sort(
        function(a, b) {
            return b[1] - a[1];
        }
    )
    .slice(0, 6);

const maxStrengthScore =
    rankedStrengths.length
        ? rankedStrengths[0][1]
        : 1;




    // ========================================
    // CONVERT INTO DISPLAY OBJECTS
    // ========================================

    const strengths =
    rankedStrengths.map(
        function(entry) {

            const name =
                entry[0];

            const rawScore =
                entry[1];

            const signalScore =
                Math.round(
                    (rawScore / maxStrengthScore) * 100
                );

            let signalLabel =
                "Emerging Signal";

            if (signalScore >= 80) {

                signalLabel =
                    "Strong Signal";

            }
            else if (signalScore >= 60) {

                signalLabel =
                    "Clear Signal";

            }

            return {

                title:
                    name,

                icon:
                    strengthEvidence[
                        name
                    ].icon,

                description:
                    strengthEvidence[
                        name
                    ].description,

                score:
                    signalScore,

                signalLabel:
                    signalLabel

            };

        }
    );

    // ========================================
    // FALLBACK
    // ========================================

    if (!strengths.length) {

        strengths.push({

            title:
                "Exploration in Progress",

            icon:
                "✨",

            description:
                "NAVENTRA needs more assessment or activity signals to identify meaningful developing strengths."

        });

    }


    return strengths;
}

    // ========================================
// RENDER STRENGTHS
// ========================================

function renderStrengths(
    strengths
) {

    strengthsContainer.innerHTML =
        strengths.map(
            function (strength) {

                return `
                    <article
                        class="strength-radar-strength-card"
                    >

                        <div
                            class="strength-radar-strength-icon"
                        >
                            ${strength.icon}
                        </div>

                        <div
                            class="strength-radar-strength-top"
                        >

                            <div>

                                <h3>
                                    ${strength.title}
                                </h3>

                                <span
                                    class="strength-radar-signal-label"
                                >
                                    ${strength.signalLabel}
                                </span>

                            </div>

                            <strong
                                class="strength-radar-score"
                            >
                                ${strength.score}%
                            </strong>

                        </div>

                        <div
                            class="strength-radar-score-row"
                        >

                            <span>
                                Signal strength
                            </span>

                            <span>
                                ${strength.score}%
                            </span>

                        </div>

                        <div
                            class="strength-radar-strength-progress"
                        >

                            <div
                                class="strength-radar-strength-fill"
                                style="width: ${strength.score}%"
                            ></div>

                        </div>

                        <p>
                            ${strength.description}
                        </p>

                    </article>
                `;

            }
        ).join("");
}

    // ========================================
    // RENDER CAREERS
    // ========================================

    function renderCareers(
        careers
    ) {

        if (!careers.length) {

            careersContainer.innerHTML = `
                <div class="class-pulse-empty-state">
                    <div>🧭</div>

                    <h3>
                        No saved careers yet
                    </h3>

                    <p>
                        Career interests will appear here
                        as the student explores NAVENTRA.
                    </p>
                </div>
            `;

            return;
        }


        careersContainer.innerHTML =
            careers
                .slice(0, 10)
                .map(
                    function (career) {

                        return `
                            <div
                                class="strength-radar-career-chip"
                            >
                                🎯
                                ${career.career_name ||
                                "Career Interest"}
                            </div>
                        `;

                    }
                )
                .join("");
    }


    // ========================================
    // RENDER ACHIEVEMENTS
    // ========================================

    function renderAchievements(
        achievements
    ) {

        if (!achievements.length) {

            achievementsContainer.innerHTML = `
                <div class="class-pulse-empty-state">
                    <div>🏆</div>

                    <h3>
                        No achievements recorded yet
                    </h3>

                    <p>
                        Achievements will appear here
                        when they are added to NAVENTRA.
                    </p>
                </div>
            `;

            return;
        }


        achievementsContainer.innerHTML =
            achievements
                .slice(0, 6)
                .map(
                    function (achievement) {

                        const title =
                            achievement.title ||
                            achievement.name ||
                            achievement.achievement_name ||
                            "Achievement";

                        const date =
                            achievement.achievement_date ||
                            "";

                        return `
                            <div
                                class="strength-radar-achievement-card"
                            >

                                <div
                                    class="strength-radar-achievement-icon"
                                >
                                    🏆
                                </div>

                                <div>

                                    <strong>
                                        ${title}
                                    </strong>

                                    <span>
                                        ${date || "Achievement recorded"}
                                    </span>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");
    }


    // ========================================
    // RENDER GROWTH AREAS
    // ========================================

    function renderGrowth(
        data
    ) {

        const growthAreas = [];


        if (
            !data.assessment
        ) {

            growthAreas.push({

                title:
                    "Complete Career Assessment",

                description:
                    "A completed assessment would give NAVENTRA more information about the student's interests and developing strengths."

            });

        }


        if (
            !data.savedCareers.length
        ) {

            growthAreas.push({

                title:
                    "Explore Career Interests",

                description:
                    "Exploring and saving careers can help the student build a clearer picture of possible future pathways."

            });

        }


        if (
            !data.achievements.length
        ) {

            growthAreas.push({

                title:
                    "Build an Achievement Record",

                description:
                    "Participation in projects, competitions, activities, or other accomplishments can help document developing strengths."

            });

        }


        if (!growthAreas.length) {

            growthAreas.push({

                title:
                    "Continue Exploring",

                description:
                    "The student already has several activity signals. Continued exploration can help strengthen and refine this profile."

            });

            growthAreas.push({

                title:
                    "Turn Interests into Skills",

                description:
                    "Encouraging projects, activities, and real-world experiences connected to current interests can support further growth."

            });

        }


        growthContainer.innerHTML =
            growthAreas
                .map(
                    function (area) {

                        return `
                            <div
                                class="strength-radar-growth-card"
                            >

                                <strong>
                                    ${area.title}
                                </strong>

                                <p>
                                    ${area.description}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");
    }


    // ========================================
    // RENDER COMPLETE PROFILE
    // ========================================

    async function renderStudentProfile(
        studentId
    ) {

        if (!studentId) {

            emptyState.style.display =
                "block";

            content.style.display =
                "none";

            return;
        }


        emptyState.innerHTML = `
            <div class="strength-radar-empty-icon">
                ⏳
            </div>

            <h3>
                NAVENTRA is building the profile...
            </h3>

            <p>
                Analyzing available student information.
            </p>
        `;

        emptyState.style.display =
            "block";

        content.style.display =
            "none";


        try {

            const data =
                await loadStudentData(
                    studentId
                );


            if (!data.profile) {

                throw new Error(
                    "Student profile not found."
                );

            }


            studentName.textContent =
                data.profile.full_name ||
                "Unnamed Student";

            studentClass.textContent =
                data.profile.class
                    ? `Class ${data.profile.class}`
                    : "Class not specified";


            const strengths =
                buildStrengths(
                    data
                );


            renderStrengths(
                strengths
            );

            renderCareers(
                data.savedCareers
            );

            renderAchievements(
                data.achievements
            );

            renderGrowth(
                data
            );


            emptyState.style.display =
                "none";

            content.style.display =
                "flex";

        } catch (error) {

            console.error(
                "Student Strength Radar error:",
                error
            );

            emptyState.innerHTML = `
                <div class="strength-radar-empty-icon">
                    ⚠️
                </div>

                <h3>
                    Could not build student profile
                </h3>

                <p>
                    NAVENTRA could not access the
                    required student information.
                </p>
            `;

            emptyState.style.display =
                "block";

            content.style.display =
                "none";
        }
    }


    // ========================================
    // STUDENT SELECTION
    // ========================================

    studentSelect.addEventListener(
        "change",
        function () {

            renderStudentProfile(
                studentSelect.value
            );

        }
    );


    // ========================================
    // INITIAL LOAD
    // ========================================

    try {

        await loadStudents();

        console.log(
            "🧠 NAVENTRA Student Strength Radar loaded."
        );

    } catch (error) {

        console.error(
            "Student Strength Radar initialization error:",
            error
        );

    }
}


// ========================================
// START STUDENT STRENGTH RADAR
// ========================================

if (
    document.getElementById(
        "teacher-strength-radar"
    )
) {

    loadStudentStrengthRadar();

}
// ========================================
// SMART FACULTY SCHEDULE
// ========================================

async function loadSmartFacultySchedule() {

    const page =
        document.getElementById("teacher-schedule");

    if (!page) {
        return;
    }

    const todayPeriods =
        document.getElementById("facultyTodayPeriods");

    const todayClasses =
        document.getElementById("facultyTodayClasses");

    const todayFree =
        document.getElementById("facultyTodayFree");

    const todayConflicts =
        document.getElementById("facultyTodayConflicts");

    const todaySchedule =
        document.getElementById("facultyTodaySchedule");

    const weeklySchedule =
        document.getElementById("facultyWeeklySchedule");

    const insightTitle =
        document.getElementById("facultyScheduleInsightTitle");

    const insightText =
        document.getElementById("facultyScheduleInsightText");

    const weekButtons =
        document.querySelectorAll(
            ".faculty-week-button"
        );

    if (
        !todayPeriods ||
        !todayClasses ||
        !todayFree ||
        !todayConflicts ||
        !todaySchedule ||
        !weeklySchedule
    ) {
        return;
    }


    // ========================================
    // GET LOGGED-IN TEACHER
    // ========================================

    const {
        data: {
            user
        },
        error: userError
    } = await supabaseClient.auth.getUser();


    if (userError || !user) {

        console.error(
            "Smart Faculty Schedule: Could not identify teacher.",
            userError
        );

        todaySchedule.innerHTML = `
            <div class="faculty-schedule-empty-state">
                <div>⚠️</div>

                <h3>
                    Teacher account not found
                </h3>

                <p>
                    NAVENTRA could not identify the
                    currently signed-in teacher.
                </p>
            </div>
        `;

        return;
    }


    // ========================================
    // LOAD SCHEDULE
    // ========================================

    async function getSchedule() {

        const {
            data,
            error
        } = await supabaseClient
            .from("faculty_schedule")
            .select(`
                id,
                teacher_id,
                day,
                period,
                start_time,
                end_time,
                subject,
                class_name,
                room,
                status
            `)
            .eq("teacher_id", user.id)
            .order("period", {
                ascending: true
            });


        if (error) {
            throw error;
        }


        return data || [];
    }


    // ========================================
    // DAY ORDER
    // ========================================

    const dayOrder = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
    ];


    // ========================================
    // FORMAT TIME
    // ========================================

    function formatTime(time) {

        if (!time) {
            return "";
        }

        const parts =
            time.split(":");

        let hour =
            parseInt(parts[0], 10);

        const minutes =
            parts[1];

        const suffix =
            hour >= 12
                ? "PM"
                : "AM";

        hour =
            hour % 12 || 12;

        return (
            hour +
            ":" +
            minutes +
            " " +
            suffix
        );
    }


    // ========================================
    // GET TODAY
    // ========================================

    function getTodayName() {

        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        return days[
            new Date().getDay()
        ];
    }


    // ========================================
    // FIND NEXT AVAILABLE DAY
    // ========================================

    function getDefaultDisplayDay(schedule) {

        const today =
            getTodayName();

        if (
            dayOrder.includes(today) &&
            schedule.some(
                function(item) {
                    return item.day === today;
                }
            )
        ) {
            return today;
        }


        const availableDay =
            dayOrder.find(
                function(day) {

                    return schedule.some(
                        function(item) {
                            return item.day === day;
                        }
                    );

                }
            );


        return availableDay || "Monday";
    }


    // ========================================
    // FIND CONFLICTS
    // ========================================

    function findConflicts(schedule) {

        const conflicts = [];

        const grouped = {};

        schedule.forEach(
            function(item) {

                if (!grouped[item.day]) {
                    grouped[item.day] = [];
                }

                grouped[item.day].push(item);

            }
        );


        Object.keys(grouped).forEach(
            function(day) {

                const items =
                    grouped[day];

                for (
                    let i = 0;
                    i < items.length;
                    i++
                ) {

                    for (
                        let j = i + 1;
                        j < items.length;
                        j++
                    ) {

                        const first =
                            items[i];

                        const second =
                            items[j];


                        if (
                            first.start_time <
                                second.end_time &&
                            second.start_time <
                                first.end_time
                        ) {

                            conflicts.push({
                                day: day,
                                first: first,
                                second: second
                            });

                        }

                    }

                }

            }
        );


        return conflicts;
    }


   

    // ========================================
// CALCULATE FREE PERIODS
// ========================================

function calculateFreePeriods(
    daySchedule
) {

    if (!daySchedule.length) {
        return 0;
    }

    const sortedSchedule =
        [...daySchedule].sort(
            function(a, b) {
                return a.start_time.localeCompare(
                    b.start_time
                );
            }
        );

    let freePeriods = 0;

    for (
        let i = 0;
        i < sortedSchedule.length - 1;
        i++
    ) {

        const currentEnd =
            sortedSchedule[i].end_time;

        const nextStart =
            sortedSchedule[i + 1].start_time;

        if (currentEnd < nextStart) {
            freePeriods++;
        }

    }

    return freePeriods;
}


    // ========================================
    // RENDER TODAY
    // ========================================

    function renderToday(
        schedule,
        displayDay
    ) {

        const daySchedule =
            schedule
                .filter(
                    function(item) {
                        return item.day === displayDay;
                    }
                )
                .sort(
                    function(a, b) {
                        return a.period - b.period;
                    }
                );


        const conflicts =
            findConflicts(
                daySchedule
            );


        todayPeriods.textContent =
            daySchedule.length;


        todayClasses.textContent =
            new Set(
                daySchedule.map(
                    function(item) {
                        return item.class_name;
                    }
                )
            ).size;


        todayFree.textContent =
            calculateFreePeriods(
                daySchedule
            );


        todayConflicts.textContent =
            conflicts.length;


        if (!daySchedule.length) {

            todaySchedule.innerHTML = `
                <div class="faculty-schedule-empty-state">

                    <div>📅</div>

                    <h3>
                        No teaching periods scheduled
                    </h3>

                    <p>
                        There are no teaching commitments
                        recorded for ${displayDay}.
                    </p>

                </div>
            `;

            return;
        }


        todaySchedule.innerHTML =
            daySchedule.map(
                function(item) {

                    const hasConflict =
                        conflicts.some(
                            function(conflict) {

                                return (
                                    conflict.first.id === item.id ||
                                    conflict.second.id === item.id
                                );

                            }
                        );


                    return `
                        <article
                            class="faculty-schedule-period
                            ${hasConflict ? "conflict" : ""}"
                        >

                            <div
                                class="faculty-schedule-period-time"
                            >
                                Period ${item.period}
                                <br>
                                ${formatTime(item.start_time)}
                                –
                                ${formatTime(item.end_time)}
                            </div>


                            <div
                                class="faculty-schedule-period-main"
                            >

                                <h3>
                                    ${item.subject}
                                </h3>

                                <p>
                                    Class ${item.class_name}
                                    • ${item.room}
                                </p>

                            </div>


                            <div
                                class="faculty-schedule-period-status"
                            >
                                ${
                                    hasConflict
                                        ? "⚠️ Conflict"
                                        : item.status === "completed"
                                            ? "✓ Completed"
                                            : "Scheduled"
                                }
                            </div>

                        </article>
                    `;

                }
            ).join("");
    }


    // ========================================
    // RENDER WEEKLY DAY
    // ========================================

    function renderWeeklyDay(
        schedule,
        selectedDay
    ) {

        const daySchedule =
            schedule
                .filter(
                    function(item) {
                        return item.day === selectedDay;
                    }
                )
                .sort(
                    function(a, b) {
                        return a.period - b.period;
                    }
                );


        if (!daySchedule.length) {

            weeklySchedule.innerHTML = `
                <div class="faculty-schedule-empty-state">

                    <div>🗓️</div>

                    <h3>
                        No classes scheduled
                    </h3>

                    <p>
                        No teaching periods are recorded
                        for ${selectedDay}.
                    </p>

                </div>
            `;

            return;
        }


        weeklySchedule.innerHTML =
            daySchedule.map(
                function(item) {

                    return `
                        <div
                            class="faculty-week-row"
                        >

                            <div
                                class="faculty-week-period"
                            >
                                Period ${item.period}
                                <br>
                                ${formatTime(item.start_time)}
                            </div>


                            <div
                                class="faculty-week-class"
                            >

                                <div
                                    class="faculty-week-class-main"
                                >

                                    <strong>
                                        ${item.subject}
                                    </strong>

                                    <span>
                                        Class ${item.class_name}
                                        •
                                        ${formatTime(item.start_time)}
                                        –
                                        ${formatTime(item.end_time)}
                                    </span>

                                </div>


                                <div
                                    class="faculty-week-class-room"
                                >
                                    ${item.room}
                                </div>

                            </div>

                        </div>
                    `;

                }
            ).join("");
    }


    // ========================================
    // GENERATE SCHEDULE INSIGHT
    // ========================================

    function generateInsight(
        schedule
    ) {

        if (!schedule.length) {

            insightTitle.textContent =
                "Build your teaching rhythm";

            insightText.textContent =
                "NAVENTRA needs timetable data before it can identify teaching patterns and planning opportunities.";

            return;
        }


        const totalPeriods =
            schedule.length;


        const uniqueDays =
            new Set(
                schedule.map(
                    function(item) {
                        return item.day;
                    }
                )
            ).size;


        const uniqueClasses =
            new Set(
                schedule.map(
                    function(item) {
                        return item.class_name;
                    }
                )
            ).size;


        const conflicts =
            findConflicts(
                schedule
            ).length;


        if (conflicts > 0) {

            insightTitle.textContent =
                "Schedule attention needed";

            insightText.textContent =
                "NAVENTRA detected " +
                conflicts +
                " overlapping teaching commitment" +
                (
                    conflicts === 1
                        ? ""
                        : "s"
                ) +
                ". Reviewing these overlaps could help prevent timetable conflicts.";

            return;
        }


        if (totalPeriods >= 8) {

            insightTitle.textContent =
                "A full teaching rhythm";

            insightText.textContent =
                "You currently have " +
                totalPeriods +
                " scheduled teaching periods across " +
                uniqueDays +
                " teaching days and " +
                uniqueClasses +
                " classes. NAVENTRA can help identify planning gaps within this rhythm.";

            return;
        }


        insightTitle.textContent =
            "A balanced teaching pattern";

        insightText.textContent =
            "Your timetable currently contains " +
            totalPeriods +
            " teaching periods across " +
            uniqueDays +
            " teaching days. Free periods can provide useful space for planning, preparation, and student support.";
    }


    // ========================================
    // WEEK BUTTONS
    // ========================================

    weekButtons.forEach(
        function(button) {

            button.addEventListener(
                "click",
                function() {

                    weekButtons.forEach(
                        function(otherButton) {
                            otherButton.classList.remove(
                                "active"
                            );
                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const selectedDay =
                        button.getAttribute(
                            "data-day"
                        );


                    renderWeeklyDay(
                        currentSchedule,
                        selectedDay
                    );

                }
            );

        }
    );


    // ========================================
    // LOAD EVERYTHING
    // ========================================

    let currentSchedule = [];


    try {

        todaySchedule.innerHTML = `
            <div class="faculty-schedule-empty-state">

                <div>✨</div>

                <h3>
                    NAVENTRA is reading your timetable...
                </h3>

                <p>
                    Organizing teaching periods and
                    schedule patterns.
                </p>

            </div>
        `;


        currentSchedule =
            await getSchedule();


        console.log(
            "📅 NAVENTRA Faculty Schedule loaded:",
            currentSchedule.length,
            "entries"
        );


        if (!currentSchedule.length) {

            todayPeriods.textContent = "0";
            todayClasses.textContent = "0";
            todayFree.textContent = "0";
            todayConflicts.textContent = "0";


            todaySchedule.innerHTML = `
                <div class="faculty-schedule-empty-state">

                    <div>📅</div>

                    <h3>
                        No timetable data found
                    </h3>

                    <p>
                        NAVENTRA could not find any
                        schedule entries for this teacher.
                    </p>

                </div>
            `;


            weeklySchedule.innerHTML = `
                <div class="faculty-schedule-empty-state">

                    <div>🗓️</div>

                    <h3>
                        No timetable data found
                    </h3>

                    <p>
                        Add teaching periods to
                        faculty_schedule to populate this view.
                    </p>

                </div>
            `;


            generateInsight(
                currentSchedule
            );

            return;
        }


        // ========================================
        // TODAY / NEXT AVAILABLE DAY
        // ========================================

        const displayDay =
            getDefaultDisplayDay(
                currentSchedule
            );


        renderToday(
            currentSchedule,
            displayDay
        );


        // ========================================
        // DEFAULT WEEKLY DAY
        // ========================================

        const defaultButton =
            Array.from(
                weekButtons
            ).find(
                function(button) {
                    return (
                        button.getAttribute(
                            "data-day"
                        ) === displayDay
                    );
                }
            );


        weekButtons.forEach(
            function(button) {
                button.classList.remove(
                    "active"
                );
            }
        );


        if (defaultButton) {

            defaultButton.classList.add(
                "active"
            );

        }


        renderWeeklyDay(
            currentSchedule,
            displayDay
        );


        // ========================================
        // INSIGHT
        // ========================================

        generateInsight(
            currentSchedule
        );


    } catch (error) {

        console.error(
            "Smart Faculty Schedule error:",
            error
        );


        todaySchedule.innerHTML = `
            <div class="faculty-schedule-empty-state">

                <div>⚠️</div>

                <h3>
                    Could not load timetable
                </h3>

                <p>
                    NAVENTRA could not access the
                    faculty schedule data.
                </p>

            </div>
        `;

    }

}


// ========================================
// START SMART FACULTY SCHEDULE
// ========================================

if (
    document.getElementById(
        "teacher-schedule"
    )
) {

    loadSmartFacultySchedule();

}