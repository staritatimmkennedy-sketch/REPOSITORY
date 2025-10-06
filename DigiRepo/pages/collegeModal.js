function handleAddCollege() {
    const collegeId = document.getElementById('college_id').value;
    const collegeName = document.getElementById('college_name').value;
    const collegeDescription = document.getElementById('college_description').value;
    const collegeDean = document.getElementById('college_dean').value;
    const collegeEmail = document.getElementById('college_email').value;
    const collegeLocation = document.getElementById('college_location').value;
    const collegeStatus = document.getElementById('college_status').value;
    
    console.log('Adding new college:', { 
        collegeId, 
        collegeName, 
        collegeDescription, 
        collegeDean, 
        collegeEmail, 
        collegeLocation, 
        collegeStatus 
    });
    
    showCustomMessage(`College ${collegeId} added successfully!`, 'success');
    toggleModal('modal-college');
    
    // Reset form
    document.getElementById('college-form').reset();
}

// Utility to show messages instead of alert()
function showCustomMessage(message, type = 'info') {
    const container = document.getElementById('custom-message-container');
    const alertDiv = document.createElement('div');
    
    // Base classes
    let classes = "p-4 rounded-lg shadow-lg mb-3 flex items-center transition-all duration-300 transform translate-x-full opacity-0";
    
    // Type specific classes
    if (type === 'success') {
        classes += " bg-green-500 text-white";
    } else if (type === 'error') {
        classes += " bg-red-500 text-white";
    } else {
        classes += " bg-blue-500 text-white";
    }

    alertDiv.className = classes;
    alertDiv.innerHTML = `
        <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M13 10V3L4 14h7v7l9-11h-7z'}"></path></svg>
        <span>${message}</span>
    `;
    
    container.appendChild(alertDiv);

    // Animate in
    setTimeout(() => {
        alertDiv.classList.remove('translate-x-full', 'opacity-0');
        alertDiv.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // Animate out and remove after 3 seconds
    setTimeout(() => {
        alertDiv.classList.remove('translate-x-0', 'opacity-100');
        alertDiv.classList.add('translate-x-full', 'opacity-0');
        // Remove from DOM after transition
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Initialize modal close functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close Modal Button
    const closeModalBtn = document.getElementById('close-college-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            toggleModal('modal-college');
        });
    }

    // Cancel Modal Button
    const cancelModalBtn = document.getElementById('cancel-college-modal-btn');
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function() {
            toggleModal('modal-college');
        });
    }

    // Close modal when clicking outside
    const modal = document.getElementById('modal-college');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                toggleModal('modal-college');
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modal-college');
            if (modal && !modal.classList.contains('hidden')) {
                toggleModal('modal-college');
            }
        }
    });
});