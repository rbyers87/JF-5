const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this resolver configuration
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
  unstable_conditionNames: ['require', 'import', 'react-native'],
  resolverMainFields: ['react-native', 'browser', 'main'],
  assetExts: [...config.resolver.assetExts, 'html'],
};

module.exports = config;
