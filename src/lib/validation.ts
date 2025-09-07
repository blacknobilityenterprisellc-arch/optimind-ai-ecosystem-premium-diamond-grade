/**
 * Diamond-Grade Validation System
 *
 * Comprehensive validation system with type-safe validation rules,
 * custom validators, and validation error handling.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { ValidationError } from '@/lib/error-handler';

// Validation rule interface
export interface ValidationRule<T = any> {
  name: string;
  validate: (value: T) => boolean | Promise<boolean>;
  message: string | ((value: T) => string);
  optional?: boolean;
}

// Validation context interface
export interface ValidationContext {
  field: string;
  value: any;
  data: Record<string, any>;
  path: string;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

// Validation warning interface
export interface ValidationWarning {
  field: string;
  message: string;
  value: any;
  severity: 'low' | 'medium' | 'high';
}

// Validation schema interface
export interface ValidationSchema<T = any> {
  [key: string]: ValidationRule | ValidationRule[];
}

// Built-in validation rules
export class ValidationRules {
  // Required field validation
  static required(message: string = 'This field is required'): ValidationRule {
    return {
      name: 'required',
      validate: value => value !== null && value !== undefined && value !== '',
      message,
    };
  }

  // String validation
  static string(message: string = 'Must be a string'): ValidationRule {
    return {
      name: 'string',
      validate: value => typeof value === 'string',
      message,
    };
  }

  // Number validation
  static number(message: string = 'Must be a number'): ValidationRule {
    return {
      name: 'number',
      validate: value => typeof value === 'number' && !isNaN(value),
      message,
    };
  }

  // Email validation
  static email(message: string = 'Must be a valid email address'): ValidationRule {
    return {
      name: 'email',
      validate: value => {
        if (typeof value !== 'string') return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message,
    };
  }

  // Min length validation
  static minLength(min: number, message?: string): ValidationRule {
    return {
      name: 'minLength',
      validate: value => {
        if (typeof value !== 'string') return false;
        return value.length >= min;
      },
      message: message || `Must be at least ${min} characters long`,
    };
  }

  // Max length validation
  static maxLength(max: number, message?: string): ValidationRule {
    return {
      name: 'maxLength',
      validate: value => {
        if (typeof value !== 'string') return false;
        return value.length <= max;
      },
      message: message || `Must be no more than ${max} characters long`,
    };
  }

  // Range validation
  static range(min: number, max: number, message?: string): ValidationRule {
    return {
      name: 'range',
      validate: value => {
        if (typeof value !== 'number') return false;
        return value >= min && value <= max;
      },
      message: message || `Must be between ${min} and ${max}`,
    };
  }

  // Pattern validation
  static pattern(pattern: RegExp, message: string): ValidationRule {
    return {
      name: 'pattern',
      validate: value => {
        if (typeof value !== 'string') return false;
        return pattern.test(value);
      },
      message,
    };
  }

  // Enum validation
  static enum<T extends string>(values: T[], message?: string): ValidationRule {
    return {
      name: 'enum',
      validate: value => values.includes(value),
      message: message || `Must be one of: ${values.join(', ')}`,
    };
  }

  // Custom validation
  static custom<T = any>(
    validate: (value: T) => boolean | Promise<boolean>,
    message: string | ((value: T) => string)
  ): ValidationRule<T> {
    return {
      name: 'custom',
      validate,
      message,
    };
  }

  // Array validation
  static array(message: string = 'Must be an array'): ValidationRule {
    return {
      name: 'array',
      validate: value => Array.isArray(value),
      message,
    };
  }

  // Object validation
  static object(message: string = 'Must be an object'): ValidationRule {
    return {
      name: 'object',
      validate: value => typeof value === 'object' && value !== null && !Array.isArray(value),
      message,
    };
  }

  // Boolean validation
  static boolean(message: string = 'Must be a boolean'): ValidationRule {
    return {
      name: 'boolean',
      validate: value => typeof value === 'boolean',
      message,
    };
  }

  // Date validation
  static date(message: string = 'Must be a valid date'): ValidationRule {
    return {
      name: 'date',
      validate: value => {
        return value instanceof Date || !isNaN(Date.parse(value));
      },
      message,
    };
  }

  // URL validation
  static url(message: string = 'Must be a valid URL'): ValidationRule {
    return {
      name: 'url',
      validate: value => {
        if (typeof value !== 'string') return false;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message,
    };
  }

  // Password strength validation
  static passwordStrength(
    message: string = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  ): ValidationRule {
    return {
      name: 'passwordStrength',
      validate: value => {
        if (typeof value !== 'string') return false;
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const hasMinLength = value.length >= 8;

        return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
      },
      message,
    };
  }

  // Username validation
  static username(
    message: string = 'Username must be 3-20 characters with letters, numbers, and underscores only'
  ): ValidationRule {
    return {
      name: 'username',
      validate: value => {
        if (typeof value !== 'string') return false;
        return /^[a-zA-Z0-9_]{3,20}$/.test(value);
      },
      message,
    };
  }

  // Phone number validation
  static phone(message: string = 'Must be a valid phone number'): ValidationRule {
    return {
      name: 'phone',
      validate: value => {
        if (typeof value !== 'string') return false;
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
      },
      message,
    };
  }

  // Credit card validation
  static creditCard(message: string = 'Must be a valid credit card number'): ValidationRule {
    return {
      name: 'creditCard',
      validate: value => {
        if (typeof value !== 'string') return false;
        const cleanNumber = value.replace(/\D/g, '');

        // Luhn algorithm
        let sum = 0;
        let isEven = false;

        for (let i = cleanNumber.length - 1; i >= 0; i--) {
          let digit = parseInt(cleanNumber[i]);

          if (isEven) {
            digit *= 2;
            if (digit > 9) {
              digit -= 9;
            }
          }

          sum += digit;
          isEven = !isEven;
        }

        return sum % 10 === 0 && cleanNumber.length >= 13 && cleanNumber.length <= 19;
      },
      message,
    };
  }

  // File validation
  static file(allowedTypes: string[], maxSize: number, message?: string): ValidationRule {
    return {
      name: 'file',
      validate: value => {
        if (!(value instanceof File)) return false;

        if (value.size > maxSize) {
          return false;
        }

        const fileExtension = value.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !allowedTypes.includes(fileExtension)) {
          return false;
        }

        return true;
      },
      message:
        message ||
        `File must be one of: ${allowedTypes.join(', ')} and less than ${maxSize / 1024 / 1024}MB`,
    };
  }
}

// Validator class
export class Validator {
  private schema: ValidationSchema;
  private warnings: ValidationWarning[] = [];

  constructor(schema: ValidationSchema) {
    this.schema = schema;
  }

  // Validate data against schema
  async validate(
    data: Record<string, any>,
    options?: {
      strict?: boolean;
      stopOnFirstError?: boolean;
      includeWarnings?: boolean;
    }
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    this.warnings = [];

    const strict = options?.strict ?? false;
    const stopOnFirstError = options?.stopOnFirstError ?? false;

    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field];
      const fieldRules = Array.isArray(rules) ? rules : [rules];

      for (const rule of fieldRules) {
        // Skip validation for optional fields if value is empty
        if (rule.optional && (value === null || value === undefined || value === '')) {
          continue;
        }

        try {
          const isValid = await Promise.resolve(rule.validate(value));

          if (!isValid) {
            const message = typeof rule.message === 'function' ? rule.message(value) : rule.message;

            errors.push(new ValidationError(message, field));

            if (stopOnFirstError) {
              break;
            }
          }
        } catch (error) {
          errors.push(new ValidationError(`Validation failed: ${error}`, field));

          if (stopOnFirstError) {
            break;
          }
        }
      }

      if (stopOnFirstError && errors.length > 0) {
        break;
      }
    }

    // Check for unknown fields in strict mode
    if (strict) {
      const knownFields = Object.keys(this.schema);
      const unknownFields = Object.keys(data).filter(field => !knownFields.includes(field));

      for (const field of unknownFields) {
        errors.push(new ValidationError(`Unknown field: ${field}`, field));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: options?.includeWarnings ? this.warnings : [],
    };
  }

  // Add warning
  addWarning(
    field: string,
    message: string,
    value: any,
    severity: 'low' | 'medium' | 'high' = 'medium'
  ): void {
    this.warnings.push({
      field,
      message,
      value,
      severity,
    });
  }

  // Validate single field
  async validateField(field: string, value: any): Promise<ValidationResult> {
    const rules = this.schema[field];
    if (!rules) {
      return {
        isValid: false,
        errors: [new ValidationError(`Unknown field: ${field}`, field)],
        warnings: [],
      };
    }

    const fieldRules = Array.isArray(rules) ? rules : [rules];
    const errors: ValidationError[] = [];

    for (const rule of fieldRules) {
      if (rule.optional && (value === null || value === undefined || value === '')) {
        continue;
      }

      try {
        const isValid = await Promise.resolve(rule.validate(value));

        if (!isValid) {
          const message = typeof rule.message === 'function' ? rule.message(value) : rule.message;

          errors.push(new ValidationError(message, field));
        }
      } catch (error) {
        errors.push(new ValidationError(`Validation failed: ${error}`, field));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }

  // Create partial validator
  partial(fields: string[]): Validator {
    const partialSchema: ValidationSchema = {};

    for (const field of fields) {
      if (this.schema[field]) {
        partialSchema[field] = this.schema[field];
      }
    }

    return new Validator(partialSchema);
  }
}

// Schema builder
export class SchemaBuilder {
  private schema: ValidationSchema = {};

  // Add field to schema
  field(name: string, rules: ValidationRule | ValidationRule[]): SchemaBuilder {
    this.schema[name] = rules;
    return this;
  }

  // Add required string field
  requiredString(
    name: string,
    options?: {
      min?: number;
      max?: number;
      pattern?: RegExp;
      message?: string;
    }
  ): SchemaBuilder {
    const rules: ValidationRule[] = [ValidationRules.required()];

    if (options?.min !== undefined) {
      rules.push(ValidationRules.minLength(options.min));
    }

    if (options?.max !== undefined) {
      rules.push(ValidationRules.maxLength(options.max));
    }

    if (options?.pattern) {
      rules.push(ValidationRules.pattern(options.pattern, options?.message || 'Invalid format'));
    }

    this.schema[name] = rules;
    return this;
  }

  // Add email field
  email(name: string, required: boolean = true): SchemaBuilder {
    const rules: ValidationRule[] = [];

    if (required) {
      rules.push(ValidationRules.required());
    }

    rules.push(ValidationRules.email());
    this.schema[name] = rules;
    return this;
  }

  // Add password field
  password(name: string, required: boolean = true): SchemaBuilder {
    const rules: ValidationRule[] = [];

    if (required) {
      rules.push(ValidationRules.required());
    }

    rules.push(ValidationRules.passwordStrength());
    this.schema[name] = rules;
    return this;
  }

  // Add number field
  number(
    name: string,
    options?: {
      required?: boolean;
      min?: number;
      max?: number;
      message?: string;
    }
  ): SchemaBuilder {
    const rules: ValidationRule[] = [];

    if (options?.required) {
      rules.push(ValidationRules.required());
    }

    rules.push(ValidationRules.number());

    if (options?.min !== undefined && options?.max !== undefined) {
      rules.push(ValidationRules.range(options.min, options.max, options?.message));
    }

    this.schema[name] = rules;
    return this;
  }

  // Add enum field
  enum<T extends string>(name: string, values: T[], required: boolean = true): SchemaBuilder {
    const rules: ValidationRule[] = [];

    if (required) {
      rules.push(ValidationRules.required());
    }

    rules.push(ValidationRules.enum(values));
    this.schema[name] = rules;
    return this;
  }

  // Build schema
  build(): ValidationSchema {
    return { ...this.schema };
  }

  // Build validator
  buildValidator(): Validator {
    return new Validator(this.schema);
  }
}

// Pre-built schemas
export const Schemas = {
  // User registration schema
  userRegistration: () =>
    new SchemaBuilder()
      .requiredString('email')
      .email('email')
      .requiredString('username')
      .password('password')
      .requiredString('firstName')
      .requiredString('lastName')
      .enum('role', ['user', 'admin', 'moderator', 'analyst'], false)
      .build(),

  // User login schema
  userLogin: () => new SchemaBuilder().requiredString('email').requiredString('password').build(),

  // Content creation schema
  contentCreation: () =>
    new SchemaBuilder()
      .requiredString('title')
      .requiredString('content')
      .enum('type', [
        'blog',
        'article',
        'product-description',
        'social-media',
        'email',
        'documentation',
      ])
      .enum('status', ['draft', 'published', 'archived'], false)
      .array('tags', false)
      .build(),

  // AI request schema
  aiRequest: () =>
    new SchemaBuilder()
      .requiredString('prompt')
      .enum('model', ['gpt-3.5-turbo', 'gpt-4', 'claude-3-opus', 'gemini-pro'], false)
      .number('temperature', { required: false, min: 0, max: 2 })
      .number('maxTokens', { required: false, min: 1, max: 8000 })
      .build(),
};

// Export all validation utilities
export { Validator, SchemaBuilder, ValidationRules, Schemas };
