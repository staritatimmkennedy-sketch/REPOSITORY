document.addEventListener("DOMContentLoaded", () => {
  const pageSize = 10; // Cards per page
  let currentPage = 1;
  let filteredCards = [];

  // Get all cards as an array
  const allCards = Array.from(document.querySelectorAll("#inventoryList .video-card"));

  // Filtering function
  function applyFilters() {
    const activeBtn = document.querySelector(".filter-btn.active");
    const filter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";
    const search = document.querySelector('.search input')?.value.toLowerCase() || "";

    filteredCards = allCards.filter(card => {
      const cardText = card.textContent.toLowerCase();
      const statusMatch = (filter === "all" || card.dataset.status === filter);
      const searchMatch = !search || cardText.includes(search);
      return statusMatch && searchMatch;
    });

    currentPage = 1; // Reset to first page on filter
    renderPage();
    renderPagination();
  }

  // Render current page
  function renderPage() {
    allCards.forEach(card => (card.style.display = "none"));
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    filteredCards.slice(start, end).forEach(card => (card.style.display = ""));
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

  // === Filter button clicks ===
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilters();
    });
  });

  // === Search bar ===
  document.querySelector('.search input').addEventListener("input", applyFilters);

  // === Initial setup ===
  applyFilters();
});
