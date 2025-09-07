import { describe, expect, test } from "@jest/globals";

// Simple utility functions to test
const utils = {
  formatDate: (date: Date): string => {
    return date.toISOString().split("T")[0];
  },

  capitalize: (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
};

describe("Utility Functions", () => {
  describe("formatDate", () => {
    test("should format date correctly", () => {
      const date = new Date("2024-01-15T00:00:00.000Z");
      expect(utils.formatDate(date)).toBe("2024-01-15");
    });
  });

  describe("capitalize", () => {
    test("should capitalize first letter", () => {
      expect(utils.capitalize("hello")).toBe("Hello");
      expect(utils.capitalize("world")).toBe("World");
    });

    test("should handle empty string", () => {
      expect(utils.capitalize("")).toBe("");
    });

    test("should handle single character", () => {
      expect(utils.capitalize("a")).toBe("A");
    });
  });

  describe("isValidEmail", () => {
    test("should validate correct email addresses", () => {
      expect(utils.isValidEmail("test@example.com")).toBe(true);
      expect(utils.isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(utils.isValidEmail("user+tag@example.org")).toBe(true);
    });

    test("should reject invalid email addresses", () => {
      expect(utils.isValidEmail("invalid-email")).toBe(false);
      expect(utils.isValidEmail("@example.com")).toBe(false);
      expect(utils.isValidEmail("test@")).toBe(false);
      expect(utils.isValidEmail("")).toBe(false);
    });
  });

  describe("debounce", () => {
    test("should debounce function calls", () => {
      jest.useFakeTimers();

      const mockFn = jest.fn();
      const debouncedFn = utils.debounce(mockFn, 1000);

      // Call the debounced function multiple times
      debouncedFn("arg1");
      debouncedFn("arg2");
      debouncedFn("arg3");

      // Fast-forward time
      jest.advanceTimersByTime(1000);

      // Function should only be called once with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("arg3");

      jest.useRealTimers();
    });
  });
});
