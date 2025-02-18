// Array of history questions
const questions = [
  {
    question: "In which year did the signing of the Treaty of Versailles occur, officially ending World War I?",
    options: ["1918", "1919", "1920", "1921"],
    answer: 1
  },
  {
    question: "What is the name of the ancient trade route that connected China with the Mediterranean?",
    options: ["The Silk Road", "The Silk Route", "The Spice Route", "The Yellow Brick Road"],
    answer: 0
  },
  {
    question: "Which ancient city is known as the birthplace of democracy?",
    options: ["Athens", "Rome", "Sparta", "Babylon"],
    answer: 0
  },
  {
    question: "Fill in the blank: The Hanging Gardens of _____",
    options: ["Mesopotamia", "Flowers", "Athens", "Babylon"],
    answer: 3
  },
  {
    question: "What year did the Berlin Wall fall?",
    options: ["1982", "1989", "1984", "1976"],
    answer: 1
  },
  {
    question: "What empire was also known as the Eastern Roman Empire?",
    options: ["Greek", "Gothic", "Roman", "Byzantine"],
    answer: 3
  },
  {
    question: "Which country gifted the Statue of Liberty to the United States?",
    options: ["England", "France", "Germany", "Italy"],
    answer: 1
  },
  {
    question: "What year did the Titanic sink?",
    options: ["1902", "1912", "1922", "1932"],
    answer: 1
  },
  {
    question: "Which country was the first to grant women the right to vote?",
    options: ["New Zealand", "Canada", "Australia", "United Kingdom"],
    answer: 0
  },
  {
    question: "Which city was Canada’s capital before Ottawa?",
    options: ["Toronto", "Quebec City", "London", "Kingston"],
    answer: 3
  },
  {
    question: "In what year did Canada officially become a country?",
    options: ["1912", "1866", "1867", "1856"],
    answer: 2
  },
  {
    question: "In what year was the first version of HTML released?",
    options: ["1985", "1994", "1991", "1987"],
    answer: 2
  },
  {
    question: "Who was the first emperor of China?",
    options: ["Sun Yat-sen", "Confucius", "Liu Bang", "Qin Shi Huang"],
    answer: 3
  },
  {
    question: "Which event triggered the start of World War II?",
    options: ["The invasion of Poland", "The assassination of Archduke Ferdinand", "The bombing of Pearl Harbor", "The fall of Constantinople"],
    answer: 0
  },
  {
    question: "Who discovered penicillin in 1928?",
    options: ["Marie Curie", "Gregor Mendel", "Alexander Fleming", "Charles Best"],
    answer: 2
  },
  {
    question: "Which country hosted the first modern Olympic Games in 1896?",
    options: ["France", "United Kingdom", "Germany", "Greece"],
    answer: 3
  },
  {
    question: "Who was the first European to reach India by sea?",
    options: ["Vasco da Gama", "James Cook", "Christopher Columbus", "Marco Polo"],
    answer: 0
  },
  {
    question: "Who created the first website?",
    options: ["Steve Jobs", "Larry Page", "Tim Berners-Lee", "Vint Cerf"],
    answer: 2
  },
  {
    question: "What was the title of the first web page?",
    options: ["Welcome to the Web", "The World Wide Web Project", "Introduction to HTML", "Hello World"],
    answer: 1
  },
  {
    question: "What ancient civilization is credited with creating the first written code of laws?",
    options: ["Greeks", "Romans", "Egyptians", "Babylonians"],
    answer: 3
  }
];

let currentQuestionIndex = 0;
let score = 0;

// Function to shuffle questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Disable options initially when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = true));
});

// Start the game
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  shuffle(questions); // Shuffle the questions
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("start-btn").disabled = true;
  document.getElementById("feedback").textContent = "";

  // Enable the options
  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = false));

  showQuestion();
}

// Display a question
function showQuestion() {
  const questionObj = questions[currentQuestionIndex];
  document.getElementById("question").textContent = questionObj.question;

  const options = document.querySelectorAll(".option");
  options.forEach((btn, index) => {
    btn.textContent = questionObj.options[index];
    btn.disabled = false;
  });
}

// Handle option selection
function selectOption(selectedIndex) {
  const questionObj = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === questionObj.answer) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    feedback.textContent = "Correct!";
    feedback.style.color = "#32cd32";
  } else {
    feedback.textContent = `Wrong! Correct answer: "${questionObj.options[questionObj.answer]}"`;
    feedback.style.color = "#ff0000";
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setTimeout(() => {
      feedback.textContent = "";
      showQuestion();
    }, 2000);
  } else {
    setTimeout(endGame, 2000);
  }
}

function updatePlayerScore(playerId, gameId, score) {
    fetch('update_score.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            playerId: playerId, // The player's ID stored in localStorage
            gameId: gameId,     // The ID for this specific game
            score: score        // The final score
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Score updated successfully!');
        } else {
            console.error('Failed to update score:', data.error || 'Unknown error');
        }
    })
    .catch(error => {
        console.error('Error updating score:', error);
    });
}


// End the game
function endGame() {
  const playerId = localStorage.getItem('playerId'); // Ensure the player is registered
  const gameId = 11; // Replace with the actual game ID for History Trivia

  if (playerId) {
    updatePlayerScore(playerId, gameId, score); // Update the player's score in the database
  } else {
    console.error('Player ID is missing. Ensure the player is registered.');
  }

  // Create the modal
  const modal = document.createElement("div");
  modal.id = "endGameModal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  // Modal content
  const modalContent = document.createElement("div");
  modalContent.style.backgroundColor = "#fff";
  modalContent.style.padding = "20px";
  modalContent.style.borderRadius = "10px";
  modalContent.style.textAlign = "center";
  modalContent.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  modalContent.innerHTML = `
    <h2>Game Over!</h2>
    <p>Your final score is ${score}/${questions.length}.</p>
    <button id="backToMainBtn" style="padding: 10px 20px; background-color: #32cd32; border: none; color: white; border-radius: 5px; cursor: pointer;">Back to Main Page</button>
  `;

  // Add event listener to the button
  modalContent.querySelector("#backToMainBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Append content to the modal
  modal.appendChild(modalContent);

  // Append modal to the document body
  document.body.appendChild(modal);

  // Reset the question and options display
  document.getElementById("question").textContent = "";
  const options = document.querySelectorAll(".option");
  options.forEach((btn) => (btn.textContent = ""));
}
