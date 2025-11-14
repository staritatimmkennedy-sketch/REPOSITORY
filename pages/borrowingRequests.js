$(document).ready(function() {
  // Initialize variables
  const $tbody = $("#borrowingRequestsBody");
  let borrowingRequestsData = [];
  let isProcessing = false; 

  // --- Load Borrowing Requests ---
  function loadBorrowingRequests() {
    $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-sm text-gray-500">Loading borrowing requests...</td></tr>`);

    $.ajax({
      url: "pages/get_borrowing_requests.php",
      type: "GET",
      dataType: "json",
      success: function(data) {
        console.log("Borrowing requests data received:", data);
        
        if (data.error) {
          showError(data.error);
          return;
        }

        if (!data || !data.length) {
          showMessage("No borrowing requests found.");
          return;
        }

        borrowingRequestsData = data;
        renderBorrowingRequests(borrowingRequestsData);
        initializeFilters();
      },
      error: function(xhr, status, error) {
        console.error("AJAX Error:", error, xhr.responseText);
        const errorMsg = xhr.status === 404 ? 'Server endpoint not found' : error;
        showError(`Error loading data: ${errorMsg}`);
        
        // Load fallback data for testing
        loadFallbackData();
      }
    });
  }

  

  // --- Render Borrowing Requests ---
  function renderBorrowingRequests(data) {
    $tbody.empty();

    if (!data || data.length === 0) {
      showMessage("No borrowing requests available.");
      return;
    }

    data.forEach(function(request) {
      const statusBadge = getStatusBadge(request.borrowStatus);
      const requestDate = formatDate(request.date_requested || request.borrowedDate);
      const dueDate = formatDate(request.dueDate);

      
      const row = `
        <tr class="border-b hover:bg-gray-50"
            data-title="${escapeHtml(request.title?.toLowerCase() || '')}"
            data-author="${escapeHtml(request.author?.toLowerCase() || '')}"
            data-user="${escapeHtml(request.student_username?.toLowerCase() || '')}"
            data-college="${escapeHtml(request.student_college?.toLowerCase() || '')}"
            data-status="${request.borrowStatus?.toLowerCase() || ''}">
          
          <td class="px-4 py-3 text-sm">
            <div class="font-medium">${escapeHtml(request.student_username)}</div>
            <div class="text-xs text-gray-500">${escapeHtml(request.student_course || 'N/A')}</div>
          </td>
          
          <td class="px-4 py-3 text-sm">${requestDate}</td>
          
          <td class="px-4 py-3 text-sm">
            <div class="font-medium">${escapeHtml(request.title)}</div>
            <div class="text-xs text-gray-500">${escapeHtml(request.callNumber)}</div>
          </td>
          
          <td class="px-4 py-3 text-sm">${escapeHtml(request.material_type)}</td>
          
          <td class="px-4 py-3 text-sm">${escapeHtml(request.author)}</td>
          
          <td class="px-4 py-3 text-sm">${escapeHtml(request.student_college || 'N/A')}</td>
          
          <td class="px-4 py-3 text-sm">${dueDate}</td>
          
          <td class="px-4 py-3 text-sm">${statusBadge}</td>
          
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none"
                      data-request='${escapeHtml(JSON.stringify(request))}'>
                Manage ▾
              </button>
              <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 view-details">View Details</a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 process-request">Process Request</a>
              </div>
            </div>
          </td>
        </tr>
      `;
      $tbody.append(row);
    });

    initializeDropdowns();
    initializeRowActions();
  }

  // --- Dropdown Management ---
  function initializeDropdowns() {
    // Close dropdowns when clicking elsewhere
    $(document).off('click.closeDropdowns').on('click.closeDropdowns', function(e) {
      if (!$(e.target).closest('.relative').length) {
        $('.dropdown-menu').addClass('hidden');
      }
    });

    // Toggle dropdowns
    $(document).off('click.manageBtn').on('click.manageBtn', '.manage-btn', function(e) {
      e.stopPropagation();
      const dropdown = $(this).siblings('.dropdown-menu');
      $('.dropdown-menu').not(dropdown).addClass('hidden');
      dropdown.toggleClass('hidden');
    });
  }

  // --- Row Actions ---
  function initializeRowActions() {
    // View Details - FIXED: Handle both string and object data
    $(document).off('click.viewDetails').on('click.viewDetails', '.view-details', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const $dropdown = $(this).closest('.dropdown-menu');
      const $button = $dropdown.siblings('.manage-btn');
      const requestData = getRequestData($button);
      
      if (requestData) {
        openDetailsModal(requestData);
        $dropdown.addClass('hidden');
      }
    });

    // Process Request - FIXED: Handle both string and object data
    $(document).off('click.processRequest').on('click.processRequest', '.process-request', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const $dropdown = $(this).closest('.dropdown-menu');
      const $button = $dropdown.siblings('.manage-btn');
      const requestData = getRequestData($button);
      
      if (requestData) {
        openManageModal(requestData);
        $dropdown.addClass('hidden');
      }
    });
  }

  // --- Helper to get request data safely ---
  function getRequestData($button) {
    try {
      const rawData = $button.data('request');
      console.log("Raw data type:", typeof rawData, rawData);
      
      // If it's already an object, return it
      if (typeof rawData === 'object' && rawData !== null) {
        return rawData;
      }
      
      // If it's a string, parse it
      if (typeof rawData === 'string') {
        return JSON.parse(rawData);
      }
      
      console.error("Unexpected data type:", typeof rawData);
      return null;
    } catch (error) {
      console.error("Error parsing request data:", error);
      return null;
    }
  }




























  // --- Modal Functions ---
  function openDetailsModal(requestData) {
    console.log("Opening details modal for:", requestData);
    
    // Populate all detail fields
    $('#detailStudentUsername').text(requestData.student_username || 'N/A');
    $('#detailStudentCollege').text(requestData.student_college || 'N/A');
    $('#detailStudentCourse').text(requestData.student_course || 'N/A');
    $('#detailMaterialTitle').text(requestData.title || 'N/A');
    $('#detailCallNumber').text(requestData.callNumber || 'N/A');
    $('#detailMaterialType').text(requestData.material_type || 'N/A');
    $('#detailAuthor').text(requestData.author || 'N/A');
    $('#detailMaterialStatus').text(requestData.current_material_status || 'N/A');
    $('#detailBorrowStatus').text(requestData.borrowStatus || 'N/A');
    $('#detailBorrowedDate').text(formatDate(requestData.date_requested));
    $('#detailDueDate').text(formatDate(requestData.dueDate));
    $('#detailApprovalDate').text(formatDate(requestData.approvalDate));
    $('#detailStudentRemarks').text(requestData.studentRemarks || 'No remarks provided');
    $('#detailLibrarianRemarks').text(requestData.librarianRemarks || 'No remarks provided');
    
    $('#detailsModal').removeClass('hidden');
  }





























  function openManageModal(requestData) {
    console.log("Opening manage modal for:", requestData);
    
    // Reset form fields
    $('#manageRemarks').val('');
    
    // Populate modal fields
    $('#manageStudent').text(requestData.student_username);
    $('#manageMaterial').text(requestData.title);
    $('#manageCurrentStatus').text(requestData.borrowStatus);
    $('#manageDueDate').text(formatDate(requestData.dueDate));
    $('#manageStudentRemarks').text(requestData.studentRemarks || 'No remarks provided');
    $('#manageBorrowingId').val(requestData.materialBorrowing_id);
    $('#manageCallNumber').val(requestData.callNumber);
    
    // Set current due date in the input field (if exists)
    if (requestData.dueDate && requestData.dueDate !== '0000-00-00 00:00:00') {
      const dueDate = new Date(requestData.dueDate.replace(' ', 'T'));
      if (!isNaN(dueDate)) {
        $('#manageDueDateInput').val(dueDate.toISOString().split('T')[0]);
      }
    } else {
      // Set default due date (e.g., 7 days from now)
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7);
      $('#manageDueDateInput').val(defaultDueDate.toISOString().split('T')[0]);
    }
    
    // Set available actions based on current status
    const actionSelect = $('#manageAction');
    actionSelect.empty();
    
    const status = requestData.borrowStatus || '';
    if (status === 'Requested') {
        actionSelect.append('<option value="Approved">Approve</option>');
        actionSelect.append('<option value="Denied">Deny</option>');
    } else if (status === 'Approved') {
        actionSelect.append('<option value="Borrowed">Mark as Borrowed</option>');
        actionSelect.append('<option value="Denied">Deny Request</option>');
        actionSelect.append('<option value="Requested">↩ Return to Requested</option>');
    } else if (status === 'Borrowed') {
        actionSelect.append('<option value="Returned">Mark as Returned</option>');
        actionSelect.append('<option value="Approved">↩ Return to Approved</option>');
    } else {
        actionSelect.append('<option value="">No actions available</option>');
    }
    
    // Add current status as first option
    actionSelect.prepend(`<option value="">Keep as ${requestData.borrowStatus}</option>`);
    
    $('#manageModal').removeClass('hidden');
  }
  












  function processManageRequest() {
    if (isProcessing) {
      console.log("Already processing, please wait...");
      return;
    }
  
    const action = $('#manageAction').val();
    const borrowingId = $('#manageBorrowingId').val();
    const callNumber = $('#manageCallNumber').val();
    const librarianRemarks = $('#manageRemarks').val().trim();
    const dueDate = $('#manageDueDateInput').val(); // Get due date
  
    // If no action selected, just close the modal
    if (!action) {
      $('#manageModal').addClass('hidden');
      return;
    }
  
    // Validate required fields
    if (!borrowingId || !callNumber) {
      alert('Error: Missing required data');
      return;
    }
  
    const $submitBtn = $('#submitManage');
    
    // Set processing state
    isProcessing = true;
    $submitBtn.prop('disabled', true).text('Processing...');
  
    console.log("Submitting process request:", {
      borrowing_id: borrowingId,
      action: action,
      call_number: callNumber,
      librarian_remarks: librarianRemarks,
      due_date: dueDate // Include due date
    });
  
    // Submit the request
    $.ajax({
      url: 'pages/process_borrow_request.php',
      type: 'POST',
      data: {
        borrowing_id: borrowingId,
        action: action,
        call_number: callNumber,
        librarian_remarks: librarianRemarks,
        due_date: dueDate // Send due date
      },
      success: function(response) {
        console.log("Process response:", response);
        
        try {
          const result = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (result.success) {
            showSuccess(`Request ${getActionVerb(action)} successfully`);
            $('#manageModal').addClass('hidden');
            
            // Reload the requests list
            setTimeout(() => {
              loadBorrowingRequests();
            }, 1500);
            
          } else {
            showError(result.error || 'Action failed. Please try again.');
          }
        } catch (e) {
          console.error('JSON parse error:', e);
          showError('Invalid server response. Please try again.');
        }
      },
      error: function(xhr, status, error) {
        console.error("Process error:", error, xhr.responseText);
        showError('Network error. Please check your connection and try again.');
      },
      complete: function() {
        // Reset processing state
        isProcessing = false;
        $submitBtn.prop('disabled', false).text('Update');
      }
    });
  }

































  // --- Success/Error Handling ---
  function showSuccess(message) {
    $('#successMessage').text(message);
    $('#successModal').removeClass('hidden');
    
    // Auto-close success modal after 3 seconds
    setTimeout(() => {
      $('#successModal').addClass('hidden');
    }, 3000);
  }

  function showError(message) {
    alert('Error: ' + message);
  }

  function getActionVerb(action) {
    const verbs = {
        'Approved': 'approved',
        'Denied': 'denied',
        'Borrowed': 'marked as borrowed',
        'Returned': 'marked as returned',
        'Requested': 'returned to requested'
    };
    return verbs[action] || 'processed';
}

  // --- Modal Event Handlers ---
  function initializeModals() {
    // Manage Modal close
    $('.close-manage-modal').off('click').on('click', function() {
      $('#manageModal').addClass('hidden');
    });

    // Details Modal close
    $('.close-details-modal').off('click').on('click', function() {
      $('#detailsModal').addClass('hidden');
    });

    // Success Modal close
    $('.close-success-modal').off('click').on('click', function() {
      $('#successModal').addClass('hidden');
    });

    // Submit Manage button
    $('#submitManage').off('click').on('click', processManageRequest);

    // Close modals when clicking outside
    $(document).on('click', function(e) {
      if ($(e.target).is('#manageModal')) {
        $('#manageModal').addClass('hidden');
      }
      if ($(e.target).is('#detailsModal')) {
        $('#detailsModal').addClass('hidden');
      }
      if ($(e.target).is('#successModal')) {
        $('#successModal').addClass('hidden');
      }
    });
  }

  // --- Filter Functionality ---
  function initializeFilters() {
    $('#searchBorrowing, #statusFilter, #collegeFilter').off('input change.filter').on('input change.filter', function() {
      filterRequests();
    });
  }

  function filterRequests() {
    const searchTerm = $('#searchBorrowing').val().toLowerCase();
    const statusFilter = $('#statusFilter').val();
    const collegeFilter = $('#collegeFilter').val();

    if (borrowingRequestsData.length === 0) return;

    const filteredData = borrowingRequestsData.filter(request => {
        const title = (request.title || '').toLowerCase();
        const author = (request.author || '').toLowerCase();
        const user = (request.student_username || '').toLowerCase();
        const college = (request.student_college || '');
        const status = (request.borrowStatus || '');

        const matchesSearch = !searchTerm || 
                             title.includes(searchTerm) || 
                             author.includes(searchTerm) || 
                             user.includes(searchTerm);
        const matchesStatus = !statusFilter || status === statusFilter;
        const matchesCollege = !collegeFilter || college === collegeFilter;

        return matchesSearch && matchesStatus && matchesCollege;
    });

    renderBorrowingRequests(filteredData);
}
  // --- Helper Functions ---
  function getStatusBadge(status) {
    const statusColors = {
        'Requested': 'border-yellow-500 bg-yellow-100 text-yellow-700',
        'Approved': 'border-blue-500 bg-blue-100 text-blue-700',
        'Borrowed': 'border-purple-500 bg-purple-100 text-purple-700',
        'Returned': 'border-green-500 bg-green-100 text-green-700',
        'Denied': 'border-red-500 bg-red-100 text-red-700'
    };
  
    const colorClass = statusColors[status] || 'border-gray-500 bg-gray-100 text-gray-700';
    return `
      <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border rounded-full ${colorClass}">
        ${status || 'Unknown'}
      </span>`;
}
  

  function formatDate(dateString) {
    if (!dateString || dateString === '0000-00-00 00:00:00') return 'N/A';
    try {
      const date = new Date(dateString.replace(' ', 'T'));
      return isNaN(date) ? dateString : date.toLocaleDateString('en-US', {
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

  function showError(message) {
    $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-red-500">${message}</td></tr>`);
  }

  function showMessage(message) {
    $tbody.html(`<tr><td colspan="9" class="px-4 py-3 text-center text-gray-500">${message}</td></tr>`);
  }

  // --- Initialize Everything ---
  loadBorrowingRequests();
  initializeModals();
});