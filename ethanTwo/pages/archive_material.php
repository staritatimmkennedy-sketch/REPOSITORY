<?php
session_start();
require '../db.php';

// Check if user is librarian
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'Librarian') {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
    exit;
}

if (!isset($_POST['material_id']) || !isset($_POST['action'])) {
    echo json_encode(['success' => false, 'error' => 'Material ID and action are required']);
    exit;
}

$materialId = $_POST['material_id'];
$action = $_POST['action'];

try {
    if ($action === 'archive') {
        // Update material status to Archived
        $sql = "UPDATE material_publishing SET materialStatus = 'Archived' WHERE materialPublishing_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$materialId]);
        
        if ($stmt->rowCount() > 0) {
            // Log the archiving action
            $logSql = "INSERT INTO audit_log (user_id, action_type, description, ip_address) 
                      VALUES (?, 'update', ?, ?)";
            $logStmt = $conn->prepare($logSql);
            $logStmt->execute([
                $_SESSION['user_id'],
                "Archived material with ID: $materialId",
                $_SERVER['REMOTE_ADDR']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Material archived successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Material not found or already archived']);
        }
    } 
    elseif ($action === 'republish') {
        // Update material status to Available
        $sql = "UPDATE material_publishing SET materialStatus = 'Available' WHERE materialPublishing_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$materialId]);
        
        if ($stmt->rowCount() > 0) {
            // Log the republishing action
            $logSql = "INSERT INTO audit_log (user_id, action_type, description, ip_address) 
                      VALUES (?, 'update', ?, ?)";
            $logStmt = $conn->prepare($logSql);
            $logStmt->execute([
                $_SESSION['user_id'],
                "Republished material with ID: $materialId (Status: Available)",
                $_SERVER['REMOTE_ADDR']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Material republished successfully']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Material not found or already available']);
        }
    }
    else {
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
    }
    
} catch (Exception $e) {
    error_log("Material status update error: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>