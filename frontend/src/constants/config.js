// frontend/src/constants/config.js
// Configuration with environment variable support
// For local development, create a .env file based on .env.example

import Constants from 'expo-constants';

// ---------------------
// ENVIRONMENT VARIABLES
// ---------------------

// Get environment variables from Expo config or process.env
const getEnvVar = (key, fallback) => {
  // Try Expo Constants first (for app.config.js extra)
  const expoExtra = Constants.expoConfig?.extra;
  if (expoExtra?.[key]) {
    return expoExtra[key];
  }
  
  // Try process.env (for web builds)
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key];
  }
  
  // Return fallback (development defaults)
  return fallback;
};

// ---------------------
// AUTH0 CONFIGURATION
// ---------------------

export const AUTH0_CONFIG = {
  domain: getEnvVar('AUTH0_DOMAIN', 'dev-feccaeq8qwpicehq.eu.auth0.com'),
  clientId: getEnvVar('AUTH0_CLIENT_ID', 'Mp1DLIhUPWbTELgiO0C1GiuGnD3rdv2M'),
  audience: getEnvVar('AUTH0_AUDIENCE', 'https://ciam-demo-api'),
};

// ---------------------
// API CONFIGURATION
// ---------------------

export const API_CONFIG = {
  baseUrl: getEnvVar('API_BASE_URL', 'https://ciam-demo-dap-cdbcc5debgfgbaf5.westeurope-01.azurewebsites.net'),
};

// Backwards compatibility
export const API_BASE_URL = API_CONFIG.baseUrl;

// ---------------------
// FEATURE FLAGS
// ---------------------

export const FEATURES = {
  // Enable/disable features for testing
  enableMockData: true,
  enableStepUpDemo: true,
  enableDelegationDemo: true,
};

// ---------------------
// VALIDATION
// ---------------------

// Log warning in development if using fallback values
if (__DEV__) {
  const isUsingDefaults = 
    AUTH0_CONFIG.domain.includes('dev-feccaeq8qwpicehq') &&
    !getEnvVar('AUTH0_DOMAIN', null);
  
  if (isUsingDefaults) {
    console.log('ℹ️ Using default Auth0 config. Create .env for custom values.');
  }
}
