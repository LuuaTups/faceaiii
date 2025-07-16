debugger;
console.log("Loaded up to the very top of metro.config.js");

const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContextFromMetadata: true,
};

module.exports = config;