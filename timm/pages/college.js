// college.js - Complete College Management with Add, View, Edit, Delete

document.addEventListener('DOMContentLoaded', function() {
    console.log("college.js loaded");
    
    // Initialize everything
    initSearch();
    initDropdownDelegation(); // NEW: Use event delegation instead
    initializeCollegeCRUD();
    initializeModalHandlers();
});

// ----------------------------
// SEARCH FUNCTIONALITY
// ----------------------------

function initSearch() {
    const searchCollege = document.getElementById("searchCollege");
    const tableBody = document.querySelector("#collegesTable tbody");
    if (!searchCollege || !tableBody) return;
    
    const allRows = Array.from(tableBody.querySelectorAll("tr"));

    searchCollege.addEventListener("input", () => {
        const search = searchCollege.value.toLowerCase().trim();
        allRows.forEach(row => {
            const name = row.dataset.name || '';
            const id = row.dataset.id || '';
            const matches = id.includes(search) || name.includes(search);
            row.style.display = matches ? "" : "none";
        });
    });
}

// ----------------------------
// DROPDOWN MANAGEMENT (FIXED - Using Event Delegation)
// ----------------------------

function initDropdownDelegation() {
    const tableBody = document.querySelector("#collegesTable tbody");
    if (!tableBody) return;

    // Use event delegation for dropdown toggles
    tableBody.addEventListener('click', function(e) {
        const manageBtn = e.target.closest('.manage-btn');
        if (!manageBtn) return;
        
        e.stopPropagation();
        
        // Close all other dropdowns
        document.querySelectorAll('.manage-dropdown').forEach(d => d.classList.add('hidden'));
        
        // Toggle the clicked dropdown
        const dropdown = manageBtn.nextElementSibling;
        if (dropdown && dropdown.classList.contains('manage-dropdown')) {
            dropdown.classList.toggle('hidden');
        }
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.manage-dropdown').forEach(d => d.classList.add('hidden'));
});

// ----------------------------
// MODAL HANDLERS
// ----------------------------

function initializeModalHandlers() {
    // Add College Modal
    document.getElementById('openAddCollege')?.addEventListener('click', () => {
        toggleModal('modal-college', true);
    });

    document.getElementById('close-college-modal-btn')?.addEventListener('click', () => toggleModal('modal-college', false));
    document.getElementById('cancel-college-modal-btn')?.addEventListener('click', () => toggleModal('modal-college', false));

    // Edit/View College Modal
    document.getElementById('close-edit-college-modal-btn')?.addEventListener('click', () => toggleModal('editCollegeModal', false));
    document.getElementById('cancel-edit-college-modal-btn')?.addEventListener('click', () => toggleModal('editCollegeModal', false));

    // Delete College Modal
    document.getElementById('closeDeleteCollegeModal')?.addEventListener('click', () => toggleModal('deleteCollegeModal', false));
    document.getElementById('cancelDeleteCollege')?.addEventListener('click', () => toggleModal('deleteCollegeModal', false));

    // Add College Form Submission
    document.getElementById('college-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAddCollege();
    });

    // Edit College Form Submission
    document.getElementById('edit-college-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateCollege();
    });

    // Delete College Form Submission
    document.getElementById('deleteCollegeForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleDeleteCollege();
    });
}

// ----------------------------
// CRUD FUNCTIONALITY
// ----------------------------

function initializeCollegeCRUD() {
    const tableBody = document.querySelector("#collegesTable tbody");
    if (!tableBody) return;

    // Delegate events for View, Edit, Delete buttons
    tableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('.view-college-btn, .edit-college-btn, .delete-college-btn');
        if (!btn) return;

        const collegeId = btn.dataset.collegeId;
        const collegeName = btn.dataset.collegeName;

        if (btn.classList.contains('view-college-btn') || btn.classList.contains('edit-college-btn')) {
            await handleViewEditCollege(collegeId, collegeName, btn.classList.contains('edit-college-btn'));
        } else if (btn.classList.contains('delete-college-btn')) {
            handleOpenDeleteCollegeModal(collegeId, collegeName);
        }
    });
}

// ----------------------------
// HANDLER FUNCTIONS
// ----------------------------

// Handler for Add College
function handleAddCollege() {
    const collegeNameInput = document.getElementById('college_name');
    const collegeName = collegeNameInput.value.trim();
    const form = document.getElementById('college-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    if (!collegeName) {
        showMessage('College name is required', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke-width="2"></circle></svg> Saving...';

    fetch('pages/add_college.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `college_name=${encodeURIComponent(collegeName)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.college) {
            addNewCollegeRow(data.college.id, data.college.name);
            toggleModal('modal-college', false);
            form.reset();
            showMessage('College added successfully!', 'success');
        } else {
            showMessage(data.message || 'Failed to add college', 'error');
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        showMessage('Network error. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Handler for View/Edit College
async function handleViewEditCollege(collegeId, collegeName, isEditMode) {
    const modalId = 'editCollegeModal';
    const form = document.getElementById('edit-college-form');
    const title = document.getElementById('editCollegeModalTitle');
    const nameInput = document.getElementById('edit_college_name');
    const idInput = document.getElementById('edit_college_id');
    const idDisplay = document.getElementById('edit_college_id_display');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Set modal content
    title.textContent = isEditMode ? 'Edit College' : 'View College';
    idInput.value = collegeId;
    idDisplay.textContent = collegeId;
    
    // Reset and set form state
    form.reset();
    nameInput.disabled = !isEditMode;
    submitBtn.style.display = isEditMode ? 'block' : 'none';

    // Show loading state
    nameInput.value = 'Loading...';
    nameInput.disabled = true;

    toggleModal(modalId, true);

    try {
        const response = await fetch(`pages/get_college_details.php?college_id=${collegeId}`);
        const data = await response.json();

        if (data.success && data.college) {
            nameInput.value = data.college.name;
            nameInput.disabled = !isEditMode;
        } else {
            throw new Error(data.message || 'Failed to fetch college details.');
        }
    } catch (error) {
        console.error('Fetch college details error:', error);
        showMessage(`Error: ${error.message}`, 'error');
        toggleModal(modalId, false);
    }
}

// Handler for Update College
async function handleUpdateCollege() {
    const collegeId = document.getElementById('edit_college_id').value;
    const collegeName = document.getElementById('edit_college_name').value.trim();
    const form = document.getElementById('edit-college-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    if (!collegeName) {
        showMessage('College name is required', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke-width="2"></circle></svg> Updating...';

    try {
        const formData = new FormData();
        formData.append('college_id', collegeId);
        formData.append('college_name', collegeName);
        
        const response = await fetch('pages/update_college.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success && result.college) {
            updateCollegeRow(result.college.id, result.college.name);
            showMessage('College updated successfully!', 'success');
            toggleModal('editCollegeModal', false); // Close modal on success
        } else {
            throw new Error(result.message || 'Update failed');
        }
    } catch (error) {
        console.error('Update college error:', error);
        showMessage(`Error updating college: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Handler for opening Delete College Modal
function handleOpenDeleteCollegeModal(collegeId, collegeName) {
    document.getElementById('deleteCollegeId').value = collegeId;
    document.getElementById('deleteCollegeName').textContent = collegeName;
    toggleModal('deleteCollegeModal', true);
}

// Handler for Delete College
async function handleDeleteCollege() {
    const collegeId = document.getElementById('deleteCollegeId').value;
    const form = document.getElementById('deleteCollegeForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke-width="2"></circle></svg> Deleting...';

    try {
        const formData = new FormData();
        formData.append('college_id', collegeId);
        
        const response = await fetch('pages/delete_college.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            removeCollegeRow(collegeId);
            showMessage('College deleted successfully!', 'success');
            toggleModal('deleteCollegeModal', false); // Close modal on success
        } else {
            throw new Error(result.message || 'Deletion failed');
        }
    } catch (error) {
        console.error('Delete college error:', error);
        showMessage(`Error deleting college: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ----------------------------
// DOM MANIPULATION FUNCTIONS
// ----------------------------

function updateCollegeRow(id, name) {
    const row = document.getElementById(`college-row-${id}`);
    if (row) {
        row.dataset.name = name.toLowerCase();
        row.querySelector('td:nth-child(2)').textContent = name;
        
        // Update dropdown buttons
        row.querySelectorAll('.edit-college-btn, .view-college-btn, .delete-college-btn').forEach(btn => {
            btn.dataset.collegeName = name;
        });
    }
}

function removeCollegeRow(id) {
    const row = document.getElementById(`college-row-${id}`);
    if (row) {
        row.remove();
    }
}

function addNewCollegeRow(id, name) {
    const tableBody = document.querySelector("#collegesTable tbody");
    if (!tableBody) return;
    
    const escapedName = escapeHtml(name);
    const escapedId = escapeHtml(id);

    const newRowHTML = `
        <tr class="border-b hover:bg-gray-50"
            data-id="${escapedId}"
            data-name="${escapedName.toLowerCase()}"
            id="college-row-${escapedId}">
            <td class="px-4 py-3 text-sm">${escapedId}</td>
            <td class="px-4 py-3 text-sm">${escapedName}</td>
            <td class="px-4 py-3 text-center">
                <div class="relative inline-block text-left dropdown-container">
                    <button type="button" class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
                        Manage ▾
                    </button>
                    <div class="manage-dropdown hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 view-college-btn"
                           data-college-id="${escapedId}"
                           data-college-name="${escapedName}">View College</a>
                        <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100 edit-college-btn"
                           data-college-id="${escapedId}"
                           data-college-name="${escapedName}">Update College</a>
                        <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 delete-college-btn"
                           data-college-id="${escapedId}"
                           data-college-name="${escapedName}">Delete College</a>
                    </div>
                </div>
            </td>
        </tr>
    `;

    tableBody.insertAdjacentHTML('afterbegin', newRowHTML);
    // No need to re-initialize dropdowns because we're using event delegation
}

// ----------------------------
// UTILITY FUNCTIONS
// ----------------------------

function escapeHtml(text) {
    if (typeof text !== 'string') text = String(text);
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Modal toggle function
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }
    
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.style.opacity = '1', 10);
    } else {
        modal.style.opacity = '0';
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

// Enhanced message display function
function showMessage(message, type = 'info') {
    console.log(`[${type}] ${message}`); // Always log to console for debugging
    
    // Try to use existing function first
    if (typeof window.showCustomMessage === 'function') {
        window.showCustomMessage(message, type);
        return;
    }
    
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }
    
    // Create our own message display
    const container = document.getElementById('custom-message-container');
    if (!container) {
        // Fallback: Use browser alert for critical errors
        if (type === 'error') {
            alert(`Error: ${message}`);
        } else if (type === 'success') {
            alert(`Success: ${message}`);
        }
        return;
    }

    // Clear existing messages
    container.innerHTML = '';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `px-6 py-4 rounded-lg shadow-lg text-white font-medium mb-3 transform transition-all duration-300 text-center ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    alertDiv.textContent = message;
    container.appendChild(alertDiv);

    // Animate in
    setTimeout(() => {
        alertDiv.style.transform = 'translateY(0)';
        alertDiv.style.opacity = '1';
    }, 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
        alertDiv.style.transform = 'translateY(-10px)';
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            if (alertDiv.parentNode === container) {
                container.removeChild(alertDiv);
            }
        }, 300);
    }, 4000);
}