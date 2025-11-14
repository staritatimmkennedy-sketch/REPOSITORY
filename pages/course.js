// course.js - Complete Course Management with Add, View, Edit, Delete
document.addEventListener('DOMContentLoaded', function() {
    console.log("course.js loaded");
   
    // Initialize everything
    initSearchAndFilter();
    initDropdownDelegation();
    initializeCourseCRUD();
    initializeModalHandlers();
});

// ----------------------------
// SEARCH & FILTER FUNCTIONALITY
// ----------------------------
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchCourse');
    const collegeFilter = document.getElementById('collegeFilter');
    const tableBody = document.querySelector("#courseTable tbody");
   
    if (!searchInput || !collegeFilter || !tableBody) return;
   
    const allRows = Array.from(tableBody.querySelectorAll("tr"));
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const collegeFilterVal = collegeFilter.value.toLowerCase();
        allRows.forEach(row => {
            const id = row.dataset.id || '';
            const name = row.dataset.name || '';
            const college = row.dataset.college || '';
            const matchesSearch = id.includes(searchTerm) || name.includes(searchTerm);
            const matchesCollege = !collegeFilterVal || college === collegeFilterVal;
            row.style.display = matchesSearch && matchesCollege ? "" : "none";
        });
    }
    searchInput.addEventListener('input', filterTable);
    collegeFilter.addEventListener('change', filterTable);
}

// ----------------------------
// DROPDOWN MANAGEMENT
// ----------------------------
function initDropdownDelegation() {
    const tableBody = document.querySelector("#courseTable tbody");
    if (!tableBody) return;

    tableBody.addEventListener('click', function(e) {
        const manageBtn = e.target.closest('.manage-btn');
        if (!manageBtn) return;
       
        e.stopPropagation();
       
        document.querySelectorAll('.manage-dropdown').forEach(d => {
            if (!d.classList.contains('hidden')) {
                d.classList.add('hidden');
            }
            d.style.left = '';
            d.style.right = '';
            d.style.top = '';
            d.style.bottom = '';
            d.style.marginTop = '';
            d.style.marginBottom = '';
            d.style.transform = '';
        });

        const dropdown = manageBtn.nextElementSibling;
        if (dropdown && dropdown.classList.contains('manage-dropdown')) {
            const willShow = dropdown.classList.contains('hidden');
            if (willShow) {
                dropdown.style.visibility = 'hidden';
                dropdown.classList.remove('hidden');
                dropdown.offsetHeight;

                const btnRect = manageBtn.getBoundingClientRect();
                const ddRect = dropdown.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                if (btnRect.right + ddRect.width > viewportWidth) {
                    dropdown.style.right = '0';
                    dropdown.style.left = 'auto';
                } else {
                    dropdown.style.left = '0';
                    dropdown.style.right = 'auto';
                }

                const spaceBelow = viewportHeight - btnRect.bottom;
                const spaceAbove = btnRect.top;

                if (spaceBelow < ddRect.height && spaceAbove > ddRect.height) {
                    dropdown.style.bottom = '100%';
                    dropdown.style.top = 'auto';
                    dropdown.style.marginBottom = '0.25rem';
                    dropdown.style.marginTop = '';
                    dropdown.style.transform = 'translateY(-4px)';
                } else {
                    dropdown.style.top = '100%';
                    dropdown.style.bottom = 'auto';
                    dropdown.style.marginTop = '0.25rem';
                    dropdown.style.marginBottom = '';
                    dropdown.style.transform = 'translateY(4px)';
                }

                dropdown.style.visibility = 'visible';
            } else {
                dropdown.classList.add('hidden');
            }
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
    document.getElementById('openAddCourse')?.addEventListener('click', () => {
        toggleModal('modal-course', true);
    });
    document.getElementById('close-edit-course-modal-btn')?.addEventListener('click', () => toggleModal('editCourseModal', false));
    document.getElementById('cancel-edit-course-modal-btn')?.addEventListener('click', () => toggleModal('editCourseModal', false));
    document.getElementById('closeDeleteCourseModal')?.addEventListener('click', () => toggleModal('deleteCourseModal', false));
    document.getElementById('cancelDeleteCourse')?.addEventListener('click', () => toggleModal('deleteCourseModal', false));
}

// ----------------------------
// CRUD FUNCTIONALITY
// ----------------------------
function initializeCourseCRUD() {
    const tableBody = document.querySelector("#courseTable tbody");
    if (!tableBody) return;

    // Delegate View, Edit, Delete
    tableBody.addEventListener('click', async (e) => {
        const btn = e.target.closest('.view-course-btn, .edit-course-btn, .delete-course-btn');
        if (!btn) return;

        const courseId = btn.dataset.courseId;
        const courseName = btn.dataset.courseName;

        if (btn.classList.contains('view-course-btn') || btn.classList.contains('edit-course-btn')) {
            await handleViewEditCourse(courseId, courseName, btn.classList.contains('edit-course-btn'));
        } else if (btn.classList.contains('delete-course-btn')) {
            handleOpenDeleteCourseModal(courseId, courseName);
        }
    });

    // Edit Form Submit
    document.getElementById('edit-course-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleUpdateCourse();
    });

    // Delete Form Submit
    document.getElementById('deleteCourseForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const courseId = document.getElementById('deleteCourseId').value;
        handleDeleteCourse(courseId);
    });
}

// ----------------------------
// HANDLER FUNCTIONS
// ----------------------------

// View / Edit Course
async function handleViewEditCourse(courseId, courseName, isEditMode) {
    const modalId = 'editCourseModal';
    const form = document.getElementById('edit-course-form');
    const title = document.getElementById('editCourseModalTitle');
    const nameInput = document.getElementById('edit_course_name');
    const collegeSelect = document.getElementById('edit_college_id');
    const idInput = document.getElementById('edit_course_id');
    const idDisplay = document.getElementById('edit_course_id_display');
    const submitBtn = form.querySelector('button[type="submit"]');

    title.textContent = isEditMode ? 'Edit Course' : 'View Course';
    idInput.value = courseId;
    idDisplay.textContent = courseId;

    form.reset();
    nameInput.disabled = !isEditMode;
    collegeSelect.disabled = !isEditMode;
    submitBtn.style.display = isEditMode ? 'block' : 'none';

    nameInput.value = 'Loading...';
    nameInput.disabled = true;
    collegeSelect.disabled = true;
    toggleModal(modalId, true);

    try {
        const response = await fetch(`pages/get_course_details.php?course_id=${courseId}`);
        const data = await response.json();
        if (data.success && data.course) {
            nameInput.value = data.course.name;
            nameInput.disabled = !isEditMode;
            if (collegeSelect) {
                collegeSelect.value = data.course.college_id;
                collegeSelect.disabled = !isEditMode;
            }
        } else {
            throw new Error(data.message || 'Failed to fetch course details.');
        }
    } catch (error) {
        console.error('Fetch course details error:', error);
        showMessage(`Error: ${error.message}`, 'error');
        toggleModal(modalId, false);
    }
}

// Update Course
async function handleUpdateCourse() {
    const courseId = document.getElementById('edit_course_id').value;
    const courseName = document.getElementById('edit_course_name').value.trim();
    const collegeId = document.getElementById('edit_college_id').value;
    const form = document.getElementById('edit-course-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    if (!courseName) {
        showMessage('Course name is required', 'error');
        return;
    }
    if (!collegeId) {
        showMessage('Please select a college', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke-width="2"></circle></svg> Updating...';

    try {
        const formData = new FormData();
        formData.append('course_id', courseId);
        formData.append('course_name', courseName);
        formData.append('college_id', collegeId);
       
        const response = await fetch('pages/update_course.php', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success && result.course) {
            updateCourseRow(result.course.id, result.course.name, result.course.college);
            showMessage('Course updated successfully!', 'success');
            toggleModal('editCourseModal', false);
        } else {
            throw new Error(result.message || 'Update failed');
        }
    } catch (error) {
        console.error('Update course error:', error);
        showMessage(`Error updating course: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Open Delete Modal
function handleOpenDeleteCourseModal(courseId, courseName) {
    document.getElementById('deleteCourseId').value = courseId;
    document.getElementById('deleteCourseName').textContent = courseName;
    toggleModal('deleteCourseModal', true);
}

async function handleDeleteCourse(courseId) {
    const submitBtn = document.querySelector('#deleteCourseForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin h-4 w-4 inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Deleting...
    `;

    try {
        const formData = new FormData();
        formData.append('course_id', courseId);

        const response = await fetch('pages/delete_course.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('RAW DELETE RESPONSE:', result); // Add this line

        if (result.success) {
            showMessage(result.message || 'Course deleted successfully', 'success');
            removeCourseRow(courseId);
            toggleModal('deleteCourseModal', false);
        } else {
            // Check if it actually worked despite success: false
            if (result.rows_affected > 0 || result.message?.includes('deleted')) {
                // Actually succeeded despite what PHP says
                showMessage(result.message || 'Course deleted successfully', 'success');
                removeCourseRow(courseId);
                toggleModal('deleteCourseModal', false);
            } else {
                throw new Error(result.message || `Failed to delete course (affected: ${result.rows_affected})`);
            }
        }
    } catch (error) {
        console.error('Delete course error:', error);
        showMessage(`Error: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ----------------------------
// DOM MANIPULATION
// ----------------------------
function updateCourseRow(id, name, college) {
    const row = document.getElementById(`course-row-${id}`);
    if (row) {
        row.dataset.name = name.toLowerCase();
        row.dataset.college = college.toLowerCase();
        row.querySelector('td:nth-child(2)').textContent = name;
        row.querySelector('td:nth-child(3)').textContent = college;
       
        row.querySelectorAll('.edit-course-btn, .view-course-btn, .delete-course-btn').forEach(btn => {
            btn.dataset.courseName = name;
        });
    }
}

function removeCourseRow(id) {
    const row = document.getElementById(`course-row-${id}`);
    if (row) {
        row.remove();
    }
}

// ----------------------------
// UTILITY FUNCTIONS
// ----------------------------
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }
   
    if (show) {
        modal.classList.remove('hidden');
        modal.offsetHeight;
        modal.style.opacity = '1';
    } else {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

function showMessage(message, type = 'info') {
    console.log(`[${type}] ${message}`);
   
    if (typeof window.showCustomMessage === 'function') {
        window.showCustomMessage(message, type);
        return;
    }
   
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }
   
    const container = document.getElementById('custom-message-container');
    if (!container) {
        if (type === 'error') alert(`Error: ${message}`);
        else if (type === 'success') alert(`Success: ${message}`);
        return;
    }

    container.innerHTML = '';
   
    const alertDiv = document.createElement('div');
    alertDiv.className = `px-6 py-4 rounded-lg shadow-lg text-white font-medium mb-3 transform transition-all duration-300 text-center ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    }`;
    alertDiv.textContent = message;
    container.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.transform = 'translateY(0)';
        alertDiv.style.opacity = '1';
    }, 10);

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

// ----------------------------
// DEBUG
// ----------------------------
function debugModalClosing() {
    console.log('Testing modal closing...');
    const modal = document.getElementById('deleteCourseModal');
    if (modal) {
        console.log('Modal found, classes:', modal.className);
        console.log('Hidden?', modal.classList.contains('hidden'));
    } else {
        console.log('Modal not found');
    }
}

function forceCloseDeleteModal() {
    toggleModal('deleteCourseModal', false);
    console.log('Force closed delete modal');
}