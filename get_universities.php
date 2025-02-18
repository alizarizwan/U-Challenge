<?php
require 'db_connection.php'; // Include database connection

$query = "SELECT id, name FROM universities ORDER BY name ASC";
$result = $conn->query($query);

$universities = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $universities[] = [
            "id" => $row["id"],
            "name" => $row["name"]
        ];
    }
}

header('Content-Type: application/json');
echo json_encode($universities);
?>
