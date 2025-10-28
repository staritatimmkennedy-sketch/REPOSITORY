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

    // Remove any existing submit handlers to prevent duplicates
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);

    // Add submit handler to the new form
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
        showToast('Course name is required', 'error');
        return;
    }
    if (!collegeId) {
        showToast('Please select a college', 'error');
        return;
    }

    // Get submit button and show loading state
    const submitBtn = document.querySelector('#course-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Saving...
    `;

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
            showToast('Course added successfully!', 'success');
            closeModalAndRefresh();
        } else {
            showToast(data.message || 'Error adding course', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Network error: ' + error.message, 'error');
    })
    .finally(() => {
        // Restore button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
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