  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const rows = document.querySelectorAll("#submissionsTable tbody tr");

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const status = statusFilter.value;

    rows.forEach(row => {
      const title = row.dataset.title.toLowerCase();
      const author = row.dataset.author.toLowerCase();
      const rowType = row.dataset.type;
      const rowStatus = row.dataset.status;

      const matchesSearch = title.includes(search) || author.includes(search);
      const matchesType = !type || rowType === type;
      const matchesStatus = !status || rowStatus === status;

      row.style.display = (matchesSearch && matchesType && matchesStatus) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTable);
  typeFilter.addEventListener("change", filterTable);
  statusFilter.addEventListener("change", filterTable);

  // Toggle dropdowns
  document.querySelectorAll("[class*='Manage']").forEach(button => {
    button.addEventListener("click", (e) => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });