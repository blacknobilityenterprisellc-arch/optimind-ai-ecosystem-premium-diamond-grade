import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { content, contentType } = await request.json();

    if (!content || !contentType) {
      return NextResponse.json(
        { error: 'Content and content type are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Analyze content for citations, E-E-A-T, and optimization opportunities
    const analysisPrompt = `
    Analyze the following ${contentType} content for AEO/GEO optimization opportunities:

    Content: "${content}"

    Please provide a comprehensive analysis including:
    1. Citation opportunities (statistics, facts, data points, quotes) that AI could extract
    2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) recommendations
    3. Suggested schema markup types
    4. Conversational keyword clusters related to the content
    5. Overall optimization score (0-100)

    Format your response as JSON with the following structure:
    {
      "citations": [
        {
          "type": "statistic|fact|data|quote",
          "content": "the citable content",
          "source": "suggested source",
          "confidence": 85,
          "priority": "high|medium|low"
        }
      ],
      "eeatRecommendations": [
        {
          "category": "experience|expertise|authoritativeness|trustworthiness",
          "recommendation": "specific recommendation",
          "impact": "high|medium|low",
          "implementation": "how to implement"
        }
      ],
      "schemaMarkups": [
        {
          "type": "schema type",
          "fields": {},
          "confidence": 90
        }
      ],
      "keywordClusters": [
        {
          "topic": "topic name",
          "keywords": ["keyword1", "keyword2"],
          "intent": "informational|commercial|navigational",
          "volume": 1000,
          "difficulty": 65
        }
      ],
      "optimizationScore": 85
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert AEO/GEO optimization specialist. Analyze content for AI optimization opportunities and provide structured recommendations.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const analysisContent = completion.choices[0]?.message?.content;
    
    if (!analysisContent) {
      throw new Error('No analysis content received from AI');
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      analysisResult = {
        citations: [],
        eeatRecommendations: [],
        schemaMarkups: [],
        keywordClusters: [],
        optimizationScore: 50
      };
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}