// courseModalFinal.js - Production ready version
document.addEventListener('DOMContentLoaded', function() {
    initializeCourseForm();
    initializeModalCloseHandlers();
});

function initializeCourseForm() {
    const form = document.getElementById('course-form');
    if (!form) {
        console.error('Course form not found');
        return;
    }

    console.log('Initializing course form handler');

    // Replace form to remove any existing listeners
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Change submit button to regular button to prevent default form submission
    const submitBtn = newForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.type = 'button';
    }

    // Add click handler to the button
    if (submitBtn) {
        submitBtn.addEventListener('click', handleSaveCourse);
    }

    // Also handle form submit event as a safety measure
    newForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSaveCourse();
    });

    console.log('Course form handler initialized successfully');
}

function handleSaveCourse() {
    console.log('Saving course...');
    
    const courseName = document.getElementById('course_name')?.value.trim();
    const collegeId = document.getElementById('college_id')?.value;

    console.log('Form data:', { courseName, collegeId });

    // Validation
    if (!courseName) {
        showMessage('Course name is required', 'error');
        return;
    }
    if (!collegeId) {
        showMessage('Please select a college', 'error');
        return;
    }

    // Get submit button and show loading state
    const submitBtn = document.querySelector('#course-form button[type="button"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
    `;
    submitBtn.disabled = true;

    // Prepare data
    const formData = new FormData();
    formData.append('course_name', courseName);
    formData.append('college_id', collegeId);

    // Send request
    fetch('pages/add_course.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        if (data.success) {
            showMessage('Course added successfully!', 'success');
            closeModalAndRefresh();
        } else {
            showMessage(data.message || 'Error adding course', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('Network error: ' + error.message, 'error');
    })
    .finally(() => {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
}

function initializeModalCloseHandlers() {
    const closeBtn = document.getElementById('close-course-modal-btn');
    const cancelBtn = document.getElementById('cancel-course-modal-btn');
    const modal = document.getElementById('modal-course');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCourseModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeCourseModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCourseModal();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const currentModal = document.getElementById('modal-course');
            if (currentModal && !currentModal.classList.contains('hidden')) {
                closeCourseModal();
            }
        }
    });
}

function closeCourseModal() {
    const modal = document.getElementById('modal-course');
    if (modal) {
        if (typeof toggleModal === 'function') {
            toggleModal('modal-course', false);
        } else {
            modal.classList.add('hidden');
        }
    }
    
    // Clear form
    const form = document.getElementById('course-form');
    if (form) {
        form.reset();
    }
}

function closeModalAndRefresh() {
    closeCourseModal();
    
    // Refresh page after delay to show new course
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

function showMessage(message, type = 'info') {
    const container = document.getElementById('custom-message-container');
    if (!container) {
        // Fallback to alert if container not found
        alert(message);
        return;
    }

    const alertDiv = document.createElement('div');
    
    let classes = "p-4 rounded-lg shadow-lg mb-3 flex items-center transition-all duration-300 transform translate-x-full opacity-0";
    
    if (type === 'success') {
        classes += " bg-green-500 text-white";
    } else if (type === 'error') {
        classes += " bg-red-500 text-white";
    } else {
        classes += " bg-blue-500 text-white";
    }

    alertDiv.className = classes;
    alertDiv.innerHTML = `
        <svg class="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M13 10V3L4 14h7v7l9-11h-7z'}"></path>
        </svg>
        <span class="break-words">${message}</span>
    `;
    
    container.appendChild(alertDiv);

    // Animate in
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            alertDiv.classList.remove('translate-x-full', 'opacity-0');
            alertDiv.classList.add('translate-x-0', 'opacity-100');
        });
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('translate-x-0', 'opacity-100');
        alertDiv.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (alertDiv.parentNode === container) {
                container.removeChild(alertDiv);
            }
        }, 300);
    }, 5000);
}