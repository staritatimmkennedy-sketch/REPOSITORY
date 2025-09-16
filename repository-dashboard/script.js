
// Shared interactivity
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar submenu toggles
  document.querySelectorAll('[data-toggle="submenu"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if(target){
        target.classList.toggle('open');
        const chev = btn.querySelector('.chev');
        if(chev){ chev.style.transform = target.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)'; }
      }
    });
  });

  // Account dropdown
  const accountBtn = document.getElementById('accountBtn');
  const accountMenu = document.getElementById('accountMenu');
  if(accountBtn && accountMenu){
    accountBtn.addEventListener('click', () => {
      accountMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if(!accountBtn.contains(e.target) && !accountMenu.contains(e.target)){
        accountMenu.classList.remove('open');
      }
    });
  }

  // Notification dropdown
  const notifBtn = document.getElementById('notifBtn');
  const notifMenu = document.getElementById('notifMenu');
  if(notifBtn && notifMenu){
    notifBtn.addEventListener('click', () => {
      notifMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if(!notifBtn.contains(e.target) && !notifMenu.contains(e.target)){
        notifMenu.classList.remove('open');
      }
    });
  }

  // Active link highlight by current path
  const path = location.pathname.split('/').pop();
  const map = {
  'index.html': 'nav-overview',
  'users.html': 'nav-users',
  'materials.html': 'nav-materials',
  'submissions.html': 'nav-submissions',
  'requests.html': 'nav-requests',
  'masterdata.html': 'nav-masterdata' // Add this line
};
  const activeId = map[path] || 'nav-overview';
  const el = document.getElementById(activeId);
  if(el){ el.classList.add('active'); }
});











document.addEventListener("DOMContentLoaded", () => {
  function showSectionFromHash() {
    const hash = window.location.hash || "#research";
    document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
    const target = document.querySelector(hash);
    if (target) target.classList.add("active");
  }

  showSectionFromHash(); // on load
  window.addEventListener("hashchange", showSectionFromHash); // on click
});

function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// auto-detect hash from sidebar links
window.addEventListener('hashchange', () => {
  const id = location.hash.replace('#', '');
  if (id) showSection(id);
});

// load correct section on page refresh
window.addEventListener('DOMContentLoaded', () => {
  const id = location.hash.replace('#', '') || 'research';
  showSection(id);
});










document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabSections = document.querySelectorAll(".tab-section");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active from all buttons
      tabButtons.forEach(b => b.classList.remove("active"));
      // Hide all sections
      tabSections.forEach(sec => sec.classList.remove("active"));

      // Add active to clicked button
      btn.classList.add("active");
      // Show correct section
      const targetId = btn.getAttribute("data-tab");
      document.getElementById(targetId).classList.add("active");
    });
  });
});














// Show only Admin section when clicking admin button
document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("showAdminBtn"); // Button ID
  const allSections = document.querySelectorAll(".section"); // All sections
  const adminSection = document.getElementById("admin-section"); // Admin section ID

  if (adminBtn && adminSection) {
    adminBtn.addEventListener("click", () => {
      // Hide all sections
      allSections.forEach(sec => sec.classList.remove("is-active"));

      // Show admin only
      adminSection.classList.add("is-active");
    });
  }
});








// Shortcut buttons to show specific sections
document.addEventListener("DOMContentLoaded", () => {
  const shortcutButtons = document.querySelectorAll(".shortcut-btn"); // all shortcut buttons
  const sections = document.querySelectorAll(".section"); // all sections

  shortcutButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target"); // get section id from button

      // hide all sections
      sections.forEach(sec => sec.classList.remove("is-active"));

      // show the selected section
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.classList.add("is-active");
    });
  });
});







document.addEventListener("DOMContentLoaded", () => {
  // Find all search boxes in your forms
  const searchInputs = document.querySelectorAll('form.controls input[type="search"]');

  searchInputs.forEach(input => {
    input.addEventListener("input", () => {
      const searchValue = input.value.toLowerCase();
      const section = input.closest("section"); // current section
      const table = section.querySelector("table"); // find table in that section
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        // show row if it matches search, otherwise hide
        row.style.display = text.includes(searchValue) ? "" : "none";
      });

      // Optional: Show "No data found" if nothing matches
      const emptyMsg = section.querySelector("[data-empty]");
      if (emptyMsg) {
        const anyVisible = Array.from(rows).some(row => row.style.display !== "none");
        emptyMsg.hidden = anyVisible; // hide or show the "No admin users found" message
      }
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  // Handle both search & dropdown filters
  const filterForms = document.querySelectorAll("form.controls");

  filterForms.forEach(form => {
    const searchInput = form.querySelector('input[type="search"]');
    const dropdown = form.querySelector("select");
    const section = form.closest("section");
    const table = section.querySelector("table");
    const rows = table.querySelectorAll("tbody tr");
    const emptyMsg = section.querySelector("[data-empty]");

    // Function to filter rows
    function filterRows() {
      const searchValue = searchInput.value.toLowerCase();
      const dropdownValue = dropdown.value.toLowerCase();

      let visibleCount = 0;

      rows.forEach(row => {
        const rowText = row.innerText.toLowerCase();
        const dropdownCell = dropdownValue
          ? Array.from(row.querySelectorAll("td"))
              .some(td => td.innerText.toLowerCase() === dropdownValue)
          : true;

        const matchesSearch = rowText.includes(searchValue);
        const matchesDropdown = dropdownValue === "" || dropdownCell;

        if (matchesSearch && matchesDropdown) {
          row.style.display = "";
          visibleCount++;
        } else {
          row.style.display = "none";
        }
      });

      // Show or hide "No data" message
      if (emptyMsg) {
        emptyMsg.hidden = visibleCount > 0;
      }
    }

    // Event listeners for search and dropdown
    searchInput.addEventListener("input", filterRows);
    dropdown.addEventListener("change", filterRows);
  });
});




document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#Material"], a[href^="#Materialtype"]');
  const allSections = document.querySelectorAll(".section");

  function showOnlySection(id) {
    // hide all sections first
    allSections.forEach(sec => sec.classList.remove("is-active"));

    // show the selected section
    const target = document.querySelector(id);
    if (target) target.classList.add("is-active");
  }

  // click handling for Material links
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault(); // prevent default jump
      const targetId = link.getAttribute("href");
      showOnlySection(targetId);
    });
  });
});








document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const layout = document.querySelector(".layout");
  const toggleBtn = document.getElementById("toggleSidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    layout.classList.toggle("sidebar-collapsed");
  });
});












document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("confirmPopup");
  const popupMessage = document.getElementById("popupMessage");
  const btnApprove = document.getElementById("approveBtn");
  const btnReject = document.getElementById("rejectBtn");
  const btnYes = document.getElementById("confirmYes");
  const btnNo = document.getElementById("confirmNo");

  let currentAction = null;

  // Show popup
  function showPopup(action) {
    currentAction = action;
    popupMessage.textContent = 
      action === "approve" ? "Approve this submission?" : "Reject this submission?";
    popup.style.display = "flex";
  }

  // Hide popup
  function hidePopup() {
    popup.style.display = "none";
  }

  // Event bindings
  btnApprove.addEventListener("click", () => showPopup("approve"));
  btnReject.addEventListener("click", () => showPopup("reject"));
  btnNo.addEventListener("click", hidePopup);

  btnYes.addEventListener("click", () => {
    if (currentAction === "approve") {
      alert("✅ Submission Approved!");
    } else if (currentAction === "reject") {
      alert("❌ Submission Rejected!");
    }
    hidePopup();
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("userModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalButtons = modal.querySelector(".modal-buttons");

  // Handle all action buttons across all tables
  document.querySelectorAll("table .row-actions button").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const row = btn.closest("tr");
      const headers = row.closest("table").querySelectorAll("thead th");
      const cells = row.querySelectorAll("td");

      // Convert row into an object (Header -> Value)
      let user = {};
      headers.forEach((h, i) => {
        const key = h.innerText.trim();
        if (cells[i]) {
          user[key] = cells[i].innerText.trim();
        }
      });

      modal.style.display = "flex";

      // ===== VIEW =====
      if (action === "view") {
        modalTitle.textContent = "View User";
        modalBody.innerHTML = Object.entries(user)
          .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
          .join("");
        modalButtons.innerHTML = `<button class="cancel-btn">Close</button>`;
      }

      // ===== EDIT =====
      else if (action === "edit") {
        modalTitle.textContent = "Edit User";
        modalBody.innerHTML = Object.entries(user)
          .map(([key, value]) => {
            if (key.toLowerCase().includes("date")) {
              return `
                <label>${key}</label>
                <input type="date" value="">
              `;
            }
            return `
              <label>${key}</label>
              <input type="text" value="${value}">
            `;
          })
          .join("");
        modalButtons.innerHTML = `
          <button class="cancel-btn">Cancel</button>
          <button class="confirm-btn">Save</button>
        `;
      }

      // ===== DELETE =====
      else if (action === "delete") {
        modalTitle.textContent = "Delete User";
        modalBody.innerHTML = `
          <p>⚠️ Are you sure you want to delete <strong>${user["First Name"] || "this user"}</strong>?</p>
        `;
        modalButtons.innerHTML = `
          <button class="cancel-btn">Cancel</button>
          <button class="delete-btn">Delete</button>
        `;

        modalButtons.querySelector(".delete-btn").addEventListener("click", () => {
          row.remove();
          modal.style.display = "none";
        });
      }

      // Close modal on Cancel
      modalButtons.querySelector(".cancel-btn").addEventListener("click", () => {
        modal.style.display = "none";
      });
    });
  });
});







//materials
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("userModal");
  if (!modal) return; // ⛔ stop if modal not in page

  const modalTitle = document.getElementById("modalTitle");
  const closeModal = document.getElementById("closeModal");

  // Attach listeners to all buttons with data-action
  document.querySelectorAll("button[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;

      modal.style.display = "flex";
      modalTitle.textContent = action === "view" ? "View User" : "Edit User";

      // Example: make inputs readonly in view mode
      document.querySelectorAll("#modalForm input").forEach(input => {
        if (action === "view") {
          input.setAttribute("readonly", true);
        } else {
          input.removeAttribute("readonly");
        }
      });
    });
  });

  // Close modal
  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
});
