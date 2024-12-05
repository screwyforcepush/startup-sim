export interface SimulationInput {
  sector: string;
  nation: string;
  aiDisruptionPattern: string;
  businessModel: string;
  teamArchetype: string;
  startupPitch: string;
}

export interface InputFormProps {
  onSubmit: (data: SimulationInput) => void;
  isLoading?: boolean;
}
