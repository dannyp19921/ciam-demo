// src/screens/ProfileScreen.js

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, Pressable, Switch } from 'react-native';
import { Card, Button } from '../components';
import { generateUserProfile, generateUserInsurances } from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

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
      <View style={styles.container}>
        <Text>Laster profil...</Text>
      </View>
    );
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    onDeleteAccount();
  };

  const getAllUserData = () => {
    return {
      profile,
      insurances,
      consents,
      exportedAt: new Date().toISOString(),
    };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Header */}
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
          profile.customerType === 'Premium' && styles.premiumBadge
        ]}>
          <Text style={[
            styles.customerBadgeText,
            profile.customerType === 'Premium' && styles.premiumBadgeText
          ]}>
            {profile.customerType === 'Premium' ? '⭐ Premium-kunde' : 'Standard-kunde'}
          </Text>
        </View>
      </View>

      {/* Personal Information */}
      <Card title="👤 Personlig informasjon">
        <DetailRow label="Fornavn" value={profile.firstName} />
        <DetailRow label="Etternavn" value={profile.lastName} />
        <DetailRow label="Fødselsdato" value={profile.birthDate} />
      </Card>

      {/* Contact Information */}
      <Card title="📞 Kontaktinformasjon">
        <DetailRow label="E-post" value={profile.email} />
        <DetailRow 
          label="E-post verifisert" 
          value={profile.emailVerified ? '✓ Ja' : '✗ Nei'} 
          valueColor={profile.emailVerified ? COLORS.success : COLORS.danger}
        />
        <DetailRow label="Telefon" value={profile.phone} />
      </Card>

      {/* Address */}
      <Card title="🏠 Adresse">
        <DetailRow label="Gate" value={profile.address.street} />
        <DetailRow label="Postnummer" value={profile.address.postalCode} />
        <DetailRow label="By" value={profile.address.city} />
        <DetailRow label="Land" value={profile.address.country} />
      </Card>

      {/* Consent Status */}
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

      {/* Security */}
      <Card title="🔐 Sikkerhet">
        <DetailRow label="MFA aktivert" value="✓ Ja" valueColor={COLORS.success} />
        <DetailRow label="Innloggingsmetode" value="Auth0 (OAuth 2.0)" />
        <DetailRow label="Siste innlogging" value="Nå" />
      </Card>

      {/* GDPR Actions */}
      <Card title="🔒 Personvern (GDPR)">
        <Text style={styles.gdprText}>
          I henhold til GDPR har du rett til innsyn, retting, og sletting av dine data.
        </Text>
        
        <View style={styles.gdprButtons}>
          <Pressable 
            style={styles.gdprButton}
            onPress={() => setShowDataModal(true)}
          >
            <Text style={styles.gdprButtonIcon}>📥</Text>
            <Text style={styles.gdprButtonText}>Last ned mine data</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.gdprButton, styles.gdprButtonDanger]}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.gdprButtonIcon}>🗑️</Text>
            <Text style={[styles.gdprButtonText, styles.gdprButtonTextDanger]}>
              Slett min konto
            </Text>
          </Pressable>
        </View>
      </Card>

      <Button title="Logg ut" variant="danger" onPress={onLogout} />
      
      <Text style={styles.footerText}>
        Bruker-ID: {profile.userId?.slice(0, 30)}...
      </Text>

      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
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
              <Pressable 
                style={styles.modalButtonCancel}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Avbryt</Text>
              </Pressable>
              <Pressable 
                style={styles.modalButtonDelete}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalButtonDeleteText}>Ja, slett kontoen</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Download Data Modal */}
      <Modal
        visible={showDataModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDataModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📥 Mine data</Text>
            <Text style={styles.modalText}>
              Her er alle data vi har lagret om deg (GDPR Art. 15):
            </Text>
            <ScrollView style={styles.dataPreview}>
              <Text style={styles.dataText}>
                {JSON.stringify(getAllUserData(), null, 2)}
              </Text>
            </ScrollView>
            <Pressable 
              style={styles.modalButtonClose}
              onPress={() => setShowDataModal(false)}
            >
              <Text style={styles.modalButtonCloseText}>Lukk</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
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

function DetailRow({ label, value, valueColor }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
    backgroundColor: '#fef3c7',
  },
  customerBadgeText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  premiumBadgeText: {
    color: '#b45309',
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
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray900,
    flex: 1,
    textAlign: 'right',
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
    backgroundColor: '#fef2f2',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 400,
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
    maxHeight: 300,
    marginBottom: SPACING.lg,
  },
  dataText: {
    fontSize: FONT_SIZES.xs,
    fontFamily: 'monospace',
    color: COLORS.successBg,
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
});