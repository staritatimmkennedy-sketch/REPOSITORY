// role.js - Dynamic table version

// Global variables
let allRows = [];
const rolesTableBody = document.querySelector("#rolesTable tbody"); 

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize the table and features if the necessary elements are present
    if (document.getElementById("rolesTable")) {
        initializeRoleTable();
    }
});

function initializeRoleTable() {
    const searchRole = document.getElementById("searchRole");
    const roleFilter = document.getElementById("roleFilter");
    const rows = document.querySelectorAll("#rolesTable tbody tr");
    
    // Store initial rows
    allRows = Array.from(rows);

    // Filter functionality
    function filterRoles() {
        const search = searchRole.value.toLowerCase();
        const filterRole = roleFilter.value.toLowerCase();

        allRows.forEach(row => {
            const role = row.dataset.role;
            const desc = row.dataset.desc;

            const matchesSearch = role.includes(search) || desc.includes(search);
            const matchesFilter = !filterRole || role === filterRole;

            row.style.display = (matchesSearch && matchesFilter) ? "" : "none";
        });
    }

    if (searchRole) {
        searchRole.addEventListener("input", filterRoles);
    }
    
    if (roleFilter) {
        roleFilter.addEventListener("change", filterRoles);
    }

    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize modal functionality (New)
    initializeModal();
}

function initializeDropdowns() {
    // Functionality to toggle "Manage" dropdowns
    document.querySelectorAll("#rolesTable button").forEach(button => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const menu = button.parentElement.querySelector("div");
            menu.classList.toggle("hidden");
        });
    });

    // Close dropdowns when clicking anywhere else
    document.addEventListener("click", (e) => {
        document.querySelectorAll("#rolesTable .relative div").forEach(menu => {
            if (!menu.closest('.relative').contains(e.target) && !menu.classList.contains("hidden")) {
                menu.classList.add("hidden");
            }
        });
    });
}


function initializeModal() {
    const addRoleModal = document.getElementById("addRoleModal");
    const openAddRoleBtn = document.getElementById("openAddRole");
    const cancelAddRoleBtn = document.getElementById("cancelAddRole");
    const addRoleForm = document.getElementById("addRoleForm");
    
    // Utility function to create the new table row
    function createNewRoleRow(roleData) {
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        row.setAttribute('data-role', roleData.role_name.toLowerCase());
        row.setAttribute('data-desc', roleData.description.toLowerCase());
        
        // Simplified action column HTML matching role.html structure
        const actionHtml = `
            <div class="relative inline-block text-left">
              <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
              <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Update Role</a>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Role</a>
              </div>
            </div>`;

        row.innerHTML = `
            <td class="px-4 py-3 text-sm">${escapeHtml(roleData.role_name)}</td>
            <td class="px-4 py-3 text-sm">${escapeHtml(roleData.description)}</td>
            <td class="px-4 py-3 text-center">${actionHtml}</td>
        `;

        // Re-attach dropdown listener to the new button
        row.querySelector('button').addEventListener('click', (e) => {
             e.stopPropagation();
             const menu = e.currentTarget.parentElement.querySelector("div");
             menu.classList.toggle("hidden");
        });
        
        return row;
    }
    
    // Open modal
    if (openAddRoleBtn && addRoleModal) {
        openAddRoleBtn.addEventListener('click', () => {
            addRoleModal.classList.remove('hidden');
            // Slight delay for transition effect
            setTimeout(() => {
                addRoleModal.style.opacity = '1';
            }, 10); 
        });
    }

    // Close modal
    if (cancelAddRoleBtn && addRoleModal) {
        cancelAddRoleBtn.addEventListener('click', () => {
            addRoleModal.style.opacity = '0';
            // Wait for transition before hiding
            setTimeout(() => {
                addRoleModal.classList.add('hidden');
                addRoleForm.reset(); 
            }, 300);
        });
    }

    // --- AJAX Form Submission ---
    if (addRoleForm) {
        addRoleForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.textContent = 'Adding...';
            submitButton.disabled = true;

            try {
                const response = await fetch('pages/add_role.php', {
                    method: 'POST',
                    body: formData,
                });
                
                // Check if response is JSON (helpful for debugging PHP errors)
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    const text = await response.text();
                    console.error("Server did not return JSON. Raw response:", text);
                    showNotification("An error occurred on the server (non-JSON response). Check console.", 'error');
                    return; 
                }

                const result = await response.json(); 
                
                if (result.success) {
                    const newRoleData = result.role;
                    
                    // 1. Add the new row to the table
                    const newRow = createNewRoleRow(newRoleData);
                    rolesTableBody.prepend(newRow); // Add to the top of the table
                    
                    // 2. Update the global array and re-filter
                    allRows.unshift(newRow); // Add to the beginning of the array
                    filterRoles(); // Re-apply current search/filters

                    // 3. Close and reset modal
                    addRoleModal.style.opacity = '0';
                    setTimeout(() => {
                        addRoleModal.classList.add('hidden');
                        form.reset();
                    }, 300);
                    
                    showNotification('Role "' + newRoleData.role_name + '" added successfully.', 'success');
                } else {
                   showNotification('Failed to add role: ' + result.message, 'error');
                }

            } catch (error) {
                console.error('Error adding role:', error);
                showNotification('An error occurred while connecting to the server.', 'error');
            } finally {
                submitButton.textContent = 'Add Role';
                submitButton.disabled = false;
            }
        });
    }
}

// Existing helper functions from role.js
function filterRoles() {
    // This needs to be available globally since it's called by initializeModal
    // The content is replicated from the previous provided snippet for completeness
    const searchRole = document.getElementById("searchRole");
    const roleFilter = document.getElementById("roleFilter");

    if (!searchRole || !roleFilter) return;

    const search = searchRole.value.toLowerCase();
    const filterRole = roleFilter.value.toLowerCase();

    allRows.forEach(row => {
        const role = row.dataset.role;
        const desc = row.dataset.desc;

        const matchesSearch = role.includes(search) || desc.includes(search);
        const matchesFilter = !filterRole || role === filterRole;

        row.style.display = (matchesSearch && matchesFilter) ? "" : "none";
    });
}


function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}