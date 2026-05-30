// =========================================
// quiz.js
// SMART LEARNING PORTAL QUIZ SYSTEM
// =========================================

// =========================================
// QUIZ QUESTIONS
// =========================================

const quizQuestions = [
    {
        question: "What does DOM stand for?",
        options: [
            "Document Object Model",
            "Data Object Method",
            "Digital Ordinance Model",
            "Desktop Object Management"
        ],
        answer: "Document Object Model"
    },
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: [
            "var",
            "let",
            "const",
            "All of the above"
        ],
        answer: "All of the above"
    },
    {
        question: "Which method is used to select an element by ID?",
        options: [
            "querySelector()",
            "getElementById()",
            "getElementsByClassName()",
            "querySelectorAll()"
        ],
        answer: "getElementById()"
    },
    {
        question: "What is the output type of localStorage data?",
        options: [
            "Number",
            "Boolean",
            "String",
            "Array"
        ],
        answer: "String"
    },
    {
        question: "Which symbol is used for strict equality?",
        options: [
            "=",
            "==",
            "===",
            "!=="
        ],
        answer: "==="
    },
    {
        question: "Which Bootstrap class creates a responsive grid row?",
        options: [
            ".container",
            ".row",
            ".grid",
            ".col"
        ],
        answer: ".row"
    },
    {
        question: "Which event occurs when a button is clicked?",
        options: [
            "hover",
            "submit",
            "click",
            "change"
        ],
        answer: "click"
    },
    {
        question: "Which JavaScript method converts JSON into an object?",
        options: [
            "JSON.stringify()",
            "JSON.parse()",
            "JSON.convert()",
            "JSON.object()"
        ],
        answer: "JSON.parse()"
    },
    {
        question: "Which CSS property is used for Flexbox layout?",
        options: [
            "display: block",
            "display: grid",
            "display: flex",
            "position: flex"
        ],
        answer: "display: flex"
    },
    {
        question: "Which function runs code after a delay?",
        options: [
            "setTimeout()",
            "setInterval()",
            "delay()",
            "timer()"
        ],
        answer: "setTimeout()"
    }
];

// =========================================
// DOM ELEMENTS
// =========================================

const questionNumber = document.getElementById("questionNumber");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById("previousBtn");
const submitBtn = document.getElementById("submitBtn");
const progressBar = document.getElementById("progressBar");
const timer = document.getElementById("timer");
const resultCard = document.getElementById("resultCard");
const scoreText = document.getElementById("scoreText");
const performanceText = document.getElementById("performanceText");
const restartBtn = document.getElementById("restartBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

// =========================================
// QUIZ VARIABLES
// =========================================

let currentQuestion = 0;
let score = 0;
let timeLeft = 600;

let selectedAnswers =
    JSON.parse(
        localStorage.getItem(
            "savedQuizAnswers"
        )
    ) || [];

let countdownInterval;

// =========================================
// LOAD QUESTION
// =========================================

function loadQuestion() {

    const currentQuiz =
        quizQuestions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    questionText.textContent =
        currentQuiz.question;

    optionsContainer.innerHTML = "";

    currentQuiz.options.forEach(
        (option, index) => {

            const optionBtn =
                document.createElement("button");

            optionBtn.type = "button";

            optionBtn.className =
                "option-btn";

            optionBtn.innerHTML = `
                <span class="option-letter">
                    ${String.fromCharCode(65 + index)}
                </span>

                <span class="option-text">
                    ${option}
                </span>
            `;

            if (
                selectedAnswers[currentQuestion] === option
            ) {
                optionBtn.classList.add(
                    "selected"
                );
            }

            optionBtn.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".option-btn")
                        .forEach(btn => {
                            btn.classList.remove(
                                "selected"
                            );
                        });

                    optionBtn.classList.add(
                        "selected"
                    );

                    selectedAnswers[currentQuestion] =
                        option;

                    saveAnswers();
                }
            );

            optionsContainer.appendChild(
                optionBtn
            );
        }
    );

    updateButtons();
    updateProgressBar();
}

// =========================================
// SAVE ANSWERS
// =========================================

function saveAnswers() {

    localStorage.setItem(
        "savedQuizAnswers",
        JSON.stringify(
            selectedAnswers
        )
    );
}

// =========================================
// UPDATE BUTTONS
// =========================================

function updateButtons() {

    previousBtn.disabled =
        currentQuestion === 0;

    if (
        currentQuestion ===
        quizQuestions.length - 1
    ) {

        nextBtn.classList.add(
            "d-none"
        );

        submitBtn.classList.remove(
            "d-none"
        );

    } else {

        nextBtn.classList.remove(
            "d-none"
        );

        submitBtn.classList.add(
            "d-none"
        );
    }
}

// =========================================
// UPDATE PROGRESS BAR
// =========================================

function updateProgressBar() {

    const progress =
        ((currentQuestion + 1)
            / quizQuestions.length) * 100;

    progressBar.style.width =
        `${progress}%`;
}

// =========================================
// NEXT BUTTON
// =========================================

nextBtn.addEventListener(
    "click",
    () => {

        if (
            currentQuestion <
            quizQuestions.length - 1
        ) {

            currentQuestion++;

            loadQuestion();
        }
    }
);

// =========================================
// PREVIOUS BUTTON
// =========================================

previousBtn.addEventListener(
    "click",
    () => {

        if (
            currentQuestion > 0
        ) {

            currentQuestion--;

            loadQuestion();
        }
    }
);

// =========================================
// SUBMIT QUIZ
// =========================================

submitBtn.addEventListener(
    "click",
    submitQuiz
);

function submitQuiz() {

    score = 0;

    quizQuestions.forEach(
        (question, index) => {

            if (
                selectedAnswers[index] ===
                question.answer
            ) {
                score++;
            }
        }
    );

    document
        .querySelector(".quiz-card")
        .classList.add("d-none");

    resultCard.classList.remove(
        "d-none"
    );

    scoreText.textContent =
        `Your Score: ${score}/${quizQuestions.length}`;

    if (score >= 8) {

        performanceText.textContent =
            "Excellent Performance 🔥";

    } else if (score >= 5) {

        performanceText.textContent =
            "Good Job 👍";

    } else {

        performanceText.textContent =
            "Keep Practicing 📚";
    }

    localStorage.setItem(
        "latestQuizScore",
        score
    );

    clearInterval(
        countdownInterval
    );

    showToast(
        "Quiz Submitted Successfully!"
    );
}

// =========================================
// RESTART QUIZ
// =========================================

restartBtn.addEventListener(
    "click",
    () => {

        currentQuestion = 0;
        score = 0;
        timeLeft = 600;
        selectedAnswers = [];

        localStorage.removeItem(
            "savedQuizAnswers"
        );

        resultCard.classList.add(
            "d-none"
        );

        document
            .querySelector(".quiz-card")
            .classList.remove(
                "d-none"
            );

        loadQuestion();
        startTimer();
    }
);

// =========================================
// TIMER SYSTEM
// =========================================

function startTimer() {

    clearInterval(
        countdownInterval
    );

    countdownInterval =
        setInterval(() => {

            const minutes =
                Math.floor(
                    timeLeft / 60
                );

            const seconds =
                timeLeft % 60;

            timer.textContent =
                `${minutes}:${seconds
                    .toString()
                    .padStart(2, "0")}`;

            if (timeLeft <= 60) {

                timer.style.color =
                    "#ef4444";
            }

            if (timeLeft <= 0) {

                clearInterval(
                    countdownInterval
                );

                submitQuiz();
            }

            timeLeft--;

        }, 1000);
}

// =========================================
// TOAST MESSAGE
// =========================================

function showToast(message) {

    const toast =
        document.createElement("div");

    toast.className =
        "quiz-toast";

    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        ${message}
    `;

    document.body.appendChild(
        toast
    );

    setTimeout(() => {
        toast.classList.add(
            "show"
        );
    }, 100);

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

        setTimeout(() => {
            toast.remove();
        }, 500);

    }, 3000);
}

// =========================================
// DARK MODE
// =========================================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add(
        "dark-mode"
    );
}

if (darkModeToggle) {

    darkModeToggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );

            localStorage.setItem(
                "theme",
                document.body.classList.contains(
                    "dark-mode"
                )
                    ? "dark"
                    : "light"
            );
        }
    );
}

// =========================================
// KEYBOARD NAVIGATION
// =========================================

document.addEventListener(
    "keydown",
    e => {

        if (
            e.key === "ArrowRight"
        ) {
            nextBtn.click();
        }

        if (
            e.key === "ArrowLeft"
        ) {
            previousBtn.click();
        }
    }
);

// =========================================
// AUTO SAVE
// =========================================

setInterval(
    saveAnswers,
    5000
);

// =========================================
// INITIALIZE QUIZ
// =========================================

function initializeQuiz() {

    console.log(
        "Smart Learning Quiz Initialized"
    );

    loadQuestion();
    startTimer();
}

initializeQuiz();