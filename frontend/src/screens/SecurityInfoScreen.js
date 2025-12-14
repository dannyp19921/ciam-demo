// src/screens/SecurityInfoScreen.js

import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../components';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function SecurityInfoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Sikkerhet i denne appen</Text>
        <Text style={styles.subtitle}>
          Lær hvordan vi beskytter dine data
        </Text>
      </View>

      <Card title="🔑 OAuth 2.0 og OpenID Connect">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          OAuth 2.0 er en standard for autorisasjon som lar deg logge inn 
          uten å dele passordet ditt med appen. OpenID Connect legger til 
          autentisering – hvem du er.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Du → Auth0 → Verifisering → Token → App
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Passordet ditt sendes aldri til appen{'\n'}
          ✓ Du kan bruke samme konto på flere tjenester{'\n'}
          ✓ Enkelt å trekke tilbake tilgang
        </Text>
      </Card>

      <Card title="🎫 JWT (JSON Web Tokens)">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          En JWT er som et digitalt ID-kort. Den inneholder informasjon 
          om deg og er signert slik at ingen kan forfalske den.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            {'{'}{'\n'}
            {'  '}"sub": "bruker-id",{'\n'}
            {'  '}"name": "Ola Nordmann",{'\n'}
            {'  '}"exp": 1234567890{'\n'}
            {'}'}
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Stateless – serveren trenger ikke lagre sesjoner{'\n'}
          ✓ Signert med kryptografiske nøkler{'\n'}
          ✓ Utløper automatisk (exp = expiration)
        </Text>
      </Card>

      <Card title="🔐 MFA (Multi-Factor Authentication)">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          MFA krever at du beviser identiteten din på flere måter – 
          noe du vet (passord) og noe du har (telefon).
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Faktor 1: Passord (noe du vet){'\n'}
            Faktor 2: Engangskode (noe du har)
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Selv om passordet lekker, er kontoen trygg{'\n'}
          ✓ TOTP-koder er tidsbaserte og utløper etter 30 sek{'\n'}
          ✓ Google Authenticator lagrer hemmeligheten lokalt
        </Text>
      </Card>

      <Card title="🔒 TLS/HTTPS og kryptering">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          TLS (Transport Layer Security) krypterer all kommunikasjon 
          mellom din enhet og serveren.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Din enhet ←🔒→ Azure server{'\n'}
            (All trafikk er kryptert)
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Ingen kan avlytte kommunikasjonen{'\n'}
          ✓ Sertifikater bekrefter serverens identitet{'\n'}
          ✓ Diffie-Hellman utveksler nøkler sikkert
        </Text>
      </Card>

      <Card title="🧂 Hashing og Salting">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          Passordet ditt lagres aldri i klartekst. Det "hashes" – 
          en enveisfunksjon som ikke kan reverseres.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>
            Passord: "hemmelig123"{'\n'}
            Salt: "x7$kL9"{'\n'}
            Hash: "a4f2c8e1b3d5..."
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Selv Auth0 vet ikke passordet ditt{'\n'}
          ✓ Salt gjør hvert hash unikt{'\n'}
          ✓ Beskytter mot rainbow table-angrep
        </Text>
      </Card>

      <Card title="🔑 Public/Private Key">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          Asymmetrisk kryptering bruker to nøkler – en offentlig for 
          kryptering/verifisering og en privat for dekryptering/signering.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Auth0: Signerer JWT med privat nøkkel{'\n'}
            Backend: Verifiserer med offentlig nøkkel
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Privat nøkkel forlater aldri Auth0{'\n'}
          ✓ Hvem som helst kan verifisere, bare Auth0 kan signere{'\n'}
          ✓ RS256-algoritmen brukes for JWT
        </Text>
      </Card>

      <Card title="🤝 Delegert tilgang (Fullmakt)">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          Delegert tilgang lar en person handle på vegne av en annen. 
          Vanlig i forsikring når familie hjelper hverandre.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Mor (gir fullmakt) → Datter (mottar){'\n'}
            Datter kan nå se mors forsikringer
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Familiemedlemmer kan hjelpe hverandre{'\n'}
          ✓ Regnskapsførere kan se bedriftsforsikringer{'\n'}
          ✓ Fullmakt kan trekkes tilbake når som helst
        </Text>
      </Card>

      <Card title="🔐 Step-up Authentication">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          Noen handlinger krever sterkere autentisering enn vanlig 
          navigering. Dette kalles "step-up" – du må bevise identiteten 
          din på nytt for sensitive operasjoner.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Vanlig: Se forsikringer ✓{'\n'}
            Step-up: Signere avtale → Krever BankID
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Beskytter mot uautoriserte endringer{'\n'}
          ✓ Balanserer sikkerhet og brukervennlighet{'\n'}
          ✓ Gjensidige bruker BankID for dette
        </Text>
      </Card>

      <Card title="🔄 SSO (Single Sign-On)">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          Med SSO logger du inn én gang og får tilgang til flere 
          tjenester uten å logge inn på nytt.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            Login → Gjensidige.no{'\n'}
                  → Gjensidige App{'\n'}
                  → Min Pensjon{'\n'}
            (Samme sesjon for alle)
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Bedre brukeropplevelse{'\n'}
          ✓ Færre passord å huske{'\n'}
          ✓ Sentralisert tilgangskontroll
        </Text>
      </Card>

      <Card title="🏦 BankID i Norge">
        <Text style={styles.conceptText}>
          <Text style={styles.bold}>Hva er det?</Text>{'\n'}
          BankID er Norges nasjonale eID-løsning, brukt av banker, 
          forsikringsselskaper og offentlige tjenester.
        </Text>
        <View style={styles.diagram}>
          <Text style={styles.diagramText}>
            BankID = Autentisering + Signering{'\n'}
            Sikkerhetsnivå: Høyt (juridisk bindende)
          </Text>
        </View>
        <Text style={styles.benefitText}>
          ✓ Over 4,5 millioner brukere i Norge{'\n'}
          ✓ Juridisk gyldig signatur{'\n'}
          ✓ Gjensidige bruker BankID for login og signering
        </Text>
      </Card>

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

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Denne appen demonstrerer moderne sikkerhetspraksis for 
          Customer Identity and Access Management (CIAM).
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray500,
    marginTop: SPACING.xs,
  },
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
  footer: {
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
});