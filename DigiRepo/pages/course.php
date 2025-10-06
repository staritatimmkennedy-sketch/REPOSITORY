<?php
// Dummy data for courses
$courses = [
  ["id" => "1", "college" => "College of Engineering, Architecture and Technology", "name" => "BS-CS – Bachelor of Science in Computer Science"],
  ["id" => "2", "college" => "College of Engineering, Architecture and Technology", "name" => "BS-IT – Bachelor of Science in Information Technology"],
  ["id" => "3", "college" => "College of Health Sciences", "name" => "BS-N – Bachelor of Science in Nursing"],
  ["id" => "4", "college" => "College of Education", "name" => "BSED-MATHEMATICS – Bachelor of Secondary Education Major in Mathematics"],
  ["id" => "5", "college" => "Business College", "name" => "BSBA-MM – Bachelor of Science in Business Administration Major in Marketing Management"]
];

// Extract colleges for filter
$colleges = array_unique(array_map(fn($c) => $c['college'], $courses));
include 'course.html'
?>