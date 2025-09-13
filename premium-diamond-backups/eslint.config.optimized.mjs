
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat();

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin
    },
    rules: {
      // Gradually enforce rules - start with warnings
      'no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'warn',
      'no-undef': 'warn',
      
      // Security rules (keep as errors)
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // Code quality rules (warnings for now)
      'complexity': ['warn', 25],
      'max-lines-per-function': ['warn', 200],
      'max-depth': ['warn', 5],
      'max-params': ['warn', 8],
      
      // TypeScript specific (warnings for gradual adoption)
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn'
    }
  },
  {
    files: ['.next/**/*.{js,ts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@next/next/no-assign-module-variable': 'off'
    }
  }
];
