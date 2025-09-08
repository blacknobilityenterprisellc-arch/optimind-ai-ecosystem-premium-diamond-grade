#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Simple Warning Fix Tool
 * Premium Diamond Grade Quality Management
 * Simple, targeted fixes for common lint warnings
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

class SimpleWarningFixer {
  private projectPath: string;
  private logFile: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.logFile = path.join(projectPath, 'simple-fixes.log');
  }

  private log(message: string, level: 'info' | 'success' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;
    
    fs.appendFileSync(this.logFile, logMessage);
    console.log(`[${level.toUpperCase()}] ${message}`);
  }

  private executeCommand(command: string, description: string, timeout: number = 60000): boolean {
    try {
      this.log(`Executing: ${description}`);
      this.log(`Command: ${command}`);
      
      execSync(command, { 
        cwd: this.projectPath, 
        stdio: 'pipe',
        timeout,
        encoding: 'utf8'
      });
      
      this.log(`✅ Completed: ${description}`, 'success');
      return true;
    } catch (error: any) {
      this.log(`❌ Failed: ${description} - ${error.message}`, 'error');
      return false;
    }
  }

  public fixConsoleStatements(): boolean {
    this.log('🔧 Fixing console statements...');
    
    // Simple approach: find and replace console statements in key files
    const keyFiles = [
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'server.ts',
      'api-key-solution-summary.ts',
      'auto-dependency-manager.ts'
    ];

    let fixedCount = 0;
    
    for (const filePath of keyFiles) {
      if (fs.existsSync(filePath)) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          const originalContent = content;
          
          // Remove console.log, console.error, console.warn statements
          content = content.replace(/console\.(log|error|warn|info|debug)\s*\([^)]*\);?/g, '');
          // Remove empty lines left by removed console statements
          content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            fixedCount++;
            this.log(`✅ Fixed console statements in ${filePath}`, 'success');
          }
        } catch (error: any) {
          this.log(`❌ Failed to fix ${filePath}: ${error.message}`, 'error');
        }
      }
    }
    
    this.log(`📊 Fixed console statements in ${fixedCount} files`, 'success');
    return fixedCount > 0;
  }

  public fixUnusedImports(): boolean {
    this.log('🔧 Fixing unused imports...');
    
    const keyFiles = [
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'server.ts'
    ];

    let fixedCount = 0;
    
    for (const filePath of keyFiles) {
      if (fs.existsSync(filePath)) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          const originalContent = content;
          
          // Remove unused imports (simple pattern matching)
          // This is a basic approach - remove imports that don't appear to be used
          const importLines = content.match(/^import.*$/gm) || [];
          
          for (const importLine of importLines) {
            // Extract the imported item (simplified)
            const match = importLine.match(/import\s+{\s*([^}]+)\s*}/);
            if (match) {
              const importedItems = match[1].split(',').map(item => item.trim());
              let allUnused = true;
              
              // Check if any imported item is used in the file
              for (const item of importedItems) {
                if (item && content.includes(item)) {
                  allUnused = false;
                  break;
                }
              }
              
              // If no items are used, remove the import
              if (allUnused && importedItems.length > 0) {
                content = content.replace(`${importLine  }\n`, '');
                fixedCount++;
              }
            }
          }
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            this.log(`✅ Fixed unused imports in ${filePath}`, 'success');
          }
        } catch (error: any) {
          this.log(`❌ Failed to fix ${filePath}: ${error.message}`, 'error');
        }
      }
    }
    
    this.log(`📊 Fixed unused imports in ${fixedCount} files`, 'success');
    return fixedCount > 0;
  }

  public runSimpleFixes(): void {
    this.log('🚀 Starting simple warning fixes...');
    
    const results = {
      consoleStatements: this.fixConsoleStatements(),
      unusedImports: this.fixUnusedImports()
    };
    
    this.log('\n📊 SIMPLE FIXES SUMMARY:');
    this.log(`✅ Console Statements: ${results.consoleStatements ? 'FIXED' : 'NO CHANGES'}`);
    this.log(`✅ Unused Imports: ${results.unusedImports ? 'FIXED' : 'NO CHANGES'}`);
    
    if (results.consoleStatements || results.unusedImports) {
      this.log('\n💡 NEXT STEPS:', 'success');
      this.log('1. Run lint check again to see improvement', 'success');
      this.log('2. Commit the changes', 'success');
      this.log('3. Consider manual fixes for remaining complex issues', 'success');
    } else {
      this.log('\n⚠️  No automatic fixes were applied', 'warn');
      this.log('Manual intervention may be required for complex issues', 'warn');
    }
  }
}

// Main execution
async function main() {
  const fixer = new SimpleWarningFixer();
  fixer.runSimpleFixes();
}

if (require.main === module) {
  main().catch(console.error);
}

export default SimpleWarningFixer;