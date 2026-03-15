// ============================================================
// Focus DS Tracker — app.js v3 (Firebase + Firestore)
// ============================================================

// ── State ─────────────────────────────────────────────────────
const STATE_KEY = 'focus_tracker_v3';
let state = getDefaultState();

function getDefaultState() {
  return {
    checked: {},
    projects: {},
    shutdown: {},
    notes: {},
    reminder: { enabled: false, time: '21:00', days: [0,1,2,3,4,5,6] },
    streak: 0,
    maxStreak: 0,
    lastActive: null,
    startDate: new Date().toISOString().slice(0,10),
    quizPassed: {},
    quizSkipped: {},
    focusSessions: 0,
    moodLog: {},
    disciplineScore: 0,
    habits: [
      { id:'h1', label:'Study ≥1 hour',              icon:'📖', streak:0, lastDone:null },
      { id:'h2', label:'No social media before study', icon:'📵', streak:0, lastDone:null },
      { id:'h3', label:'8 hrs sleep',                 icon:'😴', streak:0, lastDone:null },
      { id:'h4', label:'Exercise / Walk',              icon:'🏃', streak:0, lastDone:null },
      { id:'h5', label:'Code review / GitHub push',   icon:'💻', streak:0, lastDone:null }
    ]
  };
}

// ── Save / Load (Firestore primary, localStorage fallback) ─────
let saveTimer = null;
function saveState() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    // Persist locally first (instant)
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    // Then sync to Firestore
    await saveStateToFirestore(state);
  }, 300);
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

// ── Called by auth.js after sign-in ───────────────────────────
async function initApp(user) {
  // Show user info in header
  renderUserBar(user);

  // Load from Firestore first; fall back to localStorage
  const cloudState = await loadStateFromFirestore();
  if (cloudState) {
    state = { ...getDefaultState(), ...cloudState };
  } else {
    const local = loadLocalState();
    if (local) state = { ...getDefaultState(), ...local };
  }
  // Ensure habits array always exists
  if (!state.habits) state.habits = getDefaultState().habits;
  if (!state.quizPassed) state.quizPassed = {};
  if (!state.quizSkipped) state.quizSkipped = {};
  if (!state.moodLog) state.moodLog = {};

  // Load weekly review from Firestore
  weeklyReview = await loadWeeklyReviewFromFirestore();

  updateStreak();
  if (state.reminder.enabled && 'Notification' in window && Notification.permission === 'granted') {
    startReminderLoop();
  }
  navigate('dashboard');

  setTimeout(() => {
    const skipped = getSkippedDays();
    if (skipped.length) {
      const plural = skipped.length > 1 ? 's' : '';
      showToast('⚠️ ' + skipped.length + ' skipped day' + plural + '! Tap the alert to recover.');
    }
  }, 1200);
}

function renderUserBar(user) {
  const el = document.getElementById('user-info');
  if (!el) return;
  el.innerHTML = `
    <img src="${user.photoURL || './icons/icon-192.png'}"
      alt="${user.displayName}" class="user-avatar"
      onerror="this.src='./icons/icon-192.png'"/>
    <span class="user-name">${user.displayName || user.email}</span>
  `;
}

// ── Date Helpers ───────────────────────────────────────────────
let viewingDate = new Date();
function todayStr()  { return new Date().toISOString().slice(0,10); }
function dateKey(d)  { return d.toISOString().slice(0,10); }
function formatDate(d) {
  return d.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' });
}

// ── Stream System ──────────────────────────────────────────────
function getStreamDay() {
  const start = new Date(state.startDate);
  const now = new Date();
  start.setHours(0,0,0,0); now.setHours(0,0,0,0);
  const diff = Math.floor((now - start) / 86400000);
  return Math.max(1, Math.min(diff + 1, 112));
}

function isSkipped(dayId) {
  if (typeof dayId !== 'number') return false;
  if (state.checked[String(dayId)]) return false;
  if (state.quizPassed[String(dayId)] || state.quizSkipped[String(dayId)]) return false;
  return dayId < getStreamDay();
}

function getSkippedDays() {
  const skipped = [];
  CURRICULUM.months.forEach(m => m.weeks.forEach(w => w.days.forEach(d => {
    if (!d.isProject && isSkipped(d.id)) skipped.push(d.id);
  })));
  return skipped;
}

// ── Progress ───────────────────────────────────────────────────
function getMonthProgress(monthIdx) {
  const month = CURRICULUM.months[monthIdx];
  let done = 0;
  month.weeks.forEach(w => w.days.forEach(d => {
    if (!d.isProject && state.checked[String(d.id)]) done++;
  }));
  return Math.min(100, Math.round((done / month.totalDays) * 100));
}

function getTotalProgress() {
  let done = 0;
  for (const key in state.checked) {
    if (state.checked[key] && !isNaN(Number(key))) done++;
  }
  return Math.min(100, Math.round((done / 112) * 100));
}

function updateStreak() {
  const today = todayStr();
  if (state.lastActive === today) return;
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  const yStr = yesterday.toISOString().slice(0,10);
  if (state.lastActive === yStr) {
    state.streak = (state.streak || 0) + 1;
  } else if (state.lastActive && state.lastActive < yStr) {
    state.streak = 1;
  } else if (!state.lastActive) {
    state.streak = 1;
  }
  state.maxStreak = Math.max(state.maxStreak || 0, state.streak);
  state.lastActive = today;
  saveState();
}

// ── Quote ──────────────────────────────────────────────────────
function getQuote() {
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,1))/86400000);
  return QUOTES[dayOfYear % QUOTES.length];
}

// ── Navigation ─────────────────────────────────────────────────
let currentPage = 'dashboard';
function navigate(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page));
  document.querySelectorAll('.page').forEach(el =>
    el.classList.toggle('hidden', el.dataset.page !== page));
  renderPage(page);
}
function renderPage(page) {
  switch(page) {
    case 'dashboard':  renderDashboard();  break;
    case 'curriculum': renderCurriculum(); break;
    case 'daily':      renderDaily();      break;
    case 'discipline': renderDiscipline(); break;
    case 'reminders':  renderReminders();  break;
  }
}

// ── DASHBOARD ──────────────────────────────────────────────────
function renderDashboard() {
  const container = document.getElementById('page-dashboard');
  const streamDay = getStreamDay();
  const totalPct  = getTotalProgress();
  const hour = new Date().getHours();
  const greeting = hour<12 ? '☀️ Good morning' : hour<17 ? '👋 Good afternoon' : '🌙 Good evening';
  const skipped = getSkippedDays();
  const quote = getQuote();
  const next = getNextUnfinishedDay();
  const MCOLORS = ['#7c3aed','#0ea5e9','#10b981','#f59e0b'];
  const user = currentUser;
  const C = 238.76, offset = C - (totalPct/100)*C;

  container.innerHTML = `
    <div class="greeting-area">
      <div class="greeting-text">
        <h2>${greeting}${user ? ', ' + user.displayName.split(' ')[0] : ''}! 🚀</h2>
        <p>Today is <strong>Day ${streamDay}</strong> of your 112-day journey</p>
      </div>
      <div class="streak-badge">🔥 ${state.streak||0}</div>
    </div>

    <!-- Stream Day Banner -->
    <div class="stream-banner">
      <div class="stream-left">
        <div class="stream-day-num">Day ${streamDay}</div>
        <div class="stream-day-label">of 112</div>
      </div>
      <div class="stream-timeline">
        <div class="stream-bar-track">
          <div class="stream-bar-fill" style="width:${(streamDay/112*100).toFixed(1)}%"></div>
          <div class="stream-dot" style="left:${(streamDay/112*100).toFixed(1)}%"></div>
        </div>
        <div class="stream-milestones"><span>M1</span><span>M2</span><span>M3</span><span>M4</span></div>
      </div>
      <div class="stream-right">
        <div class="stream-pct">${(streamDay/112*100).toFixed(0)}%</div>
        <div class="stream-label">elapsed</div>
      </div>
    </div>

    ${skipped.length > 0 ? `
    <div class="skip-alert" onclick="openSkipQuiz()">
      <div class="skip-alert-icon">⚠️</div>
      <div class="skip-alert-body">
        <div class="skip-alert-title">You have ${skipped.length} skipped day${skipped.length>1?'s':''}!</div>
        <div class="skip-alert-sub">Tap to take the recovery quiz and get back on track 💪</div>
      </div>
      <div class="skip-alert-arrow">→</div>
    </div>` : ''}

    <div class="overall-progress-card">
      <div class="progress-ring-wrap">
        <svg viewBox="0 0 88 88" width="88" height="88">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#a855f7"/>
            </linearGradient>
          </defs>
          <circle class="progress-ring-bg" cx="44" cy="44" r="38"/>
          <circle class="progress-ring-fill" cx="44" cy="44" r="38"
            stroke-dasharray="${C}" stroke-dashoffset="${offset}"/>
        </svg>
        <div class="ring-label">
          <span class="pct">${totalPct}%</span>
          <span class="total">Done</span>
        </div>
      </div>
      <div class="overall-info">
        <h3>4-Month DS Journey</h3>
        <p>112 days · 16 weeks · 12 projects</p>
        <div class="stat-row">
          <span>🔥 Best streak: <b>${state.maxStreak||0}</b></span>
          <span>🎯 Focus sessions: <b>${state.focusSessions||0}</b></span>
        </div>
      </div>
    </div>

    <div class="month-cards">
      ${CURRICULUM.months.map((m,i) => {
        const pct = getMonthProgress(i);
        return `<div class="month-card" style="--m-color:${MCOLORS[i]}" onclick="switchToMonth(${i})">
          <div class="m-num">Month ${m.id}</div>
          <div class="m-title">${m.subtitle}</div>
          <div class="m-sub">${m.focus.split('+').slice(0,2).join('+')}</div>
          <div class="m-pct">${pct}%</div>
          <div class="m-bar-bg"><div class="m-bar-fill" style="width:${pct}%"></div></div>
        </div>`;
      }).join('')}
    </div>

    ${next ? `
    <div class="today-card">
      <div class="today-label">🎯 Up Next — ${next.month.title}, ${next.week.title}</div>
      <div class="today-task">${next.day.title}: ${next.day.task}</div>
      <button class="today-done-btn ${state.checked[String(next.day.id)]?'done':''}"
        onclick="toggleDay('${next.day.id}', this)">
        ${state.checked[String(next.day.id)] ? '✅ Done' : '⚡ Mark Done'}
      </button>
    </div>` : ''}

    <div class="quote-card">
      <div class="quote-icon">💬</div>
      <div class="quote-text">"${quote.text}"</div>
      <div class="quote-author">— ${quote.author}</div>
    </div>
  `;
}

// ── CURRICULUM ─────────────────────────────────────────────────
let activeMonthIdx = 0;
const MCOLORS = ['#7c3aed','#0ea5e9','#10b981','#f59e0b'];

function getNextUnfinishedDay() {
  for (const m of CURRICULUM.months)
    for (const w of m.weeks)
      for (const d of w.days)
        if (!d.isProject && !state.checked[String(d.id)]) return {month:m, week:w, day:d};
  return null;
}

function renderCurriculum() {
  const container = document.getElementById('page-curriculum');
  const m = CURRICULUM.months[activeMonthIdx];
  const color = MCOLORS[activeMonthIdx];
  const streamDay = getStreamDay();

  container.innerHTML = `
    <div class="page-header">
      <h1>Curriculum</h1>
      <p class="subtitle">Stream Day <strong>${streamDay}</strong> · Track every skill</p>
    </div>
    <div class="phase-tabs">
      ${CURRICULUM.months.map((mo,i) => `
        <button class="phase-tab ${i===activeMonthIdx?'active':''}"
          style="--tab-color:${MCOLORS[i]}" onclick="setActiveMonth(${i})">${mo.title}</button>
      `).join('')}
    </div>
    <div style="padding:0 0 8px">
      <div style="font-size:13px;font-weight:600;color:${color};margin-bottom:6px">${m.focus}</div>
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:24px;font-weight:800;color:${color}">${getMonthProgress(activeMonthIdx)}%</div>
        <div style="flex:1;height:6px;background:rgba(255,255,255,0.07);border-radius:6px;overflow:hidden">
          <div style="height:100%;width:${getMonthProgress(activeMonthIdx)}%;background:${color};border-radius:6px;transition:width 0.8s"></div>
        </div>
      </div>
    </div>
    ${m.weeks.map(week => renderWeek(week, color, streamDay)).join('')}
    ${m.outcomes && m.outcomes.length ? `
      <div style="background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px;margin-bottom:16px">
        <div class="section-label" style="margin-bottom:12px">✅ Month Outcomes</div>
        ${m.outcomes.map(o => `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:14px;color:var(--text-secondary)">
          <span style="color:${color}">●</span> ${o}
        </div>`).join('')}
      </div>` : ''}
  `;
  document.querySelectorAll('.week-body')[0]?.classList.add('open');
  document.querySelectorAll('.week-chevron')[0]?.classList.add('open');
}

function renderWeek(week, color, streamDay) {
  const total = week.days.filter(d => !d.isProject).length;
  const done  = week.days.filter(d => !d.isProject && state.checked[String(d.id)]).length;
  return `
    <div class="week-section">
      <div class="week-header" onclick="toggleWeek(this)">
        <h3>${week.title}</h3>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="week-progress-pill">${done}/${total}</span>
          <span class="week-chevron">▼</span>
        </div>
      </div>
      <div class="week-body">
        ${week.days.map(d => {
          const key = String(d.id);
          const isDone    = !!state.checked[key];
          const skipped   = !d.isProject && isSkipped(d.id);
          const isCurrent = !d.isProject && typeof d.id === 'number' && d.id === streamDay;
          let extra = '';
          if (skipped) extra = ' skipped-day';
          if (isCurrent) extra = ' current-day';
          return `
          <div class="day-item ${isDone?'checked':''} ${d.isProject?'project-item':''}${extra}"
            style="--month-color:${color}"
            onclick="handleDayClick('${d.id}', ${!!d.isProject})">
            <div class="day-checkbox"></div>
            <div class="day-info" style="flex:1">
              <div class="day-title">
                ${d.title}
                ${isCurrent ? '<span class="today-chip">TODAY</span>' : ''}
                ${skipped ? '<span class="skip-chip">SKIPPED</span>' : ''}
              </div>
              <div class="day-task">${d.task}</div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function handleDayClick(dayId, isProject) {
  if (!isProject && isSkipped(Number(dayId))) { openSkipQuiz(Number(dayId)); return; }
  toggleDay(dayId, null, true);
}
function toggleWeek(header) {
  const body = header.nextElementSibling;
  const chevron = header.querySelector('.week-chevron');
  body.classList.toggle('open'); chevron.classList.toggle('open');
}
function setActiveMonth(idx) { activeMonthIdx = idx; renderCurriculum(); }
function switchToMonth(idx)  { activeMonthIdx = idx; navigate('curriculum'); }

function toggleDay(dayId, el, rerender) {
  const key = String(dayId);
  state.checked[key] = !state.checked[key];
  if (state.checked[key]) { updateStreak(); showToast('✅ Marked complete! Keep going!'); }
  else { showToast('↩️ Unmarked'); }
  saveState();
  if (rerender) renderCurriculum(); else renderDashboard();
}

// ── SKIP-DAY QUIZ ──────────────────────────────────────────────
let quizState = { questions:[], current:0, score:0, answers:[], targetDayId:null };

function openSkipQuiz(targetDayId) {
  const skippedDays = getSkippedDays();
  if (!skippedDays.length && !targetDayId) { showToast('✅ No skipped days!'); return; }
  const dayId = targetDayId || skippedDays[0];
  quizState = { questions: buildQuizQuestions(dayId), current:0, score:0, answers:[], targetDayId: dayId };
  document.getElementById('quiz-modal').classList.remove('hidden');
  renderQuizQuestion();
}

function buildQuizQuestions(dayId) {
  let pool = QUESTION_BANK.filter(q => dayId >= q.dayRange[0] && dayId <= q.dayRange[1]);
  if (pool.length < 5) pool = [...pool, ...QUESTION_BANK.filter(q => q.dayRange[1] === 112)];
  const easy = shuffle(pool.filter(q => q.difficulty==='easy'));
  const med  = shuffle(pool.filter(q => q.difficulty==='medium'));
  const hard = shuffle(pool.filter(q => q.difficulty==='hard'));
  const picked = [...easy.slice(0,3), ...med.slice(0,4), ...hard.slice(0,3)];
  const final = picked.length >= 10 ? picked.slice(0,10) : [...easy,...med,...hard].slice(0,10);
  return final.length ? final : QUESTION_BANK.slice(0,10);
}
function shuffle(arr) { return [...arr].sort(() => Math.random()-0.5); }

function renderQuizQuestion() {
  const modal = document.getElementById('quiz-modal');
  const q = quizState.questions[quizState.current];
  const total = quizState.questions.length;
  const idx = quizState.current;
  const pct = Math.round((idx/total)*100);
  const diffColor = { easy:'#10b981', medium:'#f59e0b', hard:'#ef4444' }[q.difficulty] || '#7c3aed';

  modal.innerHTML = `
    <div class="quiz-overlay">
      <div class="quiz-box">
        <div class="quiz-header">
          <div class="quiz-title">🧠 Recovery Quiz</div>
          <div class="quiz-meta">
            <span class="diff-badge" style="background:${diffColor}20;color:${diffColor};border:1px solid ${diffColor}40">${q.difficulty.toUpperCase()}</span>
            <span style="color:var(--text-muted);font-size:12px">${idx+1} / ${total}</span>
          </div>
        </div>
        <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
        <div class="quiz-topic" style="color:${diffColor}">${q.topic}</div>
        <div class="quiz-question">${q.q.replace(/\n/g,'<br>').replace(/```([\s\S]*?)```/g, (_,c) => `<pre class="quiz-code">${c}</pre>`)}</div>
        <div class="quiz-options" id="quiz-opts">
          ${q.opts.map((opt,i) => `
            <button class="quiz-opt" id="qopt-${i}" onclick="selectAnswer(${i})">
              <span class="qopt-letter">${String.fromCharCode(65+i)}</span>
              <span class="qopt-text">${opt}</span>
            </button>`).join('')}
        </div>
        <div id="quiz-explanation" class="quiz-explanation hidden"></div>
        <div class="quiz-footer">
          <button class="quiz-skip-btn" onclick="skipQuiz()">Skip Quiz</button>
          <button class="quiz-next-btn hidden" id="quiz-next" onclick="nextQuestion()">
            ${idx+1 < total ? 'Next →' : 'See Results'}
          </button>
        </div>
      </div>
    </div>`;
}

function selectAnswer(selectedIdx) {
  const q = quizState.questions[quizState.current];
  const correct = q.ans;
  quizState.answers.push(selectedIdx);
  document.querySelectorAll('.quiz-opt').forEach((btn,i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    else if (i === selectedIdx && selectedIdx !== correct) btn.classList.add('wrong');
  });
  const expEl = document.getElementById('quiz-explanation');
  expEl.classList.remove('hidden');
  expEl.innerHTML = `<div class="exp-icon">${selectedIdx === correct ? '✅' : '❌'}</div>
    <div class="exp-text"><strong>${selectedIdx === correct ? 'Correct!' : 'Incorrect.'}</strong> ${q.exp}</div>`;
  expEl.classList.add(selectedIdx === correct ? 'correct' : 'wrong');
  if (selectedIdx === correct) quizState.score++;
  document.getElementById('quiz-next').classList.remove('hidden');
}

function nextQuestion() {
  quizState.current++;
  if (quizState.current >= quizState.questions.length) showQuizResults();
  else renderQuizQuestion();
}

function showQuizResults() {
  const total = quizState.questions.length;
  const score = quizState.score;
  const pct = Math.round((score/total)*100);
  const passed = pct >= 60;
  const modal = document.getElementById('quiz-modal');
  if (passed) {
    state.quizPassed[String(quizState.targetDayId)] = true;
    getSkippedDays().forEach(id => { state.quizPassed[String(id)] = true; });
    updateStreak(); saveState();
  }
  modal.innerHTML = `
    <div class="quiz-overlay">
      <div class="quiz-box">
        <div class="quiz-result-icon">${passed ? '🎉' : '💪'}</div>
        <div class="quiz-result-title">${passed ? 'Quiz Passed!' : 'Almost There!'}</div>
        <div class="quiz-result-score">
          <span class="result-num" style="color:${pct>=60?'var(--green)':'var(--amber)'}">${score}</span>
          <span class="result-denom">/ ${total}</span>
        </div>
        <div class="quiz-result-pct" style="color:${pct>=60?'var(--green)':'var(--amber)'}">${pct}% correct</div>
        <div class="quiz-result-msg">
          ${passed ? 'Streak unlocked! 🔥 Keep going!' : 'You need 60% to pass. Review the topics and try again!'}
        </div>
        <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">
          ${passed
            ? '<button class="quiz-pass-btn" onclick="closeQuiz()">Continue Journey 🚀</button>'
            : '<button class="quiz-pass-btn" onclick="retryQuiz()">Try Again</button><button class="quiz-skip-btn" onclick="skipQuiz()">Skip for Now</button>'}
        </div>
      </div>
    </div>`;
}

function retryQuiz() {
  quizState.current = 0; quizState.score = 0; quizState.answers = [];
  quizState.questions = shuffle(quizState.questions); renderQuizQuestion();
}
function skipQuiz() {
  state.quizSkipped[String(quizState.targetDayId)] = true;
  saveState(); closeQuiz(); showToast('Quiz skipped. Review the topic later!');
}
function closeQuiz() {
  document.getElementById('quiz-modal').classList.add('hidden');
  renderDashboard();
  if (currentPage === 'curriculum') renderCurriculum();
}

// ── DAILY LOG ──────────────────────────────────────────────────
let dailyNoteTab = 'learned';

async function renderDaily() {
  const container = document.getElementById('page-daily');
  const dk = dateKey(viewingDate);
  const sd = state.shutdown[dk] || {};
  const isToday = dk === todayStr();

  // Load notes from Firestore
  const notes = await loadNotesFromFirestore(dk);

  container.innerHTML = `
    <div class="page-header"><h1>Daily Log</h1><p class="subtitle">5-minute shutdown routine</p></div>
    <div class="date-nav">
      <button class="date-nav-btn" onclick="changeDate(-1)">‹</button>
      <div class="date-display">
        <div class="date-main">${isToday ? 'Today' : formatDate(viewingDate)}</div>
        <div class="date-sub">${isToday ? formatDate(viewingDate) : dk}</div>
      </div>
      <button class="date-nav-btn" onclick="changeDate(1)">›</button>
    </div>
    <div class="card" style="margin-bottom:12px">
      <div class="section-label" style="margin-bottom:10px">😊 How was today?</div>
      <div style="display:flex;gap:10px;justify-content:center">
        ${['😫','😕','😐','😊','🔥'].map((e,i) => `
          <button onclick="setMood(${i+1})"
            style="font-size:24px;width:46px;height:46px;border-radius:50%;
            border:2px solid ${state.moodLog[dk]===i+1?'var(--purple)':'var(--border)'};
            background:${state.moodLog[dk]===i+1?'rgba(124,58,237,0.15)':'transparent'};
            transition:all 0.2s">${e}</button>
        `).join('')}
      </div>
    </div>
    <div class="shutdown-section">
      <div class="section-label">🔒 Daily Shutdown Checklist</div>
      ${CURRICULUM.shutdownChecklist.map(item => `
        <div class="shutdown-item ${sd[item.id]?'done':''}" onclick="toggleShutdown('${item.id}')">
          <div class="sd-dot"></div>
          <div class="sd-info"><div class="sd-title">${item.title}</div><div class="sd-desc">${item.desc}</div></div>
        </div>`).join('')}
    </div>
    <div class="notes-card">
      <div class="notes-tabs">
        ${[
          {id:'learned',label:'💡 Learned'},
          {id:'built',label:'🏗️ Built'},
          {id:'confusing',label:'🤔 Confusing'},
          {id:'tomorrow',label:'🎯 Tomorrow'},
          {id:'links',label:'🔗 Links'}
        ].map(t => `<div class="notes-tab ${dailyNoteTab===t.id?'active':''}" onclick="switchNoteTab('${t.id}')">${t.label}</div>`).join('')}
      </div>
      ${[
        {id:'learned',ph:'What did you learn today?'},
        {id:'built',ph:'What did you build or code?'},
        {id:'confusing',ph:'What is still confusing?'},
        {id:'tomorrow',ph:'Top 3 tasks for tomorrow...'},
        {id:'links',ph:'Best resource links today...'}
      ].map(p => `
        <div class="notes-panel ${dailyNoteTab===p.id?'active':''}" id="panel-${p.id}">
          <textarea class="note-textarea" id="note-${p.id}" placeholder="${p.ph}"
            oninput="autoSaveNote('${p.id}', this.value)">${notes[p.id]||''}</textarea>
        </div>`).join('')}
    </div>
    <div style="margin-bottom:16px">
      <div class="section-label">📊 Today's Stats</div>
      <div class="card" style="display:flex;padding:0;overflow:hidden">
        ${[
          {label:'Completed',val:Object.values(state.checked).filter(Boolean).length},
          {label:'Streak',val:`${state.streak||0}🔥`},
          {label:'Overall',val:`${getTotalProgress()}%`}
        ].map((s,i)=>`
          <div style="flex:1;text-align:center;padding:14px 8px;${i<2?'border-right:1px solid var(--border)':''}">
            <div style="font-size:20px;font-weight:800;color:var(--purple-light)">${s.val}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${s.label}</div>
          </div>`).join('')}
      </div>
    </div>
  `;
}

function setMood(val) { const dk = dateKey(viewingDate); state.moodLog[dk]=val; saveState(); renderDaily(); }
function switchNoteTab(t) { dailyNoteTab=t; renderDaily(); }
function changeDate(dir) { viewingDate.setDate(viewingDate.getDate()+dir); renderDaily(); }
function toggleShutdown(id) {
  const dk = dateKey(viewingDate);
  if (!state.shutdown[dk]) state.shutdown[dk]={};
  state.shutdown[dk][id] = !state.shutdown[dk][id];
  if (dk===todayStr()) updateStreak();
  saveState(); renderDaily();
}
let noteTimer = null;
function autoSaveNote(field, val) {
  const dk = dateKey(viewingDate);
  clearTimeout(noteTimer);
  noteTimer = setTimeout(async () => {
    const notes = await loadNotesFromFirestore(dk);
    notes[field] = val;
    await saveNotesToFirestore(dk, notes);
    showToast('💾 Saved to cloud');
  }, 800);
}

// ── DISCIPLINE & FOCUS ─────────────────────────────────────────
let focusTimer = { interval:null, remaining:0, total:0, mode:'work', preset:0, running:false };

async function renderDiscipline() {
  const container = document.getElementById('page-discipline');
  const today = todayStr();
  const totalDone = Object.values(state.checked).filter(Boolean).length;

  container.innerHTML = `
    <div class="page-header"><h1>Discipline</h1><p class="subtitle">Build the warrior mindset 💪</p></div>
    <div class="focus-timer-card">
      <div class="focus-timer-title">⏱️ Focus Timer</div>
      <div class="focus-presets">
        ${FOCUS_PRESETS.map((p,i) => `
          <button class="focus-preset ${focusTimer.preset===i?'active':''}"
            onclick="setPreset(${i},${p.work},${p.break})">${p.icon} ${p.label}</button>
        `).join('')}
      </div>
      <div class="timer-display" id="timer-display">
        ${formatTime(focusTimer.remaining || FOCUS_PRESETS[focusTimer.preset].work*60)}
      </div>
      <div class="timer-mode-label" id="timer-mode-label">
        ${focusTimer.running ? (focusTimer.mode==='work'?'🧠 Focus Time':'☕ Break Time') : 'Ready to focus?'}
      </div>
      <div class="timer-controls">
        <button class="timer-btn start" id="timer-start-btn" onclick="toggleTimer()">
          ${focusTimer.running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button class="timer-btn reset" onclick="resetTimer()">↺ Reset</button>
      </div>
      <div style="text-align:center;margin-top:12px;font-size:13px;color:var(--text-muted)">
        🎯 ${state.focusSessions||0} sessions completed
      </div>
    </div>

    <div style="margin-bottom:14px">
      <div class="section-label">🏆 Daily Habits</div>
      ${state.habits.map((h,i) => {
        const doneToday = h.lastDone === today;
        return `<div class="habit-item ${doneToday?'done':''}" onclick="toggleHabit(${i})">
          <span class="habit-icon">${h.icon}</span>
          <div class="habit-info">
            <div class="habit-label">${h.label}</div>
            <div class="habit-streak">🔥 ${h.streak||0} day streak</div>
          </div>
          <div class="habit-check ${doneToday?'done':''}">${doneToday?'✓':''}</div>
        </div>`;
      }).join('')}
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="flex-between" style="margin-bottom:12px">
        <div style="font-size:15px;font-weight:700">⚡ Discipline Score</div>
        <div style="font-size:22px;font-weight:800;color:var(--purple-light)">${calcDisciplineScore()}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${[
          {label:'Days Done',val:totalDone,icon:'✅'},
          {label:'Streak',val:state.streak||0,icon:'🔥'},
          {label:'Focus Hrs',val:Math.floor((state.focusSessions||0)*0.42),icon:'⏱️'}
        ].map(s=>`
          <div style="text-align:center;background:rgba(255,255,255,0.04);border-radius:10px;padding:12px 6px">
            <div style="font-size:18px">${s.icon}</div>
            <div style="font-size:18px;font-weight:800;color:var(--text-primary)">${s.val}</div>
            <div style="font-size:10px;color:var(--text-muted)">${s.label}</div>
          </div>`).join('')}
      </div>
    </div>

    <div class="card" style="margin-bottom:14px;background:linear-gradient(135deg,rgba(14,165,233,0.1),rgba(14,165,233,0.03));border-color:rgba(14,165,233,0.2)">
      <div style="font-size:15px;font-weight:700;color:var(--blue);margin-bottom:8px">📋 Weekly Review</div>
      <div style="font-size:13px;color:var(--text-secondary);margin-bottom:12px">Take 10 minutes every Sunday to reflect.</div>
      ${[
        {id:'q1', label:'What did I complete this week?'},
        {id:'q2', label:'What was my biggest struggle?'},
        {id:'q3', label:'What will I improve next week?'}
      ].map(q=>`
        <div style="margin-bottom:8px">
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">${q.label}</div>
          <textarea class="note-textarea" style="min-height:56px;font-size:13px"
            placeholder="Write here..."
            data-qid="${q.id}"
            oninput="saveWeeklyReviewField(this.dataset.qid, this.value)">${getWeeklyReview(q.id)}</textarea>
        </div>`).join('')}
    </div>

    <div class="quote-card" style="margin-bottom:8px">
      <div class="quote-icon">💬</div>
      <div class="quote-text">"${getQuote().text}"</div>
      <div class="quote-author">— ${getQuote().author}</div>
    </div>
  `;
}

function calcDisciplineScore() {
  const done = Object.values(state.checked).filter(Boolean).length;
  const habitDays = state.habits.reduce((s,h)=>s+(h.streak||0),0);
  const sessions = state.focusSessions || 0;
  return Math.round(done*3 + (state.streak||0)*5 + habitDays*2 + sessions);
}

function toggleHabit(idx) {
  const today = todayStr();
  const h = state.habits[idx];
  if (h.lastDone === today) {
    h.lastDone = null; h.streak = Math.max(0,(h.streak||1)-1);
    showToast('Habit unmarked');
  } else {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yStr = yesterday.toISOString().slice(0,10);
    h.streak = h.lastDone === yStr ? (h.streak||0)+1 : 1;
    h.lastDone = today;
    showToast(`${h.icon} Habit done! Streak: ${h.streak} 🔥`);
    updateStreak();
  }
  saveState(); renderDiscipline();
}

function setPreset(idx, work) {
  if (focusTimer.running) return;
  focusTimer.preset = idx; focusTimer.remaining = work*60;
  focusTimer.total = work*60; focusTimer.mode = 'work';
  renderDiscipline();
}

function toggleTimer() {
  if (focusTimer.running) {
    clearInterval(focusTimer.interval); focusTimer.running = false;
  } else {
    if (!focusTimer.remaining) {
      const p = FOCUS_PRESETS[focusTimer.preset];
      focusTimer.remaining = p.work*60; focusTimer.total = p.work*60; focusTimer.mode = 'work';
    }
    focusTimer.running = true;
    focusTimer.interval = setInterval(timerTick, 1000);
  }
  updateTimerUI();
}

function timerTick() {
  focusTimer.remaining--;
  updateTimerDisplay();
  if (focusTimer.remaining <= 0) {
    clearInterval(focusTimer.interval); focusTimer.running = false;
    if (focusTimer.mode === 'work') {
      state.focusSessions = (state.focusSessions||0)+1; saveState();
      showToast('🎯 Focus session done! Take a break.');
      if ('Notification' in window && Notification.permission==='granted') {
        new Notification('Focus — Break Time! ☕',{body:'Great work! Time for a short break.',icon:'./icons/icon-192.png'});
      }
      const p = FOCUS_PRESETS[focusTimer.preset];
      focusTimer.mode = 'break'; focusTimer.remaining = p.break*60; focusTimer.total = p.break*60;
      focusTimer.running = true; focusTimer.interval = setInterval(timerTick,1000);
    } else {
      showToast('☕ Break over! Ready to focus?');
      const p = FOCUS_PRESETS[focusTimer.preset];
      focusTimer.mode = 'work'; focusTimer.remaining = p.work*60; focusTimer.total = p.work*60;
    }
    updateTimerUI();
  }
}

function updateTimerUI() {
  updateTimerDisplay();
  const btn = document.getElementById('timer-start-btn');
  if (btn) btn.textContent = focusTimer.running ? '⏸ Pause' : '▶ Start';
  const lbl = document.getElementById('timer-mode-label');
  if (lbl) lbl.textContent = focusTimer.running
    ? (focusTimer.mode==='work' ? '🧠 Focus Time' : '☕ Break Time') : 'Ready to focus?';
}
function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (el) el.textContent = formatTime(focusTimer.remaining);
}
function resetTimer() {
  clearInterval(focusTimer.interval); focusTimer.running = false;
  const p = FOCUS_PRESETS[focusTimer.preset];
  focusTimer.remaining = p.work*60; focusTimer.total = p.work*60; focusTimer.mode = 'work';
  renderDiscipline();
}
function formatTime(seconds) {
  const m = Math.floor(seconds/60).toString().padStart(2,'0');
  const s = (seconds%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

let weeklyReview = {};
function getWeeklyReview(id) { return weeklyReview[id] || ''; }
let wrTimer = null;
function saveWeeklyReviewField(id, val) {
  weeklyReview[id] = val;
  clearTimeout(wrTimer);
  wrTimer = setTimeout(async () => {
    await saveWeeklyReviewToFirestore(weeklyReview);
    showToast('💾 Review saved');
  }, 800);
}

// ── REMINDERS ──────────────────────────────────────────────────
function renderReminders() {
  const container = document.getElementById('page-reminders');
  const r = state.reminder;
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  container.innerHTML = `
    <div class="page-header"><h1>Reminders</h1><p class="subtitle">Stay consistent every day</p></div>
    ${deferredInstallPrompt ? `
    <div class="install-banner">
      <div class="install-icon">📲</div>
      <div class="install-info">
        <h4>Install on your device</h4>
        <p>Add Focus to your home screen — works offline!</p>
        <button class="install-btn" onclick="triggerInstall()">Install App</button>
      </div>
    </div>` : `
    <div class="install-banner">
      <div class="install-icon">📲</div>
      <div class="install-info">
        <h4>Install on iPhone (iOS)</h4>
        <p>Safari → <strong>Share</strong> → <strong>"Add to Home Screen"</strong> → Add</p>
      </div>
    </div>`}
    <div class="reminder-card">
      <h3>⏰ Daily Study Reminder</h3>
      <p>Get notified daily so you never miss a session.</p>
      <div class="time-picker-row">
        <input type="time" class="time-input" id="reminder-time" value="${r.time}"
          onchange="updateReminderTime(this.value)"/>
        <button class="set-reminder-btn" onclick="scheduleReminder()">
          ${r.enabled ? '🔔 Update' : '🔔 Enable'}
        </button>
      </div>
      <div class="section-label" style="margin-bottom:8px">Remind me on</div>
      <div class="dow-picker">
        ${days.map((d,i) => `
          <button class="dow-btn ${r.days.includes(i)?'active':''}"
            onclick="toggleDay_dow(${i})">${d}</button>`).join('')}
      </div>
      <div class="reminder-status ${r.enabled?'on':'off'}">
        ${r.enabled ? '🟢 Active — daily at '+r.time : '⚫ Reminders are off'}
      </div>
      <button class="test-notif-btn" onclick="testNotification()">🔔 Send Test Notification</button>
    </div>
    <div class="reminder-card">
      <h3>📋 Custom To-Do</h3>
      <p>Your personal task list — outside the curriculum.</p>
      <div id="todo-list"></div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <input type="text" id="todo-input" class="time-input"
          style="text-align:left;font-size:14px;font-weight:500;font-family:Inter,sans-serif"
          placeholder="Add a to-do..." onkeydown="if(event.key==='Enter')addTodo()"/>
        <button class="set-reminder-btn" onclick="addTodo()">Add</button>
      </div>
    </div>
  `;
  renderTodos();
}

function updateReminderTime(v) { state.reminder.time=v; saveState(); }
function toggleDay_dow(i) {
  const idx=state.reminder.days.indexOf(i);
  if(idx>-1) state.reminder.days.splice(idx,1); else { state.reminder.days.push(i); state.reminder.days.sort(); }
  saveState(); renderReminders();
}
async function scheduleReminder() {
  if(!('Notification' in window)){showToast('❌ Not supported');return;}
  const p=await Notification.requestPermission();
  if(p!=='granted'){showToast('❌ Permission denied');return;}
  state.reminder.enabled=!state.reminder.enabled; saveState();
  if(state.reminder.enabled){startReminderLoop();showToast('🔔 Reminder set for '+state.reminder.time);}
  else showToast('🔕 Reminders disabled');
  renderReminders();
}
async function testNotification() {
  if(!('Notification' in window)){showToast('❌ Not supported');return;}
  const p=await Notification.requestPermission();
  if(p!=='granted'){showToast('❌ Permission denied');return;}
  const next=getNextUnfinishedDay();
  new Notification('Focus 🚀',{body:`Time to study! ${next?.day?.task||'Keep going!'} 💪`,icon:'./icons/icon-192.png'});
  showToast('📬 Test notification sent!');
}
let reminderInterval=null;
function startReminderLoop() {
  if(reminderInterval) clearInterval(reminderInterval);
  reminderInterval=setInterval(()=>{
    if(!state.reminder.enabled) return;
    const now=new Date();
    const t=`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    if(t===state.reminder.time && state.reminder.days.includes(now.getDay())) {
      const next=getNextUnfinishedDay();
      new Notification('Focus — Study Time! 🚀',{body:next?`Today: ${next.day.task}`:'All caught up!',icon:'./icons/icon-192.png'});
    }
  },60000);
}

// Todos (Firestore)
async function getTodos() {
  return await loadTodosFromFirestore();
}
async function addTodo() {
  const el=document.getElementById('todo-input');
  const v=el.value.trim(); if(!v) return;
  const t=await getTodos(); t.push({id:Date.now(),text:v,done:false});
  await saveTodosToFirestore(t); el.value=''; renderTodos();
}
async function toggleTodo(id) {
  const t=await getTodos(); const i=t.find(x=>x.id===id); if(i)i.done=!i.done;
  await saveTodosToFirestore(t); renderTodos();
}
async function deleteTodo(id) {
  const t=await getTodos(); await saveTodosToFirestore(t.filter(x=>x.id!==id)); renderTodos();
}
async function renderTodos() {
  const el=document.getElementById('todo-list'); if(!el) return;
  const t=await getTodos();
  if(!t.length){el.innerHTML='<div style="font-size:13px;color:var(--text-muted);padding:8px 0">No to-dos yet!</div>';return;}
  el.innerHTML=t.map(i=>`
    <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div onclick="toggleTodo(${i.id})"
        style="width:20px;height:20px;border-radius:50%;flex-shrink:0;cursor:pointer;
        background:${i.done?'var(--green)':'transparent'};
        border:2px solid ${i.done?'var(--green)':'rgba(255,255,255,0.2)'};
        display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700">
        ${i.done?'✓':''}
      </div>
      <span style="flex:1;font-size:14px;color:${i.done?'var(--text-muted)':'var(--text-primary)'};
        ${i.done?'text-decoration:line-through':''}"> ${i.text}</span>
      <button onclick="deleteTodo(${i.id})" style="color:var(--text-muted);font-size:16px;padding:4px">✕</button>
    </div>`).join('');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer=null;
function showToast(msg){
  const el=document.getElementById('toast');
  if(!el) return;
  el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2500);
}

// ── PWA Install ────────────────────────────────────────────────
let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredInstallPrompt=e; });
function triggerInstall(){
  if(!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(()=>{ deferredInstallPrompt=null; renderReminders(); });
}

// ── Service Worker ─────────────────────────────────────────────
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('./service-worker.js').catch(err=>console.warn('SW:',err));
  });
}
