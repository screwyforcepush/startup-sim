'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OutputDisplayProps, YearlyProgress } from "./types";

function YearlyResult({ data }: { data: YearlyProgress }) {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Year {data.year}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-lg font-medium">${data.analysis.revenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Feasibility</p>
          <p className="text-lg font-medium">{data.metrics.feasibility}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Viability</p>
          <p className="text-lg font-medium">{data.metrics.viability}%</p>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">KPIs</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Feasibility</p>
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-blue-500 rounded" 
                style={{ width: `${data.metrics.feasibility}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Desirability</p>
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-green-500 rounded" 
                style={{ width: `${data.metrics.desirability}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Viability</p>
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-purple-500 rounded" 
                style={{ width: `${data.metrics.viability}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Milestones</h4>
        <ul className="list-disc list-inside space-y-1">
          {data.analysis.milestones.map((milestone: string, index: number) => (
            <li key={index} className="text-sm">{milestone}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Challenges</h4>
        <ul className="list-disc list-inside space-y-1">
          {data.analysis.challenges.map((challenge: string, index: number) => (
            <li key={index} className="text-sm text-red-600">{challenge}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((year) => (
          <Skeleton key={year} className="h-64 w-full" />
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Simulation Results</h2>
        <p className="text-gray-600">
          Years Simulated: {yearlyResults.length}/5
          {isStreaming && ' (Simulating...)'}
        </p>
      </div>

      <div className="space-y-4">
        {yearlyResults.map((yearData) => (
          <YearlyResult key={yearData.year} data={yearData} />
        ))}
        {(isLoading || isStreaming) && yearlyResults.length < 5 && <LoadingSkeleton />}
      </div>

      {yearlyResults.length === 5 && (
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Strategic Recommendations</h3>
          <ul className="list-disc list-inside space-y-2">
            {yearlyResults[4].analysis.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm">{recommendation}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
} 