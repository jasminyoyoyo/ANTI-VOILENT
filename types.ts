export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
  groundingSources?: GroundingSource[];
}

export interface GroundingSource {
  title: string;
  uri: string;
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