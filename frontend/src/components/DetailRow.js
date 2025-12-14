// frontend/src/components/DetailRow.js
// Reusable detail row component for displaying label-value pairs
// Used in: HomeScreen, ProfileScreen, ApiTestScreen

import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../styles/theme';

/**
 * A row displaying a label and value pair
 * @param {string} label - Left side label text
 * @param {string} value - Right side value text
 * @param {string} valueColor - Optional color override for value
 * @param {boolean} noBorder - Optional flag to hide bottom border
 */
export function DetailRow({ label, value, valueColor, noBorder = false }) {
  return (
    <View style={[styles.container, noBorder && styles.noBorder]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    flex: 1,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray900,
    flex: 1,
    textAlign: 'right',
  },
});
