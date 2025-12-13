// frontend/App.js
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// ===== CONFIGURATION =====
const AUTH0_DOMAIN = 'dev-feccaeq8qwpicehq.eu.auth0.com';
const AUTH0_CLIENT_ID = 'Mp1DLIhUPWbTELgiO0C1GiuGnD3rdv2M';
const AUTH0_AUDIENCE = 'https://ciam-demo-api';
const API_URL = 'http://192.168.1.7:8080';

const redirectUri = AuthSession.makeRedirectUri();
console.log('Redirect URI:', redirectUri); 

export default function App() {
  // ===== STATE =====
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [result, setResult] = useState('Click a button to test...');

  // ===== AUTH0 SETUP =====
  const discovery = AuthSession.useAutoDiscovery(`https://${AUTH0_DOMAIN}`);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      redirectUri,
      responseType: 'code',
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        audience: AUTH0_AUDIENCE,
      },
    },
    discovery
  );

  // Handle authentication response
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeForToken(code);
    }
  }, [response]);

  // ===== AUTH FUNCTIONS =====

  // Exchange authorization code for access token (PKCE flow)
  const exchangeCodeForToken = async (code) => {
    try {
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: AUTH0_CLIENT_ID,
          code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier,
          },
        },
        discovery
      );

      setAccessToken(tokenResponse.accessToken);

      // Fetch user info from Auth0
      const userResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: { Authorization: `Bearer ${tokenResponse.accessToken}` },
      });
      const userData = await userResponse.json();
      setUser(userData);
      setResult('Login successful!');
    } catch (error) {
      setResult('Login error: ' + error.message);
    }
  };

  // Clear user session
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setResult('Logged out');
  };

  // ===== API FUNCTIONS =====

  // Call public endpoint (no authentication required)
  const callPublicApi = async () => {
    try {
      const response = await fetch(`${API_URL}/public`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  // Call protected endpoint (requires valid JWT token)
  const callProtectedApi = async () => {
    if (!accessToken) {
      setResult('You must log in first!');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/protected`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
  };

  // ===== RENDER =====
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CIAM Demo</Text>
      <Text style={styles.subtitle}>Customer Identity & Access Management</Text>

      {/* Authentication Section */}
      <View style={styles.card}>
        {!user ? (
          <Pressable style={styles.buttonBlue} onPress={() => promptAsync()}>
            <Text style={styles.buttonText}>Log in</Text>
          </Pressable>
        ) : (
          <>
            <Text style={styles.label}>Logged in as:</Text>
            <Text style={styles.info}>{user.name || user.email}</Text>
            <Pressable style={styles.buttonRed} onPress={logout}>
              <Text style={styles.buttonText}>Log out</Text>
            </Pressable>
          </>
        )}
      </View>

      {/* API Testing Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Test API Endpoints</Text>
        <Pressable style={styles.buttonGreen} onPress={callPublicApi}>
          <Text style={styles.buttonText}>Call /public (open)</Text>
        </Pressable>
        <Pressable style={styles.buttonPurple} onPress={callProtectedApi}>
          <Text style={styles.buttonText}>Call /protected (requires login)</Text>
        </Pressable>
      </View>

      {/* Result Section */}
      <View style={styles.card}>
        <Text style={styles.label}>Result</Text>
        <Text style={styles.result}>{result}</Text>
      </View>
    </ScrollView>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  result: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  buttonBlue: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonRed: {
    backgroundColor: '#dc2626',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonGreen: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonPurple: {
    backgroundColor: '#7c3aed',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});