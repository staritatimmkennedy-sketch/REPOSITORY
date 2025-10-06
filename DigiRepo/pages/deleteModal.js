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