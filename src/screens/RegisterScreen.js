import React, { useState } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, TAGLINE } from '../theme';
import { Button } from '../components/ui';
import AuthScreen from '../components/AuthScreen';
import AuthField from '../components/AuthField';
import AuthSelect from '../components/AuthSelect';
import useBarangays from '../hooks/useBarangays';
import { useApp } from '../context/AppContext';

const BLUE = '#1F5FA6';
const FIELD_NAMES = { name: 'name', phone: 'mobile number', email: 'email', password: 'password', barangay: 'barangay' };

// numbered section title
function Section({ n, title, hint, accent, first }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14, marginTop: first ? 0 : 10 }}>
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{n}</Text>
      </View>
      <Text style={{ flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '800', color: colors.forest }}>{title}</Text>
      {!!hint && <Text style={{ color: colors.muted, fontSize: 11 }}>{hint}</Text>}
    </View>
  );
}

// one of the two account type cards
function RoleCard({ selected, accent, tint, icon, title, sub, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ flex: 1, borderRadius: 16, padding: 14, borderWidth: 2, borderColor: selected ? accent : colors.line, backgroundColor: selected ? tint : '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? accent : '#F1F5F3' }}>
          <Ionicons name={icon} size={20} color={selected ? '#fff' : colors.muted} />
        </View>
        {selected
          ? <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="checkmark" size={14} color="#fff" /></View>
          : <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#D1D5DB' }} />}
      </View>
      <Text style={{ marginTop: 12, fontSize: 14, fontWeight: '800', color: selected ? colors.forest : '#374151' }}>{title}</Text>
      <Text style={{ marginTop: 2, fontSize: 11, fontWeight: '600', color: selected ? accent : colors.muted }}>{sub}</Text>
    </Pressable>
  );
}

export default function RegisterScreen({ navigation, route }) {
  const { setUser } = useApp();
  const { barangays, loading, error: brgyError, reload } = useBarangays();   // API data (PSGC)
  const [form, setForm] = useState({ role: route.params?.role === 'employer' ? 'employer' : 'jobseeker', name: '', email: '', phone: '', password: '', barangay: '' });
  const [errors, setErrors] = useState({});
  const isEmployer = form.role === 'employer';
  const accent = isEmployer ? BLUE : colors.green;

  // update one field and clear its error
  const set = (k) => (v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = isEmployer ? 'Business or owner name is required' : 'Full name is required';
    if (!/^09\d{9}$/.test(form.phone)) e.phone = 'Use an 11-digit number starting with 09';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    if (!form.barangay) e.barangay = 'Choose your barangay';
    setErrors(e);
    if (Object.keys(e).length) return;
    const { password, ...safeUser } = form;   // never save the password on the device
    setUser({ ...safeUser, name: form.name.trim() });
    Alert.alert('Account created', 'Welcome to Trabaho Tu Bunawan!');   // the app opens the main screens automatically
  };

  // the Create Account button stays visible, so list what is still missing right above it
  const missing = Object.keys(errors).filter((k) => errors[k]).map((k) => FIELD_NAMES[k]);

  return (
    <AuthScreen
      compact
      title="Create your account"
      subtitle={isEmployer ? 'Post jobs and hire local talent.' : 'Find work close to home.'}
      onBack={() => navigation.goBack()}
      footer={
        <>
          {missing.length > 0 && <Text style={{ color: colors.danger, fontSize: 12, textAlign: 'center', marginBottom: 8 }}>Please check: {missing.join(', ')}</Text>}
          <Button title="Create Account" onPress={submit} style={{ paddingVertical: 16, backgroundColor: accent }} />
        </>
      }>

      {/* 1. account type */}
      <Section first n="1" title="Account type" hint="Choose one" accent={accent} />
      <View style={{ flexDirection: 'row' }}>
        <RoleCard selected={!isEmployer} accent={colors.green} tint="#EEF7F1" icon="search" title="Job Seeker" sub="Find & apply for jobs" onPress={() => setForm((f) => ({ ...f, role: 'jobseeker' }))} />
        <View style={{ width: 12 }} />
        <RoleCard selected={isEmployer} accent={BLUE} tint="#E8F1FB" icon="briefcase" title="Employer" sub="Post jobs & hire locally" onPress={() => setForm((f) => ({ ...f, role: 'employer' }))} />
      </View>

      {/* 2. personal details */}
      <Section n="2" title="Your details" accent={accent} />
      <AuthField accent={accent} icon={isEmployer ? 'business-outline' : 'person-outline'} label={isEmployer ? 'Business or owner name' : 'Full name'} value={form.name} onChangeText={set('name')} placeholder={isEmployer ? 'Bunawan Hardware' : 'Juan Dela Cruz'} error={errors.name} />
      <AuthField accent={accent} icon="call-outline" label="Mobile number" value={form.phone} onChangeText={set('phone')} keyboardType="numeric" maxLength={11} placeholder="09XXXXXXXXX" error={errors.phone} />

      {/* 3. login details */}
      <Section n="3" title="Login details" accent={accent} />
      <AuthField accent={accent} icon="mail-outline" label="Email" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="you@email.com" error={errors.email} />
      <AuthField accent={accent} icon="lock-closed-outline" label="Password" secure value={form.password} onChangeText={set('password')} placeholder="At least 6 characters" error={errors.password} />

      {/* 4. barangay (dropdown, list from the PSGC API) */}
      <Section n="4" title="Your barangay" hint="Required" accent={accent} />
      <AuthSelect
        accent={accent}
        icon="location-outline"
        label="Barangay"
        title="Select your barangay"
        placeholder={loading ? 'Loading barangays...' : 'Select your barangay'}
        value={form.barangay}
        options={barangays}
        onSelect={set('barangay')}
        loading={loading}
        note={brgyError ? `Could not update the list: ${brgyError}` : null}
        onRetry={reload}
        error={errors.barangay}
      />

      <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 14 }} />
      <Text style={{ textAlign: 'center', color: colors.muted, fontSize: 13 }}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={{ color: colors.green, fontWeight: '800' }}>Log in</Text>
      </Text>
      <Text style={{ textAlign: 'center', color: colors.green, fontWeight: '700', fontSize: 11, marginTop: 16 }}>{TAGLINE}</Text>
    </AuthScreen>
  );
}
