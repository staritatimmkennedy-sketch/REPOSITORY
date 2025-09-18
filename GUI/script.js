document.addEventListener('DOMContentLoaded', () => {
  // Notification dropdown
  const notifBtn = document.getElementById('notifBtn');
  const notifMenu = document.getElementById('notifMenu');
  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', () => {
      notifMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!notifBtn.contains(e.target) && !notifMenu.contains(e.target)) {
        notifMenu.classList.remove('open');
      }
    });
  }

  // Account dropdown
  const accountBtn = document.getElementById('accountBtn');
  const accountMenu = document.getElementById('accountMenu');
  if (accountBtn && accountMenu) {
    accountBtn.addEventListener('click', () => {
      accountMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!accountBtn.contains(e.target) && !accountMenu.contains(e.target)) {
        accountMenu.classList.remove('open');
      }
    });
  }

  // Active nav highlight
  const path = location.pathname.split('/').pop();
  const map = {
    'index.html': 'nav-home',
    'borrowing.html': 'nav-borrowing',
    'publishing.html': 'nav-publishing',
    'submission.html': 'nav-submission'
  };
  const activeId = map[path] || 'nav-home';
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');

  // Sidebar active highlight fix
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (
      link.href &&
      window.location.pathname.toLowerCase().endsWith(link.getAttribute('href').toLowerCase())
    ) {
      link.classList.add('active');
    }
  });

  // Universal search function for .feed-item and .video-card
  const searchInput = document.querySelector('.search input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase();

      // Feed items (dashboard, etc.)
      document.querySelectorAll('.feed-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? "" : "none";
      });

      // Video cards (materials, publishing, etc.)
      document.querySelectorAll('.video-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? "" : "none";
      });
    });
  }
});

  // Sidebar active highlight fix
  document.querySelectorAll('.nav-item').forEach(link => {
    link.classList.remove('active');
    // Compare only the filename part for robustness
    if (
      link.getAttribute('href') &&
      window.location.pathname.toLowerCase().endsWith(link.getAttribute('href').toLowerCase())
    ) {
      link.classList.add('active');
    }
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



// Universal search function for .material-card
const searchInput = document.querySelector('.search input');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();

    document.querySelectorAll('.material-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Simulate logged-in user role (can be "student", "faculty", "teacher", "librarian")
  const userRole = localStorage.getItem("role") || "student";

  // Get sidebar links
  const submissionLink = document.getElementById("nav-submission");
  const manageBooksLink = document.getElementById("nav-manage-books"); // Example librarian menu item

  // Hide Submission link for students
  if (userRole === "student" && submissionLink) {
    submissionLink.style.display = "none";
  }

  // Show special librarian menu only for librarians
  if (manageBooksLink) {
    manageBooksLink.style.display = (userRole === "librarian") ? "block" : "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const roleSelect = document.getElementById("roleSelect");
  if (roleSelect) {
    // Load saved role
    const savedRole = localStorage.getItem("role") || "student";
    roleSelect.value = savedRole;

    // Save role when changed
    roleSelect.addEventListener("change", () => {
      localStorage.setItem("role", roleSelect.value);
      alert("Switched to " + roleSelect.value + " role. Refreshing...");
      location.reload();
    });
  }

  // Hide sidebar menu items based on role
  const role = localStorage.getItem("role") || "student";

  if (role === "student") {
    const submissionLink = document.querySelector('a[href="submission.html"]');
    if (submissionLink) submissionLink.style.display = "none";
  }

  if (role !== "librarian") {
    const manageBooksLink = document.querySelector('a[href="manage_books.html"]');
    if (manageBooksLink) manageBooksLink.style.display = "none";
  }
});
