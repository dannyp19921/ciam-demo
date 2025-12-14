// frontend/src/components/ApiResultBox.js
// Component for displaying API test results
// Used in LoginScreen and ApiTestScreen

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Display box for API call results
 * @param {Object} result - API result object
 * @param {string} result.endpoint - API endpoint called
 * @param {boolean} result.success - Whether call succeeded
 * @param {boolean} result.authenticated - Whether request was authenticated
 * @param {boolean} result.expectedBehavior - Whether failure was expected
 * @param {Object} result.data - Response data (if success)
 * @param {string} result.error - Error message (if failure)
 */
export function ApiResultBox({ result }) {
  if (!result) return null;

  return (
    <View style={[styles.container, result.success ? styles.success : styles.error]}>
      <View style={styles.header}>
        <Text style={styles.endpoint}>
          {result.endpoint} → {result.success ? '✓ OK' : '✗ Feilet'}
          {result.authenticated && ' (Autentisert)'}
        </Text>
      </View>

      {result.expectedBehavior && (
        <Text style={styles.expectedText}>
          ✓ Forventet oppførsel! Logg inn for å få tilgang.
        </Text>
      )}

      {result.success && result.authenticated && (
        <Text style={styles.authBadge}>
          JWT-token validert av backend
        </Text>
      )}

      <ScrollView style={styles.resultScroll} nestedScrollEnabled>
        <Text style={styles.resultText}>
          {result.success
            ? JSON.stringify(result.data, null, 2)
            : result.error}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
  },
  success: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  error: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.danger,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  endpoint: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  expectedText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: SPACING.sm,
  },
  authBadge: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  resultScroll: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    maxHeight: 200,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray700,
  },
});
