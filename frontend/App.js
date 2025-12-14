// frontend/App.js
// CIAM Demo - Main Application
// Responsibility: App orchestration, provider setup, and navigation
// All business logic has been moved to contexts and hooks

import React from 'react';
import { View, StyleSheet } from 'react-native';

// Contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { UserProvider, useUser } from './src/contexts/UserContext';
import { ConsentProvider, useConsent } from './src/contexts/ConsentContext';

// Screens
import {
  LoginScreen,
  HomeScreen,
  ProfileScreen,
  ApiTestScreen,
  ConsentScreen,
  SecurityInfoScreen,
  DelegationScreen,
} from './src/screens';

// Components
import { BottomNav, ProfileSwitcher } from './src/components';

// Styles
import { COLORS } from './src/styles/theme';

// ---------------------
// APP PROVIDERS
// ---------------------

/**
 * Wrapper that sets up all required providers
 */
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ConsentProvider>
        <AppWithAuth>{children}</AppWithAuth>
      </ConsentProvider>
    </AuthProvider>
  );
}

/**
 * Intermediate layer that gives UserProvider access to auth state
 */
function AppWithAuth({ children }) {
  const { user } = useAuth();
  
  return (
    <UserProvider userId={user?.sub}>
      {children}
    </UserProvider>
  );
}

// ---------------------
// MAIN APP
// ---------------------

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

// ---------------------
// APP CONTENT
// ---------------------

function AppContent() {
  // Auth context
  const { user, accessToken, isLoading, login, logout } = useAuth();
  
  // Consent context
  const { hasConsented, acceptConsents, consents, toggleConsent, resetConsentState } = useConsent();
  
  // User context
  const { 
    customerType, 
    selectCustomerType,
    activeProfile,
    availableProfiles,
    isProfileSwitcherVisible,
    openProfileSwitcher,
    closeProfileSwitcher,
    switchProfile,
    initializeDefaultProfile,
    resetUserState,
  } = useUser();

  // Navigation state
  const [activeTab, setActiveTab] = React.useState('home');

  // Initialize default profile when user logs in
  React.useEffect(() => {
    if (user && customerType && !activeProfile) {
      initializeDefaultProfile(user.sub, customerType);
    }
  }, [user, customerType, activeProfile, initializeDefaultProfile]);

  // ---------------------
  // HANDLERS
  // ---------------------

  const handleLogout = async () => {
    logout();
    resetConsentState();
    resetUserState();
    setActiveTab('home');
  };

  const handleDeleteAccount = async () => {
    // In production: call backend to delete data
    await handleLogout();
  };

  // ---------------------
  // RENDER LOGIC
  // ---------------------

  // Not logged in - show login with customer type selection
  if (!user) {
    return (
      <LoginScreen
        onLogin={login}
        loading={isLoading}
        selectedCustomerType={customerType}
        onSelectCustomerType={selectCustomerType}
      />
    );
  }

  // Logged in but not consented
  if (!hasConsented) {
    return <ConsentScreen user={user} onAccept={acceptConsents} />;
  }

  // Fully logged in and consented
  return (
    <View style={styles.container}>
      <ScreenContent
        activeTab={activeTab}
        user={user}
        accessToken={accessToken}
        customerType={customerType}
        activeProfile={activeProfile}
        consents={consents}
        onOpenProfileSwitcher={openProfileSwitcher}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onConsentChange={toggleConsent}
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      <ProfileSwitcher
        visible={isProfileSwitcherVisible}
        profiles={availableProfiles}
        activeProfileId={activeProfile?.id}
        onSelectProfile={switchProfile}
        onClose={closeProfileSwitcher}
      />
    </View>
  );
}

// ---------------------
// SCREEN CONTENT
// ---------------------

/**
 * Renders the correct screen based on active tab
 * Separated for better readability
 */
function ScreenContent({
  activeTab,
  user,
  accessToken,
  customerType,
  activeProfile,
  consents,
  onOpenProfileSwitcher,
  onLogout,
  onDeleteAccount,
  onConsentChange,
}) {
  switch (activeTab) {
    case 'home':
      return (
        <HomeScreen
          user={user}
          customerType={customerType}
          activeProfile={activeProfile}
          onOpenProfileSwitcher={onOpenProfileSwitcher}
        />
      );

    case 'delegation':
      return <DelegationScreen user={user} />;

    case 'api':
      return <ApiTestScreen accessToken={accessToken} />;

    case 'security':
      return <SecurityInfoScreen />;

    case 'profile':
      return (
        <ProfileScreen
          user={user}
          consents={consents}
          customerType={customerType}
          onLogout={onLogout}
          onDeleteAccount={onDeleteAccount}
          onConsentChange={onConsentChange}
        />
      );

    default:
      return null;
  }
}

// ---------------------
// STYLES
// ---------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
});
