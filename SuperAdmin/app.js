// ===== app.js (fixed) =====

// --- CORE UTILITIES ---
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
  
    const isHidden = modal.classList.contains('hidden');
    const wantShow = show === undefined ? isHidden : !!show;
  
    // Ensure transition classes exist on the modal
    modal.classList.add('transition-opacity', 'duration-300');
  
    if (wantShow) {
      // Show: unhide, switch to full opacity, lock scroll
      modal.classList.remove('hidden', 'opacity-0');
      // Force reflow so opacity transition runs
      void modal.offsetWidth;
      modal.classList.add('opacity-100');
      document.body.classList.add('overflow-hidden');
  
      // Close when clicking backdrop only
      const onBackdropClick = (e) => {
        if (e.target === modal) toggleModal(modalId, false);
      };
      modal.__backdropHandler = onBackdropClick;
      modal.addEventListener('click', onBackdropClick);
    } else {
      // Hide: fade out, then set hidden, unlock scroll
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
  
      // Fallback in case transitionend doesn't fire
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
  
  /** Toggles the sidebar dropdown state by IDs (safe if elements don't exist). */
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
  
  /** Attach Manage ▾ dropdown behavior (table action menus). */
  function attachManageDropdownListeners() {
    // Toggle on button click
    document.querySelectorAll('.manage-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.querySelector('.manage-dropdown');
        if (!dropdown) return;
  
        const willOpen = dropdown.classList.contains('hidden');
  
        // Close all
        document.querySelectorAll('.manage-dropdown').forEach((dd) => dd.classList.add('hidden'));
  
        // Open this one (positioning is handled by Tailwind classes in markup)
        if (willOpen) dropdown.classList.remove('hidden');
      });
    });
  
    // Click outside closes all
    document.addEventListener('click', () => {
      document.querySelectorAll('.manage-dropdown').forEach((dd) => dd.classList.add('hidden'));
    });
  }
  
  // --- PAGE NAVIGATION (optional, safe if elements don't exist) ---
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
    // Sidebar dropdowns (safe guards inside)
    toggleDropdown('users-toggle', 'users-dropdown', 'users-arrow');
    toggleDropdown('materials-toggle', 'materials-dropdown', 'materials-arrow');
    toggleDropdown('academics-toggle', 'academics-dropdown', 'academics-arrow');
    toggleDropdown('system-toggle', 'system-dropdown', 'system-arrow');
  
    // Table action menus
    attachManageDropdownListeners();
  
    // Ensure "Users" dropdown starts closed
    const usersDropdown = document.getElementById('users-dropdown');
    const usersArrow = document.querySelector('.users-arrow');
    if (usersDropdown) usersDropdown.classList.add('hidden');
    if (usersArrow) usersArrow.classList.remove('rotate-180');
  
    // Page nav links (optional)
    const usersLink = document.getElementById('usersLink');
    const rolesLink = document.getElementById('rolesLink');
    if (usersLink) {
      usersLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('users', e.currentTarget);
      });
    }
    if (rolesLink) {
      rolesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('roles', e.currentTarget);
      });
    }
  
    // -------- MODALS (robust open/close) --------
  
    // Add User modal
    const addUserModal = document.getElementById('addUserModal');
    const openAddUser =
      document.getElementById('openAddUser') ||
      Array.from(document.querySelectorAll('button')).find((b) => /add user/i.test(b.textContent));
    const cancelAddUser = document.getElementById('cancelAddUser');
    const addUserForm = document.getElementById('addUserForm');
  
    if (addUserModal) {
      if (openAddUser) openAddUser.addEventListener('click', () => toggleModal('addUserModal', true));
      if (cancelAddUser) cancelAddUser.addEventListener('click', () => toggleModal('addUserModal', false));
      if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
          e.preventDefault(); // frontend-only; no backend
          toggleModal('addUserModal', false);
        });
      }
    }
  
    // Add Role modal
    const addRoleModal = document.getElementById('addRoleModal');
    const openAddRole =
      document.getElementById('openAddRole') ||
      Array.from(document.querySelectorAll('button')).find((b) => /add role/i.test(b.textContent));
    const cancelAddRole = document.getElementById('cancelAddRole');
    const addRoleForm = document.getElementById('addRoleForm');
  
    if (addRoleModal) {
      if (openAddRole) openAddRole.addEventListener('click', () => toggleModal('addRoleModal', true));
      if (cancelAddRole) cancelAddRole.addEventListener('click', () => toggleModal('addRoleModal', false));
      if (addRoleForm) {
        addRoleForm.addEventListener('submit', (e) => {
          e.preventDefault(); // frontend-only; no backend
          toggleModal('addRoleModal', false);
        });
      }
    }
  
    // Close any open modal on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (addUserModal && !addUserModal.classList.contains('hidden')) toggleModal('addUserModal', false);
      if (addRoleModal && !addRoleModal.classList.contains('hidden')) toggleModal('addRoleModal', false);
    });
  });
      // Add Material modal
      const addMaterialModal = document.getElementById('addMaterialModal');
      const openAddMaterial = document.getElementById('openAddMaterial');
      const closeAddMaterial = document.getElementById('closeAddMaterial');
      const addMaterialForm = document.getElementById('addMaterialForm');
  
      if (addMaterialModal) {
        if (openAddMaterial) openAddMaterial.addEventListener('click', () => toggleModal('addMaterialModal', true));
        if (closeAddMaterial) closeAddMaterial.addEventListener('click', () => toggleModal('addMaterialModal', false));
        if (addMaterialForm) {
          addMaterialForm.addEventListener('submit', (e) => {
            e.preventDefault(); // frontend-only
            toggleModal('addMaterialModal', false);
          });
        }
      }
  
      // Add Material Type modal
      const addMaterialTypeModal = document.getElementById('addMaterialTypeModal');
      const openAddMaterialType = document.getElementById('openAddMaterialType');
      const closeAddMaterialType = document.getElementById('closeAddMaterialType');
      const addMaterialTypeForm = document.getElementById('addMaterialTypeForm');
  
      if (addMaterialTypeModal) {
        if (openAddMaterialType) openAddMaterialType.addEventListener('click', () => toggleModal('addMaterialTypeModal', true));
        if (closeAddMaterialType) closeAddMaterialType.addEventListener('click', () => toggleModal('addMaterialTypeModal', false));
        if (addMaterialTypeForm) {
          addMaterialTypeForm.addEventListener('submit', (e) => {
            e.preventDefault(); // frontend-only
            toggleModal('addMaterialTypeModal', false);
          });
        }
      }
  
      // Extend ESC close handler:
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (addUserModal && !addUserModal.classList.contains('hidden')) toggleModal('addUserModal', false);
        if (addRoleModal && !addRoleModal.classList.contains('hidden')) toggleModal('addRoleModal', false);
        if (addMaterialModal && !addMaterialModal.classList.contains('hidden')) toggleModal('addMaterialModal', false);
        if (addMaterialTypeModal && !addMaterialTypeModal.classList.contains('hidden')) toggleModal('addMaterialTypeModal', false);
      });
  