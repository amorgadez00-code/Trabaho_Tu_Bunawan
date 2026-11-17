import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

// Dropdown: looks like a text field; tapping it opens a bottom sheet with the list of options.
export default function AuthSelect({ icon, label, value, placeholder, options, onSelect, title, loading, note, onRetry, error, accent = colors.green }) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const close = () => setOpen(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[s.box, open && { borderColor: accent, backgroundColor: '#fff' }, !!error && { borderColor: colors.danger }]}>
        <Ionicons name={icon} size={20} color={value ? accent : '#9CA3AF'} />
        <Text style={[s.value, !value && { color: '#9CA3AF' }]} numberOfLines={1}>{value || placeholder}</Text>
        <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
      </Pressable>
      {!!error && <Text style={s.error}>{error}</Text>}

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)' }]} onPress={close} />
          <View style={[s.sheet, { paddingBottom: insets.bottom + 12 }]}>
            <View style={s.handle} />
            <View style={s.header}>
              <Text style={s.title}>{title || label}</Text>
              <Pressable onPress={close} hitSlop={10}><Ionicons name="close" size={24} color={colors.muted} /></Pressable>
            </View>
            {loading && <Text style={s.note}>Updating the list...</Text>}
            {!!note && (
              <View style={s.warn}>
                <Text style={{ color: '#92400E', fontSize: 12, flex: 1 }}>{note}</Text>
                {!!onRetry && <Text onPress={onRetry} style={{ color: '#92400E', fontWeight: '800', fontSize: 12, marginLeft: 10 }}>Retry</Text>}
              </View>
            )}
            <FlatList
              style={{ flexGrow: 0 }}
              data={options}
              keyExtractor={(o) => o}
              renderItem={({ item }) => {
                const selected = item === value;
                return (
                  <Pressable
                    onPress={() => { onSelect(item); close(); }}
                    style={({ pressed }) => [s.row, (selected || pressed) && { backgroundColor: colors.mint }]}>
                    <Ionicons name="location-outline" size={20} color={selected ? accent : colors.muted} />
                    <Text style={[s.rowText, selected && { color: accent, fontWeight: '800' }]}>{item}</Text>
                    {selected && <Ionicons name="checkmark-circle" size={22} color={accent} />}
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', color: colors.forest, marginBottom: 7 },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 14 },
  value: { flex: 1, marginHorizontal: 10, fontSize: 15, color: colors.ink },
  error: { color: colors.danger, fontSize: 12, marginTop: 5 },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '65%', paddingHorizontal: 20, paddingTop: 10 },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#D1D5DB', marginBottom: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: '800', color: colors.forest },
  note: { color: colors.muted, fontSize: 12, marginBottom: 8 },
  warn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', padding: 10, borderRadius: 10, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12 },
  rowText: { flex: 1, marginLeft: 12, fontSize: 15, color: colors.ink, fontWeight: '600' },
});
