import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { colors, TAGLINE } from '../theme';
import { Button } from '../components/ui';
import AuthScreen from '../components/AuthScreen';
import AuthField from '../components/AuthField';
import { useApp } from '../context/AppContext';

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

  return (
    <AuthScreen title="Welcome back" subtitle="Log in as a job seeker or as an employer.">
      <AuthField icon="mail-outline" label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@email.com" error={errors.email} />
      {/* secure adds the eye button that shows or hides the password */}
      <AuthField icon="lock-closed-outline" label="Password" secure value={password} onChangeText={setPassword} placeholder="Your password" error={errors.password} />
      <Button title="Log In" onPress={submit} style={{ paddingVertical: 16, marginTop: 6 }} />

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
