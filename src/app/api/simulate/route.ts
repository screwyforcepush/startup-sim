import { NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';

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

interface SimulationMetrics {
  feasibility: number;
  desirability: number;
  viability: number;
}

interface SimulationAnalysis {
  milestones: string[];
  challenges: string[];
  recommendations: string[];
  revenue: number;
}

interface SimulationResult {
  metrics: SimulationMetrics;
  analysis: SimulationAnalysis;
}

interface YearlyProgress {
  year: number;
  metrics: SimulationMetrics;
  analysis: SimulationAnalysis;
}

interface SimulationResponse {
  success: boolean;
  yearlyProgress: YearlyProgress[];
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simulation prompt template
const generateSimulationPrompt = (input: SimulationInput, year: number) => {
  return `You are a startup simulation expert. Based on the following startup parameters, simulate year ${year} of operations:

Sector: ${input.sector}
Nation: ${input.nation}
AI Disruption Pattern: ${input.aiDisruptionPattern}
Business Model: ${input.businessModel}
Team Archetype: ${input.teamArchetype}
Startup Pitch: ${input.startupPitch}

Provide a detailed analysis with the following metrics (scored 0-100):
1. Feasibility (team & technical capability match)
2. Desirability (market fit and adoption potential)
3. Viability (business model sustainability)

Also include:
- Key milestones achieved
- Major challenges faced
- Strategic recommendations
- Revenue projections

Format your response as JSON with the following structure:
{
  "metrics": {
    "feasibility": number,
    "desirability": number,
    "viability": number
  },
  "analysis": {
    "milestones": string[],
    "challenges": string[],
    "recommendations": string[],
    "revenue": number
  }
}`;
};

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

    // Simulate first year
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a startup simulation expert that provides analysis in JSON format.'
        },
        {
          role: 'user',
          content: generateSimulationPrompt(validatedInput, 1)
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const simulationResult = JSON.parse(content) as SimulationResult;
    const response: SimulationResponse = {
      success: true,
      yearlyProgress: [{
        year: 1,
        ...simulationResult
      }]
    };

    return NextResponse.json(response);

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