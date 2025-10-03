<div id="submissions" class="p-6">
  <!-- Header -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">


    <!-- Search, Filters & Add Button -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search Bar -->
      <input type="text" id="searchInput" placeholder="Search by title or author"
             class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

      <!-- Material Type Filter -->
      <select id="typeFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Types</option>
        <option value="Book">Book</option>
        <option value="Thesis">Thesis</option>
        <option value="Research Paper">Research Paper</option>
        <option value="Journal">Journal</option>
      </select>

      <!-- Status Filter -->
      <select id="statusFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Published">Published</option>
        <option value="Denied">Denied</option>
      </select>

      <!-- Add Submission Button -->
      <button class="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 whitespace-nowrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Add Submission
      </button>
    </div>
  </div>



  <!-- Submissions Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse" id="submissionsTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Material Type</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date Submitted</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">File</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
        </tr>
      </thead>
      <tbody>
  <!-- Pending -->
  <tr class="border-b hover:bg-gray-50"
      data-title="AI in Healthcare"
      data-author="Doe, John"
      data-type="Thesis"
      data-status="Pending">
    <td class="px-4 py-3 text-sm">AI in Healthcare</td>
    <td class="px-4 py-3 text-sm">Thesis</td>
    <td class="px-4 py-3 text-sm">Doe, John</td>
    <td class="px-4 py-3 text-sm">2025-01-05</td>
    <td class="px-4 py-3 text-sm">A thesis exploring AI applications in patient diagnostics.</td>
    <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline">ai_healthcare.pdf</a></td>
    <td class="px-4 py-3 text-sm">
      <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border border-yellow-400 bg-yellow-100 text-yellow-700 rounded-full">Pending</span>
    </td>
    <td class="px-4 py-3 text-center">
      <div class="relative inline-block text-left">
        <button class="w-22 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
        <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Submission</a>
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Submission</a>
        </div>
      </div>
    </td>
  </tr>

  <!-- Approved -->
  <tr class="border-b hover:bg-gray-50"
      data-title="Database Optimization Techniques"
      data-author="Garcia, Maria"
      data-type="Research Paper"
      data-status="Approved">
    <td class="px-4 py-3 text-sm">Database Optimization Techniques</td>
    <td class="px-4 py-3 text-sm">Research Paper</td>
    <td class="px-4 py-3 text-sm">Garcia, Maria</td>
    <td class="px-4 py-3 text-sm">2025-01-02</td>
    <td class="px-4 py-3 text-sm">Research paper on indexing and query performance tuning.</td>
    <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline">db_optimization.pdf</a></td>
    <td class="px-4 py-3 text-sm">
      <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border border-green-500 bg-green-100 text-green-700 rounded-full">Approved</span>
    </td>
    <td class="px-4 py-3 text-center">
      <div class="relative inline-block text-left">
        <button class="w-22 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
        <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Submission</a>
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Submission</a>
        </div>
      </div>
    </td>
  </tr>

  <!-- Published -->
  <tr class="border-b hover:bg-gray-50"
      data-title="Sustainable Business Practices"
      data-author="Lopez, Carlos"
      data-type="Journal"
      data-status="Published">
    <td class="px-4 py-3 text-sm">Sustainable Business Practices</td>
    <td class="px-4 py-3 text-sm">Journal</td>
    <td class="px-4 py-3 text-sm">Lopez, Carlos</td>
    <td class="px-4 py-3 text-sm">2024-12-20</td>
    <td class="px-4 py-3 text-sm">Published journal article analyzing eco-friendly business models.</td>
    <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline">sustainable_business.pdf</a></td>
    <td class="px-4 py-3 text-sm">
      <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border border-blue-500 bg-blue-100 text-blue-700 rounded-full">Published</span>
    </td>
    <td class="px-4 py-3 text-center">
      <div class="relative inline-block text-left">
        <button class="w-22 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
        <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Submission</a>
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Submission</a>
        </div>
      </div>
    </td>
  </tr>

  <!-- Denied -->
  <tr class="hover:bg-gray-50"
      data-title="Philosophy of Modern Ethics"
      data-author="Reyes, Ana"
      data-type="Book"
      data-status="Denied">
    <td class="px-4 py-3 text-sm">Philosophy of Modern Ethics</td>
    <td class="px-4 py-3 text-sm">Book</td>
    <td class="px-4 py-3 text-sm">Reyes, Ana</td>
    <td class="px-4 py-3 text-sm">2024-12-10</td>
    <td class="px-4 py-3 text-sm">Book manuscript analyzing philosophical ideas shaping ethics today.</td>
    <td class="px-4 py-3 text-sm"><a href="#" class="text-blue-600 underline">modern_ethics.pdf</a></td>
    <td class="px-4 py-3 text-sm">
      <span class="inline-block w-20 text-center px-2 py-1 text-xs font-medium border border-red-500 bg-red-100 text-red-700 rounded-full">Denied</span>
    </td>
    <td class="px-4 py-3 text-center">
      <div class="relative inline-block text-left">
        <button class="w-22 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
        <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
          <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Submission</a>
          <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Submission</a>
        </div>
      </div>
    </td>
  </tr>
</tbody>



    </table>
  </div>
</div>

<!-- JS Filtering -->
<script>
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const statusFilter = document.getElementById("statusFilter");
  const rows = document.querySelectorAll("#submissionsTable tbody tr");

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const status = statusFilter.value;

    rows.forEach(row => {
      const title = row.dataset.title.toLowerCase();
      const author = row.dataset.author.toLowerCase();
      const rowType = row.dataset.type;
      const rowStatus = row.dataset.status;

      const matchesSearch = title.includes(search) || author.includes(search);
      const matchesType = !type || rowType === type;
      const matchesStatus = !status || rowStatus === status;

      row.style.display = (matchesSearch && matchesType && matchesStatus) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTable);
  typeFilter.addEventListener("change", filterTable);
  statusFilter.addEventListener("change", filterTable);

  // Toggle dropdowns
  document.querySelectorAll("[class*='Manage']").forEach(button => {
    button.addEventListener("click", (e) => {
      const menu = button.parentElement.querySelector("div");
      menu.classList.toggle("hidden");
    });
  });
</script>


