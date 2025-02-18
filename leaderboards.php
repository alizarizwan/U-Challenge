<?php
$host = 'localhost';
$db = 'uchallenge';
$user = 'root';
$pass = '';

$conn = new mysqli($host, $user, $pass, $db);

// Player Leaderboard
$playerLeaderboardQuery = "
    SELECT p.name AS player_name, g.name AS game_name, MAX(ps.score) AS best_score
    FROM player_scores ps
    JOIN players p ON ps.player_id = p.id
    JOIN games g ON ps.game_id = g.id
    GROUP BY ps.player_id, ps.game_id
    ORDER BY best_score DESC
";
$playerResults = $conn->query($playerLeaderboardQuery);

echo "<h3>Player Leaderboard</h3>";
echo "<table border='1'><tr><th>Player</th><th>Game</th><th>Best Score</th></tr>";
while ($row = $playerResults->fetch_assoc()) {
    echo "<tr><td>{$row['player_name']}</td><td>{$row['game_name']}</td><td>{$row['best_score']}</td></tr>";
}
echo "</table>";

// University Leaderboard
$universityLeaderboardQuery = "
    SELECT name AS university_name, total_players, total_score
    FROM universities
    ORDER BY total_score DESC
";
$universityResults = $conn->query($universityLeaderboardQuery);

echo "<h3>University Leaderboard</h3>";
echo "<table border='1'><tr><th>University</th><th>Total Players</th><th>Total Score</th></tr>";
while ($row = $universityResults->fetch_assoc()) {
    echo "<tr><td>{$row['university_name']}</td><td>{$row['total_players']}</td><td>{$row['total_score']}</td></tr>";
}
echo "</table>";
?>
