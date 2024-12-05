'use client';

import { useState } from 'react';
import { InputForm } from '@/components/input-interface/input-form';
import type { SimulationInput } from '@/components/input-interface/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSimulationSubmit(data: SimulationInput) {
    setIsLoading(true);
    try {
      // TODO: Implement API call to simulation endpoint
      console.log('Simulation data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Startup Simulator</h1>
      <div className="max-w-2xl mx-auto">
        <InputForm onSubmit={handleSimulationSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}
