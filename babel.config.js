const plugins = [
  ['module:react-native-dotenv'],
  [
    'module-resolver',
    {
      extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js', '.png'],
      root: ['.'],
      alias: {
        '@': './src',
        '~': './',
      },
    },
  ],
  [
    'react-native-reanimated/plugin',
    {
      relativeSourceLocation: true,
    },
  ],
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins,
};
