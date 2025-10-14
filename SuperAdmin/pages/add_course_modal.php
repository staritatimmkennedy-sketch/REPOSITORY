<!-- Add Course Modal -->
<div id="modal-course" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden opacity-0 transition-opacity duration-300">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onclick="event.stopPropagation()">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold">Add New Course</h2>
            <button type="button" id="close-course-modal-btn" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="course-form" novalidate>
            <div class="space-y-4">
                <!-- Course Name -->
                <div>
                    <label for="course_name" class="block text-sm font-medium text-gray-700 mb-1">Course Name <span class="text-red-500">*</span></label>
                    <input type="text" id="course_name" name="course_name" 
                           class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:border-green-500 focus:outline-none"
                           placeholder="e.g., Bachelor of Science in Information Technology" required>
                </div>

                <!-- College Selection -->
                <div class="border-t pt-4 mt-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">College Information</h4>
                    <div>
                        <label for="college_id" class="block text-sm font-medium text-gray-700 mb-1">College <span class="text-red-500">*</span></label>
                        <select id="college_id" name="college_id" 
                                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-green-500 focus:border-green-500 focus:outline-none" required>
                            <option value="">Select College</option>
                            <?php if (!empty($collegesForModal)): ?>
                                <?php foreach ($collegesForModal as $college): ?>
                                    <option value="<?= htmlspecialchars($college['id'], ENT_QUOTES, 'UTF-8') ?>">
                                        <?= htmlspecialchars($college['name'], ENT_QUOTES, 'UTF-8') ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <option value="">No colleges available</option>
                            <?php endif; ?>
                        </select>
                    </div>
                </div>
            </div>

            <div class="flex justify-end space-x-2 mt-4">
                <button type="button" id="cancel-course-modal-btn" 
                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition">
                    Cancel
                </button>
                <button type="submit" 
                        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                    Save Course
                </button>
            </div>
        </form>
    </div>
</div>

<div id="custom-message-container" class="fixed top-5 right-5 z-50 w-80"></div>
<script src="pages/courseModalFinal.js"></script>