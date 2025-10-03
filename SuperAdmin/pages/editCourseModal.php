<!-- 
    Edit Course Modal 
    ID: modal-edit-course
    For editing existing courses
-->
<div id="modal-edit-course" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center transition-opacity duration-300 opacity-0">
    <!-- Modal Card Container -->
    <div class="cf-card w-full max-w-2xl mx-4" onclick="event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-semibold text-gray-800">Edit Course</h3>
            <!-- Close Button -->
            <button type="button" id="close-edit-course-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Modal Body (Edit Course Form) -->
        <form id="edit-course-form" onsubmit="event.preventDefault(); handleEditCourse();">
            <div class="space-y-4">
                <!-- Course ID (readonly) -->
                <div>
                    <label for="edit_course_id" class="cf-label required">Course ID</label>
                    <input type="text" id="edit_course_id" class="cf-input font-mono bg-gray-100" readonly>
                </div>

                <!-- Course Name -->
                <div>
                    <label for="edit_course_name" class="cf-label required">Course Name</label>
                    <input type="text" id="edit_course_name" class="cf-input" placeholder="e.g., Bachelor of Science in Information Technology" required>
                </div>

                <!-- College Information -->
                <div class="border-t pt-4 mt-4">
                    <h4 class="text-lg font-medium text-gray-700 mb-3">College Information</h4>
                    
                    <!-- College Name -->
                    <div class="mt-4">
                        <label for="edit_college_name" class="cf-label">College Name</label>
                        <select id="edit_college_name" class="cf-input">
                            <option value="" selected>Select College</option>
                            <option value="CET">College of Engineering, Architecture and Technology (CEAT)</option>
                            <option value="CAS">College of Arts and Sciences (CEAS)</option>
                            <option value="CBA">Business College (BC)</option>
                            <option value="EDU">College of Health and Science (CHS)</option>
                        </select>
                    </div>

                    <!-- Program Type -->
                    <div class="mt-4">
                        <label for="edit_program_type" class="cf-label">Program Type</label>
                        <select id="edit_program_type" class="cf-input">
                            <option value="" selected>Select Program Type</option>
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Doctorate">Doctorate</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Modal Footer (Buttons) -->
            <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button type="button" id="cancel-edit-course-modal-btn" class="cf-btn-secondary">
                    Cancel
                </button>
                <button type="submit" class="cf-btn-primary flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Update Course
                </button>
            </div>
        </form>
    </div>
</div>

<script>
// Handle edit course submission
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
</script>