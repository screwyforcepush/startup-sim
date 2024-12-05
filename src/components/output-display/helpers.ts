import { SimulationResult, YearlyMetrics } from "./types";

export function calculateAverageKPIs(yearlyResults: YearlyMetrics[]) {
  const totalYears = yearlyResults.length;
  const totals = yearlyResults.reduce(
    (acc, year) => ({
      feasibility: acc.feasibility + year.kpis.feasibility,
      desirability: acc.desirability + year.kpis.desirability,
      viability: acc.viability + year.kpis.viability,
    }),
    { feasibility: 0, desirability: 0, viability: 0 }
  );

  return {
    feasibility: Math.round(totals.feasibility / totalYears),
    desirability: Math.round(totals.desirability / totalYears),
    viability: Math.round(totals.viability / totalYears),
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}

export function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getStatusColor(value: number): string {
  if (value >= 80) return 'text-green-500';
  if (value >= 60) return 'text-yellow-500';
  return 'text-red-500';
} 