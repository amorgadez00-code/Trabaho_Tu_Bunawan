import React, { useEffect } from 'react';
import { ScrollView, View, Text, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { getCategory } from '../data/mockData';
import { Button, CategoryBadge, Empty, HillStrip, Pill, styles } from '../components/ui';
import { shortDate, closesIn } from '../utils/format';
import { useApp } from '../context/AppContext';

export default function JobDetailsScreen({ navigation, route }) {
  const { jobId } = route.params;            // PARAM RECEIVED
  const { savedIds, toggleSaved, hasApplied, user, isEmployer, findJob, findEmployer } = useApp();
  const insets = useSafeAreaInsets();
  const job = findJob(jobId);

  // useEffect: runs when the screen opens or the job changes -> set header title
  useEffect(() => {
    if (job) navigation.setOptions({ title: job.title });
  }, [jobId]);

  if (!job) return <Empty icon="alert-circle-outline" title="Job not available" text="This job is no longer available." />;
  const emp = findEmployer(job.employerId);
  const saved = savedIds.includes(job.id);
  const applied = hasApplied(job.id);

  const onApply = () => {
    if (isEmployer) {
      Alert.alert('Employer account', 'Employers cannot apply for jobs. Log in with a job seeker account.');
      return;
    }
    navigation.navigate('Apply', { jobId: job.id });   // PARAM SENT
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Hero: continues the forest-green header of the screen */}
        <View style={{ backgroundColor: colors.forest, paddingHorizontal: 20, paddingTop: 6 }}>
          <CategoryBadge categoryId={job.categoryId} size={52} />
          <Text style={{ color: '#fff', fontSize: 27, fontWeight: '800', letterSpacing: -0.6, marginTop: 14 }}>{job.title}</Text>
          {!!emp && (
            <Pressable onPress={() => navigation.navigate('EmployerDetails', { employerId: emp.id })} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <Text style={{ color: '#CFE8D9', fontSize: 15, fontWeight: '600' }}>{emp.name}</Text>
              {!!emp.verified && <Ionicons name="checkmark-circle" size={16} color={colors.gold} style={{ marginLeft: 5 }} />}
              <Ionicons name="chevron-forward" size={15} color="#CFE8D9" style={{ marginLeft: 2 }} />
            </Pressable>
          )}
          <Text style={{ color: colors.gold, fontSize: 24, fontWeight: '800', marginTop: 14 }}>{job.salary}</Text>
          <HillStrip height={64} sun style={{ marginTop: 6 }} />
        </View>

        <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, marginTop: -16, padding: 16 }}>
          {/* Key facts */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
            <Fact icon="time-outline" label="Job type" value={job.type} />
            <Fact icon="location" label="Barangay" value={job.barangay} tint={[colors.blueSoft, colors.blue]} />
            <Fact icon="people-outline" label="Openings" value={`${job.slots} ${job.slots === 1 ? 'slot' : 'slots'}`} />
            <Fact icon="calendar-outline" label="Apply before" value={shortDate(job.deadline)} tint={[colors.goldSoft, '#8A6200']} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
            {!!closesIn(job.deadline) && <Pill tone="gold" icon="hourglass-outline" text={closesIn(job.deadline)} />}
            <Pill tone="neutral" icon="grid-outline" text={getCategory(job.categoryId)?.name || 'Others'} />
            {job.studentFriendly && <Pill tone="green" icon="school-outline" text="Student-friendly" />}
          </View>

          <Section title="About the job"><Text style={{ lineHeight: 23, color: colors.ink, fontSize: 15 }}>{job.description}</Text></Section>
          {job.responsibilities?.length > 0 && (
            <Section title="What you will do">
              {job.responsibilities.map((r, i) => <Bullet key={i} text={r} />)}
            </Section>
          )}
          {job.qualifications?.length > 0 && (
            <Section title="What you need">
              {job.qualifications.map((r, i) => <Bullet key={i} text={r} />)}
            </Section>
          )}

          <Pressable style={{ marginTop: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => Alert.alert('Report sent', 'Thank you. Our admin team will review this job post.')}>
            <Ionicons name="flag-outline" size={16} color={colors.danger} />
            <Text style={{ color: colors.danger, marginLeft: 6, fontWeight: '600' }}>Report this job</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Action bar stays in reach while you read */}
      <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: 16, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 12) }}>
        <Button title={saved ? 'Saved' : 'Save'} icon={saved ? 'bookmark' : 'bookmark-outline'} variant={saved ? 'soft' : 'outline'} style={{ flex: 1, marginRight: 10 }} onPress={() => toggleSaved(job.id)} />
        <Button title={applied ? 'Already applied' : 'Apply now'} variant={applied ? 'soft' : 'primary'} style={{ flex: 2 }} disabled={applied} onPress={onApply} />
      </View>
    </View>
  );
}

function Fact({ icon, label, value, tint = [colors.mint, colors.green] }) {
  return (
    <View style={{ width: '50%', padding: 4 }}>
      <View style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 12 }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: tint[0], alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
          <Ionicons name={icon} size={18} color={tint[1]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11.5, color: colors.muted }} numberOfLines={1}>{label}</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink, marginTop: 1 }} numberOfLines={2}>{value}</Text>
        </View>
      </View>
    </View>
  );
}

function Bullet({ text }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
      <Ionicons name="checkmark-circle" size={18} color={colors.leaf} style={{ marginTop: 2, marginRight: 10 }} />
      <Text style={{ flex: 1, lineHeight: 22, color: colors.ink, fontSize: 15 }}>{text}</Text>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={[styles.card, { marginTop: 14 }]}>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}
