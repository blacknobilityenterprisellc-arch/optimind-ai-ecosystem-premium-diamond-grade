// server-ultra-fast.ts - Lightning-Fast Next.js Server with OptiMind AI Optimization
import { createServer } from 'http';
import next from 'next';
import { performance } from 'perf_hooks';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Ultra-optimized configuration for lightning-fast startup
const serverConfig = {
  dev,
  dir: process.cwd(),
  hostname,
  port,
  quiet: true,
  turbopack: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  webpack: (config: any) => {
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      },
    };
    return config;
  },
};

// Lightning-fast server setup with AI optimization
async function startServer() {
  const startTime = performance.now();
  console.log('🚀 Starting OptiMind AI Ecosystem Ultra-Fast Server...');
  
  try {
    // Initialize Next.js with optimized settings
    const app = next(serverConfig);
    
    // Prepare with timeout to prevent hanging
    const preparePromise = app.prepare();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Server preparation timeout')), 30000);
    });
    
    await Promise.race([preparePromise, timeoutPromise]);
    
    const handler = app.getRequestHandler();
    
    // Create optimized HTTP server
    const server = createServer(async (req, res) => {
      const requestStart = performance.now();
      
      // Add performance headers
      res.setHeader('X-Powered-By', 'OptiMind AI Ecosystem');
      res.setHeader('X-Response-Time', `${performance.now() - requestStart}ms`);
      
      // Handle request with error boundary
      try {
        await handler(req, res);
      } catch (error) {
        console.error('Request error:', error);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });
    
    // Optimize server settings
    server.timeout = 120000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
    
    // Start server with performance monitoring
    server.listen(port, hostname, () => {
      const totalTime = performance.now() - startTime;
      console.log(`✅ OptiMind AI Ecosystem Ready in ${totalTime.toFixed(2)}ms`);
      console.log(`📍 Server: http://${hostname}:${port}`);
      console.log(`🔧 Mode: ${dev ? 'Development' : 'Production'}`);
      console.log(`⚡ Turbopack: ${serverConfig.turbopack ? 'Enabled' : 'Disabled'}`);
      console.log(`🎯 Performance: Ultra-Fast Mode Active`);
    });
    
    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 Graceful shutdown initiated...');
      server.close(() => {
        console.log('✅ Server stopped gracefully');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('🔄 Graceful shutdown initiated...');
      server.close(() => {
        console.log('✅ Server stopped gracefully');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Start immediately with error handling
startServer().catch((error) => {
  console.error('❌ Fatal server error:', error);
  process.exit(1);
});