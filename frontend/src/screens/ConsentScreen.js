// src/screens/ConsentScreen.js

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { Button, Card } from '../components';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function ConsentScreen({ user, onAccept }) {
  const [consents, setConsents] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    thirdParty: false,
  });

  const handleToggle = (key) => {
    if (key === 'necessary') return; // Can't disable necessary
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAcceptAll = () => {
    setConsents({
      necessary: true,
      analytics: true,
      marketing: true,
      thirdParty: true,
    });
  };

  const handleAcceptSelected = () => {
    onAccept(consents);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🔐</Text>
        <Text style={styles.title}>Personvern og samtykke</Text>
        <Text style={styles.subtitle}>
          Velkommen, {user?.name || user?.email}!
        </Text>
        <Text style={styles.description}>
          For å gi deg best mulig opplevelse trenger vi ditt samtykke. 
          Du kan endre disse valgene når som helst i profilen din.
        </Text>
      </View>

      <Card title="📋 Nødvendige cookies">
        <Text style={styles.consentDescription}>
          Disse er nødvendige for at tjenesten skal fungere, inkludert 
          innlogging og sikkerhet. Kan ikke deaktiveres.
        </Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Nødvendige</Text>
          <Switch
            value={consents.necessary}
            disabled={true}
            trackColor={{ true: COLORS.success }}
          />
        </View>
      </Card>

      <Card title="📊 Analysecookies">
        <Text style={styles.consentDescription}>
          Hjelper oss å forstå hvordan du bruker tjenesten, slik at vi 
          kan forbedre den. Data er anonymisert.
        </Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tillat analyse</Text>
          <Switch
            value={consents.analytics}
            onValueChange={() => handleToggle('analytics')}
            trackColor={{ false: COLORS.gray200, true: COLORS.success }}
            thumbColor={COLORS.white}
          />
        </View>
      </Card>

      <Card title="📧 Markedsføring">
        <Text style={styles.consentDescription}>
          Lar oss sende deg relevante tilbud og informasjon om våre 
          produkter via e-post og SMS.
        </Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tillat markedsføring</Text>
          <Switch
            value={consents.marketing}
            onValueChange={() => handleToggle('marketing')}
            trackColor={{ false: COLORS.gray200, true: COLORS.success }}
            thumbColor={COLORS.white}
          />
        </View>
      </Card>

      <Card title="🤝 Tredjeparter">
        <Text style={styles.consentDescription}>
          Deling av data med våre partnere for å gi deg bedre tilbud 
          på forsikring og relaterte tjenester.
        </Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Tillat deling</Text>
          <Switch
            value={consents.thirdParty}
            onValueChange={() => handleToggle('thirdParty')}
            trackColor={{ false: COLORS.gray200, true: COLORS.success }}
            thumbColor={COLORS.white}
          />
        </View>
      </Card>

      <View style={styles.legalSection}>
        <Text style={styles.legalText}>
          Ved å fortsette godtar du våre{' '}
          <Text style={styles.link}>vilkår for bruk</Text> og{' '}
          <Text style={styles.link}>personvernerklæring</Text>.
        </Text>
        <Text style={styles.legalText}>
          Du kan når som helst trekke tilbake samtykke i profilinnstillingene.
          Les mer om dine rettigheter under GDPR.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Godta alle"
          variant="primary"
          onPress={handleAcceptAll}
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Godta valgte og fortsett"
          variant="success"
          onPress={handleAcceptSelected}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: COLORS.gray100,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 20,
  },
  consentDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  switchLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.gray900,
  },
  legalSection: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  legalText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  buttonSpacer: {
    height: SPACING.sm,
  },
});