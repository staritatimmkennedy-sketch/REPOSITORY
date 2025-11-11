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

// 3. Define the file path for the content (absolute path for safety)
$contentFile = __DIR__ . '/pages/' . $currentPage . '.php';

// 4. Fallback to dashboard if invalid page or missing file
if (!isset($pageTitles[$currentPage]) || !file_exists($contentFile)) {
    $contentFile = __DIR__ . '/pages/dashboard.php';
    $currentPage = 'dashboard';
}

// 5. Get the final page title for the header
$pageTitle = $pageTitles[$currentPage];

//index html
include 'index.html'
require './db.php';
  $userName = $_POST['userName'];
  $passWord = md5($_POST['passWord']);
  $numRows = 0;

  $sql1 = "CALL sp_checkLogin(?,?);";
  $conncheck=$conn->prepare($sql1);
  $conncheck->bindParam(1, $userName, PDO::PARAM_STR);
  $conncheck->bindParam(2, $passWord, PDO::PARAM_STR);
  $conncheck->execute();

  while($row = $conncheck->fetch()) 
      {
          $numRows = $row['rowcount'];

          if($numRows>0)
          {
              session_start();
              $_SESSION['user_id'] = $row['userID']; 
              $_SESSION['role'] = $row['roleName'];
              $_SESSION['username'] = $row['username'];
              $_SESSION['role_id'] = $row['roleID'];
              echo $row['roleName'];

          }
          else
          {
              echo "Username and password is incorrect!";
              $conncheck->connection=null;
              break;
          }
      }
          $conncheck->connection=null;
?>
