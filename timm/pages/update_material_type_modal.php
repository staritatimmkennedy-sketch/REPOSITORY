<div id="updateMaterialTypeModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-300">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onclick="event.stopPropagation()">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold" id="updateTypeModalTitle"></h2>
      <button type="button" id="closeUpdateMaterialTypeModal" class="text-gray-400 hover:text-gray-600" onclick="toggleModal('updateMaterialTypeModal', false)">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <form id="updateMaterialTypeForm">
      <input type="hidden" name="materialType_id" id="updateMaterialTypeId">
      
      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Type Name <span class="text-red-500">*</span></label>
        <input type="text" name="materialTypeName" id="updateMaterialTypeName" required 
               class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:border-green-500 focus:outline-none" 
               placeholder="Enter material type name" />
      </div>

      <div class="mb-3">
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="materialTypeDescription" id="updateMaterialTypeDescription" rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:border-green-500 focus:outline-none"
                  placeholder="Enter description (optional)"></textarea>
      </div>

      <div class="flex justify-end space-x-2 mt-4">
        <button type="button" id="cancelUpdateMaterialType"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                onclick="toggleModal('updateMaterialTypeModal', false)">Cancel</button>
        <button type="submit" id="updateMaterialTypeSubmit"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Save Changes
        </button>
      </div>
    </form>
  </div>
</div>