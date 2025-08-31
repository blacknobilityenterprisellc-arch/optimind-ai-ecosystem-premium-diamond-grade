import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import { aiService } from '@/lib/ai';
=======
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
<<<<<<< HEAD
    const { data, analysisType } = body;

    // Validate required fields
    if (!data || !analysisType) {
      return NextResponse.json(
        { error: 'Data and analysis type are required' },
        { status: 400 }
      );
    }

    // Analyze data using AI service
    const result = await aiService.analyzeData(data, analysisType);

    return NextResponse.json({
      success: true,
      analysis: result.content,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Data analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data' },
      { status: 500 }
    );
=======
    const { data, type } = body;
    
    // Data analysis logic here
    const analysisResult = {
      processed: true,
      insights: [],
      summary: 'Data analysis completed'
    };
    
    return NextResponse.json({ 
      message: 'Data analysis completed',
      result: analysisResult,
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to analyze data',
      status: 'error' 
    }, { status: 500 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}