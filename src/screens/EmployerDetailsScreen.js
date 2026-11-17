import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useApp } from '../context/AppContext';
import { Avatar, Empty, ListGroup, ListRow, Pill, SectionTitle, styles } from '../components/ui';
import { initials } from '../utils/format';
import JobCard from '../components/JobCard';

export default function EmployerDetailsScreen({ navigation, route }) {
  const { employerId } = route.params;
  const { findEmployer, allJobs } = useApp();
  const emp = findEmployer(employerId);
  useEffect(() => { if (emp) navigation.setOptions({ title: emp.name }); }, [employerId]);
  if (!emp) return <Empty icon="alert-circle-outline" title="Not found" text="Employer not found." />;
  const theirJobs = allJobs.filter((j) => j.employerId === emp.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.card, { alignItems: 'center', paddingVertical: 22 }]}>
        <Avatar text={initials(emp.name)} size={68} bg={colors.blueSoft} fg={colors.blue} />
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.forest, marginTop: 12, letterSpacing: -0.4, textAlign: 'center' }}>{emp.name}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Pill tone="blue" icon="checkmark-circle" text={emp.verified} />
          {!!emp.type && <Pill text={emp.type} />}
        </View>
        {!!emp.about && <Text style={{ marginTop: 14, lineHeight: 22, textAlign: 'center', color: colors.ink }}>{emp.about}</Text>}
      </View>

      <SectionTitle title="Where to find them" style={{ marginTop: 22 }} />
      <ListGroup>
        <ListRow icon="location-outline" tint={[colors.blueSoft, colors.blue]} title={`${emp.address}, ${emp.barangay}`} subtitle="Address" chevron={false} />
        {!!emp.landmark && <ListRow icon="flag-outline" tint={[colors.goldSoft, '#8A6200']} title={emp.landmark} subtitle="Landmark" chevron={false} />}
        {!!emp.contact && <ListRow icon="person-outline" tint={[colors.mint, colors.green]} title={emp.contact} subtitle={emp.position} chevron={false} />}
      </ListGroup>

      <SectionTitle title="Open positions" style={{ marginTop: 22 }} />
      {theirJobs.length === 0 && <Text style={{ color: colors.muted }}>No open positions right now.</Text>}
      {theirJobs.map((j) => (
        <JobCard key={j.id} job={j} onPress={() => navigation.push('JobDetails', { jobId: j.id })} />
      ))}
    </ScrollView>
  );
}
