/**
 * Authentication Service for OptiMind AI Ecosystem
 * Basic authentication utilities
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "USER" | "ADMIN" | "MODERATOR" | "DEVELOPER";
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isActive: boolean;
}

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async validateToken(token: string): Promise<User | null> {
    // Basic token validation - in production, use proper JWT validation
    try {
      // For now, return a mock user for testing
      return {
        id: "1",
        email: "user@example.com",
        name: "Test User",
        role: "USER",
      };
    } catch (error) {
      console.error("Token validation error:", error);
      return null;
    }
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    // In production, this would create a user in the database
    return {
      id: Math.random().toString(36).slice(2, 11),
      ...userData,
    };
  }

  async createSession(userId: string): Promise<Session> {
    // In production, this would create a session in the database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    return {
      id: Math.random().toString(36).slice(2, 11),
      userId,
      token: Math.random().toString(36).slice(2, 34),
      expiresAt,
      isActive: true,
    };
  }

  async invalidateSession(sessionId: string): Promise<boolean> {
    // In production, this would invalidate the session in the database
    return true;
  }
}

export const authService = AuthService.getInstance();
