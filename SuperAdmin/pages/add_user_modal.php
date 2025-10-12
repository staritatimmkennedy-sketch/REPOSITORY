<!-- Add User Modal -->
<div id="addUserModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden">
  <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
    <h2 class="text-lg font-bold mb-4">Add New User</h2>

    <!-- Form submits to add_user.php -->
    <form id="addUserForm" method="POST" action="add_user.php">
      <div class="mb-3">
        <label>Username <span class="text-red-500">*</span></label>
        <input type="text" name="username" required class="w-full border rounded px-3 py-2" />
      </div>

      <div class="mb-3">
        <label>First Name <span class="text-red-500">*</span></label>
        <input type="text" name="first_name" required class="w-full border rounded px-3 py-2" />
      </div>

      <div class="mb-3">
        <label>Last Name <span class="text-red-500">*</span></label>
        <input type="text" name="last_name" required class="w-full border rounded px-3 py-2" />
      </div>

      <div class="mb-3">
        <label>Middle Name</label>
        <input type="text" name="middle_name" class="w-full border rounded px-3 py-2" />
      </div>

      <div class="mb-3">
        <label>Role <span class="text-red-500">*</span></label>
        <select name="role" required class="w-full border rounded px-3 py-2">
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="Faculty">Faculty</option>
          <option value="Student">Student</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Course <span class="text-red-500">*</span></label>
        <select name="course" required class="w-full border rounded px-3 py-2">
          <option value="">Select Course</option>
          <option value="BSIT">BSIT</option>
          <option value="BSCS">BSCS</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Department <span class="text-red-500">*</span></label>
        <select name="department" required class="w-full border rounded px-3 py-2">
          <option value="">Select Department</option>
          <option value="CEAT">CEAT</option>
          <option value="BC">BC</option>
        </select>
      </div>

      <div class="mb-3">
        <label>Year Level <span class="text-red-500">*</span></label>
        <select name="year_level" required class="w-full border rounded px-3 py-2">
          <option value="">Select Year Level</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      <div class="form-actions flex justify-end space-x-2">
        <button type="button" id="cancelAddUser" class="cf-button bg-gray-300 text-gray-700">Cancel</button>
        <button type="submit" class="cf-button bg-blue-600 text-white">Add User</button>
      </div>
    </form>
  </div>
</div>
