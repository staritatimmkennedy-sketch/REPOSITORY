function handleEditCourse() {
    const courseId = document.getElementById('edit_course_id').value;
    const courseName = document.getElementById('edit_course_name').value;
    const collegeName = document.getElementById('edit_college_name').value;
    const programType = document.getElementById('edit_program_type').value;
    
    console.log('Updating course:', { courseId, courseName, collegeName, programType });
    showCustomMessage(`Course ${courseId} updated successfully!`, 'success');
    toggleModal('modal-edit-course');
}

// Function to open edit modal with course data
function openEditCourseModal(courseData) {
    // Populate form fields with course data
    document.getElementById('edit_course_id').value = courseData.courseId;
    document.getElementById('edit_course_name').value = courseData.courseName;
    document.getElementById('edit_college_name').value = courseData.collegeName;
    document.getElementById('edit_program_type').value = courseData.programType;
    
    // Open the modal
    toggleModal('modal-edit-course');
}

// Initialize modal close functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close Modal Button
    const closeModalBtn = document.getElementById('close-edit-course-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            toggleModal('modal-edit-course');
        });
    }

    // Cancel Modal Button
    const cancelModalBtn = document.getElementById('cancel-edit-course-modal-btn');
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function() {
            toggleModal('modal-edit-course');
        });
    }

    // Close modal when clicking outside
    const modal = document.getElementById('modal-edit-course');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                toggleModal('modal-edit-course');
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modal-edit-course');
            if (modal && !modal.classList.contains('hidden')) {
                toggleModal('modal-edit-course');
            }
        }
    });
});