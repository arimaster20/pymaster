# PyMaster

**Live at: https://pymaster-6a33d.web.app**

A gamified, browser-based app for learning Python — real Python code runs live in the browser, no install required. Works entirely offline/local by default, with optional cloud sync so progress follows you across devices.

**Live features:**
- **19 subjects**, 35 lessons, 80+ challenges — from variables and loops up through comprehensions, recursion, generators, decorators, regex, and JSON
- Every lesson pairs a short explanation with a mix of **multiple-choice, fill-in-the-blank, and real code-writing challenges**
- Code challenges run **actual Python**, checked against real test cases — not string matching
- A 3-tier **hint system** on every challenge (reduces XP earned, never blocks you)
- **XP, levels, a daily streak counter, and 19 badges**
- Subjects **unlock progressively** as you complete the one before it
- Progress **auto-saves in your browser** by default (works with zero setup), with an **optional "Sign in with Google"** to sync that same progress across every device
- Installable as an app on your phone's home screen (PWA) — no app store needed

## Try it locally

No install beyond Python itself (used only to serve the files, not to run the app):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser. Everything works immediately in guest mode — cloud sync is optional and requires the one-time setup below.

## How this was built

This is a **static, client-side web app** — there is no backend server to run or maintain yourself. Every file here runs entirely inside the browser tab; the only server-side piece is Google's own Firebase platform, used purely for optional sign-in and cross-device storage.

**Frontend:**
- `index.html` / `style.css` — page structure and styling (responsive, works on mobile)
- Plain JavaScript, deliberately with no framework (no React/Vue), split by responsibility:
  - `js/curriculum.js` — all lesson and challenge content, as structured data
  - `js/progress.js` — XP, levels, streaks, and badges; persisted via the browser's built-in `localStorage`, which is why progress survives without any server, even for guests
  - `js/pyodideRunner.js` — the interesting part: wraps **[Pyodide](https://pyodide.org/)**, which is the real CPython interpreter compiled to WebAssembly. When you submit a code challenge, it is genuinely executed live in the browser by a real Python interpreter, not simulated
  - `js/authSync.js` — wraps Firebase Authentication (Google sign-in) and exposes the current signed-in user, if any
  - `js/cloudSync.js` — bridges local progress with the Firestore cloud copy: pushes updates when signed in, and reconciles which copy (local vs. cloud) wins right after signing in
  - `js/ui.js` — renders every screen and handles navigation/clicks
  - `js/main.js` — entry point; also registers the service worker for offline/installable support

**How grading works:** a code challenge's submitted code is wrapped in a small generated Python "test harness" that calls your function against several test cases and checks the results — the same basic idea as unit testing.

**Why sign-in is optional, not required:** the whole app works with zero setup and zero accounts (progress just lives in your browser). Signing in is purely additive — it uploads that same progress to Firestore under your account, so opening PyMaster on a different device pulls it back down. Nobody is forced through a signup wall just to try a lesson.

**On the AI-assisted development:** this app's requirements, curriculum design, gamification mechanics, and tech-stack decisions were driven through an iterative design process, then implemented with Claude (Anthropic's AI coding assistant) as the coding tool, and verified with real automated tests (headless-browser checks that actually execute the Python challenges end-to-end, not just visual review) before being considered done.

## Setting up cloud sync (optional)

The live deployment above already has this fully set up (Firebase Auth + Firestore) — these steps are for anyone forking this repo who wants to connect their own Firebase project instead. Without this setup, PyMaster works completely fine in guest-only mode.

1. Go to the [Firebase console](https://console.firebase.google.com) and create a new project (free).
2. In the project, click **Build → Authentication → Get Started**, enable the **Google** sign-in provider.
3. Click **Build → Firestore Database → Create database** (start in production mode).
4. In Firestore's **Rules** tab, replace the default rules with the following, so each signed-in user can only read/write their own progress document:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /progress/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
5. Back in Project Settings → General → "Your apps", click the **`</>`** (web app) icon to register a web app, and copy the `firebaseConfig` object it shows you.
6. Paste those values into `js/firebaseConfig.js` in this project (replacing the `"PASTE_ME"` placeholders).
7. Reload PyMaster — a "Sign in with Google" button now appears in the top bar and actually works.

To deploy your own copy to Firebase Hosting: install the Firebase CLI (`npm install -g firebase-tools`), run `firebase login`, create `firebase.json` (`{"hosting": {"public": ".", "ignore": ["firebase.json", "**/.*", ".git/**", ".firebase/**", "**/node_modules/**"]}}`) and `.firebaserc` (`{"projects": {"default": "YOUR-PROJECT-ID"}}`) in this folder, then run `firebase deploy --only hosting`.

## Installing it like an app (PWA)

Once PyMaster is running at some address (locally or deployed), open it in a mobile browser and use "Add to Home Screen" (Safari) or the install prompt (Chrome/Android) — it installs with its own icon and opens full-screen, no app store needed. This works because of `manifest.json` and `sw.js` in this project.

## Project structure

```
pymaster/
  index.html
  style.css
  manifest.json       # PWA metadata (name, icons, colors)
  sw.js               # service worker -- caches the app shell for offline/installable use
  icons/              # app icons used by manifest.json and iOS home-screen install
  js/
    curriculum.js     # lesson & challenge content
    progress.js       # XP / levels / streaks / badges / local save-load
    pyodideRunner.js  # runs real Python via Pyodide, grades results
    authSync.js       # Firebase Auth wrapper (Google sign-in)
    cloudSync.js      # syncs local progress with Firestore when signed in
    firebaseConfig.js # your own Firebase project's config goes here
    ui.js             # view rendering, routing, event handling
    main.js           # entry point, registers the service worker
```
