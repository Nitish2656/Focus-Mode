import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

const STATE_KEY = 'focus_tracker_v3_mobile';

const getDefaultState = () => ({
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
  const [user, setUser] = useState(null);
  const [state, setState] = useState(getDefaultState());
  const [loading, setLoading] = useState(true);
  const saveTimer = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        setUser(usr);
        await initApp(usr);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const initApp = async (usr) => {
    try {
      // 1. Load from AsyncStorage temp fast
      const localRaw = await AsyncStorage.getItem(STATE_KEY);
      let loadedState = localRaw ? JSON.parse(localRaw) : getDefaultState();

      // 2. Load from Firestore
      const docRef = doc(db, 'users', usr.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        loadedState = { ...getDefaultState(), ...snap.data() };
      }
      
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
      
      // 3. Save merged/updated back
      await AsyncStorage.setItem(STATE_KEY, JSON.stringify(loadedState));
      await setDoc(docRef, loadedState, { merge: true });
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
      if (user) {
        try {
          await setDoc(doc(db, 'users', user.uid), newState, { merge: true });
        } catch (e) {
          console.warn('Firestore sync failed', e);
        }
      }
    }, 500);
  };

  const updateState = (key, value) => {
    const newState = { ...state, [key]: value };
    syncState(newState);
  };

  return (
    <AppContext.Provider value={{ user, state, loading, syncState, updateState }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
