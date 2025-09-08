import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import globals from 'globals';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        
        // React/Next.js globals
        React: 'readonly',
        JSX: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      '@next/next': nextPlugin,
    },
    rules: {
      // TypeScript rules - Essential only for performance
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // Security rules - Critical for enterprise
      'no-eval': 'warn',
      'no-implied-eval': 'warn',
      'no-new-func': 'warn',
      'no-script-url': 'warn',
      
      // General rules - Performance optimized
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      
      // Code quality rules
      'no-undef': 'warn',
      'no-unused-vars': 'off',
      'no-redeclare': 'warn',
      'no-duplicate-imports': 'warn',
      
      // Next.js specific - Optimized
      '@next/next/no-img-element': 'off',
      
      // Performance critical rules only
      'no-unreachable-loop': 'warn',
      'no-unused-private-class-members': 'off',
      // Performance optimization rules
      'no-restricted-imports': ['warn', {
        patterns: [{
          group: ['lodash', 'underscore'],
          message: 'Use native JavaScript methods instead of Lodash/Underscore for better performance'
        }]
      }],
      // Code complexity rules
      'complexity': ['warn', 25],
      'max-lines-per-function': ['warn', 200],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-console': 'off',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'warn',
    },
  },
  {
    // Ignore files that cause performance issues
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.min.js',
      'public/**',
      'prisma/migrations/**',
      'database_backups/**',
      '*.backup.*',
      '*.log',
      '.git/**',
    ],
  },
];
