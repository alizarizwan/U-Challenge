<?php
require 'db_connection.php'; // Include the database connection

// Read the JSON input
$data = json_decode(file_get_contents('php://input'), true);

$name = $conn->real_escape_string($data['name']);
$universityId = $conn->real_escape_string($data['university_id']);

if (!$name || !$universityId) {
    echo json_encode(['success' => false, 'error' => 'Name or university ID is missing']);
    exit;
}

// Insert the player into the database
$query = "INSERT INTO players (name, university_id) VALUES ('$name', $universityId)";
if ($conn->query($query)) {
    echo json_encode(['success' => true, 'playerId' => $conn->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to insert player']);
}
?>
