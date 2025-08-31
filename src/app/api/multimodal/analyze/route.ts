import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const { mediaUrl, mediaType, file } = await request.json();

    if (!mediaUrl && !file) {
      return NextResponse.json(
        { error: 'Media URL or file is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    // Analyze media for optimization opportunities
    const analysisPrompt = `
    Analyze the following media for optimization opportunities:

    Media URL: ${mediaUrl || 'uploaded file'}
    Media Type: ${mediaType || 'auto-detected'}

    Please analyze the media and provide comprehensive optimization recommendations:

    For Video Content:
    1. Video compression and quality optimization
    2. Audio quality enhancement
    3. Thumbnail optimization
    4. Caption and transcription needs
    5. Chapter markers and timestamps
    6. SEO metadata optimization
    7. Loading performance optimization
    8. Accessibility improvements

    For Audio Content:
    1. Audio quality enhancement
    2. Compression and format optimization
    3. Transcription accuracy
    4. Chapter markers and timestamps
    5. Podcast RSS optimization
    6. Show notes generation
    7. ID3 tag optimization
    8. Accessibility features

    For Image Content:
    1. Compression and resizing optimization
    2. Format conversion recommendations
    3. Alt text generation for accessibility
    4. EXIF metadata optimization
    5. Lazy loading optimization
    6. Responsive image optimization
    7. SEO metadata generation
    8. Color and contrast optimization

    Provide scores for:
    - Overall optimization score (0-100)
    - SEO score (0-100)
    - Accessibility score (0-100)
    - Performance score (0-100)

    Format your response as JSON:
    {
      "optimizationScore": {
        "overall": 75,
        "seo": 70,
        "accessibility": 65,
        "performance": 80
      },
      "recommendations": [
        {
          "id": "unique_id",
          "type": "compression|format_conversion|metadata_enhancement|alt_text_generation|transcription|chapter_markers|quality_enhancement",
          "priority": "high|medium|low",
          "description": "Detailed recommendation",
          "impact": 85,
          "effort": 40,
          "estimatedTime": "10 minutes",
          "implementationSteps": ["Step 1", "Step 2"]
        }
      ],
      "analysis": {
        "currentFormat": "MP4",
        "fileSize": "245MB",
        "duration": "15:42",
        "resolution": "1920x1080",
        "bitrate": "2000 kbps",
        "issues": ["Large file size", "No captions", "Poor thumbnail"],
        "opportunities": ["Add compression", "Generate captions", "Optimize thumbnail"]
      }
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert media optimization specialist. Analyze media files and provide specific, actionable recommendations for optimization, SEO, and accessibility improvements.'
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
      throw new Error('No media analysis received from AI');
    }

    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      analysisResult = {
        optimizationScore: {
          overall: 70,
          seo: 65,
          accessibility: 60,
          performance: 75
        },
        recommendations: [],
        analysis: {}
      };
    }

    return NextResponse.json({
      success: true,
      data: analysisResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Media analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze media', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}