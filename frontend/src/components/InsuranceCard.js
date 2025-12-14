// src/components/InsuranceCard.js

import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../styles/theme';

export function InsuranceCard({ insurance }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>{insurance.icon || '📋'}</Text>
          <Text style={styles.type}>{insurance.type}</Text>
        </View>
        <View style={[styles.badge, insurance.status === 'Aktiv' && styles.badgeActive]}>
          <Text style={styles.badgeText}>{insurance.status}</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Polisenummer</Text>
          <Text style={styles.detailValue}>{insurance.policyNumber}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Gyldig til</Text>
          <Text style={styles.detailValue}>{insurance.validUntil}</Text>
        </View>
        {insurance.premium && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Premie</Text>
            <Text style={styles.detailValue}>{insurance.premium}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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