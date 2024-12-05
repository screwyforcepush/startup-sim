export interface SimulationInput {
  sector: string;
  nation: string;
  aiDisruptionPattern: string;
  businessModel: string;
  teamArchetype: string;
  startupPitch: string;
}

export interface SimulationMetrics {
  feasibility: number;
  desirability: number;
  viability: number;
}

export interface YearlyProgress {
  year: number;
  metrics: SimulationMetrics;
}

export interface SimulationResponse {
  success: boolean;
  message: string;
  input: SimulationInput;
  yearlyProgress: YearlyProgress[];
}

export interface InputFormProps {
  onSubmit: (data: SimulationResponse) => Promise<void>;
  isLoading?: boolean;
}
