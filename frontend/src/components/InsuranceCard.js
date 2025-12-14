// frontend/src/components/InsuranceCard.js
// Card component for displaying insurance information

import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../styles/theme';

/**
 * Card displaying insurance details
 * @param {Object} insurance - Insurance data object
 * @param {string} insurance.type - Insurance type name
 * @param {string} insurance.icon - Emoji icon
 * @param {string} insurance.status - Status (e.g., 'Aktiv')
 * @param {string} insurance.policyNumber - Policy number
 * @param {string} insurance.validUntil - Expiration date
 * @param {string} insurance.premium - Monthly premium
 */
export function InsuranceCard({ insurance }) {
  const isActive = insurance.status === 'Aktiv';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{insurance.icon || '📋'}</Text>
          <Text style={styles.type}>{insurance.type}</Text>
        </View>
        <View style={[styles.badge, isActive && styles.badgeActive]}>
          <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
            {insurance.status}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <DetailItem label="Polisenummer" value={insurance.policyNumber} />
        <DetailItem label="Gyldig til" value={insurance.validUntil} />
        {insurance.premium && (
          <DetailItem label="Premie" value={insurance.premium} />
        )}
      </View>
    </View>
  );
}

/**
 * Internal detail item component
 */
function DetailItem({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  type: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray200,
  },
  badgeActive: {
    backgroundColor: COLORS.successBg,
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.gray600,
  },
  badgeTextActive: {
    color: COLORS.success,
  },
  details: {
    gap: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray900,
  },
});
