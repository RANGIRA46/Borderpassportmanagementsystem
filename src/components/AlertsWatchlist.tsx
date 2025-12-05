import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  AlertTriangle, 
  Shield, 
  Bell, 
  Search, 
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Database,
  Globe,
  Flag,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Upload
} from "lucide-react";

interface WatchlistEntry {
  id: string;
  type: 'red-notice' | 'blue-notice' | 'yellow-notice' | 'green-notice' | 'black-notice' | 'orange-notice' | 'national';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'expired' | 'resolved' | 'pending';
  subject: {
    firstName: string;
    lastName: string;
    aliases?: string[];
    dateOfBirth?: string;
    nationality: string;
    gender: string;
    identifiers: {
      passports?: string[];
      nationalIds?: string[];
      driverLicenses?: string[];
    };
    physicalDescription: {
      height?: string;
      weight?: string;
      eyeColor?: string;
      hairColor?: string;
      distinguishingMarks?: string;
    };
  };
  charges: string[];
  issuingAuthority: string;
  issuedDate: Date;
  expiryDate?: Date;
  lastUpdated: Date;
  matchHistory: Array<{
    timestamp: Date;
    location: string;
    confidence: number;
    outcome: string;
    officer: string;
  }>;
  biometricFlags: {
    fingerprints: boolean;
    facial: boolean;
    iris: boolean;
  };
  riskLevel: number;
  notes: string;
  attachments: string[];
}

interface Alert {
  id: string;
  type: 'match' | 'system' | 'manual' | 'automatic';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'false-positive';
  title: string;
  description: string;
  watchlistId?: string;
  location: string;
  timestamp: Date;
  officer?: string;
  confidence?: number;
  actions: Array<{
    action: string;
    timestamp: Date;
    officer: string;
    notes?: string;
  }>;
  evidence: Array<{
    type: 'photo' | 'video' | 'biometric' | 'document';
    description: string;
    filename: string;
  }>;
}

export function AlertsWatchlist() {
  const [currentTab, setCurrentTab] = useState('alerts');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<WatchlistEntry | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data for alerts
  const mockAlerts: Alert[] = [
    {
      id: 'ALT001',
      type: 'match',
      priority: 'critical',
      status: 'new',
      title: 'INTERPOL Red Notice Match',
      description: 'High confidence match detected at Kigali Airport Terminal 1',
      watchlistId: 'WL001',
      location: 'Kigali International Airport',
      timestamp: new Date(Date.now() - 300000),
      confidence: 94.5,
      actions: [],
      evidence: [
        {
          type: 'photo',
          description: 'Facial recognition capture',
          filename: 'facial_capture_001.jpg'
        },
        {
          type: 'biometric',
          description: 'Fingerprint scan',
          filename: 'fingerprint_001.dat'
        }
      ]
    },
    {
      id: 'ALT002',
      type: 'system',
      priority: 'high',
      status: 'acknowledged',
      title: 'Suspicious Travel Pattern',
      description: 'Multiple entry attempts with different passports detected',
      location: 'Gatuna Border Post',
      timestamp: new Date(Date.now() - 1800000),
      officer: 'Officer Smith',
      actions: [
        {
          action: 'Alert acknowledged',
          timestamp: new Date(Date.now() - 1200000),
          officer: 'Officer Smith',
          notes: 'Investigating travel history'
        }
      ],
      evidence: [
        {
          type: 'document',
          description: 'Passport scan - French passport',
          filename: 'passport_fr_001.pdf'
        },
        {
          type: 'document',
          description: 'Passport scan - Belgian passport',
          filename: 'passport_be_001.pdf'
        }
      ]
    },
    {
      id: 'ALT003',
      type: 'manual',
      priority: 'medium',
      status: 'investigating',
      title: 'Document Verification Required',
      description: 'Officer flagged suspicious passport for manual verification',
      location: 'Huye Immigration Office',
      timestamp: new Date(Date.now() - 3600000),
      officer: 'Officer Johnson',
      actions: [
        {
          action: 'Manual flag created',
          timestamp: new Date(Date.now() - 3600000),
          officer: 'Officer Johnson',
          notes: 'Passport appears to be altered'
        },
        {
          action: 'Sent to document expert',
          timestamp: new Date(Date.now() - 2400000),
          officer: 'Officer Johnson'
        }
      ],
      evidence: [
        {
          type: 'photo',
          description: 'High-resolution passport photo',
          filename: 'passport_detail_001.jpg'
        }
      ]
    }
  ];

  // Mock data for watchlist
  const mockWatchlist: WatchlistEntry[] = [
    {
      id: 'WL001',
      type: 'red-notice',
      severity: 'critical',
      status: 'active',
      subject: {
        firstName: 'Marie',
        lastName: 'Dubois',
        aliases: ['Maria Dubois', 'Marie Martin'],
        dateOfBirth: '1978-11-22',
        nationality: 'French',
        gender: 'Female',
        identifiers: {
          passports: ['FR9876543', 'FR1234567'],
          nationalIds: ['78112212345678']
        },
        physicalDescription: {
          height: '165 cm',
          weight: '58 kg',
          eyeColor: 'Brown',
          hairColor: 'Blonde',
          distinguishingMarks: 'Small scar on left cheek'
        }
      },
      charges: ['International Drug Trafficking', 'Money Laundering', 'Document Fraud'],
      issuingAuthority: 'INTERPOL Lyon',
      issuedDate: new Date('2023-06-15'),
      lastUpdated: new Date('2024-01-20'),
      matchHistory: [
        {
          timestamp: new Date(Date.now() - 300000),
          location: 'Kigali Airport',
          confidence: 94.5,
          outcome: 'Alert triggered',
          officer: 'System'
        }
      ],
      biometricFlags: {
        fingerprints: true,
        facial: true,
        iris: false
      },
      riskLevel: 95,
      notes: 'Armed and extremely dangerous. Do not approach without backup.',
      attachments: ['red_notice_001.pdf', 'photos_001.zip']
    },
    {
      id: 'WL002',
      type: 'blue-notice',
      severity: 'high',
      status: 'active',
      subject: {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        dateOfBirth: '1990-07-08',
        nationality: 'Egyptian',
        gender: 'Male',
        identifiers: {
          passports: ['EG5555444'],
          nationalIds: ['29007081234567']
        },
        physicalDescription: {
          height: '175 cm',
          weight: '70 kg',
          eyeColor: 'Black',
          hairColor: 'Black'
        }
      },
      charges: ['Identity Theft', 'Immigration Fraud'],
      issuingAuthority: 'Egyptian National Police',
      issuedDate: new Date('2023-12-01'),
      lastUpdated: new Date('2024-01-18'),
      matchHistory: [],
      biometricFlags: {
        fingerprints: false,
        facial: true,
        iris: false
      },
      riskLevel: 75,
      notes: 'Wanted for questioning regarding identity document fraud ring.',
      attachments: ['blue_notice_002.pdf']
    },
    {
      id: 'WL003',
      type: 'national',
      severity: 'medium',
      status: 'active',
      subject: {
        firstName: 'John',
        lastName: 'Smith',
        aliases: ['Johnny Smith', 'J. Smith'],
        dateOfBirth: '1985-03-15',
        nationality: 'American',
        gender: 'Male',
        identifiers: {
          passports: ['US123456789'],
          driverLicenses: ['CA-DL-12345']
        },
        physicalDescription: {
          height: '180 cm',
          weight: '85 kg',
          eyeColor: 'Blue',
          hairColor: 'Brown',
          distinguishingMarks: 'Tattoo on right forearm'
        }
      },
      charges: ['Visa Overstay', 'Work Without Permit'],
      issuingAuthority: 'Rwanda Immigration Service',
      issuedDate: new Date('2024-01-10'),
      lastUpdated: new Date('2024-01-15'),
      matchHistory: [],
      biometricFlags: {
        fingerprints: true,
        facial: true,
        iris: true
      },
      riskLevel: 40,
      notes: 'Overstayed tourist visa by 6 months. Employment without proper permits.',
      attachments: []
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
    setWatchlist(mockWatchlist);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'false-positive': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNoticeTypeColor = (type: string) => {
    switch (type) {
      case 'red-notice': return 'bg-red-600 text-white';
      case 'blue-notice': return 'bg-blue-600 text-white';
      case 'yellow-notice': return 'bg-yellow-600 text-white';
      case 'green-notice': return 'bg-green-600 text-white';
      case 'black-notice': return 'bg-gray-800 text-white';
      case 'orange-notice': return 'bg-orange-600 text-white';
      case 'national': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const filteredWatchlist = watchlist.filter(entry => {
    const matchesSearch = entry.subject.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.subject.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.charges.some(charge => charge.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'acknowledged',
            actions: [
              ...alert.actions,
              {
                action: 'Alert acknowledged',
                timestamp: new Date(),
                officer: 'Current Officer'
              }
            ]
          }
        : alert
    ));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { 
            ...alert, 
            status: 'resolved',
            actions: [
              ...alert.actions,
              {
                action: 'Alert resolved',
                timestamp: new Date(),
                officer: 'Current Officer'
              }
            ]
          }
        : alert
    ));
  };

  return (
    <div className="min-h-screen bg-navy-dark p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-lightest mb-2">
                Alerts & Watchlist Management
              </h1>
              <p className="text-blue-light">
                Monitor security alerts and manage international watchlist entries
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {alerts.filter(a => a.status === 'new').length} New Alerts
              </Badge>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entry
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-navy-medium border-blue-medium max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-blue-lightest">Add Watchlist Entry</DialogTitle>
                    <DialogDescription className="text-blue-light">
                      Create a new watchlist entry for monitoring
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-blue-light">Notice Type</Label>
                        <Select>
                          <SelectTrigger className="bg-navy-dark border-blue-medium text-blue-lightest">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-medium border-blue-medium">
                            <SelectItem value="red-notice" className="text-blue-lightest">Red Notice (Arrest)</SelectItem>
                            <SelectItem value="blue-notice" className="text-blue-lightest">Blue Notice (Information)</SelectItem>
                            <SelectItem value="yellow-notice" className="text-blue-lightest">Yellow Notice (Missing)</SelectItem>
                            <SelectItem value="national" className="text-blue-lightest">National Alert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-blue-light">Severity</Label>
                        <Select>
                          <SelectTrigger className="bg-navy-dark border-blue-medium text-blue-lightest">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-medium border-blue-medium">
                            <SelectItem value="critical" className="text-blue-lightest">Critical</SelectItem>
                            <SelectItem value="high" className="text-blue-lightest">High</SelectItem>
                            <SelectItem value="medium" className="text-blue-lightest">Medium</SelectItem>
                            <SelectItem value="low" className="text-blue-lightest">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-blue-light">First Name</Label>
                        <Input className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                      <div>
                        <Label className="text-blue-light">Last Name</Label>
                        <Input className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-blue-light">Date of Birth</Label>
                        <Input type="date" className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                      <div>
                        <Label className="text-blue-light">Nationality</Label>
                        <Input className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                      <div>
                        <Label className="text-blue-light">Gender</Label>
                        <Select>
                          <SelectTrigger className="bg-navy-dark border-blue-medium text-blue-lightest">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-medium border-blue-medium">
                            <SelectItem value="male" className="text-blue-lightest">Male</SelectItem>
                            <SelectItem value="female" className="text-blue-lightest">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-blue-light">Charges</Label>
                      <Textarea className="bg-navy-dark border-blue-medium text-blue-lightest" placeholder="List criminal charges..." />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-blue-light text-blue-light">
                        Cancel
                      </Button>
                      <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                        Create Entry
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🚨</div>
              <div className="text-2xl font-bold text-blue-lightest">{alerts.filter(a => a.status === 'new').length}</div>
              <div className="text-sm text-blue-light">New Alerts</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-blue-lightest">{watchlist.filter(w => w.status === 'active').length}</div>
              <div className="text-sm text-blue-light">Active Entries</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-blue-lightest">
                {watchlist.reduce((sum, entry) => sum + entry.matchHistory.length, 0)}
              </div>
              <div className="text-sm text-blue-light">Total Matches</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <div className="text-2xl font-bold text-blue-lightest">
                {watchlist.filter(w => w.severity === 'critical').length}
              </div>
              <div className="text-sm text-blue-light">Critical Entries</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-navy-medium">
            <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Bell className="h-4 w-4 mr-2" />
              Active Alerts
              {alerts.filter(a => a.status === 'new').length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {alerts.filter(a => a.status === 'new').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Database className="h-4 w-4 mr-2" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Activity className="h-4 w-4 mr-2" />
              Match History
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Shield className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search alerts, names, or charges..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-navy-dark border-blue-medium text-blue-lightest"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 bg-navy-dark border-blue-medium text-blue-lightest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-medium border-blue-medium">
                    <SelectItem value="all" className="text-blue-lightest">All Status</SelectItem>
                    <SelectItem value="new" className="text-blue-lightest">New</SelectItem>
                    <SelectItem value="acknowledged" className="text-blue-lightest">Acknowledged</SelectItem>
                    <SelectItem value="investigating" className="text-blue-lightest">Investigating</SelectItem>
                    <SelectItem value="resolved" className="text-blue-lightest">Resolved</SelectItem>
                  </SelectContent>
                </Select>
                {currentTab === 'alerts' && (
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-48 bg-navy-dark border-blue-medium text-blue-lightest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-medium border-blue-medium">
                      <SelectItem value="all" className="text-blue-lightest">All Priority</SelectItem>
                      <SelectItem value="critical" className="text-blue-lightest">Critical</SelectItem>
                      <SelectItem value="high" className="text-blue-lightest">High</SelectItem>
                      <SelectItem value="medium" className="text-blue-lightest">Medium</SelectItem>
                      <SelectItem value="low" className="text-blue-lightest">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            {filteredAlerts.length === 0 ? (
              <Card className="bg-navy-medium border-blue-medium">
                <CardContent className="text-center py-12">
                  <Bell className="h-16 w-16 text-blue-light mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-blue-lightest mb-2">No Alerts Found</h3>
                  <p className="text-blue-light">
                    {searchQuery ? 'No alerts match your search criteria.' : 'All clear! No active alerts at this time.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <Card key={alert.id} className="bg-navy-medium border-blue-medium">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-blue-lightest flex items-center">
                            <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                            {alert.title}
                          </CardTitle>
                          <CardDescription className="text-blue-light">
                            {alert.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(alert.priority)}>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Alert Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-blue-lightest font-medium mb-2">Alert Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-blue-light" />
                              <span className="text-blue-light">{alert.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-light" />
                              <span className="text-blue-light">{alert.timestamp.toLocaleString()}</span>
                            </div>
                            {alert.confidence && (
                              <div className="flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-blue-light" />
                                <span className="text-blue-light">Confidence: {alert.confidence}%</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-blue-lightest font-medium mb-2">Evidence</h4>
                          <div className="space-y-1">
                            {alert.evidence.map((evidence, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <FileText className="h-4 w-4 text-blue-light" />
                                <span className="text-blue-light">{evidence.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-blue-lightest font-medium mb-2">Actions</h4>
                          <div className="space-y-1">
                            {alert.actions.map((action, index) => (
                              <div key={index} className="text-sm">
                                <div className="text-blue-lightest">{action.action}</div>
                                <div className="text-blue-light text-xs">
                                  {action.timestamp.toLocaleTimeString()} by {action.officer}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-medium">
                        {alert.status === 'new' && (
                          <Button 
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Acknowledge
                          </Button>
                        )}
                        {(alert.status === 'new' || alert.status === 'acknowledged') && (
                          <Button 
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                          <Edit className="h-4 w-4 mr-2" />
                          Add Notes
                        </Button>
                        {alert.watchlistId && (
                          <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                            <Database className="h-4 w-4 mr-2" />
                            View Watchlist Entry
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="space-y-6">
            {filteredWatchlist.length === 0 ? (
              <Card className="bg-navy-medium border-blue-medium">
                <CardContent className="text-center py-12">
                  <Database className="h-16 w-16 text-blue-light mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-blue-lightest mb-2">No Entries Found</h3>
                  <p className="text-blue-light">
                    {searchQuery ? 'No watchlist entries match your search criteria.' : 'The watchlist is empty.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredWatchlist.map((entry) => (
                  <Card key={entry.id} className="bg-navy-medium border-blue-medium">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-blue-lightest flex items-center">
                            <Flag className="h-5 w-5 mr-2" />
                            {entry.subject.firstName} {entry.subject.lastName}
                            {entry.subject.aliases && entry.subject.aliases.length > 0 && (
                              <span className="text-blue-light text-sm ml-2">
                                (aka: {entry.subject.aliases.join(', ')})
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="text-blue-light">
                            {entry.subject.nationality} • DOB: {entry.subject.dateOfBirth || 'Unknown'}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <Badge className={getNoticeTypeColor(entry.type)}>
                            {entry.type.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(entry.severity)}>
                            {entry.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(entry.status)}>
                            {entry.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Subject Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-blue-lightest font-medium mb-3">Physical Description</h4>
                          <div className="space-y-2 text-sm">
                            {entry.subject.physicalDescription.height && (
                              <div className="flex justify-between">
                                <span className="text-blue-light">Height:</span>
                                <span className="text-blue-lightest">{entry.subject.physicalDescription.height}</span>
                              </div>
                            )}
                            {entry.subject.physicalDescription.weight && (
                              <div className="flex justify-between">
                                <span className="text-blue-light">Weight:</span>
                                <span className="text-blue-lightest">{entry.subject.physicalDescription.weight}</span>
                              </div>
                            )}
                            {entry.subject.physicalDescription.eyeColor && (
                              <div className="flex justify-between">
                                <span className="text-blue-light">Eyes:</span>
                                <span className="text-blue-lightest">{entry.subject.physicalDescription.eyeColor}</span>
                              </div>
                            )}
                            {entry.subject.physicalDescription.hairColor && (
                              <div className="flex justify-between">
                                <span className="text-blue-light">Hair:</span>
                                <span className="text-blue-lightest">{entry.subject.physicalDescription.hairColor}</span>
                              </div>
                            )}
                            {entry.subject.physicalDescription.distinguishingMarks && (
                              <div className="pt-2 border-t border-blue-medium">
                                <span className="text-blue-light">Marks:</span>
                                <p className="text-blue-lightest text-xs mt-1">
                                  {entry.subject.physicalDescription.distinguishingMarks}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-blue-lightest font-medium mb-3">Identifiers</h4>
                          <div className="space-y-2 text-sm">
                            {entry.subject.identifiers.passports && (
                              <div>
                                <span className="text-blue-light">Passports:</span>
                                {entry.subject.identifiers.passports.map((passport, index) => (
                                  <div key={index} className="text-blue-lightest text-xs">{passport}</div>
                                ))}
                              </div>
                            )}
                            {entry.subject.identifiers.nationalIds && (
                              <div>
                                <span className="text-blue-light">National IDs:</span>
                                {entry.subject.identifiers.nationalIds.map((id, index) => (
                                  <div key={index} className="text-blue-lightest text-xs">{id}</div>
                                ))}
                              </div>
                            )}
                            <div className="pt-2 border-t border-blue-medium">
                              <h5 className="text-blue-light mb-1">Biometric Data:</h5>
                              <div className="flex space-x-2">
                                {entry.biometricFlags.fingerprints && (
                                  <Badge variant="outline" className="border-green-500 text-green-400 text-xs">Fingerprints</Badge>
                                )}
                                {entry.biometricFlags.facial && (
                                  <Badge variant="outline" className="border-green-500 text-green-400 text-xs">Facial</Badge>
                                )}
                                {entry.biometricFlags.iris && (
                                  <Badge variant="outline" className="border-green-500 text-green-400 text-xs">Iris</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-blue-lightest font-medium mb-3">Risk Assessment</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-blue-light">Risk Level</span>
                                <span className="text-blue-lightest">{entry.riskLevel}%</span>
                              </div>
                              <Progress 
                                value={entry.riskLevel} 
                                className="h-2"
                              />
                            </div>
                            <div className="text-sm">
                              <span className="text-blue-light">Matches:</span>
                              <span className="text-blue-lightest ml-2">{entry.matchHistory.length}</span>
                            </div>
                            <div className="text-sm">
                              <span className="text-blue-light">Last Updated:</span>
                              <div className="text-blue-lightest text-xs">{entry.lastUpdated.toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Charges */}
                      <div>
                        <h4 className="text-blue-lightest font-medium mb-3">Criminal Charges</h4>
                        <div className="flex flex-wrap gap-2">
                          {entry.charges.map((charge, index) => (
                            <Badge key={index} variant="outline" className="border-red-400 text-red-400">
                              {charge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {entry.notes && (
                        <div>
                          <h4 className="text-blue-lightest font-medium mb-2">Special Notes</h4>
                          <Alert className="border-yellow-500 bg-yellow-500/10">
                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                            <AlertDescription className="text-yellow-200">
                              {entry.notes}
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                      {/* Match History */}
                      {entry.matchHistory.length > 0 && (
                        <div>
                          <h4 className="text-blue-lightest font-medium mb-3">Recent Matches</h4>
                          <div className="space-y-2">
                            {entry.matchHistory.slice(0, 3).map((match, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-navy-dark rounded">
                                <div>
                                  <div className="text-blue-lightest text-sm">{match.location}</div>
                                  <div className="text-blue-light text-xs">{match.timestamp.toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-blue-lightest text-sm">{match.confidence}%</div>
                                  <div className="text-blue-light text-xs">{match.outcome}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-medium">
                        <Button size="sm" className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Profile
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Entry
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                          <Activity className="h-4 w-4 mr-2" />
                          Match History
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        {entry.attachments.length > 0 && (
                          <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                            <FileText className="h-4 w-4 mr-2" />
                            Attachments ({entry.attachments.length})
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Match History Tab */}
          <TabsContent value="matches" className="space-y-6">
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Recent Matches</CardTitle>
                <CardDescription className="text-blue-light">
                  History of all watchlist matches and outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchlist.flatMap(entry => 
                    entry.matchHistory.map(match => ({
                      ...match,
                      subject: `${entry.subject.firstName} ${entry.subject.lastName}`,
                      type: entry.type,
                      severity: entry.severity
                    }))
                  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((match, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-navy-dark rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge className={getNoticeTypeColor(match.type)}>
                          {match.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <div>
                          <h4 className="text-blue-lightest font-medium">{match.subject}</h4>
                          <p className="text-blue-light text-sm">{match.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-lightest text-sm">{match.confidence}% Confidence</div>
                        <div className="text-blue-light text-xs">{match.timestamp.toLocaleString()}</div>
                        <div className="text-blue-light text-xs">by {match.officer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Alert Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Shield className="h-16 w-16 text-blue-light mx-auto mb-4" />
                    <p className="text-blue-light">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Match Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-blue-light">Total Matches This Month</span>
                      <span className="text-blue-lightest font-medium">
                        {watchlist.reduce((sum, entry) => sum + entry.matchHistory.length, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-light">Critical Alerts</span>
                      <span className="text-blue-lightest font-medium">
                        {alerts.filter(a => a.priority === 'critical').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-light">Resolution Rate</span>
                      <span className="text-blue-lightest font-medium">
                        {Math.round((alerts.filter(a => a.status === 'resolved').length / alerts.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}