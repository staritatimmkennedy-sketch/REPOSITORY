<!-- Add Course Modal -->
<div id="modal-course" class="hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex justify-center items-center transition-opacity duration-300 opacity-0">
    <div class="cf-card w-full max-w-2xl mx-4" onclick="event.stopPropagation()">
        <div class="flex justify-between items-center border-b pb-4 mb-6">
            <h3 class="text-2xl font-semibold text-gray-800">Add New Course</h3>
            <button type="button" id="close-course-modal-btn" class="text-gray-400 hover:text-gray-600 transition duration-150">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <form id="course-form" novalidate>
            <div class="space-y-4">
                <!-- Course Name -->
                <div>
                    <label for="course_name" class="cf-label required">Course Name</label>
                    <input type="text" id="course_name" name="course_name" class="cf-input"
                           placeholder="e.g., Bachelor of Science in Information Technology" required>
                </div>

                <!-- College Selection -->
                <div class="border-t pt-4 mt-4">
                    <h4 class="text-lg font-medium text-gray-700 mb-3">College Information</h4>
                    <div>
                        <label for="college_id" class="cf-label required">College</label>
                        <select id="college_id" name="college_id" class="cf-input" required>
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

            <div class="flex justify-end space-x-3 pt-6 border-t mt-6">
                <button type="button" id="cancel-course-modal-btn" class="cf-btn-secondary">
                    Cancel
                </button>
                <button type="submit" class="cf-btn-primary flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Course
                </button>
            </div>
        </form>
    </div>
</div>

<div id="custom-message-container" class="fixed top-5 right-5 z-50 w-80"></div>
<script src="pages/courseModalFinal.js"></script>