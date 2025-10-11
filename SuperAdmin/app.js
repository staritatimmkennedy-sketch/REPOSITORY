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
            modal.removeEventListener('transitionend', onEnd);
        };
        modal.addEventListener('transitionend', onEnd, { once: true });

        setTimeout(() => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                if (modal.__backdropHandler) {
                    modal.removeEventListener('click', modal.__backdropHandler);
                    delete modal.__backdropHandler;
                }
            }
        }, 350);

        document.body.classList.remove('overflow-hidden');
    }
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
            const dropdown = btn.querySelector('.manage-dropdown');
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

    const modalConfigs = [
        { open: 'openAddUser', modal: 'addUserModal', cancel: 'cancelAddUser', form: 'addUserForm' },
        { open: 'openAddRole', modal: 'addRoleModal', cancel: 'cancelAddRole', form: 'addRoleForm' },
        { open: 'openAddMaterial', modal: 'addMaterialModal', cancel: 'closeAddMaterial', form: 'addMaterialForm' },
        { open: 'openAddMaterialType', modal: 'addMaterialTypeModal', cancel: 'closeAddMaterialType', form: 'addMaterialTypeForm' },
        { open: 'openAddCollege', modal: 'modal-college', cancel: 'cancel-college-modal-btn', closeBtn: 'close-college-modal-btn', form: 'college-form' },
    ];

    modalConfigs.forEach((cfg) => {
        const modalEl = document.getElementById(cfg.modal);
        const openBtn = document.getElementById(cfg.open);
        const cancelBtn = document.getElementById(cfg.cancel);
        const closeBtn = cfg.closeBtn ? document.getElementById(cfg.closeBtn) : null;
        const formEl = document.getElementById(cfg.form);

        if (!modalEl) return;

        if (openBtn) openBtn.addEventListener('click', () => {
            toggleModal(cfg.modal, true);
            formEl?.reset();
        });

        if (cancelBtn) cancelBtn.addEventListener('click', () => toggleModal(cfg.modal, false));
        if (closeBtn) closeBtn.addEventListener('click', () => toggleModal(cfg.modal, false));

        // Only add generic form handler for forms without custom handlers
        if (formEl && !formEl.hasAttribute('data-custom-handler')) {
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
        const allModals = document.querySelectorAll('[id$="Modal"], [id^="modal-"]');
        allModals.forEach((modal) => {
            if (!modal.classList.contains('hidden')) {
                const modalId = modal.id;
                toggleModal(modalId, false);
            }
        });
    });
});