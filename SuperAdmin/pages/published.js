 const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const deptFilter = document.getElementById("deptFilter");
  const rows = document.querySelectorAll("#materialsTable tbody tr");

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const dept = deptFilter.value;

    rows.forEach(row => {
      const title = row.dataset.title.toLowerCase();
      const author = row.dataset.author.toLowerCase();
      const rowType = row.dataset.type;
      const rowDept = row.dataset.dept;

      const matchesSearch = title.includes(search) || author.includes(search);
      const matchesType = !type || rowType === type;
      const matchesDept = !dept || rowDept === dept;

      row.style.display = (matchesSearch && matchesType && matchesDept) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTable);
  typeFilter.addEventListener("change", filterTable);
  deptFilter.addEventListener("change", filterTable);