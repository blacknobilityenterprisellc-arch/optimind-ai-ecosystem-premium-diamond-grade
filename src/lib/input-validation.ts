
// AI-Generated Input Validation
import { z } from 'zod';

export const commonSchemas = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  id: z.string().cuid(),
  url: z.string().url('Invalid URL'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
};

// AI Chat Validation Schema
export const AISchemas = {
  Chat: z.object({
    messages: z.array(z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string().min(1, 'Message content is required')
    })).min(1, 'At least one message is required'),
    model: z.string().optional().default('gpt-4'),
    temperature: z.number().min(0).max(2).optional().default(0.7),
    maxTokens: z.number().min(1).max(8000).optional().default(1000)
  })
};

// Content Generation Validation Schema
export const ContentSchemas = {
  Generate: z.object({
    topic: z.string().min(1, 'Topic is required'),
    contentType: z.enum(['blog', 'article', 'social', 'email', 'product', 'essay']),
    tone: z.enum(['professional', 'casual', 'formal', 'friendly', 'humorous']).optional().default('professional'),
    length: z.enum(['short', 'medium', 'long']).optional().default('medium'),
    keywords: z.array(z.string()).optional().default([]),
    targetAudience: z.string().optional().default('general audience')
  })
};

// Complete ValidationSchemas export
export const ValidationSchemas = {
  AI: AISchemas,
  Content: ContentSchemas,
  Common: commonSchemas
};

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new EnhancedError(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"']/g, '');
};

// Enhanced Error class
export class EnhancedError extends Error {
  constructor(
    message: string,
    public code: string = 'VALIDATION_ERROR',
    public statusCode: number = 400,
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
