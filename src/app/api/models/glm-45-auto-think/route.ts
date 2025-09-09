
import { zaiApiService } from '@/lib/zai-api-service';

export async function POST() {
  try {
    const body = await request.json();
    const { messages, imageBase64, analysisType, customPrompt } = body;

    // Handle chat completion (messages format)
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const prompt = lastMessage.content;

      const result = await zaiApiService.generateCompletion(prompt, 'glm-45-auto-think', {
        customPrompt,
      });

      return NextResponse.json({
        id: result.id,
        model: result.model,
        content: result.content,
        usage: result.usage,
        timestamp: result.timestamp,
      });
    }

    // Handle image analysis (image format)
    if (imageBase64 && analysisType) {
      const result = await zaiApiService.analyzeWithModel({
        imageBase64,
        analysisType,
        modelId: 'glm-45-auto-think',
        customPrompt,
      });

      return NextResponse.json(result);
    }

    // If neither format is provided, return error
    return NextResponse.json(
      {
        error:
          'Invalid request format. Provide either "messages" for chat or "imageBase64" and "analysisType" for image analysis.',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('GLM-4.5 Auto Think analysis failed:', error);
    return NextResponse.json({ error: 'GLM-4.5 Auto Think analysis failed' }, { status: 500 });
  }
}
