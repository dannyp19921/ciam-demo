// frontend/src/screens/ApiTestScreen.js
// Screen for testing authenticated API calls

import { View, Text, StyleSheet } from 'react-native';
import { Card, Button, DetailRow, ApiResultBox, ScreenContainer } from '../components';
import { useApiTest } from '../hooks';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * API Test screen for authenticated users
 */
export function ApiTestScreen({ accessToken }) {
  const { result, isLoading, callPublic, callProtected } = useApiTest(accessToken);

  return (
    <ScreenContainer title="🔬 API Test">
      <Card
        title="Test API-tilgang"
        description="Nå som du er autentisert, har du tilgang til beskyttede endepunkter."
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

      <Card title="Token Status">
        <DetailRow label="Tilgangstoken" value="✓ Aktiv" valueColor={COLORS.success} />
        <DetailRow label="Type" value="Bearer (JWT)" />
        <DetailRow label="Utsteder" value="Auth0" noBorder />
      </Card>

      <Card title="Sammenligning">
        <ComparisonTable />
      </Card>
    </ScreenContainer>
  );
}

function ComparisonTable() {
  return (
    <View style={styles.comparisonTable}>
      <View style={styles.comparisonHeader}>
        <Text style={[styles.comparisonCell, styles.headerCell]}>Endpoint</Text>
        <Text style={[styles.comparisonCell, styles.headerCell]}>Før login</Text>
        <Text style={[styles.comparisonCell, styles.headerCell]}>Etter login</Text>
      </View>
      <ComparisonRow
        endpoint="/public"
        before={{ text: '✓ OK', color: COLORS.success }}
        after={{ text: '✓ OK', color: COLORS.success }}
      />
      <ComparisonRow
        endpoint="/protected"
        before={{ text: '✗ 401', color: COLORS.danger }}
        after={{ text: '✓ OK', color: COLORS.success }}
      />
    </View>
  );
}

function ComparisonRow({ endpoint, before, after }) {
  return (
    <View style={styles.comparisonRow}>
      <Text style={styles.comparisonCell}>{endpoint}</Text>
      <Text style={[styles.comparisonCell, { color: before.color }]}>{before.text}</Text>
      <Text style={[styles.comparisonCell, { color: after.color }]}>{after.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  buttonWrapper: {
    flex: 1,
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
