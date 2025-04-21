module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
    'plugin:react-hooks/recommended', // Enforces Rules of Hooks
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  env: {
    browser: true, // enable browser global variables
    node: true, // enable Node.js global variables and Node.js scoping
    es2021: true, // enable ES2021 globals
    jest: true, // enable Jest global variables
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    'react/prop-types': 'off', // Disable prop-types as we use TypeScript for type checking
    'react/react-in-jsx-scope': 'off', // Disable requirement for React import (new JSX transform)
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow implicit return types for module boundaries (can be enabled for stricter checks)
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn about unused vars, allow underscore prefix
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn on console.log, allow warn/error
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }], // Integrate prettier formatting checks
  },
  ignorePatterns: ['node_modules/', 'dist/', 'coverage/', '*.js', '*.json'], // Ignore compiled JS, configs at root
};
