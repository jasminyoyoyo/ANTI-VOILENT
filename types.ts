export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingSources?: GroundingSource[];
}

export type Persona = 'victim_survivor' | 'potential_perpetrator' | 'bystander' | 'child_youth';

export type RiskLevel = 'low' | 'medium' | 'high' | 'imminent';

export interface RoutingResult {
  persona: Persona;
  riskLevel: RiskLevel;
  detectedSignals: string[];
  immediateSafetyConcern: boolean;
  needsHumanEscalation: boolean;
  explanation: string;
  source: 'rules' | 'hybrid';
}

export interface SupportResponse {
  text: string;
  routing: RoutingResult;
}

export interface GroundingSource {
  title: string;
  uri: string;
  description?: string;
  phone?: string;
  whyThisHelps?: string;
  latitude?: number;
  longitude?: number;
  type?: 'police' | 'legal' | 'shelter' | 'hospital' | 'other';
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export enum SafetyStep {
  INITIAL = 'INITIAL',
  ASSESSMENT = 'ASSESSMENT',
  PLANNING = 'PLANNING',
  RESOURCES = 'RESOURCES',
}
