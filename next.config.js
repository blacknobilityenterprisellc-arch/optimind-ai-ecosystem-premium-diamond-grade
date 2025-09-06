/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force using Babel instead of SWC
  experimental: {
    swcPlugins: []
  },
  // Disable SWC completely
  swcMinify: false,
  // Use Babel for compilation
  webpack: (config, { dev, isServer, defaultLoaders }) => {
    return config;
  }
};

module.exports = nextConfig;
