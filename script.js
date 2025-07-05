// Word list with hints
const words = [
  { word: "script", hint: "Text written for a play, movie, or code" },
  { word: "oxygen", hint: "Gas we need to breathe" },
  { word: "baggage", hint: "Luggage you take on a trip" },
  { word: "disguise", hint: "Something worn to hide identity" },
  { word: "journey", hint: "A long trip" },
  { word: "rhythm", hint: "A repeated pattern of sound or movement" },
  { word: "awkward", hint: "Uncomfortable or strange situation" },
  { word: "justice", hint: "Fair treatment under the law" },
  { word: "glimmer", hint: "A faint light or idea" },
  { word: "fracture", hint: "A broken bone or object" },
  { word: "mystery", hint: "Something difficult to explain or understand" },
  { word: "bizarre", hint: "Very strange or unusual" },
  { word: "gallery", hint: "Place where art is shown" },
  { word: "journal", hint: "Daily written record or notebook" },
  { word: "kingdom", hint: "A country ruled by a king or queen" },
  { word: "vulture", hint: "A bird that feeds on dead animals" },
  { word: "trouble", hint: "Difficulty or problem" },
  { word: "beneath", hint: "Under something" },
  { word: "remains", hint: "What is left after something is gone or dead" },
  { word: "horizon", hint: "Where the earth meets the sky" },
  { word: "absence", hint: "The state of being away" },
  { word: "network", hint: "A system of connected things or people" },
  { word: "exhaust", hint: "To make someone very tired" },
  { word: "midnight", hint: "Twelve o'clock at night" },
  { word: "silence", hint: "The complete lack of sound" },
  { word: "capture", hint: "To take someone or something by force" },
  { word: "foreign", hint: "From another country" },
  { word: "whistle", hint: "A high sound made with the lips or tool" },
  { word: "gravity", hint: "The force that pulls things toward Earth" },
  { word: "justice", hint: "Moral rightness or fairness" },
  { word: "remorse", hint: "Deep regret for wrongdoing" },
  { word: "strange", hint: "Unusual or surprising" },
  { word: "whisper", hint: "To speak very softly" },
  { word: "balance", hint: "To keep steady or equal" },
  { word: "curtain", hint: "Fabric that covers a window or stage" },
  { word: "rescue", hint: "To save someone from danger" },
  { word: "gallery", hint: "A place that shows art" },
  { word: "fortune", hint: "Great wealth or luck" },
  { word: "beneath", hint: "In a lower position" },
  { word: "respect", hint: "A feeling of deep admiration" },
  { word: "ancient", hint: "Very old, from a long time ago" },
  { word: "harvest", hint: "The act of gathering crops" },
  { word: "volcano", hint: "A mountain that erupts with lava" },
  { word: "monster", hint: "A scary, often imaginary creature" },
  { word: "predict", hint: "To say what will happen in the future" },
  { word: "absence", hint: "Being away or missing" },
  { word: "journey", hint: "Travel from one place to another" },
  { word: "lantern", hint: "A portable light source" }


];

let currentWord = "";
let currentHint = "";
let guessedLetters = new Set();
let wrongGuesses = new Set();
let gameOver = false;

// Define the order of hangman parts to be drawn for each wrong guess
const hangmanParts = [
    "pole", "beam", "rope", "head", "body", "left-arm", "right-arm", "left-leg", "right-leg"
];
const BASE_PART = "base"; // Always visible
const MAX_WRONG = hangmanParts.length;

function initializeGame() {
    guessedLetters.clear();
    wrongGuesses.clear();
    gameOver = false;

    // Select random word
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].word.toUpperCase();
    currentHint = words[randomIndex].hint;

    updateWordDisplay();
    updateWrongLetters();
    document.getElementById("hint").textContent = "Click 'Show Hint' to reveal";
    document.getElementById("hint-btn").textContent = "Show Hint";
    document.getElementById("message").textContent = "";
    document.getElementById("attempts").textContent = MAX_WRONG - wrongGuesses.size;
    document.getElementById("guess-input").disabled = false;
    document.getElementById("guess-btn").disabled = false;

    // Hide all hangman parts first
    [BASE_PART, ...hangmanParts].forEach(part => {
        const el = document.getElementById(part);
        if (el) el.classList.remove("visible");
    });
    // Show only the base
    const baseEl = document.getElementById(BASE_PART);
    if (baseEl) baseEl.classList.add("visible");

    document.getElementById("guess-input").focus();
}

function updateWordDisplay() {
    const wordDisplay = document.getElementById("word-display");
    wordDisplay.innerHTML = "";
    for (let letter of currentWord) {
        const letterBox = document.createElement("div");
        letterBox.className = "letter-box";
        if (guessedLetters.has(letter)) {
            letterBox.textContent = letter;
        }
        wordDisplay.appendChild(letterBox);
    }
}

function updateWrongLetters() {
    document.getElementById("wrong-letters").textContent = 
        wrongGuesses.size > 0 ? Array.from(wrongGuesses).join(", ") : "None";
    document.getElementById("attempts").textContent = MAX_WRONG - wrongGuesses.size;
}

function updateHangman() {
    // Show hangman parts based on number of wrong guesses
      const index= wrongGuesses.size -1;
      if(index >=0 && index < hangmanParts.length){
        const partID = hangmanParts[index];
        const partEL = document.getElementById(partID);
        if(partEL){
            partEL.classList.add("visible");
        }
      }
}

function checkWin() {
    for (let letter of currentWord) {
        if (!guessedLetters.has(letter)) {
            return false;
        }
    }
    return true;
}

function checkLose() {
    return wrongGuesses.size >= MAX_WRONG;
}

function revealWord() {
    const wordDisplay = document.getElementById("word-display");
    wordDisplay.innerHTML = "";
    for (let letter of currentWord) {
        const letterBox = document.createElement("div");
        letterBox.className = "letter-box";
        letterBox.textContent = letter;
        wordDisplay.appendChild(letterBox);
    }
}

function endGame(message, isWin) {
    gameOver = true;
    document.getElementById("guess-input").disabled = true;
    document.getElementById("guess-btn").disabled = true;

    // Hide default message
    document.getElementById("message").textContent = "";

    // Show modal
    const modal = document.getElementById("end-modal");
    modal.classList.remove("hidden");

    const title = document.getElementById("modal-title");
    const reason = document.getElementById("modal-reason");
    const wordEl = document.getElementById("modal-answer");
    const wrongs = document.getElementById("modal-wrongs");
    const modalBox = document.getElementById("modal-box");

    const winLines = [
        "Okay smarty pants, you guessed it. Happy now?",
        "You won. Brag responsibly.",
        "Wow, a whole word. Call MENSA.",
        "Unstoppable... at spelling basic words!",
        "That was impressive — in a very humblebrag kinda way.",
        "Big win for someone who thought 'Q' was in banana.",
  "Slow clap... real slow.",
  "Hangman just got played. Literally.",
  "You're now officially qualified to yell at spelling bees on TV.",
  "I hope you're adding this to your LinkedIn.",
  "Who knew all those years of texting paid off?",
  "Not all heroes wear capes. Some just guess letters.",
  "You defeated a bunch of underscores. Brave.",
  "Flexing over a 6-letter word? Bold move.",
  "You're basically the human version of autocorrect."
    ];

    const loseLines = [
        "Game Over. But hey, at least you tried. Kinda.",
        "So close... not really.",
        "If letters were grenades, you'd still miss.",
        "Maybe spelling just isn’t your thing?",
        "The word won. You didn’t.",
        "Your guesses had the accuracy of a drunk pigeon.",
  "Honestly... that was a massacre.",
  "Better luck next time. Or don't. Whatever.",
  "You spelled disaster flawlessly though.",
  "That was a bold attempt at... something.",
  "Wrong guesses: yes. Right guesses: let’s not talk about it.",
  "You gave it your best shot — and missed entirely.",
  "Let’s pretend this round never happened.",
  "So... should we just blame the keyboard?",
  "Hangman died. Again. Thanks to you."
    ];

    // Set content based on win/lose
    if (isWin) {
        title.textContent = "You Won! 🎉";
        reason.textContent = winLines[Math.floor(Math.random() * winLines.length)];
        revealWord();
        modalBox.classList.remove("lose");
        modalBox.classList.add("win");
    } else {
        title.textContent = "Game Over 😔";
        reason.textContent =loseLines[Math.floor(Math.random() * loseLines.length)];
        revealWord();
        modalBox.classList.remove("win");
        modalBox.classList.add("lose");
    }

    wordEl.textContent = currentWord;
    wrongs.textContent = wrongGuesses.size;
}


function makeGuess() {
    if (gameOver) return;
    const input = document.getElementById("guess-input");
    const guess = input.value.toUpperCase();
    input.value = "";
    if (!guess || !/^[A-Z]$/.test(guess)) {
        document.getElementById("message").textContent = "Please enter a single letter";
        return;
    }
    if (guessedLetters.has(guess) || wrongGuesses.has(guess)) {
        document.getElementById("message").textContent = "You already guessed that letter";
        return;
    }
    if (currentWord.includes(guess)) {
        guessedLetters.add(guess);
    } else {
        wrongGuesses.add(guess);
        updateHangman();
    }
    updateWordDisplay();
    updateWrongLetters();
    if (checkWin()) {
        endGame("Congratulations! You won!", true);
    } else if (checkLose()) {
        endGame(`Game Over! The word was ${currentWord}`, false);
    } else {
        document.getElementById("message").textContent = currentWord.includes(guess) ? "Correct guess!" : "Wrong guess!";
    }
}

function resetGame() {
   const modal = document.getElementById("end-modal");
    modal.classList.add("hidden");
    initializeGame();
}

document.getElementById("hint-btn").addEventListener("click", function() {
    if (!gameOver) {
        const hintElement = document.getElementById("hint");
        if (hintElement.textContent === "Click 'Show Hint' to reveal") {
            hintElement.textContent = currentHint;
            this.textContent = "Hide Hint";
        } else {
            hintElement.textContent = "Click 'Show Hint' to reveal";
            this.textContent = "Show Hint";
        }
    }
});

document.getElementById("guess-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        makeGuess();
    }
});

initializeGame();