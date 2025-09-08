const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

exports.handler = async (event) => {
  // Wait for Next.js to be ready
  await app.prepare();
  
  const { path, httpMethod, headers, body } = event;
  
  // Create a mock request object
  const req = {
    method: httpMethod,
    url: path,
    headers: {
      ...headers,
      host: headers.host || 'localhost:3000',
    },
    body: body ? JSON.parse(body) : undefined,
  };
  
  // Create a mock response object
  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    
    setHeader(name, value) {
      // Validate header name to prevent injection
      if (typeof name === 'string' && /^[a-zA-Z0-9-]+$/.test(name)) {
        this.headers[name] = value;
      }
    },
    
    getHeader(name) {
      // Validate header name to prevent injection
      if (typeof name === 'string' && /^[a-zA-Z0-9-]+$/.test(name)) {
        return this.headers[name];
      }
      return undefined;
    },
    
    end(data) {
      this.body = data;
    },
    
    json(data) {
      this.setHeader('Content-Type', 'application/json');
      this.body = JSON.stringify(data);
    },
    
    status(code) {
      this.statusCode = code;
      return this;
    },
  };
  
  try {
    // Handle the request with Next.js
    await handle(req, res);
    
    return {
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
    };
  } catch (error) {
    console.error('Error handling request:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};