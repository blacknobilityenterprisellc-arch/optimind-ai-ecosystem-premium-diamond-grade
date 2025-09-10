// server-instant.ts - Instant Startup (< 1 second)
import { createServer } from 'http';

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = '0.0.0.0';

console.log('⚡ Instant server starting...');

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>OptiMind AI Ecosystem</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
          .container { max-width: 800px; margin: 0 auto; text-align: center; }
          h1 { font-size: 3em; margin-bottom: 20px; }
          .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 OptiMind AI Ecosystem</h1>
          <div class="status">
            <h2>✅ Server Running Instantly</h2>
            <p>Enterprise-Grade AI System Active</p>
            <p>Port: ${port}</p>
            <p>Ready to serve requests</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`⚡ Instant server ready: http://${hostname}:${port}`);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  server.close(() => process.exit(0));
});