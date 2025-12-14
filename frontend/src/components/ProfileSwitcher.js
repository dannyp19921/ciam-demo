// frontend/src/components/ProfileSwitcher.js
// Modal for switching between user profiles and delegations

import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { InfoBox } from './InfoBox';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

/**
 * Profile switcher modal
 * Allows switching between own profile and delegated profiles
 */
export function ProfileSwitcher({
  visible,
  profiles,
  activeProfileId,
  onSelectProfile,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Header onClose={onClose} />

          <Text style={styles.description}>
            Velg hvilken profil du vil se og administrere forsikringer for.
          </Text>

          <ScrollView style={styles.profileList}>
            {profiles.map((profile) => (
              <ProfileItem
                key={profile.id}
                profile={profile}
                isActive={activeProfileId === profile.id}
                onSelect={() => onSelectProfile(profile)}
              />
            ))}
          </ScrollView>

          <InfoBox title="💡 Om profilbytte">
            Når du bytter profil, ser du forsikringene til den valgte
            personen eller bedriften. Du handler på deres vegne.
          </InfoBox>
        </View>
      </View>
    </Modal>
  );
}

/**
 * Modal header with close button
 */
function Header({ onClose }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Bytt profil</Text>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✕</Text>
      </Pressable>
    </View>
  );
}

/**
 * Individual profile item
 */
function ProfileItem({ profile, isActive, onSelect }) {
  return (
    <Pressable
      style={[styles.profileItem, isActive && styles.profileItemActive]}
      onPress={onSelect}
    >
      <Text style={styles.profileIcon}>{profile.icon}</Text>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileSubtitle}>{profile.subtitle}</Text>
      </View>
      {isActive && (
        <View style={styles.activeBadge}>
          <Text style={styles.activeBadgeText}>Aktiv</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.gray900,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.gray500,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginBottom: SPACING.lg,
  },
  profileList: {
    maxHeight: 300,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileItemActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryBg,
  },
  profileIcon: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  profileSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    marginTop: 2,
  },
  activeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  activeBadgeText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
});
