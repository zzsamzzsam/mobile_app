// 1. Import getSentryExpoConfig instead of vanilla expo / dist tools
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// 2. This automatically sets up both Expo and Sentry configurations safely
const config = getSentryExpoConfig(__dirname);

module.exports = config;
