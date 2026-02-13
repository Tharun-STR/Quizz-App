let timeLeft = 10;
let timerId;

const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Text Machine Language",
            "Hyperlinks and Text Markup Language",
            "Home Tool Markup Language"
        ],
        correctAnswer: 0
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "JQuery", "CSS", "XML"],
        correctAnswer: 2
    },
    {
        question: "Which is not a JavaScript data type?",
        options: ["Number", "String", "Boolean", "Character"],
        correctAnswer: 3
    },
    {
        question:"Which company developed JavaScript?",
        options: ["Netscape", "Bell Labs", "Sun Microsystems", "IBM"],
        correctAnswer: 0

    },
    {
        question: "Which symbol is used for comments in JavaScript?",
        options: ["//", "/* */", "#", "<!-- -->"],
        correctAnswer: 0
    },
    { 
        question: "What is the output of 'typeof null' in JavaScript?",
        options: ["object", "null", "undefined", "boolean"],
        correctAnswer: 0    

    },
    {
        question: "Which method is used to add an element at the end of an array in JavaScript?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: 0
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionContainer = document.getElementById("question-container");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("nextBtn");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const correctSound= new Audio("sounds/correct.mp3");
const wrongSound= new Audio("sounds/error.mp3");
const timeoutSound= new Audio("sounds/timeout.mp3");
const clickSound= new Audio("sounds/click.mp3");
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.textContent = "🌞";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌞";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "🌙";
    }
});




function startTimer() {
    timeLeft = 10;
    timerDisplay.textContent = `Time left: ${timeLeft}s`;

    timerId = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timerId);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    timeoutSound.play();
    const allButtons = optionsContainer.querySelectorAll("button");

    allButtons.forEach((button, index) => {
        button.disabled = true;

        // if (index === questions[currentQuestionIndex].correctAnswer) {
        //     button.style.backgroundColor = "green";
        // }
    });
    setTimeout(() => {
        nextBtn.click();
    }, 1000);
}

function showQuestion() {
    clearInterval(timerId);
    startTimer();

    const currentQuestion = questions[currentQuestionIndex];
    questionContainer.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.textContent = option;

        btn.addEventListener("click", () => {
            clearInterval(timerId);

            const allButtons = optionsContainer.querySelectorAll("button");

            allButtons.forEach((button, btnIndex) => {
                button.disabled = true;

                if (btnIndex === currentQuestion.correctAnswer) {
                    button.style.backgroundColor = "green";
                }
            });

            if (index === currentQuestion.correctAnswer) {
                score++;
                correctSound.play();
            } else {
                btn.style.backgroundColor = "red";
                wrongSound.play();
            }
        });

        optionsContainer.appendChild(btn);
    });
}

function showScore() {
    questionContainer.textContent = "Quiz Finished! 🎉";
    optionsContainer.innerHTML = "";
    nextBtn.style.display = "none";
    restartBtn.style.display = "inline-block";

    const scoreText = document.createElement("h2");
    scoreText.textContent = `Your Score: ${score}/${questions.length}`;
    optionsContainer.appendChild(scoreText);

    const badge = document.createElement("div");
    badge.className = "badge";  
    if (score === questions.length) {
        badge.textContent = "🥇 Master Level!";
    }else if(score >= questions.length-1){
        badge.textContent = "🥈 Pro Level!";
    }else if(score >= questions.length/2){
        badge.textContent = "🥉 Intermediate!";
    }else{
        badge.textContent = "Keep Practicing!";
    }
    
optionsContainer.appendChild(badge);



    launchConfetti();

}
function launchConfetti(count = 80) {
    const confettiContainer = document.getElementById("confetti");

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";

        // random styles
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.backgroundColor = randomColor();
        piece.style.animationDuration = 2 + Math.random() * 2 + "s";
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;

        confettiContainer.appendChild(piece);

        // cleanup
        setTimeout(() => piece.remove(), 4000);
    }
}

function randomColor() {
    const colors = ["#ff4d4d", "#ffd633", "#4dff88", "#4dd2ff", "#b84dff"];
    return colors[Math.floor(Math.random() * colors.length)];
}


nextBtn.addEventListener("click", () => {
    clickSound.play();
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});
restartBtn.addEventListener("click", () => {
    clickSound.play();
    currentQuestionIndex = 0;
    score = 0;

    restartBtn.style.display = "none";
    nextBtn.style.display = "inline-block";

    showQuestion();
});




showQuestion();

