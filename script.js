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
const userNameInput = document.getElementById('user-name');
const userPhoneInput = document.getElementById('user-phone');
const userAgeInput = document.getElementById('user-age');

let currentQuestionIndex = 0;
let totalScore = 0;
let userAnswers = [];

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
    // Validation
    if (!userNameInput.value || !userPhoneInput.value || !userAgeInput.value) {
        alert("Mohon lengkapi data diri Anda terlebih dahulu!");
        return;
    }

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
    currentQuestionIndex = 0;
    totalScore = 0;
    userAnswers = [];
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

    // Track Answer
    const currentQuestion = questions[currentQuestionIndex];
    userAnswers.push({
        question: currentQuestion.question,
        answer: selectedButton.innerText,
        score: score
    });

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
    // Generate content before saving
    generatePDFContent();

    const element = document.getElementById('pdf-content');

    // Temporarily show the element for html2pdf (if it's hidden with display:none)
    // However, best practice with html2pdf is to clone or have it visible-ish.
    // We will assume CSS handles visibility or we handle it here.
    element.style.display = 'block';

    const opt = {
        margin: [0.5, 0.5], // Top, Left, Bottom, Right
        filename: 'Laporan-Hasil-Kuis-GAD7.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to save the element
    html2pdf().set(opt).from(element).save().then(() => {
        // Hide it again after saving
        element.style.display = 'none';
    });
}

function generatePDFContent() {
    const container = document.getElementById('pdf-content');
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Get result message
    let message = "";
    if (totalScore <= 4) message = "Kecemasan minimal";
    else if (totalScore <= 9) message = "Kecemasan ringan";
    else if (totalScore <= 14) message = "Kecemasan sedang";
    else message = "Kecemasan berat";

    let htmlContent = `
        <div class="pdf-header">
            <h1>Laporan Hasil Kuis GAD-7</h1>
            <p>Tanggal: ${today}</p>
        </div>

        <div class="user-details" style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
            <p><strong>Nama:</strong> ${userNameInput.value}</p>
            <p><strong>No. Telp:</strong> ${userPhoneInput.value}</p>
            <p><strong>Usia:</strong> ${userAgeInput.value} tahun</p>
        </div>
        
        <div class="pdf-summary">
            <div class="score-card">
                <h2>Total Skor</h2>
                <div class="score-big">${totalScore}</div>
                <p class="status">${message}</p>
            </div>
            <div class="interpretation">
                <h3>Interpretasi Skor:</h3>
                <ul>
                    <li><strong>0-4:</strong> Kecemasan minimal</li>
                    <li><strong>5-9:</strong> Kecemasan ringan</li>
                    <li><strong>10-14:</strong> Kecemasan sedang</li>
                    <li><strong>15+:</strong> Kecemasan berat</li>
                </ul>
            </div>
        </div>

        <div class="pdf-details">
            <h3>Rincian Jawaban</h3>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Pertanyaan</th>
                        <th>Jawaban Kamu</th>
                        <th>Skor</th>
                    </tr>
                </thead>
                <tbody>
    `;

    userAnswers.forEach((item, index) => {
        htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.question}</td>
                <td>${item.answer}</td>
                <td>${item.score}</td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
        </div>
        <div class="pdf-footer">
            <p><em>Catatan: Hasil ini hanyalah skrining awal dan bukan diagnosis medis. Silakan konsultasikan dengan profesional jika diperlukan.</em></p>
        </div>
    `;

    container.innerHTML = htmlContent;
}
