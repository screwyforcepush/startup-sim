'use client';

import { useState } from 'react';
import { InputForm } from '@/components/input-interface/input-form';
import { OutputDisplay } from '@/components/output-display/output-display';
import type { SimulationInput } from '@/components/input-interface/types';
import type { SimulationResult } from '@/components/output-display/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<SimulationResult | null>(null);

  async function handleSimulationSubmit(data: SimulationInput) {
    setIsLoading(true);
    setError(undefined);
    
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to run simulation');
      }

      if (!responseData.success) {
        throw new Error(responseData.error || 'Simulation failed');
      }

      // Transform API response to match SimulationResult type
      const simulationResult: SimulationResult = {
        id: crypto.randomUUID(),
        inputParameters: {
          sector: data.sector,
          nation: data.nation,
          aiDisruptionPattern: data.aiDisruptionPattern,
          businessModel: data.businessModel,
          teamArchetype: data.teamArchetype,
          pitch: data.startupPitch
        },
        yearlyResults: responseData.yearlyProgress.map((year: any) => ({
          year: year.year,
          revenue: year.analysis.revenue,
          marketShare: 0, // TODO: Add to API response
          customerBase: 0, // TODO: Add to API response
          kpis: {
            feasibility: year.metrics.feasibility,
            desirability: year.metrics.desirability,
            viability: year.metrics.viability
          },
          milestones: year.analysis.milestones,
          challenges: year.analysis.challenges
        })),
        recommendations: responseData.yearlyProgress[0].analysis.recommendations,
        overallScore: Math.round(
          (responseData.yearlyProgress[0].metrics.feasibility +
           responseData.yearlyProgress[0].metrics.desirability +
           responseData.yearlyProgress[0].metrics.viability) / 3
        ),
        timestamp: new Date().toISOString()
      };

      setResult(simulationResult);
    } catch (err) {
      console.error('Simulation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Startup Simulator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full">
          <InputForm onSubmit={handleSimulationSubmit} isLoading={isLoading} />
        </div>
        <div className="w-full">
          <OutputDisplay 
            result={result}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
