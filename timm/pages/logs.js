const searchLogs = document.getElementById("searchLogs");
  const actionFilter = document.getElementById("actionFilter");
  const dateFilter = document.getElementById("dateFilter");
  const rows = document.querySelectorAll("#auditTable tbody tr");

  function filterLogs() {
    const search = searchLogs.value.toLowerCase();
    const action = actionFilter.value.toLowerCase();
    const date = dateFilter.value;

    rows.forEach(row => {
      const matchesSearch = row.innerText.toLowerCase().includes(search);
      const matchesAction = !action || row.dataset.action === action;
      const matchesDate = !date || row.dataset.date === date;

      row.style.display = (matchesSearch && matchesAction && matchesDate) ? "" : "none";
    });
  }

  searchLogs.addEventListener("input", filterLogs);
  actionFilter.addEventListener("change", filterLogs);
  dateFilter.addEventListener("change", filterLogs);