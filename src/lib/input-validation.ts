
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

export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>"']/g, '');
};
