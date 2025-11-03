/*
 * Triangle - Quiz Page Logic
 * Author: Muhammad Shourov
 * Version: 1.0.0
 * Uses the Open Trivia Database (OpenTDB) API
*/

document.addEventListener('DOMContentLoaded', () => {

    // API URL (10 Computer Science Questions, Multiple Choice)
    const API_URL = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';

    // HTML Elements
    const quizContainer = document.getElementById('quiz-container');
    const startView = document.getElementById('quiz-start');
    const startBtn = document.getElementById('start-quiz-btn');
    const loader = document.getElementById('quiz-loader');
    const mainView = document.getElementById('quiz-main');
    const endView = document.getElementById('quiz-end');

    const questionCounter = document.getElementById('question-counter');
    const scoreText = document.getElementById('quiz-score');
    const questionText = document.getElementById('question-text');
    const answerButtonsContainer = document.getElementById('answer-buttons');
    const feedbackText = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('next-question-btn');
    
    const finalScoreText = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-quiz-btn');

    // Quiz State
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // --- 1. Start Quiz Function ---
    async function startQuiz() {
        startView.style.display = 'none';
        endView.style.display = 'none';
        loader.style.display = 'block';
        startBtn.setAttribute('aria-busy', 'true');
        
        questions = [];
        currentQuestionIndex = 0;
        score = 0;

        try {
            // Fetch questions from API
            const response = await fetch(API_URL);
            const data = await response.json();
            
            if (data.response_code !== 0) {
                throw new Error('Could not fetch questions from API.');
            }
            
            questions = data.results;
            
            // Hide loader, show main quiz view
            loader.style.display = 'none';
            mainView.style.display = 'block';
            startBtn.setAttribute('aria-busy', 'false');
            
            displayQuestion();

        } catch (e) {
            loader.style.display = 'none';
            startView.style.display = 'block';
            startBtn.setAttribute('aria-busy', 'false');
            alert('Error starting quiz: ' + e.message);
        }
    }

    // --- 2. Display Question Function ---
    function displayQuestion() {
        // Reset feedback and next button
        feedbackText.textContent = '';
        nextBtn.style.display = 'none';
        
        // Clear old answer buttons
        answerButtonsContainer.innerHTML = '';
        
        // Get current question
        const question = questions[currentQuestionIndex];
        
        // Update UI
        questionCounter.textContent = `Question ${currentQuestionIndex + 1} / ${questions.length}`;
        scoreText.textContent = `Score: ${score}`;
        
        // Use decodeURIComponent to fix any weird characters (e.g., &quot;)
        questionText.textContent = decodeURIComponent(question.question);
        
        // Combine and shuffle answers
        const answers = [
            ...question.incorrect_answers.map(a => decodeURIComponent(a)),
            decodeURIComponent(question.correct_answer)
        ];
        shuffleArray(answers);
        
        // Create answer buttons
        answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => handleAnswer(answer, button));
            answerButtonsContainer.appendChild(button);
        });
    }

    // --- 3. Handle Answer Click ---
    function handleAnswer(selectedAnswer, selectedButton) {
        const question = questions[currentQuestionIndex];
        const correctAnswer = decodeURIComponent(question.correct_answer);

        // Disable all buttons after an answer is selected
        Array.from(answerButtonsContainer.children).forEach(button => {
            button.disabled = true;
            // Show correct/wrong colors
            if (button.textContent === correctAnswer) {
                button.classList.add('correct');
            } else if (button === selectedButton) {
                button.classList.add('wrong');
            }
        });

        // Check if correct
        if (selectedAnswer === correctAnswer) {
            score++;
            feedbackText.textContent = 'Correct!';
            feedbackText.style.color = 'var(--primary-color)';
        } else {
            feedbackText.textContent = 'Wrong! The correct answer was: ' + correctAnswer;
            feedbackText.style.color = '#ff6b6b';
        }

        // Show next button
        nextBtn.style.display = 'block';
        scoreText.textContent = `Score: ${score}`; // Update score text immediately
    }

    // --- 4. Next Question / End Quiz ---
    function showNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            showEndScreen();
        }
    }
    
    function showEndScreen() {
        mainView.style.display = 'none';
        endView.style.display = 'block';
        finalScoreText.textContent = `Your Score: ${score} / ${questions.length}`;
    }

    // --- Helper: Shuffle Array ---
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', showNextQuestion);
    restartBtn.addEventListener('click', startQuiz);

}); // DOMContentLoaded End
