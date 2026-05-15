// script.js

const QUESTIONS_URL = "questions.json";

const questionsContainer = document.getElementById("questions-container");
const sidebarContainer = document.getElementById("sidebar-questions");
let QUIZ_DATA = null;
let totalPoints = 0;

initQuiz();

async function initQuiz() {
  try {
    QUIZ_DATA = await loadQuizData();

    document.getElementById("quiz-title").textContent = QUIZ_DATA.title;
    document.getElementById("quiz-description").textContent = QUIZ_DATA.description;

    totalPoints = QUIZ_DATA.questions.reduce((total, question) => {
      return total + getQuestionPoints(question);
    }, 0);

    renderQuestions();

    document.getElementById("submit-btn").addEventListener("click", submitQuiz);
  } catch (error) {
    questionsContainer.innerHTML = `
      <div class="result-feedback incorrect">
        Quiz data could not be loaded. Start a local server and make sure questions.json is available.
      </div>
    `;
    console.error(error);
  }
}

async function loadQuizData() {
  const response = await fetch(QUESTIONS_URL);

  if (!response.ok) {
    throw new Error(`Could not load ${QUESTIONS_URL}`);
  }

  return response.json();
}

function renderQuestions() {
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

    const questionDiv = document.createElement("div");

    questionDiv.className = "question";
    questionDiv.id = `q${index}`;

    questionDiv.innerHTML = `
      <div class="question-header">

        <div class="question-meta">
          <div class="question-num">${index + 1}</div>

          <div class="question-type-pts">
            ${getQuestionTypeLabel(question)} &nbsp;|&nbsp; ${formatPoints(getQuestionPoints(question))}
          </div>
        </div>

      </div>

      ${renderQuestionText(question, index)}

      ${renderQuestionInputs(question, index)}

      <hr class="question-separator">
    `;

    questionsContainer.appendChild(questionDiv);
  });
}


// =======================================
// SUBMIT QUIZ
// =======================================

function submitQuiz() {
  let score = 0;

  const answers = [];

  QUIZ_DATA.questions.forEach((question, index) => {

    const selectedAnswer = getSelectedAnswer(question, index);
    const result = scoreQuestion(question, selectedAnswer);

    answers.push({
      question: question.text,
      type: getQuestionType(question),
      typeLabel: getQuestionTypeLabel(question),
      points: result.points,
      earnedPoints: result.earnedPoints,
      options: question.options || [],
      matches: question.matches || [],
      gapKeys: result.gapKeys,
      gapAnswers: result.gapAnswers,
      selectedGaps: result.selectedGaps,
      correctIndices: result.correctIndices,
      selectedIndices: result.selectedIndices,
      selectedMatches: result.selectedMatches,
      correct: result.isCorrect
    });

    score += result.earnedPoints;
  });

  showResults(score, answers);
}


// =======================================
// RESULTS PAGE
// =======================================

function showResults(score, answers) {

  const percentage = Math.round(
    (score / totalPoints) * 100
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
            ${formatScore(score)}
          </div>

          <div style="
            font-size:20px;
            color:#6b7780;
          ">
            Out of ${formatScore(totalPoints)} points
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
                  ${answer.typeLabel} &nbsp;|&nbsp; ${formatScore(answer.earnedPoints)} / ${formatPoints(answer.points)}
                </div>
              </div>

            </div>

            ${renderAnswerQuestionText(answer)}

            ${renderAnswerReview(answer)}

            <!-- Incorrect message -->
            ${!answer.correct ? `

              <div class="result-feedback">

                <span style="
                  color:${answer.earnedPoints > 0 ? "#b36b00" : "#d93025"};
                  font-weight:bold;
                ">
                  ${answer.earnedPoints > 0 ? "Partially correct" : "Incorrect"}
                </span>

                <br><br>

                <strong>Correct Answer(s):</strong>
                ${renderCorrectAnswerText(answer)}

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

function renderQuestionText(question, questionIndex) {
  if (getQuestionType(question) !== "fill-gap") {
    return `
      <p class="question-text">
        ${question.text}
      </p>
    `;
  }

  return `
    <p class="fill-gap-text">
      ${question.text.replace(/\{([^}]+)\}/g, (match, key) => {
        return `
          <input
            class="fill-gap-input"
            type="text"
            name="question-${questionIndex}-gap-${key}"
            placeholder="${key}"
            autocomplete="off"
          >
        `;
      })}
    </p>
  `;
}

function renderQuestionInputs(question, questionIndex) {
  const questionType = getQuestionType(question);

  if (questionType === "fill-gap") {
    return "";
  }

  if (questionType === "matching") {
    return `
      <ul class="matching-list">
        ${question.matches.map((match, matchIndex) => {
          return `
            <li class="matching-row">
              <div class="matching-prompt">${match.prompt}</div>
              <div class="matching-line"></div>
              <select
                class="matching-select"
                name="question-${questionIndex}-match-${matchIndex}"
                id="q${questionIndex}-m${matchIndex}"
              >
                <option value=""></option>
                ${match.options.map((option, optionIndex) => {
                  return `
                    <option value="${optionIndex}">
                      ${option}
                    </option>
                  `;
                }).join("")}
              </select>
            </li>
          `;
        }).join("")}
      </ul>
    `;
  }

  const inputType = questionType === "multi-answer"
    ? "checkbox"
    : "radio";

  return `
    <ul class="options">
      ${question.options.map((option, optionIndex) => {
        return `
          <li class="option">
            <input
              type="${inputType}"
              name="question-${questionIndex}"
              id="q${questionIndex}-o${optionIndex}"
              value="${optionIndex}"
            >

            <label for="q${questionIndex}-o${optionIndex}">
              ${option}
            </label>
          </li>
        `;
      }).join("")}
    </ul>
  `;
}

function renderAnswerReview(answer) {
  if (answer.type === "fill-gap") {
    return `
      <ul class="fill-gap-review">
        ${answer.gapKeys.map((gapKey) => {
          const selectedValue = answer.selectedGaps[gapKey] || "(no answer)";
          const isCorrect = normaliseAnswer(selectedValue) === normaliseAnswer(answer.gapAnswers[gapKey]);

          return `
            <li class="fill-gap-review-item">
              <span class="fill-gap-label">${gapKey}:</span>
              <span class="fill-gap-answer ${isCorrect ? "correct-answer" : "incorrect-answer"}">
                ${selectedValue}
              </span>
            </li>
          `;
        }).join("")}
      </ul>
    `;
  }

  if (answer.type === "matching") {
    return `
      <ul class="matching-list">
        ${answer.matches.map((match, matchIndex) => {
          const selectedIndex = answer.selectedMatches[matchIndex];
          const isCorrect = selectedIndex === match.correct;
          const selectedText = selectedIndex !== null
            ? match.options[selectedIndex]
            : "(no answer)";

          return `
            <li class="matching-row">
              <div class="matching-prompt">${match.prompt}</div>
              <div class="matching-line"></div>
              <div class="matching-selected ${isCorrect ? "correct-answer" : "incorrect-answer"}">
                ${selectedText}
              </div>
            </li>
          `;
        }).join("")}
      </ul>
    `;
  }

  return `
    <ul class="options">
      ${answer.options.map((option, optionIndex) => {

        const isCorrect =
          answer.correctIndices.includes(optionIndex);

        const isSelected =
          answer.selectedIndices.includes(optionIndex);

        const optionClasses = ["option", "result-option"];

        // Correct answer styling
        if (isCorrect) {
          optionClasses.push("correct-answer");
        }

        // Wrong selected answer
        if (isSelected && !isCorrect) {
          optionClasses.push("incorrect-answer");
        }

        const markerClasses = ["result-marker", answer.type];

        if (isSelected) {
          markerClasses.push("result-marker-selected");
        }

        return `

          <li class="${optionClasses.join(" ")}">

            <span class="${markerClasses.join(" ")}"></span>

            <span>
              ${option}
            </span>

          </li>
        `;

      }).join("")}
    </ul>
  `;
}

function getQuestionType(question) {
  return question.type || "multi-choice";
}

function getQuestionTypeLabel(question) {
  const questionType = getQuestionType(question);

  if (questionType === "fill-gap") {
    return "Fill in the gaps";
  }

  if (questionType === "multi-answer") {
    return "Multiple answer";
  }

  if (questionType === "matching") {
    return "Matching";
  }

  return "Multiple choice";
}

function getQuestionPoints(question) {
  if (typeof question.points === "number") {
    return question.points;
  }

  if (getQuestionType(question) === "matching") {
    return question.matches.length;
  }

  if (getQuestionType(question) === "fill-gap") {
    return Object.keys(question.answers).length;
  }

  if (Array.isArray(question.correct)) {
    return question.correct.length;
  }

  return 1;
}

function getCorrectIndices(question) {
  if (getQuestionType(question) === "matching" || getQuestionType(question) === "fill-gap") {
    return [];
  }

  return Array.isArray(question.correct)
    ? question.correct
    : [question.correct];
}

function getSelectedAnswer(question, index) {
  if (getQuestionType(question) === "fill-gap") {
    return getGapKeys(question).reduce((selectedGaps, gapKey) => {
      const input = document.querySelector(
        `input[name="question-${index}-gap-${gapKey}"]`
      );

      selectedGaps[gapKey] = input
        ? input.value.trim()
        : "";

      return selectedGaps;
    }, {});
  }

  if (getQuestionType(question) === "matching") {
    return question.matches.map((match, matchIndex) => {
      const select = document.querySelector(
        `select[name="question-${index}-match-${matchIndex}"]`
      );

      return select && select.value !== ""
        ? Number(select.value)
        : null;
    });
  }

  return Array.from(
    document.querySelectorAll(`input[name="question-${index}"]:checked`)
  ).map((input) => Number(input.value));
}

function scoreQuestion(question, selectedAnswer) {
  const questionType = getQuestionType(question);
  const points = getQuestionPoints(question);
  const correctIndices = getCorrectIndices(question);
  let earnedPoints = 0;
  let gapKeys = [];
  let gapAnswers = {};
  let selectedIndices = [];
  let selectedMatches = [];
  let selectedGaps = {};

  if (questionType === "fill-gap") {
    gapKeys = getGapKeys(question);
    gapAnswers = question.answers;
    selectedGaps = selectedAnswer;

    const correctGaps = gapKeys.filter((gapKey) => {
      return normaliseAnswer(selectedGaps[gapKey]) === normaliseAnswer(gapAnswers[gapKey]);
    }).length;

    earnedPoints = (correctGaps / gapKeys.length) * points;
  } else if (questionType === "multi-answer") {
    selectedIndices = selectedAnswer;

    const correctSelections = selectedIndices.filter((selectedIndex) => {
      return correctIndices.includes(selectedIndex);
    }).length;

    const incorrectSelections = selectedIndices.length - correctSelections;
    const rawScore = Math.max(correctSelections - incorrectSelections, 0);

    earnedPoints = (rawScore / correctIndices.length) * points;
  } else if (questionType === "matching") {
    selectedMatches = selectedAnswer;

    const correctMatches = question.matches.filter((match, matchIndex) => {
      return selectedMatches[matchIndex] === match.correct;
    }).length;

    earnedPoints = (correctMatches / question.matches.length) * points;
  } else {
    selectedIndices = selectedAnswer;

    if (selectedIndices[0] === correctIndices[0]) {
      earnedPoints = points;
    }
  }

  return {
    correctIndices,
    earnedPoints,
    gapAnswers,
    gapKeys,
    isCorrect: earnedPoints === points,
    points,
    selectedGaps,
    selectedIndices,
    selectedMatches
  };
}

function formatPoints(points) {
  return `${formatScore(points)} ${points === 1 ? "point" : "points"}`;
}

function formatScore(score) {
  return Number.isInteger(score)
    ? String(score)
    : score.toFixed(1);
}

function renderCorrectAnswerText(answer) {
  if (answer.type === "fill-gap") {
    return answer.gapKeys.map((gapKey) => {
      return `${gapKey}: ${answer.gapAnswers[gapKey]}`;
    }).join("; ");
  }

  if (answer.type === "matching") {
    return answer.matches.map((match) => {
      return `${match.prompt}: ${match.options[match.correct]}`;
    }).join("; ");
  }

  return answer.correctIndices.map((correctIndex) => {
    return answer.options[correctIndex];
  }).join(", ");
}

function renderAnswerQuestionText(answer) {
  return `
    <p class="question-text">
      ${answer.question}
    </p>
  `;
}

function getGapKeys(question) {
  const keys = [];

  question.text.replace(/\{([^}]+)\}/g, (match, key) => {
    keys.push(key);
    return match;
  });

  return keys;
}

function normaliseAnswer(answer) {
  return String(answer).trim().toLowerCase();
}
