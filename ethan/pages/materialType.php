<?php
// pages/materialType.php

require_once __DIR__ . '/../db.php';

$materialTypes = [];

try {
    if (isset($conn) && $conn instanceof PDO) {
        $stmt = $conn->query("
            SELECT 
                materialType_id AS id,
                materialTypeName AS name,
                COALESCE(materialTypeDescription, '') AS `desc`
            FROM material_type
            ORDER BY materialType_id ASC
        ");
        
        $materialTypes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
} catch (PDOException $e) {
    error_log("Database error in materialType.php: " . $e->getMessage());
}
if (empty($materialTypes)) {
    $materialTypes = [
        ["id" => "MT001", "name" => "Thesis", "desc" => "Comprehensive research study submitted by students."],
        ["id" => "MT002", "name" => "Research Paper", "desc" => "Academic paper focused on a specific research problem."],
        ["id" => "MT003", "name" => "Project", "desc" => "Practical or capstone projects developed by students."],
        ["id" => "MT004", "name" => "Artwork", "desc" => "Creative visual works such as drawings, paintings, etc."],
        ["id" => "MT005", "name" => "Case Study", "desc" => "In-depth analysis of a real-world scenario or problem."],
        ["id" => "MT006", "name" => "Essay", "desc" => "Formal written composition on a chosen academic topic."],
        ["id" => "MT007", "name" => "Dissertation", "desc" => "Extended research document, typically for graduate level."],
        ["id" => "MT008", "name" => "Portfolio", "desc" => "Collection of works showcasing skills or achievements."]
    ];
}

include 'materialType.html';
?>