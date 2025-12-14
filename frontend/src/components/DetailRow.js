// frontend/src/components/DetailRow.js
// Reusable component for displaying label-value pairs

import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../styles/theme';

/**
 * DetailRow component for displaying a label-value pair
 */
export function DetailRow({ label, value, valueColor, noBorder }) {
  return (
    <View style={[styles.row, !noBorder && styles.border]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

DetailRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  valueColor: PropTypes.string,
  noBorder: PropTypes.bool,
};

DetailRow.defaultProps = {
  valueColor: null,
  noBorder: false,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  value: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray900,
  },
});
