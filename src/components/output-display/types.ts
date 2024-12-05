import type { SimulationInput } from '@/components/input-interface/types';

export interface SimulationMetrics {
  feasibility: number;
  desirability: number;
  viability: number;
}

export interface SimulationAnalysis {
  milestones: string[];
  challenges: string[];
  recommendations: string[];
  revenue: number;
  marketShare: number;
  customerBase: number;
}

export interface YearlyProgress {
  year: number;
  metrics: SimulationMetrics;
  analysis: SimulationAnalysis;
}

export interface SimulationResult {
  id: string;
  inputParameters: SimulationInput;
  yearlyResults: YearlyProgress[];
  overallScore: number;
  timestamp: string;
}

export interface OutputDisplayProps {
  simulationId: string;
  simulationData?: SimulationInput;
  isLoading: boolean;
  error?: string;
} 