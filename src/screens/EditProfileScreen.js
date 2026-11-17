import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Text, View, Alert } from 'react-native';
import { colors } from '../theme';
import { Avatar, Button, Field, Chip, styles } from '../components/ui';
import { initials } from '../utils/format';
import useBarangays from '../hooks/useBarangays';
import { useApp } from '../context/AppContext';

// UPDATE operation: edit the saved profile. The barangay list comes from the PSGC API.
export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useApp();
  const { barangays, loading, error } = useBarangays();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', barangay: user?.barangay || '' });
  const [errors, setErrors] = useState({});

  const save = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^09\d{9}$/.test(form.phone)) e.phone = 'Use an 11-digit number starting with 09';
    if (!form.barangay) e.barangay = 'Choose your barangay';
    setErrors(e);
    if (Object.keys(e).length) return;
    updateUser({ ...form, name: form.name.trim() });
    Alert.alert('Profile updated', 'Your changes were saved on this device.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', marginBottom: 22 }}>
          <Avatar text={initials(form.name)} size={84} bg={colors.forest} fg={colors.gold} />
          <Text style={{ color: colors.muted, marginTop: 8 }}>{user?.email}</Text>
        </View>
        <Field label="Full name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} error={errors.name} />
        <Field label="Mobile number" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} keyboardType="numeric" maxLength={11} error={errors.phone} />
        <Text style={styles.label}>Barangay {loading ? '(updating list...)' : ''}</Text>
        {!!error && <Text style={[styles.error, { marginBottom: 6 }]}>Could not update the list: {error}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
          {barangays.map((b) => (
            <View key={b} style={{ marginBottom: 8 }}><Chip icon="location-outline" text={b} active={form.barangay === b} onPress={() => setForm({ ...form, barangay: b })} /></View>
          ))}
        </View>
        {!!errors.barangay && <Text style={styles.error}>{errors.barangay}</Text>}
        <Button title="Save changes" icon="checkmark" onPress={save} style={{ marginTop: 16 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
