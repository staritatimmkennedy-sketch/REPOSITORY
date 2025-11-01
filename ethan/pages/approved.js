$(function () {
  const $tbody = $("#approvedMaterialsBody");
  const $publishModal = $("#publishModal");
  const $reviewModal = $("#reviewModal");
  let approvedMaterialsData = [];

  loadApprovedMaterials();
  initializeFilters();

  function loadApprovedMaterials() {
    $tbody.html(`<tr><td colspan="10" class="px-4 py-3 text-center text-sm text-gray-500">Loading approved materials...</td></tr>`);

    $.ajax({
      url: "pages/get_approvedSubmissions.php",
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data.error) {
          $tbody.html(`<tr><td colspan="10" class="px-4 py-3 text-center text-red-500">${data.error}</td></tr>`);
          return;
        }

        if (!data.length) {
          $tbody.html(`<tr><td colspan="10" class="px-4 py-3 text-center text-gray-500">No approved materials ready for publishing.</td></tr>`);
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
        $tbody.html(`<tr><td colspan="10" class="px-4 py-3 text-center text-red-500">Error loading materials: ${xhr.responseText || 'Please try again.'}</td></tr>`);
      }
    });
  }

  function renderApprovedMaterials(data) {
    if (!data || data.length === 0) {
      $tbody.html(`<tr><td colspan="10" class="px-4 py-3 text-center text-gray-500">No approved materials ready for publishing.</td></tr>`);
      return;
    }

    let rows = "";
    data.forEach(row => {
      const student = row.studentName || "(Unknown)";
      const title = row.materialName || "(Untitled)";
      const type = row.materialType_id || "";
      const author = `${row.author_lastname || ''}, ${row.author_firstname || ''} ${row.author_mi || ''}`.trim();
      const submissionDate = formatDate(row.submissionDate) || "";
      const dateApproved = formatDate(row.approvalDate) || "";
      const deanCollege = row.deanCollege || "Unknown College";
      const status = row.approvalStatus || "APPROVED";

      const badgeClass = getStatusClass(status);

      const actionButtons = `
        <div class="relative inline-block text-left">
          <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
            Manage ▾
          </button>
          <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 review-submission" data-id="${row.materialSubmission_id}">Review</a>
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 publish-submission" data-id="${row.materialSubmission_id}">Publish</a>
            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 reject-submission" data-id="${row.materialSubmission_id}">Reject</a>
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
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${badgeClass} rounded-full">
              ${escapeHtml(status)}
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
      const status = (row.approvalStatus || '').toLowerCase();

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

  function initializeDropdowns() {
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.relative').length) {
        $('.dropdown-menu').addClass('hidden');
      }
    });

    $(document).off('click', '.manage-btn').on('click', '.manage-btn', function(e) {
      e.stopPropagation();
      const $button = $(this);
      const $dropdown = $button.siblings('.dropdown-menu');
      const buttonRect = this.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // First hide all other dropdowns
      $('.dropdown-menu').not($dropdown).addClass('hidden');

      // Toggle current dropdown
      $dropdown.toggleClass('hidden');

      if (!$dropdown.hasClass('hidden')) {
        // Reset position to default for measurement
        $dropdown.css({
          top: '',
          bottom: '',
          left: '',
          right: '',
          transform: ''
        });

        // Get dimensions after display
        const dropdownRect = $dropdown[0].getBoundingClientRect();
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        const spaceRight = viewportWidth - buttonRect.left;
        const dropdownHeight = dropdownRect.height;
        const dropdownWidth = dropdownRect.width;

        // Calculate best position
        let verticalPosition = {};
        let horizontalPosition = {};

        // Vertical positioning
        if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
          // Position below if enough space or more space below than above
          verticalPosition = {
            top: '100%',
            bottom: 'auto'
          };
        } else {
          // Position above
          verticalPosition = {
            bottom: '100%',
            top: 'auto'
          };
        }

        // Horizontal positioning
        if (spaceRight >= dropdownWidth) {
          // Align to left if enough space
          horizontalPosition = {
            left: '0',
            right: 'auto'
          };
        } else {
          // Align to right
          horizontalPosition = {
            right: '0',
            left: 'auto'
          };
        }

        // Apply positioning
        $dropdown.css({
          ...verticalPosition,
          ...horizontalPosition,
          minWidth: '160px', // Ensure minimum width
          maxWidth: '200px'  // Limit maximum width
        });

        // Final position check and adjustment
        const finalRect = $dropdown[0].getBoundingClientRect();
        if (finalRect.right > viewportWidth) {
          $dropdown.css({
            right: '0',
            left: 'auto'
          });
        }
        if (finalRect.bottom > viewportHeight) {
          $dropdown.css({
            bottom: '100%',
            top: 'auto'
          });
        }
      }
    });
  }

  function initializeActions() {
    // Publish submission
    $(document).off('click', '.publish-submission').on('click', '.publish-submission', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const submissionId = $(this).data('id');
      $("#publishSubmissionId").val(submissionId);
      $("#callNumber").val('');
      $("#publishMsg").empty();
      $publishModal.removeClass('hidden');
      $reviewModal.addClass('hidden');
      $('.dropdown-menu').addClass('hidden');
    });

    // Reject submission
    $(document).off('click', '.reject-submission').on('click', '.reject-submission', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const submissionId = $(this).data('id');
      if (confirm('Are you sure you want to reject this approved material? This will send it back to the dean for review.')) {
        updateSubmissionStatus(submissionId, 'REJECTED');
      }
      $('.dropdown-menu').addClass('hidden');
    });

    // REVIEW: Show PDF in modal
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
                    alert('Error: ' + res.error);
                    return;
                }

                const pdfUrl = 'pages/view_pdf.php?file=' + encodeURIComponent(res.file) + '&t=' + Date.now();
                $('#pdfViewer').attr('src', pdfUrl);
                $reviewModal.removeClass('hidden');
                $publishModal.addClass('hidden');
                $('.dropdown-menu').addClass('hidden');
            },
            error: function() {
                alert('Failed to load PDF.');
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

    if (!callNumber) {
      $("#publishMsg").html('<p class="text-red-600">Please enter a call number</p>');
      return;
    }

    const submitBtn = $("#publishForm").find('button[type="submit"]');
    const originalText = submitBtn.text();
    submitBtn.prop('disabled', true).text('Publishing...');

    $.ajax({
      url: 'pages/publish_material.php',
      type: 'POST',
      data: {
        submission_id: submissionId,
        call_number: callNumber
      },
      success: function(response) {
        try {
          const result = typeof response === 'string' ? JSON.parse(response) : response;
          if (result.success) {
            $("#publishMsg").html('<p class="text-green-600">Material published successfully!</p>');
            setTimeout(() => {
              $publishModal.addClass('hidden');
              loadApprovedMaterials();
            }, 1500);
          } else {
            $("#publishMsg").html(`<p class="text-red-600">Error: ${result.error || 'Publishing failed'}</p>`);
          }
        } catch (e) {
          console.error('Error parsing response:', e);
          $("#publishMsg").html('<p class="text-red-600">Error processing server response</p>');
        }
      },
      error: function(xhr, status, error) {
        console.error('Error publishing material:', error, xhr.responseText);
        $("#publishMsg").html('<p class="text-red-600">Error publishing material. Please try again.</p>');
      },
      complete: function() {
        submitBtn.prop('disabled', false).text(originalText);
      }
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
            const action = status === 'REJECTED' ? 'rejected' : 'updated';
            alert(`Submission ${action} successfully!`);
            loadApprovedMaterials();
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
      case 'REJECTED':
      case 'DENIED':
        return 'border-red-500 bg-red-100 text-red-700';
      case 'PENDING':
      default:
        return 'border-yellow-400 bg-yellow-100 text-yellow-700';
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