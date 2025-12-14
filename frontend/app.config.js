// frontend/app.config.js
// Dynamic Expo configuration with environment variable support
// Reads from .env file in development

import 'dotenv/config';

export default {
  expo: {
    name: "CIAM Demo",
    slug: "ciam-demo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
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
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
      API_BASE_URL: process.env.API_BASE_URL,
    },
  }
};
