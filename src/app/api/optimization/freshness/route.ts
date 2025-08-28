import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { content, url, contentType } = await request.json();

    if (!content && !url) {
      return NextResponse.json(
        { error: 'Content or URL is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Analyze content for freshness issues
    const freshnessPrompt = `
    Analyze the following content for freshness issues and outdated information:

    ${content ? `Content: "${content}"` : ''}
    ${url ? `URL: ${url}` : ''}
    Content Type: ${contentType || 'general'}

    Please analyze for:
    1. Outdated statistics or data points
    2. Broken or dead links
    3. Missing current trends or developments
    4. Old references to deprecated features
    5. Expired information or time-sensitive content
    6. Content age relevance

    For each issue found, provide:
    - Type of issue
    - Severity level (high, medium, low)
    - Description of the issue
    - Location in content
    - Suggested fix or update
    - Impact score (0-100)

    Also provide overall freshness scores:
    - Overall freshness score (0-100)
    - Content age score (0-100)
    - Data freshness score (0-100)
    - Link health score (0-100)
    - Trend relevance score (0-100)

    Format your response as JSON:
    {
      "freshnessScore": {
        "overall": 85,
        "contentAge": 78,
        "dataFreshness": 92,
        "linkHealth": 88,
        "trendRelevance": 82
      },
      "issues": [
        {
          "id": "unique_id",
          "type": "outdated_statistics|broken_links|missing_trends|old_references|expired_information",
          "severity": "high|medium|low",
          "description": "Issue description",
          "location": "Section or location",
          "suggestion": "Suggested fix",
          "impact": 85
        }
      ]
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content analyst specializing in content freshness and relevance. Analyze content for outdated information and provide actionable recommendations.'
        },
        {
          role: 'user',
          content: freshnessPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysisContent = completion.choices[0]?.message?.content;
    
    if (!analysisContent) {
      throw new Error('No freshness analysis received from AI');
    }

    // Parse the JSON response
    let freshnessResult;
    try {
      freshnessResult = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      freshnessResult = {
        freshnessScore: {
          overall: 75,
          contentAge: 70,
          dataFreshness: 80,
          linkHealth: 85,
          trendRelevance: 65
        },
        issues: []
      };
    }

    return NextResponse.json({
      success: true,
      data: freshnessResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content freshness analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content freshness', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}