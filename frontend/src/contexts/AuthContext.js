// frontend/src/contexts/AuthContext.js
// Centralized authentication context
// Responsibility: OAuth flow, token management, login/logout
// Uses Auth0 with PKCE flow for secure mobile authentication

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { AUTH0_CONFIG } from '../constants/config';

// Complete any pending auth session
WebBrowser.maybeCompleteAuthSession();

// OAuth redirect URI
const redirectUri = AuthSession.makeRedirectUri();

// ---------------------
// CONTEXT DEFINITION
// ---------------------
const AuthContext = createContext(null);

// ---------------------
// PROVIDER COMPONENT
// ---------------------
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auth0 discovery document
  const discovery = AuthSession.useAutoDiscovery(`https://${AUTH0_CONFIG.domain}`);

  // OAuth request configuration
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

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      exchangeCodeForToken(response.params.code);
    } else if (response?.type === 'error') {
      setError(response.error?.message || 'Authentication failed');
      setIsLoading(false);
    }
  }, [response]);

  // ---------------------
  // AUTH FUNCTIONS
  // ---------------------

  /**
   * Exchange authorization code for access token
   */
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

      // Fetch user info from Auth0 userinfo endpoint
      const userResponse = await fetch(
        `https://${AUTH0_CONFIG.domain}/userinfo`,
        {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
        }
      );

      if (!userResponse.ok) {
        throw new Error('Failed to fetch user info');
      }

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

  /**
   * Initiate login via Auth0
   */
  const login = useCallback(() => {
    setError(null);
    promptAsync();
  }, [promptAsync]);

  /**
   * Logout - clear all auth state
   */
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setError(null);
  }, []);

  const isAuthenticated = Boolean(user && accessToken);

  // ---------------------
  // CONTEXT VALUE
  // ---------------------
  const value = {
    user,
    accessToken,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    isReady: Boolean(request),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------
// CUSTOM HOOK
// ---------------------
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export default AuthContext;
