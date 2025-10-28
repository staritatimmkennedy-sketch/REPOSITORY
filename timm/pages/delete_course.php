<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $course_id = $_POST['course_id'] ?? null;
    
    if (!$course_id) {
        echo json_encode(['message' => 'Course ID is required', 'rows_affected' => 0]);
        exit;
    }
    
    // Database connection
    $servername = "127.0.0.1";
    $username = "root";
    $password = "";
    $dbname = "library_repository_db";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Call the stored procedure
        $stmt = $conn->prepare("CALL sp_deleteCourse(:course_id)");
        $stmt->bindParam(':course_id', $course_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'message' => $result['message'],
            'rows_affected' => $result['rows_affected']
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'message' => 'Database error: ' . $e->getMessage(),
            'rows_affected' => 0
        ]);
    }
} else {
    echo json_encode(['message' => 'Invalid request method', 'rows_affected' => 0]);
}
?>