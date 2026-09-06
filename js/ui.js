import { CURRICULUM, findLesson, findChallenge } from "./curriculum.js";
import {
  loadProgress, saveProgress, touchStreak, levelForXp, xpIntoLevel, xpForNextLevel,
  recordChallengeResult, isChallengeCompleted, lessonProgress, subjectProgress,
  isSubjectUnlocked, allBadgeDefs, evaluateBadges,
} from "./progress.js";
import { runChallenge, gradeResult, isPyodideReady } from "./pyodideRunner.js";
import { isCloudEnabled, getCurrentUser, onAuthChange, signInWithGoogle, signOutUser } from "./authSync.js";
import { pushProgressToCloud, reconcileProgressOnSignIn } from "./cloudSync.js";

let progress = null;

const root = () => document.getElementById("app");
const q = (sel) => document.querySelector(sel);
const qa = (sel) => Array.from(document.querySelectorAll(sel));

function goto(hash) {
  window.location.hash = hash;
}

function escapeAttr(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function parseHash() {
  return (window.location.hash.slice(1) || "").split("/").filter(Boolean);
}

// ---------------------------------------------------------------------
// Shared chrome
// ---------------------------------------------------------------------

function accountHtml() {
  if (!isCloudEnabled()) {
    return `<div class="stat" title="This PyMaster instance hasn't been connected to a Firebase project yet -- see README.md.">💾 Local only</div>`;
  }
  const user = getCurrentUser();
  if (user) {
    const name = escapeAttr(user.displayName || user.email || "Signed in");
    return `
      <div class="stat" title="Synced to your Google account">☁️ ${name}</div>
      <button class="btn-ghost" id="sign-out-btn" style="padding:6px 10px;">Sign Out</button>`;
  }
  return `<button class="btn-secondary" id="sign-in-btn" style="padding:8px 14px;">Sign in with Google to sync</button>`;
}

function topbarHtml() {
  const level = levelForXp(progress.xp);
  const into = xpIntoLevel(progress.xp);
  const need = xpForNextLevel();
  const pct = Math.round((into / need) * 100);
  return `
    <div class="topbar">
      <div class="brand" data-nav="/">🐍 PyMaster</div>
      <div class="stats">
        <div class="stat">🔥 <b>${progress.streak.count}</b> day streak</div>
        <div class="stat">⭐ <b>${progress.xp}</b> XP</div>
        <div class="stat">Level <b>${level}</b></div>
        <div class="level-bar-wrap">
          <div class="level-bar"><div class="level-bar-fill" style="width:${pct}%"></div></div>
          <span style="font-size:12px;color:var(--text-muted)">${into}/${need}</span>
        </div>
        ${accountHtml()}
      </div>
    </div>`;
}

function toast(title, desc, icon) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<div class="icon">${icon}</div><div><div class="title">${title}</div><div class="desc">${desc}</div></div>`;
  container.appendChild(t);
  setTimeout(() => t.remove(), 4500);
}

function showBadgeToasts(newBadges) {
  newBadges.forEach((b) => toast(`Badge earned: ${b.name}`, b.description, b.icon));
}

/** Updates just the top bar's XP/level/streak/account display in place,
 * without touching the rest of the current view (e.g. visible challenge
 * feedback) the way a full render() would. */
function refreshTopbar() {
  const old = document.querySelector(".topbar");
  if (!old) return;
  old.outerHTML = topbarHtml();
  attachTopbarNav();
}

function attachTopbarNav() {
  q('[data-nav="/"]')?.addEventListener("click", () => goto("/"));
  q("#sign-in-btn")?.addEventListener("click", () => signInWithGoogle());
  q("#sign-out-btn")?.addEventListener("click", () => signOutUser());
}

// ---------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------

function renderDashboard() {
  const badgeDefs = allBadgeDefs();
  const earnedCount = progress.badges.length;

  const badgeRow = badgeDefs
    .map((b) => {
      const earned = progress.badges.includes(b.id);
      return `<div class="badge-chip ${earned ? "" : "locked"}" title="${escapeAttr(b.description)}">
        <span class="icon">${b.icon}</span> ${b.name}
      </div>`;
    })
    .join("");

  const subjectCards = CURRICULUM.map((subject, idx) => {
    const unlocked = isSubjectUnlocked(progress, idx);
    const sp = subjectProgress(progress, subject);
    return `
      <div class="subject-card ${unlocked ? "" : "locked"}" data-subject="${subject.id}" data-unlocked="${unlocked}">
        <div class="icon">${subject.icon}</div>
        <h3>${subject.title}</h3>
        <p>${subject.description}</p>
        ${unlocked
          ? `<div class="progress-track"><div class="progress-fill" style="width:${sp.percent}%"></div></div>
             <div class="progress-label">${sp.done}/${sp.total} challenges complete</div>`
          : `<div class="lock-note">🔒 Complete "${CURRICULUM[idx - 1].title}" to unlock</div>`
        }
      </div>`;
  }).join("");

  root().innerHTML = `
    ${topbarHtml()}
    <div class="container">
      <div class="dashboard-header">
        <h1>Welcome back!</h1>
        <p>${earnedCount}/${badgeDefs.length} badges earned. Pick a subject to keep going.</p>
      </div>
      <div class="badge-row">${badgeRow}</div>
      <div class="subject-grid">${subjectCards}</div>
    </div>`;

  attachTopbarNav();
  qa("[data-subject]").forEach((card) => {
    card.addEventListener("click", () => {
      if (card.dataset.unlocked === "true") goto(`/subject/${card.dataset.subject}`);
    });
  });
}

// ---------------------------------------------------------------------
// Subject view
// ---------------------------------------------------------------------

function renderSubjectView(subjectId) {
  const subject = CURRICULUM.find((s) => s.id === subjectId);
  if (!subject) return goto("/");

  const rows = subject.lessons
    .map((lesson) => {
      const lp = lessonProgress(progress, lesson);
      return `
        <div class="lesson-row" data-lesson="${lesson.id}">
          <div>
            <div class="title">${lesson.title}</div>
            <div class="meta">${lp.done}/${lp.total} challenges complete</div>
          </div>
          <div class="check">${lp.complete ? "✅" : "▶️"}</div>
        </div>`;
    })
    .join("");

  root().innerHTML = `
    ${topbarHtml()}
    <div class="container">
      <div class="back-link" data-back>← All Subjects</div>
      <div class="dashboard-header">
        <h1>${subject.icon} ${subject.title}</h1>
        <p>${subject.description}</p>
      </div>
      <div class="lesson-list">${rows}</div>
    </div>`;

  attachTopbarNav();
  q("[data-back]").addEventListener("click", () => goto("/"));
  qa("[data-lesson]").forEach((row) => {
    row.addEventListener("click", () => goto(`/lesson/${subject.id}/${row.dataset.lesson}`));
  });
}

// ---------------------------------------------------------------------
// Lesson view
// ---------------------------------------------------------------------

function challengeTypeLabel(challenge) {
  if (challenge.type === "quiz") return "Quiz";
  if (challenge.type === "fill_blank") return "Fill in the Blank";
  return "Code Challenge";
}

function renderLessonView(subjectId, lessonId) {
  const found = findLesson(lessonId);
  if (!found) return goto("/");
  const { subject, lesson } = found;

  const rows = lesson.challenges
    .map((challenge, i) => {
      const done = isChallengeCompleted(progress, challenge.id);
      return `
        <div class="challenge-row" data-challenge="${challenge.id}">
          <div>
            <span class="type-tag">${challengeTypeLabel(challenge)}</span>
            &nbsp; Challenge ${i + 1}
          </div>
          <div>${done ? "✅" : "○"}</div>
        </div>`;
    })
    .join("");

  root().innerHTML = `
    ${topbarHtml()}
    <div class="container">
      <div class="back-link" data-back>← ${subject.title}</div>
      <div class="dashboard-header"><h1>${lesson.title}</h1></div>
      <div class="lesson-explanation">${lesson.explanation}</div>
      <div class="challenge-list">${rows}</div>
    </div>`;

  attachTopbarNav();
  q("[data-back]").addEventListener("click", () => goto(`/subject/${subject.id}`));
  qa("[data-challenge]").forEach((row) => {
    row.addEventListener("click", () => goto(`/challenge/${lesson.id}/${row.dataset.challenge}`));
  });
}

// ---------------------------------------------------------------------
// Challenge view
// ---------------------------------------------------------------------

function normalizeAnswer(s) {
  return s.trim().toLowerCase();
}

function renderChallengeView(lessonId, challengeId) {
  const found = findChallenge(challengeId);
  if (!found) return goto("/");
  const { subject, lesson, challenge } = found;
  const idx = lesson.challenges.findIndex((c) => c.id === challengeId);
  const nextChallenge = lesson.challenges[idx + 1];

  const viewState = { hintsUsed: 0, answered: false, editor: null };

  function renderBody() {
    let inputHtml = "";
    if (challenge.type === "quiz") {
      inputHtml = `<div class="choice-list">${challenge.choices
        .map((c, i) => `<button class="choice-btn" data-choice="${i}">${c}</button>`)
        .join("")}</div>`;
    } else if (challenge.type === "fill_blank") {
      inputHtml = `<input type="text" class="text-input" id="fb-input" placeholder="Type your answer..." />
        <div class="action-row"><button class="btn-primary" id="submit-btn">Submit</button></div>`;
    } else if (challenge.type === "code") {
      inputHtml = `<textarea id="code-editor"></textarea>
        <div class="action-row">
          <button class="btn-primary" id="run-btn">▶ Run &amp; Check</button>
          <button class="btn-secondary" id="reset-btn">Reset Code</button>
        </div>`;
    }

    const alreadyDone = isChallengeCompleted(progress, challenge.id);

    root().innerHTML = `
      ${topbarHtml()}
      <div class="container">
        <div class="back-link" data-back>← ${lesson.title}</div>
        <div class="challenge-card">
          <div class="xp-tag">+${challenge.xp} XP ${alreadyDone ? "&middot; already completed (practice mode)" : ""}</div>
          <div class="prompt">${challenge.prompt}</div>
          ${inputHtml}
          <div class="action-row">
            <button class="btn-ghost" id="hint-btn">💡 Hint (${challenge.hints.length - viewState.hintsUsed} left)</button>
          </div>
          <div id="hint-area"></div>
          <div id="feedback-area"></div>
          <div class="nav-buttons">
            <button class="btn-secondary" id="lesson-btn">Back to Lesson</button>
            ${nextChallenge ? `<button class="btn-primary" id="next-btn">Next Challenge →</button>` : ""}
          </div>
        </div>
      </div>`;

    attachTopbarNav();
    q("[data-back]").addEventListener("click", () => goto(`/lesson/${subject.id}/${lesson.id}`));
    q("#lesson-btn").addEventListener("click", () => goto(`/lesson/${subject.id}/${lesson.id}`));
    q("#next-btn")?.addEventListener("click", () => goto(`/challenge/${lesson.id}/${nextChallenge.id}`));

    q("#hint-btn").addEventListener("click", () => {
      if (viewState.hintsUsed >= challenge.hints.length) return;
      const hintArea = q("#hint-area");
      hintArea.insertAdjacentHTML(
        "beforeend",
        `<div class="hint-box">💡 Hint ${viewState.hintsUsed + 1}: ${challenge.hints[viewState.hintsUsed]}</div>`
      );
      viewState.hintsUsed += 1;
      const btn = q("#hint-btn");
      const remaining = challenge.hints.length - viewState.hintsUsed;
      btn.textContent = remaining > 0 ? `💡 Hint (${remaining} left)` : "No more hints";
      if (remaining === 0) btn.disabled = true;
    });

    if (challenge.type === "quiz") setupQuiz();
    else if (challenge.type === "fill_blank") setupFillBlank();
    else if (challenge.type === "code") setupCode();
  }

  function finishChallenge(passed) {
    if (!passed) return;
    const xpEarned = recordChallengeResult(progress, challenge, true, viewState.hintsUsed);
    const newBadges = evaluateBadges(progress);
    if (xpEarned > 0) toast("Challenge complete!", `+${xpEarned} XP`, "⭐");
    showBadgeToasts(newBadges);
    pushProgressToCloud(progress);
    refreshTopbar();
  }

  function showFeedback(passed, message) {
    const area = q("#feedback-area");
    area.innerHTML = `<div class="feedback-box ${passed ? "pass" : "fail"}">${passed ? "✅ " : "❌ "}${message}</div>`;
  }

  function setupQuiz() {
    qa(".choice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (viewState.answered) return;
        viewState.answered = true;
        const chosen = Number(btn.dataset.choice);
        const passed = chosen === challenge.correctIndex;
        qa(".choice-btn").forEach((b, i) => {
          if (i === challenge.correctIndex) b.classList.add("correct");
          else if (i === chosen) b.classList.add("incorrect");
        });
        showFeedback(passed, passed ? "Correct!" : "Not quite -- the correct answer is highlighted above.");
        if (!passed) {
          const retry = document.createElement("button");
          retry.className = "btn-secondary";
          retry.textContent = "Try Again";
          retry.style.marginTop = "10px";
          retry.addEventListener("click", () => renderBody());
          q("#feedback-area").appendChild(retry);
        }
        finishChallenge(passed);
      });
    });
  }

  function setupFillBlank() {
    q("#submit-btn").addEventListener("click", () => {
      const val = normalizeAnswer(q("#fb-input").value);
      const passed = challenge.accepted.some((a) => normalizeAnswer(a) === val);
      showFeedback(passed, passed ? "Correct!" : "Not quite -- try again, or use a hint.");
      finishChallenge(passed);
    });
  }

  function setupCode() {
    const textarea = q("#code-editor");
    const draftKey = `pymaster_draft_${challenge.id}`;
    const saved = localStorage.getItem(draftKey);
    textarea.value = saved || challenge.starterCode;

    viewState.editor = window.CodeMirror.fromTextArea(textarea, {
      mode: "python",
      theme: "default",
      lineNumbers: true,
      indentUnit: 4,
      tabSize: 4,
    });
    viewState.editor.on("change", () => {
      localStorage.setItem(draftKey, viewState.editor.getValue());
    });

    q("#reset-btn").addEventListener("click", () => {
      viewState.editor.setValue(challenge.starterCode);
      localStorage.removeItem(draftKey);
    });

    q("#run-btn").addEventListener("click", async () => {
      const runBtn = q("#run-btn");
      runBtn.disabled = true;
      const originalLabel = runBtn.textContent;
      const area = q("#feedback-area");

      const onStatus = (msg) => {
        if (msg !== "ready") {
          area.innerHTML = `<div class="loading-banner"><div class="spinner"></div>${msg}</div>`;
        }
      };
      if (!isPyodideReady()) onStatus("Loading Python engine (first time only, a few seconds)...");
      runBtn.textContent = "Running...";

      const code = viewState.editor.getValue();
      try {
        const result = await runChallenge(challenge, code, onStatus);
        const graded = gradeResult(challenge, result);
        showFeedback(graded.passed, graded.details);
        finishChallenge(graded.passed);
      } catch (err) {
        showFeedback(false, `Something went wrong running your code: ${err}`);
      } finally {
        runBtn.disabled = false;
        runBtn.textContent = originalLabel;
      }
    });
  }

  renderBody();
}

// ---------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------

function render() {
  const parts = parseHash();
  if (parts[0] === "subject" && parts[1]) return renderSubjectView(parts[1]);
  if (parts[0] === "lesson" && parts[1] && parts[2]) return renderLessonView(parts[1], parts[2]);
  if (parts[0] === "challenge" && parts[1] && parts[2]) return renderChallengeView(parts[1], parts[2]);
  return renderDashboard();
}

export function initApp() {
  progress = touchStreak(loadProgress());
  window.addEventListener("hashchange", render);
  render();

  // Firebase always fires this callback once immediately on page load with
  // whatever the current auth state is (often just "not signed in" for a
  // guest) -- that first call is not a real sign-out event, so it should
  // NOT blow away whatever view the user is already looking at (e.g. a
  // challenge mid-attempt, or a just-earned "Correct!" result). Only
  // re-render for a *genuine* sign-out that happens after that.
  let authInitialized = false;
  onAuthChange(async (user) => {
    if (!user) {
      if (authInitialized) render(); // a real sign-out -- refresh the view
      authInitialized = true;
      return;
    }
    authInitialized = true;
    progress = await reconcileProgressOnSignIn(progress);
    saveProgress(progress); // keep localStorage as an offline-readable cache
    render();
  });
}
