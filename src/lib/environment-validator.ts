// AI-Powered Environment Variable Validation System for OptiMind AI Ecosystem
import { z } from 'zod';
import ZAI from 'z-ai-web-dev-sdk';

// Environment validation error with AI-powered suggestions
export class EnvironmentValidationError extends Error {
  public readonly variable: string;
  public readonly value: any;
  public readonly expected: string;
  public readonly suggestions: string[];
  public readonly severity: 'critical' | 'warning' | 'info';

  constructor(
    variable: string,
    value: any,
    message: string,
    expected: string,
    suggestions: string[] = [],
    severity: 'critical' | 'warning' | 'info' = 'critical'
  ) {
    super(message);
    this.name = 'EnvironmentValidationError';
    this.variable = variable;
    this.value = value;
    this.expected = expected;
    this.suggestions = suggestions;
    this.severity = severity;
  }

  toJSON() {
    return {
      name: this.name,
      variable: this.variable,
      value: this.value,
      message: this.message,
      expected: this.expected,
      suggestions: this.suggestions,
      severity: this.severity
    };
  }
}

// Comprehensive environment variable schema
const EnvironmentSchema = z.object({
  // Database Configuration
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  DIRECT_URL: z.string().min(1, 'Direct database URL is required'),
  SHADOW_DATABASE_URL: z.string().min(1, 'Shadow database URL is required'),
  DATABASE_POOL_SIZE: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 100, 'Pool size must be between 1 and 100'),
  DATABASE_CONNECTION_TIMEOUT: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 120000, 'Connection timeout must be between 1 and 120000ms'),
  DATABASE_IDLE_TIMEOUT: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 600000, 'Idle timeout must be between 1 and 600000ms'),
  DATABASE_QUERY_TIMEOUT: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 300000, 'Query timeout must be between 1 and 300000ms'),
  DATABASE_MIN_CONNECTIONS: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 0 && val <= 20, 'Min connections must be between 0 and 20'),
  DATABASE_MAX_IDLE_CONNECTIONS: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 0 && val <= 50, 'Max idle connections must be between 0 and 50'),
  DATABASE_RETRY_ATTEMPTS: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 0 && val <= 10, 'Retry attempts must be between 0 and 10'),
  DATABASE_RETRY_DELAY: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 0 && val <= 10000, 'Retry delay must be between 0 and 10000ms'),
  DATABASE_HEALTH_CHECK_INTERVAL: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 300000, 'Health check interval must be between 1 and 300000ms'),

  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test'], 'NODE_ENV must be development, production, or test'),
  PORT: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 65535, 'Port must be between 1 and 65535'),
  HOSTNAME: z.string().min(1, 'Hostname is required'),

  // AI Services Configuration
  ZAI_API_KEY: z.string().min(1, 'ZAI API key is required'),
  OPENROUTER_API_KEY: z.string().min(1, 'OpenRouter API key is required'),
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_AI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),

  // Security Configuration
  ENCRYPTION_KEY: z.string()
    .min(32, 'Encryption key must be at least 32 characters')
    .max(256, 'Encryption key must not exceed 256 characters'),
  NEXTAUTH_SECRET: z.string()
    .min(32, 'NextAuth secret must be at least 32 characters')
    .max(256, 'NextAuth secret must not exceed 256 characters'),
  NEXTAUTH_URL: z.string().url('NextAuth URL must be a valid URL'),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: z.string().url('App URL must be a valid URL'),
  DEBUG: z.string()
    .transform(val => val.toLowerCase() === 'true')
    .optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error'], 'Log level must be debug, info, warn, or error'),

  // Optional Services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 65535, 'SMTP port must be between 1 and 65535')
    .optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email('SMTP from must be a valid email').optional(),

  REDIS_URL: z.string().url('Redis URL must be a valid URL').optional(),

  NEON_API_KEY: z.string().min(1, 'Neon API key is required'),

  // Monitoring & Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  SENTRY_DSN: z.string().url('Sentry DSN must be a valid URL').optional(),

  // Payment Configuration
  STRIPE_API_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // GitHub Integration
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Development Settings
  TURBOPACK: z.string()
    .transform(val => val.toLowerCase() === 'true')
    .optional(),
  NEXT_TELEMETRY_DISABLED: z.string()
    .transform(val => val.toLowerCase() === 'true')
    .optional(),
});

// AI-powered environment validation system
class EnvironmentValidator {
  private zai: ZAI | null = null;
  private validated = false;
  private errors: EnvironmentValidationError[] = [];
  private warnings: EnvironmentValidationError[] = [];

  constructor() {
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      this.zai = await ZAI.create();
    } catch (error) {
      console.warn('Failed to initialize ZAI for environment validation:', error);
    }
  }

  async validate(): Promise<{
    valid: boolean;
    errors: EnvironmentValidationError[];
    warnings: EnvironmentValidationError[];
    suggestions: string[];
    confidence: number;
  }> {
    try {
      // Reset validation state
      this.errors = [];
      this.warnings = [];
      this.validated = true;

      // Basic Zod validation
      const result = EnvironmentSchema.safeParse(process.env);
      
      if (!result.success) {
        this.processZodErrors(result.error.errors);
      }

      // AI-enhanced validation
      if (this.zai) {
        await this.performAIValidation();
      }

      // Additional validation checks
      this.performAdditionalValidation();

      return {
        valid: this.errors.length === 0,
        errors: this.errors,
        warnings: this.warnings,
        suggestions: this.generateSuggestions(),
        confidence: this.calculateConfidence(),
      };

    } catch (error) {
      return {
        valid: false,
        errors: [new EnvironmentValidationError(
          'system',
          null,
          'Environment validation system error',
          'System to be operational',
          ['Please try again later'],
          'critical'
        )],
        warnings: [],
        suggestions: ['Contact system administrator'],
        confidence: 0.0,
      };
    }
  }

  private processZodErrors(zodErrors: any[]): void {
    zodErrors.forEach(error => {
      const variable = error.path.join('_').toUpperCase();
      const value = process.env[variable];
      
      const validationError = new EnvironmentValidationError(
        variable,
        value,
        error.message,
        this.getExpectedFormat(variable),
        this.getBasicSuggestions(variable),
        this.getSeverity(variable)
      );

      if (validationError.severity === 'critical') {
        this.errors.push(validationError);
      } else {
        this.warnings.push(validationError);
      }
    });
  }

  private async performAIValidation(): Promise<void> {
    try {
      const environmentSummary = this.getEnvironmentSummary();
      
      const aiAnalysis = await this.zai!.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI environment configuration expert. Analyze the provided environment variables and identify:
            1. Security vulnerabilities or misconfigurations
            2. Performance optimization opportunities
            3. Best practice violations
            4. Missing critical configurations
            5. Compatibility issues
            
            Respond in JSON format with the following structure:
            {
              "analysis": [
                {
                  "variable": "variable_name",
                  "issue": "description of the issue",
                  "severity": "critical|warning|info",
                  "suggestions": ["suggestion1", "suggestion2"],
                  "confidence": 0.8
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Analyze these environment variables:
            ${JSON.stringify(environmentSummary, null, 2)}`
          }
        ],
        max_tokens: 1500,
        temperature: 0.1
      });

      const analysis = JSON.parse(aiAnalysis.choices[0]?.message?.content || '{}');
      
      if (analysis.analysis) {
        analysis.analysis.forEach((item: any) => {
          const validationError = new EnvironmentValidationError(
            item.variable,
            process.env[item.variable],
            item.issue,
            'Optimal configuration',
            item.suggestions || [],
            item.severity || 'warning'
          );

          if (validationError.severity === 'critical') {
            this.errors.push(validationError);
          } else {
            this.warnings.push(validationError);
          }
        });
      }

    } catch (error) {
      console.warn('AI environment validation failed:', error);
    }
  }

  private performAdditionalValidation(): void {
    // Check for dangerous configurations
    if (process.env.NODE_ENV === 'production' && process.env.DEBUG === 'true') {
      this.warnings.push(new EnvironmentValidationError(
        'DEBUG',
        process.env.DEBUG,
        'Debug mode enabled in production',
        'Debug should be disabled in production',
        ['Set DEBUG=false in production', 'Use proper logging instead'],
        'warning'
      ));
    }

    // Check for weak encryption keys
    if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 32) {
      this.errors.push(new EnvironmentValidationError(
        'ENCRYPTION_KEY',
        '***HIDDEN***',
        'Encryption key is too weak',
        'Minimum 32 characters required',
        ['Generate a stronger encryption key', 'Use a cryptographically secure random generator'],
        'critical'
      ));
    }

    // Check for default or weak secrets
    if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
      this.errors.push(new EnvironmentValidationError(
        'NEXTAUTH_SECRET',
        '***HIDDEN***',
        'NextAuth secret is too weak',
        'Minimum 32 characters required',
        ['Generate a stronger secret', 'Use a cryptographically secure random generator'],
        'critical'
      ));
    }

    // Check database configuration consistency
    const poolSize = parseInt(process.env.DATABASE_POOL_SIZE || '10');
    const minConnections = parseInt(process.env.DATABASE_MIN_CONNECTIONS || '2');
    const maxIdleConnections = parseInt(process.env.DATABASE_MAX_IDLE_CONNECTIONS || '5');

    if (minConnections > poolSize) {
      this.errors.push(new EnvironmentValidationError(
        'DATABASE_MIN_CONNECTIONS',
        minConnections,
        'Minimum connections exceed pool size',
        'Min connections should be less than or equal to pool size',
        [`Set DATABASE_MIN_CONNECTIONS <= ${poolSize}`, 'Increase DATABASE_POOL_SIZE if needed'],
        'critical'
      ));
    }

    if (maxIdleConnections > poolSize) {
      this.errors.push(new EnvironmentValidationError(
        'DATABASE_MAX_IDLE_CONNECTIONS',
        maxIdleConnections,
        'Max idle connections exceed pool size',
        'Max idle connections should be less than or equal to pool size',
        [`Set DATABASE_MAX_IDLE_CONNECTIONS <= ${poolSize}`, 'Increase DATABASE_POOL_SIZE if needed'],
        'critical'
      ));
    }
  }

  private getEnvironmentSummary(): Record<string, any> {
    const summary: Record<string, any> = {};
    
    // Include only non-sensitive variables
    const safeVariables = [
      'NODE_ENV', 'PORT', 'HOSTNAME', 'DEBUG', 'LOG_LEVEL',
      'DATABASE_POOL_SIZE', 'DATABASE_CONNECTION_TIMEOUT', 'DATABASE_IDLE_TIMEOUT',
      'DATABASE_QUERY_TIMEOUT', 'DATABASE_MIN_CONNECTIONS', 'DATABASE_MAX_IDLE_CONNECTIONS',
      'DATABASE_RETRY_ATTEMPTS', 'DATABASE_RETRY_DELAY', 'DATABASE_HEALTH_CHECK_INTERVAL',
      'TURBOPACK', 'NEXT_TELEMETRY_DISABLED', 'NEXT_PUBLIC_APP_URL', 'NEXTAUTH_URL'
    ];

    safeVariables.forEach(variable => {
      if (process.env[variable] !== undefined) {
        summary[variable] = process.env[variable];
      }
    });

    return summary;
  }

  private getExpectedFormat(variable: string): string {
    const formats: Record<string, string> = {
      'DATABASE_URL': 'file:./path/to/database.db or postgresql://user:pass@host:port/database',
      'PORT': 'Number between 1-65535',
      'ENCRYPTION_KEY': 'String with minimum 32 characters',
      'NEXTAUTH_SECRET': 'String with minimum 32 characters',
      'ZAI_API_KEY': 'Valid ZAI API key string',
      'OPENROUTER_API_KEY': 'Valid OpenRouter API key string',
    };

    return formats[variable] || 'Valid configuration value';
  }

  private getBasicSuggestions(variable: string): string[] {
    const suggestions: Record<string, string[]> = {
      'DATABASE_URL': [
        'For SQLite: file:./dev.db',
        'For PostgreSQL: postgresql://user:password@localhost:5432/database',
        'Check database file permissions'
      ],
      'PORT': [
        'Use port 3000 for development',
        'Use port 80 or 443 for production',
        'Ensure port is not in use by other services'
      ],
      'ENCRYPTION_KEY': [
        'Generate a cryptographically secure random key',
        'Use at least 32 characters',
        'Store key securely in environment variables'
      ],
      'NEXTAUTH_SECRET': [
        'Generate a cryptographically secure random secret',
        'Use at least 32 characters',
        'Store secret securely in environment variables'
      ],
      'ZAI_API_KEY': [
        'Obtain API key from ZAI dashboard',
        'Ensure key has necessary permissions',
        'Check key expiration date'
      ],
      'OPENROUTER_API_KEY': [
        'Obtain API key from OpenRouter dashboard',
        'Ensure key has necessary permissions',
        'Check key expiration date'
      ],
    };

    return suggestions[variable] || [
      'Check configuration documentation',
      'Verify the value format and requirements',
      'Contact system administrator if unsure'
    ];
  }

  private getSeverity(variable: string): 'critical' | 'warning' | 'info' {
    const criticalVariables = [
      'DATABASE_URL', 'ENCRYPTION_KEY', 'NEXTAUTH_SECRET', 'ZAI_API_KEY', 'OPENROUTER_API_KEY'
    ];

    const warningVariables = [
      'PORT', 'HOSTNAME', 'NEXTAUTH_URL', 'NEXT_PUBLIC_APP_URL'
    ];

    if (criticalVariables.includes(variable)) {
      return 'critical';
    } else if (warningVariables.includes(variable)) {
      return 'warning';
    } else {
      return 'info';
    }
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = [];
    
    // Add suggestions based on errors and warnings
    if (this.errors.length > 0) {
      suggestions.push('Critical configuration issues detected. Please review and fix immediately.');
    }

    if (this.warnings.length > 0) {
      suggestions.push('Configuration warnings detected. Consider addressing for optimal performance.');
    }

    // Add general best practice suggestions
    suggestions.push('Regularly review and update environment configurations');
    suggestions.push('Use environment-specific configuration files');
    suggestions.push('Implement proper secret management');
    suggestions.push('Monitor configuration changes and their impact');

    return [...new Set(suggestions)]; // Remove duplicates
  }

  private calculateConfidence(): number {
    const totalIssues = this.errors.length + this.warnings.length;
    const errorWeight = this.errors.length * 3;
    const warningWeight = this.warnings.length * 1;
    
    return Math.max(0, 1 - (errorWeight + warningWeight) / (totalIssues * 3));
  }

  // Get validated environment variables
  getValidatedEnv(): Record<string, any> {
    if (!this.validated) {
      throw new EnhancedError('Environment not yet validated. Call validate() first.');
    }

    const validated: Record<string, any> = {};
    
    // Return only validated variables
    Object.keys(process.env).forEach(key => {
      if (EnvironmentSchema.shape[key as keyof typeof EnvironmentSchema.shape]) {
        validated[key] = process.env[key];
      }
    });

    return validated;
  }

  // Check if a specific variable is valid
  isVariableValid(variable: string): boolean {
    return !this.errors.some(error => error.variable === variable) &&
           !this.warnings.some(warning => warning.variable === variable);
  }

  // Get validation report
  getValidationReport(): {
    timestamp: Date;
    valid: boolean;
    errorCount: number;
    warningCount: number;
    errors: EnvironmentValidationError[];
    warnings: EnvironmentValidationError[];
    suggestions: string[];
    confidence: number;
  } {
    return {
      timestamp: new Date(),
      valid: this.errors.length === 0,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.generateSuggestions(),
      confidence: this.calculateConfidence(),
    };
  }
}

// Global environment validator instance
const environmentValidator = new EnvironmentValidator();

// Validation middleware for Next.js applications
export const validateEnvironment = async (
  options: {
    throwOnError?: boolean;
    logResults?: boolean;
  } = {}
): Promise<{
  valid: boolean;
  errors: EnvironmentValidationError[];
  warnings: EnvironmentValidationError[];
  report?: any;
}> => {
  const { throwOnError = false, logResults = true } = options;

  try {
    const result = await environmentValidator.validate();

    if (logResults) {
      console.log('🔍 Environment Validation Results:');
      console.log(`✅ Valid: ${result.valid}`);
      console.log(`❌ Errors: ${result.errors.length}`);
      console.log(`⚠️  Warnings: ${result.warnings.length}`);
      console.log(`🎯 Confidence: ${Math.round(result.confidence * 100)}%`);

      if (result.errors.length > 0) {
        console.error('Critical Errors:');
        result.errors.forEach(error => {
          console.error(`  - ${error.variable}: ${error.message}`);
        });
      }

      if (result.warnings.length > 0) {
        console.warn('Warnings:');
        result.warnings.forEach(warning => {
          console.warn(`  - ${warning.variable}: ${warning.message}`);
        });
      }

      if (result.suggestions.length > 0) {
        console.log('💡 Suggestions:');
        result.suggestions.forEach(suggestion => {
          console.log(`  - ${suggestion}`);
        });
      }
    }

    if (throwOnError && !result.valid) {
      throw new EnhancedError(`Environment validation failed with ${result.errors.length} critical errors`);
    }

    return {
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
      report: environmentValidator.getValidationReport(),
    };

  } catch (error) {
    if (logResults) {
      console.error('Environment validation failed:', error);
    }

    if (throwOnError) {
      throw error;
    }

    return {
      valid: false,
      errors: [new EnvironmentValidationError(
        'system',
        null,
        'Environment validation system error',
        'System to be operational',
        ['Please try again later'],
        'critical'
      )],
      warnings: [],
    };
  }
};

// Export for direct usage
export { EnvironmentValidator, EnvironmentValidationError };
export default environmentValidator;
// Enhanced error class with better error handling
class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'EnhancedError';
    Error.captureStackTrace(this, EnhancedError);
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: this.stack
    };
  }
}
