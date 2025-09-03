import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const validationSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate form data
    const validatedData = validationSchema.safeParse(body)
    
    if (!validatedData.success) {
      return NextResponse.json({
        success: false,
        errors: validatedData.error.errors
      }, { status: 400 })
    }

    const validation = {
      isValid: true,
      score: 0.95,
      issues: [],
      suggestions: [
        'Consider adding more context to your message',
        'Email format is correct'
      ]
    }

    return NextResponse.json({
      data: validation,
      status: 'success'
    })
  } catch {
    return NextResponse.json({ 
      error: 'Failed to validate form',
      status: 'error' 
    })
  }
}