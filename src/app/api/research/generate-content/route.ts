import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { topic, contentType, tone, targetAudience } = await request.json();

    if (!topic || !contentType) {
      return NextResponse.json(
        { error: 'Topic and content type are required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Generate natural language content optimized for AEO/GEO
    const contentPrompt = `
    Generate a comprehensive ${contentType} about "${topic}" optimized for AEO/GEO (Answer Engine Optimization / Generative Engine Optimization).

    Content Requirements:
    - Target Audience: ${targetAudience || 'general audience'}
    - Tone: ${tone || 'professional and informative'}
    - Focus on conversational, natural language that works well for voice search
    - Include structured data opportunities
    - Optimize for featured snippets and AI overviews
    - Include question-based content and clear answers
    - Add E-E-A-T signals (Experience, Expertise, Authoritativeness, Trustworthiness)

    Content Structure:
    1. Compelling introduction that addresses user intent
    2. Clear sections with descriptive headings
    3. FAQ section with common questions
    4. Actionable insights and recommendations
    5. Conclusion with next steps

    Please generate content that:
    - Uses natural, conversational language
    - Includes long-tail keywords and phrases
    - Provides comprehensive answers to potential questions
    - Is structured for easy AI extraction and citation
    - Includes statistics and data points where relevant
    - Demonstrates expertise and authority on the topic

    Return the content in markdown format.
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert content creator specializing in AEO/GEO optimization. You create content that performs well in AI overviews, featured snippets, and voice search results.'
        },
        {
          role: 'user',
          content: contentPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const generatedContent = completion.choices[0]?.message?.content;
    
    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent,
        metadata: {
          topic,
          contentType,
          tone: tone || 'professional',
          targetAudience: targetAudience || 'general',
          wordCount: generatedContent.split(' ').length,
          generatedAt: new Date().toISOString()
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error.message },
      { status: 500 }
    );
  }
}