import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Button, CategoryBadge, Field, Empty, Pill, styles } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function ApplyScreen({ navigation, route }) {
  const { jobId } = route.params;
  const { user, addApplication, findJob, findEmployer } = useApp();
  const job = findJob(jobId);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', message: '' });
  const [errors, setErrors] = useState({});
  if (!job) return <Empty icon="alert-circle-outline" title="Job not found" text="This job may have been removed." />;

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!/^09\d{9}$/.test(form.phone)) e.phone = 'Use an 11-digit number starting with 09';
    setErrors(e);
    if (Object.keys(e).length) return;
    const id = addApplication({ jobId, ...form, name: form.name.trim() });
    Alert.alert('Application sent', `Your application for ${job.title} was submitted.`, [
      // replace: Apply screen is removed so Back doesn't return to a finished form
      { text: 'View application', onPress: () => navigation.replace('ApplicationDetails', { applicationId: id }) },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center', marginBottom: 20 }]}>
          <CategoryBadge categoryId={job.categoryId} size={52} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontWeight: '800', fontSize: 17, color: colors.forest, letterSpacing: -0.2 }}>{job.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>{findEmployer(job.employerId)?.name}</Text>
            <View style={{ flexDirection: 'row' }}><Pill tone="blue" icon="location" text={job.barangay} /></View>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.forest, marginBottom: 4 }}>Your details</Text>
        <Text style={{ color: colors.muted, marginBottom: 16 }}>The employer will use these to contact you.</Text>
        <Field label="Full name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} error={errors.name} />
        <Field label="Mobile number" value={form.phone} onChangeText={(t) => setForm({ ...form, phone: t })} keyboardType="numeric" maxLength={11} error={errors.phone} />
        <Field label="Message to employer (optional)" value={form.message} onChangeText={(t) => setForm({ ...form, message: t })} multiline numberOfLines={4} style={[styles.input, { height: 110, textAlignVertical: 'top' }]} />

        <View style={{ flexDirection: 'row', backgroundColor: colors.goldSoft, borderRadius: 12, padding: 12, marginBottom: 18 }}>
          <Ionicons name="shield-checkmark" size={20} color="#8A6200" style={{ marginRight: 10, marginTop: 1 }} />
          <Text style={{ flex: 1, color: colors.goldInk, lineHeight: 20 }}>Never pay any fee to get a job. Real employers do not ask for money.</Text>
        </View>
        <Button title="Submit application" icon="paper-plane" onPress={submit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
