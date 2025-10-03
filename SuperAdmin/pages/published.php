<div id="publishedMaterials" class="p-6">
  <!-- Header -->
  <div class="bg-white border rounded-lg p-4 mb-6 shadow-sm">
    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <!-- Search -->
      <input type="text" id="searchInput" placeholder="Search by title"
             class="flex-grow px-4 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">

      <!-- Filters -->
      <div class="flex flex-wrap gap-3">
        <!-- Department Filter -->
        <select id="deptFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
          <option value="">All Departments</option>
          <option value="College of Engineering, Architecture and Technology">Engineering, Architecture & Tech</option>
          <option value="College of Health Sciences">Health Sciences</option>
          <option value="College of Education">Education</option>
          <option value="Business College">Business College</option>
          <option value="College of Arts and Science">Arts & Science</option>
        </select>

        <!-- Material Type Filter -->
        <select id="typeFilter" class="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-green-500 focus:outline-none">
          <option value="">All Types</option>
          <option value="Book">Book</option>
          <option value="Thesis">Thesis</option>
          <option value="Research Paper">Research Paper</option>
          <option value="Journal">Journal</option>
        </select>
      </div>
    </div>
  </div>

  <!-- Materials Table -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <table class="w-full border-collapse" id="materialsTable">
      <thead class="bg-gray-100 border-b">
        <tr>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Material Type</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Author</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
          <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">Department</th>
          <th class="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Dummy Data Rows -->
        <tr class="border-b hover:bg-gray-50"
            data-title="Introduction to Databases"
            data-author="Doe, John"
            data-type="Book"
            data-dept="College of Engineering, Architecture and Technology"
            data-status="Available">
          <td class="px-4 py-3 text-sm">Introduction to Databases</td>
          <td class="px-4 py-3 text-sm">Book</td>
          <td class="px-4 py-3 text-sm">Doe, John</td>
          <td class="px-4 py-3 text-sm">Covers relational database design and SQL basics.</td>
          <td class="px-4 py-3 text-sm">College of Engineering, Architecture and Technology</td>
          <td class="px-4 py-3 text-center">
          <button class="w-36 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
            Request Material
          </button>
        </td>

        </tr>

        <tr class="border-b hover:bg-gray-50"
            data-title="Human Anatomy and Physiology"
            data-author="Smith, Jane"
            data-type="Thesis"
            data-dept="College of Health Sciences"
            data-status="Unavailable">
          <td class="px-4 py-3 text-sm">Human Anatomy and Physiology</td>
          <td class="px-4 py-3 text-sm">Thesis</td>
          <td class="px-4 py-3 text-sm">Smith, Jane</td>
          <td class="px-4 py-3 text-sm">A study of the cardiovascular system in athletes.</td>
          <td class="px-4 py-3 text-sm">College of Health Sciences</td>
          <td class="px-4 py-3 text-center">
          <button class="w-36 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
            Request Material
          </button>
        </td>
        </tr>

        <tr class="border-b hover:bg-gray-50"
            data-title="Teaching Strategies for Digital Natives"
            data-author="Garcia, Maria"
            data-type="Research Paper"
            data-dept="College of Education"
            data-status="Available">
          <td class="px-4 py-3 text-sm">Teaching Strategies for Digital Natives</td>
          <td class="px-4 py-3 text-sm">Research Paper</td>
          <td class="px-4 py-3 text-sm">Garcia, Maria</td>
          <td class="px-4 py-3 text-sm">Explores innovative methods for engaging Gen Z learners.</td>
          <td class="px-4 py-3 text-sm">College of Education</td>
          <td class="px-4 py-3 text-center">
          <button class="w-36 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
            Request Material
          </button>
        </td>
        </tr>

        <tr class="border-b hover:bg-gray-50"
            data-title="Entrepreneurship in the Digital Era"
            data-author="Lopez, Carlos"
            data-type="Journal"
            data-dept="Business College"
            data-status="Available">
          <td class="px-4 py-3 text-sm">Entrepreneurship in the Digital Era</td>
          <td class="px-4 py-3 text-sm">Journal</td>
          <td class="px-4 py-3 text-sm">Lopez, Carlos</td>
          <td class="px-4 py-3 text-sm">Insights on startups and e-commerce growth in Southeast Asia.</td>
          <td class="px-4 py-3 text-sm">Business College</td>
          <td class="px-4 py-3 text-center">
          <button class="w-36 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
            Request Material
          </button>
        </td>
        </tr>

        <tr class="hover:bg-gray-50"
            data-title="The Role of Philosophy in Modern Society"
            data-author="Reyes, Ana"
            data-type="Book"
            data-dept="College of Arts and Science"
            data-status="Unavailable">
          <td class="px-4 py-3 text-sm">The Role of Philosophy in Modern Society</td>
          <td class="px-4 py-3 text-sm">Book</td>
          <td class="px-4 py-3 text-sm">Reyes, Ana</td>
          <td class="px-4 py-3 text-sm">Analyzes philosophical ideas shaping contemporary ethics.</td>
          <td class="px-4 py-3 text-sm">College of Arts and Science</td>
          <td class="px-4 py-3 text-center">
          <button class="w-36 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
            Request Material
          </button>
        </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- Simple JS Filtering -->
<script>
  const searchInput = document.getElementById("searchInput");
  const typeFilter = document.getElementById("typeFilter");
  const deptFilter = document.getElementById("deptFilter");
  const rows = document.querySelectorAll("#materialsTable tbody tr");

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const type = typeFilter.value;
    const dept = deptFilter.value;

    rows.forEach(row => {
      const title = row.dataset.title.toLowerCase();
      const author = row.dataset.author.toLowerCase();
      const rowType = row.dataset.type;
      const rowDept = row.dataset.dept;

      const matchesSearch = title.includes(search) || author.includes(search);
      const matchesType = !type || rowType === type;
      const matchesDept = !dept || rowDept === dept;

      row.style.display = (matchesSearch && matchesType && matchesDept) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTable);
  typeFilter.addEventListener("change", filterTable);
  deptFilter.addEventListener("change", filterTable);
</script>
