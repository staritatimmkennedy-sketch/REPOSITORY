<?php
// pages/get_approvedSubmissions.php
session_start();
header('Content-Type: application/json');
require __DIR__ . '/../db.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Librarian') {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT 
            ms.materialSubmission_id,
            ms.submissionDate,
            ms.approvalDate,
            ms.approvalStatus,
            CONCAT(s.firstName, ' ', IFNULL(CONCAT(LEFT(s.middleName,1),'. '), ''), s.lastName) AS studentName,
            m.materialName,
            m.materialFile,
            mt.materialTypeName AS materialType_id,
            m.author_firstname,
            m.author_lastname,
            m.author_mi,
            c.collegeName AS deanCollege
        FROM material_submission ms
        INNER JOIN material m ON ms.material_id = m.material_id
        INNER JOIN user s ON ms.user_id = s.user_id
        INNER JOIN user_course uc ON s.userCourse_id = uc.userCourse_id
        INNER JOIN course co ON uc.course_id = co.course_id
        INNER JOIN college c ON co.college_id = c.college_id
        LEFT JOIN material_type mt ON m.materialType_id = mt.materialType_id
        WHERE ms.approvalStatus = 'APPROVED'
        AND ms.dean_id IS NOT NULL
        ORDER BY ms.approvalDate DESC
    ");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Extract filename only
    foreach ($results as &$row) {
        $row['materialFile'] = basename($row['materialFile']);
    }

    echo json_encode($results);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>