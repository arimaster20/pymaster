// Bridges progress.js's local (localStorage) progress object with the
// cloud copy in Firestore, when someone is signed in. Guest/local-only
// users never touch this -- it's purely additive.

import { getCurrentUser, fetchCloudProgress, saveCloudProgress } from "./authSync.js";

export async function pushProgressToCloud(progress) {
  const user = getCurrentUser();
  if (!user) return;
  try {
    await saveCloudProgress(user.uid, progress);
  } catch (err) {
    console.warn("Cloud sync (save) failed -- your progress is still safe locally.", err);
  }
}

/**
 * Called right after sign-in. Returns the progress to actually use:
 *   - If a cloud copy already exists, that wins (so a returning user's
 *     progress from another device carries over).
 *   - Otherwise, uploads the current local/guest progress as this
 *     account's very first cloud copy, so a first-time signer-in doesn't
 *     lose whatever they'd already done as a guest.
 */
export async function reconcileProgressOnSignIn(localProgress) {
  const user = getCurrentUser();
  if (!user) return localProgress;
  try {
    const cloud = await fetchCloudProgress(user.uid);
    if (cloud) return cloud;
    await saveCloudProgress(user.uid, localProgress);
    return localProgress;
  } catch (err) {
    console.warn("Cloud sync (initial fetch) failed -- continuing with local progress.", err);
    return localProgress;
  }
}
