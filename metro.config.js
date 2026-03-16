const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Safeguard resolution for older Worklets versions used in current Expo Go
config.resolver.sourceExts.push('mjs');

module.exports = config;
