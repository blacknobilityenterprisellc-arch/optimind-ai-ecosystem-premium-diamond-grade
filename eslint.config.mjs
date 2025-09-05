import { createConfig } from "eslint-config-next";

export default createConfig({
  extends: [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
  ],
  rules: {
    // Enterprise Code Standards
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": "warn",
    
    // Enterprise Security Rules
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    
    // Enterprise Quality Rules
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "error",
    
    // Next.js Enterprise Rules
    "@next/next/no-img-element": "off",
  },
  
  // Enterprise Environment
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  
  // Enterprise Parser Options
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
});
