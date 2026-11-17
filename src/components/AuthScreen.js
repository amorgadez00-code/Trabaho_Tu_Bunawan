import React from 'react';
import { View, Text, Image, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Shared layout for Login / Role / Register:
// green header with decorative shapes + logo, and a white rounded "sheet" that holds the form.
export default function AuthScreen({ title, subtitle, compact, onBack, footer, children }) {
  const insets = useSafeAreaInsets();
  const size = compact ? 66 : 96;
  return (
    <View style={{ flex: 1, backgroundColor: colors.forest }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" bounces={false} showsVerticalScrollIndicator={false}>
          <View style={[s.hero, { paddingTop: insets.top + 12, paddingBottom: compact ? 46 : 58 }]}>
            {/* decorative shapes */}
            <View style={[s.shape, { width: 240, height: 240, borderRadius: 120, top: -90, right: -70, backgroundColor: colors.gold, opacity: 0.16 }]} />
            <View style={[s.shape, { width: 180, height: 180, borderRadius: 90, bottom: -60, left: -60, backgroundColor: colors.leaf, opacity: 0.28 }]} />
            <View style={[s.shape, { width: 64, height: 64, borderRadius: 32, top: 110, left: 28, borderWidth: 8, borderColor: colors.gold, opacity: 0.3 }]} />
            <View style={[s.shape, { width: 22, height: 22, borderRadius: 11, top: 70, right: 70, backgroundColor: colors.leaf, opacity: 0.7 }]} />

            <View style={{ height: 40, justifyContent: 'center' }}>
              {onBack && (
                <Pressable onPress={onBack} hitSlop={10} style={s.back}>
                  <Ionicons name="chevron-back" size={22} color="#fff" />
                </Pressable>
              )}
            </View>

            <View style={{ alignItems: 'center', marginTop: compact ? 0 : 6 }}>
              <View style={[s.logoRing, { width: size + 12, height: size + 12, borderRadius: (size + 12) / 2 }]}>
                <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Image source={require('../../assets/Logo.jpg')} style={{ width: size * 0.82, height: size * 0.82 }} resizeMode="contain" />
                </View>
              </View>
              <Text style={[s.title, compact && { fontSize: 22 }]}>{title}</Text>
              {!!subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
            </View>
          </View>

          <View style={s.sheet}>{children}</View>
        </ScrollView>
        {/* optional footer that stays visible while the form scrolls */}
        {!!footer && <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>{footer}</View>}
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: colors.forest, paddingHorizontal: 20, overflow: 'hidden' },
  shape: { position: 'absolute' },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  logoRing: { borderWidth: 3, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 27, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  subtitle: { color: '#CFE8D9', fontSize: 14, lineHeight: 20, marginTop: 6, textAlign: 'center', paddingHorizontal: 16 },
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.line, paddingHorizontal: 22, paddingTop: 12 },
  sheet: { flexGrow: 1, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -30, paddingHorizontal: 22, paddingTop: 26, paddingBottom: 30 },
});
