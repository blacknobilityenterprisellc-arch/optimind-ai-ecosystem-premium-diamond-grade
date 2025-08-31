<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = '1024x1024', style, quality = 'standard' } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const response = await zai.images.generations.create({
      prompt,
      size,
      style,
      quality
    })

    const imageData = response.data[0]?.base64

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      imageData,
      prompt,
      size,
      style,
      quality
    })

  } catch (error: any) {
    console.error('Image generation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
=======
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Images API endpoint',
      status: 'operational',
      endpoints: ['analyze', 'optimize', 'generate', 'upload']
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      message: 'Image processing initiated',
      data: body
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
>>>>>>> c358f87d910e205477b71ec74630ccafe0f3c33d
  }
}