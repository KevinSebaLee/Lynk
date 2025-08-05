import eslintRecommended from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import babelParser from '@babel/eslint-parser';

export default [
  {
    files: ['**/*.js', '**/*.jsx'], // Apply to JavaScript and JSX files
    languageOptions: {
      ecmaVersion: 2021, // Supports ES2021 features
      sourceType: 'module', // Enables ES modules
      parser: babelParser, // Use Babel parser for JSX
      parserOptions: {
        requireConfigFile: false, // Allows parsing without a Babel config file
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      react: reactPlugin, // Use the React plugin object
      'react-hooks': reactHooksPlugin, // Use the React Hooks plugin object
    },
    rules: {
      ...eslintRecommended.rules, // Extend recommended rules
      'react/jsx-uses-react': 'error', // Prevent React being marked as unused
      'react/jsx-uses-vars': 'error', // Prevent JSX variables being marked as unused
      'react/react-in-jsx-scope': 'off', // Disable React import requirement in JSX (React 17+)
      'no-undef': 'off', // Disable undefined variable errors for `process` and `console`
      'no-unused-vars': ['warn', { args: 'none' }], // Warn for unused variables
      'quotes': ['error', 'single'], // Enforce single quotes
      'semi': ['error', 'always'], // Enforce semicolons
    },
  },
];