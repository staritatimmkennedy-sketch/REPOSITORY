  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const rows = document.querySelectorAll("#borrowedTable tbody tr");

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    rows.forEach(row => {
      const title = row.dataset.title.toLowerCase();
      const author = row.dataset.author.toLowerCase();
      const rowStatus = row.dataset.status;

      const matchesSearch = title.includes(search) || author.includes(search);
      const matchesStatus = !status || rowStatus === status;

      row.style.display = (matchesSearch && matchesStatus) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTable);
  statusFilter.addEventListener("change", filterTable);