<?php
// filter_users.php — AJAX endpoint for filtering users

// Set content type (optional but good practice)
header('Content-Type: text/html; charset=utf-8');

// Include DB
require_once __DIR__ . '/../db.php';

// Safety check
if (!isset($conn) || !($conn instanceof PDO)) {
    http_response_code(500);
    echo "<tr><td colspan='7' class='text-center py-4 text-red-500'>Database error</td></tr>";
    exit;
}

// Get filters
$search = $_GET['search'] ?? '';
$course = $_GET['course'] ?? '';
$role = $_GET['role'] ?? '';
$year = $_GET['year'] ?? '';

// Base query
$query = "
  SELECT 
    u.firstName, u.middleName, u.lastName, u.yearLevel,
    r.roleName AS role, 
    c.courseName AS course
  FROM user u
  LEFT JOIN role r ON u.role_id = r.role_id
  LEFT JOIN course c ON u.userCourse_id = c.course_id
  WHERE 1=1
";

$params = [];

// Search filter
if (!empty($search)) {
    $searchTerm = "%$search%";
    $query .= " AND (
        u.firstName LIKE ? OR 
        u.lastName LIKE ? OR 
        u.middleName LIKE ? OR 
        r.roleName LIKE ? OR 
        c.courseName LIKE ?
    )";
    $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm]);
}

// Exact filters
if (!empty($course)) {
    $query .= " AND c.courseName = ?";
    $params[] = $course;
}

if (!empty($role)) {
    $query .= " AND r.roleName = ?";
    $params[] = $role;
}

if (!empty($year)) {
    $query .= " AND u.yearLevel = ?";
    $params[] = $year;
}

$query .= " ORDER BY u.firstName ASC";

try {
    $stmt = $conn->prepare($query); // ✅ Use $pdo, not $conn
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    error_log("Filter users query error: " . $e->getMessage());
    echo "<tr><td colspan='7' class='text-center py-4 text-red-500'>Failed to load users</td></tr>";
    exit;
}

// Output rows
if (!empty($users)) {
    foreach ($users as $u) {
        echo "
        <tr class='border-b hover:bg-gray-50'>
          <td class='px-4 py-3 text-sm'>" . htmlspecialchars($u['firstName'] ?? '') . "</td>
          <td class='px-4 py-3 text-sm'>" . htmlspecialchars($u['middleName'] ?? '') . "</td>
          <td class='px-4 py-3 text-sm'>" . htmlspecialchars($u['lastName'] ?? '') . "</td>
          <td class='px-4 py-3 text-sm'>" . htmlspecialchars($u['role'] ?? '—') . "</td>
          <td class='px-4 py-3 text-sm'>" . htmlspecialchars($u['course'] ?? '—') . "</td>
          <td class='px-4 py-3 text-sm'>" . htmlspecialchars($u['yearLevel'] ?? '—') . "</td>
          <td class='px-4 py-3 text-center'>
            <div class='relative inline-block text-left'>
              <button class='w-24 text-center px-3 py-1 bg-gray-200 border border-gray-400 text-sm rounded-md hover:bg-gray-300 focus:outline-none whitespace-nowrap'>
                Manage ▾
              </button>
              <div class='hidden absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10'>
                <a href='#' class='block px-4 py-2 text-sm hover:bg-gray-100'>Update Account</a>
                <a href='#' class='block px-4 py-2 text-sm hover:bg-gray-100'>Edit Username</a>
                <a href='#' class='block px-4 py-2 text-sm hover:bg-gray-100'>Edit Password</a>
                <a href='#' class='block px-4 py-2 text-sm text-red-600 hover:bg-gray-100'>Remove Account</a>
              </div>
            </div>
          </td>
        </tr>
        ";
    }
} else {
    echo "<tr><td colspan='7' class='px-4 py-3 text-center text-gray-500'>No users found</td></tr>";
}
?>