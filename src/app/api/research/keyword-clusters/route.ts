import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { topic, contentType, targetAudience } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Generate conversational keyword clusters
    const keywordPrompt = `
    Generate conversational keyword clusters for the topic: "${topic}"

    Context:
    - Content Type: ${contentType || 'general content'}
    - Target Audience: ${targetAudience || 'general audience'}

    Focus on conversational, long-tail keywords that people would use in:
    1. Voice search queries
    2. Question-based searches
    3. Natural language conversations
    4. AI assistant interactions

    For each cluster, provide:
    1. Main topic/category
    2. List of related conversational keywords (5-10 keywords)
    3. Search intent (informational, commercial, navigational)
    4. Estimated monthly search volume
    5. Difficulty score (0-100)

    Generate 4-6 keyword clusters that cover different aspects of the topic.

    Format your response as JSON:
    {
      "clusters": [
        {
          "id": "unique_id",
          "topic": "cluster topic",
          "keywords": ["keyword1", "keyword2", "keyword3"],
          "intent": "informational|commercial|navigational",
          "volume": 1500,
          "difficulty": 65
        }
      ]
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert in keyword research and conversational search optimization. Specialize in identifying long-tail, conversational keywords that perform well in voice search and AI interactions.'
        },
        {
          role: 'user',
          content: keywordPrompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    });

    const keywordContent = completion.choices[0]?.message?.content;
    
    if (!keywordContent) {
      throw new Error('No keyword clusters generated from AI');
    }

    // Parse the JSON response
    let keywordResult;
    try {
      keywordResult = JSON.parse(keywordContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      keywordResult = {
        clusters: []
      };
    }

    return NextResponse.json({
      success: true,
      data: keywordResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Keyword cluster generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate keyword clusters', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}