import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { aiService } from '@/lib/ai';
=======
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
<<<<<<< HEAD
    const { context, type } = body;

    // Validate required fields
    if (!context || !type) {
      return NextResponse.json(
        { error: 'Context and type are required' },
        { status: 400 }
      );
    }

    // Get recommendations using AI service
    const result = await aiService.getRecommendations(context, type);

    return NextResponse.json({
      success: true,
      recommendations: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
=======
    const { context, preferences } = body;
    
    // Recommendations logic here
    const recommendations = {
      items: [],
      confidence: 0.85,
      generated_at: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      message: 'Recommendations generated',
      data: recommendations,
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to generate recommendations',
      status: 'error' 
    }, { status: 500 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}