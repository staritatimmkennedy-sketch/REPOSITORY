<!-- 
    Delete Confirmation Modal 
    ID: modal-delete
    Reusable modal for deleting courses, colleges, and other records
-->
<div id="modal-delete" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center transition-opacity duration-300 opacity-0">
    <!-- Modal Card Container -->
    <div class="cf-card w-full max-w-md mx-4" onclick="event.stopPropagation()">
        
        <!-- Modal Header -->
        <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-semibold text-gray-800" id="delete-modal-title">Delete Confirmation</h3>
            <!-- Close Button -->
            <button type="button" id="close-delete-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>

        <!-- Modal Body -->
        <div class="space-y-4">
            <!-- Warning Icon -->
            <div class="flex justify-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </div>
            </div>

            <!-- Confirmation Message -->
            <div class="text-center">
                <p class="text-lg font-medium text-gray-800" id="delete-confirmation-message">
                    Are you sure you want to delete this item?
                </p>
                <p class="text-sm text-gray-600 mt-2" id="delete-warning-text">
                    This action cannot be undone.
                </p>
            </div>
        </div>

        <!-- Modal Footer (Buttons) -->
        <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button type="button" id="cancel-delete-modal-btn" class="cf-btn-secondary">
                Cancel
            </button>
            <button type="button" id="confirm-delete-btn" class="cf-btn-danger flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete
            </button>
        </div>
    </div>
</div>

<script>
// Global variables to store deletion callback and item type
let deleteCallback = null;
let currentItemType = '';

// Function to open delete confirmation modal
function openDeleteModal(itemData, itemType, onConfirmCallback) {
    // Set item type and callback
    currentItemType = itemType;
    deleteCallback = onConfirmCallback;
    
    // Update modal content based on item type
    const title = document.getElementById('delete-modal-title');
    const message = document.getElementById('delete-confirmation-message');

    
    if (itemType === 'course') {
        title.textContent = 'Delete Course';
        message.textContent = `Are you sure you want to delete this course?`;
  
    } else if (itemType === 'college') {
        title.textContent = 'Delete College';
        message.textContent = `Are you sure you want to delete this college?`;
     
    }
    
    // Open the modal
    toggleModal('modal-delete');
}

// Handle delete confirmation
function handleDeleteConfirm() {
    if (deleteCallback && typeof deleteCallback === 'function') {
        deleteCallback();
    }
    toggleModal('modal-delete');
}

// Initialize modal functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close Modal Button
    const closeModalBtn = document.getElementById('close-delete-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            toggleModal('modal-delete');
        });
    }

    // Cancel Modal Button
    const cancelModalBtn = document.getElementById('cancel-delete-modal-btn');
    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', function() {
            toggleModal('modal-delete');
        });
    }

    // Confirm Delete Button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);
    }

    // Close modal when clicking outside
    const modal = document.getElementById('modal-delete');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                toggleModal('modal-delete');
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('modal-delete');
            if (modal && !modal.classList.contains('hidden')) {
                toggleModal('modal-delete');
            }
        }
    });
});
</script>