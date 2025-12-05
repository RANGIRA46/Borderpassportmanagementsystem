import { Agency, DataExchange, CoordinationRequest } from './types';

export const MOCK_AGENCIES: Agency[] = [
  {
    id: 'INTERPOL',
    name: 'International Criminal Police Organization',
    country: 'France',
    region: 'Global',
    type: 'international',
    status: 'connected',
    connectionType: 'api',
    capabilities: ['Red Notices', 'Blue Notices', 'Database Queries', 'Biometric Matching', 'Alerts'],
    contact: {
      primaryContact: 'Director Jean-Claude Morin',
      email: 'coordination@interpol.int',
      phone: '+33 4 72 44 70 00',
      emergencyContact: '+33 4 72 44 70 50'
    },
    statistics: {
      totalQueries: 15420,
      successfulQueries: 15180,
      lastQuery: new Date(Date.now() - 300000),
      responseTime: 1.2,
      dataShared: 2340,
      alertsReceived: 156
    },
    securityLevel: 'classified',
    lastSync: new Date(Date.now() - 600000),
    agreementExpiry: new Date('2025-12-31')
  },
  {
    id: 'EAC_REGIONAL',
    name: 'East African Community Regional Database',
    country: 'Tanzania',
    region: 'East Africa',
    type: 'border-control',
    status: 'connected',
    connectionType: 'secure-portal',
    capabilities: ['Border Crossings', 'Visa Information', 'Regional Alerts'],
    contact: {
      primaryContact: 'Dr. Amina Hassan',
      email: 'coordination@eac.int',
      phone: '+255 27 216 2100',
      emergencyContact: '+255 27 216 2150'
    },
    statistics: {
      totalQueries: 8920,
      successfulQueries: 8654,
      lastQuery: new Date(Date.now() - 1800000),
      responseTime: 2.1,
      dataShared: 1245,
      alertsReceived: 89
    },
    securityLevel: 'high',
    lastSync: new Date(Date.now() - 3600000),
    agreementExpiry: new Date('2024-12-31')
  },
  {
    id: 'EUROPOL',
    name: 'European Union Agency for Law Enforcement Cooperation',
    country: 'Netherlands',
    region: 'Europe',
    type: 'law-enforcement',
    status: 'connected',
    connectionType: 'api',
    capabilities: ['Criminal Intelligence', 'Terrorism Database', 'Cybercrime', 'Drug Trafficking'],
    contact: {
      primaryContact: 'Executive Director Catherine De Bolle',
      email: 'liaison@europol.europa.eu',
      phone: '+31 70 302 5000',
      emergencyContact: '+31 70 302 5555'
    },
    statistics: {
      totalQueries: 5640,
      successfulQueries: 5456,
      lastQuery: new Date(Date.now() - 7200000),
      responseTime: 1.8,
      dataShared: 890,
      alertsReceived: 67
    },
    securityLevel: 'classified',
    lastSync: new Date(Date.now() - 1800000),
    agreementExpiry: new Date('2026-06-30')
  },
  {
    id: 'FBI_NCIC',
    name: 'FBI National Crime Information Center',
    country: 'United States',
    region: 'North America',
    type: 'law-enforcement',
    status: 'connected',
    connectionType: 'encrypted-channel',
    capabilities: ['Criminal Records', 'Wanted Persons', 'Stolen Vehicles', 'Missing Persons'],
    contact: {
      primaryContact: 'NCIC Operations Center',
      email: 'ncic.ops@fbi.gov',
      phone: '+1 304 625 2000',
      emergencyContact: '+1 304 625 3000'
    },
    statistics: {
      totalQueries: 3420,
      successfulQueries: 3298,
      lastQuery: new Date(Date.now() - 14400000),
      responseTime: 2.5,
      dataShared: 654,
      alertsReceived: 45
    },
    securityLevel: 'classified',
    lastSync: new Date(Date.now() - 7200000),
    agreementExpiry: new Date('2025-09-15')
  },
  {
    id: 'UK_BORDER_FORCE',
    name: 'UK Border Force Intelligence',
    country: 'United Kingdom',
    region: 'Europe',
    type: 'border-control',
    status: 'maintenance',
    connectionType: 'secure-portal',
    capabilities: ['Immigration Control', 'Customs Intelligence', 'Border Alerts'],
    contact: {
      primaryContact: 'Intelligence Coordination Unit',
      email: 'intelligence@homeoffice.gov.uk',
      phone: '+44 20 7035 4848',
      emergencyContact: '+44 20 7035 4999'
    },
    statistics: {
      totalQueries: 2156,
      successfulQueries: 2089,
      lastQuery: new Date(Date.now() - 86400000),
      responseTime: 3.2,
      dataShared: 432,
      alertsReceived: 34
    },
    securityLevel: 'high',
    lastSync: new Date(Date.now() - 86400000),
    agreementExpiry: new Date('2024-03-31')
  },
  {
    id: 'AFRIPOL',
    name: 'African Union Mechanism for Police Cooperation',
    country: 'Algeria',
    region: 'Africa',
    type: 'law-enforcement',
    status: 'connected',
    connectionType: 'secure-portal',
    capabilities: ['Continental Database', 'Terrorism Intelligence', 'Organized Crime'],
    contact: {
      primaryContact: 'Executive Director Jalel Chelba',
      email: 'contact@afripol.org',
      phone: '+213 21 43 50 00',
      emergencyContact: '+213 21 43 50 99'
    },
    statistics: {
      totalQueries: 1834,
      successfulQueries: 1756,
      lastQuery: new Date(Date.now() - 21600000),
      responseTime: 4.1,
      dataShared: 298,
      alertsReceived: 28
    },
    securityLevel: 'high',
    lastSync: new Date(Date.now() - 21600000),
    agreementExpiry: new Date('2025-01-31')
  }
];

export const MOCK_DATA_EXCHANGES: DataExchange[] = [
  {
    id: 'DX001',
    agencyId: 'INTERPOL',
    type: 'query',
    direction: 'outbound',
    status: 'success',
    subject: 'Red Notice verification - Marie Dubois',
    priority: 'high',
    timestamp: new Date(Date.now() - 300000),
    responseTime: 1.2,
    dataSize: 2048,
    classification: 'confidential',
    officer: 'Officer Smith',
    details: 'Biometric match confirmation for suspect at Kigali Airport'
  },
  {
    id: 'DX002',
    agencyId: 'EAC_REGIONAL',
    type: 'alert',
    direction: 'inbound',
    status: 'success',
    subject: 'Border crossing alert - suspicious activity',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1800000),
    responseTime: 2.1,
    dataSize: 1024,
    classification: 'restricted',
    officer: 'System',
    details: 'Automated alert for multiple border crossings in short timeframe'
  },
  {
    id: 'DX003',
    agencyId: 'EUROPOL',
    type: 'response',
    direction: 'inbound',
    status: 'success',
    subject: 'Drug trafficking network information',
    priority: 'urgent',
    timestamp: new Date(Date.now() - 3600000),
    responseTime: 1.8,
    dataSize: 4096,
    classification: 'secret',
    officer: 'Officer Johnson',
    details: 'Intelligence sharing on international drug trafficking routes'
  }
];

export const MOCK_COORDINATION_REQUESTS: CoordinationRequest[] = [
  {
    id: 'CR001',
    title: 'Joint Operation - Drug Trafficking Network',
    description: 'Coordinate surveillance and intelligence sharing for suspected drug trafficking network operating across East African borders.',
    agencies: ['INTERPOL', 'EAC_REGIONAL', 'AFRIPOL'],
    requestor: 'Detective Sarah Wilson',
    priority: 'high',
    status: 'in-progress',
    created: new Date(Date.now() - 86400000),
    deadline: new Date(Date.now() + 604800000),
    responses: [
      {
        agencyId: 'INTERPOL',
        response: 'Approved - sharing relevant Red Notice information',
        timestamp: new Date(Date.now() - 43200000),
        status: 'accepted'
      },
      {
        agencyId: 'EAC_REGIONAL',
        response: 'Request for additional border crossing data',
        timestamp: new Date(Date.now() - 21600000),
        status: 'more-info-needed'
      }
    ],
    attachments: ['operation_brief.pdf', 'suspect_photos.zip']
  },
  {
    id: 'CR002',
    title: 'Emergency Alert - High-Risk Individual',
    description: 'Urgent coordination required for tracking high-risk individual believed to be crossing multiple jurisdictions.',
    agencies: ['INTERPOL', 'FBI_NCIC', 'UK_BORDER_FORCE'],
    requestor: 'Captain Michael Brown',
    priority: 'urgent',
    status: 'acknowledged',
    created: new Date(Date.now() - 21600000),
    deadline: new Date(Date.now() + 86400000),
    responses: [
      {
        agencyId: 'INTERPOL',
        response: 'Acknowledged - mobilizing resources',
        timestamp: new Date(Date.now() - 10800000),
        status: 'accepted'
      }
    ],
    attachments: ['threat_assessment.pdf']
  }
];

export const AGENCY_TYPE_COLORS = {
  'law-enforcement': 'bg-red-600 text-white',
  'border-control': 'bg-blue-600 text-white',
  'intelligence': 'bg-purple-600 text-white',
  'customs': 'bg-green-600 text-white',
  'international': 'bg-yellow-600 text-white'
};

export const STATUS_COLORS = {
  'connected': 'bg-green-100 text-green-800',
  'disconnected': 'bg-red-100 text-red-800',
  'maintenance': 'bg-yellow-100 text-yellow-800',
  'pending': 'bg-blue-100 text-blue-800'
};

export const PRIORITY_COLORS = {
  'low': 'bg-gray-600 text-white',
  'medium': 'bg-blue-600 text-white',
  'high': 'bg-orange-600 text-white',
  'urgent': 'bg-red-600 text-white'
};

export const SECURITY_LEVEL_COLORS = {
  'low': 'bg-green-500 text-white',
  'medium': 'bg-yellow-500 text-white',
  'high': 'bg-orange-500 text-white',
  'classified': 'bg-red-500 text-white'
};