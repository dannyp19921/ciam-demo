// src/screens/HomeScreen.js

import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { InsuranceCard } from '../components';
import { generateUserInsurances, getFirstName, getUserDisplayInfo } from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function HomeScreen({ user }) {
  const userInfo = getUserDisplayInfo(user);
  const insurances = generateUserInsurances(user?.sub);
  const firstName = getFirstName(user);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>Velkommen tilbake,</Text>
            <Text style={styles.userName}>{firstName}!</Text>
          </View>
          {userInfo?.picture && (
            <Image source={{ uri: userInfo.picture }} style={styles.avatar} />
          )}
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{insurances.length}</Text>
            <Text style={styles.statLabel}>Aktive forsikringer</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Åpne saker</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Mine forsikringer</Text>
      
      {insurances.length > 0 ? (
        insurances.map((insurance) => (
          <InsuranceCard key={insurance.id} insurance={insurance} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Ingen forsikringer funnet</Text>
        </View>
      )}

      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>Trenger du hjelp?</Text>
        <Text style={styles.helpText}>
          Kontakt oss på telefon 915 03100 eller chat med oss i appen.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 100,
  },
  welcomeCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    marginBottom: SPACING.xxl,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primaryLight,
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primaryLight,
    marginTop: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  emptyState: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray500,
  },
  helpCard: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  helpTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: SPACING.xs,
  },
  helpText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    lineHeight: 20,
  },
});