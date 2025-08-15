const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add platform extensions in the correct order
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Exclude native-only modules from web builds
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add platform-specific extensions
config.resolver.sourceExts.push('web.tsx', 'web.ts', 'web.jsx', 'web.js');

module.exports = config;
