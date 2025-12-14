// App.js

import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  LoginScreen, 
  HomeScreen, 
  ProfileScreen, 
  ApiTestScreen,
  ConsentScreen,
  SecurityInfoScreen,
  DelegationScreen
} from './src/screens';
import { BottomNav, ProfileSwitcher } from './src/components';
import { AUTH0_CONFIG } from './src/constants/config';
import { COLORS } from './src/styles/theme';
import { getAvailableProfiles } from './src/services/userData';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

export default function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [consents, setConsents] = useState(null);
  
  // Customer type selected BEFORE login
  const [customerType, setCustomerType] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const discovery = AuthSession.useAutoDiscovery(`https://${AUTH0_CONFIG.domain}`);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CONFIG.clientId,
      redirectUri,
      responseType: 'code',
      scopes: ['openid', 'profile', 'email'],
      prompt: 'login',
      extraParams: { audience: AUTH0_CONFIG.audience },
    },
    discovery
  );

  useEffect(() => {
    checkExistingData();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      exchangeCodeForToken(response.params.code);
    }
  }, [response]);

  const checkExistingData = async () => {
    try {
      const storedConsent = await AsyncStorage.getItem('userConsent');
      if (storedConsent) {
        setConsents(JSON.parse(storedConsent));
        setHasConsented(true);
      }
      // Note: We don't restore customerType here because user should choose each session
    } catch (error) {
      console.log('No existing data found');
    }
  };

  const exchangeCodeForToken = async (code) => {
    setLoading(true);
    try {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: AUTH0_CONFIG.clientId,
          code,
          redirectUri,
          extraParams: { code_verifier: request?.codeVerifier },
        },
        discovery
      );

      setAccessToken(tokenResponse.accessToken);

      const userResponse = await fetch(`https://${AUTH0_CONFIG.domain}/userinfo`, {
        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
      });
      const userData = await userResponse.json();
      setUser(userData);
      
      // Set default active profile based on customer type
      if (customerType) {
        const profiles = getAvailableProfiles(userData.sub, customerType);
        setActiveProfile(profiles[0]);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    setLoading(false);
  };

  const handleLogin = () => promptAsync();

  const handleLogout = async () => {
    setUser(null);
    setAccessToken(null);
    setActiveTab('home');
    setHasConsented(false);
    setConsents(null);
    setCustomerType(null);
    setActiveProfile(null);
    try {
      await AsyncStorage.removeItem('userConsent');
    } catch (error) {
      console.log('Error clearing data');
    }
  };

  const handleConsent = async (userConsents) => {
    try {
      await AsyncStorage.setItem('userConsent', JSON.stringify(userConsents));
      setConsents(userConsents);
      setHasConsented(true);
    } catch (error) {
      console.log('Error saving consent');
      setHasConsented(true);
    }
  };

  const handleDeleteAccount = async () => {
    await handleLogout();
  };

  const handleConsentChange = async (key) => {
    const updatedConsents = {
      ...consents,
      [key]: !consents[key],
    };
    try {
      await AsyncStorage.setItem('userConsent', JSON.stringify(updatedConsents));
      setConsents(updatedConsents);
    } catch (error) {
      console.log('Error updating consent');
    }
  };

  const handleCustomerTypeSelect = (type) => {
    setCustomerType(type);
  };

  const handleProfileSelect = (profile) => {
    setActiveProfile(profile);
    setShowProfileSwitcher(false);
  };

  const availableProfiles = user && customerType 
    ? getAvailableProfiles(user.sub, customerType) 
    : [];

  // Not logged in - show login with customer type selection
  if (!user) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        loading={loading}
        selectedCustomerType={customerType}
        onSelectCustomerType={handleCustomerTypeSelect}
      />
    );
  }

  // Logged in but hasn't consented
  if (!hasConsented) {
    return <ConsentScreen user={user} onAccept={handleConsent} />;
  }

  // Fully logged in and consented
  return (
    <View style={styles.container}>
      {activeTab === 'home' && (
        <HomeScreen 
          user={user} 
          customerType={customerType}
          activeProfile={activeProfile}
          onOpenProfileSwitcher={() => setShowProfileSwitcher(true)}
        />
      )}
      {activeTab === 'delegation' && <DelegationScreen user={user} />}
      {activeTab === 'api' && <ApiTestScreen accessToken={accessToken} />}
      {activeTab === 'security' && <SecurityInfoScreen />}
      {activeTab === 'profile' && (
        <ProfileScreen 
          user={user} 
          consents={consents}
          customerType={customerType}
          onLogout={handleLogout} 
          onDeleteAccount={handleDeleteAccount}
          onConsentChange={handleConsentChange}
        />
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <ProfileSwitcher
        visible={showProfileSwitcher}
        profiles={availableProfiles}
        activeProfileId={activeProfile?.id}
        onSelectProfile={handleProfileSelect}
        onClose={() => setShowProfileSwitcher(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
});