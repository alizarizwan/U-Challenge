<?php
require 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);

// Logging incoming data for debugging
error_log("Received data: " . print_r($data, true));

$playerId = $conn->real_escape_string($data['playerId']);
$gameId = $conn->real_escape_string($data['gameId']);
$score = $conn->real_escape_string($data['score']);

if ($playerId === null || $gameId === null || $score === null) {
    error_log("Invalid input: playerId=$playerId, gameId=$gameId, score=$score");
    echo json_encode(['success' => false, 'error' => 'Invalid input data']);
    exit;
}

// Check if the player already has a score for this game
$query = "SELECT score FROM player_scores WHERE player_id = $playerId AND game_id = $gameId";
$result = $conn->query($query);

if ($result === false) {
    error_log("Database query failed: " . $conn->error);
    echo json_encode(['success' => false, 'error' => 'Database query failed']);
    exit;
}

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($score > $row['score'] || $row['score'] === 0) {
        $updateQuery = "UPDATE player_scores SET score = $score WHERE player_id = $playerId AND game_id = $gameId";
        if (!$conn->query($updateQuery)) {
            error_log("Update query failed: " . $conn->error);
            echo json_encode(['success' => false, 'error' => 'Failed to update score']);
            exit;
        }
    }
} else {
    $insertQuery = "INSERT INTO player_scores (player_id, game_id, score) VALUES ($playerId, $gameId, $score)";
    if (!$conn->query($insertQuery)) {
        error_log("Insert query failed: " . $conn->error);
        echo json_encode(['success' => false, 'error' => 'Failed to insert score']);
        exit;
    }
}

echo json_encode(['success' => true]);
?>
