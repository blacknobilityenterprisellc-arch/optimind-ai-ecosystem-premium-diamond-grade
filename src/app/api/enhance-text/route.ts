import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { aiService } from '@/lib/ai';
=======
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
<<<<<<< HEAD
    const { text, enhancement, context } = body;

    // Validate required fields
    if (!text || !enhancement) {
      return NextResponse.json(
        { error: 'Text and enhancement type are required' },
        { status: 400 }
      );
    }

    // Enhance text using AI service
    const result = await aiService.enhanceText({
      text,
      enhancement,
      context: context || ''
    });

    return NextResponse.json({
      success: true,
      enhancedText: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Text enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance text' },
      { status: 500 }
    );
=======
    const { text, enhancements } = body;
    
    // Text enhancement logic here
    const enhancedText = {
      original: text,
      enhanced: text,
      improvements: [],
      confidence: 0.95
    };
    
    return NextResponse.json({ 
      message: 'Text enhanced',
      result: enhancedText,
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to enhance text',
      status: 'error' 
    }, { status: 500 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}