/**
 * Security Dashboard Widget & Communication History
 * Shows user security posture and email/notification history
 */

'use client';

import React, { useState } from 'react';
import {
  Shield,
  Clock,
  AlertCircle,
  CheckCircle,
  Mail,
  Download,
  Eye,
  Filter,
  Search,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ============================================
// TYPE DEFINITIONS
// ============================================

export enum EmailStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  BOUNCED = 'BOUNCED',
}

export enum EmailType {
  FLAG_ALERT = 'FLAG_ALERT',
  ACCESS_GRANT = 'ACCESS_GRANT',
  MFA_SETUP = 'MFA_SETUP',
  DAILY_SUMMARY = 'DAILY_SUMMARY',
  SECURITY_ALERT = 'SECURITY_ALERT',
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_login' | 'mfa_enabled' | 'role_change';
  timestamp: Date;
  ipAddress: string;
  deviceName: string;
  status: 'success' | 'failure';
  details?: string;
}

export interface EmailLog {
  id: string;
  type: EmailType;
  subject: string;
  recipient: string;
  sentAt: Date;
  status: EmailStatus;
  classification: 'UNCLASSIFIED' | 'SENSITIVE' | 'CONFIDENTIAL' | 'SECRET';
  content?: string;
  failureReason?: string;
}

interface SecurityDashboardProps {
  mfaEnabled: boolean;
  lastLogin?: Date;
  lastLoginIP?: string;
  lastLoginDevice?: string;
  recentSecurityEvents?: SecurityEvent[];
}

interface CommunicationHistoryProps {
  emails: EmailLog[];
  isLoading?: boolean;
}

// ============================================
// SECURITY DASHBOARD WIDGET
// ============================================

export const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  mfaEnabled,
  lastLogin,
  lastLoginIP,
  lastLoginDevice,
  recentSecurityEvents = [],
}) => {
  const getMFABadgeColor = (enabled: boolean) => {
    return enabled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getMFAIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-600" />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-slate-950 to-blue-900 text-white border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-sky-400" />
              <CardTitle>Security Posture</CardTitle>
            </div>
            <Badge className={`${getMFABadgeColor(mfaEnabled)}`}>
              {mfaEnabled ? '✓ Secure' : '⚠️ Upgrade'}
            </Badge>
          </div>
          <CardDescription className="text-sky-200">
            Your account security status
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* MFA Status */}
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              {getMFAIcon(mfaEnabled)}
              <div>
                <p className="text-sm font-medium">Multi-Factor Authentication</p>
                <p className="text-xs text-sky-300">
                  {mfaEnabled ? 'Active' : 'Not Enabled'}
                </p>
              </div>
            </div>
            {mfaEnabled && <span className="text-sm text-green-400">✓ Active</span>}
          </div>

          {/* Last Login */}
          {lastLogin && (
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-sky-400" />
                <div>
                  <p className="text-sm font-medium">Last Login</p>
                  <p className="text-xs text-sky-300">
                    {new Date(lastLogin).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Login Location */}
          {lastLoginIP && (
            <div className="p-3 bg-slate-800 rounded-lg text-sm">
              <p className="text-sky-300 mb-1">
                <strong>IP Address:</strong> {lastLoginIP}
              </p>
              {lastLoginDevice && (
                <p className="text-sky-300">
                  <strong>Device:</strong> {lastLoginDevice}
                </p>
              )}
            </div>
          )}

          {/* Recent Events */}
          {recentSecurityEvents.length > 0 && (
            <div className="border-t border-slate-700 pt-3">
              <p className="text-sm font-medium mb-2">Recent Activity</p>
              <div className="space-y-2">
                {recentSecurityEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 text-xs text-sky-200"
                  >
                    <span className="text-sky-400 mt-0.5">•</span>
                    <div className="flex-1">
                      <p className="capitalize">{event.type}</p>
                      <p className="text-sky-400">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {event.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ============================================
// EMAIL COMMUNICATION HISTORY COMPONENT
// ============================================

export const CommunicationHistory: React.FC<CommunicationHistoryProps> = ({
  emails,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<EmailStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = React.useState<EmailType | 'all'>('all');
  const [selectedEmail, setSelectedEmail] = React.useState<EmailLog | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const filteredEmails = React.useMemo(() => {
    return emails.filter((email) => {
      const matchesSearch =
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.recipient.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || email.status === statusFilter;

      const matchesType = typeFilter === 'all' || email.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [emails, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case EmailStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case EmailStatus.SENT:
        return 'bg-blue-100 text-blue-800';
      case EmailStatus.FAILED:
      case EmailStatus.BOUNCED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: EmailType): string => {
    switch (type) {
      case EmailType.FLAG_ALERT:
        return 'Flag Alert';
      case EmailType.ACCESS_GRANT:
        return 'Access Grant';
      case EmailType.MFA_SETUP:
        return 'MFA Setup';
      case EmailType.DAILY_SUMMARY:
        return 'Daily Summary';
      case EmailType.SECURITY_ALERT:
        return 'Security Alert';
      default:
        return type;
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'SECRET':
        return 'border-red-500 bg-red-50';
      case 'CONFIDENTIAL':
        return 'border-orange-500 bg-orange-50';
      case 'SENSITIVE':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-green-500 bg-green-50';
    }
  };

  const handleExport = () => {
    const csv = [
      ['Subject', 'Recipient', 'Sent At', 'Status', 'Type', 'Classification'],
      ...filteredEmails.map((email) => [
        email.subject,
        email.recipient,
        new Date(email.sentAt).toLocaleString(),
        email.status,
        getTypeLabel(email.type),
        email.classification,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`
    );
    element.setAttribute('download', `email-history-${new Date().toISOString()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              <div>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>
                  All system-generated emails and notifications
                </CardDescription>
              </div>
            </div>
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-xs">
              <Input
                placeholder="Search by subject or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="gap-2"
                prefix={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={EmailStatus.SENT}>Sent</SelectItem>
                <SelectItem value={EmailStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={EmailStatus.FAILED}>Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(v: any) => setTypeFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value={EmailType.FLAG_ALERT}>Flag Alert</SelectItem>
                <SelectItem value={EmailType.ACCESS_GRANT}>Access Grant</SelectItem>
                <SelectItem value={EmailType.MFA_SETUP}>MFA Setup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead className="w-40">Sent</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24">Classification</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredEmails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No emails found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmails.map((email) => (
                    <TableRow key={email.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium max-w-xs">
                        <p className="truncate">{email.subject}</p>
                        <p className="text-xs text-gray-500">
                          {getTypeLabel(email.type)}
                        </p>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {email.recipient}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(email.sentAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(email.status)}>
                          {email.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`px-2 py-1 rounded text-xs font-medium border ${getClassificationColor(
                            email.classification
                          )}`}
                        >
                          {email.classification}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setSelectedEmail(email);
                            setIsModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Footer Stats */}
          {filteredEmails.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border text-sm text-gray-600">
              <div>
                Showing <strong>{filteredEmails.length}</strong> of{' '}
                <strong>{emails.length}</strong> emails
              </div>
              <div className="text-xs">
                All emails are encrypted and stored for compliance
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email Content Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEmail?.subject}</DialogTitle>
            <DialogDescription>
              {selectedEmail && (
                <>
                  <p>
                    <strong>Sent to:</strong> {selectedEmail.recipient}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedEmail.sentAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <Badge className={getStatusColor(selectedEmail.status)}>
                      {selectedEmail.status}
                    </Badge>
                  </p>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedEmail?.content && (
            <div
              className="border rounded-lg p-4 bg-gray-50 text-sm max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: selectedEmail.content }}
            />
          )}

          {selectedEmail?.failureReason && (
            <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
              <p className="font-medium text-red-900">Failure Reason</p>
              <p className="text-sm text-red-700 mt-1">{selectedEmail.failureReason}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityDashboard;

