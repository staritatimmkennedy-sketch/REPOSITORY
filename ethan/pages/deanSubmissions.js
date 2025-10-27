$(function () {
  const $tbody = $("#deanSubmissionBody");
  let submissionsData = [];

  loadDeanSubmissions();
  initializeFilters();
  initializeDropdowns();

  function loadDeanSubmissions() {
    $tbody.html(`<tr><td colspan="10" class="px-4 py-3 text-center text-sm text-gray-500">Loading submissions...</td></tr>`);

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
        showError("Error loading submissions. Please try again.");
      }
    });
  }

  function renderSubmissions(data) {
    if (!data || data.length === 0) {
      showMessage("No submissions found.");
      return;
    }

    let rows = "";
    data.forEach(row => {
      const student = row.studentName || "(Unknown)";
      const title = row.materialName || "(Untitled)";
      const type = row.materialType_id || "";
      const author = getAuthorName(row);
      const date = formatDate(row.submissionDate) || "";
      const approvalDate = formatDate(row.approvalDate) || "Not approved";
      const description = row.materialDescription || "";
      const file = row.materialFile || "";
      const fileName = file ? file.split('/').pop() : "";
      const status = row.approvalStatus || "Pending";

      const badgeClass = getStatusClass(status);
      const actionButtons = getActionButtons(row, status);

      rows += `
        <tr class="border-b hover:bg-gray-50">
          <td class="px-4 py-3 text-sm">${escapeHtml(student)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(title)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(type)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(author)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(date)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(approvalDate)}</td>
          <td class="px-4 py-3 text-sm max-w-xs truncate" title="${escapeHtml(description)}">${escapeHtml(description)}</td>
          <td class="px-4 py-3 text-sm">
            ${file ? `<a href="${escapeHtml(file)}" class="text-blue-600 hover:text-blue-800 underline" target="_blank">${escapeHtml(fileName)}</a>` : 'No file'}
          </td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${badgeClass} rounded-full">
              ${escapeHtml(status)}
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            ${actionButtons}
          </td>
        </tr>`;
    });

    $tbody.html(rows);
    initializeActions();
  }

  function getAuthorName(row) {
    // Try different possible field names for author
    if (row.author) return row.author;
    
    const lastname = row.author_lastname || '';
    const firstname = row.author_firstname || '';
    const mi = row.author_mi || '';
    
    if (lastname && firstname) {
      return mi ? `${lastname}, ${firstname} ${mi}.` : `${lastname}, ${firstname}`;
    }
    
    return "Unknown Author";
  }

  function getActionButtons(row, status) {
    if (status.toUpperCase() !== 'PENDING') {
      return `<span class="text-gray-500 text-sm">Completed</span>`;
    }

    return `
      <div class="relative inline-block text-left">
        <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
          Manage ▾
        </button>
        <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 review-submission" data-id="${row.materialSubmission_id}">Review</a>  <!-- Fixed href and hover -->
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 approve-submission" data-id="${row.materialSubmission_id}">Approve</a>  <!-- Fixed hover -->
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 reject-submission" data-id="${row.materialSubmission_id}">Reject</a>  <!-- Fixed hover -->
        </div>
      </div>
    `;
  }

   function initializeFilters() {
    $('#searchSubmissions, #typeFilter, #statusFilter').on('input change', function() {
      filterSubmissions();
    });
  }

  function filterSubmissions() {
    const searchTerm = $('#searchSubmissions').val().toLowerCase();
    const typeFilter = $('#typeFilter').val().toLowerCase();
    const statusFilter = $('#statusFilter').val().toLowerCase();

    if (submissionsData.length === 0) return;

    const filteredData = submissionsData.filter(row => {
      const student = (row.studentName || '').toLowerCase();
      const title = (row.materialName || '').toLowerCase();
      const description = (row.materialDescription || '').toLowerCase();
      const type = (row.materialType_id || '').toLowerCase();
      const status = (row.approvalStatus || '').toLowerCase();

      const matchesSearch = !searchTerm || 
                           student.includes(searchTerm) || 
                           title.includes(searchTerm) || 
                           description.includes(searchTerm);
      const matchesType = !typeFilter || type.includes(typeFilter);
      const matchesStatus = !statusFilter || status.includes(statusFilter);

      return matchesSearch && matchesType && matchesStatus;
    });

    renderSubmissions(filteredData);
  }

  function initializeDropdowns() {
    // Close dropdowns when clicking elsewhere
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.relative').length) {
        $('.dropdown-menu').addClass('hidden');
      }
    });

    // Toggle dropdowns
    $(document).off('click', '.manage-btn').on('click', '.manage-btn', function(e) {
      e.stopPropagation();
      const dropdown = $(this).siblings('.dropdown-menu');
      $('.dropdown-menu').not(dropdown).addClass('hidden');
      dropdown.toggleClass('hidden');
    });
  }

  function initializeActions() {
  // Approve submission
  $(document).off('click', '.approve-submission').on('click', '.approve-submission', function(e) {
    e.preventDefault();
    const submissionId = $(this).data('id');
    if (confirm('Are you sure you want to approve this submission?')) {
      updateSubmissionStatus(submissionId, 'APPROVED');
    }
  });

  // Reject submission
  $(document).off('click', '.reject-submission').on('click', '.reject-submission', function(e) {
    e.preventDefault();
    const submissionId = $(this).data('id');
    if (confirm('Are you sure you want to reject this submission?')) {
      updateSubmissionStatus(submissionId, 'DENIED');
    }
  });

  // Review submission
  $(document).off('click', '.review-submission').on('click', '.review-submission', function(e) {
  e.preventDefault();
  e.stopPropagation();
  const submissionId = $(this).data('id');
  $.ajax({
    url: 'pages/get_material_content.php',
    type: 'GET',
    data: { submission_id: submissionId },
    success: function(data) {
      $('#materialContent').text(data || 'No content available.');
      $('#reviewModal').removeClass('hidden');
      $('.dropdown-menu').addClass('hidden');
    },
    error: function(xhr, status, error) {
      console.error('Error fetching material:', {
        status: xhr.status,
        statusText: xhr.statusText,
        error: error,
        responseText: xhr.responseText
      });
      alert('Error loading material content: ' + (xhr.responseText || 'Unknown error.'));
    }
  });
});

  // Close modal (handles both X and Close button)
  $(document).off('click', '#closeModal, #closeModalBtn').on('click', '#closeModal, #closeModalBtn', function() {
    $('#reviewModal').addClass('hidden');
    $('#materialContent').text(''); // Clear content
  });
}

  function updateSubmissionStatus(submissionId, status) {
    console.log('Attempting to update submission:', {
        submissionId: submissionId,
        status: status,
        url: 'pages/update_submissionStatus.php'
    });

    $.ajax({
        url: 'pages/update_submissionStatus.php',
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
                    const action = status === 'APPROVED' ? 'approved' : 'denied';
                    alert(`Submission ${action} successfully!`);
                    loadDeanSubmissions(); // Reload the data
                } else {
                    const errorMsg = result.error || 'Unknown error occurred';
                    console.error('Server returned error:', errorMsg);
                    alert('Error: ' + errorMsg);
                }
            } catch (e) {
                console.error('Error parsing JSON response:', e, 'Raw response:', response);
                alert('Error processing server response. Please check console.');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', {
                status: xhr.status,
                statusText: xhr.statusText,
                error: error,
                responseText: xhr.responseText
            });
            
            let errorMessage = 'Error updating submission. ';
            
            if (xhr.status === 404) {
                errorMessage += 'API endpoint not found.';
            } else if (xhr.status === 500) {
                errorMessage += 'Server error occurred.';
            } else if (xhr.status === 0) {
                errorMessage += 'Network connection failed.';
            } else {
                errorMessage += 'Please try again.';
            }
            
            alert(errorMessage);
        }
    });
}

  function getStatusClass(status) {
    const statusUpper = status.toUpperCase();
    switch(statusUpper) {
      case 'APPROVED':
        return 'border-green-500 bg-green-100 text-green-700';
      case 'PUBLISHED':
        return 'border-blue-500 bg-blue-100 text-blue-700';
      case 'DENIED':
      case 'REJECTED':
        return 'border-red-500 bg-red-100 text-red-700';
      case 'PENDING':
      default:
        return 'border-yellow-400 bg-yellow-100 text-yellow-700';
    }
  }

  function formatDate(dateString) {
    if (!dateString) return '';
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