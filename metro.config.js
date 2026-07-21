const { getDefaultConfig } = require('expo/metro-config');
const {
  createSentryMetroSerializer,
} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

const config = getDefaultConfig(__dirname);

config.serializer.customSerializer = createSentryMetroSerializer();

module.exports = config;