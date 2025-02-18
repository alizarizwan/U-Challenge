const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20; // Size of each grid square
const canvasSize = canvas.width / boxSize; // Number of squares per row/column

let snake = [{ x: 10, y: 10 }]; // Snake starts in the middle
let food = { x: 15, y: 15 }; // Random initial food position
let direction = { x: 0, y: -1 }; // Start moving up
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from localStorage
let gameRunning = false; // Game only starts after pressing space bar
let gameInterval = null; // To control game loop
let tries = 10; // Number of tries remaining

// UI Updates
document.getElementById("high-score").textContent = `High Score: ${highScore}`;
document.getElementById("instructions").textContent = `Press Space Bar to Start. Tries Left: ${tries}`;
document.getElementById("controls").textContent = `Controls: W = Up, A = Left, S = Down, D = Right`;

// Quit button logic
document.getElementById("quitButton").addEventListener("click", () => {
  updatePlayerScore(score); // Update database with current score
  showEndGameModal("You quit the game!");
});

// Draw grid, snake, and food
function drawGrid() {
  ctx.fillStyle = "#34495e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

  // Draw snake
  ctx.fillStyle = "lime";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
  });
}

// Move snake and check for collisions
function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collisions
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    handleLoss();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    generateFood();
  } else {
    snake.pop();
  }
}

// Handle game loss
function handleLoss() {
  clearInterval(gameInterval); // Stop game loop
  gameRunning = false;

  tries--; // Reduce tries
  if (tries > 0) {
    document.getElementById("instructions").textContent = `Press Space Bar to Restart. Tries Left: ${tries}`;
    resetGame();
  } else {
    updatePlayerScore(score); // Update database with final score
    showEndGameModal("Game Over!");
  }
}

// Show game over modal
function showEndGameModal(message) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }

  // Update the player's score in the database
  updatePlayerScore(score);

  // Show the game-over modal
  document.querySelector(".modal-content h2").textContent = message;
  document.getElementById("finalScore").textContent = score;
  document.getElementById("endGameModal").style.display = "flex";
}

// Reset game state
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: -1 };
  score = 0;
  document.getElementById("score").textContent = `Score: 0`;
  generateFood();
  drawGrid();
}

// Generate new food position
function generateFood() {
  food = {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
  };
  // Ensure food doesn't spawn on the snake
  if (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
    generateFood();
  }
}

// Update the player's score in the database
function updatePlayerScore(score) {
  const playerId = localStorage.getItem("playerId");
  const gameId = 5; // Replace with the actual ID for the Snake game

  if (playerId) {
    fetch("update_score.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, gameId, score }),
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
  } else {
    console.error("Player ID is missing. Ensure the player is registered.");
  }
}

// Listen for game start and direction change
document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();

  // Start game on space bar press
  if (!gameRunning && key === " ") {
    gameRunning = true;
    document.getElementById("instructions").textContent = ""; // Clear instructions
    gameInterval = setInterval(() => {
      moveSnake();
      drawGrid();
    }, 150);
  }

  // Control snake direction
  if (key === "w" && direction.y === 0) direction = { x: 0, y: -1 };
  if (key === "a" && direction.x === 0) direction = { x: -1, y: 0 };
  if (key === "s" && direction.y === 0) direction = { x: 0, y: 1 };
  if (key === "d" && direction.x === 0) direction = { x: 1, y: 0 };
});

// Handle form submission (end game)
document.getElementById("endGameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = "index.html"; // Redirect to main page
});

// Draw the initial grid
drawGrid();
