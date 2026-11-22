import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import EmployerDashboardScreen from '../screens/EmployerDashboardScreen';
import EmployerJobsScreen from '../screens/EmployerJobsScreen';
import ApplicantsScreen from '../screens/ApplicantsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
// [icon when selected, icon when not selected]
const icons = {
  Dashboard: ['grid', 'grid-outline'],
  MyJobs: ['briefcase', 'briefcase-outline'],
  Applicants: ['people', 'people-outline'],
  Profile: ['person', 'person-outline'],
};

// Bottom tabs for employer accounts (same look as the job seeker tabs)
export default function EmployerTabs() {
  const { employerApplications } = useApp();
  const newCount = employerApplications.filter((a) => a.status === 'pending').length;   // red badge on Applicants

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
      <Tab.Screen name="Dashboard" component={EmployerDashboardScreen} />
      <Tab.Screen name="MyJobs" component={EmployerJobsScreen} options={{ tabBarLabel: 'My Jobs' }} />
      <Tab.Screen name="Applicants" component={ApplicantsScreen} options={{ tabBarBadge: newCount > 0 ? newCount : undefined, tabBarBadgeStyle: { backgroundColor: colors.danger } }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
