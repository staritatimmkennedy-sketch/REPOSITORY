<?php
require_once __DIR__ . '/../db.php';
if ($conn === null) {
    die('Database connection failed.');
}
function esc_low($str) {
    return strtolower(htmlspecialchars($str, ENT_QUOTES, 'UTF-8'));
}
$sql = "
    SELECT 
        mp.materialPublishing_id,
        mp.callNumber,
        mp.librarian_id,  
        mp.materialSubmission_id,
        ms.deanApprovalStatus AS materialStatus,
        m.materialName,   
        m.materialDescription,
        CONCAT(
            COALESCE(m.author_firstname, ''),
            IF(m.author_mi IS NOT NULL AND m.author_mi != '', CONCAT(' ', LEFT(m.author_mi, 1), '. '), ' '),
            COALESCE(m.author_lastname, '')
          )AS author_fullname
    FROM material_publishing mp
    JOIN material_submission ms ON mp.materialSubmission_id = ms.materialSubmission_id
    JOIN material m ON ms.material_id = m.material_id
    ORDER BY mp.materialPublishing_id ASC
";

$stmt = $conn->query($sql);
$materials = $stmt->fetchAll(PDO::FETCH_ASSOC);

require 'materials.html';
?>