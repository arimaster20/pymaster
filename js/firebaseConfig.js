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
  apiKey: "AIzaSyDQy1GG_EUZaBG_n-Xq93w9ELNpY6VmUfY",
  authDomain: "pymaster-6a33d.firebaseapp.com",
  projectId: "pymaster-6a33d",
  storageBucket: "pymaster-6a33d.firebasestorage.app",
  messagingSenderId: "265969049617",
  appId: "1:265969049617:web:20bf26b3e8e4dbc56a51b0",
};

// The rest of the app checks this to know whether real Firebase config has
// been filled in yet, and falls back to guest-only (local-save) mode until it has.
export const firebaseConfigured = firebaseConfig.apiKey !== "PASTE_ME";
