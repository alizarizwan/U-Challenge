// script.js
// Array of questions
const questions = [
  {
    question: "Who was the first Prime Minister of Canada?",
    options: ["Sir John A. Macdonald", "Wilfred Laurier", "Alexander Mackenzie", "Robert Borden"],
    answer: 0
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Mars", "Jupiter", "Venus", "Saturn"],
    answer: 1
  },
  {
    question: "Which of the following is not a capital city?",
    options: ["Kinshasa", "Athens", "São Paulo", "Tokyo"],
    answer: 2
  },
  {
    question: "What is amaxophobia a fear of?",
    options: ["Heights", "Darkness", "Sharp objects", "Vehicles"],
    answer: 3
  },
  {
    question: "What is the official language of the United States of America?",
    options: ["English", "None", "American", "Spanish"],
    answer: 1
  },
  {
    question: "What is a word, phrase, or number that reads the same backward as forward?",
    options: ["Simile", "Onomatopoeia", "Acronym", "Palindrome"],
    answer: 3
  },
  {
    question: "Which of the following is not a Great Lake?",
    options: ["Erie", "Ontario", "Michigan", "Simcoe"],
    answer: 3
  },
  {
    question: "How many stars are on the Chinese flag?",
    options: ["4", "5", "6", "10"],
    answer: 1
  },
  {
    question: "What is the newest country in the world?",
    options: ["South Sudan", "West Virginia", "Equatorial Guinea", "Montenegro"],
    answer: 0
  },
  {
    question: "Where is the Chernobyl nuclear plant located?",
    options: ["Russia", "Ukraine", "Poland", "Japan"],
    answer: 1
  },
  {
    question: "Which is the largest continent by area?",
    options: ["Africa", "Asia", "North America", "Antarctica"],
    answer: 1
  },
  {
    question: "Who was the first person to step on the Moon?",
    options: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
    answer: 1
  },
  {
    question: "Which language has the most native speakers worldwide?",
    options: ["English", "Spanish", "Hindi", "Mandarin Chinese"],
    answer: 3
  },
  {
    question: "Which is the tallest mountain in the world?",
    options: ["K2", "Mount Everest", "Kangchenjunga", "Mount Kilimanjaro"],
    answer: 1
  },
  {
    question: "What is the national currency of Japan?",
    options: ["Yen", "Won", "Yuan", "Ringgit"],
    answer: 0
  },
  {
    question: "What is the main ingredient in guacamole?",
    options: ["Tomato", "Avocado", "Cucumber", "Olive"],
    answer: 1
  },
  {
    question: "What is the name of the current King of the United Kingdom?",
    options: ["King Charles III", "King William V", "King Edward IX", "King George VIII"],
    answer: 0
  },
  {
    question: "Which country gifted the Statue of Liberty to the United States?",
    options: ["France", "United Kingdom", "Germany", "Italy"],
    answer: 0
  },
  {
    question: "What is the largest desert in the world?",
    options: ["Sahara Desert", "Arabian Desert", "Gobi Desert", "Antarctic Desert"],
    answer: 3
  },
  {
    question: "Who discovered penicillin?",
    options: ["Alexander Fleming", "Marie Curie", "Louis Pasteur", "Joseph Lister"],
    answer: 0
  }
];

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = []; // This will hold the shuffled questions

// Function to shuffle questions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start the game
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  shuffledQuestions = [...questions]; // Create a copy of the questions array
  shuffle(shuffledQuestions); // Shuffle the questions
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("start-btn").disabled = true;
  document.getElementById("feedback").textContent = "";
  showQuestion();
}

// Display a question
function showQuestion() {
  const questionObj = shuffledQuestions[currentQuestionIndex];
  document.getElementById("question").textContent = questionObj.question;

  const options = document.querySelectorAll(".option");
  options.forEach((btn, index) => {
    btn.textContent = questionObj.options[index];
    btn.disabled = false;
  });
}

// Handle option selection
function selectOption(selectedIndex) {
  const questionObj = shuffledQuestions[currentQuestionIndex];
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
  if (currentQuestionIndex < shuffledQuestions.length) {
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
    const gameId = 4; // Replace with the actual game ID for General Knowledge Trivia

    if (playerId) {
        updatePlayerScore(playerId, gameId, score); // Update the player's score in the database
    } else {
        console.error('Player ID is missing. Ensure the player is registered.');
    }

    // Create the popup modal
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';

    // Create the modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '10px';
    modalContent.style.textAlign = 'center';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    modalContent.innerHTML = `
        <h2>Game Over!</h2>
        <p>Your final score is ${score}/${shuffledQuestions.length}.</p>
        <button id="redirectToMainBtn" style="padding: 10px 20px; background-color: #007bff; border: none; color: white; border-radius: 5px; cursor: pointer;">Back to Main Page</button>
    `;

    // Add the button functionality
    const redirectButton = modalContent.querySelector('#redirectToMainBtn');
    redirectButton.addEventListener('click', () => {
        window.location.href = 'index.html'; // Replace with the actual URL of your main page
    });

    modal.appendChild(modalContent);

    // Append the modal to the document body
    document.body.appendChild(modal);

    // Disable the game controls
    document.getElementById("start-btn").disabled = false;
    document.getElementById("question").textContent = "Press 'Start' to play again!";
    const options = document.querySelectorAll(".option");
    options.forEach((btn) => (btn.textContent = ""));
}
