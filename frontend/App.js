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
  SecurityInfoScreen 
} from './src/screens';
import { BottomNav } from './src/components';
import { AUTH0_CONFIG } from './src/constants/config';
import { COLORS } from './src/styles/theme';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = AuthSession.makeRedirectUri();

export default function App() {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [consents, setConsents] = useState(null);

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

  // Check for existing consent on app load
  useEffect(() => {
    checkExistingConsent();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      exchangeCodeForToken(response.params.code);
    }
  }, [response]);

  const checkExistingConsent = async () => {
    try {
      const storedConsent = await AsyncStorage.getItem('userConsent');
      if (storedConsent) {
        setConsents(JSON.parse(storedConsent));
        setHasConsented(true);
      }
    } catch (error) {
      console.log('No existing consent found');
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
      setUser(await userResponse.json());
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
    try {
      await AsyncStorage.removeItem('userConsent');
    } catch (error) {
      console.log('Error clearing consent');
    }
  };

  const handleConsent = async (userConsents) => {
    try {
      await AsyncStorage.setItem('userConsent', JSON.stringify(userConsents));
      setConsents(userConsents);
      setHasConsented(true);
    } catch (error) {
      console.log('Error saving consent');
      setHasConsented(true); // Continue anyway
    }
  };

  const handleDeleteAccount = async () => {
    // In production, this would call your backend to delete user data
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

  // Not logged in
  if (!user) {
    return <LoginScreen onLogin={handleLogin} loading={loading} />;
  }

  // Logged in but hasn't consented
  if (!hasConsented) {
    return <ConsentScreen user={user} onAccept={handleConsent} />;
  }

  // Fully logged in and consented
  return (
    <View style={styles.container}>
      {activeTab === 'home' && <HomeScreen user={user} />}
      {activeTab === 'profile' && (
        <ProfileScreen 
          user={user} 
          consents={consents}
          onLogout={handleLogout} 
          onDeleteAccount={handleDeleteAccount}
          onConsentChange={handleConsentChange}
        />
      )}
      {activeTab === 'api' && <ApiTestScreen accessToken={accessToken} />}
      {activeTab === 'security' && <SecurityInfoScreen />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray100,
  },
});