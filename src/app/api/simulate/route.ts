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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simulation prompt template
const generateSimulationPrompt = (input: SimulationInput, year: number, previousYearResult?: SimulationResult, trajectory: string = '') => {
  const basePrompt = `Based on the following startup parameters, simulate the ${trajectory} year ${year} of operations:


Sector: ${input.sector}
Nation: ${input.nation}
AI Disruption Pattern: ${input.aiDisruptionPattern}
Business Model: ${input.businessModel}
Team Archetype: ${input.teamArchetype}
Startup Pitch: ${input.startupPitch}`;

  const previousYearContext = previousYearResult ? `
Compound the previous year's performance:
${previousYearResult}` : '';

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

# Format your response as JSON with the following structure:
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

// Add debug logging function
function debugLog(message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [Simulation API] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

// Add maxDuration export at the top of the file
export const maxDuration = 60; // 60 seconds for Pro plan
export const dynamic = 'force-dynamic';

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

            // Dice roll implementation
            let persona = 'You are a data-driven startup analyst that carefully evaluates market dynamics and startup potential in the MENA region to generate realistic outcomes.';
            let trajectory = 'a realistic';
            if (previousYearResult) {
                const metrics = previousYearResult.metrics;
                const minMetric = Math.min(
                    metrics.feasibility,
                    metrics.desirability,
                    metrics.viability
                );
                const diceRoll = Math.random() * minMetric;
                if (diceRoll < 20) {
                    persona = 'You are a veteran investor who has witnessed the dot-com crash, 2008 crisis, and countless startup failures, and approach each analysis with extreme caution about market challenges.';
                    trajectory = 'the catastrophic';
                } else if (diceRoll < 50) {
                    persona = 'You are a skeptical venture capitalist who has seen many startups fail in the MENA region and scrutinizes every aspect for potential failure points.';
                    trajectory = 'the negative';
                }
            }

          const prompt = generateSimulationPrompt(validatedInput, year, previousYearResult, trajectory);
          debugLog(`Generated prompt for year ${year}:`, prompt);

          debugLog(`Calling OpenAI API for year ${year}`);
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4-1106-preview',
            messages: [
              {
                role: 'system',
                content: `${persona} You are skilled at simulating startup trajectory in the MENA region.
                **You always respond in JSON format.**

# Analysis Instructions

**Regional Market Analysis**
- Evaluate sector fit for chosen country
- Consider country type advantages/limitations
- Assess regulatory environment
- Analyze timing based on regional development

**Technical Feasibility**
- Team archetype capabilities vs AI pattern requirements
- Infrastructure requirements vs country readiness
- Technical complexity vs team strengths
- Resource availability in chosen market

**Market Desirability**
- Cultural fit with region
- Problem urgency in market
- Target market size
- Competition analysis
- Early adopter accessibility

**Business Viability**
- Business model fit for region
- Revenue potential
- Cost structure requirements
- Market entry barriers
- Initial capital needs

**Apply Success Modifiers**
- Team archetype strengths
- Regional champion in local market
- Tech-heavy solution in tech-ready market
- Strong cultural fit

**Apply Risk Modifiers**
- Team archetype limitations
- Market timing misalignment
- Infrastructure gaps
- Cultural misfit

**Apply Random Event** (Chaos Factor)`
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