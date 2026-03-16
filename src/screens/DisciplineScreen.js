import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAppContext, getWarriorRank } from '../AppContext';
import { FOCUS_PRESETS, QUOTES } from '../data';
import { Audio } from 'expo-av';
import { checkForegroundApp, intervene, requestShieldPermissions } from '../FocusShieldLogic';

const SUBJECTS = ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Projects'];
const SOUNDS = [
  { id: 'lofi', label: '☕ Lofi', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder URLs for now
  { id: 'rain', label: '🌧️ Rain', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'cyber', label: '🌆 Cyber', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function DisciplineScreen() {
  const { state, updateState, recordSession } = useAppContext();
  
  const [remaining, setRemaining] = useState(25 * 60);
  const [preset, setPreset] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [topic, setTopic] = useState(SUBJECTS[0]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedSound, setSelectedSound] = useState(SOUNDS[0]);
  
  const timerRef = useRef(null);
  const shieldRef = useRef(null);
  const soundRef = useRef(null);
  const todayStr = new Date().toISOString().slice(0,10);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (shieldRef.current) clearInterval(shieldRef.current);
    };
  }, []);

  const toggleTimer = async () => {
    if (running) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (shieldRef.current) clearInterval(shieldRef.current);
      setRunning(false);
      if (soundRef.current) await soundRef.current.pauseAsync();
    } else {
      setRunning(true);
      if (soundEnabled && mode === 'work') await playSound();
      
      // Focus Shield Background Check
      if (state.focusShieldEnabled && mode === 'work') {
        startShieldMonitoring();
      }

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

  const playSound = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: selectedSound.url },
        { shouldPlay: true, isLooping: true }
      );
      soundRef.current = sound;
    } catch (e) {
      console.warn('Sound error', e);
    }
  };

  const toggleSoundPref = async () => {
     const next = !soundEnabled;
     setSoundEnabled(next);
     if (running && mode === 'work') {
        if (next) await playSound();
        else if (soundRef.current) await soundRef.current.stopAsync();
     }
  };

  const startShieldMonitoring = () => {
    if (shieldRef.current) clearInterval(shieldRef.current);
    shieldRef.current = setInterval(async () => {
        const detected = await checkForegroundApp(state.blocklist);
        if (detected) {
            console.log('Intervention triggered for:', detected);
            intervene();
            alert('🛡️ Focus Shield: Distribution app detected! Returning to study.');
        }
    }, 3000); // Check every 3 seconds
  };

  const toggleShield = async () => {
    const next = !state.focusShieldEnabled;
    if (next) {
        const ok = await requestShieldPermissions();
        if (!ok) {
            alert('Usage Access Permission is required for Focus Shield to work.');
            return;
        }
    }
    updateState('focusShieldEnabled', next);
  };

  const handleTimerComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    if (mode === 'work') {
      const p = FOCUS_PRESETS[preset];
      recordSession(p.work * 60, topic);
      setMode('break');
      setRemaining(p.break * 60);
      alert('Focus session complete! Take a break warrior.');
    } else {
      const p = FOCUS_PRESETS[preset];
      setMode('work');
      setRemaining(p.work * 60);
      alert('Break over! Time to focus.');
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
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 24, gap: 12}}>
           <TouchableOpacity onPress={toggleSoundPref} style={[styles.soundToggle, soundEnabled && styles.soundActive]}>
              <Text style={{color: '#fff', fontSize: 12, fontWeight: '700'}}>{soundEnabled ? '🔊 Music On' : '🔇 Music Off'}</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={toggleShield} style={[styles.soundToggle, state.focusShieldEnabled && {backgroundColor: '#ef4444', borderColor: '#ef4444'}]}>
              <Text style={{color: '#fff', fontSize: 12, fontWeight: '700'}}>{state.focusShieldEnabled ? '🛡️ Shield On' : '🛡️ Shield Off'}</Text>
           </TouchableOpacity>
           {soundEnabled && (
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
                {SOUNDS.map(s => (
                  <TouchableOpacity key={s.id} onPress={() => setSelectedSound(s)} style={[styles.soundBtn, selectedSound.id === s.id && styles.soundBtnActive]}>
                    <Text style={{color: selectedSound.id === s.id ? '#fff' : '#94a3b8', fontSize: 11, fontWeight: '700'}}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
           )}
        </View>
      </View>

      {/* Topic Selection */}
      <View style={{marginBottom: 24}}>
        <Text style={styles.sectionTitle}>📚 Current Study Subject</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: 8}}>
          {SUBJECTS.map((s, i) => (
            <TouchableOpacity key={i} style={[styles.topicBtn, topic === s && styles.topicActive]} onPress={() => setTopic(s)}>
              <Text style={{color: topic === s ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: '700'}}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
             <View style={[styles.rankBadge, {backgroundColor: getWarriorRank(calcScore()).color}]}>
               <Text style={{color: '#fff', fontSize: 10, fontWeight: '900'}}>{getWarriorRank(calcScore()).rank}</Text>
             </View>
          </View>
          <Text style={{color: '#94a3b8', fontSize: 11, marginTop: 4}}>Done: {Object.values(state.checked).filter(Boolean).length} | Streak: {state.streak||0}</Text>
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
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#64748b', alignItems: 'center', justifyContent: 'center' },
  
  topicBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#14141e', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  topicActive: { borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' },
  rankBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 8 },

  soundToggle: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#14141e', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  soundActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
  soundBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  soundBtnActive: { borderColor: '#7c3aed' }
});
