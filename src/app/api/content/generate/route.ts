import { ValidationSchemas, validateInput, EnhancedError } from '@/lib/input-validation';
import { premiumZAIWrapper } from '@/lib/zai-sdk-wrapper';

export async function POST() {
  try {
    const body = await request.json();

    // Validate required fields using proper schema
    const validatedData = validateInput(ValidationSchemas.Content.Generate, body);

    // Generate content using ZAI wrapper with fallback
    const prompt = `Generate ${validatedData.contentType} content about "${validatedData.topic}" with a ${validatedData.tone} tone for ${validatedData.targetAudience}. 
    Length should be ${validatedData.length}. 
    ${validatedData.keywords.length > 0 ? `Include these keywords: ${validatedData.keywords.join(', ')}.` : ''}
    
    Please provide well-structured, engaging content that is appropriate for the specified audience and tone.`;

    const completion = await premiumZAIWrapper.createChatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You are an expert content writer who creates high-quality, engaging content tailored to specific audiences and tones.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new EnhancedError('Failed to generate content', 'CONTENT_GENERATION_FAILED');
    }

    return NextResponse.json({
      success: true,
      content: response,
      model: completion.model,
      usage: completion.usage,
      metadata: {
        topic: validatedData.topic,
        contentType: validatedData.contentType,
        tone: validatedData.tone,
        length: validatedData.length,
        targetAudience: validatedData.targetAudience,
        keywords: validatedData.keywords,
      },
    });
  } catch (error) {
    console.error('Content generation error:', error);

    if (error instanceof EnhancedError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to generate content',
        code: 'CONTENT_GENERATION_ERROR',
      },
      { status: 500 }
    );
  }
}
