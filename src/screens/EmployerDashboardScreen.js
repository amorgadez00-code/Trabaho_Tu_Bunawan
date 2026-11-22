import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Avatar, Button, Pill, ScreenHeader, SectionTitle, Sheet, StatusPill, styles } from '../components/ui';
import { initials, greeting, shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

const daysLeft = (iso) => Math.ceil((new Date(`${iso}T23:59:59`).getTime() - Date.now()) / 86400000);

// Employer home: numbers at a glance, who needs a reply, and which posts are about to close.
export default function EmployerDashboardScreen({ navigation }) {
  const { user, myJobs, employerApplications, findJob } = useApp();
  const openJobs = myJobs.filter((j) => !j.closed && daysLeft(j.deadline) >= 0);
  const count = (s) => employerApplications.filter((a) => a.status === s).length;
  const waiting = employerApplications.filter((a) => a.status === 'pending');
  const closingSoon = openJobs.filter((j) => daysLeft(j.deadline) <= 7);
  const toApplicants = (status) => navigation.navigate('Applicants', { status, stamp: Date.now() });

  return (
    <View style={styles.screen}>
      <ScreenHeader
        tall
        title={`${greeting()}, ${user?.name?.split(' ')[0] || 'there'}`}
        subtitle="Hire local talent in Bunawan."
        right={<Pressable onPress={() => navigation.navigate('Profile')} hitSlop={8}><Avatar text={initials(user?.name)} size={44} bg={colors.gold} fg={colors.forest} /></Pressable>}>
        <Button title="Post a new job" icon="add-circle-outline" variant="gold" style={{ marginTop: 16, paddingVertical: 13 }} onPress={() => navigation.navigate('PostJob')} />
      </ScreenHeader>

      <Sheet>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -5 }}>
            <Stat icon="briefcase-outline" n={openJobs.length} label="Open jobs" tint={[colors.mint, colors.green]} onPress={() => navigation.navigate('MyJobs')} />
            <Stat icon="mail-unread-outline" n={waiting.length} label="New applicants" tint={['#FEF3C7', '#92400E']} onPress={() => toApplicants('pending')} />
            <Stat icon="star-outline" n={count('shortlisted')} label="Shortlisted" tint={['#E0E7FF', '#3730A3']} onPress={() => toApplicants('shortlisted')} />
            <Stat icon="checkmark-done-outline" n={count('accepted')} label="Accepted" tint={['#DCFCE7', '#166534']} onPress={() => toApplicants('accepted')} />
          </View>

          <SectionTitle title="Waiting for your reply" action={waiting.length > 3 ? 'See all' : undefined} onAction={() => toApplicants('pending')} style={{ marginTop: 24 }} />
          {waiting.length === 0 && (
            <View style={[styles.card, { alignItems: 'center', paddingVertical: 22 }]}>
              <Ionicons name="checkmark-circle-outline" size={30} color={colors.green} />
              <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center' }}>You are all caught up. New applicants will show here.</Text>
            </View>
          )}
          {waiting.slice(0, 3).map((a) => (
            <Pressable key={a.id} onPress={() => navigation.navigate('ApplicantDetails', { applicationId: a.id })}
              style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 12, marginBottom: 10 }, pressed && { backgroundColor: '#FBFCFB' }]}>
              <Avatar text={initials(a.name)} size={44} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={{ fontWeight: '800', color: colors.forest, fontSize: 15 }} numberOfLines={1}>{a.name}</Text>
                <Text style={{ color: colors.muted, fontSize: 13 }} numberOfLines={1}>{findJob(a.jobId)?.title || 'Job removed'} · {shortDate(a.appliedAt)}</Text>
              </View>
              <StatusPill status={a.status} />
            </Pressable>
          ))}

          {closingSoon.length > 0 && (
            <>
              <SectionTitle title="Closing soon" style={{ marginTop: 18 }} />
              {closingSoon.map((j) => (
                <Pressable key={j.id} onPress={() => navigation.navigate('PostJob', { postId: j.id })} style={[styles.card, { flexDirection: 'row', alignItems: 'center', marginBottom: 10 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '800', color: colors.forest, fontSize: 15 }}>{j.title}</Text>
                    <View style={{ flexDirection: 'row' }}><Pill tone="gold" icon="hourglass-outline" text={daysLeft(j.deadline) === 0 ? 'Closes today' : `${daysLeft(j.deadline)} day(s) left`} /></View>
                  </View>
                  <Text style={{ color: colors.green, fontWeight: '700' }}>Extend</Text>
                </Pressable>
              ))}
            </>
          )}

          <View style={{ flexDirection: 'row', backgroundColor: colors.goldSoft, borderRadius: 12, padding: 12, marginTop: 14 }}>
            <Ionicons name="shield-checkmark" size={20} color="#8A6200" style={{ marginRight: 10, marginTop: 1 }} />
            <Text style={{ flex: 1, color: colors.goldInk, lineHeight: 20 }}>Reply to applicants within a few days and never ask them to pay a fee.</Text>
          </View>
        </ScrollView>
      </Sheet>
    </View>
  );
}

function Stat({ icon, n, label, tint, onPress }) {
  return (
    <View style={{ width: '50%', padding: 5 }}>
      <Pressable onPress={onPress} style={({ pressed }) => [{ backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14 }, pressed && { backgroundColor: '#FBFCFB' }]}>
        <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: tint[0], alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={19} color={tint[1]} />
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.forest, marginTop: 10, letterSpacing: -0.5 }}>{n}</Text>
        <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600' }}>{label}</Text>
      </Pressable>
    </View>
  );
}
