// src/screens/HomeScreen.js

import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Card, InsuranceCard } from '../components';
import { 
  generateUserInsurances, 
  generateBusinessInsurances,
  getFirstName, 
  getUserDisplayInfo,
  generateCompanyProfile,
  hasPermission
} from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function HomeScreen({ user, customerType, activeProfile, onOpenProfileSwitcher }) {
  const isBusinessCustomer = customerType === 'business';
  const isActingAsDelegate = activeProfile?.type === 'delegation';
  const isActingAsBusiness = activeProfile?.type === 'business';
  
  // Get appropriate data based on customer type and active profile
  const userInfo = getUserDisplayInfo(user);
  const companyProfile = isBusinessCustomer ? generateCompanyProfile(user?.sub) : null;
  
  const insurances = isBusinessCustomer 
    ? generateBusinessInsurances(activeProfile?.id || user?.sub)
    : generateUserInsurances(activeProfile?.type === 'delegation' ? activeProfile.id : user?.sub);
  
  const displayName = isBusinessCustomer 
    ? companyProfile?.companyName 
    : (isActingAsDelegate ? activeProfile.name : getFirstName(user));

  // Filter insurances based on role permissions (for business)
  const filteredInsurances = isBusinessCustomer && activeProfile?.role
    ? insurances.filter(ins => hasPermission(activeProfile.role, ins.category))
    : insurances;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Delegate/Acting Banner */}
      {(isActingAsDelegate || isActingAsBusiness) && (
        <Pressable style={styles.actingBanner} onPress={onOpenProfileSwitcher}>
          <Text style={styles.actingBannerIcon}>
            {isActingAsBusiness ? '🏢' : '👵'}
          </Text>
          <View style={styles.actingBannerContent}>
            <Text style={styles.actingBannerTitle}>
              Handler på vegne av {activeProfile.name}
            </Text>
            <Text style={styles.actingBannerSubtitle}>
              {activeProfile.subtitle} • Trykk for å bytte
            </Text>
          </View>
          <Text style={styles.actingBannerArrow}>→</Text>
        </Pressable>
      )}

      {/* Welcome Card */}
      <Pressable style={styles.welcomeCard} onPress={onOpenProfileSwitcher}>
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeText}>
            <Text style={styles.greeting}>
              {isBusinessCustomer ? 'Velkommen,' : 'Velkommen tilbake,'}
            </Text>
            <Text style={styles.userName}>{displayName}!</Text>
            {isBusinessCustomer && companyProfile?.role && (
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {companyProfile.role.name}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.avatarContainer}>
            {userInfo?.picture ? (
              <Image source={{ uri: userInfo.picture }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, isBusinessCustomer && styles.avatarBusiness]}>
                <Text style={styles.avatarText}>
                  {isBusinessCustomer ? '🏢' : displayName?.[0] || '?'}
                </Text>
              </View>
            )}
            <View style={styles.switchIndicator}>
              <Text style={styles.switchIndicatorText}>⇄</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredInsurances.length}</Text>
            <Text style={styles.statLabel}>
              {isBusinessCustomer ? 'Bedriftsforsikringer' : 'Aktive forsikringer'}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Åpne saker</Text>
          </View>
        </View>
      </Pressable>

      {/* Role Permissions (for business) */}
      {isBusinessCustomer && companyProfile?.role && (
        <Card title="🔐 Din tilgang">
          <Text style={styles.roleDescription}>
            {companyProfile.role.description}
          </Text>
          <View style={styles.permissionList}>
            <PermissionBadge 
              label="Tingforsikringer" 
              hasAccess={hasPermission(companyProfile.role, 'ting')} 
            />
            <PermissionBadge 
              label="Personforsikringer" 
              hasAccess={hasPermission(companyProfile.role, 'person')} 
            />
            <PermissionBadge 
              label="Pensjon" 
              hasAccess={hasPermission(companyProfile.role, 'pensjon')} 
            />
          </View>
          <Text style={styles.rbacNote}>
            💡 Dette er RBAC (Role-Based Access Control) i praksis
          </Text>
        </Card>
      )}

      {/* Insurances */}
      <Text style={styles.sectionTitle}>
        {isBusinessCustomer ? '📋 Bedriftsforsikringer' : '📋 Mine forsikringer'}
      </Text>
      
      {filteredInsurances.length > 0 ? (
        filteredInsurances.map((insurance) => (
          <InsuranceCard key={insurance.id} insurance={insurance} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {isBusinessCustomer 
              ? 'Du har ikke tilgang til noen forsikringer med din rolle'
              : 'Ingen forsikringer funnet'
            }
          </Text>
        </View>
      )}

      {/* Company Info (for business) */}
      {isBusinessCustomer && companyProfile && (
        <Card title="🏢 Bedriftsinformasjon">
          <DetailRow label="Bedriftsnavn" value={companyProfile.companyName} />
          <DetailRow label="Org.nummer" value={companyProfile.orgNumber} />
          <DetailRow label="Antall ansatte" value={String(companyProfile.employeeCount)} />
          <DetailRow label="Kunde siden" value={companyProfile.customerSince} />
        </Card>
      )}

      {/* Help Card */}
      <View style={styles.helpCard}>
        <Text style={styles.helpTitle}>Trenger du hjelp?</Text>
        <Text style={styles.helpText}>
          {isBusinessCustomer 
            ? 'Kontakt bedriftsavdelingen på 915 03100 eller e-post bedrift@gjensidige.no'
            : 'Kontakt oss på telefon 915 03100 eller chat med oss i appen.'
          }
        </Text>
      </View>
    </ScrollView>
  );
}

function PermissionBadge({ label, hasAccess }) {
  return (
    <View style={[styles.permissionBadge, hasAccess ? styles.permissionYes : styles.permissionNo]}>
      <Text style={styles.permissionIcon}>{hasAccess ? '✓' : '✗'}</Text>
      <Text style={[styles.permissionLabel, hasAccess ? styles.permissionLabelYes : styles.permissionLabelNo]}>
        {label}
      </Text>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 100,
  },
  actingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  actingBannerIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actingBannerContent: {
    flex: 1,
  },
  actingBannerTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#92400e',
  },
  actingBannerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: '#b45309',
    marginTop: 2,
  },
  actingBannerArrow: {
    fontSize: 18,
    color: '#b45309',
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
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
  },
  roleBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '500',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarBusiness: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 20,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  switchIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.white,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchIndicatorText: {
    fontSize: 10,
    color: COLORS.primary,
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
  roleDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginBottom: SPACING.md,
  },
  permissionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  permissionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },
  permissionYes: {
    backgroundColor: COLORS.successBg,
  },
  permissionNo: {
    backgroundColor: '#fef2f2',
  },
  permissionIcon: {
    marginRight: SPACING.xs,
    fontSize: 12,
  },
  permissionLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
  permissionLabelYes: {
    color: COLORS.success,
  },
  permissionLabelNo: {
    color: COLORS.danger,
  },
  rbacNote: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    fontStyle: 'italic',
    marginTop: SPACING.md,
    textAlign: 'center',
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
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
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