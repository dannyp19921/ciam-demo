// src/components/Button.js

import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../styles/theme';

export function Button({ title, onPress, variant = 'primary', disabled = false }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const buttonStyle = [
    styles.base,
    styles[variant],
    disabled && styles.disabled,
    isDesktop && styles.desktop,
  ];

  return (
    <Pressable style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    width: '100%',
  },
  desktop: {
    maxWidth: 320,
    alignSelf: 'center',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  success: {
    backgroundColor: COLORS.success,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});