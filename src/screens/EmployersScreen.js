import React from 'react';
import { View, FlatList, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { employers, jobs } from '../data/mockData';
import { Avatar, Pill, styles } from '../components/ui';
import { initials } from '../utils/format';

export default function EmployersScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <FlatList
        data={employers}
        keyExtractor={(e) => String(e.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={{ color: colors.muted, marginBottom: 14, lineHeight: 20 }}>Employers with a Verified badge. Tap one to see who they are and which jobs are open.</Text>}
        renderItem={({ item }) => {
          const open = jobs.filter((j) => j.employerId === item.id).length;
          return (
            <Pressable
              style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: 14, marginBottom: 12 }, pressed && { backgroundColor: '#FBFCFB' }]}
              onPress={() => navigation.navigate('EmployerDetails', { employerId: item.id })}>
              <Avatar text={initials(item.name)} size={52} bg={colors.blueSoft} fg={colors.blue} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={{ fontWeight: '800', fontSize: 17, color: colors.forest, letterSpacing: -0.2 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <Ionicons name="checkmark-circle" size={15} color={colors.blue} />
                  <Text style={{ color: colors.blue, fontWeight: '600', marginLeft: 4, fontSize: 13 }}>{item.verified}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Pill icon="location" tone="blue" text={item.barangay} />
                  <Pill text={`${open} open ${open === 1 ? 'job' : 'jobs'}`} />
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B6BCC6" />
            </Pressable>
          );
        }}
      />
    </View>
  );
}
