import React, { useState, useEffect } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Text, View, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { categories } from '../data/mockData';
import { Button, Field, Chip, styles } from '../components/ui';
import useBarangays from '../hooks/useBarangays';
import useHolidays from '../hooks/useHolidays';
import { parseIso, isWeekend, weekdayName, addDays } from '../utils/dates';
import { shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

const TYPES = ['Full-time', 'Part-time', 'Contract'];

// CREATE a job post (or UPDATE one when route.params.postId is given).
// The barangay choices come from the PSGC API.
export default function PostJobScreen({ navigation, route }) {
  const postId = route.params?.postId;                // PARAM (edit mode)
  const { user, postedJobs, addPost, updatePost, myEmployerId } = useApp();
  const editing = postedJobs.find((p) => p.id === postId);
  const { barangays, loading, error: brgyError } = useBarangays();
  const { getHoliday } = useHolidays();                // Philippine holidays from Nager.Date

  const [form, setForm] = useState({
    title: editing?.title || '',
    categoryId: editing?.categoryId || null,
    type: editing?.type || 'Full-time',
    salary: editing?.salary || '',
    barangay: editing?.barangay || '',
    slots: String(editing?.slots || 1),
    deadline: editing?.deadline || '',
    description: editing?.description || '',
    requirements: editing?.qualifications?.join('\n') || '',
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (v) => setForm({ ...form, [k]: v });

  // Warn (not block) when the deadline is a weekend or a holiday, and suggest the next working day.
  const deadlineWarning = (() => {
    if (!parseIso(form.deadline)) return null;
    const holiday = getHoliday(form.deadline);
    const weekend = isWeekend(form.deadline);
    if (!holiday && !weekend) return null;
    let next = addDays(form.deadline, 1);
    for (let i = 0; i < 14 && (isWeekend(next) || getHoliday(next)); i++) next = addDays(next, 1);
    const why = holiday && weekend ? `a ${weekdayName(form.deadline)} and a holiday (${holiday})`
      : holiday ? `a holiday (${holiday})`
      : `a ${weekdayName(form.deadline)}`;
    return `${shortDate(form.deadline)} is ${why}. Applicants may not be able to reach you. Consider ${weekdayName(next)}, ${shortDate(next)} instead.`;
  })();

  useEffect(() => {
    navigation.setOptions({ title: editing ? 'Edit Job Post' : 'Post a Job' });
  }, []);

  const submit = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.categoryId) e.categoryId = 'Choose a category';
    if (!form.salary.trim()) e.salary = 'Salary is required (example: ₱400 / day)';
    if (!form.barangay) e.barangay = 'Choose the barangay of the job';
    if (!/^[1-9]\d*$/.test(form.slots)) e.slots = 'Enter a number of 1 or more';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) e.deadline = 'Use the format YYYY-MM-DD';
    else if (!parseIso(form.deadline)) e.deadline = 'That date does not exist';
    if (form.description.trim().length < 10) e.description = 'Describe the job (at least 10 characters)';
    setErrors(e);
    if (Object.keys(e).length) return;

    const fields = {
      title: form.title.trim(),
      categoryId: form.categoryId,
      type: form.type,
      salary: form.salary.trim(),
      barangay: form.barangay,
      slots: Number(form.slots),
      deadline: form.deadline,
      description: form.description.trim(),
      qualifications: form.requirements.split('\n').map((l) => l.trim()).filter(Boolean),
    };

    if (editing) {
      updatePost(editing.id, fields);                       // UPDATE
    } else {
      addPost({                                              // CREATE
        id: 'p' + Date.now(),
        employerId: myEmployerId,
        ...fields,
        responsibilities: [],
        studentFriendly: false,
        featured: false,
        posted: true,
        employer: {
          name: user.name, type: 'Local Employer', verified: 'Local Employer',
          about: `${user.name} posts jobs in Bunawan, Agusan del Sur.`,
          address: 'Bunawan, Agusan del Sur', barangay: form.barangay, landmark: '—',
          contact: user.name, position: 'Employer', phone: user.phone,
        },
      });
    }
    Alert.alert(editing ? 'Job post updated' : 'Job posted', 'It is saved on this device and visible to job seekers.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <Field label="Job title" value={form.title} onChangeText={set('title')} placeholder="Store Assistant" error={errors.title} />

        <Text style={styles.label}>Category</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
          {categories.map((c) => (
            <View key={c.id} style={{ marginBottom: 8 }}><Chip text={c.name} active={form.categoryId === c.id} onPress={() => setForm({ ...form, categoryId: c.id })} /></View>
          ))}
        </View>
        {!!errors.categoryId && <Text style={[styles.error, { marginBottom: 10 }]}>{errors.categoryId}</Text>}

        <Text style={styles.label}>Job type</Text>
        <View style={{ flexDirection: 'row', marginBottom: 14 }}>
          {TYPES.map((t) => <Chip key={t} text={t} active={form.type === t} onPress={() => setForm({ ...form, type: t })} />)}
        </View>

        <Field label="Salary" value={form.salary} onChangeText={set('salary')} placeholder="₱400 / day" error={errors.salary} />

        <Text style={styles.label}>Barangay {loading ? '(updating list...)' : ''}</Text>
        {!!brgyError && <Text style={[styles.error, { marginBottom: 6 }]}>Could not update the list: {brgyError}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
          {barangays.map((b) => (
            <View key={b} style={{ marginBottom: 8 }}><Chip text={b} active={form.barangay === b} onPress={() => setForm({ ...form, barangay: b })} /></View>
          ))}
        </View>
        {!!errors.barangay && <Text style={[styles.error, { marginBottom: 10 }]}>{errors.barangay}</Text>}

        <Field label="Available slots" value={form.slots} onChangeText={set('slots')} keyboardType="numeric" maxLength={3} error={errors.slots} />
        <Field label="Application deadline" value={form.deadline} onChangeText={set('deadline')} placeholder="2026-12-31" error={errors.deadline} />
        {!!deadlineWarning && !errors.deadline && (
          <View style={{ flexDirection: 'row', backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, marginTop: -6, marginBottom: 14 }}>
            <Ionicons name="warning-outline" size={18} color="#92400E" style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={{ flex: 1, color: '#92400E', fontSize: 13, lineHeight: 18 }}>{deadlineWarning}</Text>
          </View>
        )}
        <Field label="Job description" value={form.description} onChangeText={set('description')} multiline numberOfLines={4} style={[styles.input, { height: 100, textAlignVertical: 'top' }]} error={errors.description} />
        <Field label="Qualifications (one per line, optional)" value={form.requirements} onChangeText={set('requirements')} multiline numberOfLines={3} style={[styles.input, { height: 80, textAlignVertical: 'top' }]} />

        <Button title={editing ? 'Save Changes' : 'Post Job'} onPress={submit} />
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10, textAlign: 'center' }}>Never ask applicants to pay a fee.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
