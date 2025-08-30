import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { contentId, url, metrics, timeframe } = await request.json();

    if (!contentId && !url) {
      return NextResponse.json(
        { error: 'Content ID or URL is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Analyze content performance
    const performancePrompt = `
    Analyze content performance and provide optimization insights:

    Content ID: ${contentId || 'unknown'}
    URL: ${url || 'unknown'}
    Timeframe: ${timeframe || '30 days'}
    Current Metrics: ${JSON.stringify(metrics || {})}

    Analyze the following aspects:
    1. Traffic patterns and trends
    2. User engagement metrics
    3. Conversion performance
    4. Keyword ranking changes
    5. Social media performance
    6. Technical performance indicators
    7. Content quality indicators
    8. Competitive positioning

    Provide insights and recommendations:
    1. Performance strengths
    2. Areas for improvement
    3. Optimization opportunities
    4. Trend analysis
    5. Competitive benchmarking
    6. Actionable recommendations

    Format your response as JSON:
    {
      "performance": {
        "pageViews": 15000,
        "organicTraffic": 8500,
        "bounceRate": 42,
        "timeOnPage": 245,
        "conversions": 150,
        "keywordRankings": 15,
        "socialShares": 300
      },
      "trends": {
        "trafficGrowth": 23,
        "engagementRate": 15,
        "conversionRate": 8,
        "rankingImprovement": 12
      },
      "insights": [
        {
          "type": "strength|weakness|opportunity|threat",
          "category": "traffic|engagement|conversion|technical",
          "title": "Insight title",
          "description": "Detailed description",
          "impact": "high|medium|low",
          "data": "Supporting data"
        }
      ],
      "recommendations": [
        {
          "id": "unique_id",
          "title": "Recommendation title",
          "description": "Detailed recommendation",
          "category": "content|technical|seo|ux",
          "priority": "high|medium|low",
          "expectedImpact": 85,
          "implementation": "Implementation steps"
        }
      ],
      "benchmark": {
        "industryAverage": {
          "bounceRate": 45,
          "timeOnPage": 180,
          "conversionRate": 2.5
        },
        "topPerformer": {
          "bounceRate": 35,
          "timeOnPage": 300,
          "conversionRate": 4.2
        }
      }
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content performance analyst specializing in digital marketing and SEO optimization. Provide data-driven insights and actionable recommendations.'
        },
        {
          role: 'user',
          content: performancePrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2500
    });

    const performanceContent = completion.choices[0]?.message?.content;
    
    if (!performanceContent) {
      throw new Error('No performance analysis received from AI');
    }

    // Parse the JSON response
    let performanceResult;
    try {
      performanceResult = JSON.parse(performanceContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      performanceResult = {
        performance: {},
        trends: {},
        insights: [],
        recommendations: [],
        benchmark: {}
      };
    }

    return NextResponse.json({
      success: true,
      data: performanceResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content performance analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content performance', details: error.message },
      { status: 500 }
    );
  }
}