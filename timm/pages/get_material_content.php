<?php
// pages/get_material_content.php
include '../db.php';
session_start();

/* --- SESSION & ROLE --- */
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'No session']);
    exit;
}

$role = trim($_SESSION['role'] ?? '');
if (strcasecmp($role, 'dean') === 0) $role = 'Dean';
if (strcasecmp($role, 'librarian') === 0) $role = 'Librarian';
if (!in_array($role, ['Dean', 'Librarian'])) {
    http_response_code(403);
    echo json_encode(['error' => "Role: '$role'"]);
    exit;
}
$_SESSION['role'] = $role;

/* --- INPUT --- */
$submission_id = (int)($_GET['submission_id'] ?? 0);
if ($submission_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

/* --- QUERY --- */
$sql = "
    SELECT m.materialFile
    FROM material_submission ms
    INNER JOIN material m ON ms.material_id = m.material_id
    WHERE ms.materialSubmission_id = :id
";

if ($role === 'Dean') {
    $sql .= "
        AND EXISTS (
            SELECT 1 FROM user s
            INNER JOIN user_course uc ON s.userCourse_id = uc.userCourse_id
            INNER JOIN course c ON uc.course_id = c.course_id
            INNER JOIN dean_college dc ON c.college_id = dc.collegeID
            WHERE s.user_id = ms.user_id AND dc.deanID = :dean_id
        )
    ";
}

try {
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $submission_id, PDO::PARAM_INT);
    if ($role === 'Dean') {
        $stmt->bindParam(':dean_id', $_SESSION['user_id'], PDO::PARAM_STR);
    }
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row || empty($row['materialFile'])) {
        echo json_encode(['error' => 'No file in DB']);
        exit;
    }

    $filePath = $row['materialFile']; // e.g. "uploads/file_123.pdf" or "file_123.pdf"

    // Normalize: remove leading ../ or /
    $filePath = ltrim($filePath, '/');
    $filePath = preg_replace('#^(\.\./)+#', '', $filePath);

    // --- CHANGE HERE: Use ethan/uploads/ ---
    $baseDir  = realpath(__DIR__ . '/../uploads/');  // ← ethan/uploads/
    $fullPath = realpath($baseDir . '/' . basename($filePath));

    if ($fullPath === false || strpos($fullPath, $baseDir) !== 0 || !file_exists($fullPath)) {
        echo json_encode(['error' => 'File not found on server']);
        exit;
    }

    $filename = basename($filePath);
    echo json_encode(['file' => $filename]);

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Server error']);
}
?>