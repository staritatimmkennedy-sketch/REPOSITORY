$(function () {
    const $tbody = $("#borrowingRequestsBody");
    const $detailsModal = $("#detailsModal");
    const $viewModal = $("#viewModal");
    const $returnModal = $("#returnModal");
    const $pdfContainer = $("#pdfContainer");
    const $pdfLoading = $("#pdfLoading");
    const $watermarkUser = $("#watermarkUser");
    
    let borrowingData = [];
    let allBorrowingData = [];
    let pdfDoc = null;
    let currentScale = 1.6;
    let currentPage = 1;
    let totalPages = 1;
    let currentFullName = '';
    let currentUserId = '';

    // Security measures
    $(document).on('contextmenu dragstart selectstart', '#pdfContainer, canvas, #pdfBlocker', e => e.preventDefault());
    $(document).on('keydown', e => {
        if (e.ctrlKey && ['s','p','a','c','u'].includes(e.key.toLowerCase())) e.preventDefault();
        if (e.key==='F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key))) e.preventDefault();
    });

    // Initialize
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
                allBorrowingData = [...borrowingData];
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
            console.log('Row data:', r);
            const materialBorrowingId = r.materialBorrowing_id || r.material_borrowing_id || r.materialBorrowingId || '';
            const callNumber = r.callNumber || '';
            
            // Check if status is "Approved" to show Manage button, otherwise show Details
            const isApproved = (r.borrowStatus || '').toLowerCase() === 'approved';
            
            const actionCell = isApproved ? 
                `<button class="manage-btn px-3 py-1 bg-gray-200 rounded border text-xs hover:bg-gray-300" 
                         data-callnumber="${esc(callNumber)}" 
                         data-id="${esc(materialBorrowingId)}">
                    Manage
                </button>` :
                `<button class="view-details px-3 py-1 rounded-md border hover:bg-gray-100 text-xs" 
                         data-row='${encodeURIComponent(JSON.stringify(r))}'>
                    Details
                </button>`;

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
        $('#tableSearch').on('input', filterTable);
        $('#clearSearch').on('click', () => {
            $('#tableSearch').val('');
            filterTable();
        });
    }

    function filterTable() {
        const query = $('#tableSearch').val().toLowerCase().trim();
        const $clearBtn = $('#clearSearch');

        if (!query) {
            renderBorrowingRequests(allBorrowingData);
            $clearBtn.addClass('hidden');
            return;
        }

        const filtered = allBorrowingData.filter(r => {
            return (
                (r.title || '').toLowerCase().includes(query) ||
                (r.author || '').toLowerCase().includes(query) ||
                (r.callNumber || '').toLowerCase().includes(query) ||
                (r.borrowStatus || '').toLowerCase().includes(query)
            );
        });

        renderBorrowingRequests(filtered);
        $clearBtn.removeClass('hidden');
    }

    // PDF Functions
    function loadPDF(url, fullName, userId) {
        console.log('Loading PDF for', fullName);
        $pdfLoading.removeClass('hidden');
        $pdfContainer.empty();
        $watermarkUser.text(`${fullName} • ID: ${userId}`);
        currentFullName = fullName;
        currentUserId = userId;
        
        pdfjsLib.getDocument(url).promise.then(pdf => {
            pdfDoc = pdf;
            totalPages = pdf.numPages;
            updatePageInfo();

            for (let i = 1; i <= totalPages; i++) {
                pdf.getPage(i).then(page => {
                    const canvas = document.createElement('canvas');
                    canvas.className = 'border border-gray-300 shadow-md w-full mb-6';
                    canvas.dataset.page = page.pageNumber;
                    $pdfContainer.append(canvas);
                    renderPageWithWatermark(page, canvas, currentScale, fullName, userId);

                    if (i === totalPages) $pdfLoading.addClass('hidden');
                });
            }
        }).catch(err => {
            console.error(err);
            $pdfLoading.html('<p class="text-red-600">Failed to load PDF.</p>');
        });
    }

    function renderPageWithWatermark(page, canvas, scale, fullName, userId) {
    const viewport = page.getViewport({ scale });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    const renderContext = { canvasContext: ctx, viewport };

    page.render(renderContext).promise.then(() => {
        const fontSize = Math.max(36, viewport.width * 0.04);
        const watermarkFont = Math.max(22, viewport.width * 0.03);

       

        // Load and draw centered logo
        const logo = new Image();
        logo.src = '/ethanTwo/nddu_logo_gray.png';

        logo.onload = function () {
            const logoWidth = canvas.width * 0.40;  // 25% of page width
            const logoHeight = logoWidth;           // keep it square

            // Center position
            const logoX = (canvas.width - logoWidth) / 2;
            const logoY = (canvas.height - logoHeight) / 2;

            ctx.save();
            ctx.globalAlpha = 0.25; // make logo semi-transparent
            ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
            ctx.restore();

            // Draw full name + ID under logo
            ctx.font = `${watermarkFont}px Arial`;
            ctx.fillStyle = 'rgba(100,100,100,0.4)';
            ctx.textAlign = 'center';
            ctx.fillText(fullName, canvas.width / 2, logoY + logoHeight + 50);
            ctx.fillText(`ID: ${userId}`, canvas.width / 2, logoY + logoHeight + 90);
        };

        logo.onerror = function () {
            console.warn('Logo failed to load at', logo.src);
        };
    });
}




    function updatePageInfo() {
        $('#pageInfo').text(`${currentPage} / ${totalPages}`);
        $('#pagePrev').prop('disabled', currentPage === 1);
        $('#pageNext').prop('disabled', currentPage === totalPages);
    }

    function scrollToPage(num) {
        const $c = $(`#pdfContainer canvas[data-page="${num}"]`);
        if ($c.length) {
            $c[0].scrollIntoView({behavior:'smooth',block:'center'});
            currentPage = num; 
            updatePageInfo();
        }
    }

    // Dropdown Management
    function openDropdown($btn, callNumber, borrowingId) {
        closeAllDropdowns();
        
        const $menu = $(`
            <div class="bg-white border rounded-md shadow-lg py-1 min-w-32 z-50">
                <a href="#" class="view-material block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">View</a>
                <a href="#" class="return-material block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Return</a>
            </div>
        `);
        
        $('#dropdownPortal').append($menu);
        
        const rect = $btn[0].getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 5;
        const left = rect.left + window.scrollX;
        
        $menu.css({
            position: 'absolute',
            top: top + 'px',
            left: left + 'px'
        });
        
        // View Material
        $menu.find('.view-material').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            loadPDFfromCallNumber(callNumber);
            closeAllDropdowns();
        });
        
        // Return Material
        $menu.find('.return-material').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showReturnModal(borrowingId);
            closeAllDropdowns();
        });
    }

    function closeAllDropdowns() {
        $('#dropdownPortal').empty();
    }

    function initializeActions() {
        // Manage button click - open dropdown
        $(document).off('click', '.manage-btn').on('click', '.manage-btn', function(e) {
            e.stopPropagation();
            const $btn = $(this);
            const callNumber = $btn.data('callnumber');
            const borrowingId = $btn.data('id');
            openDropdown($btn, callNumber, borrowingId);
        });

        // Close dropdowns when clicking outside
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.manage-btn, #dropdownPortal > div').length) {
                closeAllDropdowns();
            }
        });

        // View Details for non-approved requests
        $(document).off('click', '.view-details').on('click', '.view-details', function(e) {
            e.preventDefault();
            const row = JSON.parse(decodeURIComponent($(this).data('row')));
            showDetailsModal(row);
        });

        // Modal close handlers
        $(document).off('click', '.close-details-modal').on('click', '.close-details-modal', function() {
            $detailsModal.addClass("hidden");
        });

        $(document).off('click', '.close-view-modal').on('click', '.close-view-modal', function() {
            $viewModal.addClass('hidden');
            $pdfContainer.empty();
        });

        $(document).off('click', '.close-return-modal').on('click', '.close-return-modal', function() {
            $returnModal.addClass('hidden');
            $('#returnModalMessage').text('Are you sure you want to return this material?');
            $('#confirmReturnBtn').data('id', '');
        });

        // Confirm Return button
        $(document).off('click', '#confirmReturnBtn').on('click', '#confirmReturnBtn', function() {
            const borrowingId = $(this).data('id');
            if (borrowingId) {
                returnMaterial(borrowingId);
            }
        });

        // Close modals when clicking outside
        $(document).on('click', function(e) {
            if ($(e.target).is('#detailsModal')) {
                $detailsModal.addClass('hidden');
            }
            if ($(e.target).is('#viewModal')) {
                $viewModal.addClass('hidden');
                $pdfContainer.empty();
            }
            if ($(e.target).is('#returnModal')) {
                $returnModal.addClass('hidden');
                $('#returnModalMessage').text('Are you sure you want to return this material?');
                $('#confirmReturnBtn').data('id', '');
            }
        });
    }

    function showDetailsModal(row) {
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
        closeAllDropdowns();
    }

    function showReturnModal(borrowingId) {
        if (!borrowingId) {
            alert('Invalid borrowing ID');
            return;
        }
        
        $('#returnModalMessage').text('Are you sure you want to return this material?');
        $('#confirmReturnBtn').data('id', borrowingId);
        $returnModal.removeClass('hidden');
        closeAllDropdowns();
    }

    function loadPDFfromCallNumber(callNumber) {
        $.ajax({
            url: 'pages/get_borrowed_material_content.php',
            data: { call_number: callNumber },
            dataType: 'json',
            success: function(res) {
                if (res.error) {
                    alert(res.error);
                    return;
                }
                
                // Log viewing activity
                $.post('pages/log_view.php', {call_number: callNumber, file: res.file});
                $.post('pages/send_view_alert.php', {call_number: callNumber, file: res.file});
                
                // Get user info for watermark
                $.get('pages/get_user_info.php', function(user) {
                    const url = 'pages/view_pdf.php?file=' + encodeURIComponent(res.file) + '&t=' + Date.now();
                    loadPDF(url, user.fullName, user.userId);
                    $viewModal.removeClass('hidden');
                    closeAllDropdowns();
                }, 'json');
            },
            error: function() {
                alert('Failed to load PDF content.');
            }
        });
    }

    function returnMaterial(borrowingId) {
        if (!borrowingId) {
            alert('Invalid borrowing ID');
            return;
        }

        $.ajax({
            url: 'pages/return_material.php',
            type: 'POST',
            data: { material_borrowing_id: borrowingId },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#returnModalMessage').text('Material returned successfully!');
                    $('#confirmReturnBtn').addClass('hidden');
                    
                    // Reload the table after 2 seconds
                    setTimeout(() => {
                        $returnModal.addClass('hidden');
                        loadBorrowingRequests();
                        // Reset the modal for next use
                        setTimeout(() => {
                            $('#returnModalMessage').text('Are you sure you want to return this material?');
                            $('#confirmReturnBtn').removeClass('hidden').data('id', '');
                        }, 300);
                    }, 2000);
                } else {
                    $('#returnModalMessage').text('Error: ' + (response.error || 'Failed to return material.'));
                    $('#confirmReturnBtn').addClass('hidden');
                }
            },
            error: function(xhr, status, error) {
                $('#returnModalMessage').text('Error returning material. Please try again.');
                $('#confirmReturnBtn').addClass('hidden');
                console.error('Return error:', error);
            }
        });
    }

    // Utility Functions
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
        return isNaN(d) ? esc(dt) : d.toLocaleDateString();
    }

    function badge(s) {
        const status = (s || "").trim();
        const statusMap = {
            "requested": "border-yellow-400 bg-yellow-100 text-yellow-700",
            "approved": "border-blue-500 bg-blue-100 text-blue-700", 
            "borrowed": "border-purple-500 bg-purple-100 text-purple-700",
            "returned": "border-green-500 bg-green-100 text-green-700",
            "denied": "border-red-500 bg-red-100 text-red-700"
        };
        
        const cls = statusMap[status.toLowerCase()] || "border-gray-300 bg-gray-100 text-gray-700";
        return `<span class="inline-block px-2 py-1 text-xs font-medium border rounded-full ${cls}">${status || "—"}</span>`;
    }
});