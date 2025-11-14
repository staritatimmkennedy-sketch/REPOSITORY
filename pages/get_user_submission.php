<?php
if (session_status() === PHP_SESSION_NONE) session_start();

// Check if user is logged in
if (empty($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode([]);
    exit;
}

require_once __DIR__ . '/../db.php';

// Check database connection
if (!$conn) {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

try {
    $stmt = $conn->prepare("CALL sp_getUserSubmissionsTwo(?)");
    $stmt->bindParam(1, $_SESSION['user_id'], PDO::PARAM_STR);
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();
    
    // Ensure we always return a valid JSON array, even if empty
    if (!$data) {
        $data = [];
    }
    
    // Clean the data to prevent JSON encoding issues
    $cleanData = array_map(function($item) {
        foreach ($item as $key => $value) {
            // Handle binary file data - convert to base64 or empty string
            if ($key === 'materialFile') {
                if (!empty($value) && is_string($value)) {
                    // Check if this looks like binary data (PDF, etc.)
                    if (strlen($value) > 1000 || preg_match('/[^\x20-\x7E\t\r\n]/', $value)) {
                        // It's likely binary data, replace with file indicator
                        $item[$key] = 'file_exists';
                    } else {
                        // It's text, keep as is
                        $item[$key] = $value;
                    }
                } else {
                    $item[$key] = '';
                }
            }
            // Convert null to empty string for other fields
            elseif ($value === null) {
                $item[$key] = '';
            } else {
                // Ensure proper encoding and remove any invalid UTF-8 characters
                $item[$key] = mb_convert_encoding((string)$value, 'UTF-8', 'UTF-8');
                // Remove any remaining invalid characters
                $item[$key] = preg_replace('/[^\x{0009}\x{000A}\x{000D}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', '', $item[$key]);
            }
        }
        return $item;
    }, $data);
    
    header('Content-Type: application/json; charset=utf-8');
    
    // Use JSON encoding with error handling
    $json = json_encode($cleanData, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    
    if ($json === false) {
        // If encoding still fails, return minimal safe data
        $safeData = array_map(function($item) {
            return [
                'submission_id' => $item['submission_id'] ?? '',
                'submissionDate' => $item['submissionDate'] ?? '',
                'approvalStatus' => $item['approvalStatus'] ?? '',
                'materialName' => $item['materialName'] ?? '',
                'materialType_id' => $item['materialType_id'] ?? '',
                'materialFile' => 'file_exists' // Simplified file indicator
            ];
        }, $data);
        
        echo json_encode($safeData, JSON_UNESCAPED_SLASHES);
    } else {
        echo $json;
    }
    
} catch (Exception $e) {
    // Log the error for debugging
    error_log("get_user_submission.php error: " . $e->getMessage());
    
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Failed to fetch submissions']);
}

exit;
?>