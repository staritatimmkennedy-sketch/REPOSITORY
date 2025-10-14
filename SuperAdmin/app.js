// ===== app.js (updated) =====

// --- CORE UTILITIES ---
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const isHidden = modal.classList.contains('hidden');
    const wantShow = show === undefined ? isHidden : !!show;

    modal.classList.add('transition-opacity', 'duration-300');

    if (wantShow) {
        modal.classList.remove('hidden', 'opacity-0');
        void modal.offsetWidth; // force reflow
        modal.classList.add('opacity-100');
        document.body.classList.add('overflow-hidden');

        const onBackdropClick = (e) => {
            if (e.target === modal) toggleModal(modalId, false);
        };
        modal.__backdropHandler = onBackdropClick;
        modal.addEventListener('click', onBackdropClick);
    } else {
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');

        const onEnd = (e) => {
            if (e.target !== modal || e.propertyName !== 'opacity') return;
            modal.classList.add('hidden');
            if (modal.__backdropHandler) {
                modal.removeEventListener('click', modal.__backdropHandler);
                delete modal.__backdropHandler;
            }
            // Only remove overflow-hidden if no other modals are open
            if (document.querySelectorAll('[id$="Modal"]:not(.hidden), [id^="modal-"]:not(.hidden)').length <= 1) {
                document.body.classList.remove('overflow-hidden');
            }
            modal.removeEventListener('transitionend', onEnd);
        };
        modal.addEventListener('transitionend', onEnd, { once: true });

        // Fallback timeout in case transitionend fails
        setTimeout(() => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        }, 350);
    }
}

/**
 * Shows a toast notification at the top of the screen.
 * @param {string} message - The message to display.
 * @param {'success'|'error'} type - The type of notification.
 */
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    // Base classes for the toast
    let baseClasses = 'px-4 py-3 rounded-md shadow-lg font-medium text-white transition-all duration-300 ease-in-out transform';
    let typeClasses = '';

    if (type === 'success') {
        typeClasses = 'bg-green-600 border border-green-700';
    } else if (type === 'error') {
        typeClasses = 'bg-red-600 border border-red-700';
    } else {
        typeClasses = 'bg-gray-700 border border-gray-800'; // Default neutral
    }

    const toast = document.createElement('div');
    toast.className = baseClasses + ' ' + typeClasses + ' translate-y-[-150%] opacity-0';
    toast.textContent = message;

    // Add to container
    toastContainer.appendChild(toast);

    // 1. Show: animate it in
    setTimeout(() => {
        toast.classList.remove('translate-y-[-150%]', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    }, 50);

    // 2. Hide: animate it out after 4 seconds
    const hideTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-150%]', 'opacity-0');

        // 3. Remove from DOM after transition
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);

    // Allow clicking to dismiss
    toast.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-[-150%]', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    });
}

// --- SIDEBAR DROPDOWNS ---
function toggleDropdown(toggleId, dropdownId, arrowClass) {
    const toggle = document.getElementById(toggleId);
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = document.getElementById(dropdownId);
        const arrow = document.querySelector(`.${arrowClass}`);
        if (dropdown) dropdown.classList.toggle('hidden');
        if (arrow && dropdown) {
            arrow.classList.toggle('rotate-180', !dropdown.classList.contains('hidden'));
        }
    });
}

// --- MANAGE DROPDOWN FOR TABLE ACTIONS ---
function attachManageDropdownListeners() {
    document.querySelectorAll('.manage-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.closest('.relative')?.querySelector('.manage-dropdown');
            if (!dropdown) return;

            const willOpen = dropdown.classList.contains('hidden');
            document.querySelectorAll('.manage-dropdown').forEach((dd) => dd.classList.add('hidden'));

            if (willOpen) dropdown.classList.remove('hidden');
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.manage-dropdown').forEach((dd) => dd.classList.add('hidden'));
    });
}

// --- PAGE NAVIGATION (optional) ---
const pages = {
    users: { element: 'usersContent', title: 'Users Records' },
    roles: { element: 'rolesContent', title: 'Roles Records' },
};

function showPage(pageKey, clickedLink) {
    Object.values(pages).forEach((page) => {
        const el = document.getElementById(page.element);
        if (el) el.classList.add('hidden');
    });

    const target = document.getElementById(pages[pageKey]?.element);
    if (target) target.classList.remove('hidden');

    const titleEl = document.getElementById('pageTitle');
    if (titleEl && pages[pageKey]) titleEl.textContent = pages[pageKey].title;

    document.querySelectorAll('.cf-nav-item').forEach((item) => item.classList.remove('active'));
    if (clickedLink) clickedLink.classList.add('active');
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Inject the toast container into the body
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-0 inset-x-0 p-4 flex flex-col items-center space-y-2 z-[1000] pointer-events-none';
    document.body.appendChild(toastContainer);

    // Sidebar dropdowns
    toggleDropdown('users-toggle', 'users-dropdown', 'users-arrow');
    toggleDropdown('materials-toggle', 'materials-dropdown', 'materials-arrow');
    toggleDropdown('academics-toggle', 'academics-dropdown', 'academics-arrow');
    toggleDropdown('system-toggle', 'system-dropdown', 'system-arrow');

    // Table action menus
    attachManageDropdownListeners();

    // Page nav links
    const usersLink = document.getElementById('usersLink');
    const rolesLink = document.getElementById('rolesLink');
    if (usersLink) usersLink.addEventListener('click', (e) => { e.preventDefault(); showPage('users', e.currentTarget); });
    if (rolesLink) rolesLink.addEventListener('click', (e) => { e.preventDefault(); showPage('roles', e.currentTarget); });

    // ---------- MODALS ----------

    // In your app.js, update the modalConfigs array:
    const modalConfigs = [
        { open: 'openAddUser', modal: 'addUserModal', cancel: 'cancelAddUser', form: 'addUserForm' },
        { open: 'openAddRole', modal: 'addRoleModal', cancel: 'cancelAddRole', form: 'addRoleForm' },
        { open: 'openAddMaterial', modal: 'addMaterialModal', cancel: 'closeAddMaterial', form: 'addMaterialForm' },
        { open: 'openAddMaterialType', modal: 'addMaterialTypeModal', cancel: 'closeAddMaterialType', form: 'addMaterialTypeForm' },
        { open: 'openAddCollege', modal: 'modal-college', cancel: 'cancel-college-modal-btn', closeBtn: 'close-college-modal-btn', form: 'college-form' },

        // Add the role modals here
        { modal: 'updateRoleModal', cancel: 'cancelUpdateRole', closeBtn: 'closeUpdateRoleModal', form: 'updateRoleForm', customHandler: true },
        { modal: 'deleteRoleModal', cancel: 'cancelDeleteRole', closeBtn: 'closeDeleteRoleModal', form: 'deleteRoleForm', customHandler: true },

        // Other existing modals...
        { modal: 'manageUserModal', cancel: 'cancelManageUser', form: 'manageUserForm', customHandler: true },
        { modal: 'deleteUserModal', cancel: 'cancelDeleteUser', form: 'deleteUserForm', customHandler: true },

        { modal: 'updateMaterialTypeModal', cancel: 'cancelUpdateMaterialType', form: 'updateMaterialTypeForm', customHandler: true},
        { modal: 'deleteMaterialTypeModal', cancel: 'cancelDeleteMaterialType', form: 'deleteMaterialTypeForm', customHandler: true},

        { modal: 'editCollegeModal', cancel: 'cancel-edit-college-modal-btn', form: 'edit-college-form', customHandler: true},
        { modal: 'deleteCollegeModal', cancel: 'cancelDeleteCollege', form: 'deleteCollegeForm', customHandler: true},

        { modal: 'editCourseModal', cancel: 'cancel-edit-course-modal-btn', form: 'edit-course-form', customHandler: true},
        { modal: 'deleteCourseModal', cancel: 'cancelDeleteCourse', form: 'deleteCourseForm', customHandler: true},
    ];

    modalConfigs.forEach((cfg) => {
        const modalEl = document.getElementById(cfg.modal);
        const openBtn = document.getElementById(cfg.open);
        const cancelBtn = document.getElementById(cfg.cancel);
        const closeBtn = cfg.closeBtn ? document.getElementById(cfg.closeBtn) : null;
        const formEl = document.getElementById(cfg.form);

        if (!modalEl) return;

        // Attach OPEN button handler (only for modals with an explicit open button)
        if (openBtn) openBtn.addEventListener('click', () => {
            toggleModal(cfg.modal, true);
            formEl?.reset();
        });

        // Attach CANCEL/CLOSE button handlers
        if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(cfg.modal, false));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(cfg.modal, false));

        // Only add generic form handler for forms without custom handlers
        if (formEl && !cfg.customHandler && !formEl.hasAttribute('data-custom-handler')) {
            formEl.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log(`${cfg.modal} submitted`);
                toggleModal(cfg.modal, false);
                formEl.reset();
            });
        }
    });

    // Course modal - only handle open/close, NOT form submission
    const openCourseBtn = document.getElementById('openAddCourse');
    if (openCourseBtn) {
        openCourseBtn.addEventListener('click', () => {
            toggleModal('modal-course', true);
        });
    }

    // Close all modals on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        const allModals = document.querySelectorAll('[id$="Modal"]:not(.hidden), [id^="modal-"]:not(.hidden)');
        
        // Find the topmost modal to close (last one opened)
        const topmostModal = Array.from(allModals).pop();
        
        if (topmostModal) {
            toggleModal(topmostModal.id, false);
        }
    });
});