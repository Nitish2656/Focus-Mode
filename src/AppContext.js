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
  ],
  zenTime: 0 // Track total minutes in Zen Sanctuary
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
      
      // ENSURE NEW KEYS EXIST (Merge loaded state with defaults)
      const defaultState = getDefaultState();
      loadedState = {
        ...defaultState,
        ...loadedState,
        quests: loadedState.quests || defaultState.quests,
        achievements: loadedState.achievements || defaultState.achievements,
        xp: loadedState.xp ?? defaultState.xp,
        level: loadedState.level ?? defaultState.level
      };
      
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
        
        // TRIGGER: Unstoppable Achievement
        if (loadedState.streak >= 7) {
          const ach = loadedState.achievements.find(a => a.id === 'a3');
          if (ach && !ach.earned) {
             loadedState.achievements = loadedState.achievements.map(a => 
               a.id === 'a3' ? { ...a, earned: true } : a
             );
          }
        }
        
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
    
    // TRIGGER: The Rookie Achievement
    if (newState.focusSessions >= 1) {
      const ach = newState.achievements.find(a => a.id === 'a1');
      if (ach && !ach.earned) {
         newState.achievements = newState.achievements.map(a => 
           a.id === 'a1' ? { ...a, earned: true } : a
         );
      }
    }
    
    syncState(newState);
  };

  const recordZenTime = (minutes) => {
    setState(prev => {
      const newZenTime = (prev.zenTime || 0) + minutes;
      let achievements = prev.achievements;
      
      // TRIGGER: Zen Master Achievement (60 mins)
      if (newZenTime >= 60) {
        const ach = prev.achievements.find(a => a.id === 'a2');
        if (ach && !ach.earned) {
           achievements = prev.achievements.map(a => 
             a.id === 'a2' ? { ...a, earned: true } : a
           );
        }
      }
      
      const newState = { ...prev, zenTime: newZenTime, achievements };
      
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await AsyncStorage.setItem(STATE_KEY, JSON.stringify(newState));
      }, 500);
      
      return newState;
    });
  };

  const completeQuest = (questId) => {
    setState(prev => {
      const quests = prev.quests.map(q => 
        q.id === questId ? { ...q, done: true } : q
      );
      const quest = prev.quests.find(q => q.id === questId);
      
      if (quest && !quest.done) {
        const newXp = prev.xp + quest.XP;
        const newLevel = Math.floor(newXp / 500) + 1;
        
        const newState = { 
          ...prev, 
          quests, 
          xp: newXp, 
          level: newLevel > prev.level ? newLevel : prev.level 
        };
        
        // Immediate sync trigger
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          await AsyncStorage.setItem(STATE_KEY, JSON.stringify(newState));
        }, 500);
        
        return newState;
      }
      return prev;
    });
  };

  const earnAchievement = (id) => {
    setState(prev => {
      const achievement = prev.achievements.find(a => a.id === id);
      if (achievement && !achievement.earned) {
        const achievements = prev.achievements.map(a => 
          a.id === id ? { ...a, earned: true } : a
        );
        const newState = { ...prev, achievements };
        
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(async () => {
          await AsyncStorage.setItem(STATE_KEY, JSON.stringify(newState));
        }, 500);
        
        return newState;
      }
      return prev;
    });
  };

  return (
    <AppContext.Provider value={{ state, loading, syncState, updateState, recordSession, completeQuest, earnAchievement, recordZenTime }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
