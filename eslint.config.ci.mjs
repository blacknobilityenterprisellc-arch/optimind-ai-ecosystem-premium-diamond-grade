/**
 * CI/CD Optimized ESLint Configuration
 * 
 * Ultra-streamlined configuration for fast CI/CD pipeline execution
 * while maintaining essential security and quality checks.
 * 
 * @author: Enterprise Architecture Team
 * @version: 3.3.0
 * @compliance: SOC2, GDPR, ISO27001, HIPAA
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

// Essential Plugins
import securityPlugin from "eslint-plugin-security";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxAccessibilityPlugin from "eslint-plugin-jsx-a11y";

// TypeScript Support
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ciConfig = [
  // Base JavaScript/TypeScript Rules
  js.configs.recommended,
  
  // Next.js Configuration
  ...compat.extends("next/core-web-vitals"),
  
  // TypeScript Configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
  
  // Essential Security & Quality Rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      security: securityPlugin,
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxAccessibilityPlugin,
    },
    rules: {
      // === CRITICAL SECURITY RULES ===
      "security/detect-object-injection": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-eval-with-expression": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      
      // === ESSENTIAL QUALITY RULES ===
      "prefer-const": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-undef": "error",
      "no-unreachable": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-arrow-callback": "error",
      
      // === TYPE SAFETY ===
      "use-isnan": "error",
      "valid-typeof": "error",
      
      // === ACCESSIBILITY ===
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/label-has-associated-control": "error",
      
      // === REACT HOOKS ===
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      
      // === NEXT.JS RULES ===
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/no-page-custom-font": "error",
      
      // === REACT RULES ===
      "react/no-unescaped-entities": "error",
      "react/jsx-key": "error",
      "react/jsx-no-undef": "error",
      
      // === FORMATTING ===
      "quotes": ["warn", "single", { "avoidEscape": true }],
      "semi": ["error", "always"],
    },
  },
  
  // Test Configuration
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  
  // Configuration Files
  {
    files: ["**/*.config.{js,ts}", "**/*.json"],
    rules: {
      "no-console": "off",
    },
  },
];

export default ciConfig;