// frontend/src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AUTH0_CONFIG } from '../constants/config';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const getRedirectUri = () => {
  // Web
  if (Platform.OS === 'web') {
    return AuthSession.makeRedirectUri({ preferLocalhost: true });
  }
  
  // Expo Go
  if (Constants.appOwnership === 'expo') {
    return AuthSession.makeRedirectUri();
  }
  
  // Standalone APK
  return AuthSession.makeRedirectUri({ scheme: 'ciam-demo', path: 'auth' });
};

const redirectUri = getRedirectUri();
console.log('Using redirect URI:', redirectUri);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Warm up browser for faster auth
  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

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
    if (response?.type === 'success') {
      exchangeCodeForToken(response.params.code);
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Authentication failed');
      setIsLoading(false);
    }
  }, [response]);

  const exchangeCodeForToken = async (code) => {
    setIsLoading(true);
    setError(null);

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

      const userResponse = await fetch(
        `https://${AUTH0_CONFIG.domain}/userinfo`,
        { headers: { Authorization: `Bearer ${tokenResponse.accessToken}` } }
      );

      if (!userResponse.ok) throw new Error('Failed to fetch user info');

      const userData = await userResponse.json();
      setUser(userData);
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(() => {
    setError(null);
    // showInRecents keeps the browser in task switcher when you switch apps
    promptAsync({ showInRecents: true });
  }, [promptAsync]);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setError(null);
  }, []);

  const value = {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated: Boolean(user && accessToken),
    login,
    logout,
    isReady: Boolean(request),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export default AuthContext;
