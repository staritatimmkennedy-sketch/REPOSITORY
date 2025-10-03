<?php
// Dummy approved submissions
$approvedSubmissions = [
  [
    "title" => "Green Energy Solutions",
    "type" => "Project",
    "author" => "Lopez, Mark",
    "date_submitted" => "2025-01-12",
    "description" => "Capstone project on sustainable power systems.",
    "file" => "green_energy.pdf",
    "department" => "College of Engineering",
    "status" => "Approved"
  ],
  [
    "title" => "E-Commerce Trends",
    "type" => "Research Paper",
    "author" => "Dela Cruz, Anna",
    "date_submitted" => "2025-01-15",
    "description" => "Study on online business growth in the Philippines.",
    "file" => "ecommerce_trends.pdf",
    "department" => "Business College",
    "status" => "Approved"
  ]
];

// Extract unique filters
$departments = array_unique(array_map(fn($r) => $r['department'], $approvedSubmissions));
$types = array_unique(array_map(fn($r) => $r['type'], $approvedSubmissions));
?>

<div id="deanApproved" class="p-6">
  <!-- Header -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3">
    <input type="text" id="searchApproved" placeholder="Search by title, author, or description..."
           class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

    <select id="departmentApproved" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
      <option value="">All Departments</option>
      <?php foreach ($departments as $dept): ?>
        <option><?= htmlspecialchars($dept) ?></option>
      <?php endforeach; ?>
    </select>

    <select id="typeApproved" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
      <option value="">All Types</option>
      <?php foreach ($types as $type): ?>
        <option><?= htmlspecialchars($type) ?></option>
      <?php endforeach; ?>
    </select>
  </div>

  <!-- Table -->
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
            data-type="<?= strtolower($s['type']) ?>">
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["title"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["type"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["author"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["date_submitted"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["description"]) ?></td>
          <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline"><?= htmlspecialchars($s["file"]) ?></a></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($s["department"]) ?></td>
          <td class="px-4 py-3 text-sm">
            <span class="inline-block w-20 text-center px-2 py-1 rounded-md border bg-green-100 text-green-700 border-green-400 font-medium text-xs">
              <?= htmlspecialchars($s["status"]) ?>
            </span>
          </td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300">Manage ▾</button>
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

<script>
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
</script>
