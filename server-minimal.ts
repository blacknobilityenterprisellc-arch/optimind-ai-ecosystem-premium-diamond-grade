// server-minimal.ts - Minimal custom server for debugging
import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log(`🚀 Starting minimal custom server in ${dev ? 'development' : 'production'} mode`);
console.log(`🌐 Server will run on http://${hostname}:${port}`);

async function startServer() {
  try {
    console.log('Creating Next.js app...');
    const nextApp = next({ dev, hostname, port });
    
    console.log('Preparing Next.js app...');
    await nextApp.prepare();
    console.log('✅ Next.js app prepared');
    
    const handler = nextApp.getRequestHandler();
    
    console.log('Creating HTTP server...');
    const server = createServer(handler);
    
    console.log('Starting server...');
    server.listen(port, hostname, () => {
      console.log(`✅ Server ready at http://${hostname}:${port}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

startServer();
