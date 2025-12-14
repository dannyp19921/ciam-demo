// src/screens/ApiTestScreen.js

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Button } from '../components';
import { apiService } from '../services/api';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function ApiTestScreen({ accessToken }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCallPublic = async () => {
    setLoading(true);
    try {
      const data = await apiService.callPublic();
      setResult({ 
        endpoint: '/public', 
        success: true, 
        authenticated: false,
        data 
      });
    } catch (error) {
      setResult({ 
        endpoint: '/public', 
        success: false, 
        error: error.message 
      });
    }
    setLoading(false);
  };

  const handleCallProtected = async () => {
    if (!accessToken) {
      setResult({ 
        endpoint: '/protected', 
        success: false, 
        error: 'Ingen tilgangstoken funnet!' 
      });
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.callProtected(accessToken);
      setResult({ 
        endpoint: '/protected', 
        success: true, 
        authenticated: true,
        data 
      });
    } catch (error) {
      setResult({ 
        endpoint: '/protected', 
        success: false, 
        error: error.message 
      });
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card
        title="🔬 Test API-tilgang (etter innlogging)"
        description="Nå som du er autentisert, har du tilgang til beskyttede endepunkter."
      >
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button
              title="/public"
              variant="success"
              onPress={handleCallPublic}
              disabled={loading}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="/protected"
              variant="primary"
              onPress={handleCallProtected}
              disabled={loading}
            />
          </View>
        </View>
      </Card>

      {result && (
        <View style={[
          styles.resultCard,
          result.success ? styles.resultSuccess : styles.resultError
        ]}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultEndpoint}>
              {result.endpoint} → {result.success ? '✓ OK' : '✗ Feilet'}
              {result.authenticated && ' (Autentisert)'}
            </Text>
          </View>
          
          {result.success && result.authenticated && (
            <Text style={styles.authBadge}>
              🔐 JWT-token validert av backend
            </Text>
          )}
          
          <ScrollView style={styles.resultBox}>
            <Text style={styles.resultText}>
              {result.success 
                ? JSON.stringify(result.data, null, 2)
                : result.error
              }
            </Text>
          </ScrollView>
        </View>
      )}

      <Card title="Token Status">
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tilgangstoken</Text>
          <Text style={[styles.detailValue, { color: COLORS.success }]}>
            ✓ Aktiv
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>Bearer (JWT)</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Utsteder</Text>
          <Text style={styles.detailValue}>Auth0</Text>
        </View>
      </Card>

      <Card title="Sammenligning">
        <View style={styles.comparisonTable}>
          <View style={styles.comparisonHeader}>
            <Text style={[styles.comparisonCell, styles.headerCell]}>Endpoint</Text>
            <Text style={[styles.comparisonCell, styles.headerCell]}>Før login</Text>
            <Text style={[styles.comparisonCell, styles.headerCell]}>Etter login</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>/public</Text>
            <Text style={[styles.comparisonCell, { color: COLORS.success }]}>✓ OK</Text>
            <Text style={[styles.comparisonCell, { color: COLORS.success }]}>✓ OK</Text>
          </View>
          <View style={styles.comparisonRow}>
            <Text style={styles.comparisonCell}>/protected</Text>
            <Text style={[styles.comparisonCell, { color: COLORS.danger }]}>✗ 401</Text>
            <Text style={[styles.comparisonCell, { color: COLORS.success }]}>✓ OK</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonWrapper: {
    flex: 1,
  },
  resultCard: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  resultSuccess: {
    backgroundColor: COLORS.successBg,
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  resultError: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  resultHeader: {
    marginBottom: SPACING.sm,
  },
  resultEndpoint: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  authBadge: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '500',
    marginBottom: SPACING.md,
  },
  resultBox: {
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
  comparisonTable: {
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray100,
  },
  comparisonRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  comparisonCell: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
  },
  headerCell: {
    fontWeight: '600',
    color: COLORS.gray900,
  },
});