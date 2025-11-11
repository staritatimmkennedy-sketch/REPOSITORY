<?php
// 1. Define all possible pages and their corresponding titles
$pageTitles = [
    'dashboard'      => 'System Dashboard',
    'students'       => 'Student Records',
    'faculty'        => 'Faculty Records',
    'librarian'      => 'Librarian Records',
    'dean'           => 'Dean Records',
    'materials'      => 'Materials',
    'materialType'   => 'Material Types',
    'college'        => 'Colleges',
    'course'         => 'Courses',
    'globalSettings' => 'Global Settings',
    'role'           => 'Roles & Permissions',  
    'logs'           => 'Activity Log',
    'users'          => 'User Records',
    'published'   => 'Published Materials',
    'submissions'   => 'Submitted Materials',
    'borrowed'   => 'Borrowed Materials',
    'student_dashboard'   => 'Dashboard',
    'borrowing'   => 'Manage Borrowing Requests',
    'approved'   => 'Approved Submissions',
    'librarianColleges'   => 'Colleges',
    'librarianDashboard'   => 'Dashboard',
    'approvedDean'   => 'Approved Submissions',
    'deanSubmissions'   => 'Submissions',
    'userBorrowedMaterials'   => 'Borrowed Materials',
    'deanDashboard'   => 'Dashboard',
    'adminDashboard' => 'Dashboard'

];

// 2. Determine the current page from the URL or set a default
$currentPage = isset($_GET['page']) ? $_GET['page'] : 'dashboard';
echo $currentPage;
// 3. Define the file path for the content (absolute path for safety)
$contentFile = __DIR__ . '/pages/' . $currentPage . '.php';
echo $contentFile;
// 4. Fallback to dashboard if invalid page or missing file
if (!isset($pageTitles[$currentPage]) || !file_exists($contentFile)) {
    $contentFile = __DIR__ . '/pages/dashboard.php';
    $currentPage = 'dashboard';
}

// 5. Get the final page title for the header
$pageTitle = $pageTitles[$currentPage];

//index html
include 'main.html'

?>
