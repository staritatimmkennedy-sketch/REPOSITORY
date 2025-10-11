// pages/materialType.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Material Type JS loaded');

    // --- Search ---
    const searchType = document.getElementById("searchType");
    const rows = document.querySelectorAll("#materialTypesTable tbody tr");

    function filterTypes() {
        const search = searchType?.value.toLowerCase() || '';
        rows.forEach(row => {
            const matches = 
                row.dataset.id.includes(search) ||
                row.dataset.name.includes(search) ||
                row.dataset.desc.includes(search);
            row.style.display = matches ? "" : "none";
        });
    }
    searchType?.addEventListener("input", filterTypes);

    // --- Dropdowns ---
    function initDropdowns() {
        document.querySelectorAll("#materialTypesTable .relative button").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const menu = btn.nextElementSibling;
                if (menu) {
                    document.querySelectorAll(".z-10").forEach(m => m.classList.add('hidden'));
                    menu.classList.toggle("hidden");
                }
            });
        });
    }
    document.addEventListener('click', () => {
        document.querySelectorAll(".z-10").forEach(m => m.classList.add('hidden'));
    });
    initDropdowns();

    // --- Modal Open/Close ---
    const addModal = document.getElementById('addMaterialTypeModal');
    const openBtn = document.getElementById('openAddMaterialType');
    const closeBtn = document.getElementById('closeAddMaterialType');

    openBtn?.addEventListener('click', () => {
        addModal?.classList.remove('hidden');
        setTimeout(() => addModal.style.opacity = '1', 10);
    });

    closeBtn?.addEventListener('click', () => {
        if (addModal) {
            addModal.style.opacity = '0';
            setTimeout(() => addModal.classList.add('hidden'), 300);
        }
    });

    addModal?.addEventListener('click', (e) => {
        if (e.target === addModal) {
            addModal.style.opacity = '0';
            setTimeout(() => addModal.classList.add('hidden'), 300);
        }
    });

    // --- ADD MATERIAL TYPE FORM SUBMISSION ---
    const form = document.getElementById('addMaterialTypeForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const materialTypeName = formData.get('materialTypeName');
            const materialTypeDescription = formData.get('materialTypeDescription');

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                const res = await fetch('pages/add_material_type.php', {
                    method: 'POST',
                    body: formData
                });

                let data;
                try {
                    data = await res.json();
                } catch (parseError) {
                    throw new Error('Invalid JSON response from server');
                }

                if (data.success) {
                    const tbody = document.querySelector('#materialTypesTable tbody');
                    if (tbody) {
                        const row = document.createElement('tr');
                        row.className = 'border-b hover:bg-gray-50';
                        row.dataset.id = data.materialType.id.toLowerCase();
                        row.dataset.name = data.materialType.name.toLowerCase();
                        row.dataset.desc = (data.materialType.desc || '').toLowerCase();
                        
                        row.innerHTML = `
                            <td class="px-4 py-3 text-sm">${escapeHtml(data.materialType.id)}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(data.materialType.name)}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(data.materialType.desc || '—')}</td>
                            <td class="px-4 py-3 text-center">
                                <div class="relative inline-block text-left">
                                    <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
                                        Manage ▾
                                    </button>
                                    <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                                        <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Type</a>
                                        <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Type</a>
                                    </div>
                                </div>
                            </td>
                        `;
                        
                        tbody.prepend(row);
                        initDropdowns();
                    }

                    form.reset();
                    addModal.style.opacity = '0';
                    setTimeout(() => addModal.classList.add('hidden'), 300);
                    showNotification('Material type added successfully!', 'success');
                } else {
                    showNotification('Error: ' + (data.message || 'Failed to add material type'), 'error');
                }
            } catch (err) {
                console.error('Error:', err);
                showNotification('Network error. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.fixed-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `fixed-notification fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 5000);
    }
});