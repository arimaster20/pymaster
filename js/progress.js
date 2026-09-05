// Everything about saving/loading progress, XP, levels, streaks, and badges.
// All of it lives in the browser's localStorage -- nothing leaves your device.

import { CURRICULUM } from "./curriculum.js";

const STORAGE_KEY = "pymaster_progress_v1";
const XP_PER_LEVEL = 100;

const BLANK_PROGRESS = () => ({
  xp: 0,
  streak: { count: 0, lastActiveDate: null },
  badges: [],
  completedChallenges: {}, // challengeId -> { xpEarned, hintsUsed, passed }
});

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return BLANK_PROGRESS();
    const parsed = JSON.parse(raw);
    return { ...BLANK_PROGRESS(), ...parsed };
  } catch (e) {
    console.warn("Could not read saved progress, starting fresh.", e);
    return BLANK_PROGRESS();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn("Could not save progress.", e);
  }
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  return BLANK_PROGRESS();
}

export function levelForXp(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpIntoLevel(xp) {
  return xp % XP_PER_LEVEL;
}

export function xpForNextLevel() {
  return XP_PER_LEVEL;
}

function todayString() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b) - new Date(a)) / msPerDay);
}

/** Call once when the app starts, to update the daily streak. */
export function touchStreak(progress) {
  const today = todayString();
  const last = progress.streak.lastActiveDate;
  if (last === today) {
    return progress; // already counted today
  }
  if (last && daysBetween(last, today) === 1) {
    progress.streak.count += 1;
  } else {
    progress.streak.count = 1; // gap of >1 day, or very first visit
  }
  progress.streak.lastActiveDate = today;
  saveProgress(progress);
  return progress;
}

/**
 * Records the result of attempting a challenge. Returns the XP actually
 * earned (0 if not passed, reduced if hints were used).
 */
export function recordChallengeResult(progress, challenge, passed, hintsUsed) {
  const already = progress.completedChallenges[challenge.id];
  if (!passed) {
    return 0;
  }
  const penalty = Math.min(hintsUsed * 0.3, 0.8); // each hint costs 30%, capped at 80% off
  const xpEarned = Math.max(Math.round(challenge.xp * (1 - penalty)), Math.round(challenge.xp * 0.2));

  // Only award XP the first time a challenge is passed.
  if (!already || !already.passed) {
    progress.xp += xpEarned;
    progress.completedChallenges[challenge.id] = { passed: true, hintsUsed, xpEarned };
    saveProgress(progress);
    return xpEarned;
  }
  return 0;
}

export function isChallengeCompleted(progress, challengeId) {
  return !!progress.completedChallenges[challengeId]?.passed;
}

export function lessonProgress(progress, lesson) {
  const total = lesson.challenges.length;
  const done = lesson.challenges.filter((c) => isChallengeCompleted(progress, c.id)).length;
  return { done, total, complete: total > 0 && done === total };
}

export function subjectProgress(progress, subject) {
  let total = 0;
  let done = 0;
  for (const lesson of subject.lessons) {
    total += lesson.challenges.length;
    done += lesson.challenges.filter((c) => isChallengeCompleted(progress, c.id)).length;
  }
  return { done, total, complete: total > 0 && done === total, percent: total ? Math.round((done / total) * 100) : 0 };
}

/** Subjects unlock in order -- finish ALL of one to unlock the next. */
export function isSubjectUnlocked(progress, subjectIndex) {
  if (subjectIndex === 0) return true;
  const prev = CURRICULUM[subjectIndex - 1];
  return subjectProgress(progress, prev).complete;
}

// ---- Badges -----------------------------------------------------------

const BADGE_DEFS = [
  {
    id: "first-steps",
    name: "First Steps",
    icon: "👣",
    description: "Complete your first challenge.",
    check: (p) => Object.keys(p.completedChallenges).length >= 1,
  },
  {
    id: "no-hints",
    name: "No Hints Needed",
    icon: "🎯",
    description: "Complete 5 challenges without using a single hint.",
    check: (p) => Object.values(p.completedChallenges).filter((c) => c.passed && c.hintsUsed === 0).length >= 5,
  },
  {
    id: "code-warrior",
    name: "Code Warrior",
    icon: "⚔️",
    description: "Pass 15 challenges total.",
    check: (p) => Object.values(p.completedChallenges).filter((c) => c.passed).length >= 15,
  },
  {
    id: "streak-3",
    name: "3-Day Streak",
    icon: "🔥",
    description: "Use PyMaster 3 days in a row.",
    check: (p) => p.streak.count >= 3,
  },
  {
    id: "streak-7",
    name: "7-Day Streak",
    icon: "🔥",
    description: "Use PyMaster 7 days in a row.",
    check: (p) => p.streak.count >= 7,
  },
  {
    id: "halfway",
    name: "Halfway There",
    icon: "🏔️",
    description: "Complete 50% of all challenges in PyMaster.",
    check: (p) => {
      const totalChallenges = CURRICULUM.flatMap((s) => s.lessons).flatMap((l) => l.challenges).length;
      const done = Object.values(p.completedChallenges).filter((c) => c.passed).length;
      return totalChallenges > 0 && done / totalChallenges >= 0.5;
    },
  },
  {
    id: "graduate",
    name: "Python Graduate",
    icon: "🎓",
    description: "Complete every subject in PyMaster.",
    check: (p) => CURRICULUM.every((s) => subjectProgress(p, s).complete),
  },
  ...CURRICULUM.map((subject) => ({
    id: `subject-${subject.id}`,
    name: `${subject.title} Master`,
    icon: subject.icon,
    description: `Complete every challenge in ${subject.title}.`,
    check: (p) => subjectProgress(p, subject).complete,
  })),
];

export function allBadgeDefs() {
  return BADGE_DEFS;
}

/** Call after recording a result. Returns newly earned badges (may be empty). */
export function evaluateBadges(progress) {
  const newly = [];
  for (const badge of BADGE_DEFS) {
    if (!progress.badges.includes(badge.id) && badge.check(progress)) {
      progress.badges.push(badge.id);
      newly.push(badge);
    }
  }
  if (newly.length) saveProgress(progress);
  return newly;
}
