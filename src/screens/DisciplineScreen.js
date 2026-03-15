import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAppContext } from '../AppContext';
import { FOCUS_PRESETS, QUOTES } from '../data';

export default function DisciplineScreen() {
  const { state, updateState } = useAppContext();
  
  const [remaining, setRemaining] = useState(25 * 60);
  const [preset, setPreset] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  
  const timerRef = useRef(null);
  const todayStr = new Date().toISOString().slice(0,10);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleTimer = () => {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      timerRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    if (mode === 'work') {
      updateState('focusSessions', (state.focusSessions||0) + 1);
      const p = FOCUS_PRESETS[preset];
      setMode('break');
      setRemaining(p.break * 60);
      toggleTimer(); // auto start break
    } else {
      const p = FOCUS_PRESETS[preset];
      setMode('work');
      setRemaining(p.work * 60);
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    const p = FOCUS_PRESETS[preset];
    setMode('work');
    setRemaining(p.work * 60);
  };

  const changePreset = (idx) => {
    if (running) return;
    setPreset(idx);
    setMode('work');
    setRemaining(FOCUS_PRESETS[idx].work * 60);
  };

  const toggleHabit = (idx) => {
    const h = { ...state.habits[idx] };
    if (h.lastDone === todayStr) {
      h.lastDone = null;
      h.streak = Math.max(0, (h.streak||1) - 1);
    } else {
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
      const yStr = yesterday.toISOString().slice(0,10);
      h.streak = h.lastDone === yStr ? (h.streak||0) + 1 : 1;
      h.lastDone = todayStr;
    }
    const newHabits = [...state.habits];
    newHabits[idx] = h;
    updateState('habits', newHabits);
  };

  const calcScore = () => {
    const done = Object.values(state.checked).filter(Boolean).length;
    const habitDays = state.habits.reduce((s, h) => s + (h.streak || 0), 0);
    const sessions = state.focusSessions || 0;
    return Math.round(done * 3 + (state.streak || 0) * 5 + habitDays * 2 + sessions);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discipline</Text>
        <Text style={styles.subtitle}>Build the warrior mindset 💪</Text>
      </View>

      <View style={styles.timerCard}>
        <Text style={{color: '#94a3b8', fontSize: 13, fontWeight: '700', textTransform: 'uppercase', marginBottom: 16}}>⏱️ Focus Timer</Text>
        
        <View style={styles.presetRow}>
          {FOCUS_PRESETS.map((p, i) => (
            <TouchableOpacity key={i} style={[styles.presetBtn, preset === i && styles.presetActive]} onPress={() => changePreset(i)}>
              <Text style={{color: preset === i ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: '600'}}>{p.icon} {p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.timerDisplay}>{formatTime(remaining)}</Text>
        <Text style={styles.timerMode}>{running ? (mode==='work' ? '🧠 Focus Time' : '☕ Break Time') : 'Ready to focus?'}</Text>
        
        <View style={styles.controlRow}>
          <TouchableOpacity style={[styles.controlBtn, running ? styles.btnPause : styles.btnStart]} onPress={toggleTimer}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '700'}}>{running ? '⏸ Pause' : '▶ Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnReset} onPress={resetTimer}>
            <Text style={{color: '#94a3b8', fontSize: 14, fontWeight: '600'}}>↺ Reset</Text>
          </TouchableOpacity>
        </View>
        <Text style={{color: '#64748b', fontSize: 12, marginTop: 16}}>🎯 {state.focusSessions||0} sessions completed</Text>
      </View>

      {/* Habits */}
      <View style={{marginBottom: 20}}>
        <Text style={styles.sectionTitle}>🏆 Daily Habits</Text>
        {state.habits.map((h, i) => {
          const done = h.lastDone === todayStr;
          return (
            <TouchableOpacity key={i} style={[styles.habitItem, done && {backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)'}]} onPress={() => toggleHabit(i)}>
              <Text style={{fontSize: 24, marginRight: 16}}>{h.icon}</Text>
              <View style={{flex: 1}}>
                <Text style={{color: done ? '#64748b' : '#f8fafc', fontSize: 15, fontWeight: '600', textDecorationLine: done ? 'line-through' : 'none'}}>{h.label}</Text>
                <Text style={{color: '#fbbf24', fontSize: 12, fontWeight:'700', marginTop: 2}}>🔥 {h.streak||0} day streak</Text>
              </View>
              <View style={[styles.checkbox, done && {backgroundColor: '#10b981', borderColor: '#10b981'}]}>
                {done && <Text style={{color: '#fff', fontSize: 12, fontWeight: '900'}}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Score */}
      <View style={[styles.timerCard, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20}]}>
        <View>
          <Text style={{color: '#f8fafc', fontSize: 16, fontWeight: '800'}}>⚡ Discipline Score</Text>
          <Text style={{color: '#94a3b8', fontSize: 12, marginTop: 4}}>Done: {Object.values(state.checked).filter(Boolean).length}</Text>
        </View>
        <Text style={{color: '#a855f7', fontSize: 32, fontWeight: '900'}}>{calcScore()}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 40, paddingBottom: 100, backgroundColor: '#0a0a0f', flexGrow: 1 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8' },

  timerCard: { backgroundColor: '#14141e', padding: 24, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 24 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 },
  presetBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' },
  presetActive: { borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.15)' },
  
  timerDisplay: { fontSize: 72, fontWeight: '900', color: '#e2e8f0', letterSpacing: 2, fontFamily: 'monospace' },
  timerMode: { fontSize: 14, color: '#a855f7', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 32 },
  
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  controlBtn: { paddingHorizontal: 40, paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: {width:0, height:4}, shadowOpacity: 0.2, shadowRadius: 8 },
  btnStart: { backgroundColor: '#7c3aed' },
  btnPause: { backgroundColor: '#f59e0b' },
  btnReset: { paddingHorizontal: 20, paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)' },

  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  habitItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#14141e', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#64748b', alignItems: 'center', justifyContent: 'center' }
});
