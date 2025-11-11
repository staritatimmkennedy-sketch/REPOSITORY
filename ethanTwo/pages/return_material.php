<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json');
require __DIR__ . '/../db.php';

error_log("Return Material Session Debug: " . print_r($_SESSION, true));
error_log("Return Material POST Data: " . print_r($_POST, true));

if (!isset($_SESSION['user_id']) || !isset($_SESSION['role']) || strtoupper($_SESSION['role']) !== 'STUDENT') {
    error_log("Unauthorized access: user_id=" . ($_SESSION['user_id'] ?? 'not set') . ", role=" . ($_SESSION['role'] ?? 'not set'));
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
    exit;
}

$materialBorrowingId = isset($_POST['material_borrowing_id']) ? (int)$_POST['material_borrowing_id'] : 0;

if ($materialBorrowingId > 0) {
    try {
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $conn->beginTransaction();

        $sqlBorrowing = "
            UPDATE material_borrowing 
            SET borrowStatus = 'Returned'
            WHERE materialBorrowing_id = :materialBorrowingId
            AND student_id = :student_id
            AND borrowStatus = 'Approved'
        ";
        $stmtBorrowing = $conn->prepare($sqlBorrowing);
        $stmtBorrowing->bindParam(':materialBorrowingId', $materialBorrowingId, PDO::PARAM_INT);
        $stmtBorrowing->bindParam(':student_id', $_SESSION['user_id'], PDO::PARAM_STR);
        $stmtBorrowing->execute();

        if ($stmtBorrowing->rowCount() === 0) {
            $conn->rollBack();
            error_log("No rows updated in material_borrowing for materialBorrowing_id $materialBorrowingId, student_id={$_SESSION['user_id']}");
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Borrowing request not found or not approved']);
            exit;
        }

        $sqlPublishing = "
            UPDATE material_publishing mp
            INNER JOIN material_borrowing mb ON mp.callNumber = mb.callNumber
            SET mp.materialStatus = 'Available'
            WHERE mb.materialBorrowing_id = :materialBorrowingId
        ";
        $stmtPublishing = $conn->prepare($sqlPublishing);
        $stmtPublishing->bindParam(':materialBorrowingId', $materialBorrowingId, PDO::PARAM_INT);
        $stmtPublishing->execute();

        $conn->commit();
        error_log("Material returned successfully for materialBorrowing_id $materialBorrowingId");
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $conn->rollBack();
        error_log("Return failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Error returning material']);
    }
} else {
    error_log("Invalid borrowing ID: " . print_r($_POST['material_borrowing_id'], true));
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid borrowing ID']);
}
?>