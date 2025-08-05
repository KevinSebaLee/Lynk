import js from '@eslint/js';
import react from 'eslint-plugin-react/configs/recommended.js';

export default [
  js.configs.recommended,
  react,
  {
    ignores: ['node_modules/**', 'dist/**'],
    rules: {
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
];