/** @type {import('next').NextConfig} */
const nextConfig = {
  // Premium diamond-grade optimizations
  reactStrictMode: true,
  experimental: {
    swcPlugins: []
    // Removed serverActions as it's now available by default
  },
  // Premium performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true
  },
  // Premium image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  }
}

module.exports = nextConfig