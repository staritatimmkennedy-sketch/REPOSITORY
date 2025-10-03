<?php 
// NOTE: $pageTitle is defined in index.php and is available here.
// Expected pageTitle: Audit Logs
?>

<div id="auditLogs" class="p-6">
  <!-- Header -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      
      <!-- Extended Search -->
      <div class="relative flex-grow">
        <input type="text" id="searchLogs" placeholder="Search by user, action, description, or date..."
               class="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <!-- Filter: Action Type -->
      <select id="actionFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
        <option value="">All Actions</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
      </select>

      <!-- Filter: Date -->
      <input type="date" id="dateFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
    </div>
  </div>

  <!-- Audit Log Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse" id="auditTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">ID</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Timestamp</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">User ID</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Action Type</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">Description</th>
          <th class="px-4 py-3 text-sm font-semibold text-gray-600">IP Address</th>
        </tr>
      </thead>
      <tbody>
        <!-- Example Rows -->
        <tr class="border-b hover:bg-gray-50" data-action="create" data-user="2025001" data-date="2024-07-28">
          <td class="px-4 py-3 text-sm text-center">1001</td>
          <td class="px-4 py-3 text-sm text-center">2024-07-28 10:30:15</td>
          <td class="px-4 py-3 text-sm text-center font-mono">2025001</td>
          <td class="px-4 py-3 text-sm text-center">
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-400">CREATE</span>
          </td>
          <td class="px-4 py-3 text-sm text-center">Added new material: 'Introduction to C++'</td>
          <td class="px-4 py-3 text-sm text-center">192.168.1.5</td>
        </tr>

        <tr class="border-b hover:bg-gray-50" data-action="update" data-user="2025002" data-date="2024-07-28">
          <td class="px-4 py-3 text-sm text-center">1002</td>
          <td class="px-4 py-3 text-sm text-center">2024-07-28 10:45:22</td>
          <td class="px-4 py-3 text-sm text-center font-mono">2025002</td>
          <td class="px-4 py-3 text-sm text-center">
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-400">UPDATE</span>
          </td>
          <td class="px-4 py-3 text-sm text-center">Modified user role for 'Jane Doe' from Student to Faculty.</td>
          <td class="px-4 py-3 text-sm text-center">10.0.0.12</td>
        </tr>

        <tr class="hover:bg-gray-50" data-action="delete" data-user="2025003" data-date="2024-07-28">
          <td class="px-4 py-3 text-sm text-center">1003</td>
          <td class="px-4 py-3 text-sm text-center">2024-07-28 11:01:40</td>
          <td class="px-4 py-3 text-sm text-center font-mono">2025003</td>
          <td class="px-4 py-3 text-sm text-center">
            <span class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-400">DELETE</span>
          </td>
          <td class="px-4 py-3 text-sm text-center">Removed Material Record ID: 521.</td>
          <td class="px-4 py-3 text-sm text-center">192.168.1.5</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>




<!-- JS for Search + Filters -->
<script>
  const searchLogs = document.getElementById("searchLogs");
  const actionFilter = document.getElementById("actionFilter");
  const dateFilter = document.getElementById("dateFilter");
  const rows = document.querySelectorAll("#auditTable tbody tr");

  function filterLogs() {
    const search = searchLogs.value.toLowerCase();
    const action = actionFilter.value.toLowerCase();
    const date = dateFilter.value;

    rows.forEach(row => {
      const matchesSearch = row.innerText.toLowerCase().includes(search);
      const matchesAction = !action || row.dataset.action === action;
      const matchesDate = !date || row.dataset.date === date;

      row.style.display = (matchesSearch && matchesAction && matchesDate) ? "" : "none";
    });
  }

  searchLogs.addEventListener("input", filterLogs);
  actionFilter.addEventListener("change", filterLogs);
  dateFilter.addEventListener("change", filterLogs);
</script>
