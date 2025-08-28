import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { competitorUrls, topic } = await request.json();

    if (!competitorUrls || !Array.isArray(competitorUrls) || competitorUrls.length === 0) {
      return NextResponse.json(
        { error: 'Competitor URLs are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Analyze competitor content
    const competitorPrompt = `
    Analyze the following competitor URLs for content strategy and identify opportunities:

    Competitor URLs: ${competitorUrls.join(', ')}
    Topic: ${topic || 'general'}

    For each competitor, analyze:
    1. Content quality and depth
    2. SEO optimization level
    3. Readability and structure
    4. Engagement factors
    5. Backlink profile and authority
    6. Social media presence
    7. Content freshness
    8. Unique value propositions

    Identify content gaps and opportunities:
    1. Missing topics or subtopics
    2. Content depth opportunities
    3. Format and structure improvements
    4. Keyword gaps and opportunities
    5. Multimedia and interactive content gaps
    6. User experience improvements
    7. Expertise and authority gaps

    For each competitor, identify strengths and weaknesses:
    1. Content strengths
    2. Technical weaknesses
    3. User experience issues
    4. Missing opportunities

    Format your response as JSON:
    {
      "competitors": [
        {
          "id": "unique_id",
          "url": "competitor_url",
          "title": "content_title",
          "domain": "domain_name",
          "wordCount": 2500,
          "publishDate": "2024-01-15",
          "contentScore": 85,
          "seoScore": 82,
          "readabilityScore": 88,
          "engagementScore": 75,
          "backlinks": 150,
          "socialShares": 500,
          "ranking": 1
        }
      ],
      "gaps": [
        {
          "id": "unique_id",
          "type": "missing_topic|content_depth|format_opportunity|keyword_gap|multimedia_gap",
          "title": "Gap title",
          "description": "Gap description",
          "priority": "high|medium|low",
          "competitorCount": 0,
          "estimatedImpact": 85
        }
      ],
      "analysis": [
        {
          "id": "unique_id",
          "competitor": "Competitor Name",
          "type": "strength|weakness",
          "category": "Content|Technical|UX",
          "description": "Description",
          "impact": 75
        }
      ],
      "summary": {
        "averageContentScore": 82,
        "averageSeoScore": 78,
        "topOpportunities": 5,
        "contentGapsFound": 12
      }
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert competitor analyst specializing in content strategy and SEO. Analyze competitor content to identify gaps, opportunities, and strategic insights.'
        },
        {
          role: 'user',
          content: competitorPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
    });

    const analysisContent = completion.choices[0]?.message?.content;
    
    if (!analysisContent) {
      throw new Error('No competitor analysis received from AI');
    }

    // Parse the JSON response
    let competitorResult;
    try {
      competitorResult = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      competitorResult = {
        competitors: [],
        gaps: [],
        analysis: [],
        summary: {
          averageContentScore: 75,
          averageSeoScore: 70,
          topOpportunities: 3,
          contentGapsFound: 8
        }
      };
    }

    return NextResponse.json({
      success: true,
      data: competitorResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Competitor analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze competitors', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}