// src/screens/LoginScreen.js

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions, Pressable } from 'react-native';
import { Button, Card } from '../components';
import { apiService } from '../services/api';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function LoginScreen({ onLogin, loading, onSelectCustomerType, selectedCustomerType }) {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  
  const [apiResult, setApiResult] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  const handleCallPublic = async () => {
    setApiLoading(true);
    try {
      const data = await apiService.callPublic();
      setApiResult({ endpoint: '/public', success: true, data });
    } catch (error) {
      setApiResult({ endpoint: '/public', success: false, error: error.message });
    }
    setApiLoading(false);
  };

  const handleCallProtected = async () => {
    setApiLoading(true);
    try {
      const response = await fetch('https://ciam-demo-dap-cdbcc5debgfgbaf5.westeurope-01.azurewebsites.net/protected');
      if (response.status === 401) {
        setApiResult({ 
          endpoint: '/protected', 
          success: false, 
          error: '401 Unauthorized - Krever innlogging!',
          expectedBehavior: true
        });
      } else {
        const data = await response.json();
        setApiResult({ endpoint: '/protected', success: true, data });
      }
    } catch (error) {
      setApiResult({ endpoint: '/protected', success: false, error: error.message });
    }
    setApiLoading(false);
  };

  const handleLogin = () => {
    if (!selectedCustomerType) return;
    onLogin();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, isDesktop && styles.containerDesktop]}>
        <View style={[styles.card, isDesktop && styles.cardDesktop]}>
          <Text style={styles.logo}>🛡️</Text>
          <Text style={styles.title}>CIAM Demo</Text>
          <Text style={styles.subtitle}>Customer Identity & Access Management</Text>
          <Text style={styles.description}>
            Sikker forsikringsportal med moderne autentisering
          </Text>

          {/* Customer Type Selection */}
          <View style={styles.customerTypeSection}>
            <Text style={styles.customerTypeLabel}>Velg kundetype:</Text>
            <View style={styles.customerTypeOptions}>
              <Pressable
                style={[
                  styles.customerTypeOption,
                  selectedCustomerType === 'private' && styles.customerTypeOptionSelected
                ]}
                onPress={() => onSelectCustomerType('private')}
              >
                <Text style={styles.customerTypeIcon}>👤</Text>
                <Text style={[
                  styles.customerTypeText,
                  selectedCustomerType === 'private' && styles.customerTypeTextSelected
                ]}>Privat</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.customerTypeOption,
                  selectedCustomerType === 'business' && styles.customerTypeOptionSelected
                ]}
                onPress={() => onSelectCustomerType('business')}
              >
                <Text style={styles.customerTypeIcon}>🏢</Text>
                <Text style={[
                  styles.customerTypeText,
                  selectedCustomerType === 'business' && styles.customerTypeTextSelected
                ]}>Bedrift</Text>
              </Pressable>
            </View>
            
            {selectedCustomerType && (
              <Text style={styles.customerTypeHint}>
                {selectedCustomerType === 'private' 
                  ? '👤 Personlige forsikringer, familie-fullmakter'
                  : '🏢 Bedriftsforsikringer, rollebasert tilgang (RBAC)'
                }
              </Text>
            )}
          </View>

          <Button
            title={loading ? 'Laster...' : 'Logg inn med Auth0'}
            onPress={handleLogin}
            disabled={loading || !selectedCustomerType}
          />

          {!selectedCustomerType && (
            <Text style={styles.selectTypeWarning}>
              ↑ Velg kundetype først
            </Text>
          )}

          <Text style={styles.signupHint}>
            Har du ikke en konto? Klikk over for å registrere deg!
          </Text>

          {/* API Test Section */}
          <View style={styles.apiSection}>
            <Text style={styles.apiTitle}>🔬 Test API-tilgang (før innlogging)</Text>
            <Text style={styles.apiDescription}>
              Se forskjellen mellom offentlige og beskyttede endepunkter:
            </Text>
            
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button
                  title="/public"
                  variant="success"
                  onPress={handleCallPublic}
                  disabled={apiLoading}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="/protected"
                  variant="danger"
                  onPress={handleCallProtected}
                  disabled={apiLoading}
                />
              </View>
            </View>

            {apiResult && (
              <View style={[
                styles.resultBox, 
                apiResult.success ? styles.resultSuccess : styles.resultError
              ]}>
                <Text style={styles.resultEndpoint}>
                  {apiResult.endpoint} → {apiResult.success ? '✓ OK' : '✗ Feilet'}
                </Text>
                {apiResult.expectedBehavior && (
                  <Text style={styles.expectedText}>
                    ✓ Forventet oppførsel! Logg inn for å få tilgang.
                  </Text>
                )}
                <Text style={styles.resultText}>
                  {apiResult.success 
                    ? JSON.stringify(apiResult.data, null, 2)
                    : apiResult.error
                  }
                </Text>
              </View>
            )}
          </View>

          <View style={styles.featureList}>
            <Text style={styles.featureTitle}>Sikkerhetsfunksjoner:</Text>
            <Text style={styles.featureItem}>✓ OAuth 2.0 + OpenID Connect</Text>
            <Text style={styles.featureItem}>✓ Multi-Factor Authentication (MFA)</Text>
            <Text style={styles.featureItem}>✓ JWT Token Validation</Text>
            <Text style={styles.featureItem}>✓ PKCE Flow</Text>
          </View>

          {/* Gjensidige-like info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 Slik gjør Gjensidige det</Text>
            <Text style={styles.infoText}>
              Gjensidige har separate innganger for Privat, Bedrift og Landbruk 
              på sin innloggingsside. Kundetypen bestemmer hvilke forsikringer 
              og funksjoner du ser etter innlogging.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.gray100,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingTop: 60,
  },
  containerDesktop: {
    paddingTop: 40,
    paddingBottom: 40,
  },
  card: {
    width: '100%',
    alignItems: 'center',
  },
  cardDesktop: {
    maxWidth: 480,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  logo: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray500,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  customerTypeSection: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  customerTypeLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  customerTypeOptions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  customerTypeOption: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.gray200,
  },
  customerTypeOptionSelected: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
  },
  customerTypeIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  customerTypeText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  customerTypeTextSelected: {
    color: COLORS.primary,
  },
  customerTypeHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
  selectTypeWarning: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    marginTop: SPACING.sm,
  },
  signupHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  apiSection: {
    width: '100%',
    marginTop: SPACING.xxl,
    paddingTop: SPACING.xxl,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  apiTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  apiDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonWrapper: {
    flex: 1,
  },
  resultBox: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    width: '100%',
  },
  resultSuccess: {
    backgroundColor: COLORS.successBg,
  },
  resultError: {
    backgroundColor: '#fef2f2',
  },
  resultEndpoint: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  expectedText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  resultText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'monospace',
    color: COLORS.gray700,
  },
  featureList: {
    marginTop: SPACING.xxl,
    alignItems: 'flex-start',
    width: '100%',
  },
  featureTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
    marginBottom: SPACING.md,
  },
  featureItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  infoBox: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.lg,
    width: '100%',
  },
  infoTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    lineHeight: 18,
  },
});