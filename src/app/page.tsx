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
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">Startup Simulator</h1>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-12">Simulate and evaluate startup ideas in the MENA region</p>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
            <InputForm onSubmit={handleSimulationSubmit} isLoading={isLoading} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6">
            <OutputDisplay 
              simulationId={simulationData?.id ?? ''}
              simulationData={simulationData?.data}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
