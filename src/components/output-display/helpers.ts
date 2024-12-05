import { YearlyProgress, SimulationMetrics } from "./types";

export function calculateAverageKPIs(yearlyResults: YearlyProgress[]): SimulationMetrics {
  const totalYears = yearlyResults.length;
  const totals = yearlyResults.reduce(
    (acc, year) => ({
      feasibility: acc.feasibility + year.metrics.feasibility,
      desirability: acc.desirability + year.metrics.desirability,
      viability: acc.viability + year.metrics.viability,
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

export function processYearlyResult(yearData: YearlyProgress): YearlyProgress {
  // Ensure all required fields are present with defaults if needed
  return {
    year: yearData.year,
    metrics: {
      feasibility: yearData.metrics.feasibility,
      desirability: yearData.metrics.desirability,
      viability: yearData.metrics.viability,
    },
    analysis: {
      revenue: yearData.analysis.revenue,
      marketShare: yearData.analysis.marketShare ?? 0,
      customerBase: yearData.analysis.customerBase ?? 0,
      milestones: yearData.analysis.milestones,
      challenges: yearData.analysis.challenges,
      recommendations: yearData.analysis.recommendations,
    }
  };
}

export function calculateOverallScore(metrics: SimulationMetrics): number {
  return Math.round(
    (metrics.feasibility + metrics.desirability + metrics.viability) / 3
  );
} 