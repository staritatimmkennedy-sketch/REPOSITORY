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

  // Toggle Manage dropdowns (delegated) — ensures one open at a time
  const tableBody = document.querySelector('#materialsTable tbody');
  if (tableBody) {
    tableBody.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      // ensure this is a manage button inside the table rows
      const row = button.closest('tr');
      if (!row) return;

      e.stopPropagation();

      const container = button.closest('.relative');
      const menu = container?.querySelector('div.absolute') || container?.querySelector('.absolute');
      if (!menu) return;

      // Close other dropdowns and reset their inline styles
      document.querySelectorAll('#materialsTable .relative .absolute').forEach(d => {
        if (d !== menu) {
          d.classList.add('hidden');
          d.style.left = '';
          d.style.right = '';
          d.style.top = '';
          d.style.bottom = '';
          d.style.marginTop = '';
          d.style.marginBottom = '';
          d.style.transform = '';
          d.style.visibility = '';
        }
      });

      const willShow = menu.classList.contains('hidden');

      if (willShow) {
        // Make it renderable (but invisible) so measurements are accurate
        menu.style.visibility = 'hidden';
        menu.classList.remove('hidden');
        // Force reflow
        // eslint-disable-next-line no-unused-expressions
        menu.offsetHeight;

        const btnRect = button.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Horizontal: flip to right if it would overflow the viewport
        if (btnRect.right + menuRect.width > viewportWidth) {
          menu.style.right = '0';
          menu.style.left = 'auto';
        } else {
          menu.style.left = '0';
          menu.style.right = 'auto';
        }

        // Vertical: open upward if there's not enough space below but enough above
        const spaceBelow = viewportHeight - btnRect.bottom;
        const spaceAbove = btnRect.top;

        if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
          menu.style.bottom = '100%';
          menu.style.top = 'auto';
          menu.style.marginBottom = '0.25rem';
          menu.style.marginTop = '';
          menu.style.transform = 'translateY(-4px)';
        } else {
          menu.style.top = '100%';
          menu.style.bottom = 'auto';
          menu.style.marginTop = '0.25rem';
          menu.style.marginBottom = '';
          menu.style.transform = 'translateY(4px)';
        }

        // Reveal
        menu.style.visibility = '';
      } else {
        // Hide and reset inline styles
        menu.classList.add('hidden');
        menu.style.left = '';
        menu.style.right = '';
        menu.style.top = '';
        menu.style.bottom = '';
        menu.style.marginTop = '';
        menu.style.marginBottom = '';
        menu.style.transform = '';
        menu.style.visibility = '';
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('#materialsTable .relative .absolute').forEach(d => d.classList.add('hidden'));
  });