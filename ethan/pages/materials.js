document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchType');
  const table       = document.getElementById('materialsTable');
  const editModal   = document.getElementById('editModal');
  const deleteModal = document.getElementById('deleteModal');
  const performSearch = () => {
    const q = searchInput.value.trim().toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  };
  searchInput.addEventListener('input', performSearch);

  const toggleDropdown = btn => {
    const menu = btn.parentElement.querySelector('.absolute');
    const open = !menu.classList.contains('hidden');
    table.querySelectorAll('.absolute').forEach(m => m.classList.add('hidden'));
    if (!open) menu.classList.remove('hidden');
  };

  table.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn && btn.textContent.trim().includes('Manage')) {
      e.stopPropagation();
      toggleDropdown(btn);
    }
  });

  document.addEventListener('click', () => {
    table.querySelectorAll('.absolute').forEach(m => m.classList.add('hidden'));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      table.querySelectorAll('.absolute').forEach(m => m.classList.add('hidden'));
    }
  });

  table.addEventListener('click', async e => {
    if (e.target.classList.contains('edit-material')) {
      e.preventDefault(); e.stopPropagation();
      const row = e.target.closest('tr');
      const id  = row.cells[0].textContent.trim();
      try {
        const r = await fetch(`pages/get_material_details.php?id=${id}`);
        if (!r.ok) throw new Error('Network error');
        const d = await r.json();
        if (d.error) throw new Error(d.error);

        document.getElementById('editPublishingId').value = d.materialPublishing_id;
        document.getElementById('editName').value        = d.materialName;
        document.getElementById('editDesc').value        = d.materialDescription;
        document.getElementById('editFirst').value       = d.author_firstname || '';
        document.getElementById('editMI').value          = d.author_mi || '';
        document.getElementById('editLast').value        = d.author_lastname || '';
        document.getElementById('editCall').value        = d.callNumber;
        editModal.classList.remove('hidden');
      } catch (err) {
        console.error(err);
        alert('Cannot load material details: ' + err.message);
      }
    }

    if (e.target.classList.contains('delete-material')) {
      e.preventDefault(); e.stopPropagation();
      const id = e.target.closest('tr').cells[0].textContent.trim();
      document.getElementById('deletePublishingId').value = id;
      deleteModal.classList.remove('hidden');
    }
  });

  document.getElementById('closeEdit')?.addEventListener('click', e => {
    e.stopPropagation();
    editModal.classList.add('hidden');
  });
  document.getElementById('closeDelete')?.addEventListener('click', e => {
    e.stopPropagation();
    deleteModal.classList.add('hidden');
  });

  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async e => {
      e.preventDefault();
      e.stopPropagation();
      const payload = {
        id   : parseInt(document.getElementById('editPublishingId').value),
        name : document.getElementById('editName').value.trim(),
        desc : document.getElementById('editDesc').value.trim(),
        first: document.getElementById('editFirst').value.trim(),
        mi   : document.getElementById('editMI').value.trim(),
        last : document.getElementById('editLast').value.trim(),
        call : document.getElementById('editCall').value.trim()
      };

      try {
        const r = await fetch('pages/update_material.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const res = await r.json();
        if (res.rowcount > 0) {
          const row = [...table.querySelectorAll('tbody tr')].find(
            r => r.cells[0].textContent.trim() === payload.id.toString()
          );
          row.cells[1].textContent = payload.name;
          const descCell = row.cells[2];
          descCell.title = payload.desc;
          descCell.textContent = payload.desc.length > 80 ? payload.desc.substr(0,77)+'...' : payload.desc;
          const author = [payload.first, payload.mi ? payload.mi+'.' : '', payload.last].filter(Boolean).join(' ');
          row.cells[3].textContent = author || '—';
          row.cells[4].textContent = payload.call;
          editModal.classList.add('hidden');
        } else {
          alert('No changes were saved. (rowcount = 0)');
        }
      } catch (err) {
        console.error('Save error:', err);
        alert('Save failed: ' + err.message);
      }
    });
  }
  const confirmDelete = document.getElementById('confirmDelete');
  if (confirmDelete) {
    confirmDelete.addEventListener('click', async e => {
      e.stopPropagation();
      const id = document.getElementById('deletePublishingId').value.trim();
      try {
        const r = await fetch('pages/delete_material.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: parseInt(id) })
        });

        if (!r.ok) {
          const text = await r.text();
          throw new Error(`HTTP ${r.status}: ${text}`);
        }

        const res = await r.json();
        if (res.rowcount > 0) {
          const row = [...table.querySelectorAll('tbody tr')].find(
            r => r.cells[0].textContent.trim() === id
          );
          if (row) row.remove();

          // Show "No materials" if table is empty
          if (!table.querySelector('tbody tr:not(.empty-row)')) {
            table.querySelector('tbody').innerHTML = `
              <tr>
                <td colspan="9" class="px-4 py-8 text-center text-gray-500">
                  No published materials found.
                </td>
              </tr>
            `;
          }

          deleteModal.classList.add('hidden');
          showSuccess('Material removed successfully!');
        } else {
          alert('No row was deleted. (rowcount = 0)');
        }
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Delete failed: ' + err.message);
      }
    });
  }
});