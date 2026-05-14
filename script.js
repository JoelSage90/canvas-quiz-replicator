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
        <div style="
          width:140px;
          height:140px;
          border-radius:50%;
          border:12px solid #2b78c5;
          border-top-color:#dfe3e6;
          border-right-color:#dfe3e6;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:38px;
          font-weight:bold;
          color:#2d3b45;
        ">
          ${percentage}%
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

      <h2 style="
        font-size:42px;
        margin-bottom:40px;
      ">
        Questions
      </h2>

      ${answers.map((answer, index) => {

        const userAnswer =
          answer.selectedIndex !== null
            ? answer.options[answer.selectedIndex]
            : "(no answer)";

        return `

          <div style="
            border-top:1px solid #dfe3e6;
            padding-top:30px;
            margin-top:30px;
          ">

            <!-- Header -->
            <div style="
              display:flex;
              align-items:center;
              gap:20px;
              margin-bottom:25px;
            ">

              <div style="
                background:#2d3b45;
                color:white;
                width:50px;
                height:42px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-weight:bold;
                font-size:22px;
              ">
                ${index + 1}
              </div>

              <div style="
                font-size:22px;
                color:#6b7780;
              ">
                ${answer.correct ? "1 / 1 point" : "0 / 1 point"}
                &nbsp;&nbsp;
                Multiple choice
              </div>

            </div>

            <!-- Question -->
            <div style="
              font-size:28px;
              margin-bottom:30px;
              line-height:1.4;
            ">
              ${answer.question}
            </div>

            <!-- Options -->
            <div>

              ${answer.options.map((option, optionIndex) => {

                const isCorrect =
                  optionIndex === answer.correctIndex;

                const isSelected =
                  optionIndex === answer.selectedIndex;

                let style = `
                  border:2px solid #dfe3e6;
                  padding:18px 20px;
                  border-radius:6px;
                  margin-bottom:16px;
                  font-size:22px;
                `;

                // Correct answer styling
                if (isCorrect) {
                  style += `
                    border-color:#0b8f3a;
                    background:#f3fff6;
                  `;
                }

                // Wrong selected answer
                if (isSelected && !isCorrect) {
                  style += `
                    border-color:#d93025;
                    background:#fff5f5;
                  `;
                }

                return `

                  <div style="${style}">

                    <div style="
                      display:flex;
                      align-items:center;
                      gap:16px;
                    ">

                      <div style="
                        width:24px;
                        height:24px;
                        border-radius:50%;
                        border:3px solid #6b7780;
                        position:relative;
                        flex-shrink:0;
                      ">

                        ${isSelected ? `
                          <div style="
                            width:12px;
                            height:12px;
                            border-radius:50%;
                            background:#2d3b45;
                            position:absolute;
                            top:50%;
                            left:50%;
                            transform:translate(-50%, -50%);
                          "></div>
                        ` : ""}

                      </div>

                      <div>
                        ${option}
                      </div>

                    </div>

                  </div>
                `;

              }).join("")}

            </div>

            <!-- Incorrect message -->
            ${!answer.correct ? `

              <div style="
                margin-top:18px;
                font-size:22px;
              ">

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

              <div style="
                margin-top:18px;
                font-size:22px;
                color:#0b8f3a;
                font-weight:bold;
              ">
                Correct
              </div>

            `}

          </div>
        `;

      }).join("")}

    </div>
  `;

  main.innerHTML = resultsHTML;

  // Hide sidebar after results
  document.querySelector(".sidebar").style.display = "none";
}