// role.js - Complete Role Management with View, Edit, Delete, and Add

document.addEventListener("DOMContentLoaded", function() {
    console.log("role.js loaded");
    
    // Initialize everything
    if (document.getElementById("rolesTable")) {
        initializeRoleTable();
        initializeDropdowns();
        initializeRoleCRUD();
        initializeAddRole(); 
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
    if (typeof toggleModal === 'function') toggleModal('addRoleModal', true);
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
        const roleName = row.dataset.roleName || '';
        const description = row.dataset.desc || '';
        const displayRoleName = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
        
        const matchesSearch = roleName.includes(search) || description.includes(search);
        const matchesFilter = !roleFilter || displayRoleName === roleFilter;
        
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
        const roleName = row.querySelector('td:first-child')?.textContent || 'Unknown Role';

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

    if (typeof toggleModal === 'function') toggleModal('updateRoleModal', true);
    fetchRoleDetails(roleId, isView);
}

function openDeleteRoleModal(roleId, roleName) {
    if (!roleId) return;

    document.getElementById('deleteRoleId').value = roleId;
    document.getElementById('deleteRoleName').textContent = roleName;

    if (typeof toggleModal === 'function') toggleModal('deleteRoleModal', true);
}

async function fetchRoleDetails(roleId, isView = false) {
    try {
        const response = await fetch(`pages/get_role_details.php?role_id=${roleId}`);
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
            if (typeof showToast === 'function') showToast(result.message || 'Failed to load role details', 'error');
            if (typeof toggleModal === 'function') toggleModal('updateRoleModal', false);
        }
    } catch (error) {
        console.error('Error fetching role details:', error);
        if (typeof showToast === 'function') showToast('Error loading role details', 'error');
        if (typeof toggleModal === 'function') toggleModal('updateRoleModal', false);
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
        <tr class="bg-white border-b hover:bg-gray-50" 
            data-role-id="${roleData.role_id}"
            data-role-name="${roleData.role_name.toLowerCase()}"
            data-desc="${descriptionText.toLowerCase()}">
          <td class="px-4 py-3 text-sm">${roleData.role_name}</td>
          <td class="px-4 py-3 text-sm">${descriptionText}</td>
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

    tableBody.insertAdjacentHTML('afterbegin', newRowHtml);
    
    const newRowEl = tableBody.querySelector(`tr[data-role-id="${roleData.role_id}"]`);
    if (newRowEl) {
        allRows.unshift(newRowEl);
    }
    
    initializeDropdowns();
    // REMOVED: Toast is shown in the form handler only
    console.log('Role added to table:', roleData.role_name);
}

function updateTableRow(roleData) {
    const row = document.querySelector(`tr[data-role-id="${roleData.role_id}"]`);
    if (row) {
        const cells = row.querySelectorAll('td');
        cells[0].textContent = roleData.role_name;
        cells[1].textContent = roleData.description;
        
        row.dataset.roleName = roleData.role_name.toLowerCase();
        row.dataset.desc = roleData.description.toLowerCase();
        
        // REMOVED: Toast is shown in the form handler only
        console.log('Role updated in table:', roleData.role_name);
    }
}

function removeTableRow(roleId) {
    const row = document.querySelector(`tr[data-role-id="${roleId}"]`);
    if (row) {
        row.remove();
        allRows = allRows.filter(r => r !== row);
        
        // REMOVED: Toast is shown in the form handler only
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
    }
    
    if (typeof showToast === 'function') showToast(userMessage, 'error');
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
        const response = await fetch('pages/add_role_handler.php', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // SHOW TOAST HERE ONLY - not in addNewTableRow
            if (typeof showToast === 'function') showToast('Role added successfully!', 'success');
            if (typeof toggleModal === 'function') toggleModal('addRoleModal', false);
            addNewTableRow(result.role);
        } else {
            throw new Error(result.message || 'Add role failed');
        }
    } catch (error) {
        handleRoleError(error, 'adding role');
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
            if (typeof showToast === 'function') showToast(result.message || 'Role updated successfully!', 'success');
            if (typeof toggleModal === 'function') toggleModal('updateRoleModal', false);
            updateTableRow(result.role);
        } else {
            throw new Error(result.message || 'Update failed');
        }
    } catch (error) {
        handleRoleError(error, 'updating role');
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
            if (typeof showToast === 'function') showToast(result.message || 'Role deleted successfully!', 'success');
            if (typeof toggleModal === 'function') toggleModal('deleteRoleModal', false);
            removeTableRow(result.role_id);
        } else {
            throw new Error(result.message || 'Deletion failed');
        }
    } catch (error) {
        handleRoleError(error, 'deleting role');
    } finally {
        setLoadingState(submitBtn, false);
    }
}

// -----------------------------
// FORM EVENT LISTENERS
// -----------------------------
document.addEventListener('DOMContentLoaded', function() {
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
});