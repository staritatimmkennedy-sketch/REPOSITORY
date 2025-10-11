 const searchBorrowing = document.getElementById("searchBorrowing");
  const departmentFilter = document.getElementById("departmentFilter");
  const dateFilter = document.getElementById("dateFilter");
  const rows = document.querySelectorAll("#borrowingTable tbody tr");

  function filterBorrowing() {
    const search = searchBorrowing.value.toLowerCase();
    const department = departmentFilter.value.toLowerCase();
    const date = dateFilter.value;

    rows.forEach(row => {
      const matchesSearch = 
        row.dataset.title.includes(search) || 
        row.dataset.author.includes(search) || 
        row.dataset.user.includes(search);

      const matchesDepartment = !department || row.dataset.department === department;
      const matchesDate = !date || row.dataset.date === date;

      row.style.display = (matchesSearch && matchesDepartment && matchesDate) ? "" : "none";
    });
  }

  searchBorrowing.addEventListener("input", filterBorrowing);
  departmentFilter.addEventListener("change", filterBorrowing);
  dateFilter.addEventListener("change", filterBorrowing);

  // Manage dropdown toggle
  document.querySelectorAll("#borrowingTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });