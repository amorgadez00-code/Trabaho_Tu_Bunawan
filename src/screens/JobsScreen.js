import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { categories } from '../data/mockData';
import { Button, Chip, Empty, ScreenHeader, Sheet, styles } from '../components/ui';
import JobCard from '../components/JobCard';
import useBarangays, { sameBarangay } from '../hooks/useBarangays';
import { useApp } from '../context/AppContext';

export default function JobsScreen({ navigation, route }) {
  const { allJobs } = useApp();
  const { barangays } = useBarangays();            // barangay list from the PSGC API
  const [q, setQ] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [barangay, setBarangay] = useState(null);

  // Params from Home: when a category is tapped, apply it as the filter
  useEffect(() => {
    if (route.params?.categoryId) setCategoryId(route.params.categoryId);
  }, [route.params?.categoryId]);

  // Params from the Barangays screen: show only that barangay's jobs.
  // `ts` changes on every tap, so tapping the same barangay again still applies the filter.
  // Other filters are cleared so the list matches the count that was shown on the Barangays screen.
  useEffect(() => {
    if (route.params?.barangay) {
      setBarangay(route.params.barangay);
      setCategoryId(null);
      setQ('');
    }
  }, [route.params?.barangay, route.params?.ts]);

  const shown = allJobs.filter(
    (j) =>
      (!categoryId || j.categoryId === categoryId) &&
      (!barangay || sameBarangay(j.barangay, barangay)) &&
      j.title.toLowerCase().includes(q.toLowerCase())
  );
  const filtering = !!(q || categoryId || barangay);
  const clearFilters = () => { setQ(''); setCategoryId(null); setBarangay(null); };

  const filters = (
    <View style={{ marginBottom: 16 }}>
      <Text style={labelStyle}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <Chip text="All" active={!categoryId} onPress={() => setCategoryId(null)} />
        {categories.map((c) => (
          <Chip key={c.id} icon={c.icon} text={c.name} active={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
        ))}
      </ScrollView>
      <Text style={[labelStyle, { marginTop: 14 }]}>Barangay</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        <Chip text="All" active={!barangay} onPress={() => setBarangay(null)} />
        {barangays.map((b) => (
          <Chip key={b} icon="location-outline" text={b} active={barangay === b} onPress={() => setBarangay(b)} />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Find jobs" subtitle={`${shown.length} ${shown.length === 1 ? 'job' : 'jobs'} ${filtering ? 'match' : 'near you'}`}>
        <View style={searchBox}>
          <Ionicons name="search" size={20} color={colors.green} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search by job title" placeholderTextColor="#9CA3AF" style={{ flex: 1, marginLeft: 10, fontSize: 15, color: colors.ink, paddingVertical: 0 }} returnKeyType="search" />
          {!!q && (
            <Pressable onPress={() => setQ('')} hitSlop={10}>
              <Ionicons name="close-circle" size={20} color="#B6BCC6" />
            </Pressable>
          )}
        </View>
      </ScreenHeader>

      <Sheet>
        <FlatList
          data={shown}
          keyExtractor={(j) => String(j.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={filters}
          ListEmptyComponent={
            <Empty icon="search-outline" title="No jobs found" text="Try a different word, or remove a filter to see more openings.">
              {filtering && <Button title="Clear filters" variant="soft" style={{ paddingHorizontal: 28 }} onPress={clearFilters} />}
            </Empty>
          }
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => navigation.navigate('JobDetails', { jobId: item.id })} />
          )}
        />
      </Sheet>
    </View>
  );
}

const labelStyle = { color: colors.ink, fontWeight: '700', fontSize: 13, marginBottom: 8 };
const searchBox = { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 13, marginTop: 16 };
