import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useAppContext } from '../AppContext';
import { Ionicons } from '@expo/vector-icons';

const SUGGESTED_APPS = [
  { name: 'YouTube', pkg: 'com.google.android.youtube', icon: 'logo-youtube' },
  { name: 'Instagram', pkg: 'com.instagram.android', icon: 'logo-instagram' },
  { name: 'Facebook', pkg: 'com.facebook.katana', icon: 'logo-facebook' },
  { name: 'Twitter / X', pkg: 'com.twitter.android', icon: 'logo-twitter' },
  { name: 'TikTok', pkg: 'com.zhiliaoapp.musically', icon: 'videocam' },
];

export default function LimitsScreen() {
  const { state, updateState } = useAppContext();
  const [editingPkg, setEditingPkg] = useState(null);
  const [limitVal, setLimitVal] = useState('');

  const saveLimit = () => {
    const mins = parseInt(limitVal);
    if (isNaN(mins) || mins < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number of minutes.');
      return;
    }
    const newLimits = { ...state.appLimits, [editingPkg]: mins };
    updateState('appLimits', newLimits);
    setEditingPkg(null);
    setLimitVal('');
  };

  const removeLimit = (pkg) => {
    const newLimits = { ...state.appLimits };
    delete newLimits[pkg];
    updateState('appLimits', newLimits);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 40}}>
      <View style={styles.header}>
        <Text style={styles.title}>App Limits</Text>
        <Text style={styles.subtitle}>Set daily time caps for distractions ⏳</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Limits</Text>
        {Object.keys(state.appLimits || {}).length === 0 ? (
          <Text style={styles.emptyText}>No limits set. You are a free warrior! 🛡️</Text>
        ) : (
          Object.entries(state.appLimits).map(([pkg, mins]) => {
            const app = SUGGESTED_APPS.find(a => a.pkg === pkg) || { name: pkg, icon: 'apps' };
            return (
              <View key={pkg} style={styles.limitCard}>
                <Ionicons name={app.icon} size={24} color="#7c3aed" />
                <View style={{flex: 1, marginLeft: 12}}>
                  <Text style={styles.appName}>{app.name}</Text>
                  <Text style={styles.appLimitText}>{mins}m allowed daily</Text>
                </View>
                <TouchableOpacity onPress={() => removeLimit(pkg)}>
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Limit</Text>
        {SUGGESTED_APPS.map(app => (
          <TouchableOpacity 
            key={app.pkg} 
            style={styles.suggestedCard}
            onPress={() => {
              setEditingPkg(app.pkg);
              setLimitVal(String(state.appLimits?.[app.pkg] || ''));
            }}
          >
            <Ionicons name={app.icon} size={20} color="#94a3b8" />
            <Text style={styles.suggestedName}>{app.name}</Text>
            <Ionicons name="add-circle-outline" size={20} color="#7c3aed" />
          </TouchableOpacity>
        ))}
      </View>

      {editingPkg && (
        <View style={styles.modalOverlay}>
            <View style={styles.modal}>
                <Text style={styles.modalTitle}>Set Limit (Minutes)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={limitVal}
                    onChangeText={setLimitVal}
                    placeholder="e.g. 30"
                    placeholderTextColor="#64748b"
                    autoFocus
                />
                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setEditingPkg(null)}>
                        <Text style={styles.btnCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveLimit} style={styles.btnSave}>
                        <Text style={{color: '#fff', fontWeight: 'bold'}}>Save Limit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 20, paddingTop: 60 },
  header: { marginBottom: 30 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  
  limitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#14141e', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)' },
  appName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  appLimitText: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  emptyText: { color: '#64748b', fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginTop: 10 },

  suggestedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#14141e', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  suggestedName: { flex: 1, color: '#f8fafc', fontSize: 14, fontWeight: '600', marginLeft: 12 },

  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  modal: { backgroundColor: '#1a1a2e', width: '80%', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#0a0a0f', padding: 16, borderRadius: 12, color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#7c3aed' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btnCancel: { color: '#64748b', fontWeight: '700' },
  btnSave: { backgroundColor: '#7c3aed', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }
});
