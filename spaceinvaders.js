const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match the container size
canvas.width = 600;
canvas.height = 700;

let score = 0;
let lives = 3;
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

// Classes
class Player {
    constructor() {
        this.width = 50;
        this.height = 30;
        this.position = {
            x: canvas.width / 2 - this.width / 2,
            y: canvas.height - this.height - 20,
        };
        this.velocity = {
            x: 0,
        };
    }

    draw() {
        ctx.fillStyle = 'cyan';
        ctx.shadowColor = 'cyan';
        ctx.shadowBlur = 15;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }

    update() {
        this.position.x += this.velocity.x;
        if (this.position.x < 0) this.position.x = 0;
        if (this.position.x + this.width > canvas.width)
            this.position.x = canvas.width - this.width;

        this.draw();
    }
}

class Projectile {
    constructor(x, y, velocityY) {
        this.position = { x, y };
        this.velocity = { y: velocityY };
        this.radius = 5;
    }

    draw(color = 'lime') {
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }

    update() {
        this.position.y += this.velocity.y;
        this.draw(this.velocity.y < 0 ? 'lime' : 'red');
    }
}

class Invader {
    constructor(x, y) {
        this.width = 40;
        this.height = 30;
        this.position = { x, y };
        this.velocity = { x: 2, y: 0 };
    }

    draw() {
        ctx.fillStyle = 'magenta';
        ctx.shadowColor = 'magenta';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y + this.height);
        ctx.lineTo(this.position.x + this.width / 2, this.position.y);
        ctx.lineTo(this.position.x + this.width, this.position.y + this.height);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    update() {
        this.position.x += this.velocity.x;
        this.draw();
    }

    shoot(alienProjectiles) {
        if (Math.random() < 0.01) {
            alienProjectiles.push(
                new Projectile(
                    this.position.x + this.width / 2,
                    this.position.y + this.height,
                    5 // Downward speed for alien projectiles
                )
            );
        }
    }
}

// Game Elements
const player = new Player();
const projectiles = [];
const alienProjectiles = [];
const invaders = [];

function createInvaders() {
    const rows = Math.floor(Math.random() * 3) + 1;
    const cols = Math.floor(Math.random() * 11) + 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            invaders.push(new Invader(60 + col * 50, 50 + row * 50));
        }
    }
}
createInvaders();

// Input Handling
const keys = {
    a: false,
    d: false,
    Space: false,
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'a') keys.a = true;
    if (event.key === 'd') keys.d = true;
    if (event.key === ' ') {
        keys.Space = true;
        projectiles.push(
            new Projectile(
                player.position.x + player.width / 2,
                player.position.y,
                -7
            )
        );
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'a') keys.a = false;
    if (event.key === 'd') keys.d = false;
    if (event.key === ' ') keys.Space = false;
});

// Update Database with Player Score
function updateDatabase(score) {
    const playerId = localStorage.getItem('playerId');
    const gameId = 14; // Replace with the Space Invaders game ID

    if (playerId) {
        fetch('update_score.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId, gameId, score }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (!data.success) {
                    console.error('Failed to update score:', data.error);
                } else {
                    console.log('Score updated successfully!');
                }
            })
            .catch((error) => {
                console.error('Error updating score:', error);
            });
    } else {
        console.error('Player ID is missing. Ensure the player is registered.');
    }
}

// Game Over Popup
function showGameOverPopup() {
    updateDatabase(score); // Update database when the game ends

    const overlay = document.createElement('div');
    overlay.id = 'game-over-overlay';
    overlay.innerHTML = `
      <div id="game-over-popup">
        <h2>Game Over!</h2>
        <p>Your score: ${score}</p>
        <button id="go-to-main">Go to Main Page</button>
      </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('go-to-main').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.a) player.velocity.x = -7;
    else if (keys.d) player.velocity.x = 7;
    else player.velocity.x = 0;

    player.update();

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius < 0) {
            projectiles.splice(index, 1);
        } else {
            projectile.update();
        }
    });

    alienProjectiles.forEach((alienProjectile, index) => {
        if (alienProjectile.position.y - alienProjectile.radius > canvas.height) {
            alienProjectiles.splice(index, 1);
        } else {
            alienProjectile.update();

            if (
                alienProjectile.position.x > player.position.x &&
                alienProjectile.position.x < player.position.x + player.width &&
                alienProjectile.position.y > player.position.y &&
                alienProjectile.position.y < player.position.y + player.height
            ) {
                alienProjectiles.splice(index, 1);
                lives--;
                livesElement.textContent = lives;

                if (lives <= 0) {
                    showGameOverPopup();
                    cancelAnimationFrame(animationId);
                }
            }
        }
    });

    invaders.forEach((invader, i) => {
        invader.update();
        invader.shoot(alienProjectiles);

        projectiles.forEach((projectile, j) => {
            if (
                projectile.position.x > invader.position.x &&
                projectile.position.x < invader.position.x + invader.width &&
                projectile.position.y > invader.position.y &&
                projectile.position.y < invader.position.y + invader.height
            ) {
                setTimeout(() => {
                    invaders.splice(i, 1);
                    projectiles.splice(j, 1);
                    score += 10;
                    scoreElement.textContent = score;

                    if (invaders.length === 0) {
                        createInvaders();
                    }
                }, 0);
            }
        });

        if (
            invader.position.x + invader.width >= canvas.width ||
            invader.position.x <= 0
        ) {
            invader.velocity.x *= -1;
            invader.position.y += 30;
        }
    });

    requestAnimationFrame(animate);
}

animate();
