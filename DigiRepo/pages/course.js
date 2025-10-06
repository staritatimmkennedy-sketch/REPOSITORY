  const searchCourse = document.getElementById("searchCourse");
  const collegeFilter = document.getElementById("collegeFilter");
  const courseRows = document.querySelectorAll("#courseTable tbody tr");

  function filterCourses() {
    const search = searchCourse.value.toLowerCase();
    const college = collegeFilter.value.toLowerCase();
    courseRows.forEach(row => {
      const matchesSearch = row.dataset.id.includes(search) || row.dataset.name.includes(search);
      const matchesCollege = !college || row.dataset.college === college;
      row.style.display = (matchesSearch && matchesCollege) ? "" : "none";
    });
  }

  searchCourse.addEventListener("input", filterCourses);
  collegeFilter.addEventListener("change", filterCourses);

  document.querySelectorAll("#courseTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });