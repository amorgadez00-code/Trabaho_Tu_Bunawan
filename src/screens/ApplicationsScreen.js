import React, { useState } from 'react';
import { View, FlatList, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Empty, Button, CategoryBadge, ProgressTrail, ScreenHeader, Sheet, StatusPill } from '../components/ui';
import { shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

// "Active" = still moving along the road. "Closed" = rejected or withdrawn.
const CLOSED = ['rejected', 'withdrawn'];

export default function ApplicationsScreen({ navigation }) {
  const { applications, findJob, findEmployer } = useApp();
  const [tab, setTab] = useState('active');

  const active = applications.filter((a) => !CLOSED.includes(a.status));
  const closed = applications.filter((a) => CLOSED.includes(a.status));
  const shown = tab === 'active' ? active : closed;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Applications"
        subtitle={applications.length === 0 ? 'Follow every application here.' : `${active.length} in progress`}
      />
      <Sheet>
        {/* Segmented control */}
        <View style={{ flexDirection: 'row', backgroundColor: '#E9EEEB', borderRadius: 999, padding: 4, margin: 16, marginBottom: 4 }}>
          <Segment label={`Active (${active.length})`} on={tab === 'active'} onPress={() => setTab('active')} />
          <Segment label={`Closed (${closed.length})`} on={tab === 'closed'} onPress={() => setTab('closed')} />
        </View>

        <FlatList
          data={shown}
          keyExtractor={(a) => String(a.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            tab === 'active' ? (
              <Empty icon="paper-plane-outline" title="No active applications" text="When you apply for a job, you can follow it here from Sent to Accepted.">
                <Button title="Find jobs" icon="search" style={{ paddingHorizontal: 28 }} onPress={() => navigation.navigate('Jobs')} />
              </Empty>
            ) : (
              <Empty icon="archive-outline" title="Nothing closed" text="Rejected and withdrawn applications will be kept here." />
            )
          }
          renderItem={({ item }) => {
            const job = findJob(item.jobId);   // can be missing if the employer deleted the post
            return (
              <Pressable
                style={({ pressed }) => [{ backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 12 }, pressed && { backgroundColor: '#FBFCFB' }]}
                onPress={() => navigation.navigate('ApplicationDetails', { applicationId: item.id })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {job ? <CategoryBadge categoryId={job.categoryId} size={44} /> : (
                    <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: '#EEEEEE', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="close-outline" size={22} color={colors.muted} />
                    </View>
                  )}
                  <View style={{ flex: 1, marginHorizontal: 12 }}>
                    <Text style={{ fontWeight: '800', fontSize: 16, color: colors.forest, letterSpacing: -0.2 }} numberOfLines={2}>{job ? job.title : 'Job post removed'}</Text>
                    <Text style={{ color: colors.muted, marginTop: 2, fontSize: 13 }} numberOfLines={1}>
                      {job ? findEmployer(job.employerId)?.name : 'No longer available'}
                    </Text>
                  </View>
                  <StatusPill status={item.status} />
                </View>
                <View style={{ height: 1, backgroundColor: colors.line, marginVertical: 12 }} />
                <ProgressTrail status={item.status} compact />
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>Applied {shortDate(item.appliedAt)}</Text>
              </Pressable>
            );
          }}
        />
      </Sheet>
    </View>
  );
}

function Segment({ label, on, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, paddingVertical: 9, borderRadius: 999, alignItems: 'center', backgroundColor: on ? '#fff' : 'transparent' }}>
      <Text style={{ fontWeight: '700', fontSize: 13.5, color: on ? colors.forest : colors.muted }}>{label}</Text>
    </Pressable>
  );
}
