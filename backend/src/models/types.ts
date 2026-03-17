export type UserRole = 'citizen' | 'official' | 'admin';

export type PassportStatus = 'applied' | 'under_review' | 'approved' | 'rejected';
export type PassportType = 'regular' | 'diplomatic' | 'official';

export type CrossingType = 'entry' | 'exit';
export type CrossingStatus = 'pending' | 'approved' | 'denied';

export type AppointmentType =
  | 'passport_application'
  | 'passport_renewal'
  | 'border_crossing_permit'
  | 'other';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Passport {
  id: string;
  user_id: string;
  passport_number: string;
  status: PassportStatus;
  type: PassportType;
  full_name: string;
  date_of_birth: string;
  nationality: string;
  place_of_birth: string;
  issue_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface BorderCrossing {
  id: string;
  user_id: string;
  passport_id: string;
  border_point: string;
  crossing_type: CrossingType;
  crossing_date: string;
  country_from: string;
  country_to: string;
  purpose?: string;
  status: CrossingStatus;
  officer_id?: string;
  notes?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  appointment_type: AppointmentType;
  appointment_date: string;
  appointment_time: string;
  location: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  passport_id?: string;
  document_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
