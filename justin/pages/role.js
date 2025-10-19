// role.js - Complete Role Management with View, Edit, Delete, and Add

document.addEventListener("DOMContentLoaded", function() {
    console.log("role.js loaded");
    
    // Initialize everything
    if (document.getElementById("rolesTable")) {
        initializeRoleTable();
        initializeDropdowns();
        initializeRoleCRUD();
        initializeAddRole(); 
        initializeFormHandlers();
    }
});

// -----------------------------
// ADD ROLE FUNCTIONALITY
// -----------------------------
function initializeAddRole() {
    const openAddBtn = document.getElementById('openAddRole');
    if (openAddBtn) {
        openAddBtn.addEventListener('click', openAddRoleModal);
    }
}

function openAddRoleModal() {
    const form = document.getElementById('addRoleForm');
    if (form) {
        form.reset();
        const permCheckboxes = form.querySelectorAll('.add-perm-checkbox');
        permCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        const submitBtn = form.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, false);
    }
    
    // Use existing modal toggle or fallback
    if (typeof toggleModal === 'function') {
        toggleModal('addRoleModal', true);
    } else {
        const modal = document.getElementById('addRoleModal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
        }
    }
}

// -----------------------------
// FILTERING FUNCTIONALITY
// -----------------------------
let allRows = [];

function initializeRoleTable() {
    const tableBody = document.querySelector("#rolesTable tbody");
    if (!tableBody) return;
    
    allRows = Array.from(tableBody.querySelectorAll("tr"));
    
    const searchRole = document.getElementById("searchRole");
    if (searchRole) {
        searchRole.addEventListener("input", debouncedFilterRoles);
    }
    
    const roleFilter = document.getElementById("roleFilter");
    if (roleFilter) {
        roleFilter.addEventListener("change", filterRoles);
    }
}

function filterRoles() {
    const search = document.getElementById("searchRole")?.value.toLowerCase() || '';
    const roleFilter = document.getElementById("roleFilter")?.value.toLowerCase() || '';
    
    allRows.forEach(row => {
        const roleId = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        const roleName = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
        const description = row.dataset.desc || '';
        
        const matchesSearch = roleId.includes(search) || roleName.includes(search) || description.includes(search);
        const matchesFilter = !roleFilter || roleName === roleFilter;
        
        row.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
    });
}

// -----------------------------
// DROPDOWN MANAGEMENT
// -----------------------------
function initializeDropdowns() {
    document.querySelectorAll('.dropdown-container').forEach(container => {
        const toggle = container.querySelector('.dropdown-toggle');
        const menu = container.querySelector('.dropdown-menu');

        if (toggle && menu) {
            toggle.removeEventListener('click', handleDropdownToggle);
            toggle.addEventListener('click', handleDropdownToggle);
        }
    });

    document.removeEventListener('click', closeAllDropdowns);
    document.addEventListener('click', closeAllDropdowns);
}

function handleDropdownToggle(e) {
    e.stopPropagation();
    const menu = this.closest('.dropdown-container')?.querySelector('.dropdown-menu');
    if (menu) {
        document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m !== menu) m.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('hidden');
    });
}

// -----------------------------
// ROLE CRUD FUNCTIONALITY
// -----------------------------
function initializeRoleCRUD() {
    const rolesTableBody = document.querySelector("#rolesTable tbody");
    if (!rolesTableBody) return;

    rolesTableBody.addEventListener('click', function(e) {
        const btn = e.target.closest('.view-role-btn, .edit-role-btn, .delete-role-btn');
        if (!btn) return;
        
        e.stopPropagation(); 
        e.preventDefault();
        
        const dropdownMenu = btn.closest('.dropdown-menu');
        if (dropdownMenu) {
            dropdownMenu.classList.add('hidden');
        }

        const row = btn.closest('tr');
        if (!row) return;

        const roleId = row.dataset.roleId;
        const roleName = row.querySelector('td:nth-child(2)')?.textContent || 'Unknown Role';

        if (btn.classList.contains('delete-role-btn')) {
            openDeleteRoleModal(roleId, roleName);
        } else if (btn.classList.contains('edit-role-btn')) {
            openUpdateRoleModal(roleId, false);
        } else if (btn.classList.contains('view-role-btn')) {
            openUpdateRoleModal(roleId, true);
        }
    });
}

// -----------------------------
// MODAL MANAGEMENT
// -----------------------------
function openUpdateRoleModal(roleId, isView = false) {
    if (!roleId) return;

    const submitBtn = document.getElementById('updateRoleSubmit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Loading...';
    }

    if (typeof toggleModal === 'function') {
        toggleModal('updateRoleModal', true);
    } else {
        const modal = document.getElementById('updateRoleModal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
        }
    }
    
    fetchRoleDetails(roleId, isView);
}

function openDeleteRoleModal(roleId, roleName) {
    if (!roleId) return;

    document.getElementById('deleteRoleId').value = roleId;
    document.getElementById('deleteRoleName').textContent = roleName;

    if (typeof toggleModal === 'function') {
        toggleModal('deleteRoleModal', true);
    } else {
        const modal = document.getElementById('deleteRoleModal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => { modal.style.opacity = '1'; }, 10);
        }
    }
}

async function fetchRoleDetails(roleId, isView = false) {
    try {
        const response = await fetch(`pages/get_role_details.php?role_id=${roleId}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();

        if (result.success) {
            const role = result.role;
            const permissions = role.permissions || [];
            
            document.getElementById('updateRoleId').value = role.role_id;
            document.getElementById('updateRoleName').value = role.role_name;
            document.getElementById('updateRoleDescription').value = role.description;
            document.getElementById('updateRoleNameTitle').textContent = role.role_name;

            const permCheckboxes = document.querySelectorAll('.update-perm-checkbox');
            permCheckboxes.forEach(checkbox => {
                checkbox.checked = permissions.includes(checkbox.value);
                checkbox.disabled = isView;
            });

            const roleNameInput = document.getElementById('updateRoleName');
            const descInput = document.getElementById('updateRoleDescription');
            
            roleNameInput.disabled = isView;
            descInput.disabled = isView;
            
            const modalTitle = document.getElementById('updateRoleModalTitle');
            modalTitle.textContent = isView ? `View Role: ${role.role_name}` : `Edit Role: ${role.role_name}`;
            
            const submitBtn = document.getElementById('updateRoleSubmit');
            if (submitBtn) {
                submitBtn.style.display = isView ? 'none' : 'block';
                submitBtn.textContent = 'Save Changes';
                submitBtn.disabled = false;
            }
        } else {
            throw new Error(result.message || 'Failed to load role details');
        }
    } catch (error) {
        console.error('Error fetching role details:', error);
        const userMessage = handleRoleError(error, 'loading role details');
        
        if (typeof showToast === 'function') {
            showToast(userMessage, 'error');
        } else {
            alert(userMessage);
        }
        
        if (typeof toggleModal === 'function') {
            toggleModal('updateRoleModal', false);
        } else {
            const modal = document.getElementById('updateRoleModal');
            if (modal) modal.classList.add('hidden');
        }
    }
}

// -----------------------------
// TABLE UPDATES (FIXED - NO DUPLICATE TOASTS)
// -----------------------------
function addNewTableRow(roleData) {
    const tableBody = document.querySelector("#rolesTable tbody");
    if (!tableBody) return;

    const noRolesRow = tableBody.querySelector('tr td[colspan="3"]');
    if (noRolesRow) {
        noRolesRow.closest('tr').remove();
    }
    
    const descriptionText = roleData.description || '—';
    const newRowHtml = `
        <tr class="border-b hover:bg-gray-50" 
            data-role-id="${roleData.role_id}"
            data-role-name="${roleData.role_name.toLowerCase()}"
            data-desc="${descriptionText.toLowerCase()}">
          <td class="px-4 py-3 text-sm">${roleData.role_id}</td>
          <td class="px-4 py-3 text-sm">${roleData.role_name}</td>
          <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left dropdown-container">
              <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap dropdown-toggle">
                Manage ▾
              </button>
              <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 view-role-btn">View Role</a>
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 edit-role-btn">Update Role</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 delete-role-btn">Delete Role</a>
              </div>
            </div>
          </td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('beforeend', newRowHtml);
    
    const newRowEl = tableBody.querySelector(`tr[data-role-id="${roleData.role_id}"]`);
    if (newRowEl) {
        allRows.push(newRowEl);
    }
    
    initializeDropdowns();
    console.log('Role added to table:', roleData.role_name);
}

function updateTableRow(roleData) {
    const row = document.querySelector(`tr[data-role-id="${roleData.role_id}"]`);
    if (row) {
        const cells = row.querySelectorAll('td');
        cells[0].textContent = roleData.role_id;
        cells[1].textContent = roleData.role_name;
        
        row.dataset.roleName = roleData.role_name.toLowerCase();
        row.dataset.desc = (roleData.description || '').toLowerCase();
        
        console.log('Role updated in table:', roleData.role_name);
    }
}

function removeTableRow(roleId) {
    const row = document.querySelector(`tr[data-role-id="${roleId}"]`);
    if (row) {
        row.remove();
        allRows = allRows.filter(r => r !== row);
        
        console.log('Role removed from table:', roleId);
        
        const tableBody = document.querySelector("#rolesTable tbody");
        if (tableBody && allRows.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" class="px-4 py-3 text-center">No roles found.</td></tr>';
        }
    }
}

// -----------------------------
// UTILITY FUNCTIONS
// -----------------------------
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

const debouncedFilterRoles = debounce(filterRoles, 300);

function handleRoleError(error, context = 'role operation') {
    console.error(`Error in ${context}:`, error);
    
    let userMessage = 'An error occurred';
    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        userMessage = 'Network error: Please check your connection';
    } else if (error.message.includes('404')) {
        userMessage = 'Resource not found';
    } else if (error.message.includes('500')) {
        userMessage = 'Server error: Please try again later';
    } else if (error.message.includes('403')) {
        userMessage = 'Access denied';
    } else {
        userMessage = error.message || 'An unexpected error occurred';
    }
    
    return userMessage;
}

function setLoadingState(element, isLoading) {
    if (!element) return;
    
    if (isLoading) {
        element.disabled = true;
        const originalText = element.textContent;
        element.setAttribute('data-original-text', originalText);
        element.textContent = 'Loading...';
    } else {
        element.disabled = false;
        const originalText = element.getAttribute('data-original-text');
        if (originalText) {
            element.textContent = originalText;
            element.removeAttribute('data-original-text');
        }
    }
}

// -----------------------------
// ENHANCED FORM HANDLERS (FIXED - SHOW TOAST ONLY HERE)
// -----------------------------
async function handleAddRoleEnhanced(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    setLoadingState(submitBtn, true);
    
    try {
        const formData = new FormData(form);
        
        // Debug: log form data
        console.log('Submitting role data:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }
        
        const response = await fetch('pages/add_role_handler.php', {
            method: 'POST',
            body: formData
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Response result:', result);
        
        if (result.success) {
            // SHOW TOAST HERE ONLY - not in addNewTableRow
            if (typeof showToast === 'function') {
                showToast(result.message || 'Role added successfully!', 'success');
            } else {
                alert(result.message || 'Role added successfully!');
            }
            
            // Close modal
            if (typeof toggleModal === 'function') {
                toggleModal('addRoleModal', false);
            } else {
                const modal = document.getElementById('addRoleModal');
                if (modal) modal.classList.add('hidden');
            }
            
            // Add to table
            addNewTableRow(result.role);
        } else {
            throw new Error(result.message || 'Add role failed');
        }
    } catch (error) {
        console.error('Add role error:', error);
        const userMessage = handleRoleError(error, 'adding role');
        
        if (typeof showToast === 'function') {
            showToast(userMessage, 'error');
        } else {
            alert(userMessage);
        }
    } finally {
        setLoadingState(submitBtn, false);
    }
}

async function handleUpdateRoleEnhanced(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    setLoadingState(submitBtn, true);
    
    try {
        const formData = new FormData(form);
        
        console.log('Updating role data:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ': ' + value);
        }
        
        const response = await fetch('pages/update_role_handler.php', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // SHOW TOAST HERE ONLY - not in updateTableRow
            if (typeof showToast === 'function') {
                showToast(result.message || 'Role updated successfully!', 'success');
            } else {
                alert(result.message || 'Role updated successfully!');
            }
            
            if (typeof toggleModal === 'function') {
                toggleModal('updateRoleModal', false);
            } else {
                const modal = document.getElementById('updateRoleModal');
                if (modal) modal.classList.add('hidden');
            }
            
            updateTableRow(result.role);
        } else {
            throw new Error(result.message || 'Update failed');
        }
    } catch (error) {
        console.error('Update role error:', error);
        const userMessage = handleRoleError(error, 'updating role');
        
        if (typeof showToast === 'function') {
            showToast(userMessage, 'error');
        } else {
            alert(userMessage);
        }
    } finally {
        setLoadingState(submitBtn, false);
    }
}

async function handleDeleteRoleEnhanced(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    setLoadingState(submitBtn, true);
    
    try {
        const formData = new FormData(form);
        
        console.log('Deleting role:', Object.fromEntries(formData));
        
        const response = await fetch('pages/delete_role_handler.php', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // SHOW TOAST HERE ONLY - not in removeTableRow
            if (typeof showToast === 'function') {
                showToast(result.message || 'Role deleted successfully!', 'success');
            } else {
                alert(result.message || 'Role deleted successfully!');
            }
            
            if (typeof toggleModal === 'function') {
                toggleModal('deleteRoleModal', false);
            } else {
                const modal = document.getElementById('deleteRoleModal');
                if (modal) modal.classList.add('hidden');
            }
            
            removeTableRow(result.role_id);
        } else {
            throw new Error(result.message || 'Deletion failed');
        }
    } catch (error) {
        console.error('Delete role error:', error);
        const userMessage = handleRoleError(error, 'deleting role');
        
        if (typeof showToast === 'function') {
            showToast(userMessage, 'error');
        } else {
            alert(userMessage);
        }
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// -----------------------------
// FORM EVENT LISTENERS
// -----------------------------
function initializeFormHandlers() {
    const addRoleForm = document.getElementById('addRoleForm');
    if (addRoleForm) {
        addRoleForm.removeEventListener('submit', handleAddRoleEnhanced);
        addRoleForm.addEventListener('submit', handleAddRoleEnhanced);
    }
    
    const updateRoleForm = document.getElementById('updateRoleForm');
    if (updateRoleForm) {
        updateRoleForm.removeEventListener('submit', handleUpdateRoleEnhanced);
        updateRoleForm.addEventListener('submit', handleUpdateRoleEnhanced);
    }
    
    const deleteRoleForm = document.getElementById('deleteRoleForm');
    if (deleteRoleForm) {
        deleteRoleForm.removeEventListener('submit', handleDeleteRoleEnhanced);
        deleteRoleForm.addEventListener('submit', handleDeleteRoleEnhanced);
    }
    
    const updateRoleName = document.getElementById('updateRoleName');
    const updateRoleDescription = document.getElementById('updateRoleDescription');
    
    if (updateRoleName && updateRoleDescription) {
        [updateRoleName, updateRoleDescription].forEach(input => {
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && input.disabled) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Add cancel button handlers
    const cancelAddRole = document.getElementById('cancelAddRole');
    if (cancelAddRole) {
        cancelAddRole.addEventListener('click', function() {
            if (typeof toggleModal === 'function') {
                toggleModal('addRoleModal', false);
            } else {
                const modal = document.getElementById('addRoleModal');
                if (modal) modal.classList.add('hidden');
            }
        });
    }
}

// -----------------------------
// MODAL TOGGLE FALLBACK
// -----------------------------
if (typeof toggleModal === 'undefined') {
    window.toggleModal = function(modalId, show) {
        const modal = document.getElementById(modalId);
        if (modal) {
            if (show) {
                modal.classList.remove('hidden');
                setTimeout(() => { modal.style.opacity = '1'; }, 10);
            } else {
                modal.style.opacity = '0';
                setTimeout(() => { modal.classList.add('hidden'); }, 300);
            }
        }
    };
}

// -----------------------------
// TOAST FALLBACK
// -----------------------------
if (typeof showToast === 'undefined') {
    window.showToast = function(message, type = 'info') {
        console.log(`${type.toUpperCase()}: ${message}`);
        // You can implement a simple toast here if needed
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    };
}