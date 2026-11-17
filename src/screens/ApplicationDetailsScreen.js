import React, { useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Button, CategoryBadge, Field, ProgressTrail, SectionTitle, StatusPill, Empty, styles } from '../components/ui';
import { shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

// What each status means, in plain words
const STATUS_TEXT = {
  pending: 'Your application was sent. The employer has not looked at it yet.',
  reviewed: 'The employer has read your application.',
  shortlisted: 'Good news. You are on the shortlist. Keep your phone nearby.',
  accepted: 'Congratulations! The employer accepted your application.',
  rejected: 'The employer chose another applicant this time. Keep applying.',
  withdrawn: 'You withdrew this application.',
};

export default function ApplicationDetailsScreen({ navigation, route }) {
  const { applicationId } = route.params;   // PARAM: id only, data looked up from saved state
  const { applications, withdrawApplication, updateApplication, deleteApplication, findJob, findEmployer } = useApp();
  const app = applications.find((a) => a.id === applicationId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(app?.message || '');
  if (!app) return <Empty icon="alert-circle-outline" title="Not found" text="Application not found." />;
  const job = findJob(app.jobId);
  const canEdit = app.status === 'pending';

  const withdraw = () =>
    Alert.alert('Withdraw application?', 'You cannot undo this.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Withdraw', style: 'destructive', onPress: () => withdrawApplication(app.id) },
    ]);

  // DELETE: remove the record from the device
  const remove = () =>
    Alert.alert('Delete this record?', 'It will be removed from your device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteApplication(app.id); navigation.goBack(); } },
    ]);

  // UPDATE: change the message and save
  const saveMessage = () => {
    updateApplication(app.id, { message: draft.trim() });
    setEditing(false);
  };

  if (!job) {
    return (
      <View style={[styles.screen, { padding: 16 }]}>
        <Empty icon="close-circle-outline" title="Job post removed" text="The employer removed this job post.">
          <Button title="Delete record" icon="trash-outline" variant="dangerSoft" style={{ paddingHorizontal: 28 }} onPress={remove} />
        </Empty>
      </View>
    );
  }
  const emp = findEmployer(job.employerId);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      {/* Where this application stands */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <CategoryBadge categoryId={job.categoryId} size={48} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 19, fontWeight: '800', color: colors.forest, letterSpacing: -0.3 }}>{job.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>{emp?.name}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 16 }} />
        <ProgressTrail status={app.status} />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 }}>
          <StatusPill status={app.status} />
          <Text style={{ flex: 1, marginLeft: 10, color: colors.ink, lineHeight: 20 }}>{STATUS_TEXT[app.status]}</Text>
        </View>
      </View>

      <SectionTitle title="Your application" style={{ marginTop: 22 }} />
      <View style={styles.card}>
        <Row icon="person-outline" k="Applicant" v={app.name} />
        <Row icon="call-outline" k="Mobile" v={app.phone} />
        <Row icon="calendar-outline" k="Applied on" v={shortDate(app.appliedAt)} />
        {editing ? (
          <View>
            <Field label="Message" value={draft} onChangeText={setDraft} multiline numberOfLines={4} style={[styles.input, { height: 100, textAlignVertical: 'top' }]} />
            <View style={{ flexDirection: 'row' }}>
              <Button title="Cancel" variant="outline" style={{ flex: 1, marginRight: 8 }} onPress={() => { setDraft(app.message || ''); setEditing(false); }} />
              <Button title="Save" style={{ flex: 1 }} onPress={saveMessage} />
            </View>
          </View>
        ) : (
          <Row icon="chatbubble-ellipses-outline" k="Message" v={app.message || 'No message'} last />
        )}
      </View>

      {canEdit && !editing && <Button title="Edit message" icon="create-outline" variant="soft" style={{ marginTop: 14 }} onPress={() => { setDraft(app.message || ''); setEditing(true); }} />}
      <Button title="View job posting" icon="briefcase-outline" variant="outline" style={{ marginTop: 10 }} onPress={() => navigation.navigate('JobDetails', { jobId: job.id })} />

      <SectionTitle title="Manage" style={{ marginTop: 26 }} />
      <View style={{ flexDirection: 'row' }}>
        {app.status !== 'withdrawn' && <Button title="Withdraw" variant="dangerSoft" style={{ flex: 1, marginRight: 8 }} onPress={withdraw} />}
        <Button title="Delete record" variant="dangerSoft" style={{ flex: 1 }} onPress={remove} />
      </View>
    </ScrollView>
  );
}

const Row = ({ icon, k, v, last }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: last ? 0 : 14 }}>
    <Ionicons name={icon} size={18} color={colors.green} style={{ marginTop: 2, marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 12, color: colors.muted }}>{k}</Text>
      <Text style={{ fontSize: 15, color: colors.ink, marginTop: 1, lineHeight: 21 }}>{v}</Text>
    </View>
  </View>
);
