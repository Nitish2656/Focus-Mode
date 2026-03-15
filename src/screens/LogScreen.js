import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from 'react-native';
import { useAppContext } from '../AppContext';
import { CURRICULUM } from '../data';

export default function LogScreen() {
  const { state, updateState } = useAppContext();
  const [viewingDate, setViewingDate] = useState(new Date());
  const [noteTab, setNoteTab] = useState('learned');
  
  const todayStr = new Date().toISOString().slice(0,10);
  const dk = viewingDate.toISOString().slice(0,10);
  const isToday = dk === todayStr;
  
  const sd = state.shutdown[dk] || {};
  const notes = state.notes[dk] || {};
  const mood = state.moodLog[dk] || null;

  const changeDate = (dir) => {
    const newDate = new Date(viewingDate);
    newDate.setDate(newDate.getDate() + dir);
    setViewingDate(newDate);
  };

  const setMood = (val) => {
    updateState('moodLog', { ...state.moodLog, [dk]: val });
  };

  const toggleShutdown = (id) => {
    const newSd = { ...state.shutdown, [dk]: { ...sd, [id]: !sd[id] } };
    updateState('shutdown', newSd);
  };

  const saveNote = (val) => {
    const newNotes = { ...state.notes, [dk]: { ...notes, [noteTab]: val } };
    updateState('notes', newNotes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Log</Text>
        <Text style={styles.subtitle}>5-minute shutdown routine</Text>
      </View>

      <View style={styles.dateNav}>
        <TouchableOpacity style={styles.dateBtn} onPress={() => changeDate(-1)}><Text style={styles.dateArrow}>‹</Text></TouchableOpacity>
        <View style={styles.dateDisplay}>
          <Text style={styles.dateMain}>{isToday ? 'Today' : viewingDate.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}</Text>
          <Text style={styles.dateSub}>{dk}</Text>
        </View>
        <TouchableOpacity style={styles.dateBtn} onPress={() => changeDate(1)}><Text style={styles.dateArrow}>›</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Mood */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>😊 How was today?</Text>
          <View style={styles.moodRow}>
            {['😫','😕','😐','😊','🔥'].map((emoji, i) => (
              <TouchableOpacity key={i} style={[styles.moodBtn, mood === i+1 && styles.moodBtnActive]} onPress={() => setMood(i+1)}>
                <Text style={{fontSize: 24}}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Shutdown Checklist */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>🔒 Daily Shutdown Checklist</Text>
          {CURRICULUM.shutdownChecklist.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.sdItem, sd[item.id] && {opacity: 0.5}]} onPress={() => toggleShutdown(item.id)}>
              <View style={[styles.sdDot, sd[item.id] && {backgroundColor: '#10b981', borderColor: '#10b981'}]} />
              <View style={{flex: 1}}>
                <Text style={[styles.sdTitle, sd[item.id] && {textDecorationLine: 'line-through'}]}>{item.title}</Text>
                <Text style={styles.sdDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 16}}>
            {[{id:'learned',l:'💡 Learned'}, {id:'built',l:'🏗️ Built'}, {id:'confusing',l:'🤔 Confusing'}].map(t => (
              <TouchableOpacity key={t.id} style={[styles.noteTab, noteTab === t.id && styles.noteTabActive]} onPress={() => setNoteTab(t.id)}>
                <Text style={[styles.noteTabTxt, noteTab === t.id && {color: '#fff'}]}>{t.l}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput
            style={styles.textInput}
            multiline
            placeholderTextColor="#64748b"
            placeholder="Write here..."
            value={notes[noteTab] || ''}
            onChangeText={saveNote}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#14141e', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8' },
  
  dateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, backgroundColor: '#0a0a0f', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dateBtn: { paddingHorizontal: 20 },
  dateArrow: { fontSize: 28, color: '#94a3b8' },
  dateDisplay: { alignItems: 'center', width: 140 },
  dateMain: { fontSize: 16, fontWeight: '700', color: '#f8fafc' },
  dateSub: { fontSize: 11, color: '#64748b' },

  card: { backgroundColor: '#14141e', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  moodBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  moodBtnActive: { borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.15)' },

  sdItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  sdDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#64748b', marginRight: 12, marginTop: 4 },
  sdTitle: { fontSize: 15, fontWeight: '600', color: '#e2e8f0', marginBottom: 4 },
  sdDesc: { fontSize: 13, color: '#94a3b8' },

  noteTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.02)', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  noteTabActive: { backgroundColor: 'rgba(124,58,237,0.15)', borderColor: '#7c3aed' },
  noteTabTxt: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
  textInput: { height: 120, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 16, color: '#e2e8f0', fontSize: 15, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' }
});
