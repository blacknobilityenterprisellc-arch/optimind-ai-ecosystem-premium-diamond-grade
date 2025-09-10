// AI-Powered Input Validation System for OptiMind AI Ecosystem
import { z } from 'zod';
import { ZAI } from 'z-ai-web-dev-sdk';

// AI-enhanced validation error with detailed feedback
export class ValidationError extends Error {
  public readonly field: string;
  public readonly value: any;
  public readonly constraints: Record<string, string>;
  public readonly suggestions: string[];
  public readonly severity: 'error' | 'warning' | 'info';

  constructor(
    field: string,
    value: any,
    message: string,
    constraints: Record<string, string> = {},
    suggestions: string[] = [],
    severity: 'error' | 'warning' | 'info' = 'error'
  ) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.constraints = constraints;
    this.suggestions = suggestions;
    this.severity = severity;
  }

  toJSON() {
    return {
      name: this.name,
      field: this.field,
      value: this.value,
      message: this.message,
      constraints: this.constraints,
      suggestions: this.suggestions,
      severity: this.severity
    };
  }
}

// AI-powered validation context
interface ValidationContext {
  endpoint?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: number;
  requestSize?: number;
}

// Enhanced Zod schema with AI capabilities
export class AISchema<T = any> {
  private schema: z.ZodSchema<T>;
  private zai: ZAI | null = null;
  private context?: ValidationContext;

  constructor(schema: z.ZodSchema<T>, context?: ValidationContext) {
    this.schema = schema;
    this.context = context;
    this.initializeAI();
  }

  private async initializeAI() {
    try {
      this.zai = await ZAI.create();
    } catch (error) {
      console.warn('Failed to initialize ZAI for validation:', error);
    }
  }

  // Enhanced validation with AI-powered error analysis
  async validate(data: any, options: {
    strict?: boolean;
    aiEnhanced?: boolean;
    provideSuggestions?: boolean;
  } = {}): Promise<{
    success: boolean;
    data?: T;
    errors?: ValidationError[];
    warnings?: ValidationError[];
    suggestions?: string[];
    confidence?: number;
  }> {
    const { strict = false, aiEnhanced = true, provideSuggestions = true } = options;

    try {
      // Basic Zod validation
      const result = this.schema.safeParse(data);
      
      if (result.success) {
        return {
          success: true,
          data: result.data,
          confidence: 1.0
        };
      }

      const errors: ValidationError[] = [];
      const warnings: ValidationError[] = [];

      // Convert Zod errors to ValidationError
      result.error.errors.forEach((error) => {
        const validationError = new ValidationError(
          error.path.join('.'),
          error.message,
          `Validation failed for field "${error.path.join('.')}"`,
          {
            code: error.code,
            expected: error.expected,
            received: error.received
          },
          [],
          'error'
        );
        errors.push(validationError);
      });

      // AI-enhanced error analysis
      if (aiEnhanced && this.zai && errors.length > 0) {
        await this.enhanceErrorsWithAI(errors, warnings, data);
      }

      return {
        success: false,
        errors,
        warnings,
        suggestions: provideSuggestions ? this.generateSuggestions(errors, data) : [],
        confidence: this.calculateConfidence(errors, warnings)
      };

    } catch (error) {
      return {
        success: false,
        errors: [new ValidationError(
          'system',
          data,
          'Validation system error occurred',
          {},
          ['Please try again later'],
          'error'
        )],
        confidence: 0.0
      };
    }
  }

  private async enhanceErrorsWithAI(
    errors: ValidationError[],
    warnings: ValidationError[],
    originalData: any
  ) {
    try {
      const errorAnalysis = await this.zai!.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI validation expert. Analyze validation errors and provide:
            1. Detailed explanations of what went wrong
            2. Specific suggestions to fix each error
            3. Severity assessment (error/warning/info)
            4. Confidence in the analysis (0-1)
            
            Respond in JSON format with the following structure:
            {
              "analysis": [
                {
                  "field": "field_name",
                  "explanation": "detailed explanation",
                  "suggestions": ["suggestion1", "suggestion2"],
                  "severity": "error|warning|info",
                  "confidence": 0.8
                }
              ]
            }`
          },
          {
            role: 'user',
            content: `Analyze these validation errors:
            Errors: ${JSON.stringify(errors.map(e => ({ field: e.field, message: e.message })))}
            Original Data: ${JSON.stringify(originalData, null, 2)}
            Context: ${JSON.stringify(this.context)}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      });

      const analysis = JSON.parse(errorAnalysis.choices[0]?.message?.content || '{}');
      
      if (analysis.analysis) {
        analysis.analysis.forEach((item: any) => {
          const error = errors.find(e => e.field === item.field);
          if (error) {
            error.suggestions = item.suggestions || [];
            error.constraints.explanation = item.explanation;
            error.severity = item.severity || 'error';
          }
        });
      }

    } catch (error) {
      console.warn('AI error analysis failed:', error);
    }
  }

  private generateSuggestions(errors: ValidationError[], data: any): string[] {
    const suggestions: string[] = [];
    
    errors.forEach(error => {
      suggestions.push(...error.suggestions);
      
      // Generate contextual suggestions based on field type
      if (error.field.includes('email')) {
        suggestions.push('Ensure email format is valid (e.g., user@example.com)');
      }
      if (error.field.includes('password')) {
        suggestions.push('Password should be at least 8 characters with mixed case, numbers, and symbols');
      }
      if (error.field.includes('url')) {
        suggestions.push('URL should include protocol (http:// or https://)');
      }
    });

    return [...new Set(suggestions)]; // Remove duplicates
  }

  private calculateConfidence(errors: ValidationError[], warnings: ValidationError[]): number {
    const totalIssues = errors.length + warnings.length;
    const errorWeight = errors.length * 2;
    const warningWeight = warnings.length * 1;
    
    return Math.max(0, 1 - (errorWeight + warningWeight) / (totalIssues * 2));
  }
}

// Pre-built validation schemas for common use cases
export const ValidationSchemas = {
  // User authentication schemas
  Auth: {
    Login: new AISchema(z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters')
    })),
    
    Register: new AISchema(z.object({
      email: z.string().email('Invalid email format'),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      role: z.enum(['user', 'admin', 'moderator']).optional()
    })),
    
    PIN: new AISchema(z.object({
      pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d{4}$/, 'PIN must contain only digits')
    }))
  },

  // API request schemas
  API: {
    Pagination: new AISchema(z.object({
      page: z.number().int().min(1, 'Page must be at least 1').optional().default(1),
      limit: z.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional().default(20),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
    })),
    
    Search: new AISchema(z.object({
      query: z.string().min(1, 'Search query is required').max(500, 'Search query too long'),
      filters: z.record(z.any()).optional(),
      page: z.number().int().min(1).optional().default(1),
      limit: z.number().int().min(1).max(100).optional().default(20)
    })),
    
    FileUpload: new AISchema(z.object({
      file: z.any().refine(val => val && val.size > 0, 'File is required'),
      type: z.string().optional(),
      description: z.string().max(500, 'Description too long').optional()
    }))
  },

  // Blockchain-related schemas
  Blockchain: {
    NFTMetadata: new AISchema(z.object({
      name: z.string().min(1, 'NFT name is required').max(100, 'NFT name too long'),
      description: z.string().min(1, 'Description is required').max(1000, 'Description too long'),
      image: z.string().url('Invalid image URL'),
      attributes: z.array(z.object({
        trait_type: z.string(),
        value: z.union([z.string(), z.number()])
      })).optional(),
      external_url: z.string().url('Invalid external URL').optional()
    })),
    
    Transaction: new AISchema(z.object({
      to: z.string().min(1, 'Recipient address is required'),
      amount: z.number().positive('Amount must be positive'),
      gasLimit: z.number().positive('Gas limit must be positive').optional(),
      gasPrice: z.number().positive('Gas price must be positive').optional()
    }))
  },

  // AI service schemas
  AI: {
    Chat: new AISchema(z.object({
      message: z.string().min(1, 'Message is required').max(4000, 'Message too long'),
      model: z.string().optional(),
      temperature: z.number().min(0).max(2).optional(),
      maxTokens: z.number().int().min(1).max(4000).optional()
    })),
    
    ImageGeneration: new AISchema(z.object({
      prompt: z.string().min(1, 'Prompt is required').max(1000, 'Prompt too long'),
      size: z.enum(['256x256', '512x512', '1024x1024']).optional().default('512x512'),
      style: z.string().optional(),
      quality: z.enum(['standard', 'hd']).optional().default('standard')
    })),
    
    CodeAnalysis: new AISchema(z.object({
      code: z.string().min(1, 'Code is required').max(10000, 'Code too long'),
      language: z.string().optional(),
      analysisType: z.enum(['security', 'performance', 'quality', 'bugs']).optional()
    }))
  }
};

// Middleware for Next.js API routes
export const withValidation = (
  schema: AISchema<any>,
  options: {
    source?: 'body' | 'query' | 'params';
    strict?: boolean;
    aiEnhanced?: boolean;
    errorHandler?: (errors: ValidationError[], req: Request) => Response;
  } = {}
) => {
  return async (req: Request): Promise<{ success: boolean; data?: any; response?: Response }> => {
    const { source = 'body', strict = false, aiEnhanced = true } = options;
    
    try {
      // Extract data based on source
      let data: any;
      
      if (source === 'body') {
        data = await req.json().catch(() => ({}));
      } else if (source === 'query') {
        const url = new URL(req.url);
        data = Object.fromEntries(url.searchParams);
      } else if (source === 'params') {
        // For params, you'd need to extract from the URL pattern
        data = {};
      }

      // Validate data
      const result = await schema.validate(data, {
        strict,
        aiEnhanced,
        provideSuggestions: true
      });

      if (result.success) {
        return { success: true, data: result.data };
      }

      // Handle validation errors
      if (options.errorHandler) {
        const response = options.errorHandler(result.errors!, req);
        return { success: false, response };
      }

      const response = new Response(JSON.stringify({
        error: 'Validation failed',
        errors: result.errors?.map(e => e.toJSON()),
        warnings: result.warnings?.map(w => w.toJSON()),
        suggestions: result.suggestions,
        confidence: result.confidence
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });

      return { success: false, response };

    } catch (error) {
      const response = new Response(JSON.stringify({
        error: 'Validation system error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });

      return { success: false, response };
    }
  };
};

// Utility functions
export const ValidationUtils = {
  // Sanitize input data
  sanitize: (data: any): any => {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sanitized: any = Array.isArray(data) ? [] : {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        // Basic string sanitization
        sanitized[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '');
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = ValidationUtils.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate URL format
  isValidURL: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate password strength
  isStrongPassword: (password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Password should be at least 8 characters long');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Password should contain lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Password should contain uppercase letters');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Password should contain numbers');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Password should contain special characters');

    return {
      isStrong: score >= 4,
      score,
      feedback
    };
  }
};

export default AISchema;