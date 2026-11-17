import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme';
import { CategoryBadge, Pill } from './ui';
import { shortDate } from '../utils/format';
import { useApp } from '../context/AppContext';

// Reusable component. Props: job, onPress, spotlight (bigger forest-green version for the top featured job).
// Saved list lives in context (shared state).
export default function JobCard({ job, onPress, spotlight }) {
  const { savedIds, toggleSaved, findEmployer } = useApp();
  const saved = savedIds.includes(job.id);
  const emp = findEmployer(job.employerId);

  if (spotlight) {
    return (
      <Pressable style={({ pressed }) => [s.spot, pressed && { opacity: 0.94 }]} onPress={onPress}>
        <View style={s.spotTop}>
          <View style={s.spotTag}>
            <Ionicons name="star" size={12} color={colors.goldInk} />
            <Text style={s.spotTagText}>Featured</Text>
          </View>
          <Pressable hitSlop={12} onPress={() => toggleSaved(job.id)}>
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color={saved ? colors.gold : '#fff'} />
          </Pressable>
        </View>
        <Text style={s.spotTitle}>{job.title}</Text>
        <Text style={s.spotEmp}>{emp?.name}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          <Pill tone="glass" icon="location" text={job.barangay} />
          <Pill tone="glass" icon="time-outline" text={job.type} />
          {job.studentFriendly && <Pill tone="glass" icon="school-outline" text="Student-friendly" />}
        </View>
        <View style={s.spotBottom}>
          <Text style={s.spotSalary}>{job.salary}</Text>
          <Text style={s.spotDeadline}>Apply by {shortDate(job.deadline)}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable style={({ pressed }) => [s.card, pressed && { backgroundColor: '#FBFCFB' }]} onPress={onPress}>
      {job.featured && <View style={s.stripe} />}
      <View style={s.top}>
        <CategoryBadge categoryId={job.categoryId} />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={s.title} numberOfLines={2}>{job.title}</Text>
          <View style={s.empRow}>
            <Text style={s.emp} numberOfLines={1}>{emp?.name}</Text>
            {!!emp?.verified && <Ionicons name="checkmark-circle" size={14} color={colors.blue} style={{ marginLeft: 4 }} />}
          </View>
        </View>
        <Pressable hitSlop={12} onPress={() => toggleSaved(job.id)}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={24} color={saved ? colors.gold : '#A3AAB5'} />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
        {job.featured && <Pill tone="gold" icon="star" text="Featured" />}
        <Pill tone="blue" icon="location" text={job.barangay} />
        <Pill text={job.type} />
        {job.studentFriendly && <Pill tone="green" text="Student-friendly" />}
      </View>

      <View style={s.bottom}>
        <Text style={s.salary}>{job.salary}</Text>
        <Text style={s.deadline}>Apply by {shortDate(job.deadline)}</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  stripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: colors.gold },
  top: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontSize: 17, fontWeight: '800', color: colors.forest, letterSpacing: -0.2 },
  empRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  emp: { fontSize: 13.5, color: colors.muted, flexShrink: 1 },
  bottom: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.line },
  salary: { fontSize: 17, fontWeight: '800', color: colors.green },
  deadline: { fontSize: 12, color: colors.muted },

  spot: { backgroundColor: colors.forest, borderRadius: radius.xl, padding: 18, marginBottom: 12, ...shadow },
  spotTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  spotTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gold, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  spotTagText: { color: colors.goldInk, fontWeight: '800', fontSize: 12, marginLeft: 4 },
  spotTitle: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginTop: 14 },
  spotEmp: { color: '#CFE8D9', fontSize: 14, marginTop: 2, marginBottom: 4 },
  spotBottom: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 16 },
  spotSalary: { color: colors.gold, fontSize: 22, fontWeight: '800' },
  spotDeadline: { color: '#CFE8D9', fontSize: 12.5 },
});
