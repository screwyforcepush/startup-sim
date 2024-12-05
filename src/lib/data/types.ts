export interface Sector {
  id: string;
  name: string;
  type: string;
  fundingShare: number;
  maturityLevel: string;
  characteristics: {
    marketSize: string;
    competitionLevel: string;
    regulatoryComplexity: string;
    techRequirement: string;
  };
  subdomains?: string[];
}

export interface SectorsData {
  sectors: Sector[];
}

export interface Nation {
  id: string;
  name: string;
  type: string;
  characteristics: {
    gdpPerCapita: string;
    marketSize: string;
    regulatoryComplexity: string;
    techReadiness: string;
    investmentAccess: string;
  };
  investmentFocus?: string[];
  marketAdvantages?: string[];
}

export interface NationsData {
  nations: Nation[];
}

export interface DisruptionPattern {
  id: number;
  name: string;
  description: string;
  context: string;
}

export interface DisruptionPatternsData {
  aiDisruptionPatterns: DisruptionPattern[];
}

export interface BusinessModel {
  id: number;
  name: string;
  description: string;
  context: string;
}

export interface BusinessModelsData {
  businessModels: BusinessModel[];
}

export interface TeamArchetype {
  id: number;
  name: string;
  description: string;
  context: string;
}

export interface TeamArchetypesData {
  startupTeamArchetypes: TeamArchetype[];
} 