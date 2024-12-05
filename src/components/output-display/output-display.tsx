'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OutputDisplayProps, YearlyProgress, SimulationMetrics } from "./types";

function getGrowthProbability(metrics: SimulationMetrics): number {
  return Math.min(metrics.feasibility, metrics.desirability, metrics.viability);
}

function getGrowthProbabilityColor(probability: number): string {
  if (probability >= 70) return 'bg-emerald-500';
  if (probability >= 40) return 'bg-amber-500';
  return 'bg-rose-500';
}

function YearlyResult({ data }: { data: YearlyProgress }) {
  return (
    <Card className="p-6 space-y-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Year {data.year}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <h4 className="text-sm font-medium text-gray-500">Milestones</h4>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4">
            <ul className="space-y-3">
              {data.analysis.milestones.map((milestone: string, index: number) => (
                <li key={index} className="flex gap-3 text-gray-700">
                  <span className="text-emerald-600 shrink-0">•</span>
                  <span className="text-sm">{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <h4 className="text-sm font-medium text-gray-500">Challenges</h4>
          </div>
          <div className="bg-rose-50 rounded-lg p-4">
            <ul className="space-y-3">
              {data.analysis.challenges.map((challenge: string, index: number) => (
                <li key={index} className="flex gap-3 text-rose-600">
                  <span className="shrink-0">•</span>
                  <span className="text-sm">{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((year) => (
          <Skeleton key={year} className="h-[400px] w-full" />
        ))}
      </div>
    </div>
  );
}

export function OutputDisplay({ simulationId, simulationData, isLoading, error }: OutputDisplayProps) {
  const [yearlyResults, setYearlyResults] = useState<YearlyProgress[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!simulationId || !simulationData || isLoading) {
      console.log('[OutputDisplay] Missing required data:', { simulationId, simulationData, isLoading });
      return;
    }

    const fetchStream = async () => {
      try {
        console.log('[OutputDisplay] Starting simulation stream for ID:', simulationId);
        setIsStreaming(true);
        setYearlyResults([]); // Reset results for new simulation
        
        console.log('[OutputDisplay] Sending POST request with data:', { simulationId, ...simulationData });
        const response = await fetch('/api/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ simulationId, ...simulationData }),
        });

        if (!response.ok) {
          console.error('[OutputDisplay] HTTP error:', response.status, response.statusText);
          throw new Error('Failed to start simulation');
        }

        console.log('[OutputDisplay] Got response, getting reader');
        const reader = response.body?.getReader();
        if (!reader) {
          console.error('[OutputDisplay] No reader available');
          throw new Error('No reader available');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          console.log('[OutputDisplay] Reading chunk...');
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('[OutputDisplay] Stream complete');
            break;
          }

          const newText = decoder.decode(value, { stream: true });
          console.log('[OutputDisplay] Received chunk:', newText);
          buffer += newText;
          
          // Split by delimiter and process complete chunks
          const chunks = buffer.split('\n---\n');
          console.log('[OutputDisplay] Processing', chunks.length - 1, 'complete chunks');
          
          // Process all complete chunks except the last one
          for (let i = 0; i < chunks.length - 1; i++) {
            const chunk = chunks[i].trim();
            
            if (!chunk) {
              console.log('[OutputDisplay] Empty chunk, skipping');
              continue;
            }
            
            if (chunk === 'END') {
              console.log('[OutputDisplay] Received end of stream marker');
              setIsStreaming(false);
              return;
            }
            
            try {
              console.log('[OutputDisplay] Parsing chunk:', chunk);
              const yearResult = JSON.parse(chunk) as YearlyProgress;
              console.log('[OutputDisplay] Successfully parsed year', yearResult.year);
              
              // Check if this year's result is already in the array
              setYearlyResults(prev => {
                if (prev.some(r => r.year === yearResult.year)) {
                  console.log('[OutputDisplay] Year', yearResult.year, 'already exists, skipping');
                  return prev;
                }
                console.log('[OutputDisplay] Adding year', yearResult.year, 'to results');
                return [...prev, yearResult];
              });
            } catch (e) {
              console.error('[OutputDisplay] Error parsing chunk:', e);
              console.error('[OutputDisplay] Problematic chunk:', chunk);
              if (chunk.includes('"error":')) {
                try {
                  const errorObj = JSON.parse(chunk);
                  console.error('[OutputDisplay] Parsed error:', errorObj.error);
                  setStreamError(errorObj.error);
                } catch {
                  setStreamError('Error processing simulation results');
                }
              }
            }
          }
          
          // Keep the last chunk in the buffer as it might be incomplete
          buffer = chunks[chunks.length - 1];
          console.log('[OutputDisplay] Remaining buffer:', buffer);
        }

        setIsStreaming(false);

      } catch (err) {
        console.error('[OutputDisplay] Stream error:', err);
        setStreamError(err instanceof Error ? err.message : 'An error occurred');
        setIsStreaming(false);
      }
    };

    console.log('[OutputDisplay] Starting fetch stream');
    fetchStream();
    
    // Cleanup function
    return () => {
      console.log('[OutputDisplay] Cleaning up stream');
      setIsStreaming(false);
      setYearlyResults([]);
      setStreamError(null);
    };
  }, [simulationId, simulationData, isLoading]);

  if (error || streamError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || streamError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Simulation Results</h2>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Years Simulated</p>
              <p className="text-2xl font-semibold">
                {yearlyResults.length}/5
                {isStreaming && <span className="text-sm font-normal text-gray-500 ml-2">(Simulating...)</span>}
              </p>
            </div>
            
            {yearlyResults.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-semibold">
                  ${yearlyResults.reduce((sum, year) => sum + year.analysis.revenue, 0).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {yearlyResults.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500">Growth Probability</p>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full transition-all duration-500 ${
                  getGrowthProbabilityColor(getGrowthProbability(yearlyResults[yearlyResults.length - 1].metrics))
                }`}
                style={{ 
                  width: `${getGrowthProbability(yearlyResults[yearlyResults.length - 1].metrics)}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {yearlyResults.map((yearData) => (
          <YearlyResult key={yearData.year} data={yearData} />
        ))}
        {(isLoading || isStreaming) && yearlyResults.length < 5 && <LoadingSkeleton />}
      </div>

      {yearlyResults.length === 5 && (
        <Card className="p-6 space-y-4 bg-gray-50">
          <h3 className="text-xl font-semibold">Strategic Recommendations</h3>
          <ul className="space-y-3">
            {yearlyResults[4].analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-3 text-gray-700">
                <span className="text-blue-600">•</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
} 