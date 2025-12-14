// frontend/src/components/PermissionBadge.js
// Badge component showing permission status (granted/denied)
// Used for RBAC visualization in HomeScreen

import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Badge showing whether a permission is granted or denied
 * @param {string} label - Permission name
 * @param {boolean} hasAccess - Whether access is granted
 */
export function PermissionBadge({ label, hasAccess }) {
  return (
    <View style={[styles.container, hasAccess ? styles.granted : styles.denied]}>
      <Text style={styles.icon}>{hasAccess ? '✓' : '✗'}</Text>
      <Text style={[styles.label, hasAccess ? styles.labelGranted : styles.labelDenied]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  granted: {
    backgroundColor: COLORS.successBg,
  },
  denied: {
    backgroundColor: COLORS.dangerBg,
  },
  icon: {
    marginRight: SPACING.xs,
    fontSize: 12,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  labelGranted: {
    color: COLORS.success,
  },
  labelDenied: {
    color: COLORS.danger,
  },
});
