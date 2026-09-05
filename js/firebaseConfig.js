// ---------------------------------------------------------------------
// PASTE YOUR OWN FIREBASE PROJECT'S CONFIG HERE.
//
// Where to get it:
//   1. Go to https://console.firebase.google.com and create a project.
//   2. In your project, click the "</>" (web app) icon to register a web app.
//   3. Firebase shows you a `firebaseConfig` object -- copy those exact
//      values into the object below.
//
// This is safe to commit/leave public: these values are identifiers, not
// secrets. Firebase's real security comes from Firestore Security Rules
// (see the setup guide in README.md), not from hiding this file.
// ---------------------------------------------------------------------

export const firebaseConfig = {
  apiKey: "PASTE_ME",
  authDomain: "PASTE_ME",
  projectId: "PASTE_ME",
  storageBucket: "PASTE_ME",
  messagingSenderId: "PASTE_ME",
  appId: "PASTE_ME",
};

// The rest of the app checks this to know whether real Firebase config has
// been filled in yet, and falls back to guest-only (local-save) mode until it has.
export const firebaseConfigured = firebaseConfig.apiKey !== "PASTE_ME";
