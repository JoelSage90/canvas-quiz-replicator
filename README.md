# Canvas Quiz Replicator

A small static web app that recreates a Canvas-style multiple-choice quiz experience. It renders quiz questions from a JavaScript data file, lets users select answers, and shows a results page with the final score and correct answers.

## What It Does

- Displays a quiz title, description, and multiple-choice questions.
- Shows a fixed top bar with `Return` and `Submit` controls.
- Shows a left sidebar with numbered question shortcuts.
- Lets users select one answer per question.
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

Each question uses this shape:

```js
{
  text: "Question text goes here",
  options: [
    "First answer",
    "Second answer",
    "Third answer",
    "Fourth answer"
  ],
  correct: 1
}
```

The `correct` value is the zero-based index of the correct option:

- `0` means the first option
- `1` means the second option
- `2` means the third option
- `3` means the fourth option

## Current Limitations

- All questions are multiple choice.
- Each question is worth 1 point.
- Quiz data is stored locally in `questions.js`.
- Results are not saved after the page is refreshed.
- There is no backend or Canvas API integration.

## Notes

Because the app renders quiz text and answers into the page, only use trusted content in `questions.js`. If quiz data is later loaded from users or an external API, the rendering logic should be updated to avoid inserting untrusted HTML directly.
