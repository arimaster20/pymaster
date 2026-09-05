# PyMaster

A gamified, browser-based app for learning Python — real Python code runs live in the browser, no install and no backend required.

**Live features:**
- **19 subjects**, 35 lessons, 80+ challenges — from variables and loops up through comprehensions, recursion, generators, decorators, regex, and JSON
- Every lesson pairs a short explanation with a mix of **multiple-choice, fill-in-the-blank, and real code-writing challenges**
- Code challenges run **actual Python**, checked against real test cases — not string matching
- A 3-tier **hint system** on every challenge (reduces XP earned, never blocks you)
- **XP, levels, a daily streak counter, and 19 badges**
- Subjects **unlock progressively** as you complete the one before it
- Progress **auto-saves in your browser** — close the tab, come back later, nothing is lost

## Try it locally

No install beyond Python itself (used only to serve the files, not to run the app):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

## How this was built

This is a **static, client-side web app** — there is no backend server and no database. Every file here runs entirely inside the browser tab.

**Frontend:**
- `index.html` / `style.css` — page structure and styling (responsive, works on mobile)
- Plain JavaScript, deliberately with no framework (no React/Vue), split by responsibility:
  - `js/curriculum.js` — all lesson and challenge content, as structured data
  - `js/progress.js` — XP, levels, streaks, and badges; persisted via the browser's built-in `localStorage`, which is why progress survives without any server
  - `js/pyodideRunner.js` — the interesting part: wraps **[Pyodide](https://pyodide.org/)**, which is the real CPython interpreter compiled to WebAssembly. When you submit a code challenge, it is genuinely executed live in the browser by a real Python interpreter, not simulated
  - `js/ui.js` — renders every screen and handles navigation/clicks
  - `js/main.js` — entry point

**How grading works:** a code challenge's submitted code is wrapped in a small generated Python "test harness" that calls your function against several test cases and checks the results — the same basic idea as unit testing.

**Why no backend:** everything the app needs (running code, checking answers, saving progress) can happen entirely on the user's own device, so there was no reason to add server infrastructure, hosting costs, or the security risk of running untrusted code server-side.

**On the AI-assisted development:** this app's requirements, curriculum design, gamification mechanics, and tech-stack decisions were driven through an iterative design process, then implemented with Claude (Anthropic's AI coding assistant) as the coding tool, and verified with real automated tests (headless-browser checks that actually execute the Python challenges end-to-end, not just visual review) before being considered done.

## Project structure

```
pymaster/
  index.html
  style.css
  js/
    curriculum.js     # lesson & challenge content
    progress.js       # XP / levels / streaks / badges / save-load
    pyodideRunner.js  # runs real Python via Pyodide, grades results
    ui.js             # view rendering, routing, event handling
    main.js           # entry point
```
