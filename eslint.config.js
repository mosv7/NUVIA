const jsxA11y = require('eslint-plugin-jsx-a11y');
const js = require('@eslint/js');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const react = require('eslint-plugin-react');

module.exports = [
  { ignores: ['**/dist/**', '**/node_modules/**', '**/previews/**', '**/*.d.ts'] },
  { files: ['tests/e2e/**/*.mjs'], languageOptions: { globals: globals.browser } },
  {
    files: [
      'apps/api/**/*.mjs',
      'apps/web/tests/**/*.mjs',
      'scripts/**/*.mjs',
      'tests/e2e/**/*.mjs',
    ],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['apps/web/src/**/*.{js,jsx}', 'apps/web/tests/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    plugins: { 'react-hooks': reactHooks, react, 'jsx-a11y': jsxA11y },
    rules: {
      ...js.configs.recommended.rules,
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-unused-vars': [
        'warn',
        {
          args: 'none',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-restricted-globals': ['error', 'localStorage', 'sessionStorage'],
      'react-hooks/rules-of-hooks': 'error',
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    files: ['apps/web/src/lib/storage.js', 'apps/web/tests/**'],
    rules: { 'no-restricted-globals': 'off' },
  },
  {
    files: ['packages/shared-types/src/**/*.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    rules: js.configs.recommended.rules,
  },
];
