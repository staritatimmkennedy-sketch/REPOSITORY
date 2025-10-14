// pages/materialType.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Material Type JS loaded');

    // Assumes global toggleModal and showToast functions exist in app.js
    if (typeof toggleModal !== 'function' || typeof showToast !== 'function') {
        console.warn("toggleModal or showToast not found. Using fallbacks.");
    }

    // --- State & Initialization ---
    const searchType = document.getElementById("searchType");
    let allRows = Array.from(document.querySelectorAll("#materialTypesTable tbody tr"));
    
    // Initializers
    initializeDropdownDelegation();
    initializeCRUDHandlers();
    initializeAddModalHandlers();

    // --- Filtering ---
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

    // Use a debounced function for search input for performance
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

    // --- Dropdown Fix (Using Event Delegation) ---
    
    function initializeDropdownDelegation() {
        const tableBody = document.querySelector("#materialTypesTable tbody");
        if (!tableBody) return;

        // Use event delegation on the table body to catch clicks on any .dropdown-toggle button
        tableBody.addEventListener('click', function(e) {
            const toggleBtn = e.target.closest('.dropdown-toggle');
            if (!toggleBtn) return;
            
            e.stopPropagation(); // Prevents global closeAllDropdowns from firing immediately
            
            // Find the dropdown menu by traversing up to the closest relative container
            const menu = toggleBtn.closest('.relative')?.querySelector('.dropdown-menu');
            if (!menu) return;

            const isHidden = menu.classList.contains('hidden');
            
            // 1. Close ALL menus first (Ensures only one is open)
            document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.add('hidden'));

            // 2. If the clicked menu was originally hidden, show it now
            if (isHidden) {
                menu.classList.remove("hidden");
            }
        });
    }

    // Global listener to close dropdowns when clicking outside
    document.removeEventListener('click', closeAllDropdowns);
    document.addEventListener('click', closeAllDropdowns);

    function closeAllDropdowns() {
        document.querySelectorAll(".dropdown-menu").forEach(m => m.classList.add('hidden'));
    }

    // --- CRUD Handlers ---

    function initializeCRUDHandlers() {
        const tableBody = document.querySelector("#materialTypesTable tbody");
        if (!tableBody) return;

        // Use event delegation for all dynamic action buttons
        tableBody.addEventListener('click', function(e) {
            const btn = e.target.closest('.view-type-btn, .edit-type-btn, .delete-type-btn');
            if (!btn) return;
            
            e.preventDefault();
            
            // Close the dropdown menu after clicking an action
            const dropdownMenu = btn.closest('.dropdown-menu');
            if (dropdownMenu) dropdownMenu.classList.add('hidden');

            const row = btn.closest('tr');
            if (!row) return;

            const typeId = row.dataset.id;
            const typeName = row.dataset.name;
            const actualTypeName = row.querySelector('td:nth-child(2)').textContent;

            if (btn.classList.contains('delete-type-btn')) {
                openDeleteTypeModal(typeId, actualTypeName);
            } else if (btn.classList.contains('edit-type-btn')) {
                openUpdateTypeModal(typeId, false); // Edit mode
            } else if (btn.classList.contains('view-type-btn')) {
                openUpdateTypeModal(typeId, true); // View mode
            }
        });
    }

    // --- Add Material Type Modal Handlers ---
    function initializeAddModalHandlers() {
        const openAddBtn = document.getElementById('openAddMaterialType');
        const closeAddBtn = document.getElementById('closeAddMaterialType');
        const addForm = document.getElementById('addMaterialTypeForm');
        const addModal = document.getElementById('addMaterialTypeModal');

        // Open Add Modal
        if (openAddBtn) {
            openAddBtn.addEventListener('click', () => {
                if (typeof toggleModal === 'function') {
                    toggleModal('addMaterialTypeModal', true);
                } else {
                    // Fallback if toggleModal doesn't exist
                    addModal.classList.remove('hidden');
                    setTimeout(() => { addModal.classList.remove('opacity-0'); }, 10);
                }
            });
        }

        // Close Add Modal
        if (closeAddBtn) {
            closeAddBtn.addEventListener('click', () => {
                if (typeof toggleModal === 'function') {
                    toggleModal('addMaterialTypeModal', false);
                } else {
                    // Fallback if toggleModal doesn't exist
                    addModal.classList.add('opacity-0');
                    setTimeout(() => { addModal.classList.add('hidden'); }, 300);
                }
                addForm.reset(); // Reset form when closing
            });
        }

        // Close modal when clicking outside
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

        // Handle Add Form Submission
        if (addForm) {
            addForm.addEventListener('submit', handleAddMaterialType);
        }
    }

    // Handle Add Material Type Form Submission
    async function handleAddMaterialType(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Set loading state
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
                
                // Close modal
                if (typeof toggleModal === 'function') {
                    toggleModal('addMaterialTypeModal', false);
                } else {
                    const modal = document.getElementById('addMaterialTypeModal');
                    modal.classList.add('opacity-0');
                    setTimeout(() => { modal.classList.add('hidden'); }, 300);
                }
                
                // Reset form
                form.reset();
                
                // Add new row to table
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

    // Add new row to the table
    function addNewTableRow(typeData) {
    const tableBody = document.querySelector("#materialTypesTable tbody");
    if (!tableBody) return;

    // Remove "No material types found" message if it exists
    const noDataRow = tableBody.querySelector('tr td[colspan]');
    if (noDataRow) {
        noDataRow.closest('tr').remove();
    }

    // Create new row with the correct data structure
    const newRow = document.createElement('tr');
    newRow.className = 'border-b hover:bg-gray-50';
    
    // Set data attributes for filtering - use lowercase for consistency
    newRow.setAttribute('data-id', (typeData.id || '').toLowerCase());
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
                <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                    <a href="#" class="edit-type-btn block px-4 py-2 text-sm hover:bg-gray-100">Edit Type</a>
                    <a href="#" class="view-type-btn block px-4 py-2 text-sm hover:bg-gray-100">View Type</a>
                    <a href="#" class="delete-type-btn block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Type</a>
                </div>
            </div>
        </td>
    `;

    // Add to beginning of table
    tableBody.prepend(newRow);
    
    // Update allRows array for filtering - CRITICAL: This was missing!
    allRows = Array.from(document.querySelectorAll("#materialTypesTable tbody tr"));
    
    // Re-initialize dropdown delegation for the new row
    initializeDropdownDelegation();

    console.log('New row added successfully:', typeData);
}

    // --- Modal Functions (Update/View/Delete) ---

    // Update/View Material Type Modal (Open & Fetch)
    async function openUpdateTypeModal(typeId, isView = false) {
        if (!typeId) return;

        const modalTitleEl = document.getElementById('updateTypeModalTitle');
        const submitBtn = document.getElementById('updateMaterialTypeSubmit');
        
        modalTitleEl.textContent = 'Loading...';
        submitBtn.style.display = 'none';
        
        if (typeof toggleModal === 'function') toggleModal('updateMaterialTypeModal', true);
        
        try {
            // New PHP file to fetch data
            const response = await fetch(`pages/get_material_type.php?id=${typeId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();

            if (result.success) {
                const data = result.materialType;
                
                // Populate Form
                document.getElementById('updateMaterialTypeId').value = data.id;
                document.getElementById('updateMaterialTypeName').value = data.name;
                document.getElementById('updateMaterialTypeDescription').value = data.desc;

                // Set Read-only state
                const nameInput = document.getElementById('updateMaterialTypeName');
                const descInput = document.getElementById('updateMaterialTypeDescription');
                nameInput.disabled = isView;
                descInput.disabled = isView;
                
                // Update Modal Content
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

    // Delete Material Type Modal (Open)
    function openDeleteTypeModal(typeId, typeName) {
        if (!typeId) return;

        document.getElementById('deleteMaterialTypeId').value = typeId;
        document.getElementById('deleteMaterialTypeName').textContent = typeName;

        if (typeof toggleModal === 'function') toggleModal('deleteMaterialTypeModal', true);
    }
    
    // --- AJAX Form Submission Handlers (Update and Delete) ---

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
            // New PHP file to handle update
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
            // New PHP file to handle delete
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

    // --- Utility and DOM Manipulation Functions ---
    
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
    
    function updateTableRow(typeData) {
        const row = document.querySelector(`#materialTypesTable tbody tr[data-id="${typeData.id}"]`);
        if (row) {
            // Update the display cells
            row.querySelector('td:nth-child(2)').textContent = typeData.name;
            row.querySelector('td:nth-child(3)').textContent = typeData.desc || '—';
            
            // Update data attributes for filtering
            row.dataset.name = typeData.name.toLowerCase();
            row.dataset.desc = (typeData.desc || '').toLowerCase(); // Ensure desc is handled even if null/empty
            
            filterTypes();
        }
    }

    function removeTableRow(typeId) {
        const row = document.querySelector(`#materialTypesTable tbody tr[data-id="${typeId}"]`);
        if (row) {
            row.remove();
            // Update allRows array
            allRows = allRows.filter(r => r !== row);
            
            // If no types left, show message
            const tableBody = document.querySelector("#materialTypesTable tbody");
            if (tableBody && allRows.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" class="px-4 py-3 text-center">No material types found.</td></tr>';
            }
        }
    }
});