import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import ZAI from 'z-ai-web-dev-sdk';

const prisma = new PrismaClient();

// Enterprise-grade authentication service
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
  private readonly jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
  private readonly refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
  private readonly bcryptRounds = 12;

  // User registration with enhanced security
  async registerUser(userData: {
    email: string;
    password: string;
    name?: string;
    role?: string;
    tenantId?: string;
    securityLevel?: string;
  }): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      // Validate input
      const validation = this.validateUserData(userData);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        return { success: false, error: 'User already exists' };
      }

      // Hash password with enhanced security
      const hashedPassword = await hash(userData.password, this.bcryptRounds);

      // Create user with enterprise-grade defaults
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name || '',
          role: userData.role || 'USER',
          tenantId: userData.tenantId,
          securityLevel: userData.securityLevel || 'standard',
          emailVerified: false,
          isActive: true,
          isPremium: false,
          theme: 'light',
          language: 'en',
          timezone: 'UTC',
          notifications: true,
          metadata: {
            createdAt: new Date().toISOString(),
            registrationSource: 'web',
            securityLevel: userData.securityLevel || 'standard'
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          emailVerified: true,
          securityLevel: true,
          createdAt: true
        }
      });

      // Generate initial API key
      const apiKey = await this.generateApiKey(user.id);

      // Log security event
      await this.logSecurityEvent({
        userId: user.id,
        action: 'USER_REGISTERED',
        resource: 'user',
        status: 'SUCCESS',
        metadata: {
          email: userData.email,
          role: userData.role,
          securityLevel: userData.securityLevel
        }
      });

      return { success: true, user: { ...user, apiKey } };

    } catch (error) {
      console.error('User registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  // User login with enhanced security
  async loginUser(credentials: {
    email: string;
    password: string;
    mfaToken?: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ success: boolean; user?: any; tokens?: any; error?: string }> {
    try {
      // Find user with security checks
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        include: {
          tenant: true,
          sessions: {
            where: { status: 'active' },
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!user) {
        await this.logFailedLoginAttempt(credentials.email, credentials.ipAddress, 'USER_NOT_FOUND');
        return { success: false, error: 'Invalid credentials' };
      }

      if (!user.isActive) {
        await this.logFailedLoginAttempt(credentials.email, credentials.ipAddress, 'USER_INACTIVE');
        return { success: false, error: 'Account is inactive' };
      }

      // Verify password
      const isPasswordValid = await compare(credentials.password, user.password);
      if (!isPasswordValid) {
        await this.logFailedLoginAttempt(credentials.email, credentials.ipAddress, 'INVALID_PASSWORD');
        return { success: false, error: 'Invalid credentials' };
      }

      // MFA verification if enabled
      if (user.mfaEnabled) {
        if (!credentials.mfaToken) {
          return { success: false, error: 'MFA token required' };
        }

        const mfaValid = await this.verifyMFA(user, credentials.mfaToken);
        if (!mfaValid) {
          await this.logFailedLoginAttempt(credentials.email, credentials.ipAddress, 'INVALID_MFA');
          return { success: false, error: 'Invalid MFA token' };
        }
      }

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Create session
      const session = await this.createSession(user.id, tokens.accessToken, {
        ipAddress: credentials.ipAddress,
        userAgent: credentials.userAgent
      });

      // Update user's last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Log successful login
      await this.logSecurityEvent({
        userId: user.id,
        tenantId: user.tenantId,
        action: 'USER_LOGIN',
        resource: 'authentication',
        status: 'SUCCESS',
        ipAddress: credentials.ipAddress,
        userAgent: credentials.userAgent,
        metadata: {
          mfaUsed: user.mfaEnabled,
          sessionType: 'web',
          securityLevel: user.securityLevel
        }
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          securityLevel: user.securityLevel,
          tenant: user.tenant
        },
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: tokens.expiresIn,
          sessionExpiresAt: session.expiresAt
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  // Token refresh
  async refreshToken(refreshToken: string): Promise<{ success: boolean; tokens?: any; error?: string }> {
    try {
      // Verify refresh token
      const decoded = verify(refreshToken, this.jwtSecret) as any;
      
      if (decoded.type !== 'refresh') {
        return { success: false, error: 'Invalid refresh token' };
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { tenant: true }
      });

      if (!user || !user.isActive) {
        return { success: false, error: 'User not found or inactive' };
      }

      // Check if refresh token is still valid
      const session = await prisma.session.findFirst({
        where: {
          userId: user.id,
          refreshToken: refreshToken,
          status: 'active',
          expiresAt: { gt: new Date() }
        }
      });

      if (!session) {
        return { success: false, error: 'Invalid or expired refresh token' };
      }

      // Generate new tokens
      const newTokens = await this.generateTokens(user);

      // Update session
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          lastUsedAt: new Date()
        }
      });

      return {
        success: true,
        tokens: {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          expiresIn: newTokens.expiresIn
        }
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return { success: false, error: 'Token refresh failed' };
    }
  }

  // Logout user
  async logoutUser(accessToken: string, refreshToken?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify access token
      const decoded = verify(accessToken, this.jwtSecret) as any;
      
      // Invalidate session
      await prisma.session.updateMany({
        where: {
          userId: decoded.userId,
          token: accessToken,
          status: 'active'
        },
        data: {
          status: 'revoked',
          updatedAt: new Date()
        }
      });

      // Also invalidate refresh token if provided
      if (refreshToken) {
        await prisma.session.updateMany({
          where: {
            userId: decoded.userId,
            refreshToken: refreshToken,
            status: 'active'
          },
          data: {
            status: 'revoked',
            updatedAt: new Date()
          }
        });
      }

      // Log security event
      await this.logSecurityEvent({
        userId: decoded.userId,
        action: 'USER_LOGOUT',
        resource: 'authentication',
        status: 'SUCCESS'
      });

      return { success: true };

    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  // MFA setup
  async setupMFA(userId: string): Promise<{ success: boolean; secret?: string; qrCode?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Generate MFA secret
      const secret = this.generateMFASecret();
      
      // Store MFA secret
      await prisma.user.update({
        where: { id: userId },
        data: {
          mfaSecret: secret,
          mfaEnabled: false // Will be enabled after verification
        }
      });

      // Generate QR code (this would integrate with your MFA provider)
      const qrCode = await this.generateQRCode(user.email, secret);

      return {
        success: true,
        secret,
        qrCode
      };

    } catch (error) {
      console.error('MFA setup error:', error);
      return { success: false, error: 'MFA setup failed' };
    }
  }

  // Verify and enable MFA
  async verifyAndEnableMFA(userId: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.mfaSecret) {
        return { success: false, error: 'MFA not set up' };
      }

      // Verify MFA token
      const isValid = await this.validateMFAToken(user.mfaSecret, token);
      if (!isValid) {
        return { success: false, error: 'Invalid MFA token' };
      }

      // Enable MFA
      await prisma.user.update({
        where: { id: userId },
        data: { mfaEnabled: true }
      });

      // Log security event
      await this.logSecurityEvent({
        userId,
        action: 'MFA_ENABLED',
        resource: 'security',
        status: 'SUCCESS'
      });

      return { success: true };

    } catch (error) {
      console.error('MFA verification error:', error);
      return { success: false, error: 'MFA verification failed' };
    }
  }

  // Change password with enhanced security
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Verify current password
      const isCurrentPasswordValid = await compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        await this.logSecurityEvent({
          userId,
          action: 'PASSWORD_CHANGE_FAILED',
          resource: 'authentication',
          status: 'FAILED',
          metadata: { reason: 'Invalid current password' }
        });
        return { success: false, error: 'Current password is incorrect' };
      }

      // Validate new password
      const validation = this.validatePassword(newPassword);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, this.bcryptRounds);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
      });

      // Invalidate all sessions
      await prisma.session.updateMany({
        where: { userId, status: 'active' },
        data: { status: 'revoked' }
      });

      // Log security event
      await this.logSecurityEvent({
        userId,
        action: 'PASSWORD_CHANGED',
        resource: 'authentication',
        status: 'SUCCESS'
      });

      return { success: true };

    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Password change failed' };
    }
  }

  // Generate API key
  async generateApiKey(userId: string, name?: string, permissions?: string[]): Promise<{ success: boolean; apiKey?: string; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Generate secure API key
      const key = `opt-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const secret = this.generateSecureKey();

      // Create API key record
      const apiKeyRecord = await prisma.apiKey.create({
        data: {
          userId,
          name: name || 'Generated API Key',
          key,
          secret,
          permissions: permissions ? JSON.stringify(permissions) : JSON.stringify(['read']),
          status: 'active',
          rateLimit: 1000,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      });

      // Log security event
      await this.logSecurityEvent({
        userId,
        action: 'API_KEY_GENERATED',
        resource: 'api_key',
        status: 'SUCCESS',
        metadata: {
          apiKeyId: apiKeyRecord.id,
          name: apiKeyRecord.name,
          permissions: permissions
        }
      });

      return { success: true, apiKey: key };

    } catch (error) {
      console.error('API key generation error:', error);
      return { success: false, error: 'API key generation failed' };
    }
  }

  // Get user from token
  async getUserFromToken(token: string): Promise<any> {
    try {
      const decoded = verify(token, this.jwtSecret) as any;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { tenant: true }
      });

      if (!user || !user.isActive) {
        return null;
      }

      // Check if session is still valid
      const session = await prisma.session.findFirst({
        where: {
          userId: user.id,
          token: token,
          status: 'active',
          expiresAt: { gt: new Date() }
        }
      });

      if (!session) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, profileData: {
    name?: string;
    theme?: string;
    language?: string;
    timezone?: string;
    notifications?: boolean;
  }): Promise<{ success: boolean; user?: any; error?: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(profileData.name && { name: profileData.name }),
          ...(profileData.theme && { theme: profileData.theme }),
          ...(profileData.language && { language: profileData.language }),
          ...(profileData.timezone && { timezone: profileData.timezone }),
          ...(profileData.notifications !== undefined && { notifications: profileData.notifications })
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          securityLevel: true,
          emailVerified: true,
          isPremium: true,
          theme: true,
          language: true,
          timezone: true,
          notifications: true,
          updatedAt: true
        }
      });

      // Log security event
      await this.logSecurityEvent({
        userId,
        action: 'PROFILE_UPDATED',
        resource: 'user',
        status: 'SUCCESS',
        metadata: {
          updatedFields: Object.keys(profileData)
        }
      });

      return { success: true, user: updatedUser };

    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Profile update failed' };
    }
  }

  // Helper methods
  private validateUserData(userData: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push('Valid email is required');
    }

    if (!userData.password || userData.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    const passwordValidation = this.validatePassword(userData.password);
    if (!passwordValidation.valid) {
      errors.push(...passwordValidation.errors);
    }

    return { valid: errors.length === 0, errors };
  }

  private validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  }

  private async generateTokens(user: any): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const accessToken = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiresIn }
    );

    const refreshToken = sign(
      {
        userId: user.id,
        type: 'refresh'
      },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiresIn }
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    };
  }

  private async createSession(userId: string, token: string, options: {
    ipAddress?: string;
    userAgent?: string;
  }): Promise<any> {
    const refreshToken = sign(
      { userId, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiresIn }
    );

    return await prisma.session.create({
      data: {
        userId,
        token,
        refreshToken,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        status: 'active',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        metadata: {
          createdAt: new Date().toISOString(),
          device: this.detectDevice(options.userAgent),
          location: 'unknown' // Would integrate with GeoIP service
        }
      }
    });
  }

  private async generateApiKey(userId: string): Promise<string> {
    const key = `opt-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const secret = this.generateSecureKey();

    await prisma.apiKey.create({
      data: {
        userId,
        name: 'Default API Key',
        key,
        secret,
        permissions: JSON.stringify(['read']),
        status: 'active',
        rateLimit: 100,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    });

    return key;
  }

  private generateMFASecret(): string {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  }

  private async generateQRCode(email: string, secret: string): Promise<string> {
    // This would integrate with a QR code generation library
    // For now, return a placeholder
    return `otpauth://totp/OptiMind:${email}?secret=${secret}&issuer=OptiMind`;
  }

  private async verifyMFA(user: any, token: string): Promise<boolean> {
    if (!user.mfaSecret) {
      return false;
    }

    return this.validateMFAToken(user.mfaSecret, token);
  }

  private async validateMFAToken(secret: string, token: string): Promise<boolean> {
    // This would integrate with your MFA provider
    // For now, simulate validation
    return token.length === 6 && /^\d{6}$/.test(token);
  }

  private generateSecureKey(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private detectDevice(userAgent?: string): string {
    if (!userAgent) return 'unknown';

    if (userAgent.includes('Mobile')) return 'mobile';
    if (userAgent.includes('Tablet')) return 'tablet';
    if (userAgent.includes('Windows')) return 'desktop';
    if (userAgent.includes('Mac')) return 'desktop';
    if (userAgent.includes('Linux')) return 'desktop';

    return 'unknown';
  }

  private async logFailedLoginAttempt(email: string, ipAddress?: string, reason?: string): Promise<void> {
    await this.logSecurityEvent({
      action: 'FAILED_LOGIN',
      resource: 'authentication',
      status: 'FAILED',
      ipAddress,
      metadata: {
        email,
        reason,
        timestamp: new Date().toISOString()
      }
    });
  }

  private async logSecurityEvent(event: any): Promise<void> {
    try {
      await prisma.securityLog.create({
        data: {
          action: event.action,
          resource: event.resource,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          status: event.status,
          severity: event.severity || 'info',
          metadata: event.metadata
        }
      });
    } catch (error) {
      console.error('Security logging error:', error);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();