/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');

const {createSentryMetroSerializer} = require('@sentry/react-native/dist/js/tools/sentryMetroSerializer');

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },

  resolver: {
    extraNodeModules: {
      http: path.resolve(__dirname, 'emptyModule.js'),
      https: path.resolve(__dirname, 'emptyModule.js'),
      zlib: require.resolve('browserify-zlib'),
      url: require.resolve('url'),
      os: require.resolve('os-browserify/browser'),
      tty: require.resolve('tty-browserify'),
      util: require.resolve('util'),
      process: require.resolve('process/browser'),
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'),
    },
  },

  serializer: {
    customSerializer: createSentryMetroSerializer(),
  },
};
