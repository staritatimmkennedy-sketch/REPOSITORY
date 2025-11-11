$(document).ready(function () {
    // -----------------------------------------------------------------
    // Variables
    // -----------------------------------------------------------------
    const modal = $("#materialTypeModal");
    const tbody = $("#materialTypesTbody");
    let materialTypesData = [];
    let isProcessing = false;
    let currentMaterialTypeId = null;
  
    // -----------------------------------------------------------------
    // Error Modal System (consistent with existing)
    // -----------------------------------------------------------------
    function showErrorModal(title, message) {
      if (!$('#errorModal').length) {
        $('body').append(`
          <div id="errorModal" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <div class="flex items-center mb-4">
                <div class="bg-red-100 p-2 rounded-full mr-3">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-red-600" id="errorTitle">Error</h3>
              </div>
              <p class="text-sm text-gray-500 mb-4" id="errorMessage"></p>
              <div class="flex justify-end">
                <button class="w-full bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 focus:outline-none close-error-modal">
                  OK
                </button>
              </div>
            </div>
          </div>
        `);
  
        $(document).on('click', '.close-error-modal', function() {
          $('#errorModal').addClass('hidden');
        });
  
        $(document).on('click.errorModal', function(e) {
          if ($(e.target).is('#errorModal')) {
            $('#errorModal').addClass('hidden');
          }
        });
      }
  
      $('#errorTitle').text(title);
      $('#errorMessage').text(message);
      $('#errorModal').removeClass('hidden');
    }
  
    function showSuccessModal(title, message) {
      if (!$('#successModal').length) {
        $('body').append(`
          <div id="successModal" class="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
              <div class="flex items-center mb-4">
                <div class="bg-green-100 p-2 rounded-full mr-3">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-green-600" id="successTitle">Success</h3>
              </div>
              <p class="text-sm text-gray-500 mb-4" id="successMessage"></p>
              <div class="flex justify-end">
                <button class="w-full bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 focus:outline-none close-success-modal">
                  OK
                </button>
              </div>
            </div>
          </div>
        `);
  
        $(document).on('click', '.close-success-modal', function() {
          $('#successModal').addClass('hidden');
        });
  
        $(document).on('click.successModal', function(e) {
          if ($(e.target).is('#successModal')) {
            $('#successModal').addClass('hidden');
          }
        });
      }
  
      $('#successTitle').text(title);
      $('#successMessage').text(message);
      $('#successModal').removeClass('hidden');
    }
  
    // -----------------------------------------------------------------
    // Load Material Types - FIXED URL
    // -----------------------------------------------------------------
    function loadMaterialTypes() {
      console.log('🔄 Loading material types...');
      tbody.html(
        `<tr><td colspan="4" class="text-center py-4 text-gray-500">Loading material types...</td></tr>`
      );
  
      $.ajax({
        url: "pages/get_material_type.php", // ✅ FIXED: Changed to plural
        type: "GET",
        cache: false,
        dataType: "json",
        success: function (response) {
          console.log("✅ Full API Response:", response);
          
          if (response && response.success) {
            materialTypesData = response.data || [];
            console.log("📊 Material types data:", materialTypesData);
            console.log("📈 Number of items:", materialTypesData.length);
            renderMaterialTypes(materialTypesData);
            initializeSearch();
          } else {
            const errorMsg = response?.error || 'Failed to load material types';
            console.error("❌ API Error:", errorMsg);
            showErrorModal('Load Failed', errorMsg);
            tbody.html(
              `<tr><td colspan="4" class="text-center text-red-600 py-4">${errorMsg}</td></tr>`
            );
          }
        },
        error: function (xhr, status, err) {
          console.error("❌ AJAX Error - Status:", status, "Error:", err);
          console.error("📨 Response Text:", xhr.responseText);
          
          let msg = "Error loading material types";
          if (xhr.status === 0) {
            msg = "Network error - cannot connect to server. Check if the PHP file exists.";
          } else if (xhr.responseText) {
            try {
              const errObj = JSON.parse(xhr.responseText);
              msg = errObj.error || xhr.responseText;
            } catch (e) {
              msg = "Server error: " + xhr.responseText.substring(0, 100);
            }
          }
          
          showErrorModal('Load Failed', msg);
          tbody.html(
            `<tr><td colspan="4" class="text-center text-red-600 py-4">${msg}</td></tr>`
          );
        }
      });
    }
  
    // -----------------------------------------------------------------
    // Render Material Types Table
    // -----------------------------------------------------------------
    function renderMaterialTypes(data) {
      console.log("🎨 Rendering data:", data);
      tbody.empty();
  
      if (!data || data.length === 0) {
        console.log("ℹ️ No data to render");
        tbody.append(
          `<tr><td colspan="4" class="text-center py-8 text-gray-500">No material types found.</td></tr>`
        );
        return;
      }
  
      data.forEach(function (item, index) {
        console.log(`📝 Processing item ${index}:`, item);
        
        const row = `
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">${escapeHtml(item.materialType_id || 'N/A')}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.materialTypeName || 'No name')}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(item.materialTypeDescription || 'No description')}</td>
            <td class="px-4 py-3 text-center">
              <div class="relative inline-block text-left">
                <button class="manage-btn px-3 py-1 bg-gray-200 border border-gray-400 text-xs rounded hover:bg-gray-300 transition-colors">
                  Manage
                </button>
                <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <a href="#" class="edit-material-type block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" 
                     data-id="${escapeHtml(item.materialType_id)}">Edit Type</a>
                  <a href="#" class="delete-material-type block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                     data-id="${escapeHtml(item.materialType_id)}">Remove Type</a>
                </div>
              </div>
            </td>
          </tr>`;
        tbody.append(row);
      });
  
      console.log("✅ Table rendered successfully");
      initializeDropdowns();
      initializeRowActions();
    }
  
    // -----------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------
    function escapeHtml(unsafe) {
      if (unsafe === null || unsafe === undefined) return "";
      return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    // -----------------------------------------------------------------
    // Dropdowns
    // -----------------------------------------------------------------
    function initializeDropdowns() {
      // Close dropdowns when clicking outside
      $(document).off("click.materialTypesManage").on("click.materialTypesManage", function (e) {
        if (!$(e.target).closest(".relative").length) {
          $(".dropdown-menu").addClass("hidden");
        }
      });
  
      // Manage button toggle
      $(document).off("click.materialTypesBtn").on("click.materialTypesBtn", ".manage-btn", function (e) {
        e.stopPropagation();
        const $menu = $(this).siblings(".dropdown-menu");
        $(".dropdown-menu").not($menu).addClass("hidden");
        $menu.toggleClass("hidden");
      });
    }
  
    // -----------------------------------------------------------------
    // Search Functionality
    // -----------------------------------------------------------------
    function initializeSearch() {
      $("#searchMaterialTypes").off("input").on("input", function () {
        filterMaterialTypes();
      });
    }
  
    function filterMaterialTypes() {
      const term = $("#searchMaterialTypes").val().toLowerCase().trim();
      
      if (!materialTypesData.length) return;
  
      if (!term) {
        renderMaterialTypes(materialTypesData);
        return;
      }
  
      const filtered = materialTypesData.filter((item) => {
        const id = (item.materialType_id || "").toLowerCase();
        const name = (item.materialTypeName || "").toLowerCase();
        const description = (item.materialTypeDescription || "").toLowerCase();
  
        return id.includes(term) || 
               name.includes(term) || 
               description.includes(term);
      });
  
      renderMaterialTypes(filtered);
    }

    // -----------------------------------------------------------------
    // Modal Management - CORRECTED VERSION
    // -----------------------------------------------------------------
    function openModal(action, materialType = null) {
        currentMaterialTypeId = materialType ? materialType.materialType_id : null;
        
        const $title = $("#materialTypeModalTitle");
        const $form = $("#materialTypeForm");
        const $submitBtn = $("#submitMaterialType");
        const $idField = $("#materialTypeId");
        const $hiddenIdField = $("#materialTypeIdHidden");
        
        $form[0].reset();
        
        if (action === 'add') {
            $title.text("Add Material Type");
            $submitBtn.text("Add Material Type");
            $submitBtn.removeClass("bg-blue-600 hover:bg-blue-700").addClass("bg-green-600 hover:bg-green-700");
            $idField.prop('readonly', false).removeClass('bg-gray-100');
            $hiddenIdField.val(''); // Clear hidden field
        } else if (action === 'edit' && materialType) {
            $title.text("Edit Material Type");
            $submitBtn.text("Save Changes");
            $submitBtn.removeClass("bg-green-600 hover:bg-green-700").addClass("bg-blue-600 hover:bg-blue-700");
            
            // Populate form - CORRECTED: Use hidden field for ID, visible field is readonly
            $hiddenIdField.val(materialType.materialType_id);
            $idField.val(materialType.materialType_id).prop('readonly', true).addClass('bg-gray-100');
            $("#materialTypeName").val(materialType.materialTypeName);
            $("#materialTypeDescription").val(materialType.materialTypeDescription || '');
        }
        
        modal.removeClass("hidden");
        $(".dropdown-menu").addClass("hidden");
    }
  
    // -----------------------------------------------------------------
    // Row Actions (Edit/Remove)
    // -----------------------------------------------------------------
    function initializeRowActions() {
        // Add Material Type
        $("#addMaterialTypeBtn").off("click").on("click", function () {
            openModal('add');
        });

        // Edit Material Type
        $(document).off("click.editMaterialType").on("click.editMaterialType", ".edit-material-type", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("✏️ Editing material type ID:", id);
            
            const materialType = materialTypesData.find(item => item.materialType_id == id);
            if (!materialType) {
                showErrorModal("Material Type Not Found", "The selected material type could not be found.");
                return;
            }

            openModal('edit', materialType);
        });

        // Remove Material Type
        $(document).off("click.deleteMaterialType").on("click.deleteMaterialType", ".delete-material-type", function (e) {
            e.preventDefault();
            const id = $(this).data("id");
            console.log("🗑️ Deleting material type ID:", id);
            
            const materialType = materialTypesData.find(item => item.materialType_id == id);
            if (!materialType) {
                showErrorModal("Material Type Not Found", "The selected material type could not be found.");
                return;
            }

            if (confirm(`Are you sure you want to remove "${materialType.materialTypeName}"?\n\nThis action cannot be undone.`)) {
                deleteMaterialType(id, materialType.materialTypeName);
            }
            
            $(".dropdown-menu").addClass("hidden");
        });

        // Form Submission - CORRECTED VERSION
        $("#materialTypeForm").off("submit").on("submit", function (e) {
            e.preventDefault();
            
            if (isProcessing) {
                console.log("⏳ Already processing, skipping...");
                return;
            }
            
            isProcessing = true;

            const $btn = $("#submitMaterialType");
            const btnText = $btn.text();
            $btn.prop("disabled", true).text("Processing...");

            // CORRECTED: Get ID from the visible field for new entries, from hidden field for edits
            const materialTypeId = currentMaterialTypeId ? $("#materialTypeIdHidden").val().trim() : $("#materialTypeId").val().trim();
            
            const formData = {
                materialTypeId: materialTypeId,
                materialTypeName: $("#materialTypeName").val().trim(),
                materialTypeDescription: $("#materialTypeDescription").val().trim()
            };

            console.log("📤 Form data:", formData);

            // Validation
            if (!formData.materialTypeId) {
                showErrorModal("Validation Error", "Material Type ID is required.");
                isProcessing = false;
                $btn.prop("disabled", false).text(btnText);
                return;
            }
            
            if (!formData.materialTypeName) {
                showErrorModal("Validation Error", "Material Type Name is required.");
                isProcessing = false;
                $btn.prop("disabled", false).text(btnText);
                return;
            }

            const isEdit = currentMaterialTypeId !== null;
            const url = isEdit ? 'pages/update_material_type.php' : 'pages/add_material_type.php';

            console.log(`🔄 ${isEdit ? 'Updating' : 'Adding'} material type via:`, url);

            $.ajax({
                url: url,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function (response) {
                    console.log("✅ Server response:", response);
                    try {
                        const result = typeof response === 'string' ? JSON.parse(response) : response;
                        if (result.success || result.rowcount > 0) {
                            modal.addClass('hidden');
                            showSuccessModal(
                                isEdit ? 'Material Type Updated' : 'Material Type Added',
                                isEdit ? 'Material type has been updated successfully.' : 'Material type has been added successfully.'
                            );
                            loadMaterialTypes(); // Refresh the list
                        } else {
                            showErrorModal(
                                isEdit ? 'Update Failed' : 'Add Failed',
                                result.error || result.message || (isEdit ? 'Failed to update material type' : 'Failed to add material type')
                            );
                        }
                    } catch (e) {
                        console.error("❌ JSON Parse Error:", e);
                        showErrorModal('Processing Error', 'Error processing server response: ' + e.message);
                    }
                },
                error: function (xhr, status, error) {
                    console.error("❌ AJAX Error:", error);
                    showErrorModal(
                        isEdit ? 'Update Failed' : 'Add Failed',
                        `Error ${isEdit ? 'updating' : 'adding'} material type: ${error}`
                    );
                },
                complete: function () {
                    isProcessing = false;
                    $btn.prop("disabled", false).text(btnText);
                }
            });
        });

        // Modal Close Handlers
        $("#closeMaterialTypeModal").off("click").on("click", function () {
            modal.addClass('hidden');
        });

        $(document).on('click', function (e) {
            if ($(e.target).is('#materialTypeModal')) {
                modal.addClass('hidden');
            }
        });
    }
  
    // -----------------------------------------------------------------
    // Delete Material Type
    // -----------------------------------------------------------------
    function deleteMaterialType(id, name = '') {
        if (isProcessing) return;
        isProcessing = true;

        console.log("🗑️ Sending delete request for ID:", id);

        $.ajax({
            url: 'pages/delete_material_type.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ materialTypeId: id }),
            success: function (response) {
                console.log("✅ Delete response:", response);
                try {
                    const result = typeof response === 'string' ? JSON.parse(response) : response;
                    if (result.success || result.rowcount > 0) {
                        showSuccessModal(
                            'Material Type Removed', 
                            `"${name}" has been removed successfully.`
                        );
                        loadMaterialTypes(); // Refresh the list
                    } else {
                        showErrorModal(
                            'Removal Failed', 
                            result.error || result.message || 'Failed to remove material type'
                        );
                    }
                } catch (e) {
                    console.error("❌ JSON Parse Error:", e);
                    showErrorModal('Processing Error', 'Error processing server response');
                }
            },
            error: function (xhr, status, error) {
                console.error("❌ Delete AJAX Error:", error);
                showErrorModal('Removal Failed', 'Error removing material type: ' + error);
            },
            complete: function () {
                isProcessing = false;
            }
        });
    }
  
    // -----------------------------------------------------------------
    // Initialization
    // -----------------------------------------------------------------
    function initializePage() {
        console.log("🚀 Initializing Material Types page...");
        console.log("📊 jQuery version:", $.fn.jquery);
        console.log("🎯 Table body element:", tbody.length ? "Found" : "Not found");
        console.log("🔍 Search input:", $("#searchMaterialTypes").length ? "Found" : "Not found");
        console.log("➕ Add button:", $("#addMaterialTypeBtn").length ? "Found" : "Not found");
        
        loadMaterialTypes();
    }
  
    // -----------------------------------------------------------------
    // Kick-off
    // -----------------------------------------------------------------
    initializePage();
});