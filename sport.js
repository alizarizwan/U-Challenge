// Sports Trivia Questions
const questions = [
  {
    question: "What is the only country to have played in every single FIFA World Cup?",
    options: ["Germany", "Brazil", "Italy", "Argentina"],
    answer: 1
  },
  {
    question: "In what year were the first modern Olympic Games held?",
    options: ["1900", "1896", "1888", "1912"],
    answer: 1
  },
  {
    question: "What sport is known as 'America’s pastime'?",
    options: ["Basketball", "Football", "Baseball", "Hockey"],
    answer: 2
  },
  {
    question: "How many players are there on a soccer team on the field during a match?",
    options: ["10", "12", "11", "9"],
    answer: 2
  },
  {
    question: "Which athlete has won the most Olympic medals in history?",
    options: ["Usain Bolt", "Carl Lewis", "Michael Phelps", "Mark Spitz"],
    answer: 2
  },
  {
    question: "In which sport would you perform a 'slam dunk'?",
    options: ["Baseball", "Basketball", "Volleyball", "Football"],
    answer: 1
  },
  {
    question: "What is the maximum score possible in a single game of bowling?",
    options: ["200", "250", "300", "350"],
    answer: 2
  },
  {
    question: "What is the name of Canada’s professional basketball team?",
    options: ["Toronto Raptors", "Vancouver Grizzlies", "Montreal Moose", "Ottawa Owls"],
    answer: 0
  },
  {
    question: "Who is considered 'The Great One' in hockey?",
    options: ["Gordie Howe", "Wayne Gretzky", "Bobby Orr", "Mario Lemieux"],
    answer: 1
  },
  {
    question: "Which city hosted the Winter Olympics in Canada in 2010?",
    options: ["Calgary", "Vancouver", "Montreal", "Toronto"],
    answer: 1
  },
  {
    question: "What is the name of the Canadian Football League’s championship trophy?",
    options: ["Stanley Cup", "Grey Cup", "Canada Bowl", "Dominion Cup"],
    answer: 1
  },
  {
    question: "Which country has the most Olympic gold medals in swimming?",
    options: ["China", "United States", "Australia", "Russia"],
    answer: 1
  },
  {
    question: "What is the maximum score a gymnast can achieve in a single routine?",
    options: ["9.5", "10.0", "12.0", "15.0"],
    answer: 1
  },
  {
    question: "In basketball, how many players from each team are on the court at one time?",
    options: ["4", "5", "6", "7"],
    answer: 1
  },
  {
    question: "What does MLB stand for in professional sports?",
    options: ["Major League Baseball", "Mountain League Basketball", "Minor League Bowling", "Midwest Lacrosse Bureau"],
    answer: 0
  },
  {
    question: "What is the length of a marathon race?",
    options: ["26 miles", "26.2 miles", "24.5 miles", "27.1 miles"],
    answer: 1
  },
  {
    question: "What is the national sport of Japan?",
    options: ["Karate", "Baseball", "Sumo Wrestling", "Judo"],
    answer: 2
  },
  {
    question: "What is the term used in golf for scoring three under par on a single hole?",
    options: ["Eagle", "Albatross", "Birdie", "Bogey"],
    answer: 1
  },
  {
    question: "How many players are on a rugby union team?",
    options: ["11", "13", "15", "18"],
    answer: 2
  },
  {
    question: "What is the oldest active trophy in North American professional sports?",
    options: ["Vince Lombardi Trophy", "Stanley Cup", "Larry O'Brien Trophy", "Commissioner's Trophy"],
    answer: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;

// Shuffle the questions
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
    feedback.style.color = "#32cd32"; // Green for correct
  } else {
    feedback.textContent = `Wrong! Correct answer: "${questionObj.options[questionObj.answer]}"`;
    feedback.style.color = "#ff0000"; // Red for wrong
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
    const gameId = 2; // Replace with the actual game ID for Sports Trivia

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
        <p>Your final score is ${score}/${questions.length}.</p>
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
