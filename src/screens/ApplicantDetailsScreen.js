import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Avatar, Button, CategoryBadge, Chip, Empty, Field, ProgressTrail, SectionTitle, StatusPill, styles } from '../components/ui';
import { initials, shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

const REPORT_REASONS = ['Fake identity', 'Asking for money', 'Harassment', 'Spam'];

// What the employer sees about one applicant, and what they can do about it.
export default function ApplicantDetailsScreen({ navigation, route }) {
  const { applicationId } = route.params;
  const { applications, findJob, setApplicationStatus, updateApplication, hasReported, addReport } = useApp();
  const app = applications.find((a) => a.id === applicationId);
  const job = app ? findJob(app.jobId) : null;
  const [note, setNote] = useState(app?.employerNote || '');
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState(null);
  const [reportNote, setReportNote] = useState('');

  // Opening a new application marks it Reviewed, so the applicant can see it was read
  useEffect(() => { if (app?.status === 'pending') setApplicationStatus(app.id, 'reviewed'); }, [app?.id]);

  if (!app) return <Empty icon="alert-circle-outline" title="Not found" text="This application no longer exists." />;
  const withdrawn = app.status === 'withdrawn';

  const decide = (status, title, text) =>
    Alert.alert(title, text, [{ text: 'Cancel', style: 'cancel' }, { text: 'Confirm', onPress: () => setApplicationStatus(app.id, status) }]);

  const contact = (scheme) => Linking.openURL(`${scheme}:${app.phone}`).catch(() => Alert.alert('Cannot open', `Call or text ${app.phone} from your phone.`));

  const sendReport = () => {
    if (!reason) { Alert.alert('Choose a reason', 'Pick why you are reporting this applicant.'); return; }
    addReport({ applicationId: app.id, reason, note: reportNote.trim() });
    setReporting(false); setReason(null); setReportNote('');
    Alert.alert('Report sent', 'Thank you. The report is saved for the admin to review.');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* who + where they are in the process */}
        <View style={[styles.card, { alignItems: 'center', paddingVertical: 20 }]}>
          <Avatar text={initials(app.name)} size={68} />
          <Text style={{ fontSize: 21, fontWeight: '800', color: colors.forest, marginTop: 10 }}>{app.name}</Text>
          <Text style={{ color: colors.muted, marginTop: 2 }}>{app.phone}</Text>
          <View style={{ marginTop: 10 }}><StatusPill status={app.status} /></View>
          <View style={{ height: 1, backgroundColor: colors.line, alignSelf: 'stretch', marginVertical: 16 }} />
          <View style={{ alignSelf: 'stretch' }}><ProgressTrail status={app.status} /></View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Button title="Call" icon="call-outline" variant="soft" style={{ flex: 1, marginRight: 8 }} onPress={() => contact('tel')} />
          <Button title="Text" icon="chatbubble-ellipses-outline" variant="soft" style={{ flex: 1 }} onPress={() => contact('sms')} />
        </View>

        <SectionTitle title="Applied for" style={{ marginTop: 22 }} />
        <View style={[styles.card, { flexDirection: 'row', alignItems: 'center' }]}>
          {job ? <CategoryBadge categoryId={job.categoryId} size={44} /> : <Ionicons name="close-circle-outline" size={36} color={colors.muted} />}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontWeight: '800', color: colors.forest, fontSize: 16 }}>{job?.title || 'Job post removed'}</Text>
            <Text style={{ color: colors.muted, fontSize: 13 }}>Sent {shortDate(app.appliedAt)}</Text>
          </View>
        </View>

        <SectionTitle title="Message from applicant" style={{ marginTop: 22 }} />
        <View style={styles.card}><Text style={{ color: colors.ink, lineHeight: 22 }}>{app.message || 'No message.'}</Text></View>

        {/* decision buttons depend on where the application is */}
        <SectionTitle title="Decision" style={{ marginTop: 22 }} />
        {withdrawn && <Text style={{ color: colors.muted }}>The applicant withdrew this application. There is nothing to decide.</Text>}
        {!withdrawn && (app.status === 'pending' || app.status === 'reviewed') && (
          <>
            <Button title="Shortlist applicant" icon="star-outline" onPress={() => decide('shortlisted', 'Shortlist this applicant?', 'They will see they are on the shortlist.')} />
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Button title="Accept" icon="checkmark" variant="soft" style={{ flex: 1, marginRight: 8 }} onPress={() => decide('accepted', 'Accept this applicant?', 'They will be told they were accepted. Contact them to arrange the start.')} />
              <Button title="Reject" icon="close" variant="dangerSoft" style={{ flex: 1 }} onPress={() => decide('rejected', 'Reject this applicant?', 'They will see the application was not chosen.')} />
            </View>
          </>
        )}
        {app.status === 'shortlisted' && (
          <View style={{ flexDirection: 'row' }}>
            <Button title="Accept" icon="checkmark" style={{ flex: 1, marginRight: 8 }} onPress={() => decide('accepted', 'Accept this applicant?', 'They will be told they were accepted. Contact them to arrange the start.')} />
            <Button title="Reject" icon="close" variant="dangerSoft" style={{ flex: 1 }} onPress={() => decide('rejected', 'Reject this applicant?', 'They will see the application was not chosen.')} />
          </View>
        )}
        {(app.status === 'accepted' || app.status === 'rejected') && (
          <Button title="Change decision" icon="refresh-outline" variant="outline" onPress={() => decide('reviewed', 'Change your decision?', 'The application goes back to Reviewed.')} />
        )}

        {/* private to the employer */}
        <SectionTitle title="Private notes" style={{ marginTop: 22 }} />
        <Field value={note} onChangeText={setNote} placeholder="Interview notes, availability... only you can see this" multiline numberOfLines={3} style={[styles.input, { height: 90, textAlignVertical: 'top' }]} />
        <Button title="Save note" variant="outline" style={{ paddingVertical: 11 }} onPress={() => { updateApplication(app.id, { employerNote: note.trim() }); Alert.alert('Note saved'); }} />

        {/* report */}
        <SectionTitle title="Something wrong?" style={{ marginTop: 26 }} />
        {hasReported(app.id) ? (
          <View style={{ flexDirection: 'row', backgroundColor: colors.mint, padding: 12, borderRadius: 12 }}>
            <Ionicons name="flag" size={18} color={colors.green} style={{ marginRight: 10, marginTop: 1 }} />
            <Text style={{ flex: 1, color: colors.forest, lineHeight: 20 }}>You reported this applicant. The admin will review it.</Text>
          </View>
        ) : !reporting ? (
          <Button title="Report this applicant" icon="flag-outline" variant="dangerSoft" onPress={() => setReporting(true)} />
        ) : (
          <View style={styles.card}>
            <Text style={styles.label}>Reason</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
              {REPORT_REASONS.map((r) => <View key={r} style={{ marginBottom: 8 }}><Chip text={r} active={reason === r} onPress={() => setReason(r)} /></View>)}
            </View>
            <Field label="Details (optional)" value={reportNote} onChangeText={setReportNote} multiline numberOfLines={3} style={[styles.input, { height: 80, textAlignVertical: 'top' }]} />
            <View style={{ flexDirection: 'row' }}>
              <Button title="Cancel" variant="outline" style={{ flex: 1, marginRight: 8 }} onPress={() => { setReporting(false); setReason(null); }} />
              <Button title="Send report" variant="danger" style={{ flex: 1 }} onPress={sendReport} />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
