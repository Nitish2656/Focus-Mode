import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../AppContext';
import { CURRICULUM } from '../data';
import { Ionicons } from '@expo/vector-icons';

export default function CurriculumScreen() {
  const { state, updateState } = useAppContext();
  const [activeMonthIdx, setActiveMonthIdx] = useState(0);
  const [openWeeks, setOpenWeeks] = useState({ 'm0w0': true }); // Default first week open

  const MCOLORS = ['#7c3aed','#0ea5e9','#10b981','#f59e0b'];
  const month = CURRICULUM.months[activeMonthIdx];
  const color = MCOLORS[activeMonthIdx];

  const getStreamDay = () => {
    const start = new Date(state.startDate);
    const now = new Date();
    start.setHours(0,0,0,0); now.setHours(0,0,0,0);
    const diff = Math.floor((now - start) / 86400000);
    return Math.max(1, Math.min(diff + 1, 112));
  };
  const streamDay = getStreamDay();

  const toggleDay = (dayId) => {
    const key = String(dayId);
    updateState('checked', { ...state.checked, [key]: !state.checked[key] });
  };

  const toggleWeek = (weekId) => {
    setOpenWeeks(prev => ({ ...prev, [weekId]: !prev[weekId] }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Curriculum</Text>
        <Text style={styles.subtitle}>Stream Day {streamDay} · Track every skill</Text>
      </View>

      <View style={styles.tabsRow}>
        {CURRICULUM.months.map((m, i) => (
          <TouchableOpacity key={i} style={[styles.tab, activeMonthIdx===i && {backgroundColor: MCOLORS[i]+'20', borderColor: MCOLORS[i]}]} onPress={() => setActiveMonthIdx(i)}>
            <Text style={[styles.tabText, activeMonthIdx===i && {color: MCOLORS[i], fontWeight:'700'}]}>{m.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{color: color, fontWeight: '700', marginBottom: 16}}>{month.focus}</Text>
        
        {month.weeks.map((week, wIdx) => {
          const total = week.days.filter(d => !d.isProject).length;
          const done  = week.days.filter(d => !d.isProject && state.checked[String(d.id)]).length;
          const weekId = `m${activeMonthIdx}w${wIdx}`;
          const isOpen = !!openWeeks[weekId];

          return (
            <View key={wIdx} style={styles.weekCard}>
              <TouchableOpacity style={styles.weekHeader} onPress={() => toggleWeek(weekId)}>
                <Text style={styles.weekTitle}>{week.title}</Text>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <View style={styles.pill}><Text style={styles.pillText}>{done}/{total}</Text></View>
                  <Ionicons name={isOpen ? "chevron-down" : "chevron-forward"} size={20} color="#64748b" />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.weekBody}>
                  {week.days.map((d, dIdx) => {
                    const isDone = !!state.checked[String(d.id)];
                    const isProject = !!d.isProject;
                    
                    return (
                      <TouchableOpacity key={dIdx} 
                        style={[styles.dayItem, isDone && {backgroundColor:'rgba(255,255,255,0.02)'}, isProject && {borderColor: color}]}
                        onPress={() => toggleDay(d.id)}>
                        <View style={[styles.checkbox, isDone && {backgroundColor: color, borderColor: color}]}>
                          {isDone && <Ionicons name="checkmark" size={14} color="#fff" />}
                        </View>
                        <View style={{flex:1}}>
                          <Text style={[styles.dayTitle, isDone && {textDecorationLine:'line-through', color:'#64748b'}]}>
                            {d.title}
                          </Text>
                          <Text style={styles.dayTask}>{d.task}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { padding: 20, paddingTop: 40, backgroundColor: '#14141e', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8' },
  tabsRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'transparent', marginHorizontal: 2 },
  tabText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  
  weekCard: { backgroundColor: '#14141e', borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden' },
  weekHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  weekTitle: { fontSize: 15, fontWeight: '700', color: '#f8fafc' },
  pill: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  pillText: { color: '#94a3b8', fontSize: 11, fontWeight: '700' },
  weekBody: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  
  dayItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: '#64748b', marginRight: 16, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  dayTitle: { fontSize: 14, fontWeight: '700', color: '#e2e8f0', marginBottom: 4 },
  dayTask: { fontSize: 13, color: '#94a3b8' }
});
