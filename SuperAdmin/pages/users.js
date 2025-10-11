document.addEventListener("DOMContentLoaded", () => {
    console.log("users.js fully loaded");

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
                // Re-initialize dropdowns after content update
                initializeDropdowns();
            })
            .catch(err => {
                console.error("Error fetching filtered users:", err);
                const tbody = document.querySelector("#usersTable tbody");
                if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-3 text-center text-red-500">Failed to load users.</td></tr>`;
            });
    }

    // Attach event listeners only if elements exist
    if (searchUser) searchUser.addEventListener("input", filterUsers);
    if (courseFilter) courseFilter.addEventListener("change", filterUsers);
    if (roleFilter) roleFilter.addEventListener("change", filterUsers);
    if (yearFilter) yearFilter.addEventListener("change", filterUsers);

    // -----------------------------
    // DROPDOWN TOGGLE
    // -----------------------------
    function initializeDropdowns() {
        document.querySelectorAll("#usersTable .relative button").forEach(button => {
            const handleClick = (e) => {
                e.stopPropagation();
                const menu = button.closest('.relative')?.querySelector('.z-10');
                if (menu) {
                    // Close all other menus
                    document.querySelectorAll('.z-10').forEach(m => {
                        if (m !== menu) m.classList.add('hidden');
                    });
                    menu.classList.toggle('hidden');
                }
            };

            // Remove existing listeners to avoid duplicates
            button.removeEventListener('click', handleClick);
            button.addEventListener('click', handleClick);
        });

        // Close all dropdowns when clicking outside
        document.removeEventListener('click', closeDropdowns);
        document.addEventListener('click', closeDropdowns);
    }

    function closeDropdowns() {
        document.querySelectorAll('.z-10').forEach(menu => {
            menu.classList.add('hidden');
        });
    }

    // Initialize dropdowns on page load
    initializeDropdowns();

    // -----------------------------
    // ADD USER MODAL
    // -----------------------------
    const addUserModal = document.getElementById("addUserModal");
    const openAddUser = document.getElementById("openAddUser");
    const cancelAddUser = document.getElementById("cancelAddUser");
    const addUserForm = document.getElementById("addUserForm");

    if (openAddUser && addUserModal) {
        openAddUser.addEventListener("click", () => {
            addUserModal.classList.remove("hidden");
        });
    }

    if (cancelAddUser && addUserModal) {
        cancelAddUser.addEventListener("click", () => {
            addUserModal.classList.add("hidden");
        });
    }

    // -----------------------------
    // SUBMIT ADD USER FORM
    // -----------------------------
    if (addUserForm) {
        addUserForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("Add User form submitted");

            const formData = new FormData(addUserForm);

            // Get human-readable role and course names for UI
            const roleSelect = addUserForm.querySelector('select[name="role"]');
            const courseSelect = addUserForm.querySelector('select[name="course"]');
            const roleName = roleSelect?.options[roleSelect.selectedIndex]?.text || '—';
            const courseName = courseSelect?.options[courseSelect.selectedIndex]?.text || '—';

            fetch("pages/add_user.php", {
                method: "POST",
                body: formData
            })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(text => {
                console.log("Raw response:", text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch (err) {
                    console.error("Parse error:", err, text);
                    alert("Server error: Invalid response. Check console.");
                    return;
                }

                if (data.success) {
                    // Create new row with proper data
                    const newRow = document.createElement("tr");
                    newRow.className = "border-b hover:bg-gray-50";
                    newRow.innerHTML = `
                        <td class="px-4 py-3 text-sm">${escapeHtml(formData.get("first_name") || '')}</td>
                        <td class="px-4 py-3 text-sm">${escapeHtml(formData.get("middle_name") || '')}</td>
                        <td class="px-4 py-3 text-sm">${escapeHtml(formData.get("last_name") || '')}</td>
                        <td class="px-4 py-3 text-sm">${escapeHtml(roleName)}</td>
                        <td class="px-4 py-3 text-sm">${escapeHtml(courseName)}</td>
                        <td class="px-4 py-3 text-sm">${escapeHtml(formData.get("year_level") || '')}</td>
                        <td class="px-4 py-3 text-center">
                            <div class="relative inline-block text-left">
                                <button class="w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap">
                                    Manage ▾
                                </button>
                                <div class="hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10">
                                    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Update Account</a>
                                    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Username</a>
                                    <a href="#" class="block px-4 py-2 text-sm hover:bg-gray-100">Edit Password</a>
                                    <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove Account</a>
                                </div>
                            </div>
                        </td>
                    `;
                    const tbody = document.querySelector("#usersTable tbody");
                    if (tbody) tbody.prepend(newRow); // Add to top

                    // Re-initialize dropdowns for the new row
                    initializeDropdowns();

                    // Reset and close
                    addUserForm.reset();
                    addUserModal.classList.add("hidden");

                    alert("User added successfully!");
                } else {
                    alert("Error: " + (data.message || "Unknown error"));
                }
            })
            .catch(err => {
                console.error("Fetch error:", err);
                alert("Failed to add user. Check console for details.");
            });
        });
    }

    // Helper: Escape HTML to prevent XSS
    function escapeHtml(text) {
        if (typeof text !== 'string') return '';
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});