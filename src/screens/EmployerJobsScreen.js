import React, { useState } from 'react';
import { View, FlatList, Pressable, Text, Alert } from 'react-native';
import { colors, radius } from '../theme';
import { Button, CategoryBadge, Empty, Pill, ScreenHeader, Sheet } from '../components/ui';
import { shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

const daysLeft = (iso) => Math.ceil((new Date(`${iso}T23:59:59`).getTime() - Date.now()) / 86400000);
const isClosed = (j) => !!j.closed || daysLeft(j.deadline) < 0;

// Employer "My Jobs" tab: every post with its applicant count, plus edit / close / duplicate / delete.
export default function EmployerJobsScreen({ navigation }) {
  const { myJobs, employerApplications, deletePost, toggleJobClosed, duplicatePost } = useApp();
  const [tab, setTab] = useState('open');
  const open = myJobs.filter((j) => !isClosed(j));
  const closed = myJobs.filter(isClosed);
  const shown = tab === 'open' ? open : closed;

  const confirmDelete = (job) =>
    Alert.alert('Delete this job post?', `${job.title}\n\nApplicants will see it as removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePost(job.id) },
    ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="My Jobs" subtitle={`${open.length} open · ${closed.length} closed`} />
      <Sheet>
        <View style={{ flexDirection: 'row', backgroundColor: '#E9EEEB', borderRadius: 999, padding: 4, margin: 16, marginBottom: 4 }}>
          <Segment label={`Open (${open.length})`} on={tab === 'open'} onPress={() => setTab('open')} />
          <Segment label={`Closed (${closed.length})`} on={tab === 'closed'} onPress={() => setTab('closed')} />
        </View>

        <FlatList
          data={shown}
          keyExtractor={(j) => String(j.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Button title="Post a new job" icon="add" style={{ marginBottom: 14 }} onPress={() => navigation.navigate('PostJob')} />}
          ListEmptyComponent={<Empty icon="briefcase-outline" title={tab === 'open' ? 'No open jobs' : 'Nothing closed'} text={tab === 'open' ? 'Post a job so people in Bunawan can apply.' : 'Jobs you close or that pass their deadline are kept here.'} />}
          renderItem={({ item }) => {
            const apps = employerApplications.filter((a) => a.jobId === item.id && a.status !== 'withdrawn');
            const fresh = apps.filter((a) => a.status === 'pending').length;
            return (
              <View style={{ backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 12 }}>
                <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
                  <CategoryBadge categoryId={item.categoryId} size={44} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: colors.forest }} numberOfLines={2}>{item.title}</Text>
                    <Text style={{ color: colors.muted, marginTop: 2, fontSize: 13 }}>{item.barangay} · {item.type} · {item.salary}</Text>
                  </View>
                </Pressable>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                  <Pill icon="people-outline" tone={fresh ? 'gold' : 'neutral'} text={`${apps.length} applicant${apps.length === 1 ? '' : 's'}${fresh ? ` · ${fresh} new` : ''}`} />
                  <Pill icon="calendar-outline" text={`${item.slots} slot(s) · ${isClosed(item) ? 'ended' : 'until'} ${shortDate(item.deadline)}`} />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <Button title="Applicants" icon="people-outline" variant="soft" style={{ flex: 1, marginRight: 8, paddingVertical: 10 }} onPress={() => navigation.navigate('Applicants', { jobId: item.id, stamp: Date.now() })} />
                  <Button title="Edit" icon="create-outline" variant="outline" style={{ flex: 1, paddingVertical: 10 }} onPress={() => navigation.navigate('PostJob', { postId: item.id })} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line }}>
                  {item.closed
                    ? <Link text="Reopen hiring" onPress={() => toggleJobClosed(item.id)} />
                    : <Link text={isClosed(item) ? 'Renew deadline' : 'Close hiring'} onPress={() => (isClosed(item) ? navigation.navigate('PostJob', { postId: item.id }) : toggleJobClosed(item.id))} />}
                  <Link text="Duplicate" onPress={() => duplicatePost(item.id)} />
                  <Link text="Delete" danger onPress={() => confirmDelete(item)} />
                </View>
              </View>
            );
          }}
        />
      </Sheet>
    </View>
  );
}

const Link = ({ text, onPress, danger }) => (
  <Pressable onPress={onPress} hitSlop={8}><Text style={{ fontWeight: '700', fontSize: 13, color: danger ? colors.danger : colors.green }}>{text}</Text></Pressable>
);

function Segment({ label, on, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: 'center', backgroundColor: on ? '#fff' : 'transparent' }}>
      <Text style={{ fontWeight: '700', fontSize: 13.5, color: on ? colors.forest : colors.muted }}>{label}</Text>
    </Pressable>
  );
}
