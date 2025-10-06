const searchSub = document.getElementById("searchSubmissions");
  const deptSub = document.getElementById("departmentFilter");
  const typeSub = document.getElementById("typeFilter");
  const rowsSub = document.querySelectorAll("#submissionsTable tbody tr");

  function filterSubmissions() {
    const search = searchSub.value.toLowerCase();
    const dept = deptSub.value.toLowerCase();
    const type = typeSub.value.toLowerCase();

    rowsSub.forEach(row => {
      const matchesSearch = row.dataset.title.includes(search) || row.dataset.author.includes(search) || row.dataset.description.includes(search);
      const matchesDept = !dept || row.dataset.department === dept;
      const matchesType = !type || row.dataset.type === type;

      row.style.display = (matchesSearch && matchesDept && matchesType) ? "" : "none";
    });
  }

  searchSub.addEventListener("input", filterSubmissions);
  deptSub.addEventListener("change", filterSubmissions);
  typeSub.addEventListener("change", filterSubmissions);

  // Manage dropdown toggle
  document.querySelectorAll("#submissionsTable button").forEach(btn => {
    btn.addEventListener("click", () => {
      const menu = btn.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });