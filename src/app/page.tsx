'use client';

import { useState } from 'react';
import { InputForm } from '@/components/input-interface/input-form';
import { OutputDisplay } from '@/components/output-display/output-display';
import type { SimulationInput } from '@/components/input-interface/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [simulationData, setSimulationData] = useState<{id: string; data: SimulationInput} | null>(null);

  async function handleSimulationSubmit(data: SimulationInput) {
    console.log('[Page] Starting simulation with data:', data);
    setIsLoading(true);
    setError(undefined);
    
    // Store simulation data with ID
    const newSimulationData = {
      id: crypto.randomUUID(),
      data
    };
    console.log('[Page] Generated simulation data:', newSimulationData);
    setSimulationData(newSimulationData);
    setIsLoading(false);
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
            simulationId={simulationData?.id ?? ''}
            simulationData={simulationData?.data}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
