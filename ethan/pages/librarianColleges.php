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
        SUM(CASE WHEN ms.approvalStatus IN ('APPROVED', 'PUBLISHED') THEN 1 ELSE 0 END) AS approved_count
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
?>

<div id="colleges" class="p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <?php 
    foreach ($colleges as $c): 
        $colorScheme = $c['colorScheme'];
    ?>
    <div class="bg-white border rounded-lg shadow-sm hover:shadow transition-all duration-300 overflow-hidden">
      <div class="<?= $colorScheme['header'] ?> border-b p-4">
        <div class="flex items-center">
          <div class="mr-3 p-2 rounded-md bg-white shadow-sm">
            <?php 
              if ($c['id'] == 1) {
                echo '<svg class="w-5 h-5 '.$colorScheme['accent'].'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';
              } elseif ($c['id'] == 2) {
                echo '<svg class="w-5 h-5 '.$colorScheme['accent'].'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>';
              } elseif ($c['id'] == 3) {
                echo '<svg class="w-5 h-5 '.$colorScheme['accent'].'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14v6l9-5m-9 5l-9-5"></path></svg>';
              } else {
                echo '<svg class="w-5 h-5 '.$colorScheme['accent'].'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>';
              }
            ?>
          </div>
          <div class="min-w-0 flex-1">
            <h3 class="text-sm font-semibold text-gray-800 truncate"><?= htmlspecialchars($c["name"]) ?></h3>
            <div class="flex items-center mt-1">
              <span class="inline-block w-2 h-2 rounded-full mr-2 <?= 
                $c['color'] == 'orange' ? 'bg-orange-400' : 
                ($c['color'] == 'blue' ? 'bg-blue-400' : 
                ($c['color'] == 'manta' ? 'bg-gray-600' : 'bg-red-400')) 
              ?>"></span>
              <p class="text-xs text-gray-600 truncate"><?= $c["submissions"] ?> Submissions</p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4">
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center transition-transform hover:scale-105">
            <div class="flex justify-center mb-1">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <p class="text-blue-700 font-bold text-base"><?= $c["submissions"] ?></p>
            <p class="text-gray-600">Submissions</p>
          </div>
          <div class="p-3 bg-green-50 border border-green-100 rounded-lg text-center transition-transform hover:scale-105">
            <div class="flex justify-center mb-1">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p class="text-green-700 font-bold text-base"><?= $c["approved"] ?></p>
            <p class="text-gray-600">Approved</p>
          </div>
          <div class="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-center transition-transform hover:scale-105">
            <div class="flex justify-center mb-1">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <p class="text-yellow-700 font-bold text-base"><?= $c["borrowed"] ?></p>
            <p class="text-gray-600">Borrowed</p>
          </div>
          <div class="p-3 bg-purple-50 border border-purple-100 rounded-lg text-center transition-transform hover:scale-105">
            <div class="flex justify-center mb-1">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p class="text-purple-700 font-bold text-base"><?= $c["returned"] ?></p>
            <p class="text-gray-600">Returned</p>
          </div>
        </div>

        <div class="mt-4 text-right">
          <a href="index.php?page=college_report&id=<?= $c['id'] ?>"
             class="px-3 py-1.5 rounded-md text-xs font-medium transition-colors <?= $colorScheme['button'] ?> inline-flex items-center">
            View Reports
            <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <?php endforeach; ?>

  </div>
</div>