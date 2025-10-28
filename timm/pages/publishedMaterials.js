// publishedMaterial.js — aligned to sp_getPublishedMaterialsForUser + simple sp_requestBorrowing
$(function () {
  const $tbody = $("#publishedMaterialsBody");
  let publishedMaterialsData = [];
  let isSubmitting = false; // guard double submit in modal

  loadPublishedMaterials();
  initializeFilters();
  initializeBorrowingModal();

  function loadPublishedMaterials() {
    $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-sm text-gray-500">Loading published materials...</td></tr>`);

    $.ajax({
      url: "pages/get_published_materials.php",
      type: "GET",
      dataType: "json",
      success: function (res) {
        console.log("Raw data from server:", res);

        const ok = Array.isArray(res) || (res && res.success);
        if (!ok) {
          $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-red-500">Failed to load materials.</td></tr>`);
          return;
        }

        const data = Array.isArray(res) ? res : (res.data || []);
        if (!data.length) {
          $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-gray-500">No published materials found in the library.</td></tr>`);
          return;
        }

        publishedMaterialsData = data;
        renderPublishedMaterials(data);
      },
      error: function (xhr, status, error) {
        console.error("Error loading published materials:", error, xhr.responseText);
        $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-red-500">Error loading materials. Please check console for details.</td></tr>`);
      }
    });
  }

  function renderPublishedMaterials(data) {
    console.log("Rendering data:", data);

    if (!data || data.length === 0) {
      $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-gray-500">No published materials available.</td></tr>`);
      return;
    }

    let rows = "";
    data.forEach((row) => {
      const title = row.title || row.materialName || "(Untitled)";
      const materialType = row.material_type || row.materialType_id || "";
      const description = row.materialDescription || "";
      const author = row.author || `${row.author_lastname || ""}, ${row.author_firstname || ""}`.trim() || "Unknown Author";
      const submittedBy = row.submitted_by || row.studentName || "(Unknown)";
      const college = row.college || row.deanCollege || "Unknown College";
      const submissionDate = formatDate(row.submissionDate) || "";
      const materialStatus = (row.materialStatus || "AVAILABLE").toUpperCase();
      const callNumber = row.callNumber || "";
      const userBorrowStatus = (row.userBorrowStatus || "").toUpperCase(); // 👈 per-user state from SP

      const statusBadge = getStatusBadge(materialStatus);

      // 🔒 Button logic per-user
      const activeUserStates = ["REQUESTED", "APPROVED", "BORROWED"];
      let requestButton = "";
      if (materialStatus === "AVAILABLE") {
        if (activeUserStates.includes(userBorrowStatus)) {
          requestButton = `
            <button class="px-4 py-2 bg-gray-400 text-white text-sm rounded-md cursor-not-allowed" disabled>
              Requested
            </button>`;
        } else {
          requestButton = `
            <button class="request-btn px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none transition-colors"
              data-id="${row.materialPublishing_id}"
              data-callnumber="${escapeHtml(callNumber)}"
              data-title="${escapeHtml(title)}"
              data-author="${escapeHtml(author)}"
              data-type="${escapeHtml(materialType)}">
              Request Material
            </button>`;
        }
      } else {
        requestButton = `
          <button class="px-4 py-2 bg-gray-400 text-white text-sm rounded-md cursor-not-allowed" disabled>
            Unavailable
          </button>`;
      }

      rows += `
        <tr class="border-b hover:bg-gray-50"
            data-title="${escapeHtml((title || "").toLowerCase())}"
            data-type="${escapeHtml((materialType || "").toLowerCase())}"
            data-author="${escapeHtml((author || "").toLowerCase())}"
            data-submitted="${escapeHtml((submittedBy || "").toLowerCase())}"
            data-college="${escapeHtml((college || "").toLowerCase())}"
            data-status="${escapeHtml((materialStatus || "").toLowerCase())}">
          <td class="px-4 py-3 text-sm font-medium">${escapeHtml(title)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(materialType)}</td>
          <td class="px-4 py-3 text-sm max-w-xs truncate" title="${escapeHtml(description)}">${escapeHtml(description)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(author)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(submittedBy)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(college)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(submissionDate)}</td>
          <td class="px-4 py-3 text-sm">${statusBadge}</td>
          <td class="px-4 py-3 text-center">${requestButton}</td>
        </tr>`;
    });

    $tbody.html(rows);
    initializeActions();
  }

  function initializeFilters() {
    $('#searchPublished, #typeFilter, #collegeFilter, #statusFilter').off('input change').on('input change', function () {
      filterMaterials();
    });
  }

  function filterMaterials() {
    const searchTerm = ($('#searchPublished').val() || "").toLowerCase();
    const typeFilter = ($('#typeFilter').val() || "").toLowerCase();
    const collegeFilter = ($('#collegeFilter').val() || "").toLowerCase();
    const statusFilter = ($('#statusFilter').val() || "").toLowerCase();

    if (!publishedMaterialsData.length) return;

    const filteredData = publishedMaterialsData.filter(row => {
      const title = (row.title || row.materialName || '').toLowerCase();
      const description = (row.materialDescription || '').toLowerCase();
      const author = (row.author || `${row.author_lastname || ''} ${row.author_firstname || ''}`).toLowerCase();
      const submittedBy = (row.submitted_by || row.studentName || '').toLowerCase();
      const type = (row.material_type || row.materialType_id || '').toLowerCase();
      const college = (row.college || row.deanCollege || '').toLowerCase();
      const status = (row.materialStatus || '').toLowerCase();

      const matchesSearch = !searchTerm ||
                            title.includes(searchTerm) ||
                            description.includes(searchTerm) ||
                            author.includes(searchTerm) ||
                            submittedBy.includes(searchTerm);
      const matchesType = !typeFilter || type.includes(typeFilter);
      const matchesCollege = !collegeFilter || college.includes(collegeFilter);
      const matchesStatus = !statusFilter || status.includes(statusFilter);

      return matchesSearch && matchesType && matchesCollege && matchesStatus;
    });

    renderPublishedMaterials(filteredData);
  }

  function initializeActions() {
    $(document).off('click.request', '.request-btn').on('click.request', '.request-btn', function (e) {
      e.preventDefault();
      const $btn = $(this);
      const publishingId = $btn.data('id');
      const callNumber = $btn.data('callnumber');
      const title = $btn.data('title');
      const author = $btn.data('author');
      const type = $btn.data('type');

      openBorrowingModal({ publishingId, callNumber, title, author, type });
    });
  }

  // ===== Borrowing Modal =====
  function initializeBorrowingModal() {
    $(document).off('click.closeBorrowing', '.close-modal').on('click.closeBorrowing', '.close-modal', function () {
      $('#borrowingModal').addClass('hidden');
      resetBorrowingForm();
    });

    $(document).off('click.closeSuccess', '.close-success-modal').on('click.closeSuccess', '.close-success-modal', function () {
      $('#successModal').addClass('hidden');
    });

    $('#submitBorrowRequest').off('click.submitBorrow').on('click.submitBorrow', function () {
      submitBorrowRequest();
    });

    $('#borrowingModal').off('click.modalOutside').on('click.modalOutside', function (e) {
      if (e.target === this) {
        $(this).addClass('hidden');
        resetBorrowingForm();
      }
    });
  }

  function openBorrowingModal(materialData) {
    $('#modalMaterialTitle').text(materialData.title);
    $('#modalMaterialAuthor').text(materialData.author);
    $('#modalMaterialType').text(materialData.type);
    $('#modalCallNumber').text(materialData.callNumber);

    $('#modalPublishingId').val(materialData.publishingId);
    $('#modalCallNumberInput').val(materialData.callNumber);

    $('#borrowingModal').removeClass('hidden');
    $('#borrowRemarks').focus();
  }

  function submitBorrowRequest() {
    if (isSubmitting) return;
    const formData = {
      publishing_id: $('#modalPublishingId').val(),
      call_number: $('#modalCallNumberInput').val(),
      borrow_remarks: $('#borrowRemarks').val(),
      expected_return: $('#expectedReturn').val(),
      agree_terms: $('#agreeTerms').is(':checked') ? 1 : 0
    };

    // Basic validation
    if (!formData.borrow_remarks.trim()) {
      alert('Please provide the purpose of borrowing.');
      $('#borrowRemarks').focus();
      return;
    }
    if (!formData.expected_return) {
      alert('Please select an expected return date.');
      $('#expectedReturn').focus();
      return;
    }
    if (!formData.agree_terms) {
      alert('Please agree to the borrowing terms.');
      return;
    }

    const $submitBtn = $('#submitBorrowRequest');
    const originalText = $submitBtn.text();
    isSubmitting = true;
    $submitBtn.prop('disabled', true).text('Submitting...');

    $.ajax({
      url: 'pages/request_borrowing.php',
      type: 'POST',
      data: formData,
      success: function (response) {
        try {
          const result = typeof response === 'string' ? JSON.parse(response) : response;

          // Our simple SP returns rowcount; backend should set success=true when rowcount==1
          if (result && result.success) {
            $('#borrowingModal').addClass('hidden');
            $('#successModal').removeClass('hidden');
            resetBorrowingForm();

            // Refresh list so this user sees “Requested”
            setTimeout(() => loadPublishedMaterials(), 600);
          } else {
            alert('Request failed. You may have already requested this item.');
            $submitBtn.prop('disabled', false).text(originalText);
            isSubmitting = false;
          }
        } catch (e) {
          console.error('Error parsing response:', e, response);
          alert('Error processing server response');
          $submitBtn.prop('disabled', false).text(originalText);
          isSubmitting = false;
        }
      },
      error: function (xhr, status, error) {
        console.error('Error submitting borrowing request:', error, xhr.responseText);
        alert('Error submitting request. Please try again.');
        $submitBtn.prop('disabled', false).text(originalText);
        isSubmitting = false;
      }
    });
  }

  function resetBorrowingForm() {
    isSubmitting = false;
    $('#borrowingForm')[0]?.reset();
    $('#submitBorrowRequest').prop('disabled', false).text('Submit Request');
  }

  // ===== Helpers =====
  function getStatusBadge(status) {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'AVAILABLE':
        return '<span class="inline-block px-2 py-1 text-xs font-medium border border-green-500 bg-green-100 text-green-700 rounded-full">Available</span>';
      case 'BORROWED':
        return '<span class="inline-block px-2 py-1 text-xs font-medium border border-blue-500 bg-blue-100 text-blue-700 rounded-full">Borrowed</span>';
      case 'MAINTENANCE':
        return '<span class="inline-block px-2 py-1 text-xs font-medium border border-yellow-500 bg-yellow-100 text-yellow-700 rounded-full">Maintenance</span>';
      case 'REQUESTED':
        return '<span class="inline-block px-2 py-1 text-xs font-medium border border-purple-500 bg-purple-100 text-purple-700 rounded-full">Requested</span>';
      default:
        return `<span class="inline-block px-2 py-1 text-xs font-medium border border-gray-500 bg-gray-100 text-gray-700 rounded-full">${escapeHtml(status)}</span>`;
    }
  }

  function formatDate(dateString) {
    if (!dateString || dateString === '0000-00-00 00:00:00') return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  }

  function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
