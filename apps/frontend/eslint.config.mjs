import { FlatCompat } from '@eslint/eslintrc';
import pluginJs from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImport from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: ['.next/**', 'public/**', 'next.config.js', 'postcss.config.js', 'next-sitemap.config.js'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      'simple-import-sort': simpleImport,
      'unused-imports': unusedImports,
      'react-refresh': reactRefresh,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
    },
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  ...compat.config({
    extends: ['plugin:drizzle/all'],
  }),
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-useless-catch': 'off',
      'no-async-promise-executor': 'off',
      'padding-line-between-statements': 'off',
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      'tailwindcss/no-custom-classname': 'off',
      'simple-import-sort/exports': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/no-unused-prop-types': 'warn',
      'react/jsx-key': 'warn',
      'react/no-unescaped-entities': 'off',
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/prop-types': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['**/app/**/{page,layout,loading,error,not-found}.tsx', '**/middleware.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];

export default config;
