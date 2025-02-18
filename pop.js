// Pop Culture Trivia Questions
const questions = [
  {
    question: "Who sings the hit song 'Bad Guy'?",
    options: ["Billie Eilish", "Taylor Swift", "Ariana Grande", "Doja Cat"],
    answer: 0
  },
  {
    question: "What social media app became famous for short, dance-based videos?",
    options: ["Snapchat", "Instagram", "Vine", "TikTok"],
    answer: 3
  },
  {
    question: "Which TV show holds the record for most Emmy Awards?",
    options: ["Game of Thrones", "Friends", "The Simpsons", "Breaking Bad"],
    answer: 0
  },
  {
    question: "Which album broke Spotify’s record for most streams in a single day upon release in 2022?",
    options: ["Harry's House by Harry Styles", "Midnights by Taylor Swift", "Certified Lover Boy by Drake", "Sour by Olivia Rodrigo"],
    answer: 1
  },
  {
    question: "In the Marvel cinematic universe, what is the real name of the superhero Iron Man?",
    options: ["Steve Rogers", "Bruce Wayne", "Tony Stark", "Peter Parker"],
    answer: 2
  },
  {
    question: "What 2023 viral internet meme references a dramatic statement made by actor Pedro Pascal eating a sandwich?",
    options: ["The Pascal Sandwich", "Eat It Challenge", "The Red Flag Meme", "The Pedro Pascal Lunch Break"],
    answer: 3
  },
  {
    question: "Which movie features the son 'Let It Go'?",
    options: ["Frozen", "Moana", "Tangled", "Coco"],
    answer: 0
  },
  {
    question: "Which actress won an Oscar for her role in 'La La Land'?",
    options: ["Jennifer Lawrence", "Emma Stone",  "Anne Hathaway", "Natalie Portman"],
    answer: 1
  },
  {
    question: "What is the longest-running animated TV show in U.S. history?",
    options: ["Family Guy", "The Flintstones", "The Simpsons", "South Park"],
    answer: 2
  },
  {
    question: "What is the name of the band that Beyoncé was a part of before her solo career?",
    options: ["Spice Girls", "Destiny’s Child", "TLC", "Fifth Harmony"],
    answer: 1
  },
  {
    question: "Which reality TV show is famous for the Kardashian family?",
    options: ["The Real Housewives", "Keeping Up with the Kardashians", "Jersey Shore", "The Hills"],
    answer: 1
  },
  {
    question: "Who is the author of the 'Harry Potter' book series?",
    options: ["J.K. Rowling", "Suzanne Collins", "Rick Riordan", "George R.R. Martin"],
    answer: 0
  },
  {
    question: "Which pop star is known as the 'Queen of Pop'?",
    options: ["Beyoncé", "Madonna", "Lady Gaga", "Britney Spears"],
    answer: 1
  },
  {
    question: "Which movie franchise features a character named Katniss Everdeen?",
    options: ["Divergent", "The Hunger Games", "Maze Runner", "Twilight"],
    answer: 1
  },
  {
    question: "Which famous video game character is a plumber?",
    options: ["Sonic", "Mario", "Link", "Donkey Kong"],
    answer: 1
  },
  {
    question: "Which movie won Best Picture at the Oscars in 2020?",
    options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
    answer: 2
  },
  {
    question: "What is the name of the fictional town in 'Stranger Things'?",
    options: ["Hawkins", "Riverdale", "Mystic Falls", "Forks"],
    answer: 0
  },
  {
    question: "What is the name of the lead guitarist of the Rolling Stones?",
    options: ["Keith Richards", "Mick Jagger", "Eric Clapton", "Jimmy Page"],
    answer: 0
  },
  {
    question: "Which movie features the characters Woody and Buzz Lightyear?",
    options: ["Shrek", "Toy Story", "Monsters Inc.", "The Incredibles"],
    answer: 1
  },
  {
    question: "Which popular video game franchise includes titles like Vice City and San Andreas?",
    options: ["Call of Duty", "Grand Theft Auto", "Assassin’s Creed", "Red Dead Redemption"],
    answer: 1
  }
];

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];

// Shuffle Function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Start Game
function startGame() {
  score = 0;
  currentQuestionIndex = 0;
  shuffledQuestions = [...questions];
  shuffle(shuffledQuestions);
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("start-btn").disabled = true;
  document.getElementById("feedback").textContent = "";
  showQuestion();
}

// Display Question
function showQuestion() {
  const questionObj = shuffledQuestions[currentQuestionIndex];
  document.getElementById("question").textContent = questionObj.question;

  const options = document.querySelectorAll(".option");
  options.forEach((btn, index) => {
    btn.textContent = questionObj.options[index];
    btn.onclick = () => selectOption(index);
  });
}

// Handle Option Selection
function selectOption(selectedIndex) {
  const questionObj = shuffledQuestions[currentQuestionIndex];
  const feedback = document.getElementById("feedback");

  if (selectedIndex === questionObj.answer) {
    score++;
    feedback.textContent = "Correct!";
    feedback.style.color = "#ff69b4";

    // Update the score display
    document.getElementById("score").textContent = `Score: ${score}`;
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

function endGame() {
    const playerId = localStorage.getItem('playerId'); // Ensure the player is registered
    const gameId = 1; // Replace with the actual game ID for Pop Culture Trivia

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
        <p>Your final score is ${score}/${shuffledQuestions.length}.</p>
        <button id="backToMainBtn" style="padding: 10px 20px; background-color: #ff69b4; border: none; color: white; border-radius: 5px; cursor: pointer;">Back to Main Page</button>
    `;

    // Add event listener to the button
    modalContent.querySelector("#backToMainBtn").addEventListener("click", () => {
        window.location.href = "index.html"; // Replace with the actual URL of the main page
    });

    // Append content to the modal
    modal.appendChild(modalContent);

    // Append modal to the document body
    document.body.appendChild(modal);
}

