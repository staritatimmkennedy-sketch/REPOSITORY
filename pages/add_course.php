<?php
// pages/add_course.php — AJAX handler for adding a course
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
header('Content-Type: application/json');

session_start();  // REQUIRED FOR $_SESSION['user_id']
require_once __DIR__ . '/../db.php';

// Log request
error_log("=== ADD COURSE REQUEST START ===");
error_log("Request method: " . $_SERVER['REQUEST_METHOD']);
error_log("POST data: " . print_r($_POST, true));

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$courseName = trim($_POST['course_name'] ?? '');
$collegeId  = (int)($_POST['college_id'] ?? 0);

error_log("Processing - Course: '$courseName', College ID: $collegeId");

if (empty($courseName)) {
    error_log("Validation failed: Empty course name");
    echo json_encode(['success' => false, 'message' => 'Course name is required']);
    exit;
}

if ($collegeId <= 0) {
    error_log("Validation failed: Invalid college ID");
    echo json_encode(['success' => false, 'message' => 'Please select a valid college']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection failed');
    }

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, true);

    // === VALIDATE COLLEGE EXISTS ===
    $collegeCheck = $conn->prepare("SELECT college_id, collegeName FROM college WHERE college_id = ?");
    $collegeCheck->execute([$collegeId]);
    $college = $collegeCheck->fetch(PDO::FETCH_ASSOC);

    if (!$college) {
        error_log("College not found: ID $collegeId");
        echo json_encode(['success' => false, 'message' => 'Selected college does not exist']);
        exit;
    }

    error_log("College found: " . $college['collegeName']);

    // === CALL STORED PROCEDURE ===
    $stmt = $conn->prepare("CALL sp_addCourse(?, ?)");
    $stmt->execute([$collegeId, $courseName]);

    $results = [];
    do {
        $resultSet = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($resultSet)) {
            $results[] = $resultSet;
        }
    } while ($stmt->nextRowset());

    error_log("All result sets: " . print_r($results, true));

    $success = false;
    $message = '';
    $courseData = [];

    if (!empty($results)) {
        $firstResult = $results[0][0] ?? [];

        if (isset($firstResult['rowcount'])) {
            if ((int)$firstResult['rowcount'] === 1) {
                $success = true;
                $message = 'Course added successfully!';
                $courseData = [
                    'id' => (int)($firstResult['course_id'] ?? 0),
                    'name' => $firstResult['courseName'] ?? $courseName,
                    'college' => $college['collegeName']
                ];
                error_log("SUCCESS: Course added via SP - ID: " . $courseData['id']);
            } else {
                $success = false;
                $message = $firstResult['message'] ?? 'Course already exists under this college';
                error_log("DUPLICATE: " . $message);
            }
        } elseif (isset($firstResult['message'])) {
            $success = false;
            $message = $firstResult['message'];
            error_log("SP ERROR: " . $message);
        } else {
            error_log("UNEXPECTED RESULT: " . print_r($firstResult, true));
            $success = false;
            $message = 'Unexpected response from database';
        }
    } else {
        // === FALLBACK: Manual check ===
        $checkStmt = $conn->prepare("
            SELECT c.course_id, c.courseName, cl.collegeName
            FROM course c
            JOIN college cl ON c.college_id = cl.college_id
            WHERE c.courseName = ? AND c.college_id = ?
            ORDER BY c.course_id DESC LIMIT 1
        ");
        $checkStmt->execute([$courseName, $collegeId]);
        $existingCourse = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingCourse) {
            $success = true;
            $message = 'Course added successfully!';
            $courseData = [
                'id' => (int)$existingCourse['course_id'],
                'name' => $existingCourse['courseName'],
                'college' => $existingCourse['collegeName']
            ];
            error_log("SUCCESS: Course found after SP - ID: " . $courseData['id']);
        } else {
            $success = false;
            $message = 'Failed to add course. Please try again.';
            error_log("FAILED: Course not found after SP");
        }
    }

    // === AUDIT LOG: ONLY ON SUCCESS ===
    if ($success && !empty($courseData['id'])) {
        $currentUserId = $_SESSION['user_id'] ?? 'unknown';
        $description = "Created new course ID {$courseData['id']}: '{$courseData['name']}' under college '{$courseData['college']}'";

        $logStmt = $conn->prepare("
            INSERT INTO audit_log (user_id, action_type, description) 
            VALUES (?, 'create', ?)
        ");
        $logStmt->execute([$currentUserId, $description]);
    }

    // === SEND RESPONSE ===
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => $message,
            'course' => $courseData
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
    }

} catch (PDOException $e) {
    error_log("PDO EXCEPTION: " . $e->getMessage());
    error_log("PDO Error Info: " . print_r($conn->errorInfo(), true));

    $errorCode = $e->errorInfo[1] ?? 0;
    if ($errorCode == 1062 || strpos($e->getMessage(), 'Duplicate') !== false) {
        echo json_encode(['success' => false, 'message' => 'Course already exists under this college']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} catch (Exception $e) {
    error_log("GENERAL EXCEPTION: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'An unexpected error occurred: ' . $e->getMessage()]);
}

error_log("=== ADD COURSE REQUEST END ===");
?>