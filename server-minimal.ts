// server-minimal.ts - Ultra-Fast Next.js Server
import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

// Minimal configuration for fastest startup
const serverConfig = {
  dev,
  dir: process.cwd(),
  hostname,
  port,
  quiet: true,
  turbopack: true,
};

// Ultra-fast server setup
async function startServer() {
  const startTime = Date.now();
  
  try {
    const app = next(serverConfig);
    await app.prepare();
    
    const handler = app.getRequestHandler();
    
    // Create and start server
    const server = createServer(handler);
    
    server.listen(port, hostname, () => {
      const totalTime = Date.now() - startTime;
      console.log(`🚀 Server ready in ${totalTime}ms`);
      console.log(`📍 http://${hostname}:${port}`);
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error);
    process.exit(1);
  }
}

// Start immediately
startServer();