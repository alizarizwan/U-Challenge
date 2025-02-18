const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetButton = document.querySelector("#resetButton");
const quitButton = document.querySelector("#quitButton");
const redirectButton = document.getElementById("redirectButton");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#000036";
const paddleColor = "white";
const ballColor = "#F6F300";
const paddleSpeed = 10;
const ballSize = 20;

let ballX, ballY, ballXDirection, ballYDirection, ballSpeed;
let playerScore = 0,
  cpuScore = 0;
let paddle,
  paddle2,
  keys = {};

window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

function initializeGame() {
  paddle = { width: 25, height: 100, x: 0, y: (gameHeight - 100) / 2 };
  paddle2 = { width: 25, height: 100, x: gameWidth - 25, y: (gameHeight - 100) / 2 };
  resetGame();
}

function gameStart() {
  createBall();
  gameLoop();
}

function gameLoop() {
  clearBoard();
  drawPaddles();
  drawBall();
  moveBall();
  checkCollision();
  movePlayerPaddle();
  movePaddle();
  updateScore();

  if (playerScore < 5 && cpuScore < 5) {
    requestAnimationFrame(gameLoop);
  } else {
    const message = playerScore >= 5 ? "You Win!" : "CPU Wins!";
    updatePlayerScore(playerScore); // Update database with player's final score
    showPopup(playerScore, cpuScore, message);
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  // Draw center line
  ctx.strokeStyle = "white";
  ctx.setLineDash([15, 15]);
  ctx.beginPath();
  ctx.moveTo(gameWidth / 2, 0);
  ctx.lineTo(gameWidth / 2, gameHeight);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddles() {
  ctx.fillStyle = paddleColor;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
  ballSpeed = 2;
  ballXDirection = Math.random() < 0.5 ? 1 : -1;
  ballYDirection = Math.random() < 0.5 ? 1 : -1;
}

function drawBall() {
  ctx.fillStyle = ballColor;
  ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
}

function moveBall() {
  ballX += ballSpeed * ballXDirection;
  ballY += ballSpeed * ballYDirection;
}

function checkCollision() {
  // Ball hits top or bottom wall
  if (ballY <= 0 || ballY >= gameHeight) ballYDirection *= -1;

  // Ball hits player paddle
  if (
    ballX <= paddle.x + paddle.width &&
    ballY >= paddle.y &&
    ballY <= paddle.y + paddle.height
  ) {
    ballXDirection = 1;
    ballSpeed += 0.5;
  }

  // Ball hits CPU paddle
  if (
    ballX >= paddle2.x &&
    ballY >= paddle2.y &&
    ballY <= paddle2.y + paddle2.height
  ) {
    ballXDirection = -1;
    ballSpeed += 0.5;
  }

  // Ball goes out of bounds
  if (ballX <= 0) {
    cpuScore++;
    createBall();
  }
  if (ballX >= gameWidth) {
    playerScore++;
    createBall();
  }
}

function movePlayerPaddle() {
  if (keys["w"] && paddle.y > 0) paddle.y -= paddleSpeed;
  if (keys["s"] && paddle.y < gameHeight - paddle.height) paddle.y += paddleSpeed;
}

function movePaddle() {
  const targetY = ballY - paddle2.height / 2;
  paddle2.y += Math.sign(targetY - paddle2.y) * Math.min(Math.abs(targetY - paddle2.y), paddleSpeed - 2);
  paddle2.y = Math.max(0, Math.min(gameHeight - paddle2.height, paddle2.y));
}

function updateScore() {
  scoreText.textContent = `${playerScore} : ${cpuScore}`;
}

function resetGame() {
  playerScore = 0;
  cpuScore = 0;
  paddle.y = (gameHeight - paddle.height) / 2;
  paddle2.y = (gameHeight - paddle2.height) / 2;
  createBall();
  gameStart();
}

function showPopup(playerScore, cpuScore, message = "Game Over!") {
  const popup = document.getElementById("popup");
  const finalScoreText = document.getElementById("finalScore");

  // Update popup content
  finalScoreText.textContent = `${message}\nFinal Score: Player ${playerScore} - CPU ${cpuScore}`;

  // Show popup
  popup.classList.remove("hidden");
  popup.style.display = "flex";
}

// Update player score in the database
function updatePlayerScore(playerScore) {
  const playerId = localStorage.getItem("playerId");
  const gameId = 12; // Replace with the game ID for Ping Pong

  if (!playerId) {
    console.error("Player ID is missing. Ensure the player is registered.");
    return;
  }

  fetch("update_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId,
      gameId,
      playerScore: playerScore || 0, // Ensure 0 is sent if playerScore is 0
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.error("Failed to update score:", data.error);
      } else {
        console.log("Score updated successfully!");
      }
    })
    .catch((error) => {
      console.error("Error updating score:", error);
    });
}

// Event listeners
resetButton.addEventListener("click", resetGame);
quitButton.addEventListener("click", () => {
  updatePlayerScore(playerScore); // Update database with final scores
  const message = "Game Quit!";
  showPopup(playerScore, cpuScore, message);
});

// Redirect to main page
redirectButton.addEventListener("click", () => {
  window.location.href = "index.html"; // Ensure "index.html" exists in the same directory
});

// Initialize game
initializeGame();

