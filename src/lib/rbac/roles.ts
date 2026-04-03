/**
 * Role-Based Access Control (RBAC) System
 * Defines permission tiers, roles, and access levels
 */

// ============================================
// PERMISSION DEFINITIONS
// ============================================

export enum Permission {
  // Passport & Traveler Management
  READ_TRAVELER_DATA = 'read:traveler_data',
  WRITE_TRAVELER_DATA = 'write:traveler_data',
  VIEW_INTERNAL_FLAGS = 'view:internal_flags',
  CREATE_FLAGS = 'create:flags',
  EDIT_PASSPORT = 'edit:passport',
  DELETE_TRAVELER_RECORD = 'delete:traveler_record',

  // Entry/Exit Logging
  SCAN_PASSPORTS = 'scan:passports',
  CREATE_ENTRY_LOG = 'create:entry_log',
  CREATE_EXIT_LOG = 'create:exit_log',
  EDIT_LOGS = 'edit:logs',
  VIEW_LOGS = 'view:logs',

  // Visa & Applications
  PROCESS_APPLICATIONS = 'process:applications',
  APPROVE_VISA = 'approve:visa',
  DENY_VISA = 'deny:visa',
  EDIT_APPLICATIONS = 'edit:applications',
  VIEW_SENSITIVE_DOCS = 'view:sensitive_docs',

  // System Administration
  MANAGE_USERS = 'manage:users',
  ASSIGN_ROLES = 'assign:roles',
  VIEW_AUDIT_LOGS = 'view:audit_logs',
  EXPORT_DATA = 'export:data',
  MANAGE_API_KEYS = 'manage:api_keys',
  VIEW_ANALYTICS = 'view:analytics',
  SYSTEM_CONFIGURATION = 'system:configuration',

  // Security & Compliance
  RED_FLAG_PASSPORT = 'security:red_flag',
  UNLOCK_FLAGGED = 'security:unlock_flagged',
  OVERRIDE_DECISIONS = 'security:override',
  MANAGE_MFA = 'security:manage_mfa',
}

// ============================================
// ROLE DEFINITIONS
// ============================================

export enum Role {
  FIELD_OFFICER = 'field_officer',
  VISA_ANALYST = 'visa_analyst',
  SECURITY_ADMIN = 'security_admin',
  SYSTEM_ARCHITECT = 'system_architect',
}

// ============================================
// ROLE-PERMISSION MAPPING
// ============================================

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.FIELD_OFFICER]: [
    Permission.READ_TRAVELER_DATA,
    Permission.SCAN_PASSPORTS,
    Permission.CREATE_ENTRY_LOG,
    Permission.CREATE_EXIT_LOG,
    Permission.VIEW_LOGS,
  ],

  [Role.VISA_ANALYST]: [
    Permission.READ_TRAVELER_DATA,
    Permission.VIEW_LOGS,
    Permission.PROCESS_APPLICATIONS,
    Permission.APPROVE_VISA,
    Permission.DENY_VISA,
    Permission.EDIT_APPLICATIONS,
    Permission.VIEW_SENSITIVE_DOCS,
    Permission.SCAN_PASSPORTS,
    Permission.CREATE_ENTRY_LOG,
    Permission.CREATE_EXIT_LOG,
  ],

  [Role.SECURITY_ADMIN]: [
    Permission.READ_TRAVELER_DATA,
    Permission.WRITE_TRAVELER_DATA,
    Permission.VIEW_INTERNAL_FLAGS,
    Permission.CREATE_FLAGS,
    Permission.RED_FLAG_PASSPORT,
    Permission.UNLOCK_FLAGGED,
    Permission.SCAN_PASSPORTS,
    Permission.CREATE_ENTRY_LOG,
    Permission.CREATE_EXIT_LOG,
    Permission.VIEW_LOGS,
    Permission.EDIT_LOGS,
    Permission.PROCESS_APPLICATIONS,
    Permission.APPROVE_VISA,
    Permission.DENY_VISA,
    Permission.VIEW_SENSITIVE_DOCS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
  ],

  [Role.SYSTEM_ARCHITECT]: [
    // All permissions - Super Admin
    ...Object.values(Permission),
  ],
};

// ============================================
// ROLE METADATA & DESCRIPTIONS
// ============================================

export interface RoleMetadata {
  label: string;
  description: string;
  level: number;
  icon: string;
  color: string;
  department?: string;
}

export const ROLE_METADATA: Record<Role, RoleMetadata> = {
  [Role.FIELD_OFFICER]: {
    label: 'Field Officer',
    description: 'Can scan passports, view traveler history, and create entry/exit logs',
    level: 1,
    icon: 'shield-alert',
    color: 'blue',
  },
  [Role.VISA_ANALYST]: {
    label: 'Visa Analyst',
    description: 'Can process, approve, or deny visa applications and view sensitive documents',
    level: 2,
    icon: 'clipboard-list',
    color: 'amber',
  },
  [Role.SECURITY_ADMIN]: {
    label: 'Security Administrator',
    description: 'Full access to traveler databases, red-flagging, and system-wide analytics',
    level: 3,
    icon: 'shield-check',
    color: 'orange',
  },
  [Role.SYSTEM_ARCHITECT]: {
    label: 'System Architect',
    description: 'Complete system control: user management, role assignment, API keys, audit logs',
    level: 4,
    icon: 'shield',
    color: 'red',
  },
};

// ============================================
// PERMISSION HELPERS
// ============================================

export const hasPermission = (permissions: Permission[], required: Permission): boolean => {
  return permissions.includes(required);
};

export const hasAnyPermission = (permissions: Permission[], required: Permission[]): boolean => {
  return required.some((perm) => permissions.includes(perm));
};

export const hasAllPermissions = (permissions: Permission[], required: Permission[]): boolean => {
  return required.every((perm) => permissions.includes(perm));
};

export const getRolePermissions = (role: Role): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

export const getPermissionLabel = (permission: Permission): string => {
  const labels: Record<Permission, string> = {
    // Passport & Traveler
    [Permission.READ_TRAVELER_DATA]: 'Read Traveler Data',
    [Permission.WRITE_TRAVELER_DATA]: 'Write Traveler Data',
    [Permission.VIEW_INTERNAL_FLAGS]: 'View Internal Flags',
    [Permission.CREATE_FLAGS]: 'Create Flags',
    [Permission.EDIT_PASSPORT]: 'Edit Passport Data',
    [Permission.DELETE_TRAVELER_RECORD]: 'Delete Records',

    // Entry/Exit
    [Permission.SCAN_PASSPORTS]: 'Scan Passports',
    [Permission.CREATE_ENTRY_LOG]: 'Create Entry Logs',
    [Permission.CREATE_EXIT_LOG]: 'Create Exit Logs',
    [Permission.EDIT_LOGS]: 'Edit Logs',
    [Permission.VIEW_LOGS]: 'View Logs',

    // Visa & Applications
    [Permission.PROCESS_APPLICATIONS]: 'Process Applications',
    [Permission.APPROVE_VISA]: 'Approve Visas',
    [Permission.DENY_VISA]: 'Deny Visas',
    [Permission.EDIT_APPLICATIONS]: 'Edit Applications',
    [Permission.VIEW_SENSITIVE_DOCS]: 'View Sensitive Documents',

    // System Admin
    [Permission.MANAGE_USERS]: 'Manage Users',
    [Permission.ASSIGN_ROLES]: 'Assign Roles',
    [Permission.VIEW_AUDIT_LOGS]: 'View Audit Logs',
    [Permission.EXPORT_DATA]: 'Export Data',
    [Permission.MANAGE_API_KEYS]: 'Manage API Keys',
    [Permission.VIEW_ANALYTICS]: 'View Analytics',
    [Permission.SYSTEM_CONFIGURATION]: 'System Configuration',

    // Security
    [Permission.RED_FLAG_PASSPORT]: 'Red Flag Passports',
    [Permission.UNLOCK_FLAGGED]: 'Unlock Flagged Records',
    [Permission.OVERRIDE_DECISIONS]: 'Override Decisions',
    [Permission.MANAGE_MFA]: 'Manage MFA',
  };

  return labels[permission] || permission;
};

// ============================================
// AGENCY DEFINITIONS
// ============================================

export enum Agency {
  CUSTOMS = 'CUSTOMS',
  IMMIGRATION = 'IMMIGRATION',
  INTELLIGENCE = 'INTELLIGENCE',
  POLICE = 'POLICE',
  SECURITY_FORCE = 'SECURITY_FORCE',
  HEALTH = 'HEALTH',
  TRANSPORT = 'TRANSPORT',
}

export const AGENCY_LABELS: Record<Agency, string> = {
  [Agency.CUSTOMS]: 'Customs & Border Protection',
  [Agency.IMMIGRATION]: 'Immigration Services',
  [Agency.INTELLIGENCE]: 'Intelligence & Security',
  [Agency.POLICE]: 'National Police',
  [Agency.SECURITY_FORCE]: 'Security Force',
  [Agency.HEALTH]: 'Health & Safety',
  [Agency.TRANSPORT]: 'Transport & Logistics',
};

// ============================================
// RANK DEFINITIONS
// ============================================

export enum Rank {
  JUNIOR_OFFICER = 'JUNIOR_OFFICER',
  SENIOR_OFFICER = 'SENIOR_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  MANAGER = 'MANAGER',
  DIRECTOR = 'DIRECTOR',
  EXECUTIVE = 'EXECUTIVE',
}

export const RANK_LABELS: Record<Rank, string> = {
  [Rank.JUNIOR_OFFICER]: 'Junior Officer',
  [Rank.SENIOR_OFFICER]: 'Senior Officer',
  [Rank.SUPERVISOR]: 'Supervisor',
  [Rank.MANAGER]: 'Manager',
  [Rank.DIRECTOR]: 'Director',
  [Rank.EXECUTIVE]: 'Executive',
};

// ============================================
// USER SESSION TYPE
// ============================================

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  permissions: Permission[];
  agency: Agency;
  rank: Rank;
  employeeId: string;
  mfaEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

