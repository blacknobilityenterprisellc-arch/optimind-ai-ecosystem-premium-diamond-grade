import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ultra-minimal configuration for fastest startup
  
  // Minimal build settings
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
};

export default nextConfig;