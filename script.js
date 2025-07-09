let getcard = document.querySelector('#quiz-screen');
let data = [];//samjao
let questionNumber = 0;
let score = 0;
let timer = 30; //samjao


fetch('https://the-trivia-api.com/v2/questions')
  .then(response => response.json())
  .then(fetchedData => {
    data = fetchedData;//samjao
    showQuestion();
  })
  .catch(error => {
    console.error('Error fetching quiz questions:', error);
  });

function showQuestion() {

  if (questionNumber < data.length) {
    let currentQuestion = data[questionNumber];
    let questionText = currentQuestion.question.text;
    let correctAnswer = currentQuestion.correctAnswer;
    let options = [...currentQuestion.incorrectAnswers, correctAnswer];
    options.sort(() => Math.random() - 0.5);//samjao

    let optionsHTML = options.map(opt => `<button class="option">${opt}</button>`).join("");

    getcard.innerHTML = `
      <div class="question">${questionText}</div>
      <div class="options">
        ${optionsHTML}
      </div>
      <button onclick="nextQuestion()" class="next-btn">Next</button>
    `;
getcard.style.display = 'block';
 document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', function() {
        if (this.textContent === correctAnswer) {
          score++;
          this.style.backgroundColor = 'green';
        } else {
            this.style.backgroundColor = 'red';
        }
        if()
        document.querySelectorAll('.option').forEach(opt => opt.disabled = true);
        document.querySelector("#score").textContent = score* 10; // Update score display
      });
    });
  } else {
    if(score<=70){
    Swal.fire({
  icon: "error",
  title: "failed",
  text: `${score*10}/100`,
  footer: `<button class="restart-btn" onclick="restart()">Restart Quiz</button>`,

});
}
else{
    Swal.fire({
  icon: "success",
  title: "Congratulations!",
  text: `You scored ${score}/100`,
  footer: `<button class="restart-btn" onclick="restart()">Restart Quiz</button> <button class="submit-btn" onclick="submitQuiz()">Submit Quiz</button>`,
});
}
let submitQuiz = () => {
  Swal.fire({
    title: 'Quiz Submitted',
    text: `You scored ${score}/100`,
    icon: 'success',
    confirmButtonText: 'OK'
  });
  questionNumber = 0;
  score = 0;
  showQuestion();
}
let restart = () => {
  location.href= 'quiz.html';
}
  }
 starttimer();
}

function nextQuestion() {
  questionNumber++;
  showQuestion();
}

const startTimer = () => {
  document.getElementById('timer').innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
};
