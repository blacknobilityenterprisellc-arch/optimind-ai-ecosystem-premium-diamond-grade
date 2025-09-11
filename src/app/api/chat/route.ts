import { EnhancedError } from '@/lib/error-handler';
import { NextResponse, NextRequest } from 'next/server';
import { withRateLimit, apiRateLimiter } from '@/lib/ai-rate-limiter';
import { withValidation, ValidationSchemas } from '@/lib/input-validation';
import ZAI from 'z-ai-web-dev-sdk';

// Apply rate limiting and validation middleware
const rateLimitMiddleware = withRateLimit(apiRateLimiter);
const validationMiddleware = withValidation(ValidationSchemas.AI.Chat);

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Apply input validation
    const validationResult = await validationMiddleware(request);
    if (!validationResult.success) {
      return validationResult.response!;
    }

    const {
      messages,
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 1000,
    } = validationResult.data!;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      model,
      temperature,
      max_tokens: maxTokens,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    return NextResponse.json({
      response,
      model: completion.model,
      usage: completion.usage,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
