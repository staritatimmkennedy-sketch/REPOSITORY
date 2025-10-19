$(document).ready(function() {
  // Initialize variables
  const modal = $("#submitModal");
  const tbody = $("#submissionsTbody");
  let submissionsData = []; // Store data for filtering
  let isSubmitting = false; // Flag to prevent double submission

  // --- Modal Functions ---
  $("#openSubmitModal").on("click", function() {
    modal.removeClass("hidden");
    $("#submitMsg").empty(); // Clear previous messages
    $("#submitForm")[0].reset(); // Reset form
  });

  $("#closeModal").on("click", function() {
    modal.addClass("hidden");
    $("#submitMsg").empty();
  });

  // Close modal when clicking outside
  $(document).on('click', function(e) {
    if ($(e.target).is('#submitModal')) {
      modal.addClass("hidden");
      $("#submitMsg").empty();
    }
  });

  // --- Submit Form --- (FIXED: Use one() or off() to prevent multiple bindings)
  $("#submitForm").off('submit').on("submit", function(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    const submitBtn = $(this).find('button[type="submit"]');
    const originalText = submitBtn.text();
    
    // Set submitting flag
    isSubmitting = true;
    
    // Show loading state
    submitBtn.prop('disabled', true).text('Submitting...');
    $("#submitMsg").html("<p class='text-blue-600'>Submitting material...</p>");

    const formData = new FormData(this);

    $.ajax({
      url: "pages/submitMaterial.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function(response) {
        console.log("Submission response:", response);
        
        try {
          // Try to parse JSON response
          const result = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (result.success || result.message) {
            $("#submitMsg").html(`<p class='text-green-600'>${result.message || 'Material submitted successfully!'}</p>`);
            $("#submitForm")[0].reset();
            
            // Reload submissions after successful submission
            setTimeout(() => {
              modal.addClass("hidden");
              loadSubmissions();
            }, 2000);
          } else {
            $("#submitMsg").html(`<p class='text-red-600'>${result.error || 'Submission failed!'}</p>`);
          }
        } catch (e) {
          // If response is not JSON, assume success
          $("#submitMsg").html("<p class='text-green-600'>Material submitted successfully!</p>");
          $("#submitForm")[0].reset();
          setTimeout(() => {
            modal.addClass("hidden");
            loadSubmissions();
          }, 2000);
        }
      },
      error: function(xhr, status, error) {
        console.error("Submission error:", error, xhr.responseText);
        $("#submitMsg").html(`<p class='text-red-600'>Submission failed. Please try again.</p>`);
      },
      complete: function() {
        // Reset submitting flag and button state
        isSubmitting = false;
        submitBtn.prop('disabled', false).text(originalText);
      }
    });
  });

  // --- Load Submissions ---
  function loadSubmissions() {
    tbody.html(`<tr><td colspan="8" class="text-center py-4 text-gray-500">Loading submissions...</td></tr>`);
    
    $.ajax({
      url: "pages/get_user_submission.php",
      type: "GET",
      dataType: "json",
      success: function(data) {
        console.log("Submissions data received:", data);
        submissionsData = data || [];
        renderSubmissions(submissionsData);
        initializeFilters(); // Initialize filters after data is loaded
      },
      error: function(xhr, status, error) {
        console.error("AJAX Error:", error, xhr.responseText);
        const errorMsg = xhr.status === 404 ? 'Server endpoint not found' : error;
        tbody.html(`<tr><td colspan="8" class="text-center text-red-600 py-4">Error loading data: ${errorMsg}</td></tr>`);
      }
    });
  }

  // --- Render Submissions ---
  function renderSubmissions(data) {
    tbody.empty();

    if (!data || data.length === 0) {
      tbody.append(`<tr><td colspan="8" class="text-center py-4 text-gray-500">No submissions found.</td></tr>`);
      return;
    }

    data.forEach(function(item) {
      const authorFull = formatAuthorName(item);
      const statusColor = getStatusColor(item.approvalStatus);
      const fileName = item.materialFile ? item.materialFile.split('/').pop() : 'file';
      const materialType = item.materialType_id || item.material_type || 'Unknown';

      const row = `
        <tr class="border-b hover:bg-gray-50"
            data-title="${escapeHtml(item.materialName || '')}"
            data-author="${escapeHtml(authorFull)}"
            data-type="${escapeHtml(materialType)}"
            data-status="${escapeHtml(item.approvalStatus || '')}">
          
          <td class="px-4 py-3 text-sm">${escapeHtml(item.materialName || '')}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(materialType)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(item.materialDescription || '')}</td>

          <td class="px-4 py-3 text-sm">${escapeHtml(authorFull)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(formatDate(item.submissionDate))}</td>
          <td class="px-4 py-3 text-sm">
            ${item.materialFile ? 
              `<a href="${escapeHtml(item.materialFile)}" class="text-blue-600 hover:text-blue-800 underline" target="_blank">${escapeHtml(fileName)}</a>` : 
              '<span class="text-gray-500">No file</span>'}
          </td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border ${statusColor} rounded-full">
              ${escapeHtml(item.approvalStatus || 'Unknown')}
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="manage-btn w-22 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
                Manage ▾
              </button>
              <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 edit-submission" data-id="${item.submission_id || ''}">Edit Submission</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 remove-submission" data-id="${item.submission_id || ''}">Remove Submission</a>
              </div>
            </div>
          </td>
        </tr>
      `;
      tbody.append(row);
    });

    initializeDropdowns();
    initializeRowActions();
  }

  // --- Helper Functions ---
  function formatAuthorName(item) {
    const lastname = item.author_lastname || item.authorLast || '';
    const firstname = item.author_firstname || item.authorFirst || '';
    const mi = item.author_mi || item.authorMI || '';
    
    let authorFull = `${lastname}, ${firstname}`;
    if (mi) authorFull += ` ${mi}.`;
    
    return authorFull.trim();
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function getStatusColor(status) {
    const statusColors = {
      "Pending": "border-yellow-400 bg-yellow-100 text-yellow-700",
      "Approved": "border-green-500 bg-green-100 text-green-700",
      "Published": "border-blue-500 bg-blue-100 text-blue-700",
      "Denied": "border-red-500 bg-red-100 text-red-700"
    };
    return statusColors[status] || "border-gray-300 bg-gray-100 text-gray-700";
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

  // --- Dropdown Management ---
  function initializeDropdowns() {
    // Close dropdowns when clicking elsewhere
    $(document).on('click', function(e) {
      if (!$(e.target).closest('.relative').length) {
        $('.dropdown-menu').addClass('hidden');
      }
    });

    // Toggle dropdowns - use off() to prevent multiple bindings
    $(document).off('click', '.manage-btn').on('click', '.manage-btn', function(e) {
      e.stopPropagation();
      const dropdown = $(this).siblings('.dropdown-menu');
      $('.dropdown-menu').not(dropdown).addClass('hidden');
      dropdown.toggleClass('hidden');
    });
  }

  // --- Row Actions ---
  function initializeRowActions() {
    // Edit submission - use off() to prevent multiple bindings
    $(document).off('click', '.edit-submission').on('click', '.edit-submission', function(e) {
      e.preventDefault();
      const submissionId = $(this).data('id');
      console.log('Edit submission:', submissionId);
      alert(`Edit submission ${submissionId} - functionality to be implemented`);
    });

    // Remove submission - use off() to prevent multiple bindings
    $(document).off('click', '.remove-submission').on('click', '.remove-submission', function(e) {
      e.preventDefault();
      const submissionId = $(this).data('id');
      if (confirm('Are you sure you want to remove this submission?')) {
        console.log('Remove submission:', submissionId);
        alert(`Remove submission ${submissionId} - functionality to be implemented`);
      }
    });
  }

  // --- Filter Functionality ---
  function initializeFilters() {
    // Remove existing event handlers first
    $('#searchInput, #typeFilter, #statusFilter').off('input change');
    
    $('#searchInput, #typeFilter, #statusFilter').on('input change', function() {
      filterTable();
    });
  }

  function filterTable() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    const typeFilter = $('#typeFilter').val();
    const statusFilter = $('#statusFilter').val();

    if (submissionsData.length === 0) return;

    const filteredData = submissionsData.filter(item => {
      const authorFull = formatAuthorName(item).toLowerCase();
      const title = (item.materialName || '').toLowerCase();
      const type = item.materialType_id || item.material_type || '';
      const status = item.approvalStatus || '';

      const matchesSearch = !searchTerm || 
                           title.includes(searchTerm) || 
                           authorFull.includes(searchTerm);
      const matchesType = !typeFilter || type === typeFilter;
      const matchesStatus = !statusFilter || status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    renderSubmissions(filteredData);
  }

  // --- Initialize Everything ---
  loadSubmissions();
});