<?php
// Dummy Borrowing Requests
$borrowingRequests = [
  [
    "requested_by" => "Juan Dela Cruz",
    "date_requested" => "2025-01-15",
    "title" => "Artificial Intelligence in Education",
    "type" => "Thesis",
    "author" => "Reyes, Maria",
    "description" => "Study on the impact of AI-driven tools in classroom settings.",
    "file" => "ai_in_education.pdf",
    "department" => "College of Education",
    "duration" => "7 days"
  ],
  [
    "requested_by" => "Ana Santos",
    "date_requested" => "2025-01-17",
    "title" => "Business Sustainability Models",
    "type" => "Research Paper",
    "author" => "Garcia, Jose",
    "description" => "Analysis of eco-friendly business operations in SMEs.",
    "file" => "sustainability.pdf",
    "department" => "Business College",
    "duration" => "5 days"
  ],
  [
    "requested_by" => "Mark Lopez",
    "date_requested" => "2025-01-20",
    "title" => "Cloud Security Best Practices",
    "type" => "Journal",
    "author" => "Cruz, Juan",
    "description" => "Journal article on modern security frameworks for cloud systems.",
    "file" => "cloud_security.pdf",
    "department" => "College of Engineering, Architecture and Technology",
    "duration" => "10 days"
  ]
];

// Extract unique departments for filter
$departments = array_unique(array_map(fn($r) => $r['department'], $borrowingRequests));
?>

<div id="borrowing" class="p-6">
  <!-- Header with Search & Filters -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search Bar -->
      <input type="text" id="searchBorrowing" placeholder="Search by title, author, or requester..."
             class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

      <!-- Department Filter -->
      <select id="departmentFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Departments</option>
        <?php foreach ($departments as $dept): ?>
          <option><?= htmlspecialchars($dept) ?></option>
        <?php endforeach; ?>
      </select>

      <!-- Date Filter -->
      <input type="date" id="dateFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
    </div>
  </div>

  <!-- Borrowing Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse text-left" id="borrowingTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Requested By</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Date Requested</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Title</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Material Type</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Author</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Description</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">File</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Department</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Duration</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        <?php foreach ($borrowingRequests as $r): ?>
        <tr class="border-b hover:bg-gray-50"
            data-title="<?= strtolower($r['title']) ?>"
            data-author="<?= strtolower($r['author']) ?>"
            data-user="<?= strtolower($r['requested_by']) ?>"
            data-department="<?= strtolower($r['department']) ?>"
            data-date="<?= $r['date_requested'] ?>">
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["requested_by"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["date_requested"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["title"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["type"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["author"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["description"]) ?></td>
          <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline"><?= htmlspecialchars($r["file"]) ?></a></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["department"]) ?></td>
          <td class="px-4 py-3 text-sm"><?= htmlspecialchars($r["duration"]) ?></td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
              <button class="w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">Manage ▾</button>
              <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Approve</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Deny</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">View Material</a>
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
  const searchBorrowing = document.getElementById("searchBorrowing");
  const departmentFilter = document.getElementById("departmentFilter");
  const dateFilter = document.getElementById("dateFilter");
  const rows = document.querySelectorAll("#borrowingTable tbody tr");

  function filterBorrowing() {
    const search = searchBorrowing.value.toLowerCase();
    const department = departmentFilter.value.toLowerCase();
    const date = dateFilter.value;

    rows.forEach(row => {
      const matchesSearch = 
        row.dataset.title.includes(search) || 
        row.dataset.author.includes(search) || 
        row.dataset.user.includes(search);

      const matchesDepartment = !department || row.dataset.department === department;
      const matchesDate = !date || row.dataset.date === date;

      row.style.display = (matchesSearch && matchesDepartment && matchesDate) ? "" : "none";
    });
  }

  searchBorrowing.addEventListener("input", filterBorrowing);
  departmentFilter.addEventListener("change", filterBorrowing);
  dateFilter.addEventListener("change", filterBorrowing);

  // Manage dropdown toggle
  document.querySelectorAll("#borrowingTable button").forEach(button => {
    button.addEventListener("click", () => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });
</script>
