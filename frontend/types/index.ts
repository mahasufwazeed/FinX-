export type Role = "CORPORATE" | "VENDOR" | "PROJECT_MANAGER" | "ADMIN" | "FINANCE" | "BUYER" | "SELLER";

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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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

export type MilestoneStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "RELEASE_PENDING"
  | "RELEASED";

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED';
  amount: number;
}

export type DealStatus = 'DRAFT' | 'PENDING_ACCEPTANCE' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export interface Deal {
  id: string;
  title: string;
  description: string;
  buyerId: string;
  sellerId: string;
  totalAmount: number;
  currency: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DealResponse {
  id: string;
  title: string;
  description: string;
  buyerId: string;
  sellerId: string;
  totalAmount: number;
  currency: string;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
}
export interface Deliverable {
  id: string;
  milestoneId: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  dueDate?: string;
  status: MilestoneStatus;
  deliverables?: Deliverable[];
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | "NOT_FUNDED"
  | "ORDER_CREATED"
  | "PAYMENT_PENDING"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "PAYMENT_VERIFICATION_PENDING"
  | "REFUNDED"
  | "CANCELLED";

export interface Payment {
  id: string;
  projectId: string;
  milestoneId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
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
