$(document).ready(function () {
  // -----------------------------------------------------------------
  // Variables
  // -----------------------------------------------------------------
  const modal = $("#submitModal");
  const tbody = $("#submissionsTbody");
  let submissionsData = []; // for filtering
  let isSubmitting = false; // prevent double-submit

  // -----------------------------------------------------------------
  // Error Modal System
  // -----------------------------------------------------------------
  function showErrorModal(title, message) {
    // Create error modal if it doesn't exist
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

      // Add close handlers for error modal
      $(document).on('click', '.close-error-modal', function() {
        $('#errorModal').addClass('hidden');
      });

      // fixed stray 'd' typo here and use namespaced event to avoid duplicates
      $(document).on('click.errorModal', function(e) {
        if ($(e.target).is('#errorModal')) {
          $('#errorModal').addClass('hidden');
        }
      });
    }

    // Set content and show modal
    $('#errorTitle').text(title);
    $('#errorMessage').text(message);
    $('#errorModal').removeClass('hidden');
  }

  // Helper function to show success modal
  function showSuccessModal(title, message) {
    $('#successTitle').text(title);
    $('#successMessage').text(message);
    $('#successModal').removeClass('hidden');
  }

  // -----------------------------------------------------------------
  // Modal open / close
  // -----------------------------------------------------------------
  $("#openSubmitModal").on("click", function () {
    modal.removeClass("hidden");
    $("#submitMsg").empty();
    $("#submitForm")[0].reset();
  });

  $("#closeModal").on("click", function () {
    modal.addClass("hidden");
    $("#submitMsg").empty();
  });

  $(document).on("click", function (e) {
    if ($(e.target).is("#submitModal")) {
      modal.addClass("hidden");
      $("#submitMsg").empty();
    }
  });

  // -----------------------------------------------------------------
  // PDF Validation Helper
  // -----------------------------------------------------------------
  function validatePDF(file, maxSizeMB = 10) {
    if (!file) {
      showErrorModal('No File Selected', 'Please upload a PDF file before submitting.');
      return false;
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    // Accept both correct mime and extension — both must match to be safe
    if (!(fileName.endsWith('.pdf') && fileType === 'application/pdf')) {
      showErrorModal('Invalid File Type', 'Only PDF files are allowed. Please upload a valid PDF document.');
      return false;
    }

    // Optional size limit
    if (file.size > maxSizeMB * 1024 * 1024) {
      showErrorModal('File Too Large', `File exceeds ${maxSizeMB} MB limit. Please upload a smaller PDF.`);
      return false;
    }

    return true;
  }

  // -----------------------------------------------------------------
  // Submit form (upload) — with PDF check
  // -----------------------------------------------------------------
  $("#submitForm").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate file before proceeding
    const fileInput = $('#materialFile')[0];
    if (!fileInput || fileInput.files.length === 0) {
      showErrorModal('Missing File', 'Please upload a PDF file before submitting.');
      return;
    }
    if (!validatePDF(fileInput.files[0])) return;

    const $btn = $(this).find('button[type="submit"]');
    const btnText = $btn.text();

    isSubmitting = true;
    $btn.prop("disabled", true).text("Submitting...");
    $("#submitMsg").html("<p class='text-blue-600'>Submitting material...</p>");

    const formData = new FormData(this);

    $.ajax({
      url: "pages/submitMaterial.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log("Submission response:", response);
        try {
          const result = typeof response === "string" ? JSON.parse(response) : response;
          if (result.success || result.message) {
            $("#submitMsg").html(
              `<p class='text-green-600'>${result.message || "Material submitted successfully!"}</p>`
            );
            $("#submitForm")[0].reset();
            setTimeout(() => {
              modal.addClass("hidden");
              loadSubmissions();
            }, 2000);
          } else {
            $("#submitMsg").html(
              `<p class='text-red-600'>${result.error || "Submission failed!"}</p>`
            );
          }
        } catch (e) {
          // old scripts may return plain text – treat as success
          $("#submitMsg").html("<p class='text-green-600'>Material submitted successfully!</p>");
          $("#submitForm")[0].reset();
          setTimeout(() => {
            modal.addClass("hidden");
            loadSubmissions();
          }, 2000);
        }
      },
      error: function (xhr, status, err) {
        console.error("Submission error:", err, xhr.responseText);
        $("#submitMsg").html("<p class='text-red-600'>Submission failed. Please try again.</p>");
      },
      complete: function () {
        isSubmitting = false;
        $btn.prop("disabled", false).text(btnText);
      },
    });
  });

  // -----------------------------------------------------------------
  // Load submissions – **ABSOLUTE URL** (no relative-path issues)
  // -----------------------------------------------------------------
  function loadSubmissions() {
    tbody.html(
      `<tr><td colspan="8" class="text-center py-4 text-gray-500">Loading submissions...</td></tr>`
    );

    $.ajax({
      url: "/ethanTwo/pages/get_user_submission.php",   // <-- absolute path
      type: "GET",
      cache: false,                                 // prevent stale cache
      dataType: "json",
      success: function (data) {
        console.log("Submissions data received:", data);
        submissionsData = data || [];
        renderSubmissions(submissionsData);
        initializeFilters();
      },
      error: function (xhr, status, err) {
        console.error("AJAX Error:", err, xhr.responseText);
        let msg = "Error loading data";
        if (xhr.responseText) {
          try {
            const errObj = JSON.parse(xhr.responseText);
            msg += ": " + (errObj.error || xhr.responseText);
          } catch (e) {
            msg += ": " + xhr.responseText.substring(0, 200);
          }
        } else {
          msg += ": Empty response from server";
        }
        showErrorModal('Load Failed', msg);
        tbody.html(
          `<tr><td colspan="8" class="text-center text-red-600 py-4">${msg}</td></tr>`
        );
      },
    });
  }

  // -----------------------------------------------------------------
  // Render table rows
  // -----------------------------------------------------------------
  function renderSubmissions(data) {
    tbody.empty();

    if (!data || data.length === 0) {
      tbody.append(
        `<tr><td colspan="9" class="text-center py-4 text-gray-500">No submissions found.</td></tr>` // ✅ Changed colspan to 9
      );
      return;
    }

    data.forEach(function (item) {
      const authorFull = formatAuthorName(item);
      // ✅ UPDATED: Use new status fields
      const deanStatus = item.deanApprovalStatus || "Pending";
      const librarianStatus = item.librarianPublishingStatus || "Not Published";
      
      const deanStatusColor = getDeanStatusColor(deanStatus);
      const librarianStatusColor = getLibrarianStatusColor(librarianStatus);
      
      const fileName = item.materialFile ? item.materialFile.split("/").pop() : "file";
      const materialType = item.materialType_id || item.material_type || "Unknown";

      const row = `
        <tr class="border-b hover:bg-gray-50"
            data-title="${escapeHtml(item.materialName || "")}"
            data-author="${escapeHtml(authorFull)}"
            data-type="${escapeHtml(materialType)}"
            data-dean-status="${escapeHtml(deanStatus)}"
            data-librarian-status="${escapeHtml(librarianStatus)}">
          <td class="px-4 py-3 text-sm">${escapeHtml(item.materialName || "")}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(materialType)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(item.materialDescription || "")}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(authorFull)}</td>
          <td class="px-4 py-3 text-sm">${escapeHtml(formatDate(item.submissionDate))}</td>
          <td class="px-4 py-3 text-sm">
            ${item.materialFile
              ? `<a href="view_file.php?file=${encodeURIComponent(item.materialFile)}"
                     class="text-blue-600 hover:text-blue-800 underline" target="_blank">
                     ${escapeHtml(fileName)}</a>`
              : '<span class="text-gray-500">No file</span>'}
          </td>
          <!-- ✅ UPDATED: Dean's Approval Status -->
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${deanStatusColor} rounded-full">
              ${escapeHtml(deanStatus)}
            </span>
          </td>
          <!-- ✅ UPDATED: Librarian's Publishing Status -->
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border ${librarianStatusColor} rounded-full">
              ${escapeHtml(librarianStatus)}
            </span>
          </td>
         <td class="px-4 py-3 text-center">
  <div class="relative inline-block text-left">
    <button class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none"
            data-submission='${escapeHtml(JSON.stringify(item))}'>
      Manage ▾
    </button>
    <div class="dropdown-menu hidden absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
      <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200 edit-submission"
         data-id="${item.submission_id || ""}">Edit Submission</a>
      <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 remove-submission min-w-[180px]"
         data-id="${item.submission_id || ""}">Remove Submission</a>
    </div>
  </div>
</td>
        </tr>`;
      tbody.append(row);
    });

    initializeDropdowns();
    initializeRowActions();
  }

  // -----------------------------------------------------------------
  // Helpers
  // -----------------------------------------------------------------
  function formatAuthorName(item) {
    const last = item.author_lastname || item.authorLast || "";
    const first = item.author_firstname || item.authorFirst || "";
    const mi = item.author_mi || item.authorMI || "";
    let full = `${last}, ${first}`;
    if (mi) full += ` ${mi}.`;
    return full.trim();
  }

  function formatDate(dateString) {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  }

  function getDeanStatusColor(status) {
    const colors = {
      Pending: "w-[84px] border-yellow-400 bg-yellow-100 text-yellow-700", // 21 * 4px = 84px
      Approved: "w-[84px] border-green-500 bg-green-100 text-green-700",
      Denied: "w-[84px] border-red-500 bg-red-100 text-red-700",
      Rejected: "w-[84px] border-red-500 bg-red-100 text-red-700"
    };
    return colors[status] || "w-[84px] border-gray-300 bg-gray-100 text-gray-700";
  }


  function getLibrarianStatusColor(status) {
    if (status === 'Published') return 'w-[84px] border-blue-500 bg-blue-100 text-blue-700';
    if (status === 'Not Published') return 'border-orange-500 bg-orange-100 text-orange-700';
    if (status === 'Pending') return 'border-yellow-400 bg-yellow-100 text-yellow-700';
    return 'border-gray-500 bg-gray-100 text-gray-700';
  }










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
    // Close dropdowns when clicking outside (namespaced to avoid duplicates)
    $(document).off("click.manage").on("click.manage", function (e) {
      if (!$(e.target).closest(".relative").length) {
        $(".dropdown-menu").addClass("hidden");
      }
    });

    // Manage button toggle (delegated with namespaced handler)
    $(document).off("click.manageBtn").on("click.manageBtn", ".manage-btn", function (e) {
      e.stopPropagation();
      const $menu = $(this).siblings(".dropdown-menu");
      $(".dropdown-menu").not($menu).addClass("hidden");
      $menu.toggleClass("hidden");
    });
  }

  // -----------------------------------------------------------------
  // Row actions (edit / remove)
  // -----------------------------------------------------------------
  function initializeRowActions() {
    let currentSubmissionId = null;

    // Edit Submission
    $(document).off("click.editSubmission").on("click.editSubmission", ".edit-submission", function (e) {
      e.preventDefault();
      const id = $(this).data("id");
      currentSubmissionId = id;
      
      // Find the submission data
      const submission = submissionsData.find(item => item.submission_id == id);
      if (!submission) {
        showErrorModal("Submission Not Found", "The selected submission could not be found.");
        return;
      }

      // Check if editing is allowed
      if (submission.deanApprovalStatus !== 'Pending' && submission.deanApprovalStatus !== 'Rejected') {
        showErrorModal(
          "Editing Not Allowed", 
          "This submission cannot be edited because it has already been approved or published. " +
          "Only submissions with 'Pending' or 'Rejected' status can be modified."
        );
        return;
      }

      // Populate edit form
      $('#editSubmissionId').val(id);
      $('#editTitle').val(submission.materialName || '');
      $('#editDescription').val(submission.materialDescription || '');
      $('#editAuthorLast').val(submission.author_lastname || '');
      $('#editAuthorFirst').val(submission.author_firstname || '');
      $('#editAuthorMI').val(submission.author_mi || '');
      $('#editMaterialType').val(submission.materialType_id || '');
      
      // Show edit modal
      $('#editModal').removeClass('hidden');
      $('.dropdown-menu').addClass('hidden');
    });

    // Remove Submission
    $(document).off("click.removeSubmission").on("click.removeSubmission", ".remove-submission", function (e) {
      e.preventDefault();
      const id = $(this).data("id");
      currentSubmissionId = id;
      
      // Find the submission data
      const submission = submissionsData.find(item => item.submission_id == id);
      if (!submission) {
        showErrorModal("Submission Not Found", "The selected submission could not be found.");
        return;
      }

      // Check if removal is allowed
      if (submission.deanApprovalStatus !== 'Pending' && submission.deanApprovalStatus !== 'Rejected') {
        showErrorModal(
          "Removal Not Allowed", 
          "This submission cannot be removed because it has already been approved or published. " +
          "Only submissions with 'Pending' or 'Rejected' status can be removed."
        );
        return;
      }

      // Show remove confirmation modal
      $('#removeModal').removeClass('hidden');
      $('.dropdown-menu').addClass('hidden');
    });

    // Edit Form Submission
    $('#editForm').off('submit').on('submit', function (e) {
      e.preventDefault();
      const submissionId = $('#editSubmissionId').val();
      
      if (!submissionId) {
        showErrorModal("Submission ID Missing", "Submission ID is required to update the submission.");
        return;
      }

      // Validate file type before submitting (if file selected)
      const editFileInput = $('#editMaterialFile')[0];
      if (editFileInput && editFileInput.files.length > 0) {
        const file = editFileInput.files[0];
        if (!validatePDF(file)) return;
      }

      const formData = new FormData();
      formData.append('submission_id', submissionId);
      formData.append('materialName', $('#editTitle').val());
      formData.append('materialDescription', $('#editDescription').val());
      formData.append('author_lastname', $('#editAuthorLast').val());
      formData.append('author_firstname', $('#editAuthorFirst').val());
      formData.append('author_mi', $('#editAuthorMI').val());
      formData.append('materialType_id', $('#editMaterialType').val());
      
      // Add file if selected
      if (editFileInput && editFileInput.files.length > 0) {
        formData.append('materialFile', editFileInput.files[0]);
      }

      // Submit edit request
      $.ajax({
        url: 'pages/edit_submission.php',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (response) {
          try {
            const result = typeof response === 'string' ? JSON.parse(response) : response;
            if (result.success) {
              $('#editModal').addClass('hidden');
              showSuccessModal('Submission Updated', 'Your submission has been updated successfully.');
              loadSubmissions(); // Refresh the list
            } else {
              showErrorModal('Update Failed', result.error || 'Failed to update submission');
            }
          } catch (e) {
            showErrorModal('Processing Error', 'Error processing server response');
          }
        },
        error: function (xhr, status, error) {
          showErrorModal('Update Failed', 'Error updating submission: ' + error);
        }
      });
    });

    // Confirm Remove
    $('#confirmRemove').off('click').on('click', function () {
      if (!currentSubmissionId) {
        showErrorModal("Submission ID Missing", "No submission selected for removal.");
        return;
      }

      $.ajax({
        url: 'pages/remove_submission.php',
        type: 'POST',
        data: { submission_id: currentSubmissionId },
        success: function (response) {
          try {
            const result = typeof response === 'string' ? JSON.parse(response) : response;
            if (result.success) {
              $('#removeModal').addClass('hidden');
              showSuccessModal('Submission Removed', 'Your submission has been removed successfully.');
              loadSubmissions(); // Refresh the list
            } else {
              showErrorModal('Removal Failed', result.error || 'Failed to remove submission');
            }
          } catch (e) {
            showErrorModal('Processing Error', 'Error processing server response');
          }
        },
        error: function (xhr, status, error) {
          showErrorModal('Removal Failed', 'Error removing submission: ' + error);
        }
      });
    });

    // Modal Close Handlers
    $('.close-edit-modal').off('click').on('click', function () {
      $('#editModal').addClass('hidden');
    });

    $('.close-remove-modal').off('click').on('click', function () {
      $('#removeModal').addClass('hidden');
    });

    $('.close-success-modal').off('click').on('click', function () {
      $('#successModal').addClass('hidden');
    });

    // Close modals when clicking outside
    $(document).on('click', function (e) {
      if ($(e.target).is('#editModal')) {
        $('#editModal').addClass('hidden');
      }
      if ($(e.target).is('#removeModal')) {
        $('#removeModal').addClass('hidden');
      }
      if ($(e.target).is('#successModal')) {
        $('#successModal').addClass('hidden');
      }
      if ($(e.target).is('#errorModal')) {
        $('#errorModal').addClass('hidden');
      }
    });
  }

  // -----------------------------------------------------------------
  // Filters
  // -----------------------------------------------------------------
  function initializeFilters() {
    $("#searchInput, #typeFilter, #statusFilter")
      .off("input change")
      .on("input change", filterTable);
  }

  function filterTable() {
    const term = $("#searchInput").val().toLowerCase();
    const type = $("#typeFilter").val();
    const status = $("#statusFilter").val();
  
    if (!submissionsData.length) return;
  
    const filtered = submissionsData.filter((item) => {
      const author = formatAuthorName(item).toLowerCase();
      const title = (item.materialName || "").toLowerCase();
      const matType = item.materialType_id || item.material_type || "";
      // ✅ UPDATED: Check both status fields for filtering
      const deanStatus = item.deanApprovalStatus || "";
      const librarianStatus = item.librarianPublishingStatus || "";
  
      const matchSearch = !term || title.includes(term) || author.includes(term);
      const matchType = !type || matType === type;
      // ✅ UPDATED: Filter by either dean or librarian status
      const matchStatus = !status || deanStatus === status || librarianStatus === status;
  
      return matchSearch && matchType && matchStatus;
    });
  
    renderSubmissions(filtered);
  }

  // -----------------------------------------------------------------
  // Kick-off
  // -----------------------------------------------------------------
  loadSubmissions();
});
