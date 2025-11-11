const searchApp = document.getElementById("searchApproved");
  const deptApp = document.getElementById("departmentApproved");
  const typeApp = document.getElementById("typeApproved");
  const rowsApp = document.querySelectorAll("#approvedTable tbody tr");

  function filterApproved() {
    const search = searchApp.value.toLowerCase();
    const dept = deptApp.value.toLowerCase();
    const type = typeApp.value.toLowerCase();

    rowsApp.forEach(row => {
      const matchesSearch = row.dataset.title.includes(search) || row.dataset.author.includes(search) || row.dataset.description.includes(search);
      const matchesDept = !dept || row.dataset.department === dept;
      const matchesType = !type || row.dataset.type === type;

      row.style.display = (matchesSearch && matchesDept && matchesType) ? "" : "none";
    });
  }

  searchApp.addEventListener("input", filterApproved);
  deptApp.addEventListener("change", filterApproved);
  typeApp.addEventListener("change", filterApproved);

  document.querySelectorAll("#approvedTable button").forEach(btn => {
    btn.addEventListener("click", () => {
      const menu = btn.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });