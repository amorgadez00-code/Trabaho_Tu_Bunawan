import React, { useState } from 'react';
import { Pressable, Text, View, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, tintFor } from '../theme';
import { getCategory } from '../data/mockData';

/* ------------------------------------------------------------------ */
/* Buttons, fields, chips (existing exports, same names and props)     */
/* ------------------------------------------------------------------ */

const buttonVariants = {
  primary: { bg: colors.green, fg: '#fff' },
  gold: { bg: colors.gold, fg: colors.ink },
  danger: { bg: colors.danger, fg: '#fff' },
  outline: { bg: '#fff', fg: colors.green, border: colors.green },
  soft: { bg: colors.mint, fg: colors.green },            // quiet secondary action
  dangerSoft: { bg: colors.dangerSoft, fg: colors.danger }, // quiet destructive action
};

export function Button({ title, onPress, variant = 'primary', style, disabled, icon }) {
  const v = buttonVariants[variant] || buttonVariants.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: v.bg, opacity: disabled ? 0.5 : pressed ? 0.88 : 1 },
        v.border && { borderWidth: 1.5, borderColor: v.border },
        style,
      ]}>
      {!!icon && <Ionicons name={icon} size={18} color={v.fg} style={{ marginRight: 8 }} />}
      <Text style={[styles.btnText, { color: v.fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, error, style, onFocus, onBlur, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#9CA3AF"
        {...props}
        onFocus={(e) => { setFocused(true); onFocus && onFocus(e); }}
        onBlur={(e) => { setFocused(false); onBlur && onBlur(e); }}
        style={[styles.input, style, focused && { borderColor: colors.green }, !!error && { borderColor: colors.danger }]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export function Chip({ text, active, onPress, icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.forest, borderColor: colors.forest }]}>
      {!!icon && <Ionicons name={icon} size={14} color={active ? colors.gold : colors.muted} style={{ marginRight: 5 }} />}
      <Text style={{ color: active ? '#fff' : colors.ink, fontSize: 13, fontWeight: '600' }}>{text}</Text>
    </Pressable>
  );
}

// Empty state: an icon, a short title, one line of help, and (optionally) an action button as children.
export function Empty({ text, title, icon = 'leaf-outline', children }) {
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: 32, paddingVertical: 36 }}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={30} color={colors.green} />
      </View>
      {!!title && <Text style={styles.emptyTitle}>{title}</Text>}
      <Text style={{ color: colors.muted, textAlign: 'center', lineHeight: 20, marginBottom: children ? 18 : 0 }}>{text}</Text>
      {children}
    </View>
  );
}

const statusColors = {
  pending: ['#FEF3C7', '#92400E'], reviewed: ['#DBEAFE', '#1E40AF'], shortlisted: ['#E0E7FF', '#3730A3'],
  accepted: ['#DCFCE7', '#166534'], rejected: ['#FEE2E2', '#991B1B'], withdrawn: ['#F3F4F6', '#4B5563'],
};
export function StatusPill({ status }) {
  const [bg, fg] = statusColors[status] || statusColors.pending;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg, marginRight: 6 }} />
      <Text style={{ color: fg, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' }}>{status}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Layout: hills header + rounded sheet (same idea as the login pages) */
/* ------------------------------------------------------------------ */

// Rolling hills with a sun coming up behind them, a nod to the logo. Purely decorative.
// Fills its parent from the bottom; use HillStrip to place it in the page flow.
export function Hills({ height = 70, sun = false }) {
  const peak = sun ? height * 0.3 : height * 0.18;   // where the far hill starts
  const rest = height - peak;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height, overflow: 'hidden' }}>
      {sun && <View style={{ position: 'absolute', right: 56, top: Math.max(peak - 30, 0), width: 44, height: 44, borderRadius: 22, backgroundColor: colors.gold }} />}
      <View style={{ position: 'absolute', width: 440, height: 440, borderRadius: 220, right: -190, top: peak, backgroundColor: '#176240' }} />
      <View style={{ position: 'absolute', width: 380, height: 380, borderRadius: 190, left: -150, top: peak + rest * 0.18, backgroundColor: '#1F7A4D' }} />
      <View style={{ position: 'absolute', width: 320, height: 320, borderRadius: 160, left: '30%', top: peak + rest * 0.5, backgroundColor: '#2A9157' }} />
    </View>
  );
}

// Full-width hills strip that sits in the page flow (inside a 20px-padded forest header).
export function HillStrip({ height = 46, sun = false, style }) {
  return (
    <View style={[{ height, marginHorizontal: -20 }, style]}>
      <Hills height={height} sun={sun} />
    </View>
  );
}

// Forest header for the main tabs. `children` renders under the title (search box, avatar row...).
export function ScreenHeader({ title, subtitle, right, tall, children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: colors.forest, paddingTop: insets.top + 14, paddingHorizontal: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.headerTitle}>{title}</Text>
          {!!subtitle && <Text style={styles.headerSub}>{subtitle}</Text>}
        </View>
        {right}
      </View>
      {children}
      <HillStrip height={tall ? 78 : 54} sun={tall} style={{ marginTop: children ? 6 : 4 }} />
    </View>
  );
}

// Page content that slides up over the header with rounded top corners.
export function Sheet({ children, style }) {
  return (
    <View style={[{ flex: 1, backgroundColor: colors.bg, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, marginTop: -16, overflow: 'hidden' }, style]}>
      {children}
    </View>
  );
}

export function SectionTitle({ title, action, onAction, style }) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }, style]}>
      <Text style={styles.h2NoMargin}>{title}</Text>
      {!!action && (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={{ color: colors.green, fontWeight: '700', fontSize: 13 }}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

// Rounded square with the category icon, tinted per category.
export function CategoryBadge({ categoryId, size = 48 }) {
  const [bg, fg] = tintFor(categoryId);
  const cat = getCategory(categoryId);
  return (
    <View style={{ width: size, height: size, borderRadius: size * 0.3, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={cat ? cat.icon : 'briefcase-outline'} size={size * 0.5} color={fg} />
    </View>
  );
}

// Round avatar with initials.
export function Avatar({ text, size = 40, bg = colors.mint, fg = colors.green, ring }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }, ring && { borderWidth: 3, borderColor: ring }]}>
      <Text style={{ color: fg, fontWeight: '800', fontSize: size * 0.38 }}>{text}</Text>
    </View>
  );
}

const pillTones = {
  neutral: [colors.bg, colors.muted],
  blue: [colors.blueSoft, colors.blue],
  green: [colors.mint, colors.green],
  gold: [colors.goldSoft, colors.goldInk],
  glass: ['rgba(255,255,255,0.14)', '#fff'],
};
export function Pill({ text, icon, tone = 'neutral' }) {
  const [bg, fg] = pillTones[tone] || pillTones.neutral;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: bg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginRight: 6, marginTop: 6 }}>
      {!!icon && <Ionicons name={icon} size={13} color={fg} style={{ marginRight: 4 }} />}
      <Text style={{ color: fg, fontSize: 12, fontWeight: '600' }}>{text}</Text>
    </View>
  );
}

// A white card that holds several ListRow items separated by hairlines.
export function ListGroup({ children, style }) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={[{ backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' }, style]}>
      {rows.map((row, i) => (
        <View key={i}>
          {i > 0 && <View style={{ height: 1, backgroundColor: colors.line, marginLeft: 66 }} />}
          {row}
        </View>
      ))}
    </View>
  );
}

export function ListRow({ icon, tint = [colors.mint, colors.green], title, subtitle, onPress, danger, chevron = true }) {
  const base = { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14 };
  const content = (
    <>
      <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: danger ? colors.dangerSoft : tint[0], alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
        <Ionicons name={icon} size={20} color={danger ? colors.danger : tint[1]} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: danger ? colors.danger : colors.ink }}>{title}</Text>
        {!!subtitle && <Text style={{ fontSize: 12.5, color: colors.muted, marginTop: 1 }}>{subtitle}</Text>}
      </View>
      {!!onPress && chevron && <Ionicons name="chevron-forward" size={18} color="#B6BCC6" />}
    </>
  );
  if (!onPress) return <View style={base}>{content}</View>;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { backgroundColor: colors.bg }]}>
      {content}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ */
/* The application "road": Sent > Reviewed > Shortlisted > Accepted   */
/* ------------------------------------------------------------------ */

const TRAIL = ['Sent', 'Reviewed', 'Shortlisted', 'Accepted'];
const STAGE = { pending: 0, reviewed: 1, shortlisted: 2, accepted: 3 };

export function ProgressTrail({ status, compact }) {
  const closed = status === 'rejected' || status === 'withdrawn';
  const reached = STAGE[status] ?? 0;
  const finished = status === 'accepted';
  const dot = compact ? 16 : 24;
  const lineH = compact ? 3 : 4;
  const green = colors.green;
  const off = '#DADFE3';

  return (
    <View style={{ flexDirection: 'row' }}>
      {TRAIL.map((label, i) => {
        const done = closed ? i === 0 : i < reached || finished;
        const current = !closed && !finished && i === reached;
        const leftOn = !closed && i > 0 && i <= reached;
        const rightOn = !closed && i < TRAIL.length - 1 && i < reached;
        return (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: dot + 6 }}>
              <View style={{ flex: 1, height: lineH, backgroundColor: i === 0 ? 'transparent' : leftOn ? green : off }} />
              <View
                style={[
                  { width: dot, height: dot, borderRadius: dot / 2, alignItems: 'center', justifyContent: 'center' },
                  done && { backgroundColor: green },
                  current && { backgroundColor: colors.gold, borderWidth: 4, borderColor: '#FBE59A', width: dot + 6, height: dot + 6, borderRadius: (dot + 6) / 2 },
                  !done && !current && { backgroundColor: '#fff', borderWidth: 2, borderColor: off },
                ]}>
                {done && <Ionicons name="checkmark" size={dot * 0.64} color="#fff" />}
              </View>
              <View style={{ flex: 1, height: lineH, backgroundColor: i === TRAIL.length - 1 ? 'transparent' : rightOn ? green : off }} />
            </View>
            <Text
              numberOfLines={1}
              style={{ marginTop: 4, fontSize: compact ? 10.5 : 12, fontWeight: done || current ? '700' : '500', color: done || current ? colors.ink : colors.muted }}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* ------------------------------------------------------------------ */

export const styles = StyleSheet.create({
  btn: { flexDirection: 'row', paddingVertical: 14, borderRadius: radius.md + 2, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', color: colors.ink, marginBottom: 6 },
  input: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: colors.ink },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: colors.line, backgroundColor: '#fff', marginRight: 8 },
  screen: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.line },
  h2: { fontSize: 18, fontWeight: '800', color: colors.forest, marginBottom: 8, letterSpacing: -0.2 },
  h2NoMargin: { fontSize: 18, fontWeight: '800', color: colors.forest, letterSpacing: -0.2 },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800', letterSpacing: -0.6 },
  headerSub: { color: '#CFE8D9', fontSize: 15, marginTop: 4, lineHeight: 21 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.forest, marginBottom: 6, textAlign: 'center' },
});
