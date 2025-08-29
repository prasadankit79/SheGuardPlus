// File: babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for Drawer Navigation
      'react-native-reanimated/plugin',
    ],
  };
};