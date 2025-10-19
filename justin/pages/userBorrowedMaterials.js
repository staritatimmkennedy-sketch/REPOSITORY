$(function () {
    const $tbody = $("#borrowingRequestsBody");
  
    // show a loading row
    $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-sm text-gray-500">Loading your requests…</td></tr>`);
  
    // IMPORTANT: this URL matches what you tested in the browser
    $.getJSON("pages/get_userBorrowedMaterials.php")
      .done(function (res) {
        console.log("Borrowed materials response:", res);
  
        if (!res || !res.success) {
          $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-red-600">Failed to load.</td></tr>`);
          return;
        }
        const rows = res.data || [];
        if (!rows.length) {
          $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-gray-500">No records found.</td></tr>`);
          return;
        }
  
        const html = rows.map(r => `
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-sm">${fmt(r.borrowedDate)}</td>
            <td class="px-4 py-3 text-sm">${esc(r.title)}</td>
            <td class="px-4 py-3 text-sm">${esc(r.material_type)}</td>
            <td class="px-4 py-3 text-sm">${esc(r.author)}</td>
            <td class="px-4 py-3 text-sm">${esc(r.callNumber)}</td>
            <td class="px-4 py-3 text-sm">${fmt(r.dueDate)}</td>
            <td class="px-4 py-3 text-sm">${badge(r.borrowStatus)}</td>
            <td class="px-4 py-3 text-sm text-center">
              <button class="view-details px-3 py-1 rounded-md border hover:bg-gray-100"
                data-row='${encodeURIComponent(JSON.stringify(r))}'>Details</button>
            </td>
          </tr>
        `).join("");
  
        $tbody.html(html);
      })
      .fail(function (xhr, status, error) {
        console.error("Load error:", error, xhr.responseText);
        $tbody.html(`<tr><td colspan="8" class="px-4 py-3 text-center text-red-600">Error loading data.</td></tr>`);
      });
  
    // helpers
    function esc(s) {
      if (s == null) return "";
      return String(s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    function fmt(dt) {
      if (!dt || dt === "0000-00-00 00:00:00") return "—";
      const d = new Date(dt.replace(" ", "T"));
      return isNaN(d) ? esc(dt) : d.toLocaleString();
    }
    function badge(s) {
      const S = (s || "").toUpperCase();
      const cls = {
        "REQUESTED": "border-yellow-400 bg-yellow-100 text-yellow-700",
        "APPROVED": "border-blue-500 bg-blue-100 text-blue-700",
        "BORROWED": "border-purple-500 bg-purple-100 text-purple-700",
        "RETURNED": "border-green-500 bg-green-100 text-green-700",
        "DENIED": "border-red-500 bg-red-100 text-red-700"
      }[S] || "border-gray-300 bg-gray-100 text-gray-700";
      return `<span class="inline-block w-24 text-center px-2 py-1 text-xs font-medium border rounded-full ${cls}">${S || "—"}</span>`;
    }
  
    // optional: details modal wiring if you have it on the page
    $(document).on("click", ".view-details", function () {
      const row = JSON.parse(decodeURIComponent($(this).data("row")));
      $("#detailMaterialTitle").text(row.title || "—");
      $("#detailCallNumber").text(row.callNumber || "—");
      $("#detailMaterialType").text(row.material_type || "—");
      $("#detailAuthor").text(row.author || "—");
      $("#detailMaterialStatus").text(row.materialStatus || "—");
      $("#detailBorrowStatus").text(row.borrowStatus || "—");
      $("#detailBorrowedDate").text(fmt(row.borrowedDate));
      $("#detailApprovalDate").text(fmt(row.approvalDate));
      $("#detailDueDate").text(fmt(row.dueDate));
      $("#detailStudentRemarks").text(row.studentRemarks || "—");
      $("#detailLibrarianRemarks").text(row.librarianRemarks || "—");
      $("#detailsModal").removeClass("hidden");
    });
    $(document).on("click", ".close-details-modal", () => $("#detailsModal").addClass("hidden"));
  });
  