// pages/materialType.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Material Type JS loaded');

    if (typeof toggleModal !== 'function' || typeof showToast !== 'function') {
        console.warn("toggleModal or showToast not found. Using fallbacks.");
    }

    const searchType = document.getElementById("searchType");
    let allRows = Array.from(document.querySelectorAll("#materialTypesTable tbody tr"));
    
    initializeAllHandlers();
    initializeAddModalHandlers();

    function filterTypes() {
        const search = searchType?.value.toLowerCase() || '';
        allRows.forEach(row => {
            const matches = 
                row.dataset.id.includes(search) ||
                row.dataset.name.includes(search) ||
                row.dataset.desc.includes(search);
            row.style.display = matches ? "" : "none";
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    const debouncedFilterTypes = debounce(filterTypes, 300);
    searchType?.addEventListener("input", debouncedFilterTypes);

    function initializeAllHandlers() {
        initializeDropdownDelegation();
        initializeCRUDHandlers();
        allRows = Array.from(document.querySelectorAll("#materialTypesTable tbody tr"));
    }

    function initializeDropdownDelegation() {
        const tableBody = document.querySelector("#materialTypesTable tbody");
        if (!tableBody) return;
        tableBody.removeEventListener('click', handleTableBodyClick);
        tableBody.addEventListener('click', handleTableBodyClick);
    }

    function handleTableBodyClick(e) {
        const toggleBtn = e.target.closest('.dropdown-toggle');
        if (!toggleBtn) return;
        e.stopPropagation();
        const menu = toggleBtn.closest('.relative')?.querySelector('.dropdown-menu');
        if (!menu) return;
        const isHidden = menu.classList.contains('hidden');
        document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.add('hidden'));
        if (isHidden) {
            menu.classList.remove("hidden");
            
            // Get button and menu dimensions
            const buttonRect = toggleBtn.getBoundingClientRect();
            const menuRect = menu.getBoundingClientRect();
            
            // Get viewport and scroll dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const scrollY = window.scrollY || window.pageYOffset;
            
            // Check if menu goes beyond right edge
            if (buttonRect.right + menuRect.width > viewportWidth) {
                menu.style.right = '0';
                menu.style.left = 'auto';
            } else {
                menu.style.left = '0';
                menu.style.right = 'auto';
            }
            
            // Check if menu goes beyond bottom edge of viewport
            const buttonTop = buttonRect.top + scrollY; // Absolute position from top of document
            const viewportBottom = scrollY + viewportHeight;
            const spaceBelow = viewportHeight - (buttonRect.bottom - scrollY);
            const spaceAbove = buttonRect.top - scrollY;
            
            if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
                // More space above than below
                menu.style.bottom = '100%';
                menu.style.top = 'auto';
                menu.style.marginBottom = '0.25rem'; // 4px margin
                menu.style.marginTop = '0';
            } else {
                // More space below or equal
                menu.style.top = '100%';
                menu.style.bottom = 'auto';
                menu.style.marginTop = '0.25rem'; // 4px margin
                menu.style.marginBottom = '0';
            }
        }
    }

    document.removeEventListener('click', closeAllDropdowns);
    document.addEventListener('click', closeAllDropdowns);

    function closeAllDropdowns() {
        document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.add('hidden'));
    }

    function initializeCRUDHandlers() {
        const tableBody = document.querySelector("#materialTypesTable tbody");
        if (!tableBody) return;
        tableBody.removeEventListener('click', handleCRUDClicks);
        tableBody.addEventListener('click', handleCRUDClicks);
    }

    function handleCRUDClicks(e) {
        const btn = e.target.closest('.view-type-btn, .edit-type-btn, .delete-type-btn');
        if (!btn) return;
        e.preventDefault();
        const dropdownMenu = btn.closest('.dropdown-menu');
        if (dropdownMenu) dropdownMenu.classList.add('hidden');
        const row = btn.closest('tr');
        if (!row) return;
        const typeId = row.dataset.id;
        const actualTypeName = row.querySelector('td:nth-child(2)').textContent;

        if (btn.classList.contains('delete-type-btn')) {
            openDeleteTypeModal(typeId, actualTypeName);
        } else if (btn.classList.contains('edit-type-btn')) {
            openUpdateTypeModal(typeId, false);
        } else if (btn.classList.contains('view-type-btn')) {
            openUpdateTypeModal(typeId, true);
        }
    }

    function initializeAddModalHandlers() {
        const openAddBtn = document.getElementById('openAddMaterialType');
        const closeAddBtn = document.getElementById('closeAddMaterialType');
        const addForm = document.getElementById('addMaterialTypeForm');
        const addModal = document.getElementById('addMaterialTypeModal');

        if (openAddBtn) {
            openAddBtn.addEventListener('click', () => {
                if (typeof toggleModal === 'function') {
                    toggleModal('addMaterialTypeModal', true);
                } else {
                    addModal.classList.remove('hidden');
                    setTimeout(() => { addModal.classList.remove('opacity-0'); }, 10);
                }
            });
        }

        if (closeAddBtn) {
            closeAddBtn.addEventListener('click', () => {
                if (typeof toggleModal === 'function') {
                    toggleModal('addMaterialTypeModal', false);
                } else {
                    addModal.classList.add('opacity-0');
                    setTimeout(() => { addModal.classList.add('hidden'); }, 300);
                }
                addForm.reset();
            });
        }

        if (addModal) {
            addModal.addEventListener('click', (e) => {
                if (e.target === addModal) {
                    if (typeof toggleModal === 'function') {
                        toggleModal('addMaterialTypeModal', false);
                    } else {
                        addModal.classList.add('opacity-0');
                        setTimeout(() => { addModal.classList.add('hidden'); }, 300);
                    }
                    addForm.reset();
                }
            });
        }

        if (addForm) {
            addForm.addEventListener('submit', handleAddMaterialType);
        }
    }

    async function handleAddMaterialType(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true, 'Save');

        try {
            const formData = new FormData(form);
            const response = await fetch('pages/add_material_type.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.success) {
                if (typeof showToast === 'function') {
                    showToast(data.message || 'Material type added successfully!', 'success');
                }
                if (typeof toggleModal === 'function') {
                    toggleModal('addMaterialTypeModal', false);
                } else {
                    const modal = document.getElementById('addMaterialTypeModal');
                    modal.classList.add('opacity-0');
                    setTimeout(() => { modal.classList.add('hidden'); }, 300);
                }
                form.reset();
                addNewTableRow(data.materialType);
            } else {
                throw new Error(data.message || 'Failed to add material type');
            }
        } catch (err) {
            handleError(err, 'adding material type');
        } finally {
            setLoadingState(submitBtn, false, 'Save');
        }
    }

    function addNewTableRow(typeData) {
        const tableBody = document.querySelector("#materialTypesTable tbody");
        if (!tableBody) return;

        const noDataRow = tableBody.querySelector('tr td[colspan]');
        if (noDataRow) {
            noDataRow.closest('tr').remove();
        }

        const newRow = document.createElement('tr');
        newRow.className = 'border-b hover:bg-gray-50';
        
        // ✅ FIXED: Do NOT lowercase ID
        newRow.setAttribute('data-id', typeData.id || '');
        newRow.setAttribute('data-name', (typeData.name || '').toLowerCase());
        newRow.setAttribute('data-desc', (typeData.desc || '').toLowerCase());

        newRow.innerHTML = `
            <td class="px-4 py-3 text-sm">${typeData.id || ''}</td>
            <td class="px-4 py-3 text-sm">${typeData.name || ''}</td>
            <td class="px-4 py-3 text-sm">${typeData.desc || '—'}</td>
            <td class="px-4 py-3 text-center">
                <div class="relative inline-block text-left">
                    <button type="button" class="dropdown-toggle w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
                        Manage ▾
                    </button>
                    <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
                        <a href="#" class="edit-type-btn block px-4 py-2 text-sm hover:bg-gray-100">Edit Type</a>
                        <a href="#" class="view-type-btn block px-4 py-2 text-sm hover:bg-gray-100">View Type</a>
                        <a href="#" class="delete-type-btn block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Type</a>
                    </div>
                </div>
            </td>
        `;

        tableBody.prepend(newRow);
        allRows = Array.from(document.querySelectorAll("#materialTypesTable tbody tr"));
        // ✅ REMOVED: initializeAllHandlers() — not needed due to delegation
        console.log('New row added successfully:', typeData);
    }

    async function openUpdateTypeModal(typeId, isView = false) {
        if (!typeId) return;

        const modalTitleEl = document.getElementById('updateTypeModalTitle');
        const submitBtn = document.getElementById('updateMaterialTypeSubmit');
        modalTitleEl.textContent = 'Loading...';
        submitBtn.style.display = 'none';
        
        if (typeof toggleModal === 'function') toggleModal('updateMaterialTypeModal', true);
        
        try {
            const response = await fetch(`pages/get_material_type.php?id=${encodeURIComponent(typeId)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();

            if (result.success) {
                const data = result.materialType;
                document.getElementById('updateMaterialTypeId').value = data.id;
                document.getElementById('updateMaterialTypeName').value = data.name;
                document.getElementById('updateMaterialTypeDescription').value = data.desc;

                const nameInput = document.getElementById('updateMaterialTypeName');
                const descInput = document.getElementById('updateMaterialTypeDescription');
                nameInput.disabled = isView;
                descInput.disabled = isView;

                modalTitleEl.textContent = isView ? `View Material Type: ${data.name}` : `Edit Material Type: ${data.name}`;
                submitBtn.style.display = isView ? 'none' : 'block';
                submitBtn.textContent = 'Save Changes';
                setLoadingState(submitBtn, false);
            } else {
                throw new Error(result.message || 'Failed to load details.');
            }
        } catch (error) {
            handleError(error, 'loading material type details');
            if (typeof toggleModal === 'function') toggleModal('updateMaterialTypeModal', false); 
        }
    }

    function openDeleteTypeModal(typeId, typeName) {
        if (!typeId) return;
        document.getElementById('deleteMaterialTypeId').value = typeId;
        document.getElementById('deleteMaterialTypeName').textContent = typeName;
        if (typeof toggleModal === 'function') toggleModal('deleteMaterialTypeModal', true);
    }
    
    const updateMaterialTypeForm = document.getElementById('updateMaterialTypeForm');
    if (updateMaterialTypeForm) {
        updateMaterialTypeForm.addEventListener('submit', handleUpdateMaterialType);
    }
    
    async function handleUpdateMaterialType(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true);

        try {
            const formData = new FormData(form);
            const response = await fetch('pages/update_material_type.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.success) {
                if (typeof showToast === 'function') showToast(data.message || 'Material type updated successfully!', 'success');
                if (typeof toggleModal === 'function') toggleModal('updateMaterialTypeModal', false);
                updateTableRow(data.materialType);
            } else {
                throw new Error(data.message || 'Failed to update material type');
            }
        } catch (err) {
            handleError(err, 'updating material type');
        } finally {
            setLoadingState(submitBtn, false);
        }
    }

    const deleteMaterialTypeForm = document.getElementById('deleteMaterialTypeForm');
    if (deleteMaterialTypeForm) {
        deleteMaterialTypeForm.addEventListener('submit', handleDeleteMaterialType);
    }
    
    async function handleDeleteMaterialType(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true, 'Delete Type');

        try {
            const formData = new FormData(form);
            const response = await fetch('pages/delete_material_type.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (data.success) {
                if (typeof showToast === 'function') showToast(data.message || 'Material type deleted successfully!', 'success');
                if (typeof toggleModal === 'function') toggleModal('deleteMaterialTypeModal', false);
                removeTableRow(data.materialType_id);
            } else {
                throw new Error(data.message || 'Failed to delete material type');
            }
        } catch (err) {
            handleError(err, 'deleting material type');
        } finally {
            setLoadingState(submitBtn, false, 'Delete Type');
        }
    }

    function setLoadingState(element, isLoading, originalText = 'Save Changes') {
        if (!element) return;
        if (isLoading) {
            element.disabled = true;
            element.setAttribute('data-original-text', element.textContent);
            element.textContent = 'Loading...';
        } else {
            element.disabled = false;
            const textToRestore = element.getAttribute('data-original-text') || originalText;
            element.textContent = textToRestore;
            element.removeAttribute('data-original-text');
        }
    }

    function handleError(error, context = 'operation') {
        console.error(`Error in ${context}:`, error);
        let userMessage = error.message;
        if (typeof showToast === 'function') showToast(userMessage, 'error');
    }
    
    // ✅ FIXED: Use CSS.escape and exact ID match
    function updateTableRow(typeData) {
        const escapedId = CSS.escape(typeData.id);
        const row = document.querySelector(`#materialTypesTable tbody tr[data-id="${escapedId}"]`);
        if (!row) {
            console.warn("Row not found for ID:", typeData.id);
            return;
        }

        row.querySelector('td:nth-child(2)').textContent = typeData.name;
        row.querySelector('td:nth-child(3)').textContent = typeData.desc || '—';

        row.dataset.name = (typeData.name || '').toLowerCase();
        row.dataset.desc = (typeData.desc || '').toLowerCase();

        filterTypes(); // Re-apply current filter
    }

    function removeTableRow(typeId) {
        const row = document.querySelector(`#materialTypesTable tbody tr[data-id="${CSS.escape(typeId)}"]`);
        if (row) {
            row.remove();
            allRows = allRows.filter(r => r !== row);
            const tableBody = document.querySelector("#materialTypesTable tbody");
            if (tableBody && tableBody.children.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="px-4 py-3 text-center">No material types found.</td></tr>';
            }
            // ✅ REMOVED: initializeAllHandlers()
        }
    }
});