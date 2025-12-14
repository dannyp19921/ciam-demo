// frontend/src/screens/ConsentScreen.js
// GDPR consent collection screen shown after first login

import { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Button, Card, InfoBox, ScreenContainer } from '../components';
import { COLORS, SPACING, FONT_SIZES } from '../styles/theme';

/**
 * Consent screen component
 */
export function ConsentScreen({ user, onAccept }) {
  const [consents, setConsents] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    thirdParty: false,
  });

  const handleToggle = (key) => {
    if (key === 'necessary') return;
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
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
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.logo}>🔐</Text>
        <Text style={styles.title}>Personvern og samtykke</Text>
        <Text style={styles.subtitle}>Velkommen, {user?.name || user?.email}!</Text>
        <Text style={styles.description}>
          For å gi deg best mulig opplevelse trenger vi ditt samtykke.
          Du kan endre disse valgene når som helst i profilen din.
        </Text>
      </View>

      <ConsentCard
        title="📋 Nødvendige cookies"
        description="Disse er nødvendige for at tjenesten skal fungere, inkludert innlogging og sikkerhet. Kan ikke deaktiveres."
        label="Nødvendige"
        value={consents.necessary}
        disabled={true}
      />

      <ConsentCard
        title="📊 Analysecookies"
        description="Hjelper oss å forstå hvordan du bruker tjenesten, slik at vi kan forbedre den. Data er anonymisert."
        label="Tillat analyse"
        value={consents.analytics}
        onToggle={() => handleToggle('analytics')}
      />

      <ConsentCard
        title="📧 Markedsføring"
        description="Lar oss sende deg relevante tilbud og informasjon om våre produkter via e-post og SMS."
        label="Tillat markedsføring"
        value={consents.marketing}
        onToggle={() => handleToggle('marketing')}
      />

      <ConsentCard
        title="🤝 Tredjeparter"
        description="Deling av data med våre partnere for å gi deg bedre tilbud på forsikring og relaterte tjenester."
        label="Tillat deling"
        value={consents.thirdParty}
        onToggle={() => handleToggle('thirdParty')}
      />

      <InfoBox>
        Ved å fortsette godtar du våre vilkår for bruk og personvernerklæring.
        Du kan når som helst trekke tilbake samtykke i profilinnstillingene.
        Les mer om dine rettigheter under GDPR.
      </InfoBox>

      <View style={styles.buttonContainer}>
        <Button title="Godta alle" variant="primary" onPress={handleAcceptAll} />
        <View style={styles.buttonSpacer} />
        <Button
          title="Godta valgte og fortsett"
          variant="success"
          onPress={handleAcceptSelected}
        />
      </View>
    </ScreenContainer>
  );
}

function ConsentCard({ title, description, label, value, onToggle, disabled = false }) {
  return (
    <Card title={title}>
      <Text style={styles.consentDescription}>{description}</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: COLORS.gray200, true: COLORS.success }}
          thumbColor={COLORS.white}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  buttonContainer: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  buttonSpacer: {
    height: SPACING.sm,
  },
});
