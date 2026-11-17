import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { colors, TAGLINE } from '../theme';

// Shown first when the app opens. Calls onFinish after the animation.
// To change the logo, replace assets/Logo.jpg (keep the same file name).
export default function SplashScreen({ onFinish, minDuration = 2200 }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(onFinish, minDuration);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.wrap}>
      <Animated.View style={[s.logoCard, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <Image source={require('../../assets/Logo.jpg')} style={s.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
        <Text style={s.title}>Trabaho Tu Bunawan</Text>
        <Text style={s.tagline}>{TAGLINE}</Text>
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logoCard: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logo: { width: 146, height: 146 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 24, textAlign: 'center' },
  tagline: { color: colors.gold, fontSize: 15, fontWeight: '600', marginTop: 8, textAlign: 'center' },
});
