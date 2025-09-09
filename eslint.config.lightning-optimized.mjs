import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2024,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      security,
      sonarjs,
      unicorn,
    },
    rules: {
      // Permanent A+ Grade Rules
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      'security/detect-object-injection': 'error',
      'security/detect-eval-with-expression': 'error',
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/no-identical-functions': 'error',
      'unicorn/filename-case': ['error', { case: 'camelCase' }],
      'unicorn/no-null': 'warn',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-module': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'object-shorthand': 'error',
      'prefer-object-spread': 'error',
    },
  },
  prettier,
];
