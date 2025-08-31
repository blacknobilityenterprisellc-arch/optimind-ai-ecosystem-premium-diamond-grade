import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { aiService } from '@/lib/ai';
=======
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
<<<<<<< HEAD
    const { code, language, task, context } = body;

    // Validate required fields
    if (!code || !language || !task) {
      return NextResponse.json(
        { error: 'Code, language, and task are required' },
        { status: 400 }
      );
    }

    // Get code assistance using AI service
    const result = await aiService.assistCode({
      code,
      language,
      task,
      context: context || ''
    });

    return NextResponse.json({
      success: true,
      result: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Code assistance error:', error);
    return NextResponse.json(
      { error: 'Failed to assist with code' },
      { status: 500 }
    );
=======
    const { code, language, request_type } = body;
    
    // Code assistance logic here
    const assistance = {
      suggestions: [],
      improvements: [],
      explanation: 'Code assistance provided'
    };
    
    return NextResponse.json({ 
      message: 'Code assistance completed',
      assistance,
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to provide code assistance',
      status: 'error' 
    }, { status: 500 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}