import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { query, num = 10 } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const searchResult = await zai.functions.invoke("web_search", {
      query,
      num
    })

    return NextResponse.json({
      query,
      results: searchResult,
      count: searchResult.length
    })

  } catch (error: any) {
    console.error('Web search API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    // TODO: Implement search functionality
    return NextResponse.json({
      results: [],
      query,
      message: 'Search endpoint - implementation pending'
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;
    
    // TODO: Implement advanced search with filters
    return NextResponse.json({
      results: [],
      query,
      filters,
      message: 'Advanced search endpoint - implementation pending'
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}