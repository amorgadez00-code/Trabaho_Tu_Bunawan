import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Avatar, Chip, Empty, ScreenHeader, Sheet, StatusPill } from '../components/ui';
import { initials, shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

const FILTERS = [['all', 'All'], ['pending', 'New'], ['reviewed', 'Reviewed'], ['shortlisted', 'Shortlisted'], ['accepted', 'Accepted'], ['rejected', 'Rejected']];

// Employer "Applicants" tab: everyone who applied to my jobs, filtered by status or by one job.
export default function ApplicantsScreen({ navigation, route }) {
  const { employerApplications, findJob } = useApp();
  const [status, setStatus] = useState('all');
  const [jobId, setJobId] = useState(null);

  // Dashboard / My Jobs open this tab with a status or a job (params carry a time stamp so repeats still apply)
  useEffect(() => {
    setStatus(route.params?.status || 'all');
    setJobId(route.params?.jobId ?? null);
  }, [route.params?.status, route.params?.jobId, route.params?.stamp]);

  const pool = jobId == null ? employerApplications : employerApplications.filter((a) => a.jobId === jobId);
  const countOf = (s) => (s === 'all' ? pool.length : pool.filter((a) => a.status === s).length);
  const shown = status === 'all' ? pool : pool.filter((a) => a.status === status);
  const job = jobId == null ? null : findJob(jobId);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Applicants" subtitle={`${countOf('pending')} new · ${employerApplications.length} total`} />
      <Sheet>
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 6 }}>
            {FILTERS.map(([key, label]) => (
              <Chip key={key} text={`${label} (${countOf(key)})`} active={status === key} onPress={() => setStatus(key)} />
            ))}
          </ScrollView>
        </View>

        {!!job && (
          <Pressable onPress={() => { setJobId(null); navigation.setParams({ jobId: undefined }); }} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.blueSoft, marginHorizontal: 16, marginTop: 6, padding: 10, borderRadius: 12 }}>
            <Ionicons name="funnel-outline" size={16} color={colors.blue} />
            <Text style={{ flex: 1, marginLeft: 8, color: colors.blue, fontWeight: '700' }} numberOfLines={1}>Only: {job.title}</Text>
            <Ionicons name="close-circle" size={18} color={colors.blue} />
          </Pressable>
        )}

        <FlatList
          data={shown}
          keyExtractor={(a) => String(a.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Empty icon="people-outline" title="No applicants here" text={employerApplications.length === 0 ? 'When someone applies to your jobs, they show up here.' : 'Try another filter.'} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => navigation.navigate('ApplicantDetails', { applicationId: item.id })}
              style={({ pressed }) => [{ backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 12 }, pressed && { backgroundColor: '#FBFCFB' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Avatar text={initials(item.name)} size={46} />
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={{ fontWeight: '800', fontSize: 16, color: colors.forest }} numberOfLines={1}>{item.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 13, marginTop: 2 }} numberOfLines={1}>Applied for {findJob(item.jobId)?.title || 'a removed job'}</Text>
                </View>
                <StatusPill status={item.status} />
              </View>
              {!!item.message && <Text style={{ color: colors.ink, marginTop: 10, lineHeight: 20 }} numberOfLines={2}>“{item.message}”</Text>}
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>{shortDate(item.appliedAt)}</Text>
            </Pressable>
          )}
        />
      </Sheet>
    </View>
  );
}
