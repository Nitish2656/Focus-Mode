import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { createAudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AMBIENT_TRACKS = [
  { id: 'rain', label: 'Heavy Rain', icon: 'cloud-sharp', color: '#3b82f6', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 'cyber', label: 'Cyber Cafe', icon: 'cafe-sharp', color: '#a855f7', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 'zen', label: 'Deep Zen', icon: 'leaf-sharp', color: '#10b981', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 'white', label: 'White Noise', icon: 'radio-sharp', color: '#94a3b8', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
];

export default function ZenSanctuaryScreen() {
  const [playing, setPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(AMBIENT_TRACKS[0]);
  const playerRef = useRef(null);
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Breathing Animation Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1.5, duration: 4000, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 1, duration: 4000, useNativeDriver: true }),
      ])
    ).start();

    return () => {
      if (playerRef.current) playerRef.current.pause();
    };
  }, []);

  const togglePlay = () => {
    if (playing) {
      playerRef.current?.pause();
      setPlaying(false);
    } else {
      if (!playerRef.current || playerRef.current.src !== selectedTrack.url) {
        playerRef.current = createAudioPlayer(selectedTrack.url);
        playerRef.current.loop = true;
      }
      playerRef.current.play();
      setPlaying(true);
    }
  };

  const changeTrack = (track) => {
    if (playerRef.current) playerRef.current.pause();
    setSelectedTrack(track);
    setPlaying(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Zen Sanctuary</Text>
        <Text style={styles.subtitle}>Immerse yourself in focus</Text>
      </View>

      <View style={styles.visualizerContainer}>
        <Animated.View style={[styles.glowCircle, { transform: [{ scale: breatheAnim }], backgroundColor: selectedTrack.color }]} />
        <View style={styles.innerCircle}>
          <Ionicons name={selectedTrack.icon} size={64} color="#fff" />
        </View>
      </View>

      <View style={styles.playerControls}>
         <Text style={styles.trackLabel}>{selectedTrack.label}</Text>
         <TouchableOpacity style={[styles.playBtn, { backgroundColor: selectedTrack.color }]} onPress={togglePlay}>
           <Ionicons name={playing ? "pause-sharp" : "play-sharp"} size={32} color="#fff" />
         </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>SELECT AMBIENCE</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trackList}>
        {AMBIENT_TRACKS.map(track => (
          <TouchableOpacity 
            key={track.id} 
            style={[styles.trackCard, selectedTrack.id === track.id && { borderColor: track.color, backgroundColor: 'rgba(255,255,255,0.05)' }]}
            onPress={() => changeTrack(track)}
          >
            <View style={[styles.trackIcon, { backgroundColor: track.color }]}>
              <Ionicons name={track.icon} size={20} color="#fff" />
            </View>
            <Text style={styles.trackCardLabel}>{track.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.breathingHint}>
        <Text style={styles.hintText}>Follow the circle for 4-4 resonance breathing</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 24, paddingTop: 60 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '900', color: '#f8fafc', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8' },
  
  visualizerContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 40 },
  glowCircle: { width: 180, height: 180, borderRadius: 90, opacity: 0.15, position: 'absolute' },
  innerCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#14141e', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  
  playerControls: { alignItems: 'center', marginBottom: 60 },
  trackLabel: { color: '#f8fafc', fontSize: 20, fontWeight: '700', marginBottom: 24 },
  playBtn: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#64748b', letterSpacing: 2, marginBottom: 16 },
  trackList: { gap: 12 },
  trackCard: { width: 120, padding: 16, backgroundColor: '#14141e', borderRadius: 20, borderWidth: 1, borderColor: 'transparent', alignItems: 'center' },
  trackIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  trackCardLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700' },
  
  breathingHint: { marginTop: 'auto', alignItems: 'center' },
  hintText: { color: '#64748b', fontSize: 12, fontWeight: '600' }
});
