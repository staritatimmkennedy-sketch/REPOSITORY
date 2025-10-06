  const searchUser = document.getElementById("searchUser");
  const deptFilter = document.getElementById("deptFilter");
  const courseFilter = document.getElementById("courseFilter");
  const roleFilter = document.getElementById("roleFilter");
  const yearFilter = document.getElementById("yearFilter");
  const rows = document.querySelectorAll("#usersTable tbody tr");

  function filterUsers() {
    const search = searchUser.value.toLowerCase();
    const dept = deptFilter.value.toLowerCase();
    const course = courseFilter.value.toLowerCase();
    const role = roleFilter.value.toLowerCase();
    const year = yearFilter.value.toLowerCase();

    rows.forEach(row => {
      const matchesSearch = 
        row.dataset.first.includes(search) ||
        row.dataset.middle.includes(search) ||
        row.dataset.last.includes(search) ||
        row.dataset.dept.includes(search) ||
        row.dataset.course.includes(search) ||
        row.dataset.role.includes(search);

      const matchesDept = !dept || row.dataset.dept === dept;
      const matchesCourse = !course || row.dataset.course === course;
      const matchesRole = !role || row.dataset.role === role;
      const matchesYear = !year || row.dataset.year === year;

      row.style.display = (matchesSearch && matchesDept && matchesCourse && matchesRole && matchesYear) ? "" : "none";
    });
  }

  searchUser.addEventListener("input", filterUsers);
  deptFilter.addEventListener("change", filterUsers);
  courseFilter.addEventListener("change", filterUsers);
  roleFilter.addEventListener("change", filterUsers);
  yearFilter.addEventListener("change", filterUsers);

  // Toggle Manage dropdowns
  document.querySelectorAll("#usersTable button").forEach(button => {
    button.addEventListener("click", (e) => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });