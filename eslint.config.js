const js = require('@eslint/js');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const react = require('eslint-plugin-react');

module.exports = [
  { ignores: ['**/dist/**', '**/node_modules/**', '**/previews/**'] },
  { files: ['tests/e2e/**/*.mjs'], languageOptions: { globals: globals.browser } },
  {
    files: ['src/backend/**/*.mjs', 'tests/backend/**/*.mjs', 'tests/e2e/**/*.mjs'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/frontend/src/**/*.{js,jsx}', 'tests/frontend/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks, react },
    rules: {
      ...js.configs.recommended.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$', argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
