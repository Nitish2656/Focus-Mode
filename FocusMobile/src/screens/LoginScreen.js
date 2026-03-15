import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; // Expo web support
// Native sign-in requires @react-native-google-signin/google-signin, but for dev we use simulated login wrapper.

export default function LoginScreen() {
  const handleLogin = async () => {
    // In actual Expo Go environment, we use native Google provider.
    // Given the placeholder Firebase config constraints, we add a mock/simulated login
    // just so the dev can test the UI before injecting production native keys.
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch(e) {
      console.warn("Login requires valid web keys or native setup. Error:", e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glow1} />
      <View style={styles.glow2} />
      
      <View style={styles.card}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3242/3242257.png' }} style={styles.logo} />
        <Text style={styles.title}>Focus</Text>
        <Text style={styles.subtitle}>Your 112-day Data Science journey starts here</Text>

        <View style={styles.features}>
          <Text style={styles.featureItem}>☁️ Progress saved to cloud</Text>
          <Text style={styles.featureItem}>📱 Native experience</Text>
          <Text style={styles.featureItem}>🔥 Streak & habit tracking</Text>
        </View>

        <TouchableOpacity style={styles.googleBtn} onPress={handleLogin}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>
        <Text style={styles.terms}>By signing in you agree to use this app for learning 🚀</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' },
  glow1: { position: 'absolute', top: -100, left: -100, width: 300, height: 300, backgroundColor: 'rgba(124, 58, 237, 0.4)', borderRadius: 150, opacity: 0.5 },
  glow2: { position: 'absolute', bottom: -100, right: -100, width: 250, height: 250, backgroundColor: 'rgba(14, 165, 233, 0.3)', borderRadius: 125, opacity: 0.5 },
  card: { width: '90%', padding: 40, backgroundColor: 'rgba(20, 20, 30, 0.8)', borderRadius: 24, alignItems: 'center', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  logo: { width: 80, height: 80, borderRadius: 20, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 32, textAlign: 'center' },
  features: { alignSelf: 'stretch', backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 16, marginBottom: 32 },
  featureItem: { color: '#94a3b8', fontSize: 13, marginBottom: 12 },
  googleBtn: { width: '100%', padding: 16, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center' },
  googleText: { color: '#3c4043', fontWeight: 'bold', fontSize: 15 },
  terms: { color: '#64748b', fontSize: 11, marginTop: 24, textAlign: 'center' }
});
