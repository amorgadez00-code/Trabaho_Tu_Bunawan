import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, TAGLINE } from '../theme';
import { Button } from '../components/ui';
import AuthScreen from '../components/AuthScreen';
import AuthField from '../components/AuthField';
import { DEMO_ACCOUNTS } from '../data/mockData';
import { useApp } from '../context/AppContext';

const BLUE = '#1F5FA6';

export default function LoginScreen({ navigation }) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Enter a valid email address';
    if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    // The account decides the role. Once the user is set, the app opens the job seeker or employer screens by itself.
    const result = login(email, password);
    if (!result.ok) setErrors({ password: result.error });
  };

  const fillDemo = (d) => { setEmail(d.profile.email); setPassword(d.password); setErrors({}); };

  return (
    <AuthScreen title="Welcome back" subtitle="Log in as a job seeker or as an employer.">
      <AuthField icon="mail-outline" label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@email.com" error={errors.email} />
      <AuthField icon="lock-closed-outline" label="Password" secure value={password} onChangeText={setPassword} placeholder="Your password" error={errors.password} />
      <Button title="Log In" onPress={submit} style={{ paddingVertical: 16, marginTop: 6 }} />

      {/* Demo logins: tap one to fill the form, then press Log In */}
      <View style={{ backgroundColor: colors.goldSoft, borderRadius: 16, padding: 12, marginTop: 18 }}>
        <Text style={{ color: colors.goldInk, fontWeight: '800', fontSize: 12, letterSpacing: 0.5, marginBottom: 8 }}>DEMO ACCOUNTS · TAP TO FILL</Text>
        {DEMO_ACCOUNTS.map((d) => {
          const employer = d.profile.role === 'employer';
          return (
            <Pressable key={d.profile.email} onPress={() => fillDemo(d)} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginTop: 6 }, pressed && { opacity: 0.8 }]}>
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: employer ? BLUE : colors.green, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Ionicons name={employer ? 'briefcase' : 'search'} size={17} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', color: colors.forest }}>{d.label}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{d.profile.email} · {d.password}</Text>
              </View>
              <Ionicons name="arrow-forward-circle-outline" size={22} color={colors.muted} />
            </Pressable>
          );
        })}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
        <Text style={{ marginHorizontal: 12, color: colors.muted, fontSize: 13 }}>New to Trabaho Tu Bunawan?</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
      </View>

      <Button title="Create an Account" variant="outline" style={{ paddingVertical: 15 }} onPress={() => navigation.navigate('Register')} />
      <Text style={{ textAlign: 'center', color: colors.green, fontWeight: '700', fontSize: 12, marginTop: 'auto', paddingTop: 26 }}>{TAGLINE}</Text>
    </AuthScreen>
  );
}
