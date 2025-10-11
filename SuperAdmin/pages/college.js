// Handle "Add College" form submission
function handleAddCollege() {
    const collegeName = document.getElementById('college_name').value.trim();
    const submitBtn = document.querySelector('#college-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    if (!collegeName) {
        showCustomMessage('College name is required', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke-width="2"></circle></svg> Saving...';

    fetch('pages/add_college.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `college_name=${encodeURIComponent(collegeName)}`
    })
    .then(response => response.text())
    .then(text => {
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Invalid JSON:', text);
            showCustomMessage('Server error. Check console.', 'error');
            return;
        }

        if (data.success) {
            // Add new row to table
            const tbody = document.querySelector('#collegeTable tbody');
            if (tbody) {
                const row = document.createElement('tr');
                row.className = 'border-b hover:bg-gray-50';
                row.dataset.id = String(data.college.id).toLowerCase();
                row.dataset.name = data.college.name.toLowerCase();
                row.innerHTML = `
                    <td class="px-4 py-3 text-sm">${escapeHtml(data.college.id)}</td>
                    <td class="px-4 py-3 text-sm">${escapeHtml(data.college.name)}</td>
                    <td class="px-4 py-3 text-center">
                        <div class="relative inline-block text-left">
                            <button type="button" class="manage-btn w-24 px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none">
                                Manage ▾
                            </button>
                            <div class="manage-dropdown hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                                <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit College</a>
                                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove College</a>
                            </div>
                        </div>
                    </td>
                `;
                tbody.prepend(row);

                // Rebind dropdowns for new row
                initManageDropdowns();
            }

            // Close modal & reset
            closeModal();
            document.getElementById('college-form').reset();
            showCustomMessage('College added successfully!', 'success');
        } else {
            showCustomMessage(data.message || 'Failed to add college', 'error');
        }
    })
    .catch(err => {
        console.error('Fetch error:', err);
        showCustomMessage('Network error. Try again.', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show custom message (matches your #custom-message-container)
function showCustomMessage(message, type = 'info') {
    const container = document.getElementById('custom-message-container');
    if (!container) return;

    // Remove existing
    container.innerHTML = '';

    const alertDiv = document.createElement('div');
    alertDiv.className = `px-4 py-3 rounded-md shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
    }`;
    alertDiv.textContent = message;

    container.appendChild(alertDiv);

    // Auto-hide after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode === container) {
            container.removeChild(alertDiv);
        }
    }, 3000);
}

// Close modal
function closeModal() {
    const modal = document.getElementById('modal-college');
    if (modal) {
        modal.classList.add('hidden');
        setTimeout(() => modal.style.opacity = '0', 10);
    }
}

// Initialize dropdowns
function initManageDropdowns() {
    document.querySelectorAll('.manage-btn').forEach(btn => {
        const handleClick = (e) => {
            e.stopPropagation();
            // Close all other dropdowns
            document.querySelectorAll('.manage-dropdown').forEach(d => d.classList.add('hidden'));
            const dropdown = btn.nextElementSibling;
            if (dropdown) dropdown.classList.toggle('hidden');
        };
        btn.removeEventListener('click', handleClick); // Avoid duplicates
        btn.addEventListener('click', handleClick);
    });
}

// Close dropdowns on outside click
document.addEventListener('click', () => {
    document.querySelectorAll('.manage-dropdown').forEach(d => d.classList.add('hidden'));
});

// Modal open/close
document.getElementById('openAddCollege')?.addEventListener('click', () => {
    const modal = document.getElementById('modal-college');
    if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.style.opacity = '1', 10);
    }
});

document.getElementById('close-college-modal-btn')?.addEventListener('click', closeModal);
document.getElementById('cancel-college-modal-btn')?.addEventListener('click', closeModal);

// Initialize dropdowns on load
document.addEventListener('DOMContentLoaded', initManageDropdowns);