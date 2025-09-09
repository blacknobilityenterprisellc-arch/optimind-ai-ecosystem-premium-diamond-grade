
export async function GET() {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // Mock search results
    const searchResults = {
      query,
      results: [
        {
          id: '1',
          title: 'AI Content Optimization',
          description: 'Advanced AI-powered content optimization techniques',
          url: '/content-optimization',
          relevance: 0.95,
        },
        {
          id: '2',
          title: 'Multi-Model Analysis',
          description: 'Comprehensive analysis using multiple AI models',
          url: '/research-analysis',
          relevance: 0.87,
        },
      ],
      total: 2,
      took: 12,
    };

    return NextResponse.json(searchResults);
  } catch (error: unknown) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
