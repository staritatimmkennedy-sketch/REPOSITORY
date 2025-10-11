  const searchMaterial = document.getElementById("searchMaterial");
  const deptFilter = document.getElementById("deptFilter");
  const courseFilter = document.getElementById("courseFilter");
  const typeFilter = document.getElementById("typeFilter");
  const rows = document.querySelectorAll("#materialsTable tbody tr");

  function filterMaterials() {
    const search = searchMaterial.value.toLowerCase();
    const dept = deptFilter.value.toLowerCase();
    const course = courseFilter.value.toLowerCase();
    const type = typeFilter.value.toLowerCase();

    rows.forEach(row => {
      const matchesSearch =
        row.dataset.title.includes(search) ||
        row.dataset.author.includes(search) ||
        row.dataset.submit.includes(search);

      const matchesDept = !dept || row.dataset.dept === dept;
      const matchesCourse = !course || row.dataset.course === course;
      const matchesType = !type || row.dataset.type === type;

      row.style.display = (matchesSearch && matchesDept && matchesCourse && matchesType) ? "" : "none";
    });
  }

  searchMaterial.addEventListener("input", filterMaterials);
  deptFilter.addEventListener("change", filterMaterials);
  courseFilter.addEventListener("change", filterMaterials);
  typeFilter.addEventListener("change", filterMaterials);

  // Toggle Manage dropdowns
  document.querySelectorAll("#materialsTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });