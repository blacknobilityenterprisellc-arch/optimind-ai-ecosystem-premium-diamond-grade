
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

// Export the ValidationSchemas that are being imported
export const ValidationSchemas = {
  ...commonSchemas,
  pin: z.string().length(4, 'PIN must be 4 digits'),
  message: z.string().min(1, 'Message cannot be empty'),
  content: z.string().min(1, 'Content cannot be empty')
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

// Export the missing EnhancedError class
export class EnhancedError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'EnhancedError';
  }
}

// Export the missing withValidation function
export const withValidation = (schema: z.ZodSchema<any>) => {
  return (handler: any) => {
    return async (req: any, res: any, ...args: any[]) => {
      try {
        const validatedData = validateInput(schema, req.body || req.query || req.params);
        req.validatedData = validatedData;
        return handler(req, res, ...args);
      } catch (error) {
        if (error instanceof EnhancedError) {
          return res.status(400).json({ error: error.message, code: error.code });
        }
        return res.status(400).json({ error: 'Validation failed' });
      }
    };
  };
};
