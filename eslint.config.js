import js from '@eslint/js';
import react from 'eslint-plugin-react/configs/recommended.js';
import reactNative from 'eslint-plugin-react-native';

export default [
  js.configs.recommended,
  ...react.configs,
  {
    plugins: {
      'react-native': reactNative,
    },
    rules: {
      // Add any custom rules here
    },
  },
];
