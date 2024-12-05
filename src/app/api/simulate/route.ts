import { NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schema
const simulationInputSchema = z.object({
  sector: z.string(),
  nation: z.string(),
  aiDisruptionPattern: z.string(),
  businessModel: z.string(),
  teamArchetype: z.string(),
  startupPitch: z.string()
});

export type SimulationInput = z.infer<typeof simulationInputSchema>;

// Disable body parser size limit for streaming
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

// POST handler for simulation requests
export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const validatedInput = simulationInputSchema.parse(body);

    // TODO: Implement OpenAI integration in Step 5
    // For now, return a mock response
    const mockResponse = {
      success: true,
      message: 'Simulation request received',
      input: validatedInput,
      yearlyProgress: [
        {
          year: 1,
          metrics: {
            feasibility: 75,
            desirability: 80,
            viability: 70
          }
        }
      ]
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Simulation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET requests are not supported
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  );
} 