import './style.css'
import { questions } from './questions.js'

// State
let currentQuestionIndex = 0;
let totalScore = 0;

// Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const answerButtonsElement = document.getElementById('answer-buttons');
const startButton = document.getElementById('start-btn');
const saveButton = document.getElementById('save-btn');
const totalScoreElement = document.getElementById('total-score');
const scoreDescriptionElement = document.getElementById('score-description');
const progressBar = document.getElementById('progress');

// Event Listeners
startButton.addEventListener('click', startGame);
saveButton.addEventListener('click', () => {
  window.print();
});

function startGame() {
  currentQuestionIndex = 0;
  totalScore = 0;
  showScreen(quizScreen);
  setNextQuestion();
}

function showScreen(screen) {
  // Hide all screens
  [startScreen, quizScreen, resultScreen].forEach(s => {
    s.classList.add('hidden');
    s.classList.remove('active');
  });
  // Show target screen
  screen.classList.remove('hidden');
  // Small timeout to allow display:block to apply before opacity transition
  setTimeout(() => {
    screen.classList.add('active');
  }, 10);
}

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
    updateProgress();
  } else {
    showResults();
  }
}

function showQuestion(question) {
  questionText.innerText = question.question;

  // Randomize answers order (optional, here we keep defined order or shuffle)
  // Let's keep defined order for simplicity

  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn', 'btn-answer');
    button.addEventListener('click', () => selectAnswer(answer));
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

function selectAnswer(answer) {
  totalScore += answer.score;
  currentQuestionIndex++;

  // Optional: Visual feedback before moving to next?
  // For now, instant transition
  setNextQuestion();
}

function updateProgress() {
  const percent = ((currentQuestionIndex) / questions.length) * 100;
  progressBar.style.width = `${percent}%`;
}

function showResults() {
  updateProgress(); // 100%
  totalScoreElement.innerText = totalScore;
  showScreen(resultScreen);

  // Add simple animation for score count up
  animateScore(totalScore);

  // Show description
  const description = getScoreDescription(totalScore);
  scoreDescriptionElement.innerText = description;
}

function getScoreDescription(score) {
  if (score <= 4) return "Tidak ada gejala depresi";
  if (score <= 9) return "Depresi ringan";
  if (score <= 14) return "Depresi sedang";
  if (score <= 19) return "Depresi sedang berat";
  return "Depresi berat";
}

function animateScore(target) {
  let current = 0;
  const increment = Math.ceil(target / 50);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    totalScoreElement.innerText = current;
  }, 20);
}
