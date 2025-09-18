document.addEventListener("DOMContentLoaded", () => {
  const pageSize = 10; // ✅ Show 10 per page
  let currentPage = 1;
  let filteredCards = [];

  // Get all cards as an array
  const allCards = Array.from(document.querySelectorAll("#materialsList .material-card"));

  // Filtering function (optional, if you don’t need filters you can remove this)
  function applyFilters() {
    const type = document.getElementById("filterType")?.value.toLowerCase() || "";
    const course = document.getElementById("filterCourse")?.value.toLowerCase() || "";
    const search = document.querySelector('.search input')?.value.toLowerCase() || "";

    filteredCards = allCards.filter(card => {
      const infoText = card.querySelector(".meta")?.textContent.toLowerCase() || "";
      const cardText = card.textContent.toLowerCase();
      const typeMatch = !type || infoText.includes(type);
      const courseMatch = !course || infoText.includes(course);
      const searchMatch = !search || cardText.includes(search);
      return typeMatch && courseMatch && searchMatch;
    });

    currentPage = 1; // Reset to first page on filter
    renderPage();
    renderPagination();
  }

  // Render current page
  function renderPage() {
    allCards.forEach(card => card.style.display = "none");
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    filteredCards.slice(start, end).forEach(card => card.style.display = "");
  }

  // Render pagination buttons
  function renderPagination() {
    const totalPages = Math.ceil(filteredCards.length / pageSize) || 1;
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPage();
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }

  // Event listeners for filters (only if you use them)
  document.getElementById("filterType")?.addEventListener("change", applyFilters);
  document.getElementById("filterCourse")?.addEventListener("change", applyFilters);
  document.querySelector('.search input')?.addEventListener("input", applyFilters);

  // Initial setup
  applyFilters();
});



document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("confirmPopup");
  const popupMessage = document.getElementById("popupMessage");
  const btnApprove = document.getElementById("approveBtn");
  const btnReject = document.getElementById("rejectBtn");
  const btnYes = document.getElementById("confirmYes");
  const btnNo = document.getElementById("confirmNo");

  let currentAction = null;

  // Show popup
  function showPopup(action) {
    currentAction = action;
    popupMessage.textContent = 
      action === "approve" ? "Approve this submission?" : "Reject this submission?";
    popup.style.display = "flex";
  }

  // Hide popup
  function hidePopup() {
    popup.style.display = "none";
  }

  // Event bindings
  btnApprove.addEventListener("click", () => showPopup("approve"));
  btnReject.addEventListener("click", () => showPopup("reject"));
  btnNo.addEventListener("click", hidePopup);

  btnYes.addEventListener("click", () => {
    if (currentAction === "approve") {
      alert("✅ Submission Approved!");
    } else if (currentAction === "reject") {
      alert("❌ Submission Rejected!");
    }
    hidePopup();
  });
});
