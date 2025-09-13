
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
  
  // Experimental features for better performance
  experimental: {
      // AI-Optimized bundle settings
      optimizePackageImports: ['lucide-react', '@radix-ui/react-*'],
      swcPlugins: [
        ['@swc-plugins/transform-imports', {
          'lucide-react': {
            'transform': 'lucide-react/esm/{{member}}',
            'preventFullImport': true
          }
        }]
      ]
    },
  
  // Images optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Bundle analyzer for optimization
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers optimization
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Redirects for better SEO
  async redirects() {
    return [];
  },
  
  // Rewrites for API optimization
  async rewrites() {
    return [];
  },
};

export default nextConfig;
