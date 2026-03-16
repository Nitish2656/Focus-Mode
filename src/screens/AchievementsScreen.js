import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function AchievementsScreen() {
  const { state } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Achievement Vault</Text>
        <Text style={styles.subtitle}>Your focus legacy documented</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{state.achievements.filter(a => a.earned).length}</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{state.maxStreak || 0}</Text>
            <Text style={styles.statLabel}>Max Streak</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>UNLOCKED MILESTONES</Text>
        <View style={styles.grid}>
          {state.achievements.map(achievement => (
            <View key={achievement.id} style={[styles.achievementCard, !achievement.earned && styles.lockedCard]}>
              <View style={[styles.iconBox, { backgroundColor: achievement.earned ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.03)' }]}>
                {achievement.earned ? (
                  <Text style={{ fontSize: 32 }}>{achievement.icon}</Text>
                ) : (
                  <Ionicons name="lock-closed-sharp" size={24} color="#334155" />
                )}
              </View>
              <Text style={[styles.achievementTitle, !achievement.earned && { color: '#334155' }]}>{achievement.label}</Text>
              <Text style={styles.achievementDesc}>{achievement.desc}</Text>
              {achievement.earned && (
                <View style={styles.earnedBadge}>
                  <Text style={styles.earnedText}>EARNED</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', paddingTop: 60 },
  header: { padding: 24, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#f8fafc', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8' },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  statCard: { flex: 1, backgroundColor: '#14141e', padding: 20, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statValue: { color: '#fff', fontSize: 24, fontWeight: '900' },
  statLabel: { color: '#64748b', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },

  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748b', letterSpacing: 2, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  achievementCard: { 
    width: (Dimensions?.get('window').width - 64) / 2, 
    backgroundColor: '#14141e', 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center'
  },
  lockedCard: { opacity: 0.6 },
  iconBox: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  achievementTitle: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  achievementDesc: { color: '#64748b', fontSize: 11, textAlign: 'center', lineHeight: 16 },
  earnedBadge: { marginTop: 16, backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  earnedText: { color: '#10b981', fontSize: 9, fontWeight: '900' }
});

// Polyfill Dimensions if missing in snippet context (rare in full file)
import { Dimensions } from 'react-native';
