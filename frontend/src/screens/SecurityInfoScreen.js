// frontend/src/screens/SecurityInfoScreen.js
// Educational screen explaining security concepts

import { View, Text, StyleSheet } from 'react-native';
import { Card, InfoBox, ScreenContainer } from '../components';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Security info screen
 */
export function SecurityInfoScreen() {
  return (
    <ScreenContainer
      title="🔐 Sikkerhet i denne appen"
      subtitle="Lær hvordan vi beskytter dine data"
    >
      <SecurityCard
        title="🔑 OAuth 2.0 og OpenID Connect"
        description="OAuth 2.0 er en standard for autorisasjon som lar deg logge inn uten å dele passordet ditt med appen. OpenID Connect legger til autentisering – hvem du er."
        diagram="Du → Auth0 → Verifisering → Token → App"
        benefits={[
          'Passordet ditt sendes aldri til appen',
          'Du kan bruke samme konto på flere tjenester',
          'Enkelt å trekke tilbake tilgang',
        ]}
      />

      <SecurityCard
        title="🎫 JWT (JSON Web Tokens)"
        description="En JWT er som et digitalt ID-kort. Den inneholder informasjon om deg og er signert slik at ingen kan forfalske den."
        code={`{
  "sub": "bruker-id",
  "name": "Ola Nordmann",
  "exp": 1234567890
}`}
        benefits={[
          'Stateless – serveren trenger ikke lagre sesjoner',
          'Signert med kryptografiske nøkler',
          'Utløper automatisk (exp = expiration)',
        ]}
      />

      <SecurityCard
        title="🔐 MFA (Multi-Factor Authentication)"
        description="MFA krever at du beviser identiteten din på flere måter – noe du vet (passord) og noe du har (telefon)."
        diagram={`Faktor 1: Passord (noe du vet)
Faktor 2: Engangskode (noe du har)`}
        benefits={[
          'Selv om passordet lekker, er kontoen trygg',
          'TOTP-koder er tidsbaserte og utløper etter 30 sek',
          'Google Authenticator lagrer hemmeligheten lokalt',
        ]}
      />

      <SecurityCard
        title="🔒 TLS/HTTPS og kryptering"
        description="TLS (Transport Layer Security) krypterer all kommunikasjon mellom din enhet og serveren."
        diagram={`Din enhet ←🔒→ Azure server
(All trafikk er kryptert)`}
        benefits={[
          'Ingen kan avlytte kommunikasjonen',
          'Sertifikater bekrefter serverens identitet',
          'Diffie-Hellman utveksler nøkler sikkert',
        ]}
      />

      <SecurityCard
        title="🧂 Hashing og Salting"
        description={'Passordet ditt lagres aldri i klartekst. Det "hashes" – en enveisfunksjon som ikke kan reverseres.'}
        code={`Passord: "hemmelig123"
Salt: "x7$kL9"
Hash: "a4f2c8e1b3d5..."`}
        benefits={[
          'Selv Auth0 vet ikke passordet ditt',
          'Salt gjør hvert hash unikt',
          'Beskytter mot rainbow table-angrep',
        ]}
      />

      <SecurityCard
        title="🔑 Public/Private Key"
        description="Asymmetrisk kryptering bruker to nøkler – en offentlig for kryptering/verifisering og en privat for dekryptering/signering."
        diagram={`Auth0: Signerer JWT med privat nøkkel
Backend: Verifiserer med offentlig nøkkel`}
        benefits={[
          'Privat nøkkel forlater aldri Auth0',
          'Hvem som helst kan verifisere, bare Auth0 kan signere',
          'RS256-algoritmen brukes for JWT',
        ]}
      />

      <SecurityCard
        title="🤝 Delegert tilgang (Fullmakt)"
        description="Delegert tilgang lar en person handle på vegne av en annen. Vanlig i forsikring når familie hjelper hverandre."
        diagram={`Mor (gir fullmakt) → Datter (mottar)
Datter kan nå se mors forsikringer`}
        benefits={[
          'Familiemedlemmer kan hjelpe hverandre',
          'Regnskapsførere kan se bedriftsforsikringer',
          'Fullmakt kan trekkes tilbake når som helst',
        ]}
      />

      <SecurityCard
        title="🔐 Step-up Authentication"
        description={'Noen handlinger krever sterkere autentisering enn vanlig navigering. Dette kalles "step-up" – du må bevise identiteten din på nytt for sensitive operasjoner.'}
        diagram={`Vanlig: Se forsikringer ✓
Step-up: Signere avtale → Krever BankID`}
        benefits={[
          'Beskytter mot uautoriserte endringer',
          'Balanserer sikkerhet og brukervennlighet',
          'Gjensidige bruker BankID for dette',
        ]}
      />

      <SecurityCard
        title="🔄 SSO (Single Sign-On)"
        description="Med SSO logger du inn én gang og får tilgang til flere tjenester uten å logge inn på nytt."
        diagram={`Login → Gjensidige.no
      → Gjensidige App
      → Min Pensjon
(Samme sesjon for alle)`}
        benefits={[
          'Bedre brukeropplevelse',
          'Færre passord å huske',
          'Sentralisert tilgangskontroll',
        ]}
      />

      <SecurityCard
        title="🏦 BankID i Norge"
        description="BankID er Norges nasjonale eID-løsning, brukt av banker, forsikringsselskaper og offentlige tjenester."
        diagram={`BankID = Autentisering + Signering
Sikkerhetsnivå: Høyt (juridisk bindende)`}
        benefits={[
          'Over 4,5 millioner brukere i Norge',
          'Juridisk gyldig signatur',
          'Gjensidige bruker BankID for login og signering',
        ]}
      />

      <Card title="📜 GDPR og personvern">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Dine rettigheter:</Text>
        </Text>
        <Text style={styles.benefitText}>
          ✓ Rett til innsyn – se alle data vi har om deg{'\n'}
          ✓ Rett til retting – korrigere feil informasjon{'\n'}
          ✓ Rett til sletting – "retten til å bli glemt"{'\n'}
          ✓ Rett til dataportabilitet – få ut dine data{'\n'}
          ✓ Rett til å trekke samtykke – når som helst
        </Text>
      </Card>

      <InfoBox>
        Denne appen demonstrerer moderne sikkerhetspraksis for
        Customer Identity and Access Management (CIAM).
      </InfoBox>
    </ScreenContainer>
  );
}

function SecurityCard({ title, description, diagram, code, benefits }) {
  return (
    <Card title={title}>
      <Text style={styles.conceptText}>
        <Text style={styles.bold}>Hva er det?</Text>
        {'\n'}
        {description}
      </Text>

      {diagram && (
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>{diagram}</Text>
        </View>
      )}

      {code && (
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{code}</Text>
        </View>
      )}

      {benefits && (
        <Text style={styles.benefitText}>
          {benefits.map((b) => `✓ ${b}`).join('\n')}
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  conceptText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  bold: {
    fontWeight: '600',
    color: COLORS.gray900,
  },
  diagram: {
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  diagramText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  codeBlock: {
    backgroundColor: COLORS.gray900,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  codeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.successBg,
    fontFamily: 'monospace',
  },
  benefitText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    lineHeight: 22,
  },
});
