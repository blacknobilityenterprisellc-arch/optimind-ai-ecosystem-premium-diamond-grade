/**
 * Domain Value Object - Email
 *
 * Represents an email address with validation and business rules.
 * This is an immutable value object that ensures email validity.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { ValidationError } from '@/lib/error-handler';

export class Email {
  private readonly _value: string;

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new ValidationError('Email is required');
    }

    const trimmedValue = value.trim();

    if (!this.isValidEmail(trimmedValue)) {
      throw new ValidationError('Invalid email format');
    }

    this._value = trimmedValue.toLowerCase();
  }

  get value(): string {
    return this._value;
  }

  get username(): string {
    return this._value.split('@')[0];
  }

  get domain(): string {
    return this._value.split('@')[1];
  }

  get isCorporate(): boolean {
    const corporateDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'protonmail.com',
      'zoho.com',
    ];

    return !corporateDomains.includes(this.domain);
  }

  get isDisposable(): boolean {
    const disposableDomains = [
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'tempmail.org',
      'throwawaymail.com',
      'yopmail.com',
    ];

    return disposableDomains.includes(this.domain);
  }

  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }

    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  toJSON(): string {
    return this._value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Factory method for creating email with additional validation
  static create(
    value: string,
    options?: {
      allowCorporate?: boolean;
      allowDisposable?: boolean;
      allowedDomains?: string[];
      blockedDomains?: string[];
    }
  ): Email {
    const email = new Email(value);

    if (options?.allowCorporate === false && email.isCorporate) {
      throw new ValidationError('Corporate emails are not allowed');
    }

    if (options?.allowDisposable === false && email.isDisposable) {
      throw new ValidationError('Disposable emails are not allowed');
    }

    if (options?.allowedDomains && !options.allowedDomains.includes(email.domain)) {
      throw new ValidationError('Email domain is not allowed');
    }

    if (options?.blockedDomains && options.blockedDomains.includes(email.domain)) {
      throw new ValidationError('Email domain is blocked');
    }

    return email;
  }

  // Static validation method
  static isValid(value: string): boolean {
    try {
      new Email(value);
      return true;
    } catch {
      return false;
    }
  }
}
