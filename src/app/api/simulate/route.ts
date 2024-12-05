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
const generateSimulationPrompt = (input: SimulationInput, year: number, previousYearResult?: SimulationResult) => {
  const basePrompt = `You are a startup simulation expert. Based on the following startup parameters, simulate year ${year} of operations:

Sector: ${input.sector}
Nation: ${input.nation}
AI Disruption Pattern: ${input.aiDisruptionPattern}
Business Model: ${input.businessModel}
Team Archetype: ${input.teamArchetype}
Startup Pitch: ${input.startupPitch}`;

  const previousYearContext = previousYearResult ? `
Previous Year Performance:
- Revenue: ${previousYearResult.analysis.revenue}
- Key Milestones: ${previousYearResult.analysis.milestones.join(', ')}
- Challenges: ${previousYearResult.analysis.challenges.join(', ')}` : '';

  return `${basePrompt}${previousYearContext}

Provide a detailed analysis with the following metrics (scored 0-100):
1. Feasibility (team & technical capability match)
2. Desirability (market fit and adoption potential)
3. Viability (business model sustainability)

Also include:
- Key milestones achieved
- Major challenges faced
- Strategic recommendations
- Revenue projections
- Market share percentage
- Customer base size

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
    "revenue": number,
    "marketShare": number,
    "customerBase": number
  }
}

Consider the following for year ${year}:
${year === 1 ? '- Initial market entry and validation phase' : '- Build upon previous year\'s performance and learnings'}
- Growth should compound based on previous success
- Challenges from previous may distrupt a posistive trajectory
- Early adopter to early majority transition
- Market dynamics and competition
- Team capability development
- Technology adoption curve
${previousYearResult ? `- Previous year's momentum and challenges
- Compound growth opportunities from established base
- Capability disadvantages of team archetype
- Learning curve advantages from past experience` : ''}`;
};

// Disable body parser size limit for streaming
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

// Add debug logging function
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Simulation API] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

// POST handler for simulation requests
export async function POST(request: Request) {
  const encoder = new TextEncoder();
  
  try {
    debugLog('Received simulation request');
    
    // Parse and validate the request body
    const body = await request.json();
    const validatedInput = simulationInputSchema.parse(body);
    debugLog('Validated input:', validatedInput);

    // Create a TransformStream for streaming the results
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    debugLog('Created stream and writer');

    // Start processing in the background
    (async () => {
      try {
        let previousYearResult: SimulationResult | undefined;

        // Simulate 5 years
        for (let year = 1; year <= 5; year++) {
          debugLog(`Starting simulation for year ${year}`);
          
          const prompt = generateSimulationPrompt(validatedInput, year, previousYearResult);
          debugLog(`Generated prompt for year ${year}:`, prompt);

          debugLog(`Calling OpenAI API for year ${year}`);
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
            messages: [
              {
                role: 'system',
                content: 'You are a startup simulation expert that provides analysis in JSON format. Consider previous year performance for compounding effects.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            response_format: { type: 'json_object' }
          });

          const content = completion.choices[0].message.content;
          if (!content) {
            debugLog(`No content received from OpenAI for year ${year}`);
            throw new Error('No content received from OpenAI');
          }

          debugLog(`Received OpenAI response for year ${year}:`, content);

          const simulationResult = JSON.parse(content) as SimulationResult;
          const yearResult: YearlyProgress = {
            year,
            ...simulationResult
          };

          // Stream the year result immediately
          const yearData = JSON.stringify(yearResult) + '\n---\n';
          debugLog(`Writing year ${year} data to stream:`, yearData);
          await writer.write(encoder.encode(yearData));
          debugLog(`Successfully streamed result for year ${year}`);

          // Store the result for next year's context
          previousYearResult = simulationResult;

          // Small delay between years
          if (year < 5) {
            debugLog(`Waiting before processing year ${year + 1}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Signal end of stream
        debugLog('Sending END marker');
        await writer.write(encoder.encode('END\n'));
        debugLog('Closing writer');
        await writer.close();
        debugLog('Simulation completed successfully');
      } catch (error) {
        debugLog('Error in stream processing:', error);
        // Try to write error to stream before closing
        const errorMsg = { error: error instanceof Error ? error.message : 'Unknown error' };
        debugLog('Writing error to stream:', errorMsg);
        await writer.write(encoder.encode(JSON.stringify(errorMsg) + '\n'));
        await writer.close();
      }
    })();

    debugLog('Returning stream to client');
    // Return the readable stream immediately
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    debugLog('Error in POST handler:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }

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