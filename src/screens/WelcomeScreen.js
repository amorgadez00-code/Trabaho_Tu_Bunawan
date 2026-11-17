import React, { useRef, useState } from 'react';
import { View, Text, Image, Animated, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, TAGLINE } from '../theme';
import { useApp } from '../context/AppContext';

// Images are in assets/onboarding/. Replace a file (same name) to change a slide picture.
const slides = [
  { key: '1', no: '01', bg: '#E3F1E8', image: require('../../assets/onboarding/welcome-1-find-jobs.png'), title: 'Find jobs near you',
    text: 'Browse openings from local employers in every barangay of Bunawan.' },
  { key: '2', no: '02', bg: '#E4EEF8', image: require('../../assets/onboarding/welcome-2-apply.png'), title: 'Apply in minutes',
    text: 'Send your application from your phone and track every update in one place.' },
  { key: '3', no: '03', bg: '#FFF4D2', image: require('../../assets/onboarding/welcome-3-hire-local.png'), title: 'Hire local talent',
    text: 'Employers can post jobs and connect with skilled people in their own community.' },
];

export default function WelcomeScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const { setSeenWelcome } = useApp();
  const listRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);
  const last = index === slides.length - 1;

  // picture keeps its 4:3 shape but never takes more than ~38% of the screen height
  const panelW = width - 40;
  const imgH = Math.min((panelW - 16) * 0.75, height * 0.38);
  const imgW = imgH / 0.75;

  const finish = () => {
    setSeenWelcome(true);                 // slides are only shown on first launch
    navigation.replace('Login');
  };
  const next = () => {
    if (last) return finish();
    setIndex(index + 1);                  // update the dots / button right away
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  // keeps the dots and button in sync for both swiping and the Next button
  const onViewable = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) setIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <SafeAreaView style={s.wrap}>
      {/* top bar: mini logo + name, Skip */}
      <View style={s.top}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={s.miniLogo}><Image source={require('../../assets/Logo.jpg')} style={{ width: 26, height: 26 }} resizeMode="contain" /></View>
          <Text style={s.brand}>Trabaho Tu Bunawan</Text>
        </View>
        {!last && (
          <Pressable onPress={finish} hitSlop={12} style={s.skipBtn}><Text style={s.skip}>Skip</Text></Pressable>
        )}
      </View>

      <Animated.FlatList
        ref={listRef}
        style={{ flex: 1 }}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i) => i.key}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        renderItem={({ item, index: i }) => {
          // the picture slides slightly slower than the page (parallax)
          const range = [(i - 1) * width, i * width, (i + 1) * width];
          const tx = scrollX.interpolate({ inputRange: range, outputRange: [width * 0.28, 0, -width * 0.28], extrapolate: 'clamp' });
          const sc = scrollX.interpolate({ inputRange: range, outputRange: [0.85, 1, 0.85], extrapolate: 'clamp' });
          return (
            <View style={[s.slide, { width }]}>
              <View style={[s.panel, { width: panelW, backgroundColor: item.bg }]}>
                <View style={[s.blob, { top: -34, right: -30, backgroundColor: colors.gold, opacity: 0.25 }]} />
                <View style={[s.blob, { bottom: -40, left: -36, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.leaf, opacity: 0.22 }]} />
                <Animated.Image source={item.image} style={{ width: imgW, height: imgH, transform: [{ translateX: tx }, { scale: sc }] }} resizeMode="contain" />
              </View>
              <View style={s.textWrap}>
                <View style={s.numChip}><Text style={s.num}>{item.no}</Text></View>
                <Text style={s.title}>{item.title}</Text>
                <View style={s.accent} />
                <Text style={s.text}>{item.text}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* bottom: animated dots on the left, round Next / Get Started button on the right */}
      <View style={s.bottom}>
        <View style={s.dots}>
          {slides.map((sl, i) => {
            const range = [(i - 1) * width, i * width, (i + 1) * width];
            const scaleX = scrollX.interpolate({ inputRange: range, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
            const opacity = scrollX.interpolate({ inputRange: range, outputRange: [0.35, 1, 0.35], extrapolate: 'clamp' });
            return <Animated.View key={sl.key} style={[s.dot, { opacity, transform: [{ scaleX }] }]} />;
          })}
        </View>
        <Pressable onPress={next} style={({ pressed }) => [s.fab, last && s.fabWide, pressed && { opacity: 0.85 }]}>
          {last && <Text style={s.fabText}>Get Started</Text>}
          <Ionicons name="arrow-forward" size={24} color="#fff" style={last && { marginLeft: 8 }} />
        </Pressable>
      </View>
      <Text style={s.tagline}>{TAGLINE}</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#fff' },
  top: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  miniLogo: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 8 },
  brand: { color: colors.forest, fontWeight: '800', fontSize: 15 },
  skipBtn: { backgroundColor: colors.mint, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999 },
  skip: { color: colors.green, fontWeight: '800', fontSize: 13 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  panel: { borderRadius: 32, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, overflow: 'hidden' },
  blob: { position: 'absolute', width: 100, height: 100, borderRadius: 50 },
  textWrap: { width: '100%', paddingHorizontal: 6, marginTop: 24 },
  numChip: { alignSelf: 'flex-start', backgroundColor: colors.gold, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  num: { color: colors.goldInk, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  title: { fontSize: 28, fontWeight: '800', color: colors.forest, marginTop: 12 },
  accent: { width: 44, height: 5, borderRadius: 3, backgroundColor: colors.leaf, marginTop: 10 },
  text: { fontSize: 15, lineHeight: 23, color: colors.muted, marginTop: 12 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 26, paddingTop: 6 },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 28, height: 8, borderRadius: 4, backgroundColor: colors.green, marginRight: -6 },
  fab: { height: 60, minWidth: 60, borderRadius: 30, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  fabWide: { paddingHorizontal: 26 },
  fabText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  tagline: { textAlign: 'center', color: colors.green, fontWeight: '700', fontSize: 12, marginTop: 14, marginBottom: 12 },
});
