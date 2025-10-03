<?php 
session_start();

// role comes from login.php after successful login
$role = $_SESSION['role'] ?? 'Guest';

// active page
$current = isset($currentPage) ? $currentPage : 'dashboard';
?>

<aside class="w-64 cf-sidebar p-6 flex flex-col justify-between bg-white border-r border-gray-200">
  <div>
    <!-- Logo -->
    <div class="flex items-center mb-10">
      <img src="logo.png" alt="logo" class="w-40 h-12 mr-2">
    </div>

    <!-- SYSTEM MENU -->
    <nav class="space-y-2"
         x-data="{ openMenu: '<?php 
           echo in_array($current, ['users','role']) ? 'people' : 
                (in_array($current, ['materials','materialType']) ? 'materials' : 
                (in_array($current, ['college','course']) ? 'acad' : '')); ?>' }">

      <div class="text-gray-500 uppercase text-xs font-bold mb-2">System</div>

      <!-- Dashboard (common) -->
      <a href="index.php?page=dashboard"
         class="cf-nav-item <?php echo ($current === 'dashboard') ? 'active' : ''; ?>">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
              stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-3 flex-shrink-0">
           <path stroke-linecap="round" stroke-linejoin="round" 
                 d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25
                    a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z
                    M13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25
                    A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6Z
                    M3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25A2.25 2.25 0 0 1 10.5 15.75V18
                    A2.25 2.25 0 0 1 8.25 20.25H6A2.25 2.25 0 0 1 3.75 18v-2.25Z
                    M13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18
                    a2.25 2.25 0 0 1-2.25 2.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"/>
         </svg>
         Dashboard
      </a>












      <?php if ($role === "SysAdmin"): ?>
        <!-- People -->
        <div>
          <button @click="openMenu = (openMenu === 'people' ? '' : 'people')"
                  class="flex items-center justify-between w-full cf-nav-item">
            <span class="flex items-center">👥 People</span>
            <svg :class="{'rotate-180': openMenu === 'people'}" class="w-4 h-4 transition-transform flex-shrink-0" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div x-show="openMenu === 'people'" x-collapse x-transition.opacity 
               class="ml-6 mt-2 space-y-1">
            <a href="index.php?page=users" 
               class="cf-sub-item <?php echo ($current === 'users') ? 'active' : ''; ?>">Users</a>
            <a href="index.php?page=role" 
               class="cf-sub-item <?php echo ($current === 'role') ? 'active' : ''; ?>">Roles</a>
          </div>
        </div>

        <!-- Materials -->
        <div>
          <button @click="openMenu = (openMenu === 'materials' ? '' : 'materials')"
                  class="flex items-center justify-between w-full cf-nav-item">
            <span class="flex items-center">📚 Materials</span>
            <svg :class="{'rotate-180': openMenu === 'materials'}" class="w-4 h-4 transition-transform flex-shrink-0" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div x-show="openMenu === 'materials'" x-collapse x-transition.opacity 
               class="ml-6 mt-2 space-y-1">
            <a href="index.php?page=materials" 
               class="cf-sub-item <?php echo ($current === 'materials') ? 'active' : ''; ?>">Material Records</a>
            <a href="index.php?page=materialType" 
               class="cf-sub-item <?php echo ($current === 'materialType') ? 'active' : ''; ?>">Material Types</a>
          </div>
        </div>

        <!-- Academics -->
        <div>
          <button @click="openMenu = (openMenu === 'acad' ? '' : 'acad')"
                  class="flex items-center justify-between w-full cf-nav-item">
            <span class="flex items-center">🎓 Academics</span>
            <svg :class="{'rotate-180': openMenu === 'acad'}" class="w-4 h-4 transition-transform flex-shrink-0" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div x-show="openMenu === 'acad'" x-collapse x-transition.opacity 
               class="ml-6 mt-2 space-y-1">
            <a href="index.php?page=college" 
               class="cf-sub-item <?php echo ($current === 'college') ? 'active' : ''; ?>">Colleges</a>
            <a href="index.php?page=course" 
               class="cf-sub-item <?php echo ($current === 'course') ? 'active' : ''; ?>">Courses</a>
          </div>
        </div>

        <!-- Audit Logs -->
        <a href="index.php?page=logs" 
           class="cf-nav-item <?php echo ($current === 'logs') ? 'active' : ''; ?>">📝 Audit Logs</a>
      <?php endif; ?>


















      <?php if ($role === "Faculty" || $role === "Student"): ?>
        <a href="index.php?page=borrowed" 
           class="cf-nav-item <?php echo ($current === 'borrowed') ? 'active' : ''; ?>">📖 My Borrowed Materials</a>
        <a href="index.php?page=submissions" 
           class="cf-nav-item <?php echo ($current === 'submissions') ? 'active' : ''; ?>">✍️ My Submissions</a>
      <?php endif; ?>

      <?php if ($role === "Faculty"): ?>
        <a href="index.php?page=reviews" 
           class="cf-nav-item <?php echo ($current === 'reviews') ? 'active' : ''; ?>">✅ Review Submissions</a>
      <?php endif; ?>

      <?php if ($role === "Dean"): ?>
        <a href="index.php?page=deanApprovals" 
           class="cf-nav-item <?php echo ($current === 'deanApprovals') ? 'active' : ''; ?>">📌 Dean Approvals</a>
      <?php endif; ?>

      <?php if ($role === "Librarian"): ?>
        <a href="index.php?page=manageBorrowing" 
           class="cf-nav-item <?php echo ($current === 'manageBorrowing') ? 'active' : ''; ?>">📚 Manage Borrowing</a>
      <?php endif; ?>

    </nav>









  </div>

  <!-- Settings & Logout (common) -->
  <div>
    <a href="index.php?page=globalSettings"
       class="cf-nav-item <?php echo ($current === 'globalSettings') ? 'active' : ''; ?>">⚙️ Settings</a>
    <a href="logout.php" class="cf-nav-item text-red-600 mt-2">🚪 Logout</a>
  </div>
</aside>

<!-- Alpine.js -->
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

<style>



/* Main nav items */
.cf-nav-item {
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 4px;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.2s ease;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    text-decoration: none;
    color:rgb(54, 54, 54);
    position: relative;
}
.cf-nav-item:hover {
    background-color:rgba(136, 151, 147, 0.25);
    color: #059669;
    transform: translateX(3px);
}
.cf-nav-item.active {
    background-color: rgba(5, 150, 105, 0.15);
    color:rgb(0, 76, 24);
    font-weight: 600;
}
.cf-nav-item::before,
.cf-sub-item::before {
    content: "";
    position: absolute;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}
.cf-nav-item:hover::before,
.cf-nav-item.active::before {
    opacity: 1;
}
.cf-nav-item.active::before {
    top: 8px; bottom: 8px; width: 4px;
    border-radius: 0 4px 4px 0;
    background-color: #059668ba;
}

/* Sub items */
.cf-sub-item {
    padding: 10px 16px;
    border-radius: 6px;
    display: block;
    font-size: 14px;
    color: #374151;
    text-decoration: none;
    position: relative;
    transition: background-color 0.25s ease, color 0.25s ease, transform 0.2s ease;
}
.cf-sub-item:hover {
    background-color: #f3f4f6;
    color: #059669;
    transform: translateX(3px);
}
.cf-sub-item.active {
    background-color: rgba(5, 150, 105, 0.15);
    color: #034f37;
    font-weight: 600;
}
.cf-sub-item.active::before {
    top: 6px; bottom: 6px; width: 3px;
    border-radius: 0 3px 3px 0;
    background-color: #059668ba;
    opacity: 1;
}
</style>
