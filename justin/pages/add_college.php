<?php
//AJAX HANDLERzz

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php';

if (!isset($conn) || !($conn instanceof PDO)) {
    echo json_encode(['success' => false, 'message' => 'Database connection unavailable']);
    exit;
}

$collegeName = trim($_POST['college_name'] ?? '');

if (empty($collegeName)) {
    echo json_encode(['success' => false, 'message' => 'College name is required']);
    exit;
}

try {
    // Call your existing stored procedure
    $stmt = $conn->prepare("CALL sp_addCollege(?)");
    $stmt->execute([$collegeName]);

    // 🔥 Consume all result sets (required for stored procedures that return data)
    $result = [];
    do {
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($rows)) {
            $result = $rows[0]; // sp_addCollege returns one row
        }
    } while ($stmt->nextRowset());

    // Check if it failed (e.g., duplicate)
    if (isset($result['rowcount']) && $result['rowcount'] == 0) {
        echo json_encode(['success' => false, 'message' => $result['message'] ?? 'College already exists']);
    } else {
        // Success: return new college data
        echo json_encode([
            'success' => true,
            'college' => [
                'id' => $result['college_id'] ?? null,
                'name' => $result['collegeName'] ?? $collegeName
            ]
        ]);
    }

} catch (PDOException $e) {
    error_log("Add college error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to add college. Please try again.']);
}
?>