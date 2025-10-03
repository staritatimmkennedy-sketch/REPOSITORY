<?php
// Dummy data for courses
$courses = [
  ["id" => "1", "college" => "College of Engineering, Architecture and Technology", "name" => "BS-CS – Bachelor of Science in Computer Science"],
  ["id" => "2", "college" => "College of Engineering, Architecture and Technology", "name" => "BS-IT – Bachelor of Science in Information Technology"],
  ["id" => "3", "college" => "College of Health Sciences", "name" => "BS-N – Bachelor of Science in Nursing"],
  ["id" => "4", "college" => "College of Education", "name" => "BSED-MATHEMATICS – Bachelor of Secondary Education Major in Mathematics"],
  ["id" => "5", "college" => "Business College", "name" => "BSBA-MM – Bachelor of Science in Business Administration Major in Marketing Management"]
];

// Extract colleges for filter
$colleges = array_unique(array_map(fn($c) => $c['college'], $courses));
?>

<div id="courses" class="p-6">
  <!-- Header Card -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search -->
      <input type="text" id="searchCourse" placeholder="Search by ID or name"
             class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

      <!-- College Filter -->
      <select id="collegeFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Colleges</option>
        <?php foreach ($colleges as $c): ?>
          <option><?= htmlspecialchars($c) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Add Course Button -->
      <button id="openAddCourse"
              class="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Course
      </button>
    </div>
  </div>

  <!-- Courses Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse" id="courseTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Course ID</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Course Name</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">College</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($courses as $c): ?>
        <tr class="border-b hover:bg-gray-50"
            data-id="<?= strtolower($c['id']) ?>"
            data-name="<?= strtolower($c['name']) ?>"
            data-college="<?= strtolower($c['college']) ?>">
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($c["id"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($c["name"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($c["college"]) ?></td>
          <td class="px-4 py-3 text-center">
          <div class="relative inline-block text-left">
        <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
            Manage ▾
        </button>

        <!-- Dropdown Menu -->
        <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
            <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Course</a>
            <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Course</a>
        </div>
        </div>

          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>






<Style>
    .dropdown-menu {
            position: absolute;
            right: 0;
            top: 100%;
            margin-top: 0.25rem;
            background: white;
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.375rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            z-index: 50; /* ensure it appears above */
}

</Style>



<script>
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
</script>
