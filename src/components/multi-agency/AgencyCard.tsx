import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Agency } from './types';
import { 
  getAgencyTypeColor, 
  getStatusColor, 
  getSecurityLevelColor,
  getConnectionIcon,
  getStatusIcon,
  formatResponseTime,
  calculateSuccessRate,
  getTimeSinceLastSync,
  isAgreementExpiringSoon
} from './utils';
import { 
  Globe, 
  Shield, 
  Database, 
  Users, 
  Activity,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Settings,
  AlertTriangle
} from "lucide-react";

interface AgencyCardProps {
  agency: Agency;
  onViewDetails: (agency: Agency) => void;
  onManageConnection: (agency: Agency) => void;
  onViewStatistics: (agency: Agency) => void;
}

export function AgencyCard({ agency, onViewDetails, onManageConnection, onViewStatistics }: AgencyCardProps) {
  const successRate = calculateSuccessRate(agency.statistics.successfulQueries, agency.statistics.totalQueries);
  const isExpiringSoon = isAgreementExpiringSoon(agency.agreementExpiry);

  return (
    <Card className="bg-navy-medium border-blue-medium">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-blue-lightest flex items-center mb-2">
              <span className="text-xl mr-2">{getConnectionIcon(agency.connectionType)}</span>
              {agency.name}
            </CardTitle>
            <CardDescription className="text-blue-light">
              {agency.country} • {agency.region}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(agency.status)}</span>
            <Badge className={getStatusColor(agency.status)}>
              {agency.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning for expiring agreements */}
        {isExpiringSoon && (
          <div className="flex items-center space-x-2 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-200 text-sm">
              Agreement expires {agency.agreementExpiry.toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Agency Type and Security */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={getAgencyTypeColor(agency.type)}>
            {agency.type.replace('-', ' ').toUpperCase()}
          </Badge>
          <Badge className={getSecurityLevelColor(agency.securityLevel)}>
            <Shield className="h-3 w-3 mr-1" />
            {agency.securityLevel.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="border-blue-light text-blue-light">
            {agency.connectionType.replace('-', ' ')}
          </Badge>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-blue-lightest font-medium mb-2">Contact Information</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-light" />
                <span className="text-blue-light">{agency.contact.primaryContact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-light" />
                <span className="text-blue-light">{agency.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-light" />
                <span className="text-blue-light">{agency.contact.phone}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-blue-lightest font-medium mb-2">Connection Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-light">Success Rate:</span>
                <span className="text-blue-lightest">{successRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-light">Response Time:</span>
                <span className="text-blue-lightest">{formatResponseTime(agency.statistics.responseTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-light">Last Sync:</span>
                <span className="text-blue-lightest text-xs">{getTimeSinceLastSync(agency.lastSync)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="text-blue-lightest font-medium mb-3">Usage Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-blue-lightest font-semibold">{agency.statistics.totalQueries.toLocaleString()}</div>
              <div className="text-blue-light text-xs">Total Queries</div>
            </div>
            <div>
              <div className="text-blue-lightest font-semibold">{agency.statistics.dataShared.toLocaleString()}</div>
              <div className="text-blue-light text-xs">Data Shared</div>
            </div>
            <div>
              <div className="text-blue-lightest font-semibold">{agency.statistics.alertsReceived}</div>
              <div className="text-blue-light text-xs">Alerts Received</div>
            </div>
            <div>
              <div className="text-blue-lightest font-semibold">{successRate}%</div>
              <div className="text-blue-light text-xs">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <h4 className="text-blue-lightest font-medium mb-2">Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {agency.capabilities.map((capability, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="border-blue-light text-blue-light text-xs"
              >
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Success Rate Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-blue-light">Connection Health</span>
            <span className="text-blue-lightest">{successRate}%</span>
          </div>
          <Progress 
            value={successRate} 
            className={`h-2 ${
              successRate > 95 ? 'bg-green-500' :
              successRate > 85 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-blue-medium">
          <Button 
            size="sm" 
            onClick={() => onViewDetails(agency)}
            className="bg-blue-light hover:bg-blue-medium text-navy-dark"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onManageConnection(agency)}
            className="border-blue-light text-blue-light"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewStatistics(agency)}
            className="border-blue-light text-blue-light"
          >
            <Activity className="h-4 w-4 mr-2" />
            Statistics
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-blue-light text-blue-light"
          >
            <Database className="h-4 w-4 mr-2" />
            Query
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}