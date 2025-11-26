<div id="deleteMaterialTypeModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-300">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onclick="event.stopPropagation()">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold text-red-600">Confirm Deletion</h2>
      <button type="button" id="closeDeleteMaterialTypeModal" class="text-gray-400 hover:text-gray-600" onclick="toggleModal('deleteMaterialTypeModal', false)">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <p class="mb-4">Are you sure you want to delete the material type: <strong id="deleteMaterialTypeName"></strong>?</p>
    <p class="text-sm text-gray-600 mb-4">This action cannot be undone and may be prevented if materials are linked.</p>

    <form id="deleteMaterialTypeForm">
        <input type="hidden" name="materialType_id" id="deleteMaterialTypeId">

        <div class="flex justify-end space-x-2">
            <button type="button" id="cancelDeleteMaterialType" 
                    class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                    onclick="toggleModal('deleteMaterialTypeModal', false)">Cancel</button>
            <button type="submit" 
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
              Delete Type
            </button>
        </div>
    </form>
  </div>
</div>