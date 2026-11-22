import React from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, tintFor } from '../theme';
import { categories } from '../data/mockData';
import { Avatar, ListGroup, ListRow, ScreenHeader, SectionTitle, Sheet, styles } from '../components/ui';
import JobCard from '../components/JobCard';
import { initials, greeting } from '../utils/format';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { user, myApplications: applications, savedIds, allJobs } = useApp();
  const jobs = allJobs;
  const featured = jobs.filter((j) => j.featured);
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <View style={styles.screen}>
      <ScreenHeader
        tall
        title={`${greeting()}, ${firstName}`}
        subtitle="Your next opportunity starts in Bunawan."
        right={
          <Pressable onPress={() => navigation.navigate('Profile')} hitSlop={8}>
            <Avatar text={initials(user?.name)} size={44} bg={colors.gold} fg={colors.forest} />
          </Pressable>
        }>
        {/* Search shortcut: opens the Jobs tab */}
        <Pressable style={s.search} onPress={() => navigation.navigate('Jobs')}>
          <Ionicons name="search" size={20} color={colors.green} />
          <Text style={s.searchText}>Search jobs, like cashier or helper</Text>
        </Pressable>
      </ScreenHeader>

      <Sheet>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {/* Your job hunt at a glance: one card, three numbers */}
          <View style={s.glance}>
            <Stat icon="briefcase-outline" n={jobs.length} label="Open jobs" onPress={() => navigation.navigate('Jobs')} />
            <View style={s.divider} />
            <Stat icon="bookmark-outline" n={savedIds.length} label="Saved" onPress={() => navigation.navigate('Saved')} />
            <View style={s.divider} />
            <Stat icon="paper-plane-outline" n={applications.length} label="Applied" onPress={() => navigation.navigate('Applications')} />
          </View>

          <SectionTitle title="Browse by category" style={{ marginTop: 24 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -16 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {categories.map((c) => {
              const [bg, fg] = tintFor(c.id);
              return (
                // Params: send the category id to the Jobs tab
                <Pressable key={c.id} style={[s.cat, { backgroundColor: bg }]} onPress={() => navigation.navigate('Jobs', { categoryId: c.id })}>
                  <View style={s.catIcon}>
                    <Ionicons name={c.icon} size={22} color={fg} />
                  </View>
                  <Text style={[s.catText, { color: fg }]} numberOfLines={2}>{c.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {featured.length > 0 && (
            <>
              <SectionTitle title="Featured jobs" action="See all jobs" onAction={() => navigation.navigate('Jobs')} style={{ marginTop: 24 }} />
              {featured.map((j, i) => (
                <JobCard key={j.id} job={j} spotlight={i === 0} onPress={() => navigation.navigate('JobDetails', { jobId: j.id })} />
              ))}
            </>
          )}

          <SectionTitle title="Around Bunawan" style={{ marginTop: 16 }} />
          <ListGroup>
            <ListRow icon="storefront-outline" tint={[colors.blueSoft, colors.blue]} title="Verified employers" subtitle="Local businesses and households with a Verified badge" onPress={() => navigation.navigate('Employers')} />
            <ListRow icon="shield-checkmark-outline" tint={[colors.goldSoft, '#8A6200']} title="Safety tips" subtitle="How to spot a fake job offer" onPress={() => navigation.navigate('Safety')} />
            <ListRow icon="location-outline" tint={[colors.mint, colors.green]} title="Barangays of Bunawan" subtitle="Where the jobs are" onPress={() => navigation.navigate('Barangays')} />
          </ListGroup>
        </ScrollView>
      </Sheet>
    </View>
  );
}

function Stat({ icon, n, label, onPress }) {
  return (
    <Pressable style={s.stat} onPress={onPress}>
      <Ionicons name={icon} size={18} color={colors.muted} />
      <Text style={s.statN}>{n}</Text>
      <Text style={s.statL}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 14, marginTop: 18, ...shadow },
  searchText: { color: colors.muted, fontSize: 15, marginLeft: 10, flex: 1 },
  glance: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingVertical: 14 },
  divider: { width: 1, backgroundColor: colors.line, marginVertical: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statN: { fontSize: 24, fontWeight: '800', color: colors.forest, marginTop: 2, letterSpacing: -0.5 },
  statL: { fontSize: 12, color: colors.muted },
  cat: { width: 112, borderRadius: radius.lg, padding: 12, marginRight: 10 },
  catIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.75)', alignItems: 'center', justifyContent: 'center' },
  catText: { fontSize: 13, fontWeight: '700', marginTop: 12, minHeight: 34 },
});
