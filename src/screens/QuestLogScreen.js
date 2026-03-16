import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAppContext } from '../AppContext';
import { Ionicons } from '@expo/vector-icons';

export default function QuestLogScreen() {
  const { state, completeQuest } = useAppContext();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelRow}>
           <View style={styles.levelBadge}>
             <Text style={styles.levelText}>LVL {state.level || 1}</Text>
           </View>
           <View style={styles.xpBarContainer}>
             <View style={[styles.xpBarFill, { width: `${(state.xp % 500) / 5}%` }]} />
           </View>
        </View>
        <Text style={styles.xpSummary}>{state.xp % 500} / 500 XP to next level</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>⚔️ ACTIVE QUESTS</Text>
        {state.quests.map(quest => (
          <TouchableOpacity 
            key={quest.id} 
            style={[styles.questCard, quest.done && styles.questDone]}
            onPress={() => completeQuest(quest.id)}
            disabled={quest.done}
          >
            <View style={styles.questInfo}>
              <Text style={[styles.questLabel, quest.done && styles.textStrikethrough]}>{quest.label}</Text>
              <Text style={styles.questXP}>{quest.XP} XP Reward</Text>
              <View style={[styles.typeBadge, { backgroundColor: quest.type === 'daily' ? '#3b82f6' : '#a855f7' }]}>
                <Text style={styles.typeText}>{quest.type.toUpperCase()}</Text>
              </View>
            </View>
            <View style={[styles.checkbox, quest.done && styles.checkboxDone]}>
              {quest.done && <Ionicons name="checkmark-sharp" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#64748b" />
          <Text style={styles.infoText}>Complete quests to earn XP and level up your warrior focus.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', paddingTop: 60 },
  header: { padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  levelBadge: { backgroundColor: '#7c3aed', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  levelText: { color: '#fff', fontSize: 18, fontWeight: '900' },
  xpBarContainer: { flex: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden' },
  xpBarFill: { height: '100%', backgroundColor: '#7c3aed' },
  xpSummary: { color: '#64748b', fontSize: 12, marginTop: 8, fontWeight: '600' },

  scrollContent: { padding: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 2, marginBottom: 20 },
  questCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#14141e', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  questDone: { opacity: 0.5, borderColor: 'rgba(16,185,129,0.2)' },
  questInfo: { flex: 1 },
  questLabel: { color: '#f8fafc', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  questXP: { color: '#fbbf24', fontSize: 12, fontWeight: '800', marginBottom: 8 },
  textStrikethrough: { textDecorationLine: 'line-through' },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  typeText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 40, padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16 },
  infoText: { flex: 1, color: '#64748b', fontSize: 12, fontStyle: 'italic' }
});
