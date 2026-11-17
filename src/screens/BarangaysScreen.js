import React, { useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Button, styles } from '../components/ui';
import useBarangays, { sameBarangay } from '../hooks/useBarangays';
import { useApp } from '../context/AppContext';

const jobsText = (n) => (n === 0 ? 'No jobs yet' : n === 1 ? '1 job' : `${n} jobs`);

// Shows the barangays of Bunawan from the PSGC API (loading, error + retry, refresh, saved copy),
// with how many jobs each one has. Tapping a barangay opens the Jobs list filtered to it.
export default function BarangaysScreen({ navigation }) {
  const { barangays, source, loading, error, reload } = useBarangays();
  const { allJobs } = useApp();
  const sourceText = source === 'online' ? 'Loaded from the PSGC API' : source === 'saved' ? 'Showing saved data' : 'Showing built-in list';

  // Same matching as the Jobs filter, so the number here is the number of jobs you will see after tapping.
  const counts = useMemo(() => {
    const map = {};
    barangays.forEach((b) => { map[b] = allJobs.filter((j) => sameBarangay(j.barangay, b)).length; });
    return map;
  }, [barangays, allJobs]);

  const openJobs = (b) => navigation.navigate('Main', { screen: 'Jobs', params: { barangay: b, ts: Date.now() } });

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 4 }}>
        <Text style={styles.h2}>{barangays.length} barangays in Bunawan</Text>
        <Text style={{ color: colors.muted, fontSize: 12.5 }}>{sourceText}. Tap a barangay to see its jobs. Pull down to refresh.</Text>
        {!!error && (
          <View style={{ backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, marginTop: 10 }}>
            <Text style={{ color: '#92400E', fontSize: 13 }}>Could not update: {error}</Text>
            <Button title="Retry" variant="outline" style={{ marginTop: 8, paddingVertical: 8 }} onPress={reload} />
          </View>
        )}
      </View>
      {loading && barangays.length === 0 ? (
        <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={barangays}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(b) => b}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshing={loading}
          onRefresh={reload}
          renderItem={({ item }) => {
            const n = counts[item] || 0;
            return (
              <Pressable
                onPress={() => openJobs(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item}, ${jobsText(n)}. Show jobs`}
                style={({ pressed }) => ({ width: '48.5%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 12, marginBottom: 10, opacity: pressed ? 0.85 : 1 })}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Ionicons name="location" size={17} color={colors.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.forest, fontSize: 14 }} numberOfLines={2}>{item}</Text>
                  <Text style={{ fontSize: 12.5, fontWeight: n ? '700' : '400', color: n ? colors.green : colors.muted, marginTop: 2 }}>{jobsText(n)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#B6BCC6" />
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}import React, { useMemo } from 'react';
import { View, Text, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { Button, styles } from '../components/ui';
import useBarangays, { sameBarangay } from '../hooks/useBarangays';
import { useApp } from '../context/AppContext';

const jobsText = (n) => (n === 0 ? 'No jobs yet' : n === 1 ? '1 job' : `${n} jobs`);

// Shows the barangays of Bunawan from the PSGC API (loading, error + retry, refresh, saved copy),
// with how many jobs each one has. Tapping a barangay opens the Jobs list filtered to it.
export default function BarangaysScreen({ navigation }) {
  const { barangays, source, loading, error, reload } = useBarangays();
  const { allJobs } = useApp();
  const sourceText = source === 'online' ? 'Loaded from the PSGC API' : source === 'saved' ? 'Showing saved data' : 'Showing built-in list';

  // Same matching as the Jobs filter, so the number here is the number of jobs you will see after tapping.
  const counts = useMemo(() => {
    const map = {};
    barangays.forEach((b) => { map[b] = allJobs.filter((j) => sameBarangay(j.barangay, b)).length; });
    return map;
  }, [barangays, allJobs]);

  const openJobs = (b) => navigation.navigate('Main', { screen: 'Jobs', params: { barangay: b, ts: Date.now() } });

  return (
    <View style={styles.screen}>
      <View style={{ padding: 16, paddingBottom: 4 }}>
        <Text style={styles.h2}>{barangays.length} barangays in Bunawan</Text>
        <Text style={{ color: colors.muted, fontSize: 12.5 }}>{sourceText}. Tap a barangay to see its jobs. Pull down to refresh.</Text>
        {!!error && (
          <View style={{ backgroundColor: '#FEF3C7', padding: 12, borderRadius: 12, marginTop: 10 }}>
            <Text style={{ color: '#92400E', fontSize: 13 }}>Could not update: {error}</Text>
            <Button title="Retry" variant="outline" style={{ marginTop: 8, paddingVertical: 8 }} onPress={reload} />
          </View>
        )}
      </View>
      {loading && barangays.length === 0 ? (
        <ActivityIndicator size="large" color={colors.green} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={barangays}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(b) => b}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          refreshing={loading}
          onRefresh={reload}
          renderItem={({ item }) => {
            const n = counts[item] || 0;
            return (
              <Pressable
                onPress={() => openJobs(item)}
                accessibilityRole="button"
                accessibilityLabel={`${item}, ${jobsText(n)}. Show jobs`}
                style={({ pressed }) => ({ width: '48.5%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, padding: 12, marginBottom: 10, opacity: pressed ? 0.85 : 1 })}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.blueSoft, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Ionicons name="location" size={17} color={colors.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '700', color: colors.forest, fontSize: 14 }} numberOfLines={2}>{item}</Text>
                  <Text style={{ fontSize: 12.5, fontWeight: n ? '700' : '400', color: n ? colors.green : colors.muted, marginTop: 2 }}>{jobsText(n)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#B6BCC6" />
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}
