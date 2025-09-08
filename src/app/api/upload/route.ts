import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Mock upload response
    const uploadResult = {
      id: Math.random().toString(36).slice(2, 11),
      filename: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      url: `/uploads/${file.name}`,
      analysis: {
        status: 'pending',
        progress: 0,
      },
      uploadedAt: new Date().toISOString(),
    };

    return NextResponse.json(uploadResult);
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}
