import React from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { colors } from '../theme';
import { Avatar, Button, ListGroup, ListRow, Pill, ScreenHeader, SectionTitle, Sheet, styles } from '../components/ui';
import { initials } from '../utils/format';
import { useApp } from '../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { user, setUser, clearCache, isEmployer } = useApp();

  // Clearing the user switches the app back to the Login / Welcome screens automatically
  const logout = () => setUser(null);

  if (!user) return null;
  return (
    <View style={styles.screen}>
      <ScreenHeader tall title="My profile">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 18 }}>
          <Avatar text={initials(user.name)} size={72} bg={colors.gold} fg={colors.forest} ring="rgba(255,255,255,0.35)" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ color: '#fff', fontSize: 21, fontWeight: '800', letterSpacing: -0.4 }} numberOfLines={1}>{user.name}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Pill tone="glass" icon={isEmployer ? 'storefront-outline' : 'person-outline'} text={isEmployer ? 'Employer' : 'Job seeker'} />
              {!!user.barangay && <Pill tone="glass" icon="location" text={user.barangay} />}
            </View>
          </View>
        </View>
      </ScreenHeader>

      <Sheet>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <SectionTitle title="Contact details" />
          <ListGroup>
            <ListRow icon="mail-outline" tint={[colors.blueSoft, colors.blue]} title={user.email} subtitle="Email" chevron={false} />
            <ListRow icon="call-outline" tint={[colors.mint, colors.green]} title={user.phone} subtitle="Mobile number" chevron={false} />
          </ListGroup>

          <SectionTitle title="Account" style={{ marginTop: 22 }} />
          <ListGroup>
            <ListRow icon="create-outline" title="Edit profile" subtitle="Name, mobile number and barangay" onPress={() => navigation.navigate('EditProfile')} />
            {isEmployer && <ListRow icon="reader-outline" title="My job posts" subtitle="Post, edit or remove your jobs" onPress={() => navigation.navigate('MyPosts')} />}
          </ListGroup>

          <SectionTitle title="Help and data" style={{ marginTop: 22 }} />
          <ListGroup>
            <ListRow icon="shield-checkmark-outline" tint={[colors.goldSoft, '#8A6200']} title="Safety tips" subtitle="How to spot a fake job offer" onPress={() => navigation.navigate('Safety')} />
            <ListRow
              icon="cloud-download-outline"
              tint={[colors.bg, colors.muted]}
              title="Clear saved barangay list"
              subtitle="It downloads again when needed"
              onPress={() => Alert.alert('Clear saved barangay list?', 'The saved barangay list will be removed and downloaded again later. Your saved jobs, applications and posts are kept.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Clear', style: 'destructive', onPress: clearCache }])}
            />
          </ListGroup>

          <Button title="Log out" icon="log-out-outline" variant="dangerSoft" style={{ marginTop: 26 }} onPress={() => Alert.alert('Log out?', '', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log out', onPress: logout }])} />
        </ScrollView>
      </Sheet>
    </View>
  );
}
