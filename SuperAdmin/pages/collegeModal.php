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

<script src="pages/collegeModal.js"></script>