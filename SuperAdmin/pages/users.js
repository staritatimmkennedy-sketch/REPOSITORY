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
                // CRITICAL: Re-initialize dropdowns after content update
                initializeDropdowns();
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
    // Note: The HTML has id="openAddUser", but we assume the modal trigger is id="addUserButton"
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
    const manageUserForm = document.getElementById("manageUserForm");
    const manageUserModalTitle = document.getElementById("manageUserModalTitle");
    const saveUserButton = document.getElementById("saveUserButton");
    const deleteUserForm = document.getElementById("deleteUserForm");
    const manageUserFormActions = manageUserForm?.querySelector('.form-actions');


    // -----------------------------
    // DROPDOWN TOGGLE & HANDLERS (FIXED)
    // -----------------------------
    function initializeDropdowns() {        
        // 1. Attach click handler to all "Manage" buttons
        document.querySelectorAll("#usersTable .relative button").forEach(button => {
            
            // FIX: Use cloning to remove any stale event listeners before attaching a new one
            const newButton = button.cloneNode(true);
            button.replaceWith(newButton);
            
            const handleClick = (e) => {
                e.stopPropagation();
                
                // Find the dropdown menu associated with this button
                const menu = newButton.closest('.relative')?.querySelector('.z-10');
                
                if (menu) {
                    // Hide all other open dropdowns first
                    document.querySelectorAll('#usersTable .z-10').forEach(m => {
                        if (m !== menu) m.classList.add('hidden');
                    });
                    
                    // Toggle the current menu's visibility
                    menu.classList.toggle('hidden'); 

                    // Get the necessary user data from the row
                    const row = newButton.closest('tr');
                    const userId = row.getAttribute('data-user-id');
                    const cells = row.querySelectorAll('td');
                    // Index 0: First Name, Index 2: Last Name based on your HTML structure
                    const firstName = cells[0]?.textContent.trim(); 
                    const lastName = cells[2]?.textContent.trim(); 

                    // 2. Attach action handlers (View/Edit/Delete)
                    const viewLink = menu.querySelector('a[href="#view"]');
                    const editLink = menu.querySelector('a[href="#edit"]');
                    const deleteLink = menu.querySelector('a[href="#delete"]');

                    // Helper to safely replace and re-attach listeners for menu links
                    const attachLinkHandler = (link, handler) => {
                        if (link) {
                            const newLink = link.cloneNode(true);
                            // Set the href attribute to prevent default navigation
                            newLink.setAttribute('href', '#'); 
                            link.replaceWith(newLink);
                            newLink.addEventListener('click', handler);
                        }
                    };

                    attachLinkHandler(viewLink, (e) => {
                        e.preventDefault();
                        closeDropdowns();
                        openManageUserModal(userId, 'view');
                    });

                    attachLinkHandler(editLink, (e) => {
                        e.preventDefault();
                        closeDropdowns();
                        openManageUserModal(userId, 'edit');
                    });

                    attachLinkHandler(deleteLink, (e) => {
                        e.preventDefault();
                        closeDropdowns();
                        openDeleteUserModal(userId, firstName, lastName);
                    });
                }
            };

            // Attach the new handler to the new button
            newButton.addEventListener('click', handleClick);
        });

        // Ensure the body listener for closing all dropdowns is only attached once
        document.removeEventListener('click', closeDropdowns);
        document.addEventListener('click', closeDropdowns);
    }
    
    initializeDropdowns();

    // ----------------------------
    // SUBMIT ADD USER FORM
    // ----------------------------
    const addUserForm = document.getElementById("addUserForm");
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
                if (data.success) {
                    // Manual Injection Logic (Preserved)
                    const newRow = document.createElement("tr");
                    newRow.className = "border-b hover:bg-gray-50";
                    const tempUserId = 'new_user_temp_' + Date.now();
                    
                    newRow.setAttribute('data-user-id', tempUserId);
                    
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
                    if (tbody) tbody.prepend(newRow);

                    initializeDropdowns();

                    if (typeof toggleModal === 'function') toggleModal("addUserModal", false);
                    addUserForm.reset();

                    if (typeof showToast === 'function') showToast("User added successfully!", "success");
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
    // OPEN MANAGE USER MODAL FUNCTION (Fixed IDs)
    // -----------------------------
    function openManageUserModal(userId, mode) {
    // Reset form and disable inputs initially
    if (manageUserForm) manageUserForm.reset();
    
    // Target all non-hidden inputs/selects for control
    const inputsToControl = manageUserForm ? manageUserForm.querySelectorAll('input:not([type="hidden"]):not([id="manageUser_idDisplay"]), select') : [];
    
    // Disable everything while loading
    inputsToControl.forEach(el => el.disabled = true);
    
    // Update modal title and hide/show save button based on mode
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
                
                // 1. Populate Hidden User ID (FIXED: using = instead of ===)
                document.getElementById("manageUserId").value = userId;

                // 2. Populate Form Fields (Using your HTML IDs) (FIXED: using = instead of ===)
                document.getElementById("manageUserUsername").value = user.username || '';
                document.getElementById("manageUser_idDisplay").value = user.user_id || '';
                document.getElementById("manageUserFirstName").value = user.firstName || '';
                document.getElementById("manageUserMiddleName").value = user.middleName || '';
                document.getElementById("manageUserLastName").value = user.lastName || '';
                
                // Populate Selects (FIXED: using = instead of ===)
                document.getElementById("manageUserRole").value = user.role_id || '';
                document.getElementById("manageUserCourse").value = user.userCourse_id || '';
                document.getElementById("manageUserYearLevel").value = user.yearLevel || '';

                // 3. Enable fields for EDIT mode (FIXED: using = instead of ===)
                if (mode === 'edit') {
                    inputsToControl.forEach(el => el.disabled = false);
                    // Username and User ID Display remain disabled in edit mode
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
                    filterUsers(); 

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

            fetch("pages/delete_user.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (typeof showToast === 'function') showToast("User deleted successfully!", "success");
                    
                    if (typeof toggleModal === 'function') toggleModal("deleteUserModal", false);

                    const rowToRemove = document.querySelector(`#usersTable tbody tr[data-user-id="${userId}"]`);
                    if (rowToRemove) {
                        rowToRemove.remove();
                    } else {
                        filterUsers();
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