#!/usr/bin/env tsx

/**
 * OptiMind AI Ecosystem - Warning Analysis and Prioritization Tool
 * Premium Diamond Grade Quality Management
 * Analyzes and categorizes lint warnings for systematic improvement
 */

import * as fs from 'fs';
import * as path from 'path';

interface Warning {
  filePath: string;
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  fixable?: boolean;
  suggestions?: any[];
}

interface WarningCategory {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  impact: 'performance' | 'security' | 'maintainability' | 'readability' | 'functionality';
  description: string;
  estimatedFixTime: string;
  autoFixable: boolean;
}

interface AnalysisResult {
  totalWarnings: number;
  categories: Record<string, WarningCategory>;
  warningsByCategory: Record<string, Warning[]>;
  warningsByFile: Record<string, Warning[]>;
  priorityOrder: string[];
  recommendations: string[];
}

class WarningAnalyzer {
  private eslintReportPath: string;
  private outputPath: string;

  constructor(eslintReportPath: string = './eslint-report.json', outputPath: string = './warning-analysis.json') {
    this.eslintReportPath = eslintReportPath;
    this.outputPath = outputPath;
  }

  private getWarningCategories(): Record<string, WarningCategory> {
    return {
      'no-unused-vars': {
        category: 'Unused Variables',
        severity: 'medium',
        impact: 'maintainability',
        description: 'Variables declared but never used, indicating dead code or incomplete implementation',
        estimatedFixTime: '2-5 minutes per instance',
        autoFixable: true
      },
      '@typescript-eslint/no-unused-vars': {
        category: 'Unused Variables (TypeScript)',
        severity: 'medium',
        impact: 'maintainability',
        description: 'TypeScript-specific unused variables, may affect type safety',
        estimatedFixTime: '2-5 minutes per instance',
        autoFixable: true
      },
      'no-console': {
        category: 'Console Statements',
        severity: 'low',
        impact: 'maintainability',
        description: 'Console statements should be removed from production code',
        estimatedFixTime: '1 minute per instance',
        autoFixable: true
      },
      '@typescript-eslint/no-explicit-any': {
        category: 'Type Safety',
        severity: 'high',
        impact: 'functionality',
        description: 'Use of explicit any type defeats TypeScript type checking',
        estimatedFixTime: '5-15 minutes per instance',
        autoFixable: false
      },
      'no-undef': {
        category: 'Undefined Variables',
        severity: 'critical',
        impact: 'functionality',
        description: 'Use of undefined variables will cause runtime errors',
        estimatedFixTime: '10-30 minutes per instance',
        autoFixable: false
      },
      'no-redeclare': {
        category: 'Variable Redeclaration',
        severity: 'high',
        impact: 'functionality',
        description: 'Redeclaring variables can cause unexpected behavior',
        estimatedFixTime: '5-10 minutes per instance',
        autoFixable: false
      },
      'no-case-declarations': {
        category: 'Case Declarations',
        severity: 'medium',
        impact: 'functionality',
        description: 'Lexical declarations in case statements can cause scope issues',
        estimatedFixTime: '3-8 minutes per instance',
        autoFixable: false
      },
      'no-dupe-keys': {
        category: 'Duplicate Keys',
        severity: 'critical',
        impact: 'functionality',
        description: 'Duplicate keys in objects will cause unexpected behavior',
        estimatedFixTime: '2-5 minutes per instance',
        autoFixable: false
      },
      'no-useless-escape': {
        category: 'Code Quality',
        severity: 'low',
        impact: 'readability',
        description: 'Unnecessary escape characters in strings',
        estimatedFixTime: '1 minute per instance',
        autoFixable: true
      },
      'no-unreachable': {
        category: 'Unreachable Code',
        severity: 'high',
        impact: 'functionality',
        description: 'Unreachable code indicates logic errors',
        estimatedFixTime: '5-15 minutes per instance',
        autoFixable: false
      },
      'no-duplicate-imports': {
        category: 'Duplicate Imports',
        severity: 'low',
        impact: 'maintainability',
        description: 'Duplicate imports can be consolidated',
        estimatedFixTime: '2 minutes per instance',
        autoFixable: true
      },
      'no-shadow-restricted-names': {
        category: 'Restricted Names',
        severity: 'high',
        impact: 'functionality',
        description: 'Shadowing restricted names can cause issues',
        estimatedFixTime: '5-10 minutes per instance',
        autoFixable: false
      },
      'no-dupe-class-members': {
        category: 'Duplicate Class Members',
        severity: 'critical',
        impact: 'functionality',
        description: 'Duplicate class members will cause errors',
        estimatedFixTime: '3-8 minutes per instance',
        autoFixable: false
      },
      'no-const-assign': {
        category: 'Const Assignment',
        severity: 'high',
        impact: 'functionality',
        description: 'Attempting to assign to const variables',
        estimatedFixTime: '2-5 minutes per instance',
        autoFixable: false
      }
    };
  }

  private loadESLintReport(): any[] {
    try {
      const reportContent = fs.readFileSync(this.eslintReportPath, 'utf8');
      return JSON.parse(reportContent);
    } catch (error) {
      console.error('Error loading ESLint report:', error);
      return [];
    }
  }

  private extractWarnings(report: any[]): Warning[] {
    const warnings: Warning[] = [];
    
    report.forEach(fileReport => {
      if (fileReport.messages && Array.isArray(fileReport.messages)) {
        fileReport.messages.forEach((message: any) => {
          if (message.severity === 1) { // Warnings only
            warnings.push({
              filePath: fileReport.filePath,
              ruleId: message.ruleId,
              severity: message.severity,
              message: message.message,
              line: message.line,
              column: message.column,
              fixable: message.fixable || false,
              suggestions: message.suggestions || []
            });
          }
        });
      }
    });
    
    return warnings;
  }

  public analyze(): AnalysisResult {
    console.log('🔍 Analyzing lint warnings...');
    
    const report = this.loadESLintReport();
    const warnings = this.extractWarnings(report);
    const categories = this.getWarningCategories();
    
    const warningsByCategory: Record<string, Warning[]> = {};
    const warningsByFile: Record<string, Warning[]> = {};
    
    // Initialize category arrays
    Object.keys(categories).forEach(ruleId => {
      const categoryName = categories[ruleId].category;
      if (!warningsByCategory[categoryName]) {
        warningsByCategory[categoryName] = [];
      }
    });
    
    // Categorize warnings
    warnings.forEach(warning => {
      const category = categories[warning.ruleId];
      if (category) {
        const categoryName = category.category;
        if (!warningsByCategory[categoryName]) {
          warningsByCategory[categoryName] = [];
        }
        warningsByCategory[categoryName].push(warning);
      }
      
      // Group by file
      if (!warningsByFile[warning.filePath]) {
        warningsByFile[warning.filePath] = [];
      }
      warningsByFile[warning.filePath].push(warning);
    });
    
    // Determine priority order based on severity and impact
    const priorityOrder = Object.entries(categories)
      .sort(([,a], [,b]) => {
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const impactOrder = { functionality: 4, security: 3, performance: 2, maintainability: 1, readability: 1 };
        
        const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
        if (severityDiff !== 0) return severityDiff;
        
        return impactOrder[b.impact] - impactOrder[a.impact];
      })
      .map(([ruleId, category]) => category.category)
      .filter((category, index, array) => array.indexOf(category) === index);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(warningsByCategory, categories);
    
    const result: AnalysisResult = {
      totalWarnings: warnings.length,
      categories,
      warningsByCategory,
      warningsByFile,
      priorityOrder,
      recommendations
    };
    
    // Save analysis result
    fs.writeFileSync(this.outputPath, JSON.stringify(result, null, 2));
    
    return result;
  }

  private generateRecommendations(warningsByCategory: Record<string, Warning[]>, categories: Record<string, WarningCategory>): string[] {
    const recommendations: string[] = [];
    
    // Critical issues first
    Object.entries(categories).forEach(([ruleId, category]) => {
      if (category.severity === 'critical') {
        const warnings = warningsByCategory[category.category] || [];
        if (warnings.length > 0) {
          recommendations.push(`🚨 CRITICAL: Fix ${warnings.length} ${category.category} issues immediately - ${category.description}`);
        }
      }
    });
    
    // Auto-fixable items
    const autoFixableCategories = Object.entries(categories)
      .filter(([, category]) => category.autoFixable)
      .map(([ruleId, category]) => ({ ruleId, category }));
    
    autoFixableCategories.forEach(({ ruleId, category }) => {
      const warnings = warningsByCategory[category.category] || [];
      if (warnings.length > 0) {
        recommendations.push(`🔧 AUTO-FIX: Apply automatic fixes for ${warnings.length} ${category.category} issues`);
      }
    });
    
    // High impact items
    Object.entries(categories).forEach(([ruleId, category]) => {
      if (category.severity === 'high' && !category.autoFixable) {
        const warnings = warningsByCategory[category.category] || [];
        if (warnings.length > 0) {
          recommendations.push(`⚠️  HIGH PRIORITY: Manually fix ${warnings.length} ${category.category} issues (${category.estimatedFixTime} each)`);
        }
      }
    });
    
    // Medium and low priority
    Object.entries(categories).forEach(([ruleId, category]) => {
      if (category.severity === 'medium' || category.severity === 'low') {
        const warnings = warningsByCategory[category.category] || [];
        if (warnings.length > 0) {
          recommendations.push(`📋 ${category.severity.toUpperCase()}: Address ${warnings.length} ${category.category} issues during maintenance`);
        }
      }
    });
    
    // CI/CD recommendation
    recommendations.push('🔄 CI/CD: Integrate linting into your CI/CD pipeline to prevent new issues');
    recommendations.push('📊 MONITORING: Set up quality metrics tracking to monitor improvement over time');
    
    return recommendations;
  }

  public printSummary(result: AnalysisResult): void {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║           OPTIMIND AI ECOSYSTEM - WARNING ANALYSIS           ║');
    console.log('║                Premium Diamond Grade Assessment              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    
    console.log(`\n📊 Total Warnings: ${result.totalWarnings}`);
    console.log(`📁 Affected Files: ${Object.keys(result.warningsByFile).length}`);
    console.log(`🏷️  Warning Categories: ${Object.keys(result.warningsByCategory).length}`);
    
    console.log('\n🎯 PRIORITY ORDER:');
    result.priorityOrder.forEach((category, index) => {
      const warnings = result.warningsByCategory[category] || [];
      const categoryInfo = Object.values(result.categories).find(c => c.category === category);
      if (categoryInfo && warnings.length > 0) {
        console.log(`${index + 1}. ${category} (${warnings.length} issues) - ${categoryInfo.severity.toUpperCase()} priority`);
      }
    });
    
    console.log('\n📋 CATEGORY BREAKDOWN:');
    Object.entries(result.warningsByCategory).forEach(([category, warnings]) => {
      const categoryInfo = Object.values(result.categories).find(c => c.category === category);
      if (categoryInfo && warnings.length > 0) {
        console.log(`\n${category}:`);
        console.log(`   Count: ${warnings.length}`);
        console.log(`   Severity: ${categoryInfo.severity.toUpperCase()}`);
        console.log(`   Impact: ${categoryInfo.impact.toUpperCase()}`);
        console.log(`   Auto-fixable: ${categoryInfo.autoFixable ? 'YES' : 'NO'}`);
        console.log(`   Est. Time: ${categoryInfo.estimatedFixTime} per issue`);
      }
    });
    
    console.log('\n💡 RECOMMENDATIONS:');
    result.recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });
    
    console.log(`\n📄 Detailed analysis saved to: ${this.outputPath}`);
  }
}

// Main execution
async function main() {
  const analyzer = new WarningAnalyzer();
  const result = analyzer.analyze();
  analyzer.printSummary(result);
}

if (require.main === module) {
  main().catch(console.error);
}

export default WarningAnalyzer;