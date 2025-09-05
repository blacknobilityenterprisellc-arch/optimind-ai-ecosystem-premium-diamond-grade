const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

exports.handler = async (event, context) => {
  // Wait for Next.js to be ready
  await app.prepare();
  
  const { path, httpMethod, headers, body, queryStringParameters } = event;
  
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
      this.headers[name] = value;
    },
    
    getHeader(name) {
      return this.headers[name];
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