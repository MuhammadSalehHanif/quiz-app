let getcard = document.querySelector('#quiz-screen');
let data = []; // empty array to store questions
let questionNumber = 0;
let score = 0;
let timeLeft = 30; // timer for each question
let timerInterval; // for setInterval reference

fetch('https://the-trivia-api.com/v2/questions')
  .then(response => response.json())
  .then(fetchedData => {
    data = fetchedData; // fetched questions stored in data array
    showQuestion();
    console.log(fetchedData);

  })
  .catch(error => {
    console.error('Error fetching quiz questions:', error);
  });

function showQuestion() {
  clearInterval(timerInterval); // clear previous timer
  timeLeft = 30; // reset timer
  document.getElementById('timer').innerText = timeLeft;

  if (questionNumber < data.length) {

    let currentQuestion = data[questionNumber];
    let questionText = currentQuestion.question.text;
    let correctAnswer = currentQuestion.correctAnswer;
    let options = [...currentQuestion.incorrectAnswers, correctAnswer];
    options.sort(() => Math.random() - 0.5); // shuffle options

    let optionsHTML = options.map(opt => `<button class="option">${opt}</button>`).join("");
 
    getcard.innerHTML = `
      <div class="question">${questionText}</div>
      <div class="options">${optionsHTML}</div>
      <button onclick="nextQuestion()" class="next-btn">Next</button>
    `;
    getcard.style.display = 'block';
    let btn = document.querySelector('.next-btn');
    btn.disabled = true; // disable next button initially
    btn.style.background = 'linear-gradient(45deg,rgb(165, 184, 189),rgb(182, 195, 207))';
    timerInterval = setInterval(() => {
      timeLeft--;
      document.getElementById('timer').innerText = timeLeft;
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        nextQuestion();
      }
    }, 1000);

    document.querySelectorAll('.option').forEach(option => {
      option.addEventListener('click', function() {
        if (this.textContent === correctAnswer) {
          score++;
          this.style.backgroundColor = 'green';
          btn.disabled = false; // enable next button
    btn.style.background = 'linear-gradient(45deg, #00c6ff, #0072ff)';

        } else {
          this.style.backgroundColor = 'red';
          btn.disabled = false; // enable next button
    btn.style.background = 'linear-gradient(45deg, #00c6ff, #0072ff)';

        }

        document.querySelectorAll('.option').forEach(opt => opt.disabled = true);
        document.querySelector("#score").textContent = score * 10; // update score display
      });
    });
  } else {
    clearInterval(timerInterval);
    showResult();
  }
}

function nextQuestion() {
  questionNumber++;
  showQuestion();
}

function showResult() {
  if (score * 10 <= 70) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: `${score * 10}/100`,
      footer: `<button class="restart-btn" onclick="restart()">Restart Quiz</button>`,
    });
  } else {
    Swal.fire({
      icon: "success",
      title: "Congratulations!",
      text: `You scored ${score * 10}/100`,
      footer: `<button class="restart-btn" onclick="restart()">Restart Quiz</button>
               <button class="restart-btn" onclick="submitQuiz()">Submit Quiz</button>`,
    });
  }
}

function submitQuiz() {
  Swal.fire({
    title: 'Quiz Submitted',
    text: `You scored ${score * 10}/100`,
    icon: 'success',
    confirmButtonText: 'OK'
  });
  questionNumber = 0;
  score = 0;
  showQuestion();
}

function restart() {
  location.href = 'quiz.html';
}
