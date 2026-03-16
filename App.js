import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useAppContext } from './src/AppContext';

import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CurriculumScreen from './src/screens/CurriculumScreen';
import LogScreen from './src/screens/LogScreen';
import DisciplineScreen from './src/screens/DisciplineScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import StudyBuddyScreen from './src/screens/StudyBuddyScreen';
import LimitsScreen from './src/screens/LimitsScreen';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0a0a0f',
    card: '#14141e',
    text: '#f8fafc',
    border: 'rgba(255,255,255,0.05)',
    primary: '#7c3aed',
  },
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0f',
          borderTopColor: 'rgba(255,255,255,0.05)',
        },
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#64748b',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Learn') iconName = focused ? 'book' : 'book-outline';
          else if (route.name === 'Log') iconName = focused ? 'journal' : 'journal-outline';
          else if (route.name === 'Focus') iconName = focused ? 'flash' : 'flash-outline';
          else if (route.name === 'Report') iconName = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'StudyBuddy') iconName = focused ? 'school' : 'school-outline';
          else if (route.name === 'Limits') iconName = focused ? 'timer' : 'timer-outline';
          else if (route.name === 'Remind') iconName = focused ? 'notifications' : 'notifications-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Learn" component={CurriculumScreen} />
      <Tab.Screen name="Focus" component={DisciplineScreen} />
      <Tab.Screen name="Report" component={AnalyticsScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
    </Tab.Navigator>
  );
};

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0a0a0f',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.05)',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '800',
        },
        drawerStyle: {
          backgroundColor: '#0a0a0f',
          width: 260,
        },
        drawerActiveTintColor: '#7c3aed',
        drawerInactiveTintColor: '#94a3b8',
      }}
    >
      <Drawer.Screen 
        name="Main" 
        component={MainTabs} 
        options={{ 
          title: 'Focus Tracker',
          drawerIcon: ({ color, size }) => <Ionicons name="apps-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="StudyBuddy" 
        component={StudyBuddyScreen} 
        options={{ 
          title: 'Study Buddy',
          drawerIcon: ({ color, size }) => <Ionicons name="school-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="Limits" 
        component={LimitsScreen} 
        options={{ 
          title: 'App Limits',
          drawerIcon: ({ color, size }) => <Ionicons name="timer-outline" size={size} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="Remind" 
        component={RemindersScreen} 
        options={{ 
          title: 'Reminders',
          drawerIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />
        }} 
      />
    </Drawer.Navigator>
  );
};

const RootNavigator = () => {
  const { state, loading } = useAppContext();
  
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }
  
  return (
    <NavigationContainer theme={MyDarkTheme}>
      {!state.hasOnboarded ? <OnboardingScreen /> : <MainDrawer />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <RootNavigator />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
