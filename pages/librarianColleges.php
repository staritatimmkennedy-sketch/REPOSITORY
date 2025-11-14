<?php
require_once __DIR__ . '/../db.php';
$sql = "
SELECT
    c.college_id AS id,
    c.collegeName AS name,
    COALESCE(sub.total_submissions, 0) AS submissions,
    COALESCE(sub.approved_count, 0) AS approved,
    COALESCE(pub_stats.currently_borrowed, 0) AS borrowed,
    COALESCE(pub_stats.total_returned_requests, 0) AS returned
FROM college c
LEFT JOIN (
    SELECT
        col.college_id,
        COUNT(ms.materialSubmission_id) AS total_submissions,
        SUM(CASE WHEN ms.deanApprovalStatus IN ('APPROVED', 'PUBLISHED') THEN 1 ELSE 0 END) AS approved_count
    FROM college col
    INNER JOIN course crs ON crs.college_id = col.college_id
    INNER JOIN user_course uc ON uc.course_id = crs.course_id
    INNER JOIN user u ON u.userCourse_id = uc.userCourse_id
    INNER JOIN material_submission ms ON ms.user_id = u.user_id
    GROUP BY col.college_id
) sub ON sub.college_id = c.college_id
LEFT JOIN (
    SELECT
        dcol.collegeID AS college_id,
        SUM(CASE WHEN mp.materialStatus = 'BORROWED' THEN 1 ELSE 0 END) AS currently_borrowed,
        SUM(CASE WHEN mb.borrowStatus = 'RETURNED' THEN 1 ELSE 0 END) AS total_returned_requests
    FROM dean_college dcol
    INNER JOIN material_submission ms ON ms.dean_id = dcol.deanID
    INNER JOIN material_publishing mp ON mp.materialSubmission_id = ms.materialSubmission_id
    LEFT JOIN material_borrowing mb ON mb.callNumber = mp.callNumber
    GROUP BY dcol.collegeID
) pub_stats ON pub_stats.college_id = c.college_id
ORDER BY c.college_id;
";
$result = $conn->query($sql);
$colleges = [];
if ($result !== false) {
    $dbColleges = $result->fetchAll(PDO::FETCH_ASSOC);

    if (count($dbColleges) > 0) {
        foreach ($dbColleges as $row) {
            $color = 'gray';
            $colorScheme = [
                'header' => 'bg-gray-50',
                'accent' => 'text-gray-600',
                'button' => 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ];
            if ($row['id'] == 1) { 
                $color = 'orange'; 
                $colorScheme = [
                    'header' => 'bg-orange-50',
                    'accent' => 'text-orange-600',
                    'button' => 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                ];
            } elseif ($row['id'] == 2) { 
                $color = 'blue'; 
                $colorScheme = [
                    'header' => 'bg-blue-50',
                    'accent' => 'text-blue-600',
                    'button' => 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                ];
            } elseif ($row['id'] == 3) { 
                $color = 'manta'; 
                $colorScheme = [
                    'header' => 'bg-gray-200',
                    'accent' => 'text-gray-800',
                    'button' => 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                ];
            } elseif ($row['id'] == 4) { 
                $color = 'red'; 
                $colorScheme = [
                    'header' => 'bg-red-50',
                    'accent' => 'text-red-600',
                    'button' => 'bg-red-100 text-red-700 hover:bg-red-200'
                ];
            }
            $colleges[] = [
                "id" => $row['id'],
                "name" => $row['name'],
                "submissions" => (int)$row['submissions'],
                "approved" => (int)$row['approved'],
                "borrowed" => (int)$row['borrowed'],
                "returned" => (int)$row['returned'],
                "color" => $color,
                "colorScheme" => $colorScheme
            ];
        }
    } else {
        $colleges = []; 
    }
} else {
    $colleges = [];
}

include 'librarianColleges.html';