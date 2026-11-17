import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import AuthScreen from '../components/AuthScreen';

const BLUE = '#1F5FA6';
const roles = [
  { role: 'jobseeker', icon: 'search', accent: colors.green, bg: '#EEF7F1', title: "I'm a Job Seeker",
    text: 'Find work close to home and apply from your phone.', tags: ['Find jobs', 'Apply', 'Save'] },
  { role: 'employer', icon: 'briefcase', accent: BLUE, bg: '#E8F1FB', title: "I'm an Employer",
    text: 'Post openings and hire skilled people from Bunawan.', tags: ['Post jobs', 'Find workers', 'Manage'] },
];

export default function RoleSelectScreen({ navigation }) {
  return (
    <AuthScreen compact title="Join Trabaho Tu Bunawan" subtitle="Choose the account type that fits you." onBack={() => navigation.goBack()}>
      <Text style={s.heading}>I want to...</Text>
      {roles.map((r) => (
        <Pressable
          key={r.role}
          style={({ pressed }) => [s.card, { backgroundColor: r.bg, borderColor: pressed ? r.accent : 'transparent' }]}
          onPress={() => navigation.navigate('Register', { role: r.role })}>
          <View style={[s.icon, { backgroundColor: r.accent }]}><Ionicons name={r.icon} size={26} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{r.title}</Text>
            <Text style={s.text}>{r.text}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              {r.tags.map((t) => (
                <View key={t} style={[s.tag, { borderColor: r.accent }]}><Text style={{ color: r.accent, fontSize: 11, fontWeight: '700' }}>{t}</Text></View>
              ))}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color={r.accent} />
        </Pressable>
      ))}
      <Pressable onPress={() => navigation.navigate('Login')} style={{ marginTop: 10 }}>
        <Text style={{ textAlign: 'center', color: colors.green, fontWeight: '700' }}>Already have an account? Log in</Text>
      </Pressable>
    </AuthScreen>
  );
}

const s = StyleSheet.create({
  heading: { fontSize: 18, fontWeight: '800', color: colors.forest, marginBottom: 14 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg + 4, padding: 16, marginBottom: 14, borderWidth: 2 },
  icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  title: { fontSize: 17, fontWeight: '800', color: colors.forest },
  text: { color: colors.muted, marginTop: 3, lineHeight: 19, fontSize: 13 },
  tag: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 3, marginRight: 6, marginBottom: 4, backgroundColor: '#fff' },
});
