export type Role = "CORPORATE" | "VENDOR" | "PROJECT_MANAGER" | "ADMIN" | "FINANCE";

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
export interface Project {
  id: string;
  title: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED';
  amount: number;
}

export interface Milestone {
  id: string;
  projectId: string;
  description: string;
  amount: number;
  status: 'PENDING' | 'FUNDED' | 'REVIEW' | 'APPROVED' | 'RELEASED' | 'DISPUTED';
}

export interface Deliverable {
  id: string;
  milestoneId: string;
  details: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
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

export interface Invoice {
  id: string;
  paymentId: string;
  amount: number;
  date: string;
}

export interface Dispute {
  id: string;
  projectId: string;
  milestoneId: string;
  reason: string;
  status: 'OPEN' | 'RESOLVED';
}

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  userId: string;
}
