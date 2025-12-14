// frontend/src/components/InfoBox.js
// Informational box component for tips and explanations
// Used across multiple screens for contextual information

import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Informational box with title and text
 * @param {string} title - Box title (often with emoji)
 * @param {string} children - Box content text
 * @param {string} variant - 'default' | 'primary' | 'warning'
 */
export function InfoBox({ title, children, variant = 'default' }) {
  const variantStyles = {
    default: {
      container: styles.containerDefault,
      title: styles.titleDefault,
      text: styles.textDefault,
    },
    primary: {
      container: styles.containerPrimary,
      title: styles.titlePrimary,
      text: styles.textPrimary,
    },
    warning: {
      container: styles.containerWarning,
      title: styles.titleWarning,
      text: styles.textWarning,
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <View style={[styles.container, currentVariant.container]}>
      {title && <Text style={[styles.title, currentVariant.title]}>{title}</Text>}
      <Text style={[styles.text, currentVariant.text]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  containerDefault: {
    backgroundColor: COLORS.gray50,
  },
  containerPrimary: {
    backgroundColor: COLORS.primaryBg,
  },
  containerWarning: {
    backgroundColor: COLORS.warningBg,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  titleDefault: {
    color: COLORS.gray700,
  },
  titlePrimary: {
    color: COLORS.primary,
  },
  titleWarning: {
    color: COLORS.warning,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  textDefault: {
    color: COLORS.gray500,
  },
  textPrimary: {
    color: COLORS.primary,
  },
  textWarning: {
    color: COLORS.warning,
  },
});
