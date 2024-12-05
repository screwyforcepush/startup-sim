export interface KPIMetrics {
  feasibility: number;
  desirability: number;
  viability: number;
}

export interface YearlyMetrics {
  year: number;
  revenue: number;
  marketShare: number;
  customerBase: number;
  kpis: KPIMetrics;
  milestones: string[];
  challenges: string[];
}

export interface SimulationResult {
  id: string;
  inputParameters: {
    sector: string;
    nation: string;
    aiDisruptionPattern: string;
    businessModel: string;
    teamArchetype: string;
    pitch: string;
  };
  yearlyResults: YearlyMetrics[];
  recommendations: string[];
  overallScore: number;
  timestamp: string;
}

export interface OutputDisplayProps {
  result: SimulationResult | null;
  isLoading: boolean;
  error?: string;
} 