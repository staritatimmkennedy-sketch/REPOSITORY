<?php
require './db.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
    exit;
}

try {
    $firstName  = $_POST['firstname']  ?? '';
    $lastName   = $_POST['lastname']   ?? '';
    $middleName = $_POST['middlename'] ?? null;
    $userName   = $_POST['username']   ?? '';
    $passWord   = $_POST['password']   ?? '';
    $courseId   = isset($_POST['course']) ? (int)$_POST['course'] : null;
    
    $yl = $_POST['yearlevel'] ?? null;
    $map = ['1st Year'=>1,'2nd Year'=>2,'3rd Year'=>3,'4th Year'=>4];
    $yearLevel = isset($map[$yl]) ? $map[$yl] : (is_numeric($yl) ? (int)$yl : null);
    
    $roleId = 2;

    // Validate required fields
    if (empty($firstName) || empty($lastName) || empty($userName) || empty($passWord) || empty($courseId) || empty($yearLevel)) {
        echo json_encode(['success' => false, 'error' => 'Please complete all required fields.']);
        exit;
    }

    $stmt = $conn->prepare("CALL sp_registerUser(?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $firstName,
        $lastName,
        $middleName,
        $roleId,
        $userName,
        $passWord,   
        $yearLevel,  
        $courseId    
    ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    // Check if the stored procedure returned success
    if ($row && isset($row['rowcount']) && (int)$row['rowcount'] > 0) {
        echo json_encode(['success' => true, 'message' => 'Registered successfully.']);
    } else {
        // Get the actual error message from the stored procedure
        $errorMsg = 'Registration failed.';
        if ($row && isset($row['message'])) {
            $errorMsg = $row['message'];
        } elseif ($row && isset($row['error'])) {
            $errorMsg = $row['error'];
        }
        echo json_encode(['success' => false, 'error' => $errorMsg]);
    }
} catch (PDOException $e) {
    // Specific database errors
    error_log("PDO Error in registration: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
} catch (Throwable $e) {
    // General errors
    error_log("General Error in registration: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'An error occurred during registration.']);
}