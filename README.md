# Focus — Data Science Learning Tracker

Focus is a comprehensive, local-first (with cloud-sync capabilities) productivity application designed entirely to track a rigorous 112-day Data Science curriculum. It features habit tracking, daily shutdown routines, a Pomodoro focus timer, and an expanding interactive curriculum view.

The project exists in two robust formats:
1. **Focus Web (PWA):** Built with Vanilla JavaScript, HTML, and CSS. It boasts offline capabilities, local storage, PWA install prompts, and a stunning "glassmorphism" animated dark theme.
2. **Focus Mobile (React Native):** A full native port built using Expo SDK 51. Featuring React Navigation bottom tabs, native AsyncStorage, Expo Notifications for push reminders, and Android/iOS support.

## 🚀 Features

*   **112-Day Curriculum Tracker:** A detailed syllabus covering Python, SQL, Machine Learning, Deep Learning, NLP, and GenAI (LangChain/RAG).
*   **Progress Dashboard:** Real-time stream day tracking, streak counters, and month-by-month progress bars.
*   **Daily Log:** 
    *   End-of-day 5-minute shutdown checklist.
    *   Daily mood tracker (Emojis).
    *   Categorized daily notes (Learned, Built, Confusing).
*   **Discipline & Focus:** 
    *   Customizable "Focus Timer" (Pomodoro technique) with preset intervals.
    *   Daily habits checklist with independent streak counters.
    *   Dynamic "Discipline Score" calculation.
*   **Firebase Integration:** Google Sign-In and robust multi-device Firestore data synchronization.

## 📁 Repository Structure

```text
Focus/
├── index.html           # Web App Shell & Login Screen
├── style.css            # Premium Web Dark Theme Styles
├── app.js               # Web Core Logic (UI updates, DOM manipulation)
├── auth.js              # Web Firebase Authentication & CRUD Logic
├── data.js              # Source of truth for Curriculum & Presets (Used by Web & Mobile)
├── firebase-config.js   # Web Firebase Initialization
├── manifest.json        # Web PWA Manifest
├── service-worker.js    # Web Offline File Caching
│
└── FocusMobile/         # React Native (Expo) Implementation
    ├── App.js           # Native Router & Bottom Tabs
    ├── src/
    │   ├── AppContext.js   # Global React State & Storage sync
    │   ├── firebase.js     # Native Firebase initialization
    │   ├── data.js         # Copied curriculum
    │   └── screens/        # Native Views (Dashboard, Curriculum, Log, Discipline)
```

## 🛠️ Setup & Installation

### Running the Web Version (PWA)
1. Provide your Firebase keys in `firebase-config.js`.
2. Start a local server:
   ```bash
   python -m http.server 3377
   ```
3. Open `http://localhost:3377` in Chrome or Safari and click "Install App" in the URL bar.

### Running the Mobile Version (React Native)
1. Install [Expo Go](https://expo.dev/client) on your iOS or Android device.
2. Navigate to the mobile directory:
   ```bash
   cd FocusMobile
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the native bundler:
   ```bash
   npx expo start
   ```
5. Scan the QR code with your phone!

## 🛡️ Theme & Design
Focus uses a modern, deep dark palette (`#0a0a0f`, `#14141e`) accented by vivid neons (`#7c3aed`, `#0ea5e9`). It relies heavily on soft glowing radial shadows, borders rounded at `16px/24px`, and `Inter/Outfit` style semi-bold typography.
