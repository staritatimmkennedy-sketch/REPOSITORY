function handleEditCollege() {
    const collegeId = document.getElementById('edit_college_id').value;
    const collegeName = document.getElementById('edit_college_name').value;
    const collegeDean = document.getElementById('edit_college_dean').value;
    const collegeLocation = document.getElementById('edit_college_location').value;
    const collegeStatus = document.getElementById('edit_college_status').value;
    
    console.log('Updating college:', { 
        collegeId, 
        collegeName, 
        collegeDean, 
        collegeLocation, 
        collegeStatus 
    });
    
    showCustomMessage(`College ${collegeId} updated successfully!`, 'success');
    toggleModal('modal-edit-college');
}

// Function to open edit modal with college data
function openEditCollegeModal(collegeData) {
    // Populate form fields with college data
    document.getElementById('edit_college_id').value = collegeData.collegeId;
    document.getElementById('edit_college_name').value = collegeData.collegeName;
    document.getElementById('edit_college_dean').value = collegeData.collegeDean || '';
    document.getElementById('edit_college_location').value = collegeData.collegeLocation || '';
    document.getElementById('edit_college_status').value = collegeData.collegeStatus || 'Active';
    
    // Open the modal
    toggleModal('modal-edit-college');
}

// Initialize modal close functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close Modal Button
    const closeModalBtn = document.getElementById('close-edit-college-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            toggleModal('modal-edit-college');
        });
    }

    // Cancel Modal Button
    const cancelModalBtn = document.getElementById('cancel-edit-college-modal-btn');
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function() {
            toggleModal('modal-edit-college');
        });
    }

    // Close modal when clicking outside
    const modal = document.getElementById('modal-edit-college');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                toggleModal('modal-edit-college');
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modal-edit-college');
            if (modal && !modal.classList.contains('hidden')) {
                toggleModal('modal-edit-college');
            }
        }
    });
});