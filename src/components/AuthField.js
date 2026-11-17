import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

// Text field with a left icon, green highlight when focused, and a show/hide button for passwords
export default function AuthField({ icon, label, error, secure, accent = colors.green, ...props }) {
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <View style={[s.box, focus && { borderColor: accent, backgroundColor: '#fff' }, !!error && { borderColor: colors.danger }]}>
        <Ionicons name={icon} size={20} color={focus ? accent : '#9CA3AF'} />
        <TextInput
          style={s.input}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secure && !show}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...props}
        />
        {secure && (
          <Pressable onPress={() => setShow(!show)} hitSlop={10}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color="#9CA3AF" />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', color: colors.forest, marginBottom: 7 },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderWidth: 1.5, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 14 },
  boxFocus: { borderColor: colors.green, backgroundColor: '#fff' },
  input: { flex: 1, paddingVertical: 13, paddingHorizontal: 10, fontSize: 15, color: colors.ink },
  error: { color: colors.danger, fontSize: 12, marginTop: 5 },
});
