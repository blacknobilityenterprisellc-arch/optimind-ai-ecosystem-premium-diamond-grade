'use client';

import { useEffect, useState } from 'react';

interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
}

interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  paths: Record<string, any>;
  tags: Array<{
    name: string;
    description: string;
  }>;
}

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<OpenApiSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => res.json())
      .then((data: OpenApiSpec) => {
        setSpec(data);
        
        // Extract endpoints
        const extractedEndpoints: ApiEndpoint[] = [];
        Object.entries(data.paths).forEach(([path, methods]) => {
          Object.entries(methods).forEach(([method, details]: [string, any]) => {
            extractedEndpoints.push({
              path,
              method: method.toUpperCase(),
              summary: details.summary || '',
              description: details.description || '',
              tags: details.tags || [],
            });
          });
        });
        
        setEndpoints(extractedEndpoints);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching API spec:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading API Documentation</h1>
            <p className="text-gray-400">Unable to fetch API specification. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {spec.info.title}
          </h1>
          <p className="text-gray-400 mb-4">{spec.info.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Version: {spec.info.version}</span>
            <span>•</span>
            <span>OpenAPI: {spec.openapi}</span>
            <span>•</span>
            <span>{endpoints.length} Endpoints</span>
          </div>
        </header>

        {/* Tags */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">API Categories</h2>
          <div className="flex flex-wrap gap-2">
            {spec.tags.map((tag) => (
              <span
                key={tag.name}
                className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">API Endpoints</h2>
          
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-green-600 text-white' :
                      endpoint.method === 'POST' ? 'bg-blue-600 text-white' :
                      endpoint.method === 'PUT' ? 'bg-yellow-600 text-white' :
                      endpoint.method === 'DELETE' ? 'bg-red-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="bg-gray-900 px-2 py-1 rounded text-sm">{endpoint.path}</code>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{endpoint.summary}</h3>
                  <p className="text-gray-400 mb-3">{endpoint.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {endpoint.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <button
                  onClick={() => {
                    // Test the endpoint
                    fetch(endpoint.path)
                      .then((res) => res.json())
                      .then((data) => {
                        console.log('Endpoint response:', data);
                        alert(`Endpoint tested successfully! Check console for response.`);
                      })
                      .catch((error) => {
                        console.error('Endpoint test failed:', error);
                        alert('Endpoint test failed. Check console for details.');
                      });
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                >
                  Test Endpoint
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}