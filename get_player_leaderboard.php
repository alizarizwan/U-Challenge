<?php
require 'db_connection.php'; // Include database connection

$query = "
    SELECT p.name AS name, g.name AS game, MAX(ps.score) AS bestScore
    FROM player_scores ps
    JOIN players p ON ps.player_id = p.id
    JOIN games g ON ps.game_id = g.id
    GROUP BY ps.player_id, ps.game_id
    ORDER BY bestScore DESC
";
$result = $conn->query($query);

$playerLeaderboard = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $playerLeaderboard[] = $row;
    }
}

echo json_encode($playerLeaderboard);
?>
