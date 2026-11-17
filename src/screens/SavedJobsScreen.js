import React from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { colors } from '../theme';
import { Empty, Button, ScreenHeader, Sheet, styles } from '../components/ui';
import JobCard from '../components/JobCard';
import { useApp } from '../context/AppContext';

// READ saved jobs from storage. Tap the bookmark on a card to DELETE it from the saved list.
export default function SavedJobsScreen({ navigation }) {
  const { savedIds, allJobs, clearSaved } = useApp();
  const saved = allJobs.filter((j) => savedIds.includes(j.id));

  const confirmClear = () =>
    Alert.alert('Remove all saved jobs?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove all', style: 'destructive', onPress: clearSaved },
    ]);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Saved jobs"
        subtitle={saved.length === 0 ? 'Keep the jobs you like here.' : `${saved.length} ${saved.length === 1 ? 'job' : 'jobs'} to look at again`}
      />
      <Sheet>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {saved.length === 0 && (
            <Empty icon="bookmark-outline" title="Nothing saved yet" text="Tap the bookmark on any job to keep it here.">
              <Button title="Browse jobs" icon="search" style={{ paddingHorizontal: 28 }} onPress={() => navigation.navigate('Jobs')} />
            </Empty>
          )}
          {saved.map((j) => (
            <JobCard key={j.id} job={j} onPress={() => navigation.navigate('JobDetails', { jobId: j.id })} />
          ))}
          {saved.length > 0 && <Button title="Remove all saved jobs" icon="trash-outline" variant="dangerSoft" style={{ marginTop: 8 }} onPress={confirmClear} />}
          <Text style={{ color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 14 }}>Saved jobs stay on this device after you close the app.</Text>
        </ScrollView>
      </Sheet>
    </View>
  );
}
