<?php
// Dummy Approved Submissions
$approvedSubmissions = [
  [
    "title" => "AI in Medical Diagnosis",
    "type" => "Thesis",
    "author" => "Cruz, Juan",
    "date_submitted" => "2025-01-10",
    "description" => "A study on the use of machine learning in identifying early disease symptoms.",
    "file" => "ai_medical.pdf",
    "department" => "College of Health Sciences",
    "status" => "Approved"
  ],
  [
    "title" => "Green Architecture Design",
    "type" => "Project",
    "author" => "Reyes, Anna",
    "date_submitted" => "2025-01-14",
    "description" => "Capstone project on eco-friendly architectural designs for urban areas.",
    "file" => "green_architecture.pdf",
    "department" => "College of Engineering, Architecture and Technology",
    "status" => "Approved"
  ],
  [
    "title" => "Digital Transformation in SMEs",
    "type" => "Research Paper",
    "author" => "Santos, Mark",
    "date_submitted" => "2025-01-20",
    "description" => "Research on the impact of digital adoption among small enterprises.",
    "file" => "digital_transformation.pdf",
    "department" => "Business College",
    "status" => "Approved"
  ]
];

// Extract unique departments and material types for filters
$departments = array_unique(array_map(fn($r) => $r['department'], $approvedSubmissions));
$types = array_unique(array_map(fn($r) => $r['type'], $approvedSubmissions));
?>

<div id="approved" class="p-6">
  <!-- Header with Search & Filters -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search Bar -->
      <input type="text" id="searchApproved" placeholder="Search by title, author, or description..."
             class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

      <!-- Department Filter -->
      <select id="departmentFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Departments</option>
        <?php foreach ($departments as $dept): ?>
          <option><?= htmlspecialchars($dept) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Material Type Filter -->
      <select id="typeFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Material Types</option>
        <?php foreach ($types as $type): ?>
          <option><?= htmlspecialchars($type) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Date Filter -->
      <input type="date" id="dateFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
    </div>
  </div>

  <!-- Approved Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse text-left" id="approvedTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Title</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Material Type</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Author</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Date Submitted</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Description</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">File</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Department</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
  <?php foreach ($approvedSubmissions as $s): ?>
  <tr class="border-b hover:bg-gray-50"
      data-title="<?= strtolower($s['title']) ?>"
      data-author="<?= strtolower($s['author']) ?>"
      data-description="<?= strtolower($s['description']) ?>"
      data-department="<?= strtolower($s['department']) ?>"
      data-type="<?= strtolower($s['type']) ?>"
      data-date="<?= $s['date_submitted'] ?>">
    <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["title"]) ?></td>
    <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["type"]) ?></td>
    <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["author"]) ?></td>
    <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["date_submitted"]) ?></td>
    <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["description"]) ?></td>
    <td class="px-4 py-3 text-sm">
      <a href="#" class="text-blue-600 underline"><?= htmlspecialchars($s["file"]) ?></a>
    </td>
    <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["department"]) ?></td>
    <td class="px-4 py-3 text-sm">
      <span class="inline-block w-20 text-center px-2 py-1 rounded-md border bg-green-100 text-green-700 border-green-400 font-medium text-xs">
        <?= htmlspecialchars($s["status"]) ?>
      </span>
    </td>
    <td class="px-4 py-3 text-center">
      <div class="relative inline-block text-left">
        <button class="w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
          Manage ▾
        </button>
        <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">View</a>
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove</a>
        </div>
      </div>
    </td>
  </tr>
  <?php endforeach; ?>
</tbody>

    </table>
  </div>
</div>

<!-- JS Filtering -->
<script>
  const searchApproved = document.getElementById("searchApproved");
  const departmentFilter = document.getElementById("departmentFilter");
  const typeFilter = document.getElementById("typeFilter");
  const dateFilter = document.getElementById("dateFilter");
  const rows = document.querySelectorAll("#approvedTable tbody tr");

  function filterApproved() {
    const search = searchApproved.value.toLowerCase();
    const department = departmentFilter.value.toLowerCase();
    const type = typeFilter.value.toLowerCase();
    const date = dateFilter.value;

    rows.forEach(row => {
      const matchesSearch =
        row.dataset.title.includes(search) ||
        row.dataset.author.includes(search) ||
        row.dataset.description.includes(search);

      const matchesDepartment = !department || row.dataset.department === department;
      const matchesType = !type || row.dataset.type === type;
      const matchesDate = !date || row.dataset.date === date;

      row.style.display = (matchesSearch && matchesDepartment && matchesType && matchesDate) ? "" : "none";
    });
  }

  searchApproved.addEventListener("input", filterApproved);
  departmentFilter.addEventListener("change", filterApproved);
  typeFilter.addEventListener("change", filterApproved);
  dateFilter.addEventListener("change", filterApproved);

  // Manage dropdown toggle
  document.querySelectorAll("#approvedTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });
</script>
