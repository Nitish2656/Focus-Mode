// ============================================================
// firebase-config.js — Focus DS Tracker
// ============================================================
// ⚠️  PASTE YOUR FIREBASE CONFIG HERE
//     From: Firebase Console → Project Settings → Your apps → Web
//
// If you haven't created a Firebase project yet, follow this guide:
// https://firebase.google.com/docs/web/setup
// ============================================================

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// ── Initialize Firebase ────────────────────────────────────────
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth        = firebase.auth();
const db          = firebase.firestore();

// ── Google Auth Provider ───────────────────────────────────────
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Firestore Settings (offline persistence) ───────────────────
db.enablePersistence({ synchronizeTabs: true })
  .catch(err => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open — persistence only works in one tab at a time
      console.warn('Firestore persistence disabled (multiple tabs)');
    } else if (err.code === 'unimplemented') {
      // Browser doesn't support persistence
      console.warn('Firestore persistence not supported in this browser');
    }
  });
