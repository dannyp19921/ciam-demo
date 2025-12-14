// frontend/src/screens/ProfileScreen.js
// User profile screen with GDPR features

import { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, Pressable, Switch, ScrollView, Dimensions } from 'react-native';
import { Card, Button, DetailRow, ScreenContainer } from '../components';
import { generateUserProfile, generateUserInsurances } from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../styles/theme';

/**
 * Profile screen component
 */
export function ProfileScreen({ user, consents, onLogout, onDeleteAccount, onConsentChange }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

  const profile = generateUserProfile(user);
  const insurances = generateUserInsurances(user?.sub);

  const handleConsentChange = (key) => {
    if (onConsentChange) {
      onConsentChange(key);
    }
  };

  if (!profile) {
    return (
      <ScreenContainer>
        <Text>Laster profil...</Text>
      </ScreenContainer>
    );
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    onDeleteAccount();
  };

  const getAllUserData = () => ({
    profile,
    insurances,
    consents,
    exportedAt: new Date().toISOString(),
  });

  return (
    <ScreenContainer>
      <ProfileHeader profile={profile} />

      <Card title="👤 Personlig informasjon">
        <DetailRow label="Fornavn" value={profile.firstName} />
        <DetailRow label="Etternavn" value={profile.lastName} />
        <DetailRow label="Fødselsdato" value={profile.birthDate} noBorder />
      </Card>

      <Card title="📞 Kontaktinformasjon">
        <DetailRow label="E-post" value={profile.email} />
        <DetailRow
          label="E-post verifisert"
          value={profile.emailVerified ? '✓ Ja' : '✗ Nei'}
          valueColor={profile.emailVerified ? COLORS.success : COLORS.danger}
        />
        <DetailRow label="Telefon" value={profile.phone} noBorder />
      </Card>

      <Card title="🏠 Adresse">
        <DetailRow label="Gate" value={profile.address.street} />
        <DetailRow label="Postnummer" value={profile.address.postalCode} />
        <DetailRow label="By" value={profile.address.city} />
        <DetailRow label="Land" value={profile.address.country} noBorder />
      </Card>

      <Card title="📋 Mine samtykker">
        <DetailRow
          label="Nødvendige cookies"
          value="✓ Alltid på"
          valueColor={COLORS.success}
        />
        <ConsentToggle
          label="Analysecookies"
          value={consents?.analytics}
          onToggle={() => handleConsentChange('analytics')}
        />
        <ConsentToggle
          label="Markedsføring"
          value={consents?.marketing}
          onToggle={() => handleConsentChange('marketing')}
        />
        <ConsentToggle
          label="Tredjepartsdeling"
          value={consents?.thirdParty}
          onToggle={() => handleConsentChange('thirdParty')}
        />
        <Text style={styles.consentHint}>
          Trykk på bryterne for å endre dine samtykker
        </Text>
      </Card>

      <Card title="🔐 Sikkerhet">
        <DetailRow label="MFA aktivert" value="✓ Ja" valueColor={COLORS.success} />
        <DetailRow label="Innloggingsmetode" value="Auth0 (OAuth 2.0)" />
        <DetailRow label="Siste innlogging" value="Nå" noBorder />
      </Card>

      <Card title="🔒 Personvern (GDPR)">
        <Text style={styles.gdprText}>
          I henhold til GDPR har du rett til innsyn, retting, og sletting av dine data.
        </Text>

        <View style={styles.gdprButtons}>
          <GdprButton
            icon="📥"
            text="Last ned mine data"
            onPress={() => setShowDataModal(true)}
          />
          <GdprButton
            icon="🗑️"
            text="Slett min konto"
            variant="danger"
            onPress={() => setShowDeleteModal(true)}
          />
        </View>
      </Card>

      <Button title="Logg ut" variant="danger" onPress={onLogout} />

      <Text style={styles.footerText}>
        Bruker-ID: {profile.userId?.slice(0, 30)}...
      </Text>

      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />

      <DataExportModal
        visible={showDataModal}
        onClose={() => setShowDataModal(false)}
        data={getAllUserData()}
      />
    </ScreenContainer>
  );
}

function ProfileHeader({ profile }) {
  return (
    <View style={styles.profileCard}>
      {profile.picture ? (
        <Image source={{ uri: profile.picture }} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {profile.firstName[0]}{profile.lastName[0]}
          </Text>
        </View>
      )}
      <Text style={styles.profileName}>{profile.fullName}</Text>
      <Text style={styles.customerNumber}>{profile.customerNumber}</Text>

      <View style={[
        styles.customerBadge,
        profile.customerType === 'Premium' && styles.premiumBadge,
      ]}>
        <Text style={[
          styles.customerBadgeText,
          profile.customerType === 'Premium' && styles.premiumBadgeText,
        ]}>
          {profile.customerType === 'Premium' ? '⭐ Premium-kunde' : 'Standard-kunde'}
        </Text>
      </View>
    </View>
  );
}

function ConsentToggle({ label, value, onToggle }) {
  return (
    <View style={styles.consentRow}>
      <Text style={styles.consentLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.gray200, true: COLORS.success }}
        thumbColor={COLORS.white}
      />
    </View>
  );
}

function GdprButton({ icon, text, variant = 'default', onPress }) {
  const isDanger = variant === 'danger';

  return (
    <Pressable
      style={[styles.gdprButton, isDanger && styles.gdprButtonDanger]}
      onPress={onPress}
    >
      <Text style={styles.gdprButtonIcon}>{icon}</Text>
      <Text style={[styles.gdprButtonText, isDanger && styles.gdprButtonTextDanger]}>
        {text}
      </Text>
    </Pressable>
  );
}

function DeleteAccountModal({ visible, onClose, onConfirm }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>⚠️ Slett konto</Text>
          <Text style={styles.modalText}>
            Er du sikker på at du vil slette kontoen din? Dette vil:
          </Text>
          <Text style={styles.modalList}>
            • Slette alle dine personopplysninger{'\n'}
            • Fjerne alle dine forsikringsdata{'\n'}
            • Avslutte alle aktive forsikringer{'\n'}
            • Denne handlingen kan ikke angres
          </Text>
          <View style={styles.modalButtons}>
            <Pressable style={styles.modalButtonCancel} onPress={onClose}>
              <Text style={styles.modalButtonCancelText}>Avbryt</Text>
            </Pressable>
            <Pressable style={styles.modalButtonDelete} onPress={onConfirm}>
              <Text style={styles.modalButtonDeleteText}>Ja, slett kontoen</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DataExportModal({ visible, onClose, data }) {
  const screenHeight = Dimensions.get('window').height;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContentLarge}>
          <Text style={styles.modalTitle}>📥 Mine data</Text>
          <Text style={styles.modalText}>
            Her er alle data vi har lagret om deg (GDPR Art. 15):
          </Text>
          <ScrollView 
            style={[styles.dataPreview, { maxHeight: screenHeight * 0.5 }]} 
            nestedScrollEnabled={true}
          >
            <Text style={styles.dataText}>
              {JSON.stringify(data, null, 2)}
            </Text>
          </ScrollView>
          <Pressable style={styles.modalButtonClose} onPress={onClose}>
            <Text style={styles.modalButtonCloseText}>Lukk</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: SPACING.lg,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  customerNumber: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginTop: SPACING.xs,
  },
  customerBadge: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.full,
  },
  premiumBadge: {
    backgroundColor: COLORS.warningBg,
  },
  customerBadgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  premiumBadgeText: {
    color: '#b45309',
  },
  consentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  consentLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
  },
  consentHint: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    fontStyle: 'italic',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  gdprText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  gdprButtons: {
    gap: SPACING.md,
  },
  gdprButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  gdprButtonDanger: {
    backgroundColor: COLORS.dangerBg,
    borderColor: '#fecaca',
  },
  gdprButtonIcon: {
    fontSize: 20,
    marginRight: SPACING.md,
  },
  gdprButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray700,
  },
  gdprButtonTextDanger: {
    color: COLORS.danger,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
  },
  modalContentLarge: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '95%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray900,
    marginBottom: SPACING.md,
  },
  modalText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.md,
  },
  modalList: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButtonCancel: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonCancelText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray700,
  },
  modalButtonDelete: {
    flex: 1,
    padding: SPACING.md,
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonDeleteText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  modalButtonClose: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  modalButtonCloseText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  dataPreview: {
    backgroundColor: COLORS.gray900,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  dataText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'monospace',
    color: COLORS.successBg,
    lineHeight: 18,
  },
});
