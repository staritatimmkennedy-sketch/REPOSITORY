  const searchType = document.getElementById("searchType");
  const rows = document.querySelectorAll("#materialTypesTable tbody tr");

  function filterTypes() {
    const search = searchType.value.toLowerCase();
    rows.forEach(row => {
      const matches = 
        row.dataset.id.includes(search) ||
        row.dataset.name.includes(search) ||
        row.dataset.desc.includes(search);
      row.style.display = matches ? "" : "none";
    });
  }

  searchType.addEventListener("input", filterTypes);

  // Toggle Manage dropdowns
  document.querySelectorAll("#materialTypesTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });