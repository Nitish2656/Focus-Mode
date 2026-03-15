import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, useAppContext } from './src/AppContext';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CurriculumScreen from './src/screens/CurriculumScreen';
import LogScreen from './src/screens/LogScreen';
import DisciplineScreen from './src/screens/DisciplineScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();

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
          else if (route.name === 'Remind') iconName = focused ? 'notifications' : 'notifications-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Learn" component={CurriculumScreen} />
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="Focus" component={DisciplineScreen} />
      <Tab.Screen name="Remind" component={RemindersScreen} />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { user, loading } = useAppContext();
  
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0f', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }
  
  return (
    <NavigationContainer theme={MyDarkTheme}>
      {user ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
