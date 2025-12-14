// frontend/src/components/InsuranceCard.js

import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../styles/theme';

export function InsuranceCard({ insurance }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{insurance.icon}</Text>
        <View style={styles.headerText}>
          <Text style={styles.type}>{insurance.type}</Text>
          <Text style={styles.policyNumber}>{insurance.policyNumber}</Text>
        </View>
        <View style={[styles.statusBadge, insurance.status === 'Aktiv' && styles.statusActive]}>
          <Text style={[styles.statusText, insurance.status === 'Aktiv' && styles.statusTextActive]}>
            {insurance.status}
          </Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Gyldig til</Text>
          <Text style={styles.detailValue}>{insurance.validUntil}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Premie</Text>
          <Text style={styles.detailValue}>{insurance.premium}</Text>
        </View>
      </View>
    </View>
  );
}

InsuranceCard.propTypes = {
  insurance: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    policyNumber: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    validUntil: PropTypes.string.isRequired,
    premium: PropTypes.string.isRequired,
    category: PropTypes.string,
  }).isRequired,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  icon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  type: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  policyNumber: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
  },
  statusActive: {
    backgroundColor: COLORS.successBg,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  statusTextActive: {
    color: COLORS.success,
  },
  details: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
    paddingTop: SPACING.md,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray900,
    fontWeight: '500',
    marginTop: 2,
  },
});
