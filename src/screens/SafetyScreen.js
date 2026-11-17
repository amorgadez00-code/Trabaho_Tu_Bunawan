import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';
import { styles } from '../components/ui';

// Each tip: [icon, [tint background, tint icon], title, text]. These are separate habits, not steps, so they are not numbered.
const tips = [
  ['cash-outline', ['#FBE2E0', '#B03A2E'], 'Never pay to get hired', 'Real employers do not ask for registration, training, or placement fees.'],
  ['checkmark-circle-outline', [colors.blueSoft, colors.blue], 'Check the employer badge', 'Look for Verified Business or Verified Local on employer profiles.'],
  ['people-outline', [colors.mint, colors.green], 'Meet in public places', 'Do interviews in the workplace or a public place, not a private house.'],
  ['lock-closed-outline', [colors.goldSoft, '#8A6200'], 'Protect your documents', 'Do not send ID photos or bank details before you are hired.'],
  ['flag-outline', ['#E8E6F8', '#4B3FA8'], 'Report suspicious posts', 'Use “Report this job” on the job page so the admin can review it.'],
];
export default function SafetyScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
      <View style={{ backgroundColor: colors.forest, borderRadius: radius.lg, padding: 18, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="shield-checkmark" size={34} color={colors.gold} />
        <Text style={{ flex: 1, color: '#fff', fontSize: 17, fontWeight: '700', marginLeft: 14, lineHeight: 24 }}>Five habits that keep your job search safe.</Text>
      </View>
      {tips.map(([icon, tint, t, d]) => (
        <View key={t} style={[styles.card, { flexDirection: 'row', marginBottom: 12 }]}>
          <View style={{ width: 44, height: 44, borderRadius: 13, backgroundColor: tint[0], alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
            <Ionicons name={icon} size={22} color={tint[1]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '800', color: colors.forest, fontSize: 16 }}>{t}</Text>
            <Text style={{ marginTop: 3, lineHeight: 21, color: colors.ink }}>{d}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
