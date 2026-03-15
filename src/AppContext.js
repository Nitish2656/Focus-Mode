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
  moodLog: {},
  habits: [
    { id:'h1', label:'Study ≥1 hour',              icon:'📖', streak:0, lastDone:null },
    { id:'h2', label:'No social media before study', icon:'📵', streak:0, lastDone:null },
    { id:'h3', label:'8 hrs sleep',                 icon:'😴', streak:0, lastDone:null },
    { id:'h4', label:'Exercise / Walk',              icon:'🏃', streak:0, lastDone:null },
    { id:'h5', label:'Code review / GitHub push',   icon:'💻', streak:0, lastDone:null }
  ]
});

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(getDefaultState());
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // 1. Load exclusively from AsyncStorage (100% Local Offline)
      const localRaw = await AsyncStorage.getItem(STATE_KEY);
      let loadedState = localRaw ? JSON.parse(localRaw) : getDefaultState();
      
      // Update streak
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
      
      // 3. Save back locally
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
      // 100% Local Storage Sync
      await AsyncStorage.setItem(STATE_KEY, JSON.stringify(newState));
    }, 500);
  };

  const updateState = (key, value) => {
    const newState = { ...state, [key]: value };
    syncState(newState);
  };

  return (
    <AppContext.Provider value={{ state, loading, syncState, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
