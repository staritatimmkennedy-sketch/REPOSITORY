document.addEventListener("DOMContentLoaded", () => {
    console.log("users.js fully loaded");

    // Check if the global toggleModal and showToast functions exist
    if (typeof toggleModal !== 'function' || typeof showToast !== 'function') {
        console.error("Dependency Error: toggleModal or showToast not found. Ensure app.js is loaded first.");
    }

    // -----------------------------
    // FILTERING
    // -----------------------------
    const searchUser = document.getElementById("searchUser");
    const courseFilter = document.getElementById("courseFilter");
    const roleFilter = document.getElementById("roleFilter");
    const yearFilter = document.getElementById("yearFilter");

    function filterUsers() {
        const search = searchUser?.value.trim() || '';
        const course = courseFilter?.value || '';
        const role = roleFilter?.value || '';
        const year = yearFilter?.value || '';

        const params = new URLSearchParams({ search, course, role, year });

        fetch(`pages/filter_users.php?${params.toString()}`)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(html => {
                const tbody = document.querySelector("#usersTable tbody");
                if (tbody) tbody.innerHTML = html;
            })
            .catch(err => {
                console.error("Error fetching filtered users:", err);
                const tbody = document.querySelector("#usersTable tbody");
                if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-3 text-center text-red-500">Failed to load users.</td></tr>`;
                showToast("Failed to load user list.", "error");
            });
    }

    if (searchUser) searchUser.addEventListener("input", filterUsers);
    if (courseFilter) courseFilter.addEventListener("change", filterUsers);
    if (roleFilter) roleFilter.addEventListener("change", filterUsers);
    if (yearFilter) yearFilter.addEventListener("change", filterUsers);


    // ----------------------------
    // DROPDOWN TOGGLE HELPER
    // ----------------------------
    function closeDropdowns() {
        // Hides all open menus when clicking anywhere else
        document.querySelectorAll('#usersTable .z-10').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    // ----------------------------
    // ADD USER MODAL (Open only)
    // ----------------------------
    const addUserButton = document.getElementById("openAddUser") || document.getElementById("addUserButton");
    
    if (addUserButton) {
        addUserButton.addEventListener("click", () => {
            if (typeof toggleModal === 'function') {
                toggleModal("addUserModal", true);
            } else {
                document.getElementById("addUserModal")?.classList.remove("hidden");
            }
        });
    }

    // -----------------------------
    // MANAGE/DELETE MODAL ELEMENTS
    // -----------------------------
    const addUserForm = document.getElementById("addUserForm"); 
    const manageUserForm = document.getElementById("manageUserForm");
    const manageUserModalTitle = document.getElementById("manageUserModalTitle");
    const saveUserButton = document.getElementById("saveUserButton");
    const deleteUserForm = document.getElementById("deleteUserForm");
    const manageUserFormActions = manageUserForm?.querySelector('.form-actions');


    // -----------------------------
    // EVENT DELEGATION SETUP 
    // -----------------------------
    function setupEventDelegation() {
        const tableBody = document.querySelector("#usersTable tbody");
        if (!tableBody) return;

        // Attach ONE listener to the static table body to handle all clicks
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr[data-user-id]'); // Find the closest TR with an ID
            
            if (!row) return;

            const userId = row.getAttribute('data-user-id');
            const cells = row.querySelectorAll('td');
            const firstName = cells[0]?.textContent.trim();
            const lastName = cells[2]?.textContent.trim();

            // ------------------
            // DROPDOWN BUTTON CLICK HANDLER
            // ------------------
            const manageButton = target.closest('button');
            if (manageButton && manageButton.textContent.includes('Manage')) {
                e.stopPropagation();

                const menu = manageButton.closest('.relative')?.querySelector('.z-10');
                if (menu) {
                    // Close all other dropdowns
                    document.querySelectorAll('#usersTable .z-10').forEach(m => {
                        if (m !== menu) m.classList.add('hidden');
                    });
                    menu.classList.toggle('hidden');

                    // Smart positioning logic
                    if (!menu.classList.contains('hidden')) {
                        const rect = manageButton.getBoundingClientRect();
                        const menuHeight = menu.offsetHeight;
                        const spaceBelow = window.innerHeight - rect.bottom;

                        if (spaceBelow < menuHeight && rect.top > menuHeight) {
                            menu.style.top = 'auto';
                            menu.style.bottom = `${manageButton.offsetHeight + 4}px`;
                        } else {
                            menu.style.top = `${manageButton.offsetHeight + 4}px`;
                            menu.style.bottom = 'auto';
                        }
                    }
                }
                return;
            }

            // ------------------
            // DROPDOWN LINK CLICK HANDLER
            // ------------------
            const link = target.closest('a');
            if (link) {
                e.preventDefault();
                closeDropdowns(); // Close all on link click

                const action = link.getAttribute('href');
                
                if (!userId) {
                    console.error(`Error: User ID is missing for ${action} action on this row. Delegate failed.`);
                    if(typeof showToast === 'function') showToast(`Error: Cannot perform ${action}. User ID missing. Please refresh.`, "error");
                    return;
                }

                if (action === '#view') {
                    openManageUserModal(userId, 'view');
                } else if (action === '#edit') {
                    openManageUserModal(userId, 'edit');
                } else if (action === '#delete') {
                    openDeleteUserModal(userId, firstName, lastName);
                }
            }
        });
        
        // Ensure the body listener for closing all dropdowns is only attached once
        document.removeEventListener('click', closeDropdowns);
        document.addEventListener('click', closeDropdowns);
    }
    
    setupEventDelegation();


    // ----------------------------
    // SUBMIT ADD USER FORM
    // ----------------------------
    if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const formData = new FormData(addUserForm);
            
            const roleSelect = addUserForm.querySelector('select[name="role"]');
            const courseSelect = addUserForm.querySelector('select[name="course"]');
            const roleName = roleSelect?.options[roleSelect.selectedIndex]?.text || '—';
            const courseName = courseSelect?.options[courseSelect.selectedIndex]?.text || '—';

            fetch("pages/add_user.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                console.log('Add user response:', data); 
                
                if (data.success) {
                    if (data.user_id) {
                        const newRow = document.createElement("tr");
                        newRow.className = "border-b hover:bg-gray-50";
                        
                        // USE THE ACTUAL DATABASE USER ID
                        newRow.setAttribute('data-user-id', data.user_id);
                        
                        newRow.innerHTML = `
                            <td class="px-4 py-3 text-sm">${escapeHtml(formData.get('first_name'))}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(formData.get('middle_name') || '—')}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(formData.get('last_name'))}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(roleName)}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(courseName)}</td>
                            <td class="px-4 py-3 text-sm">${escapeHtml(formData.get('year_level') + (formData.get('year_level') === '1' ? 'st' : formData.get('year_level') === '2' ? 'nd' : formData.get('year_level') === '3' ? 'rd' : 'th') + ' Year')}</td>
                            <td class="px-4 py-3 text-center">
                                <div class="relative inline-block text-left">
                                    <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">Manage ▾</button>
                                    <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                                        <a href="#view" class="block px-4 py-2 text-sm hover:bg-gray-100">View User</a>
                                        <a href="#edit" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit User</a>
                                        <a href="#delete" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete User</a>
                                    </div>
                                </div>
                            </td>
                        `;
                        
                        const tbody = document.querySelector("#usersTable tbody");
                        if (tbody) {
                            // Remove "no users" message if it exists
                            const noDataRow = tbody.querySelector('tr td[colspan]');
                            if (noDataRow) noDataRow.closest('tr').remove();
                            
                            tbody.prepend(newRow);
                        }
                        
                        if (typeof toggleModal === 'function') toggleModal("addUserModal", false);
                        addUserForm.reset();
                        if (typeof showToast === 'function') showToast("User added successfully!", "success");
                        
                    } else {
                        // No user_id returned - refresh to get proper data
                        if (typeof toggleModal === 'function') toggleModal("addUserModal", false);
                        addUserForm.reset();
                        if (typeof showToast === 'function') showToast(data.message || "User added successfully! Refreshing...", "success");
                        filterUsers(); // Refresh to get the actual data
                    }
                } else {
                    if (typeof showToast === 'function') showToast("Error: " + (data.message || "Unknown error"), "error");
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                if (typeof showToast === 'function') showToast("Failed to add user. Check console for details.", "error");
            });
        });
    }

    // -----------------------------
    // OPEN MANAGE USER MODAL FUNCTION (FIXED SELECTION LOGIC)
    // -----------------------------
    function openManageUserModal(userId, mode) {
    if (manageUserForm) manageUserForm.reset();
    
    const inputsToControl = manageUserForm ? manageUserForm.querySelectorAll('input:not([type="hidden"]):not([id="manageUser_idDisplay"]), select') : [];
    
    inputsToControl.forEach(el => el.disabled = true);
    
    if (manageUserModalTitle) manageUserModalTitle.textContent = mode === 'view' ? "View User Record" : "Edit User Record";
    if (manageUserFormActions) manageUserFormActions.classList.toggle('hidden', mode === 'view');
    
    saveUserButton.disabled = true;

    fetch(`pages/get_user.php?user_id=${userId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            if (data.success && data.user) {
                const user = data.user;
                
                // 1. Populate Hidden User ID
                document.getElementById("manageUserId").value = userId;

                // 2. Populate standard Form Fields
                document.getElementById("manageUserUsername").value = user.username || '';
                document.getElementById("manageUser_idDisplay").value = user.user_id || '';
                document.getElementById("manageUserFirstName").value = user.firstName || '';
                document.getElementById("manageUserMiddleName").value = user.middleName || '';
                document.getElementById("manageUserLastName").value = user.lastName || '';
                
                // 3. Populate Selects (Robust assignment for all dropdowns)
                const roleSelect = document.getElementById("manageUserRole");
                const courseSelect = document.getElementById("manageUserCourse");
                const yearSelect = document.getElementById("manageUserYearLevel");

                // CRITICAL FIX: Ensure value is cast to a string and handle potential null/empty values
                const roleValue = String(user.role_id ?? '');
                // FIX APPLIED HERE: Now correctly using 'course_id' returned from the server
                const courseValue = String(user.course_id ?? ''); 
                const yearValue = String(user.yearLevel ?? '');
                
                if (roleSelect) roleSelect.value = roleValue;
                if (courseSelect) courseSelect.value = courseValue;
                if (yearSelect) yearSelect.value = yearValue;

                if (mode === 'edit') {
                    inputsToControl.forEach(el => el.disabled = false);
                    document.getElementById("manageUserUsername").disabled = true; 
                    document.getElementById("manageUser_idDisplay").disabled = true;
                    saveUserButton.disabled = false;
                } else {
                    saveUserButton.disabled = true;
                }
                
                if (typeof toggleModal === 'function') toggleModal("manageUserModal", true);

            } else {
                if (typeof showToast === 'function') showToast("Error fetching user data: " + (data.message || "User not found or data is invalid."), "error");
                if (typeof toggleModal === 'function') toggleModal("manageUserModal", false);
            }
        })
        .catch(err => {
            saveUserButton.disabled = false;
            console.error("Fetch user data error:", err);
            if (typeof showToast === 'function') showToast("Failed to load user data. Check console/network tab.", "error");
            if (typeof toggleModal === 'function') toggleModal("manageUserModal", false);
        });
}

    // -----------------------------
    // OPEN DELETE USER MODAL FUNCTION
    // -----------------------------
    function openDeleteUserModal(userId, firstName, lastName) {
        document.getElementById("deleteUserId").value = userId;
        document.getElementById("deleteUserIdDisplay").textContent = userId;
        document.getElementById("deleteUserName").textContent = `${firstName} ${lastName}`;
        if (typeof toggleModal === 'function') toggleModal("deleteUserModal", true);
    }

    // -----------------------------
    // SUBMIT EDIT USER FORM
    // -----------------------------
    if (manageUserForm) {
        manageUserForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(manageUserForm);
            saveUserButton.disabled = true;

            fetch("pages/edit_user.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                saveUserButton.disabled = false;
                if (data.success) {
                    if (typeof showToast === 'function') showToast(data.message, "success");
                    
                    if (typeof toggleModal === 'function') toggleModal("manageUserModal", false);
                    
                    // --- LOCAL UPDATE LOGIC ---
                    const userId = formData.get('user_id');
                    const row = document.querySelector(`#usersTable tbody tr[data-user-id="${userId}"]`);
                    
                    if (row) {
                        // Get the currently selected TEXT from the dropdowns in the modal
                        const roleSelect = manageUserForm.querySelector('select[name="role"]');
                        const courseSelect = manageUserForm.querySelector('select[name="course"]');
                        
                        const roleName = roleSelect?.options[roleSelect.selectedIndex]?.text || '—';
                        const courseName = courseSelect?.options[courseSelect.selectedIndex]?.text || '—';
                        const yearLevel = formData.get('year_level');
                        
                        // Update the table cells
                        const cells = row.querySelectorAll('td');
                        if (cells.length >= 6) {
                            cells[0].textContent = escapeHtml(formData.get('first_name')); // First Name
                            cells[1].textContent = escapeHtml(formData.get('middle_name') || '—'); // Middle Name
                            cells[2].textContent = escapeHtml(formData.get('last_name')); // Last Name
                            cells[3].textContent = escapeHtml(roleName); // Role
                            cells[4].textContent = escapeHtml(courseName); // Course
                            
                            // Year Level formatting
                            const yearSuffix = yearLevel === '1' ? 'st' : yearLevel === '2' ? 'nd' : yearLevel === '3' ? 'rd' : 'th';
                            cells[5].textContent = escapeHtml(yearLevel + yearSuffix + ' Year'); // Year Level
                        }
                    }
                    // --- END LOCAL UPDATE LOGIC ---

                } else {
                    if (typeof showToast === 'function') showToast("Error updating user: " + (data.message || "Unknown error"), "error");
                }
            })
            .catch(err => {
                saveUserButton.disabled = false;
                console.error("Fetch edit error:", err);
                if (typeof showToast === 'function') showToast("Failed to update user. Check console for details.", "error");
            });
        });
    }

    // -----------------------------
    // SUBMIT DELETE USER FORM
    // -----------------------------
    if (deleteUserForm) {
        deleteUserForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(deleteUserForm);
            const userId = formData.get("user_id");

            if (!userId) {
                console.error("Error Deleting User: User ID is missing in form data.");
                if (typeof showToast === 'function') showToast("Error deleting user: User ID is missing.", "error");
                if (typeof toggleModal === 'function') toggleModal("deleteUserModal", false);
                return; 
            }

            fetch("pages/delete_user.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (typeof showToast === 'function') showToast("User deleted successfully!", "success");
                    
                    if (typeof toggleModal === 'function') toggleModal("deleteUserModal", false);

                    // Remove the row locally if it exists
                    const rowToRemove = document.querySelector(`#usersTable tbody tr[data-user-id="${userId}"]`);
                    if (rowToRemove) {
                        rowToRemove.remove();
                    }
                    
                } else {
                    if (typeof showToast === 'function') showToast("Error deleting user: " + (data.message || "Unknown error"), "error");
                }
            })
            .catch(err => {
                console.error("Fetch delete error:", err);
                if (typeof showToast === 'function') showToast("Failed to delete user. Check console for details.", "error");
            });
        });
    }
    
    // ----------------------------
    // Helper: Escape HTML 
    // ----------------------------
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;") 
            .replace(/>/g, "&gt;") 
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});