// server-lightning.ts - Lightning-Fast Server with Radical Optimization
import { createServer } from 'http';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

console.log('⚡ Starting Lightning Server...');

// Ultra-minimal configuration
const serverConfig = {
  dev,
  dir: process.cwd(),
  hostname,
  port,
  quiet: true,
};

// Create Next.js app
const app = next(serverConfig);

// Create HTTP server immediately
const server = createServer(async (req, res) => {
  try {
    const handler = app.getRequestHandler();
    await handler(req, res);
  } catch (error) {
    console.error('Request error:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }
});

// Start server immediately
server.listen(port, hostname, () => {
  console.log(`✅ Lightning Server Ready: http://${hostname}:${port}`);
});

// Prepare app in background without blocking
app.prepare().catch((error) => {
  console.error('❌ App preparation failed:', error);
  process.exit(1);
});

// Handle server errors
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});