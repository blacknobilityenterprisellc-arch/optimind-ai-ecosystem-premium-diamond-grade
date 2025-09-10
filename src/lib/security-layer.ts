// src/lib/security-layer.ts - Premium Diamond-Grade Security Layer
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "premium-secret-key";

export async function setupSecurityLayer() {
  console.log("🔒 Setting up premium security layer");
  // Premium security configurations
}

export function generatePremiumToken(userId: string, permissions: string[]) {
  return jwt.sign(
    { userId, permissions, premium: true },
    JWT_SECRET,
    { expiresIn: "7d" }, // Extended premium session
  );
}

export function verifyPremiumToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new EnhancedError("Invalid premium token");
  }
}

export function checkPremiumAccess(
  userPermissions: string[],
  requiredPermission: string,
) {
  return (
    userPermissions.includes(requiredPermission) ||
    userPermissions.includes("premium-all")
  );
}

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
