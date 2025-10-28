$(function () {
    const $tbody = $("#borrowingRequestsBody");
    const $detailsModal = $("#detailsModal");
    const $viewModal = $("#viewModal");
    const $returnModal = $("#returnModal");
    let borrowingData = [];

    // Debug modal existence
    console.log('View Modal exists:', $viewModal.length > 0);
    console.log('View Material Content exists:', $('#viewMaterialContent').length > 0);
    console.log('Return Modal exists:', $returnModal.length > 0);

    loadBorrowingRequests();
    initializeFilters();

    function loadBorrowingRequests() {
        $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-sm text-gray-500">Loading your requests...</td></tr>`);

        $.ajax({
            url: "pages/get_userBorrowedMaterials.php",
            type: "GET",
            dataType: "json",
            success: function (res) {
                console.log("Borrowed materials response:", res);
                if (!res || !res.success) {
                    console.error("Response error:", res?.error || "No success property");
                    $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-red-600">${res?.error || 'Failed to load.'}</td></tr>`);
                    return;
                }

                borrowingData = res.data || [];
                renderBorrowingRequests(borrowingData);
            },
            error: function (xhr, status, error) {
                console.error("Load error:", {
                    status: xhr.status,
                    statusText: xhr.statusText,
                    error: error,
                    responseText: xhr.responseText
                });
                $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-red-600">Error loading data: ${xhr.responseText || 'Please try again.'}</td></tr>`);
            }
        });
    }

    function renderBorrowingRequests(data) {
        if (!data || data.length === 0) {
            $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-gray-500">No records found.</td></tr>`);
            return;
        }

        let html = data.map(r => {
            console.log('Row data:', r); // Debug row data
            const materialBorrowingId = r.materialBorrowing_id || r.material_borrowing_id || r.materialBorrowingId || '';
            const actionCell = r.borrowStatus === 'APPROVED' ?
                `
                <div class="relative inline-block text-left">
                    <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
                        Manage ▾
                    </button>
                    <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 view-material" data-callnumber="${esc(r.callNumber)}">View</a>
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 return-material" data-id="${esc(materialBorrowingId)}">Return</a>
                    </div>
                </div>
                ` :
                `<button class="view-details px-3 py-1 rounded-md border hover:bg-gray-100" data-row='${encodeURIComponent(JSON.stringify(r))}'>Details</button>`;

            return `
                <tr class="border-b hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm">${fmt(r.borrowedDate)}</td>
                    <td class="px-4 py-3 text-sm">${esc(r.title)}</td>
                    <td class="px-4 py-3 text-sm">${esc(r.material_type)}</td>
                    <td class="px-4 py-3 text-sm">${esc(r.author)}</td>
                    <td class="px-4 py-3 text-sm">${esc(r.callNumber)}</td>
                    <td class="px-4 py-3 text-sm">${fmt(r.dueDate)}</td>
                    <td class="px-4 py-3 text-sm">${badge(r.borrowStatus)}</td>
                    <td class="px-4 py-3 text-sm text-center">
                        ${actionCell}
                    </td>
                </tr>
            `;
        }).join("");

        $tbody.html(html);
        initializeActions();
    }

    function initializeFilters() {
        $('#searchBorrowing, #statusFilter').on('input change', function () {
            filterBorrowingRequests();
        });
    }

    function filterBorrowingRequests() {
        const searchTerm = $('#searchBorrowing').val().toLowerCase();
        const statusFilter = $('#statusFilter').val().toUpperCase();

        const filteredData = borrowingData.filter(r => {
            const matchesSearch = !searchTerm ||
                (r.title && r.title.toLowerCase().includes(searchTerm)) ||
                (r.author && r.author.toLowerCase().includes(searchTerm));
            const matchesStatus = !statusFilter || r.borrowStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });

        renderBorrowingRequests(filteredData);
    }

    function initializeActions() {
        // Dropdown toggle
        $(document).off('click', '.manage-btn').on('click', '.manage-btn', function (e) {
            e.stopPropagation();
            const dropdown = $(this).siblings('.dropdown-menu');
            $('.dropdown-menu').not(dropdown).addClass('hidden');
            dropdown.toggleClass('hidden');
        });

        // Close dropdowns when clicking outside
        $(document).on('click', function (e) {
            if (!$(e.target).closest('.relative').length) {
                $('.dropdown-menu').addClass('hidden');
            }
        });

        // View Details
        $(document).off('click', '.view-details').on('click', '.view-details', function (e) {
            e.preventDefault();
            const row = JSON.parse(decodeURIComponent($(this).data('row')));
            $("#detailMaterialTitle").text(row.title || "—");
            $("#detailCallNumber").text(row.callNumber || "—");
            $("#detailMaterialType").text(row.material_type || "—");
            $("#detailAuthor").text(row.author || "—");
            $("#detailMaterialStatus").text(row.materialStatus || "—");
            $("#detailBorrowStatus").text(row.borrowStatus || "—");
            $("#detailBorrowedDate").text(fmt(row.borrowedDate));
            $("#detailApprovalDate").text(fmt(row.approvalDate));
            $("#detailDueDate").text(fmt(row.dueDate));
            $("#detailStudentRemarks").text(row.studentRemarks || "—");
            $("#detailLibrarianRemarks").text(row.librarianRemarks || "—");
            $detailsModal.removeClass("hidden");
            $('.dropdown-menu').addClass('hidden');
        });

       $(document).off('click', '.view-material').on('click', '.view-material', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const callNumber = $(this).data('callnumber');

        // SHOW LOADING
        $('#pdfLoading').removeClass('hidden');
        $('#pdfViewer').attr('src', ''); // Clear old

        $.ajax({
            url: 'pages/get_borrowed_material_content.php',
            type: 'GET',
            data: { call_number: callNumber },
            dataType: 'json',
            success: function (res) {
                if (res.error) {
                    $('#pdfLoading').addClass('hidden');
                    alert('Error: ' + res.error);
                    return;
                }

                const pdfUrl = 'pages/view_pdf.php?file=' + encodeURIComponent(res.file) + '&t=' + Date.now();
                $('#pdfViewer').attr('src', pdfUrl);
                $viewModal.removeClass('hidden');
                $('.dropdown-menu').addClass('hidden');
            },
            error: function () {
                $('#pdfLoading').addClass('hidden');
                alert('Failed to load PDF.');
            }
        });
    });

        // Return Material
        $(document).off('click', '.return-material').on('click', '.return-material', function (e) {
            e.preventDefault();
            const materialBorrowingId = $(this).data('id');
            console.log('Returning material with ID:', materialBorrowingId);
            if (!materialBorrowingId || isNaN(parseInt(materialBorrowingId))) {
                console.error('Invalid materialBorrowingId:', materialBorrowingId);
                $('#returnModalMessage').text('Error: Invalid borrowing ID.');
                $('#confirmReturnBtn').addClass('hidden');
                $returnModal.removeClass('hidden');
                return;
            }
            $('#returnModalMessage').text('Are you sure you want to return this material?');
            $('#confirmReturnBtn').removeClass('hidden').data('id', materialBorrowingId);
            $returnModal.removeClass('hidden');
            $('.dropdown-menu').addClass('hidden');
        });

        // Confirm Return
        $(document).off('click', '#confirmReturnBtn').on('click', '#confirmReturnBtn', function () {
            const materialBorrowingId = $(this).data('id');
            console.log('Confirming return for ID:', materialBorrowingId);
            $.ajax({
                url: 'pages/return_material.php',
                type: 'POST',
                data: { material_borrowing_id: materialBorrowingId },
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        $('#returnModalMessage').text('Material returned successfully!');
                        $('#confirmReturnBtn').addClass('hidden');
                        loadBorrowingRequests();
                    } else {
                        console.error('Return error:', response.error);
                        $('#returnModalMessage').text('Error: ' + (response.error || 'Failed to return material.'));
                        $('#confirmReturnBtn').addClass('hidden');
                    }
                },
                error: function (xhr, status, error) {
                    console.error('Return AJAX error:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        error: error,
                        responseText: xhr.responseText
                    });
                    $('#returnModalMessage').text('Error returning material: ' + (xhr.responseText || 'Please try again.'));
                    $('#confirmReturnBtn').addClass('hidden');
                }
            });
        });

        // Close Details Modal
        $(document).off('click', '.close-details-modal').on('click', '.close-details-modal', function () {
            $detailsModal.addClass("hidden");
        });

        // Close View Modal
        $(document).off('click', '.close-view-modal').on('click', '.close-view-modal', function () {
            console.log('Closing viewModal');
            $viewModal.addClass('hidden');
            $('#viewMaterialContent').text('');
        });

        // Close Return Modal
        $(document).off('click', '.close-return-modal').on('click', '.close-return-modal', function () {
            console.log('Closing returnModal');
            $returnModal.addClass('hidden');
            $('#returnModalMessage').text('Are you sure you want to return this material?');
            $('#confirmReturnBtn').removeClass('hidden').data('id', '');
        });

        // Close Modals when clicking outside
        $(document).on('click', function (e) {
            if ($(e.target).is('#detailsModal')) {
                $detailsModal.addClass('hidden');
            }
            if ($(e.target).is('#viewModal')) {
                console.log('Clicked outside viewModal, closing');
                $viewModal.addClass('hidden');
                $('#viewMaterialContent').text('');
            }
            if ($(e.target).is('#returnModal')) {
                console.log('Clicked outside returnModal, closing');
                $returnModal.addClass('hidden');
                $('#returnModalMessage').text('Are you sure you want to return this material?');
                $('#confirmReturnBtn').removeClass('hidden').data('id', '');
            }
        });
        // PDF LOADING HANDLER
        $('#pdfViewer').off('load error').on('load', function () {
            console.log('PDF loaded successfully');
            $('#pdfLoading').addClass('hidden');
        }).on('error', function () {
            console.error('PDF failed to load');
            $('#pdfLoading').html('<p class="text-red-600">Failed to load PDF.</p>');
        });
    }

    function esc(s) {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function fmt(dt) {
        if (!dt || dt === "0000-00-00 00:00:00") return "—";
        const d = new Date(dt.replace(" ", "T"));
        return isNaN(d) ? esc(dt) : d.toLocaleString();
    }

    function badge(s) {
        const S = (s || "").toUpperCase();
        const cls = {
            "REQUESTED": "border-yellow-400 bg-yellow-100 text-yellow-700",
            "APPROVED": "border-blue-500 bg-blue-100 text-blue-700",
            "BORROWED": "border-purple-500 bg-purple-100 text-purple-700",
            "RETURNED": "border-green-500 bg-green-100 text-green-700",
            "DENIED": "border-red-500 bg-red-100 text-red-700"
        }[S] || "border-gray-300 bg-gray-100 text-gray-700";
        return `<span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border rounded-full ${cls}">${S || "—"}</span>`;
    }
});