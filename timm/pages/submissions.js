$(document).ready(function () {
  // -----------------------------------------------------------------
  // Variables
  // -----------------------------------------------------------------
  const modal = $("#submitModal");
  const tbody = $("#submissionsTbody");
  let submissionsData = []; // for filtering
  let isSubmitting = false; // prevent double-submit

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
  // Submit form (upload)
  // -----------------------------------------------------------------
  $("#submitForm").off("submit").on("submit", function (e) {
    e.preventDefault();
    if (isSubmitting) return;

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
      url: "/ethan/pages/get_user_submission.php",   // <-- absolute path
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
        `<tr><td colspan="8" class="text-center py-4 text-gray-500">No submissions found.</td></tr>`
      );
      return;
    }

    data.forEach(function (item) {
      const authorFull = formatAuthorName(item);
      const statusColor = getStatusColor(item.approvalStatus);
      const fileName = item.materialFile ? item.materialFile.split("/").pop() : "file";
      const materialType = item.materialType_id || item.material_type || "Unknown";

      const row = `
        <tr class="border-b hover:bg-gray-50"
            data-title="${escapeHtml(item.materialName || "")}"
            data-author="${escapeHtml(authorFull)}"
            data-type="${escapeHtml(materialType)}"
            data-status="${escapeHtml(item.approvalStatus || "")}">
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
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border ${statusColor} rounded-full">
              ${escapeHtml(item.approvalStatus || "Unknown")}
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="manage-btn w-22 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
                Manage
              </button>
              <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 edit-submission"
                   data-id="${item.submission_id || ""}">Edit Submission</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 remove-submission"
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

  function getStatusColor(status) {
    const colors = {
      Pending: "border-yellow-400 bg-yellow-100 text-yellow-700",
      Approved: "border-green-500 bg-green-100 text-green-700",
      Published: "border-blue-500 bg-blue-100 text-blue-700",
      Denied: "border-red-500 bg-red-100 text-red-700",
    };
    return colors[status] || "border-gray-300 bg-gray-100 text-gray-700";
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
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".relative").length) {
        $(".dropdown-menu").addClass("hidden");
      }
    });

    $(document).off("click", ".manage-btn").on("click", ".manage-btn", function (e) {
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
    $(document).off("click", ".edit-submission").on("click", ".edit-submission", function (e) {
      e.preventDefault();
      const id = $(this).data("id");
      alert(`Edit submission ${id} – functionality to be implemented`);
    });

    $(document).off("click", ".remove-submission").on("click", ".remove-submission", function (e) {
      e.preventDefault();
      const id = $(this).data("id");
      if (confirm("Are you sure you want to remove this submission?")) {
        alert(`Remove submission ${id} – functionality to be implemented`);
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
      const matStatus = item.approvalStatus || "";

      const matchSearch = !term || title.includes(term) || author.includes(term);
      const matchType = !type || matType === type;
      const matchStatus = !status || matStatus === status;

      return matchSearch && matchType && matchStatus;
    });

    renderSubmissions(filtered);
  }

  // -----------------------------------------------------------------
  // Kick-off
  // -----------------------------------------------------------------
  loadSubmissions();
});