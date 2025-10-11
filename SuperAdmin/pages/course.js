document.addEventListener('DOMContentLoaded', () => {
  // --- Search & Filter ---
  const searchInput = document.getElementById('searchCourse');
  const collegeFilter = document.getElementById('collegeFilter');
  const rows = document.querySelectorAll('#courseTable tbody tr');

  function filterTable() {
    const searchTerm = searchInput?.value.trim().toLowerCase() || '';
    const collegeFilterVal = collegeFilter?.value.toLowerCase() || '';

    rows.forEach(row => {
      const id = row.dataset.id || '';
      const name = row.dataset.name || '';
      const college = row.dataset.college || '';

      const matchesSearch = id.includes(searchTerm) || name.includes(searchTerm);
      const matchesCollege = !collegeFilterVal || college === collegeFilterVal;

      row.style.display = matchesSearch && matchesCollege ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', filterTable);
  collegeFilter?.addEventListener('change', filterTable);
  // --- Dropdowns ---
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    const btn = menu.previousElementSibling;
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
        menu.classList.toggle('hidden');
      });
    }
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
  });

  // --- Modal Open Only ---
  const openBtn = document.getElementById('openAddCourse');
  const openModal = () => {
    toggleModal('modal-course', true);
  };
  openBtn?.addEventListener('click', openModal);
});