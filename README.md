# Canvas Quiz Replicator

A small static web app that recreates a Canvas-style quiz experience. It renders quiz questions from a JavaScript data file, lets users answer different question types, and shows a results page with the final score and correct answers.

## What It Does

- Displays a quiz title, description, and several question types.
- Shows a fixed top bar with `Return` and `Submit` controls.
- Shows a left sidebar with numbered question shortcuts.
- Supports multiple choice, multiple answer, matching, and fill-in-the-gap questions.
- Calculates the final score when the quiz is submitted.
- Displays a results view with:
  - Percentage score
  - Points earned
  - Each submitted answer
  - Correct and incorrect answer highlighting

## Project Structure

```text
.
├── index.html      # Page markup, layout, and CSS styles
├── questions.js    # Quiz title, description, questions, options, and answers
└── script.js       # Rendering logic, sidebar navigation, scoring, and results UI
```

## How To Run It

This project does not require a build step, package manager, or server.

Open `index.html` directly in a web browser:

```text
index.html
```

You can also run a simple local server from the project folder if you prefer:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Editing The Quiz

Quiz content lives in `questions.js`.

The quiz is configured through the `QUIZ_DATA` object:

```js
const QUIZ_DATA = {
  title: "Weeks 1 and 2",
  description: "Questions to test your knowledge",
  questions: [
    // question objects go here
  ]
};
```

Each question should include a `type`, `text`, and `points` value. Supported question types are:

## Question Types

### Multiple Choice

Use `type: "multi-choice"` when there is one correct answer. The `correct` value is the zero-based index of the correct option.

```js
{
  type: "multi-choice",
  text: "Which command is used to stage changes in Git before committing?",
  options: [
    "git push",
    "git add",
    "git stage",
    "git save"
  ],
  correct: 1,
  points: 1
}
```

Index values start at `0`, so `correct: 1` means the second option.

### Multiple Answer

Use `type: "multi-answer"` when more than one option is correct. The `correct` value is an array of zero-based option indexes. These questions render as square checkboxes.

```js
{
  type: "multi-answer",
  text: "Which of the following are useful Git commands for inspecting repository state?",
  options: [
    "git status",
    "git commit",
    "git log",
    "git diff",
    "git delete-history"
  ],
  correct: [0, 2, 3],
  points: 3
}
```

Multiple-answer questions use negative marking:

- Correct selections add credit.
- Incorrect selections subtract credit.
- The score cannot go below `0`.
- Partial marks are awarded based on the number of correct answers.

### Matching

Use `type: "matching"` when the user should match prompts to dropdown answers. Each item in `matches` has a `prompt`, a list of dropdown `options`, and a `correct` index.

```js
{
  type: "matching",
  text: "Match the capability with the generation of C++ that introduced it",
  matches: [
    {
      prompt: "Classes",
      options: [
        "C++11",
        "Pre-standard C++",
        "C++98"
      ],
      correct: 1
    },
    {
      prompt: "Generic programming and templates",
      options: [
        "C++11",
        "Pre-standard C++",
        "C++98"
      ],
      correct: 2
    }
  ],
  points: 2
}
```

Matching questions award partial credit per correctly matched row.

### Fill In The Gaps

Use `type: "fill-gap"` when the question text contains missing keywords. Add placeholders in the text using braces, such as `{word_1}`, then provide the correct answers in the `answers` object using the same keys.

```js
{
  type: "fill-gap",
  text:
    "In the Week 9 architecture, the {word_1} class retrieves timeline data, the {word_2} class represents individual posts, and the {word_3} class is used to publish new content.",
  answers: {
    word_1: "Timelines",
    word_2: "Status",
    word_3: "Statuses"
  },
  points: 3
}
```

Fill-gap answers are not case sensitive, so `timelines`, `Timelines`, and `TIMELINES` are treated as the same answer. Whitespace at the start or end is ignored.

Fill-gap questions award partial credit per correctly completed gap.

## Current Limitations

- Quiz data is stored locally in `questions.js`.
- Results are not saved after the page is refreshed.
- There is no backend or Canvas API integration.

## Notes

Because the app renders quiz text and answers into the page, only use trusted content in `questions.js`. If quiz data is later loaded from users or an external API, the rendering logic should be updated to avoid inserting untrusted HTML directly.
