  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");
  const rows = document.querySelectorAll("#borrowedTable tbody tr");
  const dropdowns = document.querySelectorAll('.dropdown');

  // Handle dropdown positioning and visibility
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close all other dropdowns
      dropdowns.forEach(d => {
        if (d !== dropdown) {
          d.querySelector('.dropdown-menu').classList.add('hidden');
        }
      });

      // Toggle current dropdown
      menu.classList.toggle('hidden');

      // Smart positioning
      const rect = menu.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.right;

      // Position above if not enough space below
      if (spaceBelow < 20) {
        menu.style.bottom = '100%';
        menu.style.top = 'auto';
      } else {
        menu.style.top = '100%';
        menu.style.bottom = 'auto';
      }

      // Position left if not enough space on right
      if (spaceRight < 20) {
        menu.style.right = '0';
        menu.style.left = 'auto';
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    dropdowns.forEach(dropdown => {
      dropdown.querySelector('.dropdown-menu').classList.add('hidden');
    });
  });

  function filterTable() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;

    rows.forEach(row => {
      const title = row.dataset.title.toLowerCase();
      const author = row.dataset.author.toLowerCase();
      const rowStatus = row.dataset.status;

      const matchesSearch = title.includes(search) || author.includes(search);
      const matchesStatus = !status || rowStatus === status;

      row.style.display = (matchesSearch && matchesStatus) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterTable);
  statusFilter.addEventListener("change", filterTable);