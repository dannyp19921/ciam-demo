// src/screens/DelegationScreen.js

import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Card, Button } from '../components';
import { StepUpModal } from '../components/StepUpModal';
import { generateUserDelegations, getAccessLevelDescription, SENSITIVE_ACTIONS } from '../services/userData';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../styles/theme';

export function DelegationScreen({ user }) {
  const [stepUpVisible, setStepUpVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [completedActions, setCompletedActions] = useState([]);

  const delegations = generateUserDelegations(user?.sub);

  const handleActionPress = (action) => {
    if (action.requiresStepUp) {
      setSelectedAction(action);
      setStepUpVisible(true);
    } else {
      // Action doesn't require step-up, just mark as completed
      setCompletedActions([...completedActions, action.id]);
    }
  };

  const handleStepUpConfirm = () => {
    setCompletedActions([...completedActions, selectedAction.id]);
    setStepUpVisible(false);
    setSelectedAction(null);
  };

  const handleStepUpCancel = () => {
    setStepUpVisible(false);
    setSelectedAction(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🤝 Fullmakter</Text>
        <Text style={styles.subtitle}>
          Administrer hvem som har tilgang til dine forsikringer
        </Text>
      </View>

      {/* Explanation Card */}
      <Card title="Hva er fullmakt?">
        <Text style={styles.explanationText}>
          En fullmakt lar deg gi andre personer tilgang til å se eller administrere 
          dine forsikringer på dine vegne. Dette er nyttig for:
        </Text>
        <Text style={styles.useCaseText}>
          • <Text style={styles.bold}>Familie:</Text> Ektefelle eller barn kan hjelpe hverandre{'\n'}
          • <Text style={styles.bold}>Regnskapsfører:</Text> Kan se bedriftens forsikringer{'\n'}
          • <Text style={styles.bold}>Verge:</Text> Kan håndtere forsikringer for andre
        </Text>
      </Card>

      {/* Delegations Given */}
      <Card title="📤 Fullmakter du har gitt">
        {delegations.givenTo.length > 0 ? (
          delegations.givenTo.map((delegation) => (
            <View key={delegation.id} style={styles.delegationItem}>
              <View style={styles.delegationHeader}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarSmallText}>
                    {delegation.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.delegationInfo}>
                  <Text style={styles.delegationName}>{delegation.name}</Text>
                  <Text style={styles.delegationRelation}>{delegation.relationship}</Text>
                </View>
                <View style={[
                  styles.accessBadge,
                  delegation.accessLevel === 'full' && styles.accessBadgeFull
                ]}>
                  <Text style={styles.accessBadgeText}>
                    {delegation.accessLevel === 'full' ? 'Full' : 'Lese'}
                  </Text>
                </View>
              </View>
              <View style={styles.delegationDetails}>
                <Text style={styles.delegationDetailLabel}>Tilgang til:</Text>
                <Text style={styles.delegationDetailValue}>
                  {delegation.accessTypes.join(', ')}
                </Text>
              </View>
              <View style={styles.delegationDetails}>
                <Text style={styles.delegationDetailLabel}>Gyldig fra:</Text>
                <Text style={styles.delegationDetailValue}>
                  {delegation.grantedDate}
                  {delegation.expiresDate ? ` til ${delegation.expiresDate}` : ' (permanent)'}
                </Text>
              </View>
              <Pressable style={styles.revokeButton}>
                <Text style={styles.revokeButtonText}>Trekk tilbake</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Du har ikke gitt fullmakt til noen.
          </Text>
        )}
        
        <Pressable 
          style={styles.addButton}
          onPress={() => handleActionPress(SENSITIVE_ACTIONS.find(a => a.id === 'add_delegation'))}
        >
          <Text style={styles.addButtonText}>+ Gi fullmakt til noen</Text>
        </Pressable>
      </Card>

      {/* Delegations Received */}
      <Card title="📥 Fullmakter du har mottatt">
        {delegations.receivedFrom.length > 0 ? (
          delegations.receivedFrom.map((delegation) => (
            <View key={delegation.id} style={styles.delegationItem}>
              <View style={styles.delegationHeader}>
                <View style={[styles.avatarSmall, styles.avatarReceived]}>
                  <Text style={styles.avatarSmallText}>
                    {delegation.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.delegationInfo}>
                  <Text style={styles.delegationName}>{delegation.name}</Text>
                  <Text style={styles.delegationRelation}>{delegation.relationship}</Text>
                </View>
              </View>
              <Text style={styles.receivedNote}>
                Du kan se og administrere {delegation.name}s {delegation.accessTypes.join(' og ').toLowerCase()}
              </Text>
              <Pressable style={styles.switchProfileButton}>
                <Text style={styles.switchProfileButtonText}>Bytt til denne profilen →</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Du har ikke mottatt fullmakt fra noen.
          </Text>
        )}
      </Card>

      {/* Step-up Authentication Demo */}
      <Card title="🔐 Step-up Authentication Demo">
        <Text style={styles.stepUpExplanation}>
          Noen handlinger krever ekstra bekreftelse. Prøv å klikke på handlingene 
          nedenfor for å se hvordan Step-up Authentication fungerer.
        </Text>
        
        <View style={styles.actionsList}>
          {SENSITIVE_ACTIONS.map((action) => (
            <Pressable 
              key={action.id}
              style={[
                styles.actionItem,
                completedActions.includes(action.id) && styles.actionItemCompleted
              ]}
              onPress={() => handleActionPress(action)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <View style={styles.actionInfo}>
                <Text style={styles.actionName}>{action.name}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
              <View style={[
                styles.stepUpIndicator,
                action.requiresStepUp ? styles.stepUpRequired : styles.stepUpNotRequired
              ]}>
                <Text style={styles.stepUpIndicatorText}>
                  {action.requiresStepUp ? '🔒' : '✓'}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.stepUpRequired]} />
            <Text style={styles.legendText}>Krever step-up</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.stepUpNotRequired]} />
            <Text style={styles.legendText}>Vanlig tilgang</Text>
          </View>
        </View>
      </Card>

      {/* Gjensidige Context */}
      <Card title="💡 Slik gjør Gjensidige det">
        <Text style={styles.gjensidigText}>
          Gjensidige bruker <Text style={styles.bold}>BankID</Text> for step-up authentication:
        </Text>
        <Text style={styles.gjensidigList}>
          • Se forsikringer → Vanlig innlogging{'\n'}
          • Signere avtaler → Krever BankID{'\n'}
          • Endre kontaktinfo → Krever BankID{'\n'}
          • Gi fullmakt → Krever BankID
        </Text>
        <Text style={styles.gjensidigNote}>
          I denne demoen simulerer vi dette med en engangskode.
        </Text>
      </Card>

      <StepUpModal
        visible={stepUpVisible}
        action={selectedAction}
        onConfirm={handleStepUpConfirm}
        onCancel={handleStepUpCancel}
      />
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
  explanationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  useCaseText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
  },
  delegationItem: {
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  delegationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  avatarReceived: {
    backgroundColor: COLORS.success,
  },
  avatarSmallText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
  delegationInfo: {
    flex: 1,
  },
  delegationName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  delegationRelation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
  },
  accessBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.full,
  },
  accessBadgeFull: {
    backgroundColor: COLORS.successBg,
  },
  accessBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.success,
  },
  delegationDetails: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
  },
  delegationDetailLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    width: 80,
  },
  delegationDetailValue: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray700,
    flex: 1,
  },
  revokeButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: '#fef2f2',
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  revokeButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.danger,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray500,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
  addButton: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryBg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  receivedNote: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    marginTop: SPACING.sm,
  },
  switchProfileButton: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.success,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  switchProfileButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    fontWeight: '500',
  },
  stepUpExplanation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  actionsList: {
    gap: SPACING.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  actionItemCompleted: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  actionInfo: {
    flex: 1,
  },
  actionName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  actionDescription: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  stepUpIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepUpRequired: {
    backgroundColor: '#fef3c7',
  },
  stepUpNotRequired: {
    backgroundColor: COLORS.successBg,
  },
  stepUpIndicatorText: {
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
  },
  gjensidigText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray700,
    marginBottom: SPACING.sm,
  },
  gjensidigList: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray600,
    lineHeight: 22,
  },
  gjensidigNote: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray500,
    fontStyle: 'italic',
    marginTop: SPACING.md,
  },
});