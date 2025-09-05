import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enterprise Performance Optimization
  experimental: {
    turbopack: true,
    serverComponentsExternalPackages: [],
  },
  
  // Enterprise Build Optimization
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Enterprise Image Optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enterprise Security & Compliance
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Enterprise Environment Configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Enterprise Headers & Security
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Enterprise-Grade',
            value: 'Premium Diamond',
          },
          {
            key: 'X-Security-Level',
            value: 'Enterprise',
          },
        ],
      },
    ];
  },
  
  // Enterprise Redirects
  async redirects() {
    return [
      {
        source: '/enterprise',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
