$(function () {
    // DOM Elements
    const $materialsGrid = $("#publishedMaterialsGrid");
    const $borrowingModal = $("#borrowingModal");
    const $successModal = $("#successModal");
    const $materialDetailsModal = $("#materialDetailsModal");
    
    // State
    let publishedMaterialsData = [];
    let isSubmitting = false;
  
    // Initialize
    loadPublishedMaterials();
    initializeFilters();
    initializeBorrowingModal();
    initializeDetailsModal();
  
    function loadPublishedMaterials() {
        $materialsGrid.html(`
            <div class="col-span-full py-12 text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p class="text-gray-500">Loading published materials...</p>
            </div>
        `);
  
  
        setTimeout(() => {
            const mockData = [
      
            ];
  
            publishedMaterialsData = mockData;
            renderPublishedMaterials(mockData);
  
           
            $.ajax({
                url: "pages/get_published_materials.php",
                type: "GET",
                dataType: "json",
                success: function (res) {
                    const ok = Array.isArray(res) || (res && res.success);
                    if (!ok) {
                        showErrorMessage("Failed to load materials.");
                        return;
                    }
  
                    const data = Array.isArray(res) ? res : (res.data || []);
                    if (!data.length) {
                        showEmptyState();
                        return;
                    }
  
                    publishedMaterialsData = data;
                    renderPublishedMaterials(data);
                },
                error: function (xhr, status, error) {
                    console.error("Error loading published materials:", error, xhr.responseText);
                    showErrorMessage("Error loading materials. Please try again.");
                }
            });
          
        }, 1000);
    }
  
    function renderPublishedMaterials(data) {
        if (!data || data.length === 0) {
            showEmptyState();
            return;
        }
  
        let cards = "";
        data.forEach((material) => {
            const {
                title = material.materialName || "(Untitled)",
                material_type = material.materialType_id || "",
                materialDescription = "",
                author = formatAuthor(material),
                college = material.college || material.deanCollege || "Unknown College",
                submissionDate = "",
                materialStatus = "Available",
                callNumber = "",
                userBorrowStatus = "",
                materialPublishing_id
            } = material;
  
            const statusConfig = getStatusConfig(materialStatus);
            const requestButton = getRequestButton(material, userBorrowStatus);
  
            cards += `
                <div class="material-card bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 h-full flex flex-col min-h-[320px]"
                     data-title="${escapeHtml(title.toLowerCase())}"
                     data-type="${escapeHtml(material_type.toLowerCase())}"
                     data-author="${escapeHtml(author.toLowerCase())}"
                     data-college="${escapeHtml(college.toLowerCase())}"
                     data-status="${escapeHtml(materialStatus.toLowerCase())}">
                  
                  <!-- Category Badge -->
                  <div class="p-4 border-b">
                    <span class="inline-block px-3 py-1 text-xs font-semibold category-badge rounded-full">
                      ${escapeHtml(material_type)}
                    </span>
                  </div>
  
                  <!-- Content -->
                  <div class="p-5 flex-grow flex flex-col">
                    <!-- Title with fixed height -->
                    <div class="mb-3 min-h-[72px] flex items-start">
                      <h3 class="text-xl font-bold text-gray-900 line-clamp-3 leading-tight">${escapeHtml(title)}</h3>
                    </div>
                    
                    <!-- Description with fixed height -->
                    <div class="mb-4 flex-grow min-h-[60px]">
                      <p class="text-sm text-gray-600 line-clamp-3">${escapeHtml(truncateText(materialDescription, 120))}</p>
                    </div>
                    
                    <!-- Author and details with fixed positioning -->
                    <div class="mt-auto">
                      <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-500">
                          <span class="font-medium">Author:</span> ${escapeHtml(author)}
                        </div>
                        ${callNumber ? `<div class="text-xs text-gray-400">${escapeHtml(callNumber)}</div>` : ''}
                      </div>
                    </div>
                  </div>
  
                  <!-- Footer - fixed at bottom -->
                  <div class="px-5 py-3 bg-gray-50 border-t flex justify-between items-center gap-2">
                    <span class="text-xs font-medium ${statusConfig.class} px-2 py-1 rounded whitespace-nowrap">
                      ${statusConfig.text}
                    </span>
                    <div class="flex gap-2">
                      <button class="view-details-btn px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:text-blue-700 transition-colors"
                              data-id="${materialPublishing_id}">
                        View Details
                      </button>
                      ${requestButton}
                    </div>
                  </div>
                </div>
            `;
        });
  
        $materialsGrid.html(cards);
        initializeCardActions();
    }
  
    function getRequestButton(material, userBorrowStatus) {
        const { materialStatus = "Available", materialPublishing_id, callNumber = "", title, author, material_type } = material;
        
        const activeUserStates = ["Requested", "Approved", "Borrowed"];
        
        if (materialStatus !== "Available") {
            return `<button class="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed" disabled>
                      Unavailable
                    </button>`;
        }
  
        if (activeUserStates.includes(userBorrowStatus)) {
            return `<button class="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-md cursor-not-allowed" disabled>
                      Requested
                    </button>`;
        }
  
        return `
          <button class="request-btn px-3 py-1 text-xs font-medium text-white bg-green-600 border border-green-600 rounded-md hover:bg-green-700 hover:border-green-700 transition-colors"
                  data-id="${materialPublishing_id}"
                  data-callnumber="${escapeHtml(callNumber)}"
                  data-title="${escapeHtml(title)}"
                  data-author="${escapeHtml(author)}"
                  data-type="${escapeHtml(material_type)}">
            Request Material
          </button>`;
    }
  
    function initializeFilters() {
        const filters = ['#searchPublished', '#typeFilter', '#collegeFilter'];
        
        filters.forEach(selector => {
            $(selector).off('input change').on('input change', function () {
                filterMaterials();
            });
        });
    }
  
    function filterMaterials() {
        const searchTerm = ($('#searchPublished').val() || "").toLowerCase();
        const typeFilter = ($('#typeFilter').val() || "").toLowerCase();
        const collegeFilter = ($('#collegeFilter').val() || "").toLowerCase();
  
        if (!publishedMaterialsData.length) return;
  
        const filteredData = publishedMaterialsData.filter(material => {
            const title = (material.title || material.materialName || '').toLowerCase();
            const description = (material.materialDescription || '').toLowerCase();
            const author = formatAuthor(material).toLowerCase();
            const type = (material.material_type || material.materialType_id || '').toLowerCase();
            const college = (material.college || material.deanCollege || '').toLowerCase();
  
            const matchesSearch = !searchTerm ||
                                 title.includes(searchTerm) ||
                                 description.includes(searchTerm) ||
                                 author.includes(searchTerm);
            const matchesType = !typeFilter || type.includes(typeFilter);
            const matchesCollege = !collegeFilter || college.includes(collegeFilter);
  
            return matchesSearch && matchesType && matchesCollege;
        });
  
        renderPublishedMaterials(filteredData);
    }
  
    function initializeCardActions() {
        // Request Material button
        $(document).off('click.request', '.request-btn').on('click.request', '.request-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $btn = $(this);
            const materialData = {
                publishingId: $btn.data('id'),
                callNumber: $btn.data('callnumber'),
                title: $btn.data('title'),
                author: $btn.data('author'),
                type: $btn.data('type')
            };
  
            openBorrowingModal(materialData);
        });
  
        // View Details button
        $(document).off('click.details', '.view-details-btn').on('click.details', '.view-details-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const materialId = $(this).data('id');
            openMaterialDetails(materialId);
        });
  
        // Make entire card clickable (opens details modal)
        $(document).off('click.card', '.material-card').on('click.card', '.material-card', function (e) {
            if ($(e.target).closest('button').length) return; // Don't trigger if clicking a button
            
            const $card = $(this);
            const materialId = $card.find('.view-details-btn').data('id');
            if (materialId) {
                openMaterialDetails(materialId);
            }
        });
    }
  
    // ===== Borrowing Modal Functions =====
    function initializeBorrowingModal() {
        // Close modal handlers
        $(document).off('click.closeBorrowing', '.close-modal').on('click.closeBorrowing', '.close-modal', function () {
            closeBorrowingModal();
        });
  
        $(document).off('click.closeSuccess', '.close-success-modal').on('click.closeSuccess', '.close-success-modal', function () {
            $successModal.addClass('hidden');
        });
  
        // Submit handler
        $('#submitBorrowRequest').off('click.submitBorrow').on('click.submitBorrow', function () {
            submitBorrowRequest();
        });
  
        // Outside click handler
        $borrowingModal.off('click.modalOutside').on('click.modalOutside', function (e) {
            if (e.target === this) {
                closeBorrowingModal();
            }
        });
  
        // Enter key handler
        $(document).off('keydown.modal').on('keydown.modal', function (e) {
            if (e.key === 'Escape' && !$borrowingModal.hasClass('hidden')) {
                closeBorrowingModal();
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
  
        $borrowingModal.removeClass('hidden');
        $('#borrowRemarks').focus();
    }
  
    function closeBorrowingModal() {
        $borrowingModal.addClass('hidden');
        resetBorrowingForm();
    }
  
    function submitBorrowRequest() {
      if (isSubmitting) return;
      
      const formData = {
          publishing_id: $('#modalPublishingId').val(),
          call_number: $('#modalCallNumberInput').val(),
          borrow_remarks: $('#borrowRemarks').val().trim(),
          agree_terms: $('#agreeTerms').is(':checked') ? 1 : 0
      };
  
      // Validation
      if (!validateBorrowForm(formData)) return;
  
      const $submitBtn = $('#submitBorrowRequest');
      setSubmitButtonState($submitBtn, true, 'Submitting...');
  
      $.ajax({
          url: 'pages/request_borrowing.php',
          type: 'POST',
          data: formData,
          success: function (response) {
              try {
                  const result = typeof response === 'string' ? JSON.parse(response) : response;
                  console.log('Server Response:', result); // Debug log
  
                  if (result && result.success) {
                      handleBorrowSuccess();
                  } else {
                      // ✅ SHOW ACTUAL ERROR FROM SERVER
                      const errorMessage = result.error || 
                                         result.debug_error || 
                                         'Request failed. Please try again.';
                      handleBorrowError(errorMessage);
                  }
              } catch (e) {
                  console.error('Error parsing response:', e, response);
                  handleBorrowError('Error processing server response');
              }
          },
          error: function (xhr, status, error) {
              console.error('AJAX Error:', error, xhr.responseText);
              handleBorrowError('Network error. Please check your connection.');
          },
          complete: function() {
              setSubmitButtonState($submitBtn, false, 'Submit Request');
          }
      });
  }
  
  // Update your error handler to show detailed errors
  function handleBorrowError(message) {
      // Clear any previous messages
      $('#borrowErrorMessage').remove();
      
      // Create error message with better styling
      const errorHtml = `
          <div id="borrowErrorMessage" class="alert alert-danger alert-dismissible fade show mt-3" role="alert">
              <strong>Error:</strong> ${message}
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
      `;
      
      $('#borrowModal .modal-body').append(errorHtml);
      
      // Re-enable form
      isSubmitting = false;
  }
  
    function validateBorrowForm(formData) {
        if (!formData.borrow_remarks) {
            showAlert('Please provide the purpose of borrowing.', $('#borrowRemarks'));
            return false;
        }
        
        if (!formData.agree_terms) {
            showAlert('Please agree to the borrowing terms.', $('#agreeTerms'));
            return false;
        }
        
        return true;
    }
  
    function handleBorrowSuccess() {
        closeBorrowingModal();
        $successModal.removeClass('hidden');
        resetBorrowingForm();
  
        // Refresh materials after a short delay
        setTimeout(() => loadPublishedMaterials(), 1000);
    }
  
    function handleBorrowError(message) {
        showAlert(message);
        const $submitBtn = $('#submitBorrowRequest');
        setSubmitButtonState($submitBtn, false, 'Submit Request');
    }
  
    function resetBorrowingForm() {
        isSubmitting = false;
        $('#borrowingForm')[0]?.reset();
        setSubmitButtonState($('#submitBorrowRequest'), false, 'Submit Request');
    }
  
    function setSubmitButtonState($button, disabled, text) {
        $button.prop('disabled', disabled).text(text);
        isSubmitting = disabled;
    }
  
    // ===== Material Details Modal Functions =====
    function initializeDetailsModal() {
        // Close details modal
        $(document).off('click.closeDetails', '.close-details-modal').on('click.closeDetails', '.close-details-modal', function () {
            $materialDetailsModal.addClass('hidden');
        });
  
        // Request from details modal
        $('#requestFromDetails').off('click.requestFromDetails').on('click.requestFromDetails', function () {
            const materialData = {
                publishingId: $materialDetailsModal.data('publishingId'),
                callNumber: $materialDetailsModal.data('callNumber'),
                title: $materialDetailsModal.data('title'),
                author: $materialDetailsModal.data('author'),
                type: $materialDetailsModal.data('type')
            };
            
            $materialDetailsModal.addClass('hidden');
            openBorrowingModal(materialData);
        });
  
        // Outside click handler
        $materialDetailsModal.off('click.modalOutside').on('click.modalOutside', function (e) {
            if (e.target === this) {
                $(this).addClass('hidden');
            }
        });
  
        // Escape key handler
        $(document).off('keydown.detailsModal').on('keydown.detailsModal', function (e) {
            if (e.key === 'Escape' && !$materialDetailsModal.hasClass('hidden')) {
                $materialDetailsModal.addClass('hidden');
            }
        });
    }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    function openMaterialDetails(materialId) {
      // Find the material in our data
      const material = publishedMaterialsData.find(m => m.materialPublishing_id == materialId);
      
      if (!material) {
          alert('Material details not found.');
          return;
      }
  
      // Populate modal with material data
      $('#detailsTitle').text(material.title || material.materialName || '(Untitled)');
      $('#detailsAuthor').text(formatAuthor(material));
      $('#detailsDescription').text(material.materialDescription || 'No description available.');
      $('#detailsType').text(material.material_type || material.materialType_id || 'Not specified');
      $('#detailsCollege').text(material.college || material.deanCollege || 'Not specified');
      $('#detailsCallNumber').text(material.callNumber || 'Not assigned');
      $('#detailsDate').text(formatDate(material.submissionDate) || 'Not specified');
      
      const statusConfig = getStatusConfig(material.materialStatus);
      $('#detailsStatus').text(statusConfig.text).attr('class', `inline-block px-2 py-1 text-xs font-medium rounded-full ${statusConfig.class}`);
      
      $('#detailsAvailability').text(material.materialStatus === 'available' ? 'Available for borrowing' : 'Currently unavailable');
  
      // Store material data for request button
      $('#materialDetailsModal')
          .data('publishingId', material.materialPublishing_id)
          .data('callNumber', material.callNumber)
          .data('title', material.title || material.materialName)
          .data('author', formatAuthor(material))
          .data('type', material.material_type || material.materialType_id);
  
      // ALWAYS SHOW BUTTON FOR TESTING
      const $requestBtn = $('#requestFromDetails');
      $requestBtn.show().prop('disabled', false);
      $requestBtn.removeClass('hidden');
  
      $('#materialDetailsModal').removeClass('hidden');
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
    // ===== Helper Functions =====
    function formatAuthor(material) {
        if (material.author) return material.author;
        return `${material.author_lastname || ''}, ${material.author_firstname || ''}`.trim() || "Unknown Author";
    }
  
    function formatDate(dateString) {
        if (!dateString || dateString === '0000-00-00 00:00:00' || dateString === '0000-00-00') return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateString;
        }
    }
  
    function getStatusConfig(status) {
        const statusMap = {
            'available': { class: 'text-green-600 bg-green-100', text: 'Available' },
            'borrowed': { class: 'text-yellow-600 bg-yellow-100', text: 'Borrowed' },
            'maintenance': { class: 'text-red-600 bg-red-100', text: 'Maintenance' },
            'requested': { class: 'text-blue-600 bg-blue-100', text: 'Requested' }
        };
  
        return statusMap[status.toLowerCase()] || { class: 'text-gray-600 bg-gray-100', text: status };
    }
  
    function truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text || 'No description available.';
        return text.substring(0, maxLength) + '...';
    }
  
    function showAlert(message, $focusElement = null) {
        alert(message);
        if ($focusElement) $focusElement.focus();
    }
  
    function showEmptyState() {
        $materialsGrid.html(`
            <div class="col-span-full py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-book-open text-gray-400 text-xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                <p class="text-gray-500">No published materials match your current filters.</p>
            </div>
        `);
    }
  
    function showErrorMessage(message) {
        $materialsGrid.html(`
            <div class="col-span-full py-12 text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Unable to load materials</h3>
                <p class="text-gray-500 mb-4">${message}</p>
                <button class="retry-btn px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Try Again
                </button>
            </div>
        `);
  
        $('.retry-btn').on('click', loadPublishedMaterials);
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