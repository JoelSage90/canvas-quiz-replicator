// script.js

document.getElementById("quiz-title").textContent = QUIZ_DATA.title;
document.getElementById("quiz-description").textContent = QUIZ_DATA.description;

const questionsContainer = document.getElementById("questions-container");
const sidebarContainer = document.getElementById("sidebar-questions");

QUIZ_DATA.questions.forEach((question, index) => {

  // Sidebar numbers
  const sideNum = document.createElement("div");
  sideNum.className = "sidebar-num";
  sideNum.textContent = index + 1;

  sideNum.addEventListener("click", () => {
    document.getElementById(`q${index}`).scrollIntoView({
      behavior: "smooth"
    });
  });

  sidebarContainer.appendChild(sideNum);

  // Build options
  const optionsHTML = question.options.map((option, optionIndex) => {

    return `
      <li class="option">
        <input
          type="radio"
          name="question-${index}"
          id="q${index}-o${optionIndex}"
          value="${optionIndex}"
        >

        <label for="q${index}-o${optionIndex}">
          ${option}
        </label>
      </li>
    `;

  }).join("");

  const questionDiv = document.createElement("div");

  questionDiv.className = "question";
  questionDiv.id = `q${index}`;

  questionDiv.innerHTML = `
    <div class="question-header">

      <div class="question-meta">
        <div class="question-num">${index + 1}</div>

        <div class="question-type-pts">
          Multiple choice &nbsp;|&nbsp; 1 point
        </div>
      </div>

    </div>

    <p class="question-text">
      ${question.text}
    </p>

    <ul class="options">
      ${optionsHTML}
    </ul>

    <hr class="question-separator">
  `;

  questionsContainer.appendChild(questionDiv);
});


// =======================================
// SUBMIT QUIZ
// =======================================

document.getElementById("submit-btn").addEventListener("click", () => {

  let score = 0;

  const answers = [];

  QUIZ_DATA.questions.forEach((question, index) => {

    const selected = document.querySelector(
      `input[name="question-${index}"]:checked`
    );

    const selectedValue = selected
      ? Number(selected.value)
      : null;

    const isCorrect = selectedValue === question.correct;

    if (isCorrect) {
      score++;
    }

    answers.push({
      question: question.text,
      options: question.options,
      correctIndex: question.correct,
      selectedIndex: selectedValue,
      correct: isCorrect
    });
  });

  showResults(score, answers);
});


// =======================================
// RESULTS PAGE
// =======================================

function showResults(score, answers) {

  const percentage = Math.round(
    (score / QUIZ_DATA.questions.length) * 100
  );

  // Hide original quiz
  document.querySelector(".main").innerHTML = "";

  const main = document.querySelector(".main");

  // Create results page
  const resultsHTML = `

    <div class="quiz-card">

      <h1 style="
        font-size:48px;
        margin-bottom:10px;
      ">
        Results
      </h1>

      <h2 style="
        font-size:22px;
        font-weight:normal;
        margin-bottom:50px;
      ">
        Quiz Attempt
      </h2>

      <!-- Score Summary -->
      <div style="
        display:flex;
        align-items:center;
        gap:80px;
        margin-bottom:60px;
      ">

        <!-- Circle -->
        <div class="score-ring" id="score-ring" data-score="${percentage}">
          <span class="score-ring-value" id="score-ring-value">0%</span>
        </div>

        <!-- Score -->
        <div>
          <div style="
            font-size:64px;
            font-weight:bold;
            line-height:1;
          ">
            ${score}
          </div>

          <div style="
            font-size:20px;
            color:#6b7780;
          ">
            Out of ${QUIZ_DATA.questions.length} points
          </div>
        </div>

      </div>

      <h2 class="result-section-title">
        Questions
      </h2>

      ${answers.map((answer, index) => {

        return `

          <div class="question" id="q${index}">

            <!-- Header -->
            <div class="question-header">

              <div class="question-meta">
                <div class="question-num">${index + 1}</div>

                <div class="question-type-pts">
                  Multiple choice &nbsp;|&nbsp; ${answer.correct ? "1 / 1" : "0 / 1"} point
                </div>
              </div>

            </div>

            <!-- Question -->
            <p class="question-text">
              ${answer.question}
            </p>

            <!-- Options -->
            <ul class="options">

              ${answer.options.map((option, optionIndex) => {

                const isCorrect =
                  optionIndex === answer.correctIndex;

                const isSelected =
                  optionIndex === answer.selectedIndex;

                const optionClasses = ["option", "result-option"];

                // Correct answer styling
                if (isCorrect) {
                  optionClasses.push("correct-answer");
                }

                // Wrong selected answer
                if (isSelected && !isCorrect) {
                  optionClasses.push("incorrect-answer");
                }

                const radioClasses = ["result-radio"];

                if (isSelected) {
                  radioClasses.push("result-radio-selected");
                }

                return `

                  <li class="${optionClasses.join(" ")}">

                    <span class="${radioClasses.join(" ")}"></span>

                    <span>
                      ${option}
                    </span>

                  </li>
                `;

              }).join("")}

            </ul>

            <!-- Incorrect message -->
            ${!answer.correct ? `

              <div class="result-feedback">

                <span style="
                  color:#d93025;
                  font-weight:bold;
                ">
                  Incorrect
                </span>

                <br><br>

                <strong>Correct Answer:</strong>
                ${answer.options[answer.correctIndex]}

              </div>

            ` : `

              <div class="result-feedback correct">
                Correct
              </div>

            `}

            <hr class="question-separator">

          </div>
        `;

      }).join("")}

    </div>
  `;

  main.innerHTML = resultsHTML;
  window.scrollTo(0, 0);
  animateScoreRing(percentage);

}

function animateScoreRing(percentage) {

  const ring = document.getElementById("score-ring");
  const value = document.getElementById("score-ring-value");

  if (!ring || !value) {
    return;
  }

  const duration = 1000;
  const startTime = performance.now();

  function updateFrame(currentTime) {

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentScore = percentage * easedProgress;

    ring.style.setProperty("--score-progress", `${currentScore}%`);
    value.textContent = `${Math.round(currentScore)}%`;

    if (progress < 1) {
      requestAnimationFrame(updateFrame);
    }
  }

  requestAnimationFrame(updateFrame);
}
