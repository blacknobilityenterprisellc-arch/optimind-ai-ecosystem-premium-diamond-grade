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
  }
}