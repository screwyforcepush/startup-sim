import { SimulationInput } from './types';

export function validateSimulationInput(data: Partial<SimulationInput>): { isValid: boolean; errors: Partial<Record<keyof SimulationInput, string>> } {
  const errors: Partial<Record<keyof SimulationInput, string>> = {};

  if (!data.sector) errors.sector = 'Sector is required';
  if (!data.nation) errors.nation = 'Nation is required';
  if (!data.aiDisruptionPattern) errors.aiDisruptionPattern = 'AI Disruption Pattern is required';
  if (!data.businessModel) errors.businessModel = 'Business Model is required';
  if (!data.teamArchetype) errors.teamArchetype = 'Team Archetype is required';
  if (!data.startupPitch?.trim()) errors.startupPitch = 'Startup Pitch is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function formatSimulationInput(data: SimulationInput): SimulationInput {
  return {
    ...data,
    startupPitch: data.startupPitch.trim()
  };
}
