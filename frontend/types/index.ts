export type Role = "BUYER" | "SELLER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Future contracts
export interface Deal {
  id: string;
  title: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED';
  amount: number;
}

export interface Milestone {
  id: string;
  dealId: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'FUNDED' | 'REVIEW' | 'APPROVED' | 'RELEASED' | 'DISPUTED';
}

export interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
}

export interface EscrowTransaction {
  id: string;
  milestoneId: string;
  amount: number;
  status: 'HELD' | 'RELEASED' | 'REFUNDED';
}

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  userId: string;
}
