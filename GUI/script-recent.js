document.addEventListener("DOMContentLoaded", () => {
  const pageSize = 10; // cards per page
  let currentPage = 1;
  let filteredCards = [];

  const allCards = Array.from(document.querySelectorAll("#materialsList .video-card"));

  function applyFilters() {
    const typeSelect = document.getElementById("filterType");
    const courseSelect = document.getElementById("filterCourse");
    const searchInput = document.querySelector(".search input");

    const type = typeSelect ? typeSelect.value.toLowerCase() : "";
    const course = courseSelect ? courseSelect.value.toLowerCase() : "";
    const search = searchInput ? searchInput.value.toLowerCase() : "";

    filteredCards = allCards.filter(card => {
      const infoText = card.querySelector(".info p")?.textContent.toLowerCase() || "";
      const cardText = card.textContent.toLowerCase();
      const typeMatch = !type || infoText.includes(type);
      const courseMatch = !course || infoText.includes(course);
      const searchMatch = !search || cardText.includes(search);
      return typeMatch && courseMatch && searchMatch;
    });

    currentPage = 1;
    renderPage();
    renderPagination();
  }

  function renderPage() {
    allCards.forEach(card => card.style.display = "none");
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    filteredCards.slice(start, end).forEach(card => card.style.display = "");
  }

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

  applyFilters();

  const searchInput = document.querySelector(".search input");
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  const typeSelect = document.getElementById("filterType");
  if (typeSelect) typeSelect.addEventListener("change", applyFilters);
  const courseSelect = document.getElementById("filterCourse");
  if (courseSelect) courseSelect.addEventListener("change", applyFilters);
});
