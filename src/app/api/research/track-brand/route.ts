import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { brandName, timeRange } = await request.json();

    if (!brandName) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Use web search to find brand mentions
    const searchQuery = `${brandName} brand mentions AI overview featured snippets`;
    
    const searchResult = await zai.functions.invoke("web_search", {
      query: searchQuery,
      num: 20
    });

    // Analyze search results for brand mentions
    const analysisPrompt = `
    Analyze the following search results for brand mentions of "${brandName}":

    Search Results: ${JSON.stringify(searchResult)}

    Please extract and categorize brand mentions with the following information:
    1. Source name and URL
    2. Title of the content
    3. Snippet mentioning the brand
    4. Sentiment (positive, neutral, negative)
    5. Authority score (0-100) based on source credibility
    6. Type of mention (ai_overview, featured_snippet, organic_result, social_media)
    7. Date (if available)

    Also calculate overall metrics:
    - Total mentions
    - AI overview mentions count
    - Featured snippet mentions count
    - Average authority score
    - Sentiment score (percentage of positive mentions)
    - Monthly growth estimate

    Format your response as JSON:
    {
      "metrics": {
        "totalMentions": 0,
        "aiOverviewMentions": 0,
        "featuredSnippetMentions": 0,
        "authorityScore": 0,
        "sentimentScore": 0,
        "monthlyGrowth": 0,
        "topSources": []
      },
      "mentions": [
        {
          "id": "unique_id",
          "source": "source name",
          "url": "url",
          "title": "content title",
          "snippet": "mention snippet",
          "sentiment": "positive|neutral|negative",
          "authority": 85,
          "date": "2024-01-15",
          "type": "ai_overview|featured_snippet|organic_result|social_media"
        }
      ]
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in brand monitoring and social listening. Analyze search results to extract brand mentions and provide comprehensive metrics.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2500
    });

    const analysisContent = completion.choices[0]?.message?.content;
    
    if (!analysisContent) {
      throw new Error('No analysis content received from AI');
    }

    // Parse the JSON response
    let trackingResult;
    try {
      trackingResult = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      trackingResult = {
        metrics: {
          totalMentions: 0,
          aiOverviewMentions: 0,
          featuredSnippetMentions: 0,
          authorityScore: 0,
          sentimentScore: 0,
          monthlyGrowth: 0,
          topSources: []
        },
        mentions: []
      };
    }

    return NextResponse.json({
      success: true,
      data: trackingResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Brand tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track brand mentions', details: error.message },
      { status: 500 }
    );
  }
}