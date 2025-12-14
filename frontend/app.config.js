// frontend/app.config.js
// Dynamic Expo configuration with environment variable support
// Reads from .env file in development

export default {
  expo: {
    name: "CIAM Demo",
    slug: "ciam-demo",
    scheme: "ciam-demo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "no.gjensidige.ciam.demo"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "no.gjensidige.ciam.demo"
    },
    web: {
      favicon: "./assets/favicon.png",
      bundler: "metro"
    },
    // Environment variables exposed to the app
    extra: {
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'dev-feccaeq8qwpicehq.eu.auth0.com',
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'Mp1DLIhUPWbTELgiO0C1GiuGnD3rdv2M',
      AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://ciam-demo-api',
      API_BASE_URL: process.env.API_BASE_URL || 'https://ciam-demo-dap-cdbcc5debgfgbaf5.westeurope-01.azurewebsites.net',
      eas: {
        projectId: "8716ea14-4248-414a-9f2c-a167d5716a46"
      }
    },
  }
};
