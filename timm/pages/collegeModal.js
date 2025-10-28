// pages/courseModal.js

function showCustomMessage(message, type = 'info') {
    const container = document.getElementById('custom-message-container');
    if (!container) return;

    container.innerHTML = '';
    const alert = document.createElement('div');
    alert.className = `px-4 py-3 rounded-md shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    alert.textContent = message;
    container.appendChild(alert);
    setTimeout(() => {
        if (alert.parentNode === container) {
            container.removeChild(alert);
        }
    }, 4000); // Slightly longer for error messages
}

function toggleModal(modalId, show = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (show === true || (show === null && modal.classList.contains('hidden'))) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.style.opacity = '1', 10);
    } else {
        modal.style.opacity = '0';
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = typeof text === 'string' ? text : '';
    return div.innerHTML;
}

function initDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'));

    document.querySelectorAll('.relative > button').forEach(button => {
        const handleClick = (e) => {
            e.stopPropagation();
            const menu = button.nextElementSibling;
            if (menu?.classList.contains('dropdown-menu')) {
                document.querySelectorAll('.dropdown-menu').forEach(m => {
                    if (m !== menu) m.classList.add('hidden');
                });
                menu.classList.toggle('hidden');
            }
        };

        button.removeEventListener('click', handleClick);
        button.addEventListener('click', handleClick);
    });
}

function handleOutsideClick(e) {
    if (!e.target.closest('.relative')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.add('hidden'));
    }
}

// ✅ FIXED: Fetch real college name from the dropdown options
function getCollegeNameById(collegeId) {
    const select = document.getElementById('college_id');
    if (!select) return collegeId;
    const option = Array.from(select.options).find(opt => opt.value === collegeId);
    return option ? option.textContent : collegeId;
}

function addCourseRow(courseData) {
    const tbody = document.querySelector('#courseTable tbody');
    if (!tbody) return;

    const collegeName = getCollegeNameById(courseData.collegeId); // ✅ Use ID to find name

    const row = document.createElement('tr');
    row.className = 'border-b hover:bg-gray-50';
    row.dataset.id = String(courseData.id).toLowerCase();
    row.dataset.name = courseData.name.toLowerCase();
    row.dataset.college = collegeName.toLowerCase();

    row.innerHTML = `
        <td class="px-4 py-3 text-sm">${escapeHtml(courseData.id)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(courseData.name)}</td>
        <td class="px-4 py-3 text-sm">${escapeHtml(collegeName)}</td>
        <td class="px-4 py-3 text-center">
            <div class="relative inline-block text-left">
                <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
                    Manage ▾
                </button>
                <div class="dropdown-menu hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-50">
                    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Course</a>
                    <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Course</a>
                </div>
            </div>
        </td>
    `;

    tbody.prepend(row);
    initDropdowns();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('openAddCourse')?.addEventListener('click', () => {
        toggleModal('modal-course', true);
    });

    ['close-course-modal-btn', 'cancel-course-modal-btn'].forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => {
            toggleModal('modal-course', false);
        });
    });

    const form = document.getElementById('course-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const courseName = document.getElementById('course_name')?.value.trim();
            const collegeId = document.getElementById('college_id')?.value;

            if (!courseName || !collegeId) {
                showCustomMessage('Please fill all required fields', 'error');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke-width="2"></circle>
                </svg> Saving...
            `;

            try {
                const res = await fetch('pages/add_course.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `course_name=${encodeURIComponent(courseName)}&college_id=${encodeURIComponent(collegeId)}`
                });

                // 🔍 DEBUG: Log raw response
                const text = await res.text();
                console.log('Raw response from add_course.php:', text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseErr) {
                    console.error('Failed to parse JSON. Server likely crashed.');
                    showCustomMessage('Server error: Invalid response. Check console.', 'error');
                    return;
                }

                if (data.success && data.course && data.course.id) {
                    addCourseRow({
                        id: data.course.id,
                        name: courseName,
                        collegeId: collegeId // ✅ Pass ID, not name
                    });

                    toggleModal('modal-course', false);
                    form.reset();
                    showCustomMessage('Course added successfully!', 'success');
                } else {
                    // ✅ Show actual error message from PHP
                    showCustomMessage(data.message || 'Failed to add course', 'error');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                showCustomMessage('Network error. Please try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }

    initDropdowns();
    document.addEventListener('click', handleOutsideClick);
});