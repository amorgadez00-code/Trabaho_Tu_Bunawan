import React from 'react';
import { View, FlatList, Pressable, Text, Alert } from 'react-native';
import { colors } from '../theme';
import { Button, Empty, styles } from '../components/ui';
import { useApp } from '../context/AppContext';

// READ the employer's job posts, with Edit (update) and Delete buttons.
export default function MyPostsScreen({ navigation }) {
  const { isEmployer, postedJobs, myEmployerId, deletePost } = useApp();

  if (!isEmployer) {
    return (
      <View style={[styles.screen, { padding: 16, justifyContent: 'center' }]}>
        <Empty text="Only employer accounts can post jobs. Register with the Employer role." />
      </View>
    );
  }

  const mine = postedJobs.filter((p) => p.employerId === myEmployerId);

  const confirmDelete = (post) =>
    Alert.alert('Delete this job post?', post.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deletePost(post.id) },
    ]);

  return (
    <View style={styles.screen}>
      <FlatList
        data={mine}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={<Button title="+ Post a Job" style={{ marginBottom: 14 }} onPress={() => navigation.navigate('PostJob')} />}
        ListEmptyComponent={<Empty text="You have not posted any jobs yet." />}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { marginBottom: 12 }]} onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}>
            <Text style={{ fontWeight: '800', fontSize: 17, color: colors.forest }}>{item.title}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>{item.barangay} • {item.type} • {item.salary}</Text>
            <Text style={{ color: colors.muted }}>{item.slots} slot(s) • Deadline {item.deadline}</Text>
            <View style={{ flexDirection: 'row', marginTop: 12 }}>
              <Button title="Edit" variant="outline" style={{ flex: 1, marginRight: 8, paddingVertical: 10 }} onPress={() => navigation.navigate('PostJob', { postId: item.id })} />
              <Button title="Delete" variant="danger" style={{ flex: 1, paddingVertical: 10 }} onPress={() => confirmDelete(item)} />
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
