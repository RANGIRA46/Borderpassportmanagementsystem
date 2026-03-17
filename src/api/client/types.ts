// ==================== AUTHENTICATION TYPES ====================

export type Role = 'customer' | 'officer' | 'admin' | 'super-admin';

export interface LoginRequest {
  email: string;
  password: string;
  userType?: 'user' | 'admin';
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nationality: string;
  userType?: 'user' | 'admin';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department?: string;
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'suspended' | 'pending';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ==================== PASSPORT TYPES ====================

export type PassportStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'issued'
  | 'expired'
  | 'cancelled';

export type PassportType = 'ordinary' | 'official' | 'diplomatic' | 'emergency';

export interface PassportRequest {
  applicantId?: string;
  type: PassportType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  phone: string;
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documentIds?: string[];
}

export interface PassportStatusHistory {
  status: PassportStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface PassportResponse {
  id: string;
  referenceNumber: string;
  applicantId: string;
  type: PassportType;
  status: PassportStatus;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  documentIds: string[];
  statusHistory: PassportStatusHistory[];
  submittedAt: string;
  lastUpdated: string;
  issuedAt?: string;
  expiresAt?: string;
  passportNumber?: string;
}

// ==================== BORDER CROSSING TYPES ====================

export type CrossingType = 'entry' | 'exit';
export type CrossingStatus = 'cleared' | 'flagged' | 'detained' | 'denied';

export interface BorderCrossingRequest {
  travelerId: string;
  passportNumber: string;
  crossingType: CrossingType;
  borderPostId: string;
  borderPostName: string;
  purposeOfTravel?: string;
  destinationCountry?: string;
  originCountry?: string;
  vehicleNumber?: string;
  companionCount?: number;
}

export interface BorderCrossingResponse {
  id: string;
  travelerId: string;
  passportNumber: string;
  crossingType: CrossingType;
  status: CrossingStatus;
  borderPostId: string;
  borderPostName: string;
  purposeOfTravel?: string;
  destinationCountry?: string;
  originCountry?: string;
  vehicleNumber?: string;
  companionCount?: number;
  crossedAt: string;
  recordedBy?: string;
  notes?: string;
}

// ==================== APPOINTMENT TYPES ====================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
export type AppointmentType = 'passport' | 'visa' | 'biometric' | 'collection' | 'inquiry';

export interface AppointmentRequest {
  userId?: string;
  serviceType: AppointmentType;
  preferredDate: string;
  preferredTime: string;
  locationId: string;
  locationName: string;
  notes?: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface AppointmentSlot {
  date: string;
  time: string;
  available: boolean;
  locationId: string;
  locationName: string;
  capacity: number;
  booked: number;
}

export interface AppointmentResponse {
  id: string;
  userId?: string;
  serviceType: AppointmentType;
  status: AppointmentStatus;
  date: string;
  time: string;
  locationId: string;
  locationName: string;
  notes?: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  bookedAt: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  confirmationCode: string;
}

// ==================== DASHBOARD TYPES ====================

export interface UserStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  upcomingAppointments: number;
  borderCrossings: number;
}

export interface ApplicationsStatus {
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  issued: number;
  draft: number;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalApplications: number;
  pendingApplications: number;
  processedToday: number;
  borderCrossingsToday: number;
  totalAppointments: number;
  scheduledAppointments: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
}

export interface BorderAnalytics {
  totalCrossings: number;
  entriesCount: number;
  exitsCount: number;
  flaggedCount: number;
  crossingsByPost: { name: string; count: number }[];
  crossingsByPurpose: { purpose: string; count: number }[];
  dailyTrend: { date: string; entries: number; exits: number }[];
}

// ==================== PAGINATION TYPES ====================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ==================== ERROR TYPES ====================

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export class ApiException extends Error {
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = 'ApiException';
    this.statusCode = apiError.statusCode ?? 500;
    this.code = apiError.code;
    this.errors = apiError.errors;
  }
}

// ==================== DOCUMENT TYPES ====================

export interface DocumentResponse {
  id: string;
  applicationRef: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  status: 'uploaded' | 'verified' | 'rejected';
  url?: string;
}
