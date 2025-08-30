import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { content, contentId, currentMetrics } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Generate refresh recommendations
    const refreshPrompt = `
    Analyze the following content and generate refresh recommendations:

    Content: "${content}"
    Content ID: ${contentId || 'unknown'}
    Current Metrics: ${JSON.stringify(currentMetrics || {})}

    Analyze the content and provide specific refresh recommendations including:
    1. Update statistics and data points
    2. Add new sections or subsections
    3. Improve readability and structure
    4. Add examples and case studies
    5. Update keywords and SEO elements
    6. Add multimedia or interactive elements
    7. Improve E-E-A-T signals
    8. Update references and sources

    For each recommendation, provide:
    - Type of refresh needed
    - Priority level (high, medium, low)
    - Detailed description
    - Expected impact (0-100)
    - Required effort (0-100)
    - Estimated time to complete
    - Specific implementation steps

    Format your response as JSON:
    {
      "recommendations": [
        {
          "id": "unique_id",
          "contentId": "content_id",
          "type": "update_statistics|add_new_section|improve_readability|add_examples|update_keywords|add_multimedia|improve_eeat|update_references",
          "priority": "high|medium|low",
          "description": "Detailed description",
          "impact": 85,
          "effort": 40,
          "estimatedTime": "2 hours",
          "implementationSteps": ["Step 1", "Step 2"]
        }
      ],
      "summary": {
        "totalRecommendations": 5,
        "highPriorityCount": 2,
        "mediumPriorityCount": 2,
        "lowPriorityCount": 1,
        "averageImpact": 75,
        "averageEffort": 45,
        "totalEstimatedTime": "8 hours"
      }
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content strategist specializing in content refresh and optimization. Provide specific, actionable recommendations to improve content performance and relevance.'
        },
        {
          role: 'user',
          content: refreshPrompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2500
    });

    const refreshContent = completion.choices[0]?.message?.content;
    
    if (!refreshContent) {
      throw new Error('No refresh recommendations received from AI');
    }

    // Parse the JSON response
    let refreshResult;
    try {
      refreshResult = JSON.parse(refreshContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      refreshResult = {
        recommendations: [],
        summary: {
          totalRecommendations: 0,
          highPriorityCount: 0,
          mediumPriorityCount: 0,
          lowPriorityCount: 0,
          averageImpact: 0,
          averageEffort: 0,
          totalEstimatedTime: "0 hours"
        }
      };
    }

    return NextResponse.json({
      success: true,
      data: refreshResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content refresh recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate refresh recommendations', details: error.message },
      { status: 500 }
    );
  }
}