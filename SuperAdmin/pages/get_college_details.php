<?php
// pages/get_college_details.php

header('Content-Type: application/json');
require_once __DIR__ . '/../db.php'; // Adjust path if necessary

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$collegeId = $_GET['college_id'] ?? null;

if (empty($collegeId) || !is_numeric($collegeId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid College ID']);
    exit;
}

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Database connection unavailable');
    }

    $stmt = $conn->prepare("
        SELECT college_id AS id, collegeName AS name
        FROM college
        WHERE college_id = ?
    ");
    $stmt->execute([$collegeId]);
    $college = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$college) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'College not found']);
        exit;
    }

    echo json_encode(['success' => true, 'college' => $college]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("Error fetching college details: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>