const quizData = [
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Jupiter", "Saturn", "Neptune"],
        correct: 1
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correct: 2
    },
    {
        question: "What is the capital city of Australia?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["1910", "1912", "1914", "1916"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    }
];

// Quiz State Variables
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let selectedAnswer = null;

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const currentQuestionSpan = document.getElementById('current-question');
const totalQuestionsSpan = document.getElementById('total-questions');
const progress = document.getElementById('progress');
const quizContent = document.getElementById('quiz-content');
const resultsScreen = document.getElementById('results-screen');
const reviewScreen = document.getElementById('review-screen');
const finalScore = document.getElementById('final-score');
const scorePercentage = document.getElementById('score-percentage');
const performanceMessage = document.getElementById('performance-message');

// Initialize Quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    selectedAnswer = null;
    
    totalQuestionsSpan.textContent = quizData.length;
    quizContent.style.display = 'block';
    resultsScreen.style.display = 'none';
    reviewScreen.style.display = 'none';
    
    loadQuestion();
}

// Load Current Question
function loadQuestion() {
    const question = quizData[currentQuestion];
    
    questionText.textContent = question.question;
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    // Update progress bar
    const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100;
    progress.style.width = progressPercentage + '%';
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    selectedAnswer = null;
    nextBtn.disabled = true;
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectAnswer(index, optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    // Update next button text
    if (currentQuestion === quizData.length - 1) {
        nextBtn.textContent = 'Finish Quiz';
    } else {
        nextBtn.textContent = 'Next Question';
    }
}

// Select Answer
function selectAnswer(answerIndex, optionElement) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Mark current selection
    optionElement.classList.add('selected');
    selectedAnswer = answerIndex;
    nextBtn.disabled = false;
}

// Next Question
function nextQuestion() {
    if (selectedAnswer === null) return;
    
    // Store user answer
    userAnswers[currentQuestion] = selectedAnswer;
    
    // Show correct/incorrect answers
    showAnswerFeedback();
    
    // Wait for animation, then proceed
    setTimeout(() => {
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            loadQuestion();
        } else {
            calculateScore();
            showResults();
        }
    }, 1500);
}

// Show Answer Feedback
function showAnswerFeedback() {
    const question = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        option.classList.add('disabled');
        
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedAnswer && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    nextBtn.disabled = true;
}

// Calculate Final Score
function calculateScore() {
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correct) {
            score++;
        }
    });
}

// Show Results Screen
function showResults() {
    quizContent.style.display = 'none';
    resultsScreen.style.display = 'block';
    
    const percentage = Math.round((score / quizData.length) * 100);
    
    finalScore.textContent = `${score}/${quizData.length}`;
    scorePercentage.textContent = `${percentage}%`;
    
    // Performance message based on score
    let message = '';
    if (percentage >= 90) {
        message = "🌟 Outstanding! You're a quiz master!";
    } else if (percentage >= 70) {
        message = "🎯 Great job! You know your stuff!";
    } else if (percentage >= 50) {
        message = "👍 Good effort! Keep learning!";
    } else {
        message = "📚 Don't give up! Practice makes perfect!";
    }
    
    performanceMessage.textContent = message;
    
    // Animate score circle
    animateScore(percentage);
}

// Animate Score Circle
function animateScore(targetPercentage) {
    const scoreCircle = document.querySelector('.score-circle');
    let currentPercentage = 0;
    const increment = targetPercentage / 50; // Animation duration
    
    const animation = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(animation);
        }
        
        // Update the visual representation if needed
        scoreCircle.style.background = `conic-gradient(#4ecdc4 ${currentPercentage * 3.6}deg, #e0e0e0 0deg)`;
    }, 20);
}

// Show Review Screen
function showReview() {
    resultsScreen.style.display = 'none';
    reviewScreen.style.display = 'block';
    
    const reviewContainer = document.getElementById('review-questions');
    reviewContainer.innerHTML = '';
    
    quizData.forEach((question, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        
        const userAnswer = userAnswers[index];
        const correctAnswer = question.correct;
        const isCorrect = userAnswer === correctAnswer;
        
        reviewItem.innerHTML = `
            <div class="review-question">${index + 1}. ${question.question}</div>
            <div class="review-answer ${isCorrect ? 'user-correct' : 'user-incorrect'}">
                Your answer: ${question.options[userAnswer]}
            </div>
            ${!isCorrect ? `<div class="review-answer correct-answer">
                Correct answer: ${question.options[correctAnswer]}
            </div>` : ''}
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

// Back to Results
function backToResults() {
    reviewScreen.style.display = 'none';
    resultsScreen.style.display = 'block';
}

// Restart Quiz
function restartQuiz() {
    initQuiz();
}

// Initialize Quiz on Page Load
document.addEventListener('DOMContentLoaded', initQuiz);

// Keyboard Support
document.addEventListener('keydown', (event) => {
    if (quizContent.style.display !== 'none') {
        // Number keys 1-4 for option selection
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            const options = document.querySelectorAll('.option');
            if (options[optionIndex] && !options[optionIndex].classList.contains('disabled')) {
                selectAnswer(optionIndex, options[optionIndex]);
            }
        }
        
        // Enter key for next question
        if (event.key === 'Enter' && !nextBtn.disabled) {
            nextQuestion();
        }
    }
    
    // Escape key to restart quiz
    if (event.key === 'Escape') {
        if (confirm('Are you sure you want to restart the quiz?')) {
            restartQuiz();
        }
    }
});
