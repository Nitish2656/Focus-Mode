import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, SafeAreaView, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../AppContext';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: "112-Day Mastery",
    description: "Welcome to your rigorous Data Science and LLM curriculum. Are you ready to level up?",
    icon: "rocket",
    color: "#a855f7" 
  },
  {
    id: 2,
    title: "Hyper Focus",
    description: "Use the built-in Pomodoro timer to maintain flow state and crush your daily habits.",
    icon: "timer",
    color: "#10b981"
  },
  {
    id: 3,
    title: "Track Consistency",
    description: "Log your mood, write daily shutdown notes, and never break your learning streak.",
    icon: "analytics",
    color: "#0ea5e9"
  }
];

const AnimatedIcon = ({ name, color }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20]
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05]
  });

  return (
    <Animated.View style={[styles.iconCircle, { borderColor: color, transform: [{ translateY }, { scale }] }]}>
      <Ionicons name={name} size={100} color={color} />
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const { updateState } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setCurrentIndex(Math.round(index));
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
    } else {
      updateState('hasOnboarded', true);
    }
  };

  const handleSkip = () => {
    updateState('hasOnboarded', true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.animContainer}>
              <AnimatedIcon name={slide.icon} color={slide.color} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
          <Text style={styles.btnPrimaryText}>
            {currentIndex === SLIDES.length - 1 ? "Get Started 🚀" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f' },
  slide: { width, alignItems: 'center', padding: 20 },
  animContainer: { 
    width: width * 0.9, 
    height: width * 0.9, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: height * 0.05 
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8
  },
  textContainer: { flex: 1, alignItems: 'center', marginTop: 10, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, color: '#94a3b8', textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  footer: { padding: 40, alignItems: 'center' },
  pagination: { flexDirection: 'row', marginBottom: 30 },
  dot: { height: 8, width: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 6 },
  activeDot: { backgroundColor: '#a855f7', width: 20 },
  btnPrimary: { 
    backgroundColor: '#7c3aed', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 16, 
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  btnPrimaryText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  skipBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  skipText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' }
});
