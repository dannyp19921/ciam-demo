// frontend/src/screens/HomeScreen.js
// Main dashboard screen showing user insurances and profile info

import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Card, InsuranceCard, DetailRow, PermissionBadge, ScreenContainer } from '../components';
import {
  generateUserInsurances,
  generateBusinessInsurances,
  getFirstName,
  getUserDisplayInfo,
  generateCompanyProfile,
  hasPermission,
} from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Home screen component
 */
export function HomeScreen({ user, customerType, activeProfile, onOpenProfileSwitcher }) {
  const isBusinessCustomer = customerType === 'business';
  const isActingAsDelegate = activeProfile?.type === 'delegation';
  const isActingAsBusiness = activeProfile?.type === 'business';

  const userInfo = getUserDisplayInfo(user);
  const companyProfile = isBusinessCustomer ? generateCompanyProfile(user?.sub) : null;

  const insurances = isBusinessCustomer
    ? generateBusinessInsurances(activeProfile?.id || user?.sub)
    : generateUserInsurances(
        activeProfile?.type === 'delegation' ? activeProfile.id : user?.sub
      );

  const displayName = isBusinessCustomer
    ? companyProfile?.companyName
    : isActingAsDelegate
    ? activeProfile.name
    : getFirstName(user);

  const filteredInsurances =
    isBusinessCustomer && activeProfile?.role
      ? insurances.filter((ins) => hasPermission(activeProfile.role, ins.category))
      : insurances;

  return (
    <ScreenContainer>
      {(isActingAsDelegate || isActingAsBusiness) && (
        <ActingBanner
          profile={activeProfile}
          isBusiness={isActingAsBusiness}
          onPress={onOpenProfileSwitcher}
        />
      )}

      <WelcomeCard
        displayName={displayName}
        userInfo={userInfo}
        companyProfile={companyProfile}
        isBusinessCustomer={isBusinessCustomer}
        insuranceCount={filteredInsurances.length}
        onPress={onOpenProfileSwitcher}
      />

      {isBusinessCustomer && companyProfile?.role && (
        <RolePermissionsCard role={companyProfile.role} />
      )}

      <Text style={styles.sectionTitle}>
        {isBusinessCustomer ? '📋 Bedriftsforsikringer' : '📋 Mine forsikringer'}
      </Text>

      {filteredInsurances.length > 0 ? (
        filteredInsurances.map((insurance) => (
          <InsuranceCard key={insurance.id} insurance={insurance} />
        ))
      ) : (
        <EmptyInsurances isBusinessCustomer={isBusinessCustomer} />
      )}

      {isBusinessCustomer && companyProfile && (
        <CompanyInfoCard companyProfile={companyProfile} />
      )}

      <HelpCard isBusinessCustomer={isBusinessCustomer} />
    </ScreenContainer>
  );
}

// ---------------------
// PROP TYPES
// ---------------------

HomeScreen.propTypes = {
  user: PropTypes.shape({
    sub: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string,
  }),
  customerType: PropTypes.oneOf(['private', 'business']),
  activeProfile: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.oneOf(['self', 'delegation', 'business']),
    name: PropTypes.string,
    subtitle: PropTypes.string,
    role: PropTypes.object,
  }),
  onOpenProfileSwitcher: PropTypes.func,
};

HomeScreen.defaultProps = {
  user: null,
  customerType: 'private',
  activeProfile: null,
  onOpenProfileSwitcher: () => {},
};

// ---------------------
// SUB-COMPONENTS
// ---------------------

function ActingBanner({ profile, isBusiness, onPress }) {
  return (
    <Pressable style={styles.actingBanner} onPress={onPress}>
      <Text style={styles.actingBannerIcon}>{isBusiness ? '🏢' : '👵'}</Text>
      <View style={styles.actingBannerContent}>
        <Text style={styles.actingBannerTitle}>
          Handler på vegne av {profile.name}
        </Text>
        <Text style={styles.actingBannerSubtitle}>
          {profile.subtitle} • Trykk for å bytte
        </Text>
      </View>
      <Text style={styles.actingBannerArrow}>→</Text>
    </Pressable>
  );
}

ActingBanner.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
  }).isRequired,
  isBusiness: PropTypes.bool,
  onPress: PropTypes.func,
};

function WelcomeCard({ displayName, userInfo, companyProfile, isBusinessCustomer, insuranceCount, onPress }) {
  return (
    <Pressable style={styles.welcomeCard} onPress={onPress}>
      <View style={styles.welcomeHeader}>
        <View style={styles.welcomeText}>
          <Text style={styles.greeting}>
            {isBusinessCustomer ? 'Velkommen,' : 'Velkommen tilbake,'}
          </Text>
          <Text style={styles.userName}>{displayName}!</Text>
          {isBusinessCustomer && companyProfile?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{companyProfile.role.name}</Text>
            </View>
          )}
        </View>
        <Avatar
          picture={userInfo?.picture}
          displayName={displayName}
          isBusinessCustomer={isBusinessCustomer}
        />
      </View>

      <View style={styles.statsRow}>
        <StatItem
          value={insuranceCount}
          label={isBusinessCustomer ? 'Bedriftsforsikringer' : 'Aktive forsikringer'}
        />
        <View style={styles.statDivider} />
        <StatItem value={0} label="Åpne saker" />
      </View>
    </Pressable>
  );
}

WelcomeCard.propTypes = {
  displayName: PropTypes.string,
  userInfo: PropTypes.object,
  companyProfile: PropTypes.object,
  isBusinessCustomer: PropTypes.bool,
  insuranceCount: PropTypes.number,
  onPress: PropTypes.func,
};

function Avatar({ picture, displayName, isBusinessCustomer }) {
  return (
    <View style={styles.avatarContainer}>
      {picture ? (
        <Image source={{ uri: picture }} style={styles.avatar} />
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
  );
}

Avatar.propTypes = {
  picture: PropTypes.string,
  displayName: PropTypes.string,
  isBusinessCustomer: PropTypes.bool,
};

function StatItem({ value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

StatItem.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

function RolePermissionsCard({ role }) {
  return (
    <Card title="🔐 Din tilgang">
      <Text style={styles.roleDescription}>{role.description}</Text>
      <View style={styles.permissionList}>
        <PermissionBadge label="Tingforsikringer" hasAccess={hasPermission(role, 'ting')} />
        <PermissionBadge label="Personforsikringer" hasAccess={hasPermission(role, 'person')} />
        <PermissionBadge label="Pensjon" hasAccess={hasPermission(role, 'pensjon')} />
      </View>
      <Text style={styles.rbacNote}>
        💡 Dette er RBAC (Role-Based Access Control) i praksis
      </Text>
    </Card>
  );
}

RolePermissionsCard.propTypes = {
  role: PropTypes.shape({
    description: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

function EmptyInsurances({ isBusinessCustomer }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        {isBusinessCustomer
          ? 'Du har ikke tilgang til noen forsikringer med din rolle'
          : 'Ingen forsikringer funnet'}
      </Text>
    </View>
  );
}

EmptyInsurances.propTypes = {
  isBusinessCustomer: PropTypes.bool,
};

function CompanyInfoCard({ companyProfile }) {
  return (
    <Card title="🏢 Bedriftsinformasjon">
      <DetailRow label="Bedriftsnavn" value={companyProfile.companyName} />
      <DetailRow label="Org.nummer" value={companyProfile.orgNumber} />
      <DetailRow label="Antall ansatte" value={String(companyProfile.employeeCount)} />
      <DetailRow label="Kunde siden" value={companyProfile.customerSince} noBorder />
    </Card>
  );
}

CompanyInfoCard.propTypes = {
  companyProfile: PropTypes.shape({
    companyName: PropTypes.string,
    orgNumber: PropTypes.string,
    employeeCount: PropTypes.number,
    customerSince: PropTypes.string,
  }).isRequired,
};

function HelpCard({ isBusinessCustomer }) {
  return (
    <View style={styles.helpCard}>
      <Text style={styles.helpTitle}>Trenger du hjelp?</Text>
      <Text style={styles.helpText}>
        {isBusinessCustomer
          ? 'Kontakt bedriftsavdelingen på 915 03100 eller e-post bedrift@gjensidige.no'
          : 'Kontakt oss på telefon 915 03100 eller chat med oss i appen.'}
      </Text>
    </View>
  );
}

HelpCard.propTypes = {
  isBusinessCustomer: PropTypes.bool,
};

// ---------------------
// STYLES
// ---------------------

const styles = StyleSheet.create({
  actingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningBg,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.warning,
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
