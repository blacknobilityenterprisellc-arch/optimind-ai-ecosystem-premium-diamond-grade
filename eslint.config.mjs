/**
 * Ultra-Optimized Premium Diamond-Grade ESLint Configuration
 * 
 * Maximum performance configuration focusing on critical enterprise standards:
 * - Security-first approach with zero tolerance for vulnerabilities
 * - Essential code quality rules only
 * - Optimized for large codebases with sub-30s execution time
 * - CI/CD friendly with reliable execution
 * 
 * Enterprise Standards: SOC2, GDPR, ISO27001, HIPAA
 * Performance Target: < 30s execution time
 * 
 * @author: Enterprise Architecture Team
 * @version: 3.2.0
 * @enterprise: OptiMind AI Ecosystem - Premium Diamond Grade
 */

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";

// Essential Plugins Only
import securityPlugin from "eslint-plugin-security";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxAccessibilityPlugin from "eslint-plugin-jsx-a11y";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const ultraOptimizedConfig = [
  // Base Configuration
  js.configs.recommended,
  
  // Next.js Core Configuration
  ...compat.extends("next/core-web-vitals"),
  
  // TypeScript Configuration (Streamlined)
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
      // Critical TypeScript Rules Only
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  
  // === CRITICAL SECURITY RULES ONLY ===
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      security: securityPlugin,
    },
    rules: {
      // Zero Tolerance Security Vulnerabilities
      "security/detect-object-injection": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-unsafe-regex": "error",
      "security/detect-eval-with-expression": "error",
      
      // Code Injection Prevention
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
    },
  },
  
  // === ESSENTIAL REACT & ACCESSIBILITY RULES ===
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-hooks": reactHooksPlugin,
      "jsx-a11y": jsxAccessibilityPlugin,
    },
    rules: {
      // Critical React Hooks
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      
      // Essential Accessibility (WCAG 2.1 AA Critical)
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/label-has-associated-control": "error",
      
      // React Best Practices
      "react/no-unescaped-entities": "warn",
      "react/jsx-key": "error",
      "react/jsx-no-undef": "error",
      
      // Next.js Security
      "@next/next/no-html-link-for-pages": "error",
    },
  },
  
  // === ESSENTIAL CODE QUALITY RULES ===
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Critical Code Quality
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "no-debugger": "error",
      "no-unreachable": "error",
      
      // Error Handling
      "no-throw-literal": "warn",
      "use-isnan": "error",
      "valid-typeof": "error",
      
      // Performance
      "prefer-const": "warn",
      
      // Essential Style
      "quotes": ["warn", "single", { "avoidEscape": true }],
      "semi": ["warn", "always"],
      
      // Import Security
      "import/no-unresolved": "error",
      "import/no-dynamic-require": "error",
      
      // Next.js Optimization
      "@next/next/no-img-element": "warn",
    },
  },
  
  // === SPECIAL CONFIGURATIONS ===
  
  // Test Files - Relaxed Rules
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "security/detect-non-literal-fs-filename": "off",
      "security/detect-non-literal-regexp": "off",
    },
  },
  
  // Configuration Files - Minimal Rules
  {
    files: ["**/*.config.{js,ts}", "**/*.json"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-var-requires": "off",
      "import/no-extraneous-dependencies": "off",
    },
  },
  
  // Legacy Code - Minimal Enforcement
  {
    files: ["**/migrations/**/*.{js,ts}", "**/legacy/**/*.{js,ts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
];

export default ultraOptimizedConfig;