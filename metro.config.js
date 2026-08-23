const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix cache issue
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /.*\/\.cache\/.*/,
  /.*\/node_modules\/.*\/\.cache\/.*/,
];

module.exports = config;
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ✅ Add this for web scrolling fix
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, 'css'],
};

module.exports = config;