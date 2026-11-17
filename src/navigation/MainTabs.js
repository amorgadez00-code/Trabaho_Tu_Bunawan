import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import HomeScreen from '../screens/HomeScreen';
import JobsScreen from '../screens/JobsScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
// [icon when selected, icon when not selected]
const icons = {
  Home: ['home', 'home-outline'],
  Jobs: ['search', 'search-outline'],
  Saved: ['bookmark', 'bookmark-outline'],
  Applications: ['document-text', 'document-text-outline'],
  Profile: ['person', 'person-outline'],
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Each tab draws its own forest-green header (with the hills), so the default one is hidden
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: colors.line, paddingTop: 6 },
        tabBarIcon: ({ focused, color }) => (
          <View style={{ width: 54, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: focused ? colors.goldSoft : 'transparent' }}>
            <Ionicons name={icons[route.name][focused ? 0 : 1]} size={22} color={color} />
          </View>
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Jobs" component={JobsScreen} options={{ tabBarLabel: 'Jobs' }} />
      <Tab.Screen name="Saved" component={SavedJobsScreen} options={{ tabBarLabel: 'Saved' }} />
      <Tab.Screen name="Applications" component={ApplicationsScreen} options={{ tabBarLabel: 'Applications' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}
