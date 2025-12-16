const startButton = document.getElementById('start-btn');
const savePdfButton = document.getElementById('save-pdf-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const progressBar = document.getElementById('progress-bar');
const finalScoreElement = document.getElementById('score');
const resultMessageElement = document.getElementById('result-message');

let currentQuestionIndex = 0;
let totalScore = 0;

// Data Pertanyaan: Setiap jawaban memiliki skor yang berbeda
const questions = [
    {
        question: "Merasa gelisah, cemas, atau amat tegang",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
    {
        question: "Tidak mampu menghentikan atau mengendalikan rasa khawatir",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
    {
        question: "Terlalu mengkhawatirkan berbagai hal",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
    {
        question: "Sulit untuk santai",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
    {
        question: "Sangat gelisah sehingga sulit untuk duduk diam",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
    {
        question: "Menjadi mudah jengkel atau lekas marah",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
    {
        question: "Merasa takut seolah-olah sesuatu yang mengerikan mungkin terjadi",
        answers: [
            { text: "Tidak pernah", score: 0 },
            { text: "Beberapa hari", score: 1 },
            { text: "Lebih dari separuh waktu", score: 2 },
            { text: "Hampir setiap hari", score: 3 }
        ]
    },
];

startButton.addEventListener('click', startGame);
savePdfButton.addEventListener('click', savePDF);

function startGame() {
    startScreen.classList.remove('active');
    startScreen.classList.add('hidden'); // Ensure hidden class is used
    startScreen.style.display = 'none'; // Explicit Force hide

    resultScreen.classList.remove('active');
    resultScreen.classList.add('hidden');
    resultScreen.style.display = 'none';

    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('active');
    quizScreen.style.display = 'block';

    currentQuestionIndex = 0;
    totalScore = 0;
    setNextQuestion();
    updateProgressBar();
}

function setNextQuestion() {
    resetState();
    showQuestion(questions[currentQuestionIndex]);
}

function showQuestion(question) {
    questionText.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn-answer');
        button.addEventListener('click', () => selectAnswer(button, answer.score));
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(selectedButton, score) {
    totalScore += score;

    // Visual feedback
    const allButtons = answerButtonsElement.children;
    for (let btn of allButtons) {
        btn.disabled = true; // Disable all to prevent multi-click
        if (btn !== selectedButton) btn.style.opacity = '0.5';
    }
    selectedButton.classList.add('selected');

    // Delay before next question
    setTimeout(() => {
        currentQuestionIndex++;
        updateProgressBar();
        if (currentQuestionIndex < questions.length) {
            setNextQuestion();
        } else {
            showResults();
        }
    }, 800);
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function showResults() {
    quizScreen.classList.remove('active');
    quizScreen.classList.add('hidden');
    quizScreen.style.display = 'none';

    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('active');
    resultScreen.style.display = 'block';

    finalScoreElement.innerText = totalScore;

    // Dynamic message based on score
    let message = "";
    if (totalScore <= 4) {
        message = "Kecemasan minimal";
    } else if (totalScore <= 9) {
        message = "Kecemasan ringan";
    } else if (totalScore <= 14) {
        message = "Kecemasan sedang";
    } else if (totalScore >= 15) {
        message = "Kecemasan berat";
    } else {
        message = "Unik! Kamu punya cara pandang sendiri.";
    }
    resultMessageElement.innerText = message;
}

function savePDF() {
    const element = document.getElementById('quiz-container');
    const opt = {
        margin: 1,
        filename: 'hasil-kuis-saya.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to save the element
    html2pdf().set(opt).from(element).save();
}
