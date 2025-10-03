<!-- 
    Add College Modal 
    ID: modal-college
    For adding new colleges
-->
<div id="modal-college" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center transition-opacity duration-300 opacity-0">
    <!-- Modal Card Container -->
    <div class="cf-card w-full max-w-2xl mx-4" onclick="event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-semibold text-gray-800">Add New College</h3>
            <!-- Close Button -->
            <button type="button" id="close-college-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Modal Body (College Form) -->
        <form id="college-form" onsubmit="event.preventDefault(); handleAddCollege();">
            <div class="space-y-4">

                <!-- College Name -->
                <div>
                    <label for="college_name" class="cf-label required">College Name</label>
                    <input type="text" id="college_name" class="cf-input" placeholder="e.g., College of Engineering, Architecture & Technology" required>
                </div>

                <!-- Additional Information -->
                <div class="border-t pt-4 mt-4">
                    <h4 class="text-lg font-medium text-gray-700 mb-3">Additional Information</h4>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Dean Name -->
                        <div>
                            <label for="college_dean" class="cf-label">Dean Name</label>
                            <input type="text" id="college_dean" class="cf-input" placeholder="e.g., Dr. John Smith">
                        </div>
                        
                    </div>

                    <!-- Location/Building -->
                    <div class="mt-4">
                        <label for="college_location" class="cf-label">Location/Building</label>
                        <input type="text" id="college_location" class="cf-input" placeholder="e.g., Engineering Building, Room 101">
                    </div>

                    <!-- Status -->
                    <div class="mt-4">
                        <label for="college_status" class="cf-label">Status</label>
                        <select id="college_status" class="cf-input">
                            <option value="Active" selected>Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Under Review">Under Review</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Modal Footer (Buttons) -->
            <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button type="button" id="cancel-college-modal-btn" class="cf-btn-secondary">
                    Cancel
                </button>
                <button type="submit" class="cf-btn-primary flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Save College
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Custom Message Display (for simulating alerts) -->
<div id="custom-message-container" class="fixed top-5 right-5 z-50"></div>

<script>
// Handle add college submission
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
</script>