import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabs from './MainTabs';
import EmployerTabs from './EmployerTabs';
import JobDetailsScreen from '../screens/JobDetailsScreen';
import ApplyScreen from '../screens/ApplyScreen';
import ApplicationDetailsScreen from '../screens/ApplicationDetailsScreen';
import EmployersScreen from '../screens/EmployersScreen';
import EmployerDetailsScreen from '../screens/EmployerDetailsScreen';
import SafetyScreen from '../screens/SafetyScreen';
import ApplicantDetailsScreen from '../screens/ApplicantDetailsScreen';
import PostJobScreen from '../screens/PostJobScreen';
import BarangaysScreen from '../screens/BarangaysScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { ready, user, seenWelcome, isEmployer } = useApp();
  const [splashDone, setSplashDone] = useState(false);

  // 1) Splash with the logo, while saved data is read from AsyncStorage
  if (!ready || !splashDone) return <SplashScreen onFinish={() => setSplashDone(true)} />;

  return (
    <Stack.Navigator
      // logged-out: first launch -> welcome slides, later launches -> Login
      initialRouteName={user ? (isEmployer ? 'EmployerMain' : 'Main') : seenWelcome ? 'Login' : 'Welcome'}
      screenOptions={{
        headerStyle: { backgroundColor: colors.forest },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}>
      {!user ? (
        <>
          {/* Auth flow: only shown when nobody is logged in (there is no guest mode) */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : isEmployer ? (
        <>
          {/* Employer side: Dashboard / My Jobs / Applicants / Profile tabs */}
          <Stack.Screen name="EmployerMain" component={EmployerTabs} options={{ headerShown: false }} />
          <Stack.Screen name="ApplicantDetails" component={ApplicantDetailsScreen} options={{ title: 'Applicant' }} />
          <Stack.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post a Job' }} />
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
          <Stack.Screen name="EmployerDetails" component={EmployerDetailsScreen} options={{ title: 'Business page' }} />
          <Stack.Screen name="Safety" component={SafetyScreen} options={{ title: 'Safety Tips' }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
        </>
      ) : (
        <>
          {/* Job seeker side (bottom tabs) */}
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          {/* Detail screens pushed on top of the tabs: back button is automatic */}
          <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ title: 'Job Details' }} />
          <Stack.Screen name="Apply" component={ApplyScreen} options={{ title: 'Apply for Job' }} />
          <Stack.Screen name="ApplicationDetails" component={ApplicationDetailsScreen} options={{ title: 'Application' }} />
          <Stack.Screen name="Employers" component={EmployersScreen} options={{ title: 'Verified Employers' }} />
          <Stack.Screen name="EmployerDetails" component={EmployerDetailsScreen} options={{ title: 'Employer' }} />
          <Stack.Screen name="Safety" component={SafetyScreen} options={{ title: 'Safety Tips' }} />
          <Stack.Screen name="Barangays" component={BarangaysScreen} options={{ title: 'Bunawan Barangays' }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
