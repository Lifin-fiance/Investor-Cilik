document.addEventListener('DOMContentLoaded', async () => {
    // Quiz UI Elements
    const quizContainer = document.getElementById('quiz-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedbackElement = document.getElementById('feedback-text');
    const nextButton = document.getElementById('next-btn');

    // Score Screen UI Elements
    const scoreScreen = document.getElementById('score-screen');
    const scoreText = document.getElementById('score-text');
    const restartButton = document.getElementById('restart-btn');

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    async function loadQuizData() {
        try {
            const response = await fetch('data/quiz.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            questions = data.questions;
            startQuiz();
        } catch (error) {
            console.error("Could not load the quiz:", error);
            questionText.textContent = "Oops! We couldn't load the quiz. Please try again later.";
        }
    }

    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        scoreScreen.classList.add('hidden');
        quizContainer.classList.remove('hidden');
        nextButton.classList.add('hidden');
        showQuestion();
    }

    function showQuestion() {
        feedbackElement.textContent = '';
        optionsContainer.innerHTML = '';
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;

        currentQuestion.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.innerHTML = `<span class="quiz-option-text">${option}</span>`; // Use innerHTML
            button.addEventListener('click', () => selectAnswer(index, button));
            optionsContainer.appendChild(button);
        });
    }

    function selectAnswer(selectedIndex, selectedButton) {
        const currentQuestion = questions[currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;
        const optionsButtons = document.querySelectorAll('.quiz-option');
        
        // Disable all buttons after an answer is selected
        optionsButtons.forEach(btn => {
            btn.disabled = true;
        });

        const correctButton = optionsButtons[correctIndex];

        if (selectedIndex === correctIndex) {
            score++;
            selectedButton.classList.add('correct');
            // Add checkmark icon
            selectedButton.innerHTML = `<i class="fas fa-check-circle mr-3"></i>` + selectedButton.innerHTML;
            feedbackElement.textContent = "🎉 " + currentQuestion.feedback;
            feedbackElement.className = 'feedback correct';
        } else {
            selectedButton.classList.add('incorrect');
            // Add X icon to the wrong answer
            selectedButton.innerHTML = `<i class="fas fa-times-circle mr-3"></i>` + selectedButton.innerHTML;
            
            correctButton.classList.add('correct');
            // Add checkmark icon to the right answer
            correctButton.innerHTML = `<i class="fas fa-check-circle mr-3"></i>` + correctButton.innerHTML;
            
            feedbackElement.textContent = "🤔 " + currentQuestion.feedback;
            feedbackElement.className = 'feedback incorrect';
        }

        nextButton.classList.remove('hidden');
    }
    
    function handleNext() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            nextButton.classList.add('hidden');
            feedbackElement.textContent = '';
        } else {
            showScore();
        }
    }

    function showScore() {
        quizContainer.classList.add('hidden');
        scoreScreen.classList.remove('hidden');
        scoreText.textContent = `You scored ${score} out of ${questions.length}!`;
    }

    nextButton.addEventListener('click', handleNext);
    restartButton.addEventListener('click', startQuiz);

    loadQuizData();
});