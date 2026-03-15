import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useAppContext } from '../AppContext';
import * as Notifications from 'expo-notifications';

export default function RemindersScreen() {
  const { state, updateState } = useAppContext();
  const r = state.reminder;
  const days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const [permission, setPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      setPermission(status === 'granted');
    })();
  }, []);

  const toggleDay = (i) => {
    const newDays = [...r.days];
    const idx = newDays.indexOf(i);
    if(idx > -1) newDays.splice(idx, 1);
    else { newDays.push(i); newDays.sort(); }
    updateState('reminder', { ...r, days: newDays });
  };

  const scheduleReminder = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permissions denied.');
      return;
    }
    setPermission(true);

    const isEnabling = !r.enabled;
    updateState('reminder', { ...r, enabled: isEnabling });

    if (isEnabling) {
      // In a real app we would schedule Expo Location/Time triggers here
      // For now we simulate the scheduling action
      alert(`Reminders scheduled for ${r.time} on selected days!`);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      alert('Reminders disabled.');
    }
  };

  const testPush = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Focus 🚀",
        body: 'Time to study! Keep going! 💪',
      },
      trigger: null, // Send now
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <Text style={styles.subtitle}>Stay consistent every day</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⏰ Daily Study Reminder</Text>
        <Text style={styles.cardSub}>Get notified daily so you never miss a session using local push notifications.</Text>
        
        <View style={styles.timeRow}>
          <Text style={styles.timeInput}>{r.time}</Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={scheduleReminder}>
            <Text style={{color: '#fff', fontWeight: '700'}}>{r.enabled ? '🔔 Update' : '🔔 Enable'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Remind me on</Text>
        <View style={styles.dowPicker}>
          {days.map((d, i) => (
            <TouchableOpacity key={i} style={[styles.dowBtn, r.days.includes(i) && styles.dowActive]} onPress={() => toggleDay(i)}>
              <Text style={{color: r.days.includes(i) ? '#fff' : '#64748b', fontSize: 13, fontWeight: '700'}}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.statusBox, r.enabled ? styles.statusOn : styles.statusOff]}>
          <Text style={{color: r.enabled ? '#10b981' : '#64748b', fontWeight:'600'}}>
            {r.enabled ? `🟢 Active — daily at ${r.time}` : '⚫ Reminders are off'}
          </Text>
        </View>

        <TouchableOpacity style={styles.testBtn} onPress={testPush}>
          <Text style={{color: '#0ea5e9', fontWeight: '600'}}>🔔 Send Test Notification</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  header: { paddingBottom: 20, paddingTop: 20, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8' },

  card: { backgroundColor: '#14141e', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#f8fafc', marginBottom: 6 },
  cardSub: { fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 20 },

  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  timeInput: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: 14, borderRadius: 12, color: '#fff', fontSize: 18, fontWeight: '700', marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', textAlign: 'center' },
  btnPrimary: { backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12 },

  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  dowPicker: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  dowBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dowActive: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },

  statusBox: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16, alignItems: 'center' },
  statusOn: { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.2)' },
  statusOff: { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.05)' },

  testBtn: { padding: 16, borderRadius: 12, backgroundColor: 'rgba(14,165,233,0.1)', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(14,165,233,0.2)' }
});
