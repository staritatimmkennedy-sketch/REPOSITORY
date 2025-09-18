document.addEventListener("DOMContentLoaded", () => {
  const pageSize = 10; // Items per page
  let currentPage = 1;
  let filteredCards = [];

  // Get all cards as an array
  const allCards = Array.from(document.querySelectorAll("#materialsList .video-card"));

  // Filtering function
  function applyFilters() {
    const type = document.getElementById("filterType")?.value.toLowerCase() || "";
    const status = document.getElementById("filterStatus")?.value.toLowerCase() || "";
    const search = document.querySelector('.search input')?.value.toLowerCase() || "";

    filteredCards = allCards.filter(card => {
      const infoText = card.querySelector(".info p")?.textContent.toLowerCase() || "";
      const cardText = card.textContent.toLowerCase();
      const statusText = card.querySelector(".status-badge")?.textContent.toLowerCase() || "";
      const typeMatch = !type || infoText.includes(type);
      const statusMatch = !status || statusText.includes(status);
      const searchMatch = !search || cardText.includes(search);
      return typeMatch && statusMatch && searchMatch;
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
    if (!pagination) return;
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

  // Event listeners
  document.getElementById("filterType")?.addEventListener("change", applyFilters);
  document.getElementById("filterStatus")?.addEventListener("change", applyFilters);
  document.querySelector('.search input')?.addEventListener("input", applyFilters);

  // Initial setup
  applyFilters();
});

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("publishModal");
  const addBtn = document.querySelector(".publishBtn");
  const closeBtn = document.querySelector("#publishModal .close");

  // Open modal when clicking Add
  addBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  // Close modal when clicking X
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});
