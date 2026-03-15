import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useAppContext } from '../AppContext';
import { LinearGradient } from 'expo-linear-gradient';

// We import data manually for curriculum calculations
import { CURRICULUM, QUOTES } from '../data';

export default function DashboardScreen() {
  const { user, state } = useAppContext();

  const getStreamDay = () => {
    const start = new Date(state.startDate);
    const now = new Date();
    start.setHours(0,0,0,0); now.setHours(0,0,0,0);
    const diff = Math.floor((now - start) / 86400000);
    return Math.max(1, Math.min(diff + 1, 112));
  };

  const getTotalProgress = () => {
    let done = 0;
    for (const key in state.checked) {
      if (state.checked[key] && !isNaN(Number(key))) done++;
    }
    return Math.min(100, Math.round((done / 112) * 100));
  };

  const getMonthProgress = (monthIdx) => {
    const month = CURRICULUM.months[monthIdx];
    let done = 0;
    month.weeks.forEach(w => w.days.forEach(d => {
      if (!d.isProject && state.checked[String(d.id)]) done++;
    }));
    return Math.min(100, Math.round((done / month.totalDays) * 100));
  };

  const getQuote = () => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,1))/86400000);
    return QUOTES[dayOfYear % QUOTES.length];
  };

  const streamDay = getStreamDay();
  const totalPct = getTotalProgress();
  const quote = getQuote();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? '☀️ Good morning' : hour < 17 ? '👋 Good afternoon' : '🌙 Good evening';
  const MCOLORS = ['#7c3aed','#0ea5e9','#10b981','#f59e0b'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greetingText}>{greeting}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! 🚀</Text>
          <Text style={styles.subGreeting}>Today is Day <Text style={{fontWeight:'bold'}}>{streamDay}</Text> of your 112-day journey</Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {state.streak||0}</Text>
        </View>
      </View>

      {/* Stream Banner */}
      <LinearGradient colors={['rgba(124,58,237,0.15)', 'rgba(124,58,237,0.05)']} style={styles.streamBanner}>
        <View style={styles.streamRow}>
          <View>
            <Text style={styles.streamDayNum}>Day {streamDay}</Text>
            <Text style={styles.streamLabel}>of 112</Text>
          </View>
          <View style={{flex:1, marginHorizontal:20}}>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(streamDay/112)*100}%` }]} />
            </View>
          </View>
          <View style={{alignItems:'flex-end'}}>
            <Text style={styles.streamDayNum}>{Math.round((streamDay/112)*100)}%</Text>
            <Text style={styles.streamLabel}>elapsed</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Overview Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4-Month DS Journey</Text>
        <Text style={styles.cardSub}>112 days · 16 weeks · 12 projects</Text>
        <Text style={{color:'#f8fafc', fontSize:24, fontWeight:'900', marginTop:12}}>{totalPct}% Overall</Text>
      </View>

      {/* Month Cards */}
      <View style={styles.monthGrid}>
        {CURRICULUM.months.map((m, i) => {
          const pct = getMonthProgress(i);
          return (
            <View key={i} style={styles.monthCard}>
              <Text style={styles.monthNum}>Month {m.id}</Text>
              <Text style={styles.monthTitle} numberOfLines={1}>{m.subtitle}</Text>
              <Text style={[styles.monthPct, { color: MCOLORS[i] }]}>{pct}%</Text>
              <View style={styles.mBarBg}>
                <View style={[styles.mBarFill, { width: `${pct}%`, backgroundColor: MCOLORS[i] }]} />
              </View>
            </View>
          );
        })}
      </View>

      {/* Quote Card */}
      <View style={[styles.card, { marginTop: 16, alignItems: 'center' }]}>
        <Text style={{fontSize: 24, marginBottom:8}}>💬</Text>
        <Text style={{color:'#f8fafc', fontSize:14, fontStyle:'italic', textAlign:'center', marginBottom:8}}>"{quote.text}"</Text>
        <Text style={{color:'#64748b', fontSize:12}}>— {quote.author}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 40 },
  greetingText: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subGreeting: { fontSize: 13, color: '#94a3b8' },
  streakBadge: { backgroundColor: 'rgba(255,161,22,0.1)', paddingHorizontal:12, paddingVertical:6, borderRadius:20, borderWidth:1, borderColor:'rgba(255,161,22,0.2)' },
  streakText: { color: '#fbbf24', fontWeight: '800', fontSize: 14 },
  
  streamBanner: { borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(124,58,237,0.3)' },
  streamRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streamDayNum: { fontSize: 24, fontWeight: '900', color: '#a855f7' },
  streamLabel: { fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
  barTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: '#a855f7', borderRadius: 3 },

  card: { backgroundColor: '#14141e', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  cardSub: { fontSize: 13, color: '#64748b', marginTop: 4 },

  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 16 },
  monthCard: { width: '48%', backgroundColor: '#14141e', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  monthNum: { fontSize: 10, color: '#64748b', fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
  monthTitle: { fontSize: 13, color: '#f8fafc', fontWeight: '600', marginBottom: 12 },
  monthPct: { fontSize: 22, fontWeight: '900', marginBottom: 8 },
  mBarBg: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2 },
  mBarFill: { height: '100%', borderRadius: 2 }
});
