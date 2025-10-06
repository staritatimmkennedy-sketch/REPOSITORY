  const searchRole = document.getElementById("searchRole");
  const roleFilter = document.getElementById("roleFilter");
  const rows = document.querySelectorAll("#rolesTable tbody tr");

  function filterRoles() {
    const search = searchRole.value.toLowerCase();
    const filterRole = roleFilter.value.toLowerCase();

    rows.forEach(row => {
      const role = row.dataset.role;
      const desc = row.dataset.desc;

      const matchesSearch = role.includes(search) || desc.includes(search);
      const matchesFilter = !filterRole || role === filterRole;

      row.style.display = (matchesSearch && matchesFilter) ? "" : "none";
    });
  }

  searchRole.addEventListener("input", filterRoles);
  roleFilter.addEventListener("change", filterRoles);

  // Toggle Manage dropdowns
  document.querySelectorAll("#rolesTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });