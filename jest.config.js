module.exports = {
  preset: 'react-native',
  testEnvironment: 'jest-environment-node',
  transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native|react-native-aes-crypto))'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
