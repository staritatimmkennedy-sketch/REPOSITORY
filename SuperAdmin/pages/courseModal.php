<!-- 
    Course Management Modal 
    ID: modal-course
    This is the hidden modal overlay structure, included at the bottom of pages/course.php
-->
<div id="modal-course" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center transition-opacity duration-300 opacity-0">
    <!-- Modal Card Container -->
    <div class="cf-card w-full max-w-2xl mx-4" onclick="event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-semibold text-gray-800">Add New Course</h3>
            <!-- Close Button -->
            <button type="button" id="close-course-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Modal Body (Course Form) -->
        <form id="course-form" onsubmit="event.preventDefault(); console.log('Simulating Course Data Submission...'); toggleModal('modal-course'); showCustomMessage('Course added successfully!', 'success');">
            <div class="space-y-4">
            

                <!-- Course Name -->
                <div>
                    <label for="course_name" class="cf-label required">Course Name</label>
                    <input type="text" id="course_name" class="cf-input" placeholder="e.g., Bachelor of Science in Information Technology" required>
                </div>

                <!-- Additional Information (Optional Fields) -->
                <div class="border-t pt-4 mt-4">
                    <h4 class="text-lg font-medium text-gray-700 mb-3">College Information</h4>
                    
                    <div class="grid grid-cols-2 gap-4">           
                    </div>

                    <!-- College Name -->
                    <div class="mt-4">
                        <label for="college_name" class="cf-label">College Name</label>
                        <select id="college_name" class="cf-input">
                            <option value="" selected>Select College (Optional)</option>
                            <option value="CEAT">College of Engineering, Architecture and Technology (CEAT)</option>
                            <option value="CEAS">College of Arts and Sciences (CEAS)</option>
                            <option value="BC">Business College (BC)</option>
                            <option value="CHS">College of Health and Science (CHS)</option>
                        </select>
                    </div>

                    <!-- Program Type -->
                    <div class="mt-4">
                        <label for="program_type" class="cf-label">Program Type</label>
                        <select id="program_type" class="cf-input">
                            <option value="" selected>Select Program Type (Optional)</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Doctorate">Doctorate</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Modal Footer (Buttons) -->
            <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button type="button" id="cancel-course-modal-btn" class="cf-btn-secondary">
                    Cancel
                </button>
                <button type="submit" class="cf-btn-primary flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Save Course
                </button>
            </div>
        </form>
    </div>
</div>

<!-- Custom Message Display (for simulating alerts) -->
<div id="custom-message-container" class="fixed top-5 right-5 z-50"></div>

<script>
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
    const closeModalBtn = document.getElementById('close-course-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            toggleModal('modal-course');
        });
    }

    // Cancel Modal Button
    const cancelModalBtn = document.getElementById('cancel-course-modal-btn');
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function() {
            toggleModal('modal-course');
        });
    }

    // Close modal when clicking outside
    const modal = document.getElementById('modal-course');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                toggleModal('modal-course');
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modal-course');
            if (modal && !modal.classList.contains('hidden')) {
                toggleModal('modal-course');
            }
        }
    });
});
</script>