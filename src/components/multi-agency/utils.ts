import { Agency, DataExchange, CoordinationRequest } from './types';
import { 
  AGENCY_TYPE_COLORS, 
  STATUS_COLORS, 
  PRIORITY_COLORS, 
  SECURITY_LEVEL_COLORS 
} from './constants';

export const getAgencyTypeColor = (type: string): string => {
  return AGENCY_TYPE_COLORS[type as keyof typeof AGENCY_TYPE_COLORS] || 'bg-gray-600 text-white';
};

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-600 text-white';
};

export const getSecurityLevelColor = (level: string): string => {
  return SECURITY_LEVEL_COLORS[level as keyof typeof SECURITY_LEVEL_COLORS] || 'bg-gray-500 text-white';
};

export const getConnectionIcon = (connectionType: string): string => {
  switch (connectionType) {
    case 'api': return '🔗';
    case 'secure-portal': return '🔒';
    case 'manual': return '📧';
    case 'encrypted-channel': return '🛡️';
    default: return '❓';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'connected': return '✅';
    case 'disconnected': return '❌';
    case 'maintenance': return '🔧';
    case 'pending': return '⏳';
    default: return '❓';
  }
};

export const formatDataSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

export const formatResponseTime = (seconds: number): string => {
  if (seconds < 1) {
    return `${Math.round(seconds * 1000)}ms`;
  }
  return `${seconds.toFixed(1)}s`;
};

export const calculateSuccessRate = (successful: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
};

export const getTimeSinceLastSync = (lastSync: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

export const filterAgencies = (
  agencies: Agency[], 
  searchQuery: string, 
  statusFilter: string
): Agency[] => {
  return agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agency.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agency.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};

export const filterDataExchanges = (
  exchanges: DataExchange[], 
  searchQuery: string, 
  statusFilter: string,
  priorityFilter: string
): DataExchange[] => {
  return exchanges.filter(exchange => {
    const matchesSearch = exchange.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exchange.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exchange.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || exchange.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });
};

export const getAgencyStats = (agencies: Agency[]) => {
  const connected = agencies.filter(a => a.status === 'connected').length;
  const totalQueries = agencies.reduce((sum, a) => sum + a.statistics.totalQueries, 0);
  const avgResponseTime = agencies.reduce((sum, a) => sum + a.statistics.responseTime, 0) / agencies.length;
  const totalAlerts = agencies.reduce((sum, a) => sum + a.statistics.alertsReceived, 0);
  
  return {
    totalAgencies: agencies.length,
    connectedAgencies: connected,
    totalQueries,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10,
    totalAlerts
  };
};

export const isAgreementExpiringSoon = (expiryDate: Date, daysThreshold: number = 30): boolean => {
  const now = new Date();
  const timeDiff = expiryDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff <= daysThreshold && daysDiff > 0;
};

export const sortAgenciesByPriority = (agencies: Agency[]): Agency[] => {
  return [...agencies].sort((a, b) => {
    // Sort by status first (connected first)
    if (a.status !== b.status) {
      if (a.status === 'connected') return -1;
      if (b.status === 'connected') return 1;
      if (a.status === 'maintenance') return -1;
      if (b.status === 'maintenance') return 1;
    }
    
    // Then by security level
    const securityOrder = { 'classified': 0, 'high': 1, 'medium': 2, 'low': 3 };
    const aOrder = securityOrder[a.securityLevel as keyof typeof securityOrder] || 4;
    const bOrder = securityOrder[b.securityLevel as keyof typeof securityOrder] || 4;
    
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    
    // Finally by name
    return a.name.localeCompare(b.name);
  });
};