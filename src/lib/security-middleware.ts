import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/db';

// Enterprise-grade security middleware
export async function securityMiddleware(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Rate limiting check
    const clientIP = request.ip || 'unknown';
    const rateLimitKey = `rate_limit:${clientIP}`;
    
    // Check request rate
    const requestCount = await getRequestCount(clientIP);
    if (requestCount > 1000) { // 1000 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded', message: 'Too many requests' },
        { status: 429 }
      );
    }

    // Security headers validation
    const securityHeaders = validateSecurityHeaders(request);
    if (!securityHeaders.valid) {
      return NextResponse.json(
        { error: 'Invalid security headers', message: securityHeaders.message },
        { status: 400 }
      );
    }

    // Authentication check
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Authentication failed', message: authResult.message },
        { status: 401 }
      );
    }

    // Authorization check
    const authzResult = await authorizeRequest(authResult.user, request);
    if (!authzResult.authorized) {
      return NextResponse.json(
        { error: 'Authorization failed', message: authzResult.message },
        { status: 403 }
      );
    }

    // MFA verification for sensitive operations
    if (isSensitiveOperation(request)) {
      const mfaResult = await verifyMFA(authResult.user, request);
      if (!mfaResult.verified) {
        return NextResponse.json(
          { error: 'MFA verification required', message: mfaResult.message },
          { status: 401 }
        );
      }
    }

    // Security audit logging
    await logSecurityEvent({
      userId: authResult.user?.id,
      action: 'REQUEST',
      resource: request.nextUrl.pathname,
      ipAddress: clientIP,
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'SUCCESS',
      metadata: {
        method: request.method,
        path: request.nextUrl.pathname,
        query: request.nextUrl.search,
        processingTime: Date.now() - startTime
      }
    });

    // Add security headers to response
    const response = NextResponse.next();
    addSecurityHeaders(response);

    return response;

  } catch (error) {
    console.error('Security middleware error:', error);
    
    // Log security incident
    await logSecurityEvent({
      action: 'SECURITY_ERROR',
      resource: request.nextUrl.pathname,
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      status: 'FAILED',
      metadata: {
        error: error.message,
        stack: error.stack
      }
    });

    return NextResponse.json(
      { error: 'Internal security error', message: 'Security processing failed' },
      { status: 500 }
    );
  }
}

// Rate limiting implementation
async function getRequestCount(clientIP: string): Promise<number> {
  // This would typically use Redis or similar for distributed rate limiting
  // For now, we'll use a simple in-memory approach
  const key = `rate_limit:${clientIP}:${Date.now() / 60000}`;
  // Return 0 for now (implement actual rate limiting in production)
  return 0;
}

// Security headers validation
function validateSecurityHeaders(request: NextRequest): { valid: boolean; message?: string } {
  const requiredHeaders = ['user-agent'];
  const sensitiveHeaders = ['authorization', 'x-api-key'];
  
  for (const header of requiredHeaders) {
    if (!request.headers.get(header)) {
      return { valid: false, message: `Missing required header: ${header}` };
    }
  }

  // Validate sensitive headers aren't logged
  for (const header of sensitiveHeaders) {
    const value = request.headers.get(header);
    if (value && value.length > 0) {
      // Basic validation of header format
      if (header === 'authorization' && !value.startsWith('Bearer ')) {
        return { valid: false, message: 'Invalid authorization header format' };
      }
    }
  }

  return { valid: true };
}

// Authentication implementation
async function authenticateRequest(request: NextRequest): Promise<{ authenticated: boolean; user?: any; message?: string }> {
  try {
    const authHeader = request.headers.get('authorization');
    const apiKey = request.headers.get('x-api-key');

    if (authHeader && authHeader.startsWith('Bearer ')) {
      // JWT token authentication
      const token = authHeader.substring(7);
      const decoded = verify(token, process.env.JWT_SECRET || 'default-secret');
      
      const user = await prisma.user.findUnique({
        where: { id: (decoded as any).userId },
        include: { tenant: true }
      });

      if (!user || !user.isActive) {
        return { authenticated: false, message: 'User not found or inactive' };
      }

      // Check if session is valid
      const session = await prisma.session.findFirst({
        where: {
          userId: user.id,
          token: token,
          status: 'active',
          expiresAt: { gt: new Date() }
        }
      });

      if (!session) {
        return { authenticated: false, message: 'Invalid or expired session' };
      }

      // Update last used time
      await prisma.session.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() }
      });

      return { authenticated: true, user };

    } else if (apiKey) {
      // API key authentication
      const apiKeyRecord = await prisma.apiKey.findFirst({
        where: {
          key: apiKey,
          status: 'active',
          expiresAt: { gt: new Date() }
        },
        include: { user: true }
      });

      if (!apiKeyRecord) {
        return { authenticated: false, message: 'Invalid API key' };
      }

      // Check rate limit for API key
      if (apiKeyRecord.usageCount >= apiKeyRecord.rateLimit) {
        return { authenticated: false, message: 'API key rate limit exceeded' };
      }

      // Update usage count
      await prisma.apiKey.update({
        where: { id: apiKeyRecord.id },
        data: { 
          usageCount: { increment: 1 },
          lastUsedAt: new Date()
        }
      });

      return { authenticated: true, user: apiKeyRecord.user };

    } else {
      return { authenticated: false, message: 'No authentication provided' };
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, message: 'Authentication failed' };
  }
}

// Authorization implementation
async function authorizeRequest(user: any, request: NextRequest): Promise<{ authorized: boolean; message?: string }> {
  try {
    const path = request.nextUrl.pathname;
    const method = request.method;

    // Super admin has all permissions
    if (user.role === 'ADMIN') {
      return { authorized: true };
    }

    // Check user permissions
    const permissions = await prisma.userPermission.findMany({
      where: {
        userId: user.id,
        granted: true,
        expiresAt: { gt: new Date() }
      }
    });

    // Resource-based authorization
    const resource = extractResourceFromPath(path);
    const action = mapMethodToAction(method);

    // Check if user has required permission
    const hasPermission = permissions.some(perm => 
      perm.resource === 'all' || 
      (perm.resource === resource && perm.action === 'all') ||
      (perm.resource === resource && perm.action === action)
    );

    if (!hasPermission) {
      return { authorized: false, message: 'Insufficient permissions' };
    }

    // Tenant-based authorization
    if (user.tenantId) {
      // Check if user has access to tenant resources
      const tenant = await prisma.tenant.findUnique({
        where: { id: user.tenantId }
      });

      if (!tenant || !tenant.isActive) {
        return { authorized: false, message: 'Tenant not active' };
      }
    }

    return { authorized: true };

  } catch (error) {
    console.error('Authorization error:', error);
    return { authorized: false, message: 'Authorization failed' };
  }
}

// MFA verification
async function verifyMFA(user: any, request: NextRequest): Promise<{ verified: boolean; message?: string }> {
  try {
    if (!user.mfaEnabled) {
      return { verified: true };
    }

    const mfaToken = request.headers.get('x-mfa-token');
    if (!mfaToken) {
      return { verified: false, message: 'MFA token required' };
    }

    // Verify MFA token (this would integrate with your MFA provider)
    // For now, we'll simulate MFA verification
    const isValid = await validateMFAToken(user.mfaSecret, mfaToken);
    
    if (!isValid) {
      await logSecurityEvent({
        userId: user.id,
        action: 'MFA_FAILED',
        resource: 'authentication',
        ipAddress: request.ip || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        status: 'FAILED',
        metadata: { reason: 'Invalid MFA token' }
      });

      return { verified: false, message: 'Invalid MFA token' };
    }

    return { verified: true };

  } catch (error) {
    console.error('MFA verification error:', error);
    return { verified: false, message: 'MFA verification failed' };
  }
}

// Security audit logging
async function logSecurityEvent(event: any): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        userId: event.userId,
        tenantId: event.tenantId,
        action: event.action,
        resource: event.resource,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        status: event.status,
        severity: event.severity || 'info',
        metadata: event.metadata
      }
    });

    // Also create audit log for data changes
    if (['CREATE', 'UPDATE', 'DELETE'].includes(event.action)) {
      await prisma.auditLog.create({
        data: {
          userId: event.userId,
          tenantId: event.tenantId,
          action: event.action,
          resource: event.resource,
          resourceId: event.resourceId,
          changes: event.metadata,
          ipAddress: event.ipAddress,
          userAgent: event.userAgent,
          status: event.status === 'SUCCESS' ? 'success' : 'failed'
        }
      });
    }

  } catch (error) {
    console.error('Security logging error:', error);
  }
}

// Helper functions
function isSensitiveOperation(request: NextRequest): boolean {
  const sensitivePaths = [
    '/api/users',
    '/api/security',
    '/api/admin',
    '/api/billing',
    '/api/subscription'
  ];

  const sensitiveMethods = ['POST', 'PUT', 'DELETE'];

  return sensitivePaths.some(path => request.nextUrl.pathname.startsWith(path)) &&
         sensitiveMethods.includes(request.method);
}

function extractResourceFromPath(path: string): string {
  const parts = path.split('/').filter(p => p);
  if (parts.length >= 2) {
    return parts[1]; // e.g., /api/users -> users
  }
  return 'unknown';
}

function mapMethodToAction(method: string): string {
  const actionMap: Record<string, string> = {
    'GET': 'read',
    'POST': 'create',
    'PUT': 'update',
    'PATCH': 'update',
    'DELETE': 'delete'
  };
  return actionMap[method] || 'unknown';
}

async function validateMFAToken(secret: string, token: string): Promise<boolean> {
  // This would integrate with your MFA provider (Google Authenticator, Authy, etc.)
  // For now, we'll simulate validation
  // In production, use a library like 'speakeasy' or 'otplib'
  return token.length === 6 && /^\d{6}$/.test(token);
}

function addSecurityHeaders(response: NextResponse): void {
  // Add enterprise-grade security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https: wss:; font-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';");
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
}

// Enterprise-grade security utilities
export const securityUtils = {
  // Password validation
  validatePassword: (password: string): { valid: boolean; errors: string[] } => {
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
  },

  // API key validation
  validateApiKey: (apiKey: string): boolean => {
    return apiKey.length >= 32 && /^[a-zA-Z0-9-]+$/.test(apiKey);
  },

  // Session validation
  validateSession: (session: any): boolean => {
    return session.status === 'active' && 
           new Date() < new Date(session.expiresAt) &&
           session.token.length > 0;
  },

  // Input sanitization
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  },

  // SQL injection prevention
  preventSQLInjection: (input: string): string => {
    return input
      .replace(/['";\\]/g, '')
      .replace(/--/g, '')
      .replace(/\/\*/g, '')
      .replace(/\*\//g, '')
      .trim();
  },

  // XSS prevention
  preventXSS: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  },

  // CSRF token generation
  generateCSRFToken: (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },

  // CSRF token validation
  validateCSRFToken: (token: string, sessionToken: string): boolean => {
    return token === sessionToken && token.length > 0;
  }
};

// Export the middleware
export { securityMiddleware as default };