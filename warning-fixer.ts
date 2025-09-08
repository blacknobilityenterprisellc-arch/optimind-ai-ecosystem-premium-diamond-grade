#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Warning Fix Automation
 * Premium Diamond Grade Code Quality Improvement System
 * Automatically identifies and fixes common TypeScript and ESLint warnings
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface WarningFix {
  file: string;
  line: number;
  type: 'any-type' | 'console-statement' | 'unused-import' | 'undefined-global';
  severity: 'low' | 'medium' | 'high';
  autoFixable: boolean;
  fixApplied: boolean;
}

class WarningFixer {
  private fixes: WarningFix[] = [];
  private totalFixed = 0;

  constructor() {
    console.log('🔧 OptiMind AI Ecosystem - Warning Fix Automation');
    console.log('🏢 Premium Diamond Grade Quality Improvement System');
    console.log('⚡ Starting automated warning fixes...\n');
  }

  async analyzeAndFix(): Promise<void> {
    try {
      // Step 1: Get all TypeScript files
      const files = this.getTsFiles();
      console.log(`📁 Found ${files.length} TypeScript/React files to analyze`);

      // Step 2: Analyze each file for warnings
      for (const file of files) {
        await this.analyzeFile(file);
      }

      // Step 3: Apply fixes
      await this.applyFixes();

      // Step 4: Generate report
      this.generateReport();

    } catch (error) {
      console.error('❌ Error during warning fix process:', error);
    }
  }

  private getTsFiles(): string[] {
    const result = execSync('find src -name "*.ts" -o -name "*.tsx" | head -50', { 
      encoding: 'utf8' 
    });
    return result.trim().split('\n').filter(Boolean);
  }

  private async analyzeFile(filePath: string): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const lineNumber = index + 1;

        // Check for 'any' types
        if (line.includes(': any') || line.includes(' as any')) {
          this.fixes.push({
            file: filePath,
            line: lineNumber,
            type: 'any-type',
            severity: 'medium',
            autoFixable: true,
            fixApplied: false
          });
        }

        // Check for console statements
        if (line.match(/console\.(log|error|warn|info|debug)/)) {
          this.fixes.push({
            file: filePath,
            line: lineNumber,
            type: 'console-statement',
            severity: 'low',
            autoFixable: true,
            fixApplied: false
          });
        }

        // Check for undefined globals (setInterval, setTimeout, etc.)
        if (line.match(/\b(setInterval|setTimeout|clearInterval|clearTimeout)\b/) && !line.includes('window.')) {
          this.fixes.push({
            file: filePath,
            line: lineNumber,
            type: 'undefined-global',
            severity: 'high',
            autoFixable: true,
            fixApplied: false
          });
        }
      });

    } catch (error) {
      console.warn(`⚠️ Could not analyze file: ${filePath}`);
    }
  }

  private async applyFixes(): Promise<void> {
    console.log('🔧 Applying automated fixes...');

    for (const fix of this.fixes) {
      try {
        await this.applyFix(fix);
      } catch (error) {
        console.warn(`⚠️ Could not apply fix to ${fix.file}:${fix.line}`);
      }
    }
  }

  private async applyFix(fix: WarningFix): Promise<void> {
    const content = fs.readFileSync(fix.file, 'utf8');
    const lines = content.split('\n');
    const lineIndex = fix.line - 1;

    if (lineIndex >= lines.length) return;

    let newLine = lines[lineIndex];

    switch (fix.type) {
      case 'any-type':
        // Replace ': any' with ': unknown'
        newLine = newLine.replace(/: any\b/g, ': unknown');
        break;

      case 'console-statement':
        // Replace console.error with logger.error if logger is imported
        if (content.includes("import { logger } from '@/lib/logger'")) {
          newLine = newLine.replace(
            /console\.error\(([^)]+)\)/,
            'logger.error($1)'
          );
        }
        break;

      case 'undefined-global':
        // Add window. prefix to globals
        newLine = newLine.replace(
          /\b(setInterval|setTimeout|clearInterval|clearTimeout)\b/g,
          'window.$1'
        );
        break;
    }

    if (newLine !== lines[lineIndex]) {
      lines[lineIndex] = newLine;
      fs.writeFileSync(fix.file, lines.join('\n'));
      fix.fixApplied = true;
      this.totalFixed++;
      console.log(`✅ Fixed ${fix.type} in ${fix.file}:${fix.line}`);
    }
  }

  private generateReport(): void {
    const appliedFixes = this.fixes.filter(f => f.fixApplied);
    const byType = this.groupByType(appliedFixes);
    const bySeverity = this.groupBySeverity(appliedFixes);

    console.log('\n🎯 WARNING FIX REPORT');
    console.log('═'.repeat(50));
    console.log(`📊 Total Fixes Applied: ${this.totalFixed}`);
    console.log(`📈 Success Rate: ${((this.totalFixed / this.fixes.length) * 100).toFixed(1)}%`);

    console.log('\n📋 Fixes by Type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  • ${type}: ${count}`);
    });

    console.log('\n⚠️ Fixes by Severity:');
    Object.entries(bySeverity).forEach(([severity, count]) => {
      console.log(`  • ${severity}: ${count}`);
    });

    console.log('\n🚀 Next Steps:');
    console.log('  1. Run lint test to verify improvements');
    console.log('  2. Review remaining manual fixes needed');
    console.log('  3. Update CI/CD pipeline with quality gates');
    console.log('  4. Commit automated improvements');
  }

  private groupByType(fixes: WarningFix[]): Record<string, number> {
    return fixes.reduce((acc, fix) => {
      acc[fix.type] = (acc[fix.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupBySeverity(fixes: WarningFix[]): Record<string, number> {
    return fixes.reduce((acc, fix) => {
      acc[fix.severity] = (acc[fix.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Execute the warning fixer
async function main() {
  const fixer = new WarningFixer();
  await fixer.analyzeAndFix();
}

main().catch(console.error);