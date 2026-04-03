/**
 * Activity Log / Audit Trail Component
 * Displays immutable audit logs of system activities
 */

'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  Shield,
  User,
  Edit,
  Trash,
  Lock,
  CheckCircle,
  FileText,
  Filter,
  Search,
} from 'lucide-react';

export enum AuditActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_GRANTED = 'PERMISSION_GRANTED',
  PERMISSION_REVOKED = 'PERMISSION_REVOKED',
  RECORD_ACCESSED = 'RECORD_ACCESSED',
  RECORD_MODIFIED = 'RECORD_MODIFIED',
  RECORD_DELETED = 'RECORD_DELETED',
  FLAG_CREATED = 'FLAG_CREATED',
  FLAG_REMOVED = 'FLAG_REMOVED',
  VISA_APPROVED = 'VISA_APPROVED',
  VISA_DENIED = 'VISA_DENIED',
  MFA_ENABLED = 'MFA_ENABLED',
  MFA_DISABLED = 'MFA_DISABLED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditActionType;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  changes?: Record<string, { before: any; after: any }>;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: string;
}

interface ActivityLogProps {
  logs: AuditLog[];
  isLoading?: boolean;
  onFilterChange?: (filters: {
    action?: AuditActionType;
    userId?: string;
    searchTerm?: string;
    dateRange?: { start: Date; end: Date };
  }) => void;
}

const ACTION_CONFIG: Record<AuditActionType, { label: string; variant: string; icon: React.ReactNode }> = {
  [AuditActionType.LOGIN]: {
    label: 'Login',
    variant: 'bg-green-100 text-green-800',
    icon: <Lock className="w-4 h-4" />,
  },
  [AuditActionType.LOGOUT]: {
    label: 'Logout',
    variant: 'bg-gray-100 text-gray-800',
    icon: <Lock className="w-4 h-4" />,
  },
  [AuditActionType.USER_CREATED]: {
    label: 'User Created',
    variant: 'bg-blue-100 text-blue-800',
    icon: <User className="w-4 h-4" />,
  },
  [AuditActionType.USER_UPDATED]: {
    label: 'User Updated',
    variant: 'bg-blue-100 text-blue-800',
    icon: <Edit className="w-4 h-4" />,
  },
  [AuditActionType.ROLE_CHANGED]: {
    label: 'Role Changed',
    variant: 'bg-purple-100 text-purple-800',
    icon: <Shield className="w-4 h-4" />,
  },
  [AuditActionType.PERMISSION_GRANTED]: {
    label: 'Permission Granted',
    variant: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  [AuditActionType.PERMISSION_REVOKED]: {
    label: 'Permission Revoked',
    variant: 'bg-red-100 text-red-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  [AuditActionType.RECORD_ACCESSED]: {
    label: 'Record Accessed',
    variant: 'bg-cyan-100 text-cyan-800',
    icon: <FileText className="w-4 h-4" />,
  },
  [AuditActionType.RECORD_MODIFIED]: {
    label: 'Record Modified',
    variant: 'bg-yellow-100 text-yellow-800',
    icon: <Edit className="w-4 h-4" />,
  },
  [AuditActionType.RECORD_DELETED]: {
    label: 'Record Deleted',
    variant: 'bg-red-100 text-red-800',
    icon: <Trash className="w-4 h-4" />,
  },
  [AuditActionType.FLAG_CREATED]: {
    label: 'Flag Created',
    variant: 'bg-orange-100 text-orange-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  [AuditActionType.FLAG_REMOVED]: {
    label: 'Flag Removed',
    variant: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  [AuditActionType.VISA_APPROVED]: {
    label: 'Visa Approved',
    variant: 'bg-green-100 text-green-800',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  [AuditActionType.VISA_DENIED]: {
    label: 'Visa Denied',
    variant: 'bg-red-100 text-red-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  [AuditActionType.MFA_ENABLED]: {
    label: 'MFA Enabled',
    variant: 'bg-green-100 text-green-800',
    icon: <Lock className="w-4 h-4" />,
  },
  [AuditActionType.MFA_DISABLED]: {
    label: 'MFA Disabled',
    variant: 'bg-orange-100 text-orange-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
  [AuditActionType.PASSWORD_CHANGED]: {
    label: 'Password Changed',
    variant: 'bg-purple-100 text-purple-800',
    icon: <Lock className="w-4 h-4" />,
  },
  [AuditActionType.SECURITY_ALERT]: {
    label: 'Security Alert',
    variant: 'bg-red-100 text-red-800',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

export const ActivityLog: React.FC<ActivityLogProps> = ({
  logs,
  isLoading = false,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedAction, setSelectedAction] = React.useState<AuditActionType | 'all'>('all');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedAction !== 'all' && log.action !== selectedAction) {
        return false;
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          log.userName.toLowerCase().includes(searchLower) ||
          log.resourceId.toLowerCase().includes(searchLower) ||
          log.resourceName?.toLowerCase().includes(searchLower) ||
          log.details?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [logs, selectedAction, searchTerm]);

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        action: selectedAction === 'all' ? undefined : selectedAction,
        searchTerm: searchTerm || undefined,
      });
    }
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [selectedAction, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Activity Log</h2>
        <p className="text-sm text-gray-600">
          Immutable audit trail of all system activities
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Search className="w-4 h-4 inline mr-2" />
            Search
          </label>
          <Input
            placeholder="Search by user, resource, or details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-gray-300"
          />
        </div>
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Filter className="w-4 h-4 inline mr-2" />
            Action Type
          </label>
          <Select value={selectedAction} onValueChange={(value: any) => setSelectedAction(value)}>
            <SelectTrigger className="border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {Object.entries(ACTION_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-32">Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-40">Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Loading activity logs...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No activity logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => {
                const actionConfig = ACTION_CONFIG[log.action];
                return (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="text-xs font-mono text-gray-600">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{log.userName}</div>
                        <div className="text-xs text-gray-500">{log.userRole}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={actionConfig.variant}>
                        <span className="inline-block mr-1">{actionConfig.icon}</span>
                        {actionConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{log.resourceType}</div>
                        <div className="text-xs text-gray-500 font-mono">{log.resourceId}</div>
                        {log.resourceName && (
                          <div className="text-xs text-gray-500">{log.resourceName}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === 'success'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {log.status === 'success' ? '✓' : '✕'} {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <details className="cursor-pointer">
                        <summary className="text-xs text-blue-600 hover:underline">
                          View
                        </summary>
                        <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-700 whitespace-pre-wrap">
                          {log.details || 'No details available'}
                          {log.ipAddress && (
                            <>
                              {'\n\n'}IP: {log.ipAddress}
                            </>
                          )}
                        </div>
                      </details>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Stats */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
          <div>
            Showing <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> activities
          </div>
          <div className="text-xs text-gray-500">
            All logs are immutable and stored for compliance purposes
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;

