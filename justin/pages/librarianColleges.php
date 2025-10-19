<?php
// Dummy College Data with Reports
$colleges = [
  [
    "id" => 1,
    "name" => "College of Engineering, Architecture and Technology",
    "submissions" => 120,
    "approved" => 95,
    "borrowed" => 80,
    "returned" => 75,
    "color" => "orange"
  ],
  [
    "id" => 2,
    "name" => "College of Health Sciences",
    "submissions" => 85,
    "approved" => 70,
    "borrowed" => 65,
    "returned" => 62,
    "color" => "blue"
  ],
  [
    "id" => 3,
    "name" => "College of Education and Sciences",
    "submissions" => 60,
    "approved" => 50,
    "borrowed" => 40,
    "returned" => 38,
    "color" => "manta"
  ],
  [
    "id" => 4,
    "name" => "Business College",
    "submissions" => 95,
    "approved" => 88,
    "borrowed" => 72,
    "returned" => 70,
    "color" => "red"
  ],
];
include 'librarianColleges.html'
?>