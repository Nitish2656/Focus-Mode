// ============================================================
// auth.js — Firebase Auth & Firestore State Management
// ============================================================

// ── Refs ──────────────────────────────────────────────────────
let currentUser = null;
let userDocRef  = null;

// ── Firestore Paths ───────────────────────────────────────────
function getUserRef(uid)      { return db.collection('users').doc(uid); }
function getNotesRef(uid)     { return db.collection('users').doc(uid).collection('notes'); }
function getTodosRef(uid)     { return db.collection('users').doc(uid).collection('todos'); }

// ── Auth State Change ─────────────────────────────────────────
auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    userDocRef  = getUserRef(user.uid);
    showApp();
    await initApp(user);
  } else {
    currentUser = null;
    userDocRef  = null;
    showLogin();
  }
});

// ── Sign in / out ─────────────────────────────────────────────
async function signInWithGoogle() {
  const btn = document.getElementById('google-signin-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
  try {
    await auth.signInWithPopup(googleProvider);
  } catch (err) {
    console.error('Sign-in error:', err);
    if (btn) { btn.disabled = false; btn.textContent = 'Continue with Google'; }
    showAuthError(err.message);
  }
}

async function signOutUser() {
  try {
    await auth.signOut();
    showToast('Signed out successfully');
  } catch (err) {
    console.error('Sign-out error:', err);
  }
}

// ── UI: login ↔ app ───────────────────────────────────────────
function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

// ── Firestore Save / Load ─────────────────────────────────────
// Saves core state to Firestore (debounced by callers)
async function saveStateToFirestore(stateObj) {
  if (!userDocRef) return;
  try {
    await userDocRef.set(stateObj, { merge: true });
  } catch (err) {
    console.warn('Firestore save error:', err);
    // Fall back to localStorage
    localStorage.setItem(STATE_KEY, JSON.stringify(stateObj));
  }
}

// Loads state from Firestore on login
async function loadStateFromFirestore() {
  if (!userDocRef) return null;
  try {
    const snap = await userDocRef.get();
    if (snap.exists) return snap.data();
    return null;
  } catch (err) {
    console.warn('Firestore load error:', err);
    return null;
  }
}

// ── Notes: per-date sub-collection ───────────────────────────
async function saveNotesToFirestore(dateKey, notesObj) {
  if (!currentUser) return;
  try {
    await getNotesRef(currentUser.uid).doc(dateKey).set(notesObj, { merge: true });
  } catch (err) {
    console.warn('Notes save error:', err);
  }
}

async function loadNotesFromFirestore(dateKey) {
  if (!currentUser) return {};
  try {
    const snap = await getNotesRef(currentUser.uid).doc(dateKey).get();
    return snap.exists ? snap.data() : {};
  } catch (err) {
    return {};
  }
}

// ── Todos: sub-collection ────────────────────────────────────
async function saveTodosToFirestore(todos) {
  if (!currentUser) return;
  try {
    await getTodosRef(currentUser.uid).doc('list').set({ items: todos });
  } catch (err) {
    console.warn('Todos save error:', err);
    localStorage.setItem('focus_todos', JSON.stringify(todos));
  }
}

async function loadTodosFromFirestore() {
  if (!currentUser) return [];
  try {
    const snap = await getTodosRef(currentUser.uid).doc('list').get();
    return snap.exists ? (snap.data().items || []) : [];
  } catch (err) {
    return JSON.parse(localStorage.getItem('focus_todos') || '[]');
  }
}

// ── Weekly Review: Firestore ──────────────────────────────────
async function saveWeeklyReviewToFirestore(data) {
  if (!currentUser) return;
  try {
    await db.collection('users').doc(currentUser.uid)
      .collection('weekly').doc('review').set(data, { merge: true });
  } catch (err) {
    localStorage.setItem('focus_weekly_review', JSON.stringify(data));
  }
}

async function loadWeeklyReviewFromFirestore() {
  if (!currentUser) return {};
  try {
    const snap = await db.collection('users').doc(currentUser.uid)
      .collection('weekly').doc('review').get();
    return snap.exists ? snap.data() : {};
  } catch (err) {
    return JSON.parse(localStorage.getItem('focus_weekly_review') || '{}');
  }
}
