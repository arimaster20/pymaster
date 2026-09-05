// Wraps Firebase Auth (Google sign-in) + Firestore (cloud progress storage).
//
// Deliberately fails "soft": if firebaseConfig.js still has placeholder
// values, this whole module just quietly does nothing, and the app keeps
// working in guest/local-only mode (see progress.js). Nothing breaks
// before you've set up your own Firebase project.

import { firebaseConfig, firebaseConfigured } from "./firebaseConfig.js";

let app = null;
let auth = null;
let db = null;
let currentUser = null;
let authChangeListeners = [];

if (firebaseConfigured) {
  const [{ initializeApp }, authModule, firestoreModule] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"),
    import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"),
  ]);

  app = initializeApp(firebaseConfig);
  auth = authModule.getAuth(app);
  db = firestoreModule.getFirestore(app);

  authModule.onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authChangeListeners.forEach((cb) => cb(user));
  });

  // Stash the modules on the functions below via closures.
  window.__pymasterFirebase = { authModule, firestoreModule, auth, db };
}

export function isCloudEnabled() {
  return firebaseConfigured;
}

export function getCurrentUser() {
  return currentUser;
}

/** Registers a callback fired with the Firebase user object (or null) whenever sign-in state changes. */
export function onAuthChange(callback) {
  authChangeListeners.push(callback);
}

export async function signInWithGoogle() {
  if (!firebaseConfigured) {
    alert("Cloud sync isn't set up yet -- this PyMaster instance hasn't been connected to a Firebase project. See README.md for setup steps.");
    return;
  }
  const { authModule } = window.__pymasterFirebase;
  const provider = new authModule.GoogleAuthProvider();
  try {
    await authModule.signInWithPopup(auth, provider);
  } catch (err) {
    console.warn("Sign-in failed or was cancelled", err);
  }
}

export async function signOutUser() {
  if (!firebaseConfigured) return;
  const { authModule } = window.__pymasterFirebase;
  await authModule.signOut(auth);
}

export async function fetchCloudProgress(uid) {
  if (!firebaseConfigured) return null;
  const { firestoreModule } = window.__pymasterFirebase;
  const ref = firestoreModule.doc(db, "progress", uid);
  const snap = await firestoreModule.getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveCloudProgress(uid, progressData) {
  if (!firebaseConfigured) return;
  const { firestoreModule } = window.__pymasterFirebase;
  const ref = firestoreModule.doc(db, "progress", uid);
  await firestoreModule.setDoc(ref, progressData);
}
