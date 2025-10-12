const searchApproved = document.getElementById("searchApproved");
  const departmentFilter = document.getElementById("departmentFilter");
  const typeFilter = document.getElementById("typeFilter");
  const dateFilter = document.getElementById("dateFilter");
  const rows = document.querySelectorAll("#approvedTable tbody tr");

  function filterApproved() {
    const search = searchApproved.value.toLowerCase();
    const department = departmentFilter.value.toLowerCase();
    const type = typeFilter.value.toLowerCase();
    const date = dateFilter.value;

    rows.forEach(row => {
      const matchesSearch =
        row.dataset.title.includes(search) ||
        row.dataset.author.includes(search) ||
        row.dataset.description.includes(search);

      const matchesDepartment = !department || row.dataset.department === department;
      const matchesType = !type || row.dataset.type === type;
      const matchesDate = !date || row.dataset.date === date;

      row.style.display = (matchesSearch && matchesDepartment && matchesType && matchesDate) ? "" : "none";
    });
  }

  searchApproved.addEventListener("input", filterApproved);
  departmentFilter.addEventListener("change", filterApproved);
  typeFilter.addEventListener("change", filterApproved);
  dateFilter.addEventListener("change", filterApproved);

  // Manage dropdown toggle
  document.querySelectorAll("#approvedTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });