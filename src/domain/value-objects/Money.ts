/**
 * Domain Value Object - Money
 *
 * Represents monetary values with proper precision and currency handling.
 * This is an immutable value object that ensures accurate financial calculations.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import { ValidationError } from "@/lib/error-handler";

export class Money {
  private readonly _amount: number; // Stored in cents (smallest currency unit)
  private readonly _currency: string;

  constructor(amount: number, currency: string = "USD") {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new ValidationError("Amount must be a valid number");
    }

    if (!Number.isInteger(amount)) {
      throw new ValidationError(
        "Amount must be an integer (representing cents)",
      );
    }

    if (amount < 0) {
      throw new ValidationError("Amount cannot be negative");
    }

    if (!currency || typeof currency !== "string") {
      throw new ValidationError("Currency is required");
    }

    if (!this.isValidCurrency(currency)) {
      throw new ValidationError("Invalid currency code");
    }

    this._amount = amount;
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  get amountInDollars(): number {
    return this._amount / 100;
  }

  get formattedAmount(): string {
    return this.format();
  }

  // Factory method for creating from decimal amount
  static fromDecimal(amount: number, currency: string = "USD"): Money {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new ValidationError("Amount must be a valid number");
    }

    const cents = Math.round(amount * 100);
    return new Money(cents, currency);
  }

  // Factory method for creating from string
  static fromString(amount: string, currency: string = "USD"): Money {
    const decimalAmount = parseFloat(amount);
    if (isNaN(decimalAmount)) {
      throw new ValidationError("Invalid amount string");
    }
    return Money.fromDecimal(decimalAmount, currency);
  }

  // Arithmetic operations
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    if (this._amount < other._amount) {
      throw new ValidationError("Insufficient funds for subtraction");
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    if (typeof factor !== "number" || isNaN(factor) || factor < 0) {
      throw new ValidationError("Multiplier must be a non-negative number");
    }
    return new Money(Math.round(this._amount * factor), this._currency);
  }

  divide(divisor: number): Money {
    if (typeof divisor !== "number" || isNaN(divisor) || divisor <= 0) {
      throw new ValidationError("Divisor must be a positive number");
    }
    return new Money(Math.round(this._amount / divisor), this._currency);
  }

  percentage(percentage: number): Money {
    if (typeof percentage !== "number" || isNaN(percentage) || percentage < 0) {
      throw new ValidationError("Percentage must be a non-negative number");
    }
    return new Money(
      Math.round((this._amount * percentage) / 100),
      this._currency,
    );
  }

  // Comparison operations
  equals(other: Money): boolean {
    if (!(other instanceof Money)) {
      return false;
    }

    return this._amount === other._amount && this._currency === other._currency;
  }

  greaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount > other._amount;
  }

  greaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount >= other._amount;
  }

  lessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount < other._amount;
  }

  lessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._amount <= other._amount;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  isPositive(): boolean {
    return this._amount > 0;
  }

  // Formatting
  format(locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: this._currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.amountInDollars);
  }

  formatWithoutCurrency(locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(this.amountInDollars);
  }

  // Currency conversion (placeholder - would use exchange rate service in real implementation)
  convertTo(targetCurrency: string, exchangeRate: number): Money {
    if (!this.isValidCurrency(targetCurrency)) {
      throw new ValidationError("Invalid target currency");
    }

    if (
      typeof exchangeRate !== "number" ||
      isNaN(exchangeRate) ||
      exchangeRate <= 0
    ) {
      throw new ValidationError("Exchange rate must be a positive number");
    }

    const convertedAmount = Math.round(this._amount * exchangeRate);
    return new Money(convertedAmount, targetCurrency);
  }

  // Utility methods
  toDecimal(): number {
    return this.amountInDollars;
  }

  toJSON(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  toString(): string {
    return this.format();
  }

  // Private helper methods
  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new ValidationError(
        "Cannot perform operations on different currencies",
      );
    }
  }

  private isValidCurrency(currency: string): boolean {
    const validCurrencies = [
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "CAD",
      "AUD",
      "CHF",
      "CNY",
      "SEK",
      "NZD",
      "MXN",
      "SGD",
      "HKD",
      "NOK",
      "KRW",
      "TRY",
      "RUB",
      "INR",
      "BRL",
      "ZAR",
      "DKK",
      "PLN",
      "THB",
      "IDR",
    ];

    return validCurrencies.includes(currency.toUpperCase());
  }

  // Static utility methods
  static zero(currency: string = "USD"): Money {
    return new Money(0, currency);
  }

  static min(...monies: Money[]): Money {
    if (monies.length === 0) {
      throw new ValidationError("At least one money object is required");
    }

    const firstCurrency = monies[0].currency;
    if (!monies.every((m) => m.currency === firstCurrency)) {
      throw new ValidationError(
        "All money objects must have the same currency",
      );
    }

    return monies.reduce((min, current) =>
      current.lessThan(min) ? current : min,
    );
  }

  static max(...monies: Money[]): Money {
    if (monies.length === 0) {
      throw new ValidationError("At least one money object is required");
    }

    const firstCurrency = monies[0].currency;
    if (!monies.every((m) => m.currency === firstCurrency)) {
      throw new ValidationError(
        "All money objects must have the same currency",
      );
    }

    return monies.reduce((max, current) =>
      current.greaterThan(max) ? current : max,
    );
  }

  static sum(...monies: Money[]): Money {
    if (monies.length === 0) {
      throw new ValidationError("At least one money object is required");
    }

    const firstCurrency = monies[0].currency;
    if (!monies.every((m) => m.currency === firstCurrency)) {
      throw new ValidationError(
        "All money objects must have the same currency",
      );
    }

    return monies.reduce(
      (sum, current) => sum.add(current),
      Money.zero(firstCurrency),
    );
  }
}
