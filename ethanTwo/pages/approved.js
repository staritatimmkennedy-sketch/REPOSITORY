$(function () {
  const $tbody = $("#approvedMaterialsBody");
  const $publishModal = $("#publishModal");
  const $reviewModal = $("#reviewModal");
  const $publishSuccessModal = $("#publishSuccessModal");
  const $publishErrorModal = $("#publishErrorModal");
  let approvedMaterialsData = [];

  // Initialize everything
  loadApprovedMaterials();
  initializeFilters();
  initializePublishingModals();

  function loadApprovedMaterials() {
    $tbody.html(`<tr><td colspan="11" class="px-4 py-3 text-center text-sm text-gray-500">Loading approved materials...</td></tr>`);

    $.ajax({
      url: "pages/get_approvedSubmissions.php",
      type: "GET",
      dataType: "json",
      success: function (data) {
        console.log("API Response:", data);
        
        if (data.error) {
          showTableError(data.error);
          return;
        }

        if (!data || !data.length) {
          showTableMessage("No approved materials ready for publishing.");
          return;
        }

        approvedMaterialsData = data;
        renderApprovedMaterials(data);
      },
      error: function (xhr, status, error) {
        console.error("Error loading approved materials:", {
          status: xhr.status,
          statusText: xhr.statusText,
          error: error,
          responseText: xhr.responseText
        });
        showTableError(`Error loading materials: ${xhr.responseText || 'Please try again.'}`);
      }
    });
  }

  function renderApprovedMaterials(data) {
    $tbody.empty();

    if (!data || data.length === 0) {
      showTableMessage("No approved materials ready for publishing.");
      return;
    }

    let rows = "";
    data.forEach(row => {
      const student = row.studentName || "(Unknown)";
      const title = row.materialName || "(Untitled)";
      const type = row.materialType_id || "";
      const author = `${row.author_lastname || ''}, ${row.author_firstname || ''} ${row.author_mi || ''}`.trim();
      const submissionDate = formatDate(row.submissionDate) || "";
      const dateApproved = formatDate(row.deanApprovalDate) || "";  
      const deanCollege = row.deanCollege || "Unknown College";
      const status = row.deanApprovalStatus || "Approved";  
      const librarianStatus = row.librarianPublishingStatus || "Not Published";
      const librarianBadgeClass = getLibrarianStatusClass(librarianStatus);
      const deanBadgeClass = getDeanStatusClass(status);

      const actionButtons = `
        <div class="relative inline-block text-left">
          <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
            Manage ▾
          </button>
          <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200 review-submission" 
               data-id="${row.materialSubmission_id}" 
               data-status="${librarianStatus}">Review</a>
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 border-b border-gray-200 publish-submission" 
               data-id="${row.materialSubmission_id}" 
               data-status="${librarianStatus}">Publish</a>
          </div>
        </div>
      `;

      rows += `
        <tr class="border-b hover:bg-gray-50"
            data-student="${escapeHtml(student.toLowerCase())}"
            data-title="${escapeHtml(title.toLowerCase())}"
            data-type="${escapeHtml(type.toLowerCase())}"
            data-author="${escapeHtml(author.toLowerCase())}"
            data-college="${escapeHtml(deanCollege.toLowerCase())}"
            data-status="${escapeHtml(status.toLowerCase())}">
          <td class="px-4 py-3 text-sm">${escapeHtml(student)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(title)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(type)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(author)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(submissionDate)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(dateApproved)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(deanCollege)}</td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${deanBadgeClass} rounded-full">
              ${escapeHtml(status)}
            </span>
          </td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${librarianBadgeClass} rounded-full">
              ${escapeHtml(librarianStatus)}
            </span>
          </td>
          <td class="px-4 py-3 text-sm">View in Review</td>
          <td class="px-4 py-3 text-center">
            ${actionButtons}
          </td>
        </tr>`;
    });

    $tbody.html(rows);
    initializeDropdowns();
    initializeActions();
  }

  function initializeDropdowns() {
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.relative').length) {
        $('.dropdown-menu').addClass('hidden');
      }
    });

    $(document).off('click', '.manage-btn').on('click', '.manage-btn', function(e) {
      e.stopPropagation();
      const $dropdown = $(this).siblings('.dropdown-menu');
      $('.dropdown-menu').not($dropdown).addClass('hidden');
      $dropdown.toggleClass('hidden');
    });
  }

  function initializeActions() {
    // Publish submission
    $(document).off('click', '.publish-submission').on('click', '.publish-submission', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const submissionId = $(this).data('id');
      const currentStatus = $(this).data('status');
      
      console.log("Current status:", currentStatus);
      
      if (currentStatus === 'Published') {
        showPublishError('This material is already published and cannot be published again.');
        $('.dropdown-menu').addClass('hidden');
        return;
      }
      
      $("#publishSubmissionId").val(submissionId);
      $("#callNumber").val('');
      $("#publishMsg").empty();
      $publishModal.removeClass('hidden');
      $reviewModal.addClass('hidden');
      $('.dropdown-menu').addClass('hidden');
    });



    // Review submission
    $(document).off('click', '.review-submission').on('click', '.review-submission', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const submissionId = $(this).data('id');

      $.ajax({
        url: 'pages/get_librarian_material_content.php',
        type: 'GET',
        data: { submission_id: submissionId },
        dataType: 'json',
        success: function(res) {
          if (res.error) {
            showPublishError('Error: ' + res.error);
            return;
          }

          const pdfUrl = 'pages/view_pdf.php?file=' + encodeURIComponent(res.file) + '&t=' + Date.now();
          $('#pdfViewer').attr('src', pdfUrl);
          $reviewModal.removeClass('hidden');
          $publishModal.addClass('hidden');
          $('.dropdown-menu').addClass('hidden');
        },
        error: function() {
          showPublishError('Failed to load PDF.');
        }
      });
    });

    // Close modals
    $(document).off('click', '#closeModal, #closeModalBtn, #closePublishModal').on('click', '#closeModal, #closeModalBtn, #closePublishModal', function(e) {
      e.stopPropagation();
      $reviewModal.addClass('hidden');
      $publishModal.addClass('hidden');
      $('#materialContent, #publishMsg').text('');
    });

    // Close modals when clicking outside
    $(document).on('click', function(e) {
      if ($(e.target).is('#publishModal')) {
        $publishModal.addClass('hidden');
        $('#publishMsg').text('');
      }
      if ($(e.target).is('#reviewModal')) {
        $reviewModal.addClass('hidden');
        $('#materialContent').text('');
      }
    });

    // Publish form submission
    $("#publishForm").on('submit', function(e) {
      e.preventDefault();
      publishMaterial();
    });
  }

  function publishMaterial() {
    const submissionId = $("#publishSubmissionId").val();
    const callNumber = $("#callNumber").val().trim();

    console.log("Starting publish:", { submissionId, callNumber });

    if (!callNumber) {
      showPublishError('Please enter a call number for the material.');
      return;
    }

    const submitBtn = $("#publishForm").find('button[type="submit"]');
    const originalText = submitBtn.text();
    
    if (submitBtn.prop('disabled')) {
      console.log("Already submitting, ignoring duplicate click");
      return;
    }
    
    submitBtn.prop('disabled', true).text('Publishing...');
    $("#publishMsg").html('<p class="text-blue-600">Publishing material...</p>');

    $.ajax({
      url: 'pages/publish_material.php',
      type: 'POST',
      data: {
        submission_id: submissionId,
        call_number: callNumber
      },
      dataType: 'json',
      timeout: 10000,
      success: function(response) {
        console.log("AJAX Success:", response);
        
        if (response && response.success) {
          console.log("Publishing SUCCESS");
          showPublishSuccess(response.message || 'Material published successfully!');
          $("#callNumber").val('');
          $("#publishMsg").empty();
        } else {
          console.log("Publishing FAILED:", response.error);
          showPublishError(response.error || 'Publishing failed. Please try again.');
        }
      },
      error: function(xhr, status, error) {
        console.error("AJAX Error:", {
          status: status,
          error: error,
          statusCode: xhr.status,
          responseText: xhr.responseText
        });
        showPublishError('Request failed. Please try again.');
      },
      complete: function() {
        setTimeout(() => {
          submitBtn.prop('disabled', false).text(originalText);
        }, 1000);
      }
    });
  }

  function updateSubmissionStatus(submissionId, status) {
    console.log('Attempting to update submission:', {
      submissionId: submissionId,
      status: status
    });

    $.ajax({
      url: 'pages/update_librarian_decision.php',
      type: 'POST',
      data: {
        submission_id: submissionId,
        status: status
      },
      success: function(response) {
        console.log('Server response:', response);
        try {
          const result = typeof response === 'string' ? JSON.parse(response) : response;
          if (result.success) {
            const action = status === 'Rejected' ? 'rejected' : 'published';
            showPublishSuccess(`Submission ${action} successfully!`);
            loadApprovedMaterials();
          } else {
            showPublishError(result.error || 'Failed to update submission status.');
          }
        } catch (e) {
          console.error('Error parsing JSON response:', e, 'Raw response:', response);
          showPublishError('Error processing server response.');
        }
      },
      error: function(xhr, status, error) {
        console.error('AJAX Error:', {
          status: xhr.status,
          statusText: xhr.statusText,
          error: error,
          responseText: xhr.responseText
        });
        showPublishError('Error updating submission. Please try again.');
      }
    });
  }

  function initializeFilters() {
    $('#searchApproved, #typeFilter, #collegeFilter, #statusFilter').on('input change', function() {
      filterMaterials();
    });
  }

  function filterMaterials() {
    const searchTerm = $('#searchApproved').val().toLowerCase();
    const typeFilter = $('#typeFilter').val().toLowerCase();
    const collegeFilter = $('#collegeFilter').val().toLowerCase();
    const statusFilter = $('#statusFilter').val().toLowerCase();

    if (approvedMaterialsData.length === 0) return;

    const filteredData = approvedMaterialsData.filter(row => {
      const student = (row.studentName || '').toLowerCase();
      const title = (row.materialName || '').toLowerCase();
      const author = `${row.author_lastname || ''} ${row.author_firstname || ''}`.toLowerCase();
      const type = (row.materialType_id || '').toLowerCase();
      const college = (row.deanCollege || '').toLowerCase();
      const status = (row.deanApprovalStatus || '').toLowerCase();  

      const matchesSearch = !searchTerm || 
                           student.includes(searchTerm) || 
                           title.includes(searchTerm) || 
                           author.includes(searchTerm);
      const matchesType = !typeFilter || type.includes(typeFilter);
      const matchesCollege = !collegeFilter || college.includes(collegeFilter);
      const matchesStatus = !statusFilter || status.includes(statusFilter);

      return matchesSearch && matchesType && matchesCollege && matchesStatus;
    });

    renderApprovedMaterials(filteredData);
  }

  function initializePublishingModals() {
    $(document).on('click', '.close-publish-success', function() {
      $publishSuccessModal.addClass('hidden');
      $publishModal.addClass('hidden');
      loadApprovedMaterials();
    });

    $(document).on('click', '.close-publish-error', function() {
      $publishErrorModal.addClass('hidden');
    });

    $(document).on('click', function(e) {
      if ($(e.target).is('#publishSuccessModal')) {
        $publishSuccessModal.addClass('hidden');
        $publishModal.addClass('hidden');
        loadApprovedMaterials();
      }
      if ($(e.target).is('#publishErrorModal')) {
        $publishErrorModal.addClass('hidden');
      }
    });
  }

  function showPublishSuccess(message = "Material has been successfully published and is now available in the library.") {
    $('#publishSuccessMessage').text(message);
    $publishSuccessModal.removeClass('hidden');
  }

  function showPublishError(message) {
    $('#publishErrorMessage').text(message || 'An error occurred while publishing the material.');
    $publishErrorModal.removeClass('hidden');
  }

  function showTableError(message) {
    $tbody.html(`<tr><td colspan="11" class="px-4 py-3 text-center text-red-500">${message}</td></tr>`);
  }

  function showTableMessage(message) {
    $tbody.html(`<tr><td colspan="11" class="px-4 py-3 text-center text-gray-500">${message}</td></tr>`);
  }

  function getLibrarianStatusClass(status) {
    if (status === 'Published') return 'w-[84px] border-blue-500 bg-blue-100 text-blue-700';
    if (status === 'Not Published') return 'border-orange-500 bg-orange-100 text-orange-700';
    if (status === 'Pending') return 'border-yellow-400 bg-yellow-100 text-yellow-700';
    return 'border-gray-500 bg-gray-100 text-gray-700';
  }

  function getDeanStatusClass(status) {
    if (!status) return 'w-[84px] border-yellow-400 bg-yellow-100 text-yellow-700';
    
    switch(status) {
      case 'Approved':
        return 'w-[84px] border-green-500 bg-green-100 text-green-700';
      case 'Denied':
      case 'Rejected':
        return 'w-[84px] border-red-500 bg-red-100 text-red-700';
      default:
        return 'w-[84px] border-yellow-400 bg-yellow-100 text-yellow-700';
    }
  }

  function formatDate(dateString) {
    if (!dateString || dateString === '0000-00-00 00:00:00') return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
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