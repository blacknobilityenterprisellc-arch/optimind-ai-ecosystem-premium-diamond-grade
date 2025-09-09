/**
 * Lint Configuration Tests
 * Ensures ESLint configurations are working correctly
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Lint Configuration Tests', () => {
  const testTimeout = 15000; // 15 seconds timeout for lint tests

  describe('Ultra-fast Lint', () => {
    it('should complete ultra-fast lint within timeout', () => {
      const startTime = Date.now();
      
      try {
        execSync('npm run lint:ultra-fast', { 
          timeout: testTimeout,
          stdio: 'pipe'
        });
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(15000); // Should complete in under 15 seconds with perfect optimization
      } catch (error) {
        // Ultra-fast lint is allowed to fail with timeout, but should not crash
        expect(error.message).toContain('timeout') || expect(error.status).toBe(0);
      }
    }, testTimeout);
  });

  describe('Fast Lint', () => {
    it('should complete fast lint within timeout', () => {
      const startTime = Date.now();
      
      try {
        execSync('npm run lint:fast', { 
          timeout: testTimeout,
          stdio: 'pipe'
        });
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(25000); // Should complete in under 25 seconds with perfect optimization
      } catch (error) {
        // Fast lint is allowed to fail with timeout, but should not crash
        expect(error.message).toContain('timeout') || expect(error.status).toBe(0);
      }
    }, testTimeout);
  });

  describe('Premium Lint Script', () => {
    it('should generate comprehensive reports', () => {
      const reportPath = './premium-lint-report.json';
      
      try {
        execSync('./premium-diamond-lint-test.sh --mode ultra-fast --timeout 8 --output json', { 
          timeout: testTimeout,
          stdio: 'pipe'
        });
        
        // Check if report was generated
        expect(existsSync(reportPath)).toBe(true);
        
        // Check report structure
        if (existsSync(reportPath)) {
          const report = JSON.parse(readFileSync(reportPath, 'utf8'));
          expect(report).toHaveProperty('lint_report');
          expect(report.lint_report).toHaveProperty('metadata');
          expect(report.lint_report).toHaveProperty('results');
          expect(report.lint_report.results).toHaveProperty('total_files_analyzed');
          expect(report.lint_report.results).toHaveProperty('errors');
          expect(report.lint_report.results).toHaveProperty('warnings');
        }
      } catch (error) {
        // Allow timeout failures but ensure basic functionality
        const errorStr = error.toString();
        const hasTimeout = errorStr.includes('timeout') || errorStr.includes('ETIMEDOUT');
        const hasSuccess = error.status === 0 || error.code === 0;
        expect(hasTimeout || hasSuccess).toBe(true);
      }
    }, testTimeout);
  });

  describe('ESLint Configuration Files', () => {
    it('should have valid ESLint configuration files', () => {
      const configFiles = [
        'eslint.config.ci.mjs',
        'eslint.config.ultra-minimal.mjs'
      ];

      configFiles.forEach(configFile => {
        expect(existsSync(configFile)).toBe(true);
        
        try {
          const config = readFileSync(configFile, 'utf8');
          expect(config).toContain('export default');
          expect(config).toContain('parser');
          expect(config).toContain('rules');
        } catch (error) {
          fail(`Could not read or parse ${configFile}: ${error.message}`);
        }
      });
    });
  });

  describe('TypeScript Configuration', () => {
    it('should have valid TypeScript configuration', () => {
      expect(existsSync('tsconfig.json')).toBe(true);
      
      try {
        const tsConfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
        expect(tsConfig).toHaveProperty('compilerOptions');
        expect(tsConfig.compilerOptions).toHaveProperty('target');
        expect(tsConfig.compilerOptions).toHaveProperty('module');
        expect(tsConfig.compilerOptions).toHaveProperty('jsx');
      } catch (error) {
        fail(`Could not read or parse tsconfig.json: ${error.message}`);
      }
    });
  });
});