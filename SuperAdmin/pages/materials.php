<?php
// Dummy materials data
$materials = [
  [
    "submitted_by" => "Justin Dhyll Mansueto",
    "title" => "AI in Education",
    "type" => "Thesis",
    "author" => "Mansueto, Justin",
    "date" => "2025-01-10",
    "desc" => "Thesis on using AI for personalized student learning.",
    "file" => "ai_education.pdf",
    "department" => "College of Education",
    "course" => "BS-IT – Bachelor of Science in Information Technology",
    "approved_by" => "Dean Garcia",
    "published_by" => "Librarian Reyes"
  ],
  [
    "submitted_by" => "Tim Kennedy Sta Rita",
    "title" => "Green Architecture Design",
    "type" => "Research Paper",
    "author" => "Sta Rita, Tim",
    "date" => "2025-01-05",
    "desc" => "Paper on sustainable and eco-friendly building practices.",
    "file" => "green_architecture.pdf",
    "department" => "College of Engineering, Architecture and Technology",
    "course" => "BS-ARCH – Bachelor of Science in Architecture",
    "approved_by" => "Dean Cruz",
    "published_by" => "Librarian Santos"
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
  "BS-ARCH – Bachelor of Science in Architecture",
  "BS-N – Bachelor of Science in Nursing",
  "BSED-MATHEMATICS – Bachelor of Secondary Education Major in Mathematics"
];

$types = ["Book", "Thesis", "Research Paper", "Journal"];
?>

<div id="materials" class="p-6">
  <!-- Header Card -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search -->
      <input type="text" id="searchMaterial" placeholder="Search by title, author, or submitter"
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

      <!-- Material Type Filter -->
      <select id="typeFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Types</option>
        <?php foreach ($types as $t): ?>
          <option><?= htmlspecialchars($t) ?></option>
        <?php endforeach; ?>
      </select>

    
    </div>
  </div>

  <!-- Materials Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse" id="materialsTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Submitted By</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Material Type</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date Submitted</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">File</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Course</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Approved By</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Published By</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($materials as $m): ?>
        <tr class="border-b hover:bg-gray-50"
            data-title="<?= strtolower($m['title']) ?>"
            data-author="<?= strtolower($m['author']) ?>"
            data-submit="<?= strtolower($m['submitted_by']) ?>"
            data-dept="<?= strtolower($m['department']) ?>"
            data-course="<?= strtolower($m['course']) ?>"
            data-type="<?= strtolower($m['type']) ?>">
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["submitted_by"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["title"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["type"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["author"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["date"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["desc"]) ?></td>
          <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline"><?= htmlspecialchars($m["file"]) ?></a></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["department"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["course"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["approved_by"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($m["published_by"]) ?></td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
              <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Material</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Material</a>
              </div>
            </div>
          </td>
        </tr>
        <?php endforeach; ?>
      </tbody>
    </table>
  </div>
</div>

<!-- JS Filtering + Dropdown Toggle -->
<script>
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
</script>
