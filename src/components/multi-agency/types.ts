export interface Agency {
  id: string;
  name: string;
  country: string;
  region: string;
  type: 'law-enforcement' | 'border-control' | 'intelligence' | 'customs' | 'international';
  status: 'connected' | 'disconnected' | 'maintenance' | 'pending';
  connectionType: 'api' | 'secure-portal' | 'manual' | 'encrypted-channel';
  capabilities: string[];
  contact: {
    primaryContact: string;
    email: string;
    phone: string;
    emergencyContact: string;
  };
  statistics: {
    totalQueries: number;
    successfulQueries: number;
    lastQuery: Date;
    responseTime: number;
    dataShared: number;
    alertsReceived: number;
  };
  securityLevel: 'low' | 'medium' | 'high' | 'classified';
  lastSync: Date;
  agreementExpiry: Date;
}

export interface DataExchange {
  id: string;
  agencyId: string;
  type: 'query' | 'alert' | 'update' | 'response';
  direction: 'inbound' | 'outbound';
  status: 'pending' | 'success' | 'failed' | 'timeout';
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  responseTime?: number;
  dataSize: number;
  classification: 'public' | 'restricted' | 'confidential' | 'secret';
  officer: string;
  details: string;
}

export interface CoordinationRequest {
  id: string;
  title: string;
  description: string;
  agencies: string[];
  requestor: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'acknowledged' | 'in-progress' | 'completed' | 'cancelled';
  created: Date;
  deadline?: Date;
  responses: Array<{
    agencyId: string;
    response: string;
    timestamp: Date;
    status: 'accepted' | 'declined' | 'pending' | 'more-info-needed';
  }>;
  attachments: string[];
}