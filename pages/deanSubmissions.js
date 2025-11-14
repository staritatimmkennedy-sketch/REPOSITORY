$(function () {
  const $tbody = $("#deanSubmissionBody");
  let submissionsData = [];
  let currentSubmissionId = null;

  loadDeanSubmissions();
  initializeFilters();
  initializeDropdowns();
  initializeModalHandlers();

  function loadDeanSubmissions() {
    $tbody.html(`<tr><td colspan="11" class="px-4 py-3 text-center text-sm text-gray-500">Loading submissions...</td></tr>`);

    $.ajax({
      url: "pages/get_deanPendingSubmissions.php",
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data.error) {
          showError(data.error);
          return;
        }
        if (!data.length) {
          showMessage("No submissions found.");
          return;
        }
        submissionsData = data;
        renderSubmissions(data);
      },
      error: function (xhr, status, error) {
        console.error("AJAX Error:", status, error);
        console.error("Response:", xhr.responseText);
        showError("Error loading submissions. Please check console for details.");
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  RENDER TABLE                                                      */
  /* ------------------------------------------------------------------ */
  function renderSubmissions(data) {
    if (!data || data.length === 0) {
      showMessage("No submissions found.");
      return;
    }
  
    let rows = "";
    data.forEach(row => {
      const student      = row.studentName || "(Unknown)";
      const title        = row.materialName || "(Untitled)";
      const type         = row.materialType_id || "";
      const author       = getAuthorName(row);
      const date         = formatDate(row.submissionDate) || "";
      const description  = row.materialDescription || "";
      const file         = row.materialFile || "";
      const fileName     = file ? file.split('/').pop() : "";
      const status       = row.deanApprovalStatus || "Pending";
      const libStatus    = row.librarianPublishingStatus || "Not Published";

      const badgeClass      = getStatusClass(status);
      const libBadgeClass   = getLibStatusClass(libStatus);
      const actionButtons   = getActionButtons(row, status);
  
      rows += `
        <tr class="border-b hover:bg-gray-50">
          <td class="px-4 py-3 text-sm">${escapeHtml(student)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(title)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(type)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(author)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(date)}</td>
          <td class="px-4 py-3 text-sm max-w-xs truncate" title="${escapeHtml(description)}">${escapeHtml(description)}</td>
          <td class="px-4 py-3 text-sm">
            ${file ? `<a href="${escapeHtml(file)}" class="text-blue-600 hover:text-blue-800 underline" target="_blank">${escapeHtml(fileName)}</a>` : 'No file'}
          </td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${badgeClass} rounded-full">
              ${escapeHtml(status)}
            </span>
          </td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${libBadgeClass} rounded-full">
              ${escapeHtml(libStatus)}
            </span>
          </td>
          <td class="px-4 py-3 text-center">${actionButtons}</td>
        </tr>`;
    });
  
    $tbody.html(rows);
    initializeActions();
  }

  function getAuthorName(row) {
    if (row.author) return row.author;

    const ln = row.author_lastname || '';
    const fn = row.author_firstname || '';
    const mi = row.author_mi || '';

    if (ln && fn) return mi ? `${ln}, ${fn} ${mi}.` : `${ln}, ${fn}`;
    return "Unknown Author";
  }

  function getActionButtons(row, status) {
    if (status !== 'Pending') {
        return `
        <div class="relative inline-block text-left">
            <button disabled class="manage-btn w-24 px-3 py-1 bg-gray-100 border border-gray-300 text-gray-400 text-sm rounded-md cursor-not-allowed">
                Manage ▾
            </button>
        </div>`;
    }

    return `
    <div class="relative inline-block text-left">
        <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
            Manage ▾
        </button>
        <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200 review-submission" data-id="${row.materialSubmission_id}">Review</a>
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200 approve-submission-modal" data-id="${row.materialSubmission_id}">Approve</a>
            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 reject-submission-modal" data-id="${row.materialSubmission_id}">Reject</a>
        </div>
    </div>`;
  }

  /* ------------------------------------------------------------------ */
  /*  FILTERS                                                           */
  /* ------------------------------------------------------------------ */
  function initializeFilters() {
    $('#searchSubmissions, #typeFilter, #statusFilter').on('input change', filterSubmissions);
  }

  function filterSubmissions() {
    const search = $('#searchSubmissions').val().toLowerCase();
    const type   = $('#typeFilter').val().toLowerCase();
    const status = $('#statusFilter').val().toLowerCase();
  
    const filtered = submissionsData.filter(row => {
      const s = (row.studentName || '').toLowerCase();
      const t = (row.materialName || '').toLowerCase();
      const d = (row.materialDescription || '').toLowerCase();
      const ty = (row.materialType_id || '').toLowerCase();
      const st = (row.deanApprovalStatus || '').toLowerCase();  
  
      const matchSearch = !search || s.includes(search) || t.includes(search) || d.includes(search);
      const matchType   = !type   || ty.includes(type);
      const matchStatus = !status || st.includes(status);
      return matchSearch && matchType && matchStatus;
    });
  
    renderSubmissions(filtered);
  }

  /* ------------------------------------------------------------------ */
  /*  DROPDOWNS                                                         */
  /* ------------------------------------------------------------------ */
  function initializeDropdowns() {
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.relative').length) {
        $('.dropdown-menu').addClass('hidden');
      }
    });

    $(document).off('click', '.manage-btn').on('click', '.manage-btn', function (e) {
      e.stopPropagation();
      const $menu = $(this).siblings('.dropdown-menu');
      $('.dropdown-menu').not($menu).addClass('hidden');
      $menu.toggleClass('hidden');
    });
  }

  /* ------------------------------------------------------------------ */
  /*  MODAL HANDLERS                                                    */
  /* ------------------------------------------------------------------ */
  function initializeModalHandlers() {
    // Close modal handlers
    $('.close-approve-modal').on('click', function () {
      $('#approveModal').addClass('hidden');
    });

    $('.close-reject-modal').on('click', function () {
      $('#rejectModal').addClass('hidden');
    });

    $('.close-success-modal').on('click', function () {
      $('#actionSuccessModal').addClass('hidden');
    });

    // Confirm action handlers
    $('#confirmApprove').on('click', function () {
      if (currentSubmissionId) {
        const remarks = $('#approveRemarks').val();
        updateSubmissionStatus(currentSubmissionId, 'Approved', remarks);
      }
    });

    $('#confirmReject').on('click', function () {
      if (currentSubmissionId) {
        updateSubmissionStatus(currentSubmissionId, 'Rejected', '');
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  ACTIONS (Approve / Reject / Review)                               */
  /* ------------------------------------------------------------------ */
  function initializeActions() {
    // Approve Modal
    $(document).off('click', '.approve-submission-modal').on('click', '.approve-submission-modal', function (e) {
      e.preventDefault();
      const id = $(this).data('id');
      currentSubmissionId = id;
      $('.dropdown-menu').addClass('hidden');
      $('#approveModal').removeClass('hidden');
    });

    // Reject Modal
    $(document).off('click', '.reject-submission-modal').on('click', '.reject-submission-modal', function (e) {
      e.preventDefault();
      const id = $(this).data('id');
      currentSubmissionId = id;
      $('.dropdown-menu').addClass('hidden');
      $('#rejectModal').removeClass('hidden');
    });

    // Review
    $(document).off('click', '.review-submission').on('click', '.review-submission', function (e) {
      e.preventDefault();
      e.stopPropagation();

      const id = $(this).data('id');

      $.ajax({
        url: 'pages/get_material_content.php',
        type: 'GET',
        data: { submission_id: id },
        dataType: 'json',
        success: function (res) {
          if (res.error) {
            alert('Error: ' + res.error);
            return;
          }

          const proxyUrl = 'pages/view_pdf.php?file=' + encodeURIComponent(res.file);

          $('#pdfViewer').attr('src', proxyUrl);
          $('#reviewModal').removeClass('hidden');
          $('.dropdown-menu').addClass('hidden');
        },
        error: function (xhr) {
          const msg = xhr.responseText || 'Network error';
          alert('Failed to load file: ' + msg);
        }
      });
    });

    // Close PDF modal
    $(document).off('click', '#closeModal, #closeModalBtn').on('click', '#closeModal, #closeModalBtn', function () {
      $('#reviewModal').addClass('hidden');
      $('#pdfViewer').attr('src', '');
    });
  }

  function updateSubmissionStatus(submissionId, status, remarks = '') {
    $.ajax({
      url: 'pages/update_dean_decision.php',  
      type: 'POST',
      data: { 
        submission_id: submissionId, 
        status: status,
        remarks: remarks 
      },
      success: function (resp) {
        let result;
        try { 
          result = typeof resp === 'string' ? JSON.parse(resp) : resp; 
        } catch (e) { 
          result = {}; 
        }
  
        if (result.success) {
          // Close the current modal
          $('#approveModal').addClass('hidden');
          $('#rejectModal').addClass('hidden');
          
          // Show success modal
          $('#successModalTitle').text(status === 'Approved' ? 'Submission Approved' : 'Submission Rejected');
          $('#successModalMessage').text(status === 'Approved' 
            ? 'The submission has been approved successfully.' 
            : 'The submission has been rejected.');
          $('#actionSuccessModal').removeClass('hidden');
          
          // Reload submissions
          loadDeanSubmissions();
        } else {
          alert('Error: ' + (result.error || 'unknown'));
        }
      },
      error: function (xhr) {
        alert('AJAX error: ' + (xhr.responseText || 'unknown'));
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  HELPERS                                                           */
  /* ------------------------------------------------------------------ */
  function getStatusClass(status) {
    const colors = {
      Pending: "w-[84px] border-yellow-400 bg-yellow-100 text-yellow-700",
      Approved: "w-[84px] border-green-500 bg-green-100 text-green-700",
      Denied: "w-[84px] border-red-500 bg-red-100 text-red-700",
      Rejected: "w-[84px] border-red-500 bg-red-100 text-red-700"
    };
    return colors[status] || "w-[84px] border-gray-300 bg-gray-100 text-gray-700";
  }

  function getLibStatusClass(status) {
    if (status === 'Published') return 'w-[84px] border-blue-500 bg-blue-100 text-blue-700';
    if (status === 'Not Published') return 'border-orange-500 bg-orange-100 text-orange-700';
    if (status === 'Pending') return 'border-yellow-400 bg-yellow-100 text-yellow-700';
    return 'border-gray-500 bg-gray-100 text-gray-700';
  }

  function formatDate(str) {
    if (!str) return '';
    try {
      return new Date(str).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) { 
      return str; 
    }
  }

  function escapeHtml(txt) {
    if (txt === null || txt === undefined) return '';
    return txt.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function showError(msg) { 
    $tbody.html(`<tr><td colspan="11" class="px-4 py-3 text-center text-sm text-red-600">${msg}</td></tr>`); 
  }
  
  function showMessage(msg) { 
    $tbody.html(`<tr><td colspan="11" class="px-4 py-3 text-center text-sm text-gray-500">${msg}</td></tr>`); 
  }
});