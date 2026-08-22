const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix cache issue
config.watchFolders = [__dirname];
config.resolver.blockList = [
  /.*\/\.cache\/.*/,
  /.*\/node_modules\/.*\/\.cache\/.*/,
];

module.exports = config;