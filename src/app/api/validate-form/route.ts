import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/lib/ai';

interface FormField {
  name: string;
  value: string;
  type: string;
  required?: boolean;
  validation?: string;
}

interface FormValidationRequest {
  fields: FormField[];
  formType: string;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fields, formType, context } = body as FormValidationRequest;

    // Validate required fields
    if (!fields || !Array.isArray(fields) || !formType) {
      return NextResponse.json(
        { error: 'Fields array and form type are required' },
        { status: 400 }
      );
    }

    // Build validation prompt
    const validationPrompt = buildValidationPrompt(fields, formType, context);

    // Validate form using AI service
    const result = await aiService.chat({
      messages: [
        {
          role: 'system',
          content: 'You are an expert form validation assistant. Analyze the provided form fields and identify validation issues, suggest improvements, and provide specific feedback for each field.'
        },
        {
          role: 'user',
          content: validationPrompt
        }
      ],
      model: 'openai/gpt-4-turbo',
      temperature: 0.3
    });

    // Parse the AI response to extract validation results
    const validationResults = parseValidationResponse(result.content);

    return NextResponse.json({
      success: true,
      validationResults,
      model: result.model,
      usage: result.usage,
      cost: result.cost
    });

  } catch (error) {
    console.error('Form validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate form' },
      { status: 500 }
    );
  }
}

function buildValidationPrompt(fields: FormField[], formType: string, context?: string): string {
  let prompt = `Validate the following ${formType} form fields:\n\n`;
  
  fields.forEach((field, index) => {
    prompt += `Field ${index + 1}:\n`;
    prompt += `- Name: ${field.name}\n`;
    prompt += `- Type: ${field.type}\n`;
    prompt += `- Value: "${field.value}"\n`;
    prompt += `- Required: ${field.required ? 'Yes' : 'No'}\n`;
    if (field.validation) {
      prompt += `- Validation Rules: ${field.validation}\n`;
    }
    prompt += '\n';
  });

  if (context) {
    prompt += `Additional Context: ${context}\n\n`;
  }

  prompt += `Please provide a detailed validation analysis in JSON format with the following structure:
{
  "overallScore": 0-100,
  "fieldValidations": [
    {
      "fieldName": "field_name",
      "isValid": true/false,
      "issues": ["issue1", "issue2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "improvedValue": "suggested_improved_value"
    }
  ],
  "recommendations": ["general_recommendation1", "general_recommendation2"],
  "summary": "overall_validation_summary"
}`;

  return prompt;
}

function parseValidationResponse(aiResponse: string) {
  try {
    // Try to parse JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, return a basic structure
    return {
      overallScore: 75,
      fieldValidations: [],
      recommendations: [aiResponse],
      summary: "AI analysis completed but JSON parsing failed"
    };
  } catch (error) {
    console.error('Error parsing validation response:', error);
    return {
      overallScore: 50,
      fieldValidations: [],
      recommendations: ["Error parsing AI response"],
      summary: "Validation analysis encountered an error"
    };
  }
}