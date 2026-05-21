// script.js

const landingContainer = document.getElementById("landing-container");
const questionsContainer = document.getElementById("questions-container");
const sidebarContainer = document.getElementById("sidebar-questions");
const submitButton = document.getElementById("submit-btn");
let QUIZ_DATA = null;
let totalPoints = 0;
let mathTypesetPending = false;

initLandingPage();

window.addEventListener("load", () => {
  if (mathTypesetPending) {
    typesetMath();
  }
});

function initLandingPage() {
  document.getElementById("quiz-title").textContent = "Create quiz";
  document.getElementById("quiz-description").textContent = "Paste your quiz JSON below or upload a JSON file to begin.";
  questionsContainer.innerHTML = "";
  sidebarContainer.innerHTML = "";
  submitButton.hidden = true;

  landingContainer.innerHTML = `
    <div class="landing-form">
      <p class="prompt-helper">
        To generate quiz questions, use
        <a class="prompt-link" href="genericprompt.txt" download>
          this prompt
        </a>
        along with your notes in any AI model, then paste or upload the output JSON here.
      </p>

      <textarea
        class="json-input"
        id="json-input"
        spellcheck="false"
        placeholder='{
  "title": "Quiz title",
  "description": "Quiz description",
  "questions": []
}'
      ></textarea>

      <label class="upload-dropzone" id="upload-dropzone" for="json-file">
        <span class="upload-primary" id="upload-primary">Drag and drop a JSON file here</span>
        <span class="upload-secondary" id="upload-secondary">or click to choose one</span>
        <input class="file-input" id="json-file" type="file" accept=".json,application/json">
      </label>

      <div class="landing-error" id="landing-error" role="alert"></div>

      <div class="landing-actions">
        <button class="btn-submit" id="begin-btn">Begin</button>
      </div>
    </div>
  `;

  const jsonInput = document.getElementById("json-input");
  const fileInput = document.getElementById("json-file");
  const dropzone = document.getElementById("upload-dropzone");
  const beginButton = document.getElementById("begin-btn");

  beginButton.addEventListener("click", () => {
    beginQuizFromJson(jsonInput.value);
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      loadJsonFile(fileInput.files[0]);
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("drag-over");
    });
  });

  dropzone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];

    if (file) {
      loadJsonFile(file);
    }
  });
}

function beginQuizFromJson(jsonText) {
  const errorContainer = document.getElementById("landing-error");

  try {
    const quizData = JSON.parse(jsonText);
    validateQuizData(quizData);
    renderQuiz(quizData);
  } catch (error) {
    errorContainer.textContent = error.message;
    console.error(error);
  }
}

async function loadJsonFile(file) {
  const jsonInput = document.getElementById("json-input");
  const uploadPrimary = document.getElementById("upload-primary");
  const uploadSecondary = document.getElementById("upload-secondary");
  const errorContainer = document.getElementById("landing-error");

  try {
    const fileText = await file.text();
    jsonInput.value = fileText;
    uploadPrimary.textContent = file.name;
    uploadSecondary.textContent = "File loaded. Click Begin to create the quiz.";
    errorContainer.textContent = "";
  } catch (error) {
    errorContainer.textContent = "That file could not be read. Please try another JSON file.";
    console.error(error);
  }
}

function renderQuiz(quizData) {
  QUIZ_DATA = quizData;
  totalPoints = QUIZ_DATA.questions.reduce((total, question) => {
    return total + getQuestionPoints(question);
  }, 0);

  document.getElementById("quiz-title").textContent = QUIZ_DATA.title;
  document.getElementById("quiz-description").textContent = QUIZ_DATA.description;
  landingContainer.innerHTML = "";
  questionsContainer.innerHTML = "";
  sidebarContainer.innerHTML = "";
  submitButton.hidden = false;

  renderQuestions();
  submitButton.removeEventListener("click", submitQuiz);
  submitButton.addEventListener("click", submitQuiz);
  window.scrollTo(0, 0);
  typesetMath();
}

function validateQuizData(quizData) {
  if (!quizData || typeof quizData !== "object") {
    throw new Error("The JSON must be an object.");
  }

  if (typeof quizData.title !== "string" || quizData.title.trim() === "") {
    throw new Error("The quiz JSON needs a title.");
  }

  if (typeof quizData.description !== "string") {
    throw new Error("The quiz JSON needs a description.");
  }

  if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
    throw new Error("The quiz JSON needs at least one question.");
  }

  quizData.questions.forEach((question, index) => {
    validateQuestion(question, index);
  });
}

function validateQuestion(question, index) {
  if (!question || typeof question !== "object") {
    throw new Error(`Question ${index + 1} must be an object.`);
  }

  if (typeof question.text !== "string" || question.text.trim() === "") {
    throw new Error(`Question ${index + 1} needs question text.`);
  }

  const questionType = getQuestionType(question);

  if (questionType === "fill-gap") {
    if (!question.answers || typeof question.answers !== "object") {
      throw new Error(`Question ${index + 1} needs answers for its gaps.`);
    }

    return;
  }

  if (questionType === "matching") {
    if (!Array.isArray(question.matches) || question.matches.length === 0) {
      throw new Error(`Question ${index + 1} needs matching rows.`);
    }

    return;
  }

  if (!Array.isArray(question.options) || question.options.length === 0) {
    throw new Error(`Question ${index + 1} needs answer options.`);
  }

  if (question.correct === undefined) {
    throw new Error(`Question ${index + 1} needs a correct answer.`);
  }
}

function renderQuestions() {
  QUIZ_DATA.questions.forEach((question, index) => {

    // Sidebar numbers
    const sideNum = document.createElement("div");
    sideNum.className = "sidebar-num sidebar-num-incomplete";
    sideNum.id = `sidebar-q${index}`;
    sideNum.setAttribute("aria-label", `Question ${index + 1} not completed`);
    sideNum.innerHTML = `
      <span class="sidebar-status-dot" aria-hidden="true"></span>
      <span class="sidebar-num-label">${index + 1}</span>
    `;

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
    questionDiv.addEventListener("change", () => {
      updateQuestionCompletion(index);
    });
    questionDiv.addEventListener("input", () => {
      updateQuestionCompletion(index);
    });
    updateQuestionCompletion(index);
  });
}

function updateQuestionCompletion(index) {
  const sideNum = document.getElementById(`sidebar-q${index}`);

  if (!sideNum) {
    return;
  }

  const completed = isQuestionCompleted(QUIZ_DATA.questions[index], index);
  sideNum.classList.toggle("sidebar-num-incomplete", !completed);
  sideNum.classList.toggle("sidebar-num-complete", completed);
  sideNum.setAttribute(
    "aria-label",
    `Question ${index + 1} ${completed ? "completed" : "not completed"}`
  );
}

function isQuestionCompleted(question, index) {
  const questionType = getQuestionType(question);
  const selectedAnswer = getSelectedAnswer(question, index);

  if (questionType === "fill-gap") {
    const gapKeys = getGapKeys(question);

    return gapKeys.length > 0 && gapKeys.every((gapKey) => {
      return selectedAnswer[gapKey] !== "";
    });
  }

  if (questionType === "matching") {
    return selectedAnswer.length > 0 && selectedAnswer.every((selectedMatch) => {
      return selectedMatch !== null;
    });
  }

  return selectedAnswer.length > 0;
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
  typesetMath();

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
      <div class="question-text">
        ${renderFormattedContent(question.text)}
      </div>
    `;
  }

  return `
    <div class="fill-gap-text">
      ${renderFillGapQuestionText(question, questionIndex)}
    </div>
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
              <div class="matching-prompt">${renderFormattedContent(match.prompt)}</div>
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
                      ${escapeHtml(option)}
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
              ${renderFormattedContent(option)}
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
              <div class="matching-prompt">${renderFormattedContent(match.prompt)}</div>
              <div class="matching-line"></div>
              <div class="matching-selected ${isCorrect ? "correct-answer" : "incorrect-answer"}">
                ${renderFormattedContent(selectedText)}
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
              ${renderFormattedContent(option)}
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
      return `${escapeHtml(gapKey)}: ${renderFormattedContent(answer.gapAnswers[gapKey])}`;
    }).join("; ");
  }

  if (answer.type === "matching") {
    return answer.matches.map((match) => {
      return `${renderFormattedContent(match.prompt)}: ${renderFormattedContent(match.options[match.correct])}`;
    }).join("; ");
  }

  return answer.correctIndices.map((correctIndex) => {
    return renderFormattedContent(answer.options[correctIndex]);
  }).join(", ");
}

function renderAnswerQuestionText(answer) {
  return `
    <div class="question-text">
      ${renderFormattedContent(answer.question)}
    </div>
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

function renderFillGapQuestionText(question, questionIndex) {
  return question.text.split(/(\{[^}]+\})/g).map((part) => {
    const gapMatch = part.match(/^\{([^}]+)\}$/);

    if (!gapMatch) {
      return renderFormattedContent(part);
    }

    const key = gapMatch[1];

    return `
      <input
        class="fill-gap-input"
        type="text"
        name="question-${questionIndex}-gap-${escapeAttribute(key)}"
        placeholder="${escapeAttribute(key)}"
        autocomplete="off"
      >
    `;
  }).join("");
}

function renderFormattedContent(value) {
  const escapedValue = escapeHtml(value).replace(/\r\n/g, "\n");
  const parts = [];
  const codeBlockPattern = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockPattern.exec(escapedValue)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderFormattedText(escapedValue.slice(lastIndex, match.index)));
    }

    const language = match[1]
      ? ` language-${escapeAttribute(match[1])}`
      : "";

    parts.push(`<pre class="formatted-code-block"><code class="${language.trim()}">${match[2]}</code></pre>`);
    lastIndex = codeBlockPattern.lastIndex;
  }

  if (lastIndex < escapedValue.length) {
    parts.push(renderFormattedText(escapedValue.slice(lastIndex)));
  }

  return parts.join("");
}

function renderFormattedText(escapedText) {
  return escapedText
    .split(/(`[^`\n]+`)/g)
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return `<code class="formatted-inline-code">${part.slice(1, -1)}</code>`;
      }

      return part.replace(/\n/g, "<br>");
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function typesetMath() {
  if (!window.MathJax) {
    mathTypesetPending = true;
    return;
  }

  const runTypeset = () => {
    if (window.MathJax.typesetPromise) {
      mathTypesetPending = false;
      window.MathJax.typesetPromise().catch((error) => {
        console.error(error);
      });
      return;
    }

    mathTypesetPending = true;
  };

  if (window.MathJax.startup && window.MathJax.startup.promise) {
    window.MathJax.startup.promise.then(runTypeset).catch((error) => {
      console.error(error);
    });
    return;
  }

  runTypeset();
}
