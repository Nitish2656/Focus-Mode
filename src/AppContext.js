import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const STATE_KEY = 'focus_tracker_v3_mobile';

const getDefaultState = () => ({
  hasOnboarded: false,
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
  totalTime: 0,
  history: {}, // { 'YYYY-MM-DD': { sessions: 0, time: 0, topics: {} } }
  moodLog: {},
  focusShieldEnabled: false,
  blocklist: ['com.google.android.youtube', 'com.instagram.android', 'com.facebook.katana'],
  appLimits: {}, // { 'com.pkg.name': maxMinutes }
  habits: [
    { id:'h1', label:'Study ≥1 hour',              icon:'📖', streak:0, lastDone:null },
    { id:'h2', label:'No social media before study', icon:'📵', streak:0, lastDone:null },
    { id:'h3', label:'8 hrs sleep',                 icon:'😴', streak:0, lastDone:null },
    { id:'h4', label:'Exercise / Walk',              icon:'🏃', streak:0, lastDone:null },
    { id:'h5', label:'Code review / GitHub push',   icon:'💻', streak:0, lastDone:null }
  ],
  xp: 0,
  level: 1,
  quests: [
    { id: 'q1', label: 'Morning Ritual', XP: 50, type: 'daily', done: false },
    { id: 'q2', label: 'Deep Work (2 Hours)', XP: 150, type: 'epic', done: false },
    { id: 'q3', label: 'Curriculum Master', XP: 300, type: 'epic', done: false },
  ],
  achievements: [
     { id: 'a1', label: 'The Rookie', icon: '🥉', desc: 'Complete 1 focus session', earned: false },
     { id: 'a2', label: 'Zen Master', icon: '🧘', desc: 'Listen to 1 hour of ambient focus', earned: false },
     { id: 'a3', label: 'Unstoppable', icon: '💎', desc: 'Reach a 7-day streak', earned: false }
  ]
});

export const getWarriorRank = (score) => {
  if (score < 10) return { rank: 'Novice', color: '#888' };
  if (score < 50) return { rank: 'Apprentice Warrior', color: '#4CAF50' };
  if (score < 150) return { rank: 'Disciplined Scholar', color: '#2196F3' };
  if (score < 500) return { rank: 'Focus Grandmaster', color: '#FF9800' };
  return { rank: 'Legend of Focus', color: '#F44336' };
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(getDefaultState());
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const localRaw = await AsyncStorage.getItem(STATE_KEY);
      let loadedState = localRaw ? JSON.parse(localRaw) : getDefaultState();
      
      const today = new Date().toISOString().slice(0,10);
      if (loadedState.lastActive !== today) {
        const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
        const yStr = yesterday.toISOString().slice(0,10);
        if (loadedState.lastActive === yStr) {
          loadedState.streak = (loadedState.streak || 0) + 1;
        } else if (loadedState.lastActive && loadedState.lastActive < yStr) {
          loadedState.streak = 1;
        } else if (!loadedState.lastActive) {
          loadedState.streak = 1;
        }
        loadedState.maxStreak = Math.max(loadedState.maxStreak || 0, loadedState.streak);
        loadedState.lastActive = today;
      }
      
      setState(loadedState);
      await AsyncStorage.setItem(STATE_KEY, JSON.stringify(loadedState));
    } catch (e) {
      console.warn('Init error', e);
    } finally {
      setLoading(false);
    }
  };

  const syncState = (newState) => {
    setState(newState);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await AsyncStorage.setItem(STATE_KEY, JSON.stringify(newState));
    }, 500);
  };

  const updateState = (key, value) => {
    const newState = { ...state, [key]: value };
    syncState(newState);
  };

  const recordSession = (durationSeconds, topic) => {
    const today = new Date().toISOString().slice(0,10);
    const newState = { ...state };
    
    // Global stats
    newState.focusSessions = (newState.focusSessions || 0) + 1;
    newState.totalTime = (newState.totalTime || 0) + durationSeconds;
    
    // Detailed History
    if (!newState.history) newState.history = {};
    if (!newState.history[today]) {
      newState.history[today] = { sessions: 0, time: 0, topics: {} };
    }
    
    newState.history[today].sessions += 1;
    newState.history[today].time += durationSeconds;
    
    if (topic) {
      if (!newState.history[today].topics[topic]) newState.history[today].topics[topic] = 0;
      newState.history[today].topics[topic] += durationSeconds;
    }
    
    syncState(newState);
  };

  const completeQuest = (questId) => {
    const newState = { ...state };
    const quest = newState.quests.find(q => q.id === questId);
    if (quest && !quest.done) {
      quest.done = true;
      newState.xp += quest.XP;
      // Level up logic (every 500 XP)
      const newLevel = Math.floor(newState.xp / 500) + 1;
      if (newLevel > newState.level) {
        newState.level = newLevel;
      }
      syncState(newState);
    }
  };

  const earnAchievement = (id) => {
    const newState = { ...state };
    const achievement = newState.achievements.find(a => a.id === id);
    if (achievement && !achievement.earned) {
      achievement.earned = true;
      syncState(newState);
    }
  };

  return (
    <AppContext.Provider value={{ state, loading, syncState, updateState, recordSession, completeQuest, earnAchievement }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
