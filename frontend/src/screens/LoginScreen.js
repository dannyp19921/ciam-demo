// frontend/src/screens/LoginScreen.js
// Pre-authentication screen with customer type selection and API testing

import PropTypes from 'prop-types';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Button, InfoBox, ApiResultBox } from '../components';
import { useApiTest } from '../hooks';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Login screen with customer type selection
 */
export function LoginScreen({ onLogin, loading, selectedCustomerType, onSelectCustomerType }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { result, isLoading, callPublic, callProtected } = useApiTest(null);

  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  // Login is disabled if loading OR no customer type selected
  const isLoginDisabled = loading || !selectedCustomerType;

  // Dynamic button text
  const getButtonText = () => {
    if (loading) return 'Laster...';
    if (!selectedCustomerType) return 'Velg kundetype først';
    return 'Logg inn med Auth0';
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + SPACING.lg, 60),
          paddingBottom: Math.max(insets.bottom + SPACING.xl, 40),
        },
        isWeb && isWideScreen && styles.containerWeb,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>🔐</Text>
        <Text style={styles.title}>CIAM Demo</Text>
        <Text style={styles.subtitle}>Customer Identity & Access Management</Text>
      </View>

      {/* Customer Type Selection */}
      <Card title="1️⃣ Velg kundetype">
        <Text style={styles.customerTypeDescription}>
          Velg hvilken type kunde du vil simulere for å se forskjellig funksjonalitet.
        </Text>

        <CustomerTypeSelector
          selectedType={selectedCustomerType}
          onSelect={onSelectCustomerType}
        />
      </Card>

      {/* Login Button */}
      <Card title="2️⃣ Logg inn">
        {!selectedCustomerType && (
          <View style={styles.loginHint}>
            <Text style={styles.loginHintIcon}>☝️</Text>
            <Text style={styles.loginHintText}>
              Velg kundetype ovenfor før du logger inn
            </Text>
          </View>
        )}
        
        {selectedCustomerType && (
          <Text style={styles.selectedTypeInfo}>
            Du logger inn som: <Text style={styles.selectedTypeBold}>
              {selectedCustomerType === 'private' ? '👤 Privatkunde' : '🏢 Bedriftskunde'}
            </Text>
          </Text>
        )}

        <Button
          title={getButtonText()}
          onPress={onLogin}
          disabled={isLoginDisabled}
          variant={selectedCustomerType ? 'primary' : 'secondary'}
        />
      </Card>

      {/* API Test Section */}
      <Card
        title="🔬 Test API (før innlogging)"
        description="Se forskjellen mellom offentlige og beskyttede endepunkter."
      >
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="/public"
              variant="success"
              onPress={callPublic}
              disabled={isLoading}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="/protected"
              variant="primary"
              onPress={callProtected}
              disabled={isLoading}
            />
          </View>
        </View>
      </Card>

      <ApiResultBox result={result} />

      {/* Info about Gjensidige */}
      <InfoBox title="💡 Om denne demoen" variant="primary">
        Denne appen demonstrerer CIAM-konsepter relevante for Gjensidige:{'\n\n'}
        • OAuth 2.0 med PKCE-flyt{'\n'}
        • Multi-faktor autentisering (MFA){'\n'}
        • Rollebasert tilgangskontroll (RBAC){'\n'}
        • Delegert tilgang (fullmakt){'\n'}
        • Step-up authentication{'\n'}
        • GDPR-samsvar
      </InfoBox>

      {/* Features List */}
      <Card title="✨ Funksjoner">
        <FeatureItem icon="🔑" text="OAuth 2.0 med Auth0" />
        <FeatureItem icon="📱" text="MFA med Google Authenticator" />
        <FeatureItem icon="👥" text="Privat- og bedriftskunde" />
        <FeatureItem icon="🤝" text="Delegert tilgang (fullmakt)" />
        <FeatureItem icon="🔐" text="Step-up authentication" />
        <FeatureItem icon="📋" text="GDPR samtykke-håndtering" />
      </Card>
    </ScrollView>
  );
}

// ---------------------
// PROP TYPES
// ---------------------

LoginScreen.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  selectedCustomerType: PropTypes.oneOf(['private', 'business', null]),
  onSelectCustomerType: PropTypes.func.isRequired,
};

LoginScreen.defaultProps = {
  loading: false,
  selectedCustomerType: null,
};

// ---------------------
// SUB-COMPONENTS
// ---------------------

function CustomerTypeSelector({ selectedType, onSelect }) {
  return (
    <View style={styles.customerTypeGrid}>
      <CustomerTypeOption
        type="private"
        icon="👤"
        title="Privatkunde"
        description="Personlige forsikringer"
        isSelected={selectedType === 'private'}
        onPress={() => onSelect('private')}
      />
      <CustomerTypeOption
        type="business"
        icon="🏢"
        title="Bedriftskunde"
        description="Bedriftsforsikringer med RBAC"
        isSelected={selectedType === 'business'}
        onPress={() => onSelect('business')}
      />
    </View>
  );
}

CustomerTypeSelector.propTypes = {
  selectedType: PropTypes.oneOf(['private', 'business', null]),
  onSelect: PropTypes.func.isRequired,
};

function CustomerTypeOption({ icon, title, description, isSelected, onPress }) {
  return (
    <Pressable
      style={[styles.customerTypeOption, isSelected && styles.customerTypeOptionSelected]}
      onPress={onPress}
    >
      <Text style={styles.customerTypeIcon}>{icon}</Text>
      <Text style={[styles.customerTypeTitle, isSelected && styles.customerTypeTitleSelected]}>
        {title}
      </Text>
      <Text style={styles.customerTypeDesc}>{description}</Text>
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedBadgeText}>✓</Text>
        </View>
      )}
    </Pressable>
  );
}

CustomerTypeOption.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
};

function FeatureItem({ icon, text }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

FeatureItem.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

// ---------------------
// STYLES
// ---------------------

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.gray100,
  },
  containerWeb: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray500,
    marginTop: SPACING.xs,
  },
  customerTypeDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.md,
  },
  customerTypeGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  customerTypeOption: {
    flex: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  customerTypeOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  customerTypeIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  customerTypeTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  customerTypeTitleSelected: {
    color: COLORS.primary,
  },
  customerTypeDesc: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  selectedBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loginHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warningBg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  loginHintIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  loginHintText: {
    fontSize: FONT_SIZES.sm,
    color: '#92400e',
    flex: 1,
  },
  selectedTypeInfo: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  selectedTypeBold: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonWrapper: {
    flex: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
    width: 30,
  },
  featureText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    flex: 1,
  },
});
