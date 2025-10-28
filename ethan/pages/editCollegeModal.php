<!-- 
    Edit College Modal 
    ID: modal-edit-college
    For editing existing colleges
-->
<div id="modal-edit-college" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center transition-opacity duration-300 opacity-0">
    <!-- Modal Card Container -->
    <div class="cf-card w-full max-w-2xl mx-4" onclick="event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-semibold text-gray-800">Edit College</h3>
            <!-- Close Button -->
            <button type="button" id="close-edit-college-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Modal Body (Edit College Form) -->
        <form id="edit-college-form" onsubmit="event.preventDefault(); handleEditCollege();">
            <div class="space-y-4">
                
                <!-- College ID (readonly) -->
                <div>
                    <label for="edit_college_id" class="cf-label required">College ID</label>
                    <input type="text" id="edit_college_id" class="cf-input font-mono uppercase bg-gray-100" readonly>
                    <p class="text-sm text-gray-500 mt-1">College ID cannot be changed</p>
                </div>

                <!-- College Name -->
                <div>
                    <label for="edit_college_name" class="cf-label required">College Name</label>
                    <input type="text" id="edit_college_name" class="cf-input" placeholder="e.g., College of Engineering, Architecture & Technology" required>
                </div>

                <!-- Additional Information -->
                <div class="border-t pt-4 mt-4">
                    <h4 class="text-lg font-medium text-gray-700 mb-3">Additional Information</h4>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Dean Name -->
                        <div>
                            <label for="edit_college_dean" class="cf-label">Dean Name</label>
                            <input type="text" id="edit_college_dean" class="cf-input" placeholder="e.g., Dr. John Smith">
                        </div>
                        
                        <!-- Location/Building -->
                        <div>
                            <label for="edit_college_location" class="cf-label">Location/Building</label>
                            <input type="text" id="edit_college_location" class="cf-input" placeholder="e.g., Engineering Building, Room 101">
                        </div>
                    </div>

                    <!-- Status -->
                    <div class="mt-4">
                        <label for="edit_college_status" class="cf-label">Status</label>
                        <select id="edit_college_status" class="cf-input">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Under Review">Under Review</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Modal Footer (Buttons) -->
            <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button type="button" id="cancel-edit-college-modal-btn" class="cf-btn-secondary">
                    Cancel
                </button>
                <button type="submit" class="cf-btn-primary flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Update College
                </button>
            </div>
        </form>
    </div>
</div>

<script src="editCollegeModal.js"></script>