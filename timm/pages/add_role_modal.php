<!-- Add Role Modal -->
<div id="addRoleModal" 
     class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-300">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
    <h2 class="text-lg font-bold mb-4">Add New Role</h2>

    <form id="addRoleForm">
      <!-- Role Name -->
      <div class="mb-3">
        <label class="block font-medium mb-1">Role Name <span class="text-red-500">*</span></label>
        <input type="text" name="role_name" required 
               class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:outline-none" />
      </div>

      <!-- Description -->
      <div class="mb-3">
        <label class="block font-medium mb-1">Description</label>
        <textarea name="description" rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:outline-none"></textarea>
      </div>

      <!-- Permissions -->
      <div class="mb-3">
        <label class="block font-medium mb-1">Permissions</label>
        <div class="flex flex-col gap-2 mt-1">
          <?php
          $allPermissions = [
            'borrow_material' => 'Borrow Materials',
            'return_material' => 'Return Materials',
            'publish_material' => 'Publish Materials',
            'approve_publish' => 'Approve Publishing',
            'submit_material' => 'Submit Materials',
            'approve_submission' => 'Approve Submissions',
            'manage_users' => 'Manage Users',
            'manage_roles' => 'Manage Roles',
            'manage_courses' => 'Manage Colleges / Courses',
            'manage_materials' => 'Manage Materials'
          ];
          foreach ($allPermissions as $value => $label): ?>
            <label class="flex items-start">
              <input type="checkbox" name="permissions[]" value="<?= htmlspecialchars($value) ?>" 
                     class="mt-1 mr-2 add-perm-checkbox">
              <span><?= htmlspecialchars($label) ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" id="cancelAddRole" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
          Cancel
        </button>
        <button type="submit" 
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Add Role
        </button>
      </div>
    </form>
  </div>
</div>

<script>
// Add modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const addRoleModal = document.getElementById('addRoleModal');
    const cancelAddRole = document.getElementById('cancelAddRole');
    
    if (cancelAddRole) {
        cancelAddRole.addEventListener('click', function() {
            if (typeof toggleModal === 'function') {
                toggleModal('addRoleModal', false);
            } else {
                addRoleModal.classList.add('hidden');
            }
        });
    }
    
    // Close modal when clicking outside
    if (addRoleModal) {
        addRoleModal.addEventListener('click', function(e) {
            if (e.target === addRoleModal) {
                if (typeof toggleModal === 'function') {
                    toggleModal('addRoleModal', false);
                } else {
                    addRoleModal.classList.add('hidden');
                }
            }
        });
    }
});
</script>