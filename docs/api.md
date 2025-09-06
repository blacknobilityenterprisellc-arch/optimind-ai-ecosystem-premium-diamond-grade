# 📚 OptiMind AI Platform - API Documentation

This document provides comprehensive API documentation for the OptiMind AI Platform, including all endpoints, request/response formats, and usage examples.

## 📋 **Table of Contents**

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Rate Limits](#rate-limits)
- [Error Handling](#error-handling)
- [API Endpoints](#api-endpoints)
- [Models & Schemas](#models--schemas)
- [Examples](#examples)

---

## 🔐 **Authentication**

All API requests require authentication using an Open Router API key.

### **Setting up API Key**
```bash
# Environment variable
export OPENROUTER_API_KEY=your_api_key_here

# Or in .env.local file
OPENROUTER_API_KEY=your_api_key_here
```

### **Using the API Key**
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // No need to pass API key in headers - it's handled server-side
  },
  body: JSON.stringify(requestData)
});
```

---

## 🌐 **Base URL**

All API endpoints are relative to the base URL:
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

---

## ⚡ **Rate Limits**

| Tier | Requests/Minute | Requests/Hour | Concurrent Requests |
|------|----------------|--------------|-------------------|
| Free | 100 | 6,000 | 10 |
| Premium | 1,000 | 60,000 | 50 |
| Enterprise | Custom | Custom | Custom |

### **Rate Limit Headers**
Responses include rate limit information:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## ❌ **Error Handling**

All API endpoints return standardized error responses.

### **Error Response Format**
```json
{
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or missing API key",
    "details": "Please check your Open Router API key configuration"
  },
  "success": false,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### **Common Error Codes**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_API_KEY | 401 | Invalid or missing API key |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INVALID_REQUEST | 400 | Malformed request data |
| MODEL_NOT_FOUND | 404 | Specified model not available |
| INSUFFICIENT_CREDITS | 402 | Not enough credits for request |
| INTERNAL_ERROR | 500 | Server-side error |

---

## 🛠 **API Endpoints**

### 📝 **Content Generation**

#### **POST** `/api/content/generate`
Generate content using AI models.

**Request Body**:
```json
{
  "topic": "string (required)",
  "contentType": "blog|article|product-description|social-media|email|documentation (required)",
  "tone": "professional|casual|friendly|formal|enthusiastic (default: professional)",
  "length": "short|medium|long (default: medium)",
  "keywords": ["string"] (optional),
  "targetAudience": "string" (optional),
  "model": "string" (optional),
  "temperature": "number (optional, default: 0.8)",
  "maxTokens": "number (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "content": "Generated content here...",
  "model": "anthropic/claude-3-opus",
  "usage": {
    "promptTokens": 150,
    "completionTokens": 350,
    "totalTokens": 500
  },
  "cost": 0.0075,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example**:
```javascript
const response = await fetch('/api/content/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: "The Future of Artificial Intelligence",
    contentType: "blog",
    tone: "professional",
    length: "medium",
    keywords: ["AI", "machine learning", "future technology"],
    targetAudience: "tech professionals"
  })
});

const result = await response.json();
console.log(result.content);
```

---

### 💻 **Code Assistance**

#### **POST** `/api/code-assist`
Get AI assistance with code-related tasks.

**Request Body**:
```json
{
  "code": "string (required)",
  "language": "string (required)",
  "task": "review|optimize|document|debug|generate-tests|refactor (required)",
  "context": "string" (optional),
  "model": "string" (optional)",
  "temperature": "number (optional, default: 0.3)",
  "maxTokens": "number (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "result": "Code analysis and suggestions...",
  "model": "openai/gpt-4",
  "usage": {
    "promptTokens": 200,
    "completionTokens": 400,
    "totalTokens": 600
  },
  "cost": 0.006,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Supported Languages**:
- JavaScript, TypeScript, Python, Java, C++, C#, Go, Rust, PHP, Ruby, Swift, Kotlin

**Example**:
```javascript
const response = await fetch('/api/code-assist', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: "function calculateTotal(items) { let total = 0; for (let i = 0; i < items.length; i++) { total += items[i].price * items[i].quantity; } return total; }",
    language: "javascript",
    task: "review",
    context: "E-commerce application calculating order totals"
  })
});

const result = await response.json();
console.log(result.result);
```

---

### 🤖 **AI Chat**

#### **POST** `/api/chat`
Conversational AI with multiple model support.

**Request Body**:
```json
{
  "messages": [
    {
      "role": "system|user|assistant",
      "content": "string"
    }
  ] (required),
  "model": "string" (optional),
  "temperature": "number (optional, default: 0.7)",
  "maxTokens": "number (optional, default: 1000)",
  "stream": "boolean (optional, default: false)"
}
```

**Response** (Non-streaming):
```json
{
  "success": true,
  "content": "AI response here...",
  "model": "openai/gpt-4-turbo",
  "usage": {
    "promptTokens": 100,
    "completionTokens": 200,
    "totalTokens": 300
  },
  "cost": 0.003,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response** (Streaming):
```
data: {"type": "message", "content": "Hello"}
data: {"type": "message", "content": "!"}
data: {"type": "done", "usage": {...}}
```

**Example**:
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant."
      },
      {
        role: "user",
        content: "Explain quantum computing in simple terms."
      }
    ]
  })
});

const result = await response.json();
console.log(result.content);
```

---

### 🔍 **Smart Search**

#### **POST** `/api/smart-search`
AI-powered search with specialized modes.

**Request Body**:
```json
{
  "query": "string (required)",
  "context": "string" (optional),
  "type": "general|code|research|creative (default: general)",
  "model": "string" (optional),
  "temperature": "number (optional, default: 0.5)",
  "maxTokens": "number (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "title": "Search result title",
      "content": "Search result content...",
      "url": "https://example.com",
      "relevance": 0.95
    }
  ],
  "model": "perplexity/pplx-70b-online",
  "usage": {
    "promptTokens": 80,
    "completionTokens": 250,
    "totalTokens": 330
  },
  "cost": 0.00033,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example**:
```javascript
const response = await fetch('/api/smart-search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Best practices for React performance optimization",
    type: "code",
    context: "Frontend development"
  })
});

const result = await response.json();
console.log(result.results);
```

---

### 📊 **Data Analysis**

#### **POST** `/api/analyze-data`
AI-powered data analysis and insights.

**Request Body**:
```json
{
  "data": "object|array (required)",
  "analysisType": "string (required)",
  "model": "string" (optional)",
  "temperature": "number (optional, default: 0.4)",
  "maxTokens": "number (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "insights": {
    "summary": "Data analysis summary...",
    "trends": ["trend1", "trend2"],
    "recommendations": ["recommendation1", "recommendation2"],
    "visualizations": [
      {
        "type": "chart-type",
        "data": {...},
        "description": "Chart description"
      }
    ]
  },
  "model": "anthropic/claude-3-opus",
  "usage": {
    "promptTokens": 300,
    "completionTokens": 500,
    "totalTokens": 800
  },
  "cost": 0.012,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example**:
```javascript
const response = await fetch('/api/analyze-data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: [
      { month: "Jan", sales: 1000, users: 500 },
      { month: "Feb", sales: 1500, users: 750 },
      { month: "Mar", sales: 1200, users: 600 }
    ],
    analysisType: "Sales performance and user growth trends"
  })
});

const result = await response.json();
console.log(result.insights);
```

---

### ✨ **Text Enhancement**

#### **POST** `/api/enhance-text`
Improve text quality with various enhancement types.

**Request Body**:
```json
{
  "text": "string (required)",
  "enhancement": "grammar|clarity|professional|creative|concise|expand (required)",
  "context": "string" (optional),
  "model": "string" (optional)",
  "temperature": "number (optional, default: 0.6)",
  "maxTokens": "number (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "originalText": "Original text here...",
  "enhancedText": "Enhanced text here...",
  "enhancementType": "professional",
  "changes": [
    {
      "type": "grammar",
      "original": "was",
      "improved": "were"
    }
  ],
  "model": "openai/gpt-4-turbo",
  "usage": {
    "promptTokens": 120,
    "completionTokens": 180,
    "totalTokens": 300
  },
  "cost": 0.003,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example**:
```javascript
const response = await fetch('/api/enhance-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "The report shows good results",
    enhancement: "professional",
    context: "Business report for executives"
  })
});

const result = await response.json();
console.log(result.enhancedText);
```

---

### 🎯 **Recommendations**

#### **POST** `/api/recommendations`
Generate personalized recommendations.

**Request Body**:
```json
{
  "context": "string (required)",
  "type": "content|products|actions|strategies (required)",
  "model": "string" (optional)",
  "temperature": "number (optional, default: 0.7)",
  "maxTokens": "number (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "rec1",
      "title": "Recommendation title",
      "description": "Detailed description...",
      "confidence": 0.85,
      "reasoning": "Explanation of why this is recommended",
      "priority": "high|medium|low"
    }
  ],
  "model": "anthropic/claude-3-opus",
  "usage": {
    "promptTokens": 200,
    "completionTokens": 400,
    "totalTokens": 600
  },
  "cost": 0.009,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example**:
```javascript
const response = await fetch('/api/recommendations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    context: "E-commerce platform selling electronics, target audience tech-savvy professionals",
    type: "products"
  })
});

const result = await response.json();
console.log(result.recommendations);
```

---

### ✅ **Form Validation**

#### **POST** `/api/validate-form`
Intelligent form validation and error handling.

**Request Body**:
```json
{
  "formData": "object (required)",
  "schema": "object (required)",
  "context": "string" (optional)"
}
```

**Response**:
```json
{
  "success": true,
  "isValid": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "severity": "error",
      "suggestion": "Use format: user@example.com"
    }
  ],
  "warnings": [
    {
      "field": "password",
      "message": "Password could be stronger",
      "severity": "warning",
      "suggestion": "Add numbers and special characters"
    }
  ],
  "score": 0.75,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Example**:
```javascript
const response = await fetch('/api/validate-form', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formData: {
      name: "John Doe",
      email: "john@example.com",
      password: "weak123"
    },
    schema: {
      name: { type: "string", required: true },
      email: { type: "email", required: true },
      password: { type: "string", required: true, minLength: 8 }
    },
    context: "User registration form"
  })
});

const result = await response.json();
console.log(result.errors);
```

---

### 💓 **Health Check**

#### **GET** `/api/health`
Check the health status of the API and services.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "api": "healthy",
    "database": "healthy",
    "ai_models": "healthy",
    "cache": "healthy"
  },
  "version": "1.0.0",
  "uptime": 86400
}
```

**Example**:
```javascript
const response = await fetch('/api/health');
const health = await response.json();
console.log(health.status); // "healthy"
```

---

## 📊 **Models & Schemas**

### **Available AI Models**

| Model | Cost (1K tokens) | Max Tokens | Best For |
|-------|------------------|-------------|-----------|
| openai/gpt-4-turbo | $0.01 | 128,000 | Complex reasoning, creativity |
| anthropic/claude-3-opus | $0.015 | 200,000 | Analysis, writing, long context |
| google/gemini-pro | $0.00125 | 32,768 | Multimodal, general tasks |
| meta/llama-3-70b | $0.00088 | 8,192 | Open-source, code, reasoning |
| openai/gpt-3.5-turbo | $0.0005 | 16,385 | Fast responses, simple tasks |
| anthropic/claude-3-haiku | $0.00025 | 200,000 | Speed, efficiency |
| mistral/mistral-large | $0.003 | 32,768 | Code, multilingual |
| perplexity/pplx-70b-online | $0.001 | 4,096 | Research, real-time data |

### **Request Schemas**

#### **ContentGenerationRequest**
```typescript
interface ContentGenerationRequest {
  topic: string;
  contentType: 'blog' | 'article' | 'product-description' | 'social-media' | 'email' | 'documentation';
  tone?: 'professional' | 'casual' | 'friendly' | 'formal' | 'enthusiastic';
  length?: 'short' | 'medium' | 'long';
  keywords?: string[];
  targetAudience?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

#### **CodeAssistanceRequest**
```typescript
interface CodeAssistanceRequest {
  code: string;
  language: string;
  task: 'review' | 'optimize' | 'document' | 'debug' | 'generate-tests' | 'refactor';
  context?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}
```

#### **AIRequest**
```typescript
interface AIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}
```

### **Response Schemas**

#### **SuccessResponse**
```typescript
interface SuccessResponse<T = any> {
  success: true;
  data: T;
  model: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  cost: number;
  timestamp: string;
}
```

#### **ErrorResponse**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
  };
  timestamp: string;
}
```

---

## 💡 **Examples**

### **Basic Content Generation**
```javascript
// Generate a blog post about AI
async function generateBlogPost() {
  const response = await fetch('/api/content/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: "The Impact of AI on Modern Business",
      contentType: "blog",
      tone: "professional",
      length: "medium"
    })
  });

  const result = await response.json();
  if (result.success) {
    console.log('Generated content:', result.content);
    console.log('Cost:', result.cost);
    console.log('Model used:', result.model);
  } else {
    console.error('Error:', result.error.message);
  }
}
```

### **Streaming Chat Response**
```javascript
// Streaming chat with real-time responses
async function streamingChat() {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Tell me about quantum computing" }
      ],
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        if (data.type === 'message') {
          console.log('Message:', data.content);
        } else if (data.type === 'done') {
          console.log('Stream completed');
          console.log('Usage:', data.usage);
        }
      }
    }
  }
}
```

### **Batch Processing**
```javascript
// Process multiple requests in parallel
async function batchContentGeneration() {
  const requests = [
    {
      topic: "AI in Healthcare",
      contentType: "article",
      tone: "professional"
    },
    {
      topic: "Machine Learning Basics",
      contentType: "blog",
      tone: "casual"
    },
    {
      topic: "Future of Work",
      contentType: "social-media",
      tone: "enthusiastic"
    }
  ];

  const promises = requests.map(req => 
    fetch('/api/content/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    })
  );

  const responses = await Promise.all(promises);
  const results = await Promise.all(responses.map(res => res.json()));

  results.forEach((result, index) => {
    if (result.success) {
      console.log(`Request ${index + 1}:`, result.content.substring(0, 100) + '...');
    }
  });
}
```

### **Error Handling**
```javascript
// Robust error handling
async function safeApiCall(endpoint, data) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'API request failed');
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error.message || 'API returned error');
    }

    return result;
  } catch (error) {
    console.error('API Error:', error.message);
    
    // Handle specific error types
    if (error.message.includes('API key')) {
      // Handle authentication errors
    } else if (error.message.includes('rate limit')) {
      // Handle rate limiting
    } else if (error.message.includes('credits')) {
      // Handle insufficient credits
    }
    
    throw error;
  }
}

// Usage
try {
  const result = await safeApiCall('content/generate', {
    topic: "AI Technology",
    contentType: "blog"
  });
  console.log('Success:', result.content);
} catch (error) {
  console.error('Failed:', error.message);
}
```

---

## 🔧 **Advanced Features**

### **Custom Model Selection**
```javascript
// Override automatic model selection
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    model: 'anthropic/claude-3-opus' // Specific model
  })
});
```

### **Cost Estimation**
```javascript
// Estimate cost before making request
function estimateCost(model, estimatedTokens) {
  const modelCosts = {
    'openai/gpt-4-turbo': 0.01,
    'anthropic/claude-3-opus': 0.015,
    'openai/gpt-3.5-turbo': 0.0005
  };
  
  const costPerToken = modelCosts[model] || 0.01;
  return (estimatedTokens * costPerToken) / 1000;
}

const estimatedCost = estimateCost('openai/gpt-4-turbo', 1000);
console.log('Estimated cost:', estimatedCost);
```

### **Request Cancellation**
```javascript
// Cancel long-running requests
const controller = new AbortController();

const request = fetch('/api/content/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(largeRequest),
  signal: controller.signal
});

// Cancel after 5 seconds
setTimeout(() => controller.abort(), 5000);

try {
  const response = await request;
  const result = await response.json();
} catch (error) {
  if (error.name === 'AbortError') {
    console.log('Request was cancelled');
  }
}
```

---

For more information and advanced usage patterns, refer to the [main documentation](../README.md) or [AI tools guide](./ai-tools.md).