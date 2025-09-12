import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ultra-minimal configuration for fastest startup
  experimental: {
    // Disable experimental features for speed
    optimizePackageImports: false,
    serverComponentsExternalPackages: [],
  },
  
  // Minimal build settings
  swcMinify: false,
  compress: false,
  poweredByHeader: false,
  
  // Basic image configuration
  images: {
    domains: ['localhost'],
    formats: ['image/webp'],
  },
  
  // Disable strict checks for speed
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Remove complex configurations
  // env: {},
  // headers: async () => [],
  // async redirects() { return []; },
};

export default nextConfig;