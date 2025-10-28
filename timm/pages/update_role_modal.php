<div id="updateRoleModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-300">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onclick="event.stopPropagation()">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold" id="updateRoleModalTitle">Edit Role: <span id="updateRoleNameTitle"></span></h2>
      <button type="button" id="closeUpdateRoleModal" class="text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <form id="updateRoleForm" data-custom-handler="true">
      <input type="hidden" name="role_id" id="updateRoleId">
      
      <div class="mb-3">
        <label class="block font-medium mb-1">Role Name <span class="text-red-500">*</span></label>
        <input type="text" name="role_name" id="updateRoleName" required 
               class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:outline-none" />
      </div>

      <div class="mb-3">
        <label class="block font-medium mb-1">Description</label>
        <textarea name="description" id="updateRoleDescription" rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:outline-none"></textarea>
      </div>

      <div class="mb-3">
        <label class="block font-medium mb-1">Permissions</label>
        <div class="flex flex-col gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md" id="updatePermissionsList">
          <?php
          global $allPermissions;
          foreach ($allPermissions as $value => $label): ?>
            <label class="flex items-start">
              <input type="checkbox" name="permissions[]" value="<?= htmlspecialchars($value) ?>" 
                     class="mt-1 mr-2 update-perm-checkbox">
              <span class="text-sm"><?= htmlspecialchars($label) ?></span>
            </label>
          <?php endforeach; ?>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" id="cancelUpdateRole" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
          Cancel
        </button>
        <button type="submit" id="updateRoleSubmit" 
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>