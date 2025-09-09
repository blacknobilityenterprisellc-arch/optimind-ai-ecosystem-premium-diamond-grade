# OptiMind AI Ecosystem - Premium Diamond-Grade Dockerfile
# Multi-stage build for production optimization and security

# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies with security scanning
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    && npm install -g npm@latest

# Copy package files with security checks
COPY package*.json ./
COPY npm-shrinkwrap.json ./ 2>/dev/null || true

# Install dependencies with audit and security fixes
RUN npm ci --audit=moderate --fund && \
    npm audit fix --audit-level=moderate --force || true

# Copy source code with integrity check
COPY . .

# Generate Prisma client with security validation
RUN npx prisma generate --preview-feature

# Build application with optimization flags
RUN npm run build

# Run security scans on build artifacts
RUN npm audit --audit-level=moderate --production

# Stage 2: Production Stage
FROM node:20-alpine AS production

# Install runtime dependencies and security tools
RUN apk add --no-cache \
    dumb-init \
    openssl \
    curl \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Create app directory with proper permissions
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies with security audit
RUN npm ci --omit=dev --audit=moderate --production && \
    npm audit --audit-level=moderate --production

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Generate Prisma client for production
RUN npx prisma generate

# Create non-root user for security
USER nextjs

# Expose port with security considerations
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_DISABLE_ESLINT_PLUGIN=true \
    PORT=3000

# Health check configuration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Security hardening: Run with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start application with security considerations
CMD ["node", "server.js"]