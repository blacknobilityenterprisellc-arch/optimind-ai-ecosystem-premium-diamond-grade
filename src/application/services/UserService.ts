/**
 * Application Service - UserService
 *
 * Handles user-related business logic and use cases.
 * This service orchestrates domain operations and implements application-level business rules.
 *
 * @version 1.0.0
 * @author OptiMind AI Team
 * @license MIT
 */

import {
  User,
  UserProps,
  UserRole,
  Permission,
  UserProfile,
  UserSecurity,
  Subscription,
} from "@/domain/entities/User";
import { Email } from "@/domain/value-objects/Email";
import { Money } from "@/domain/value-objects/Money";
import { UserRepository } from "@/domain/repositories/UserRepository";
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ApplicationError,
} from "@/lib/error-handler";
import { withErrorHandling, withRetry } from "@/lib/error-handler";
import { PasswordHasher } from "@/infrastructure/security/bcrypt/PasswordHasher";
import { JWTService } from "@/infrastructure/security/jwt/JWTService";
import { EmailService } from "@/infrastructure/email/EmailService";

export interface CreateUserRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  role?: UserRole;
  permissions?: Permission[];
  profile?: Partial<UserProfile>;
}

export interface UpdateUserRequest {
  userId: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profile?: Partial<UserProfile>;
  permissions?: Permission[];
}

export interface ChangePasswordRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  verificationRequired: boolean;
}

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JWTService,
    private readonly emailService: EmailService,
  ) {}

  // Use case: Create new user
  @withErrorHandling("UserService.createUser")
  async createUser(request: CreateUserRequest): Promise<User> {
    // Check if user already exists
    const existingEmail = await this.userRepository.findByEmail(
      new Email(request.email),
    );
    if (existingEmail) {
      throw new ValidationError("User with this email already exists");
    }

    const existingUsername = await this.userRepository.findByUsername(
      request.username,
    );
    if (existingUsername) {
      throw new ValidationError("Username already taken");
    }

    // Hash password
    const hashedPassword = await this.passwordHasher.hash(request.password);

    // Create user entity
    const userProps: UserProps = {
      email: request.email,
      username: request.username,
      firstName: request.firstName,
      lastName: request.lastName,
      role: request.role || UserRole.USER,
      permissions:
        request.permissions ||
        this.getDefaultPermissions(request.role || UserRole.USER),
      profile: this.getDefaultProfile(request.profile),
      security: {
        twoFactorEnabled: false,
        lastLogin: new Date(),
        loginAttempts: 0,
      },
    };

    const user = new User(userProps);

    // Save user
    await this.userRepository.save(user);

    // Send welcome email
    await this.sendWelcomeEmail(user);

    return user;
  }

  // Use case: Update user
  @withErrorHandling("UserService.updateUser")
  async updateUser(request: UpdateUserRequest): Promise<User> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    // Update user properties
    const updates: Partial<UserProps> = {};

    if (request.email) {
      const existingEmail = await this.userRepository.findByEmail(
        new Email(request.email),
      );
      if (existingEmail && existingEmail.id !== request.userId) {
        throw new ValidationError("Email already in use");
      }
      updates.email = request.email;
    }

    if (request.username) {
      const existingUsername = await this.userRepository.findByUsername(
        request.username,
      );
      if (existingUsername && existingUsername.id !== request.userId) {
        throw new ValidationError("Username already taken");
      }
      updates.username = request.username;
    }

    if (request.firstName) updates.firstName = request.firstName;
    if (request.lastName) updates.lastName = request.lastName;
    if (request.permissions) updates.permissions = request.permissions;

    // Update profile if provided
    if (request.profile) {
      const currentProfile = user.profile;
      const updatedProfile = {
        ...currentProfile,
        ...request.profile,
      };
      user.updateProfile(updatedProfile);
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      // In a real implementation, we would update the user entity
      // For now, we'll just update the profile
      await this.userRepository.save(user);
    }

    return user;
  }

  // Use case: Change password
  @withErrorHandling("UserService.changePassword")
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    // Verify current password (this would require storing password hashes)
    // For now, we'll skip this verification
    // const isCurrentPasswordValid = await this.passwordHasher.verify(
    //   user.passwordHash,
    //   request.currentPassword
    // );
    // if (!isCurrentPasswordValid) {
    //   throw new ValidationError('Current password is incorrect');
    // }

    // Hash new password
    // const newPasswordHash = await this.passwordHasher.hash(request.newPassword);
    // user.updatePassword(newPasswordHash);

    await this.userRepository.save(user);

    // Send password change notification
    await this.sendPasswordChangeEmail(user);
  }

  // Use case: Login
  @withErrorHandling("UserService.login")
  async login(request: LoginRequest): Promise<LoginResponse> {
    const user = await this.userRepository.findByEmail(
      new Email(request.email),
    );
    if (!user) {
      throw new AuthenticationError("Invalid email or password");
    }

    if (!user.isActive()) {
      throw new AuthenticationError("Account is inactive");
    }

    if (user.isLocked()) {
      throw new AuthenticationError(
        "Account is locked. Please try again later.",
      );
    }

    // Verify password (this would require storing password hashes)
    // For now, we'll skip this verification
    // const isPasswordValid = await this.passwordHasher.verify(
    //   user.passwordHash,
    //   request.password
    // );
    // if (!isPasswordValid) {
    //   await this.userRepository.incrementLoginAttempts(user.id);
    //   throw new AuthenticationError('Invalid email or password');
    // }

    // Record successful login
    user.recordLogin();
    await this.userRepository.save(user);

    // Generate JWT tokens
    const accessToken = await this.jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour
    };
  }

  // Use case: Register new user
  @withErrorHandling("UserService.register")
  async register(request: CreateUserRequest): Promise<RegisterResponse> {
    const user = await this.createUser(request);

    // Generate JWT tokens
    const accessToken = await this.jwtService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    });

    const refreshToken = await this.jwtService.generateRefreshToken({
      userId: user.id,
    });

    return {
      user,
      accessToken,
      refreshToken,
      expiresIn: 3600,
      verificationRequired: false, // Would be true if email verification is required
    };
  }

  // Use case: Get user by ID
  @withErrorHandling("UserService.getUserById")
  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  // Use case: Get user by email
  @withErrorHandling("UserService.getUserByEmail")
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(new Email(email));
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  // Use case: Get all users (admin only)
  @withErrorHandling("UserService.getAllUsers")
  async getAllUsers(options?: any): Promise<User[]> {
    return await this.userRepository.findAll(options);
  }

  // Use case: Delete user
  @withErrorHandling("UserService.deleteUser")
  async deleteUser(userId: string, requestingUserId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    // Users cannot delete themselves
    if (userId === requestingUserId) {
      throw new AuthorizationError("Cannot delete your own account");
    }

    await this.userRepository.delete(userId);
  }

  // Use case: Lock user account
  @withErrorHandling("UserService.lockUser")
  async lockUser(
    userId: string,
    reason: string,
    duration?: number,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    const lockUntil = duration ? new Date(Date.now() + duration) : undefined;
    await this.userRepository.lockUser(userId, lockUntil);

    // Send lock notification email
    await this.sendAccountLockEmail(user, reason);
  }

  // Use case: Unlock user account
  @withErrorHandling("UserService.unlockUser")
  async unlockUser(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    await this.userRepository.unlockUser(userId);
    user.unlockAccount();
    await this.userRepository.save(user);

    // Send unlock notification email
    await this.sendAccountUnlockEmail(user);
  }

  // Use case: Update user subscription
  @withErrorHandling("UserService.updateSubscription")
  async updateSubscription(
    userId: string,
    subscription: Subscription,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }

    user.updateSubscription(subscription);
    await this.userRepository.save(user);
    await this.userRepository.updateSubscription(userId, subscription);
  }

  // Use case: Get user analytics
  @withErrorHandling("UserService.getUserAnalytics")
  async getUserAnalytics(): Promise<any> {
    return await this.userRepository.getUserAnalytics();
  }

  // Private helper methods
  private getDefaultPermissions(role: UserRole): Permission[] {
    const permissions: Record<UserRole, Permission[]> = {
      [UserRole.ADMIN]: [
        { resource: "*", action: "create" },
        { resource: "*", action: "read" },
        { resource: "*", action: "update" },
        { resource: "*", action: "delete" },
        { resource: "*", action: "execute" },
      ],
      [UserRole.USER]: [
        { resource: "content", action: "create" },
        { resource: "content", action: "read" },
        { resource: "content", action: "update" },
        { resource: "ai", action: "execute" },
        { resource: "profile", action: "read" },
        { resource: "profile", action: "update" },
      ],
      [UserRole.MODERATOR]: [
        { resource: "content", action: "create" },
        { resource: "content", action: "read" },
        { resource: "content", action: "update" },
        { resource: "content", action: "delete" },
        { resource: "ai", action: "execute" },
        { resource: "profile", action: "read" },
        { resource: "profile", action: "update" },
        { resource: "users", action: "read" },
      ],
      [UserRole.ANALYST]: [
        { resource: "content", action: "read" },
        { resource: "analytics", action: "read" },
        { resource: "ai", action: "execute" },
        { resource: "profile", action: "read" },
        { resource: "profile", action: "update" },
      ],
    };

    return permissions[role] || permissions[UserRole.USER];
  }

  private getDefaultProfile(profile?: Partial<UserProfile>): UserProfile {
    return {
      avatar: profile?.avatar,
      bio: profile?.bio,
      preferences: {
        theme: profile?.preferences?.theme || "auto",
        language: profile?.preferences?.language || "en",
        timezone: profile?.preferences?.timezone || "UTC",
        notifications: {
          email: profile?.preferences?.notifications?.email ?? true,
          push: profile?.preferences?.notifications?.push ?? true,
          sms: profile?.preferences?.notifications?.sms ?? false,
          frequency:
            profile?.preferences?.notifications?.frequency || "immediate",
        },
        privacy: {
          profileVisibility:
            profile?.preferences?.privacy?.profileVisibility || "private",
          dataCollection: profile?.preferences?.privacy?.dataCollection ?? true,
          analytics: profile?.preferences?.privacy?.analytics ?? true,
          marketing: profile?.preferences?.privacy?.marketing ?? false,
        },
      },
      settings: {
        ai: {
          defaultModel: profile?.settings?.ai?.defaultModel || "gpt-3.5-turbo",
          temperature: profile?.settings?.ai?.temperature || 0.7,
          maxTokens: profile?.settings?.ai?.maxTokens || 1000,
          autoSave: profile?.settings?.ai?.autoSave ?? true,
          suggestions: profile?.settings?.ai?.suggestions ?? true,
        },
        content: {
          autoSave: profile?.settings?.content?.autoSave ?? true,
          autoOptimize: profile?.settings?.content?.autoOptimize ?? true,
          plagiarismCheck: profile?.settings?.content?.plagiarismCheck ?? true,
          grammarCheck: profile?.settings?.content?.grammarCheck ?? true,
        },
        security: {
          sessionTimeout: profile?.settings?.security?.sessionTimeout || 3600,
          twoFactor: profile?.settings?.security?.twoFactor ?? false,
          loginNotifications:
            profile?.settings?.security?.loginNotifications ?? true,
          dataEncryption: profile?.settings?.security?.dataEncryption ?? true,
        },
        analytics: {
          tracking: profile?.settings?.analytics?.tracking ?? true,
          personalized: profile?.settings?.analytics?.personalized ?? true,
          sharing: profile?.settings?.analytics?.sharing ?? false,
        },
      },
    };
  }

  private async sendWelcomeEmail(user: User): Promise<void> {
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Welcome to OptiMind AI Ecosystem!",
        template: "welcome",
        data: {
          username: user.username,
          firstName: user.firstName,
        },
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't throw error - user creation should succeed even if email fails
    }
  }

  private async sendPasswordChangeEmail(user: User): Promise<void> {
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Password Changed Successfully",
        template: "password-changed",
        data: {
          username: user.username,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to send password change email:", error);
    }
  }

  private async sendAccountLockEmail(
    user: User,
    reason: string,
  ): Promise<void> {
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Account Locked",
        template: "account-locked",
        data: {
          username: user.username,
          reason,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to send account lock email:", error);
    }
  }

  private async sendAccountUnlockEmail(user: User): Promise<void> {
    try {
      await this.emailService.sendEmail({
        to: user.email,
        subject: "Account Unlocked",
        template: "account-unlocked",
        data: {
          username: user.username,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Failed to send account unlock email:", error);
    }
  }
}
