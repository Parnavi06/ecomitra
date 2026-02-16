
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
}

export type BinStatus = 'NORMAL' | 'WARNING' | 'FULL';

export interface Compartment {
  id: string;
  name: string;
  fillLevel: number; // 0 to 100
}

export interface Bin {
  id: string;
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  status: BinStatus;
  enabled: boolean;
  lastEmptied: string; // ISO Date
  assignedOperatorId?: string;
  localBodyEmail: string;
  compartments: Compartment[];
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  linkedin: string;
  imageUrl: string;
  isProfessor?: boolean;
}

export interface DashboardStats {
  totalBins: number;
  fullBins: number;
  avgFillPercentage: number;
  activeAlerts: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
