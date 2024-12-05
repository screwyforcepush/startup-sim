'use client';

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OutputDisplayProps, YearlyMetrics } from "./types";

function YearlyResult({ data }: { data: YearlyMetrics }) {
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Year {data.year}</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-lg font-medium">${data.revenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Market Share</p>
          <p className="text-lg font-medium">{data.marketShare}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Customer Base</p>
          <p className="text-lg font-medium">{data.customerBase.toLocaleString()}</p>
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
                style={{ width: `${data.kpis.feasibility}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Desirability</p>
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-green-500 rounded" 
                style={{ width: `${data.kpis.desirability}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Viability</p>
            <div className="h-2 bg-gray-200 rounded">
              <div 
                className="h-full bg-purple-500 rounded" 
                style={{ width: `${data.kpis.viability}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Milestones</h4>
        <ul className="list-disc list-inside space-y-1">
          {data.milestones.map((milestone, index) => (
            <li key={index} className="text-sm">{milestone}</li>
          ))}
        </ul>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Challenges</h4>
        <ul className="list-disc list-inside space-y-1">
          {data.challenges.map((challenge, index) => (
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

export function OutputDisplay({ result, isLoading, error }: OutputDisplayProps) {
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Simulation Results</h2>
        <p className="text-gray-600">
          Overall Score: {result.overallScore}/100
        </p>
      </div>

      <div className="space-y-4">
        {result.yearlyResults.map((yearData) => (
          <YearlyResult key={yearData.year} data={yearData} />
        ))}
      </div>

      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Strategic Recommendations</h3>
        <ul className="list-disc list-inside space-y-2">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="text-sm">{recommendation}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
} 