<?php
// Dummy user data
$users = [
  [
    "first_name" => "Justin Dhyll",
    "middle_name" => "Bernal",
    "last_name" => "Mansueto",
    "department" => "College of Education",
    "course" => "BS-IT – Bachelor of Science in Information Technology",
    "role" => "Admin",
    "year" => "4th Year"
  ],
  [
    "first_name" => "Tim Kennedy",
    "middle_name" => "Dumaguing",
    "last_name" => "Sta Rita",
    "department" => "College of Engineering, Architecture and Technology",
    "course" => "BS-CS – Bachelor of Science in Computer Science",
    "role" => "Faculty",
    "year" => "2nd Year"
  ],
  [
    "first_name" => "Ethan Marc",
    "middle_name" => "Lumagod",
    "last_name" => "Lumagod",
    "department" => "College of Engineering, Architecture and Technology",
    "course" => "BS-CS – Bachelor of Science in Computer Science",
    "role" => "Student",
    "year" => "3rd Year"
  ]
];

// Filter options
$departments = [
  "College of Engineering, Architecture and Technology",
  "College of Health Sciences",
  "College of Education",
  "Business College",
  "College of Arts and Science"
];

$courses = [
  "BS-CS – Bachelor of Science in Computer Science",
  "BS-IT – Bachelor of Science in Information Technology",
  "BS-EMC – Bachelor of Science in Entertainment and Multimedia Computing",
  "BS-MMA – Bachelor of Science in Multi-Media Arts",
  "BS-N – Bachelor of Science in Nursing",
  "BS-MEDTECH – Bachelor of Science in Medical Technology",
  "BSED-MATHEMATICS – Bachelor of Secondary Education Major in Mathematics",
  "BPE – Bachelor of Physical Education"
];

$roles = ["Admin", "Faculty", "Student", "Dean", "Librarian"];
$years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
?>

<div id="users" class="p-6">
  <!-- Header Card -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search -->
      <input type="text" id="searchUser" placeholder="Search "
             class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

      <!-- Department Filter -->
      <select id="deptFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Departments</option>
        <?php foreach ($departments as $d): ?>
          <option><?= htmlspecialchars($d) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Course Filter -->
      <select id="courseFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Courses</option>
        <?php foreach ($courses as $c): ?>
          <option><?= htmlspecialchars($c) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Role Filter -->
      <select id="roleFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Roles</option>
        <?php foreach ($roles as $r): ?>
          <option><?= htmlspecialchars($r) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Year Filter -->
      <select id="yearFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Year Levels</option>
        <?php foreach ($years as $y): ?>
          <option><?= htmlspecialchars($y) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Add User Button -->
      <button id="openAddUser"
              class="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add User
      </button>
    </div>
  </div>

  <!-- Users Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse" id="usersTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">First Name</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Middle Name</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Last Name</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Course</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Role</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Year Level</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($users as $u): ?>
        <tr class="border-b hover:bg-gray-50"
            data-first="<?= strtolower($u['first_name']) ?>"
            data-middle="<?= strtolower($u['middle_name']) ?>"
            data-last="<?= strtolower($u['last_name']) ?>"
            data-dept="<?= strtolower($u['department']) ?>"
            data-course="<?= strtolower($u['course']) ?>"
            data-role="<?= strtolower($u['role']) ?>"
            data-year="<?= strtolower($u['year']) ?>">
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["first_name"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["middle_name"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["last_name"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["department"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["course"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["role"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($u["year"]) ?></td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
              <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Update Account</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Username</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Password</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Account</a>
              </div>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- Filtering + Dropdown Toggle -->
<script>
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
</script>
