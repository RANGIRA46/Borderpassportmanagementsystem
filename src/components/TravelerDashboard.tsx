import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "./utils/LanguageSelector";
import { 
  Users, 
  Plane, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  MapPin,
  Calendar,
  Globe,
  Shield,
  FileText,
  Download,
  Search,
  Filter,
  RefreshCw,
  Camera,
  Fingerprint
} from "lucide-react";

interface TravelerRecord {
  id: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  flightNumber: string;
  arrivalTime: string;
  departurePort: string;
  gateNumber: string;
  seatNumber: string;
  status: 'approaching' | 'arrived' | 'processing' | 'cleared' | 'detained';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  documentsVerified: boolean;
  biometricCaptured: boolean;
  customsStatus: 'pending' | 'cleared' | 'inspection';
  lastUpdate: string;
  queuePosition: number;
  estimatedProcessingTime: number;
  alerts: string[];
}

interface QueueStats {
  totalInQueue: number;
  averageWaitTime: number;
  boothsActive: number;
  boothsTotal: number;
  processingRate: number;
}

export function TravelerDashboard() {
  const { t } = useTranslation();
  const [travelers, setTravelers] = useState<TravelerRecord[]>([]);
  const [filteredTravelers, setFilteredTravelers] = useState<TravelerRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [queueStats, setQueueStats] = useState<QueueStats>({
    totalInQueue: 0,
    averageWaitTime: 0,
    boothsActive: 8,
    boothsTotal: 12,
    processingRate: 45
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTraveler, setSelectedTraveler] = useState<TravelerRecord | null>(null);

  // Mock traveler data
  const mockTravelers: TravelerRecord[] = [
    {
      id: "TRV001",
      firstName: "Jean",
      lastName: "Mukamana",
      passportNumber: "PA1234567",
      nationality: "RW",
      flightNumber: "RW101",
      arrivalTime: "2024-10-06T16:45:00Z",
      departurePort: "NBO",
      gateNumber: "A3",
      seatNumber: "14A",
      status: "processing",
      riskLevel: "low",
      documentsVerified: true,
      biometricCaptured: true,
      customsStatus: "pending",
      lastUpdate: "2024-10-06T17:15:00Z",
      queuePosition: 1,
      estimatedProcessingTime: 3,
      alerts: []
    },
    {
      id: "TRV002",
      firstName: "Ahmed",
      lastName: "Hassan",
      passportNumber: "EG9876543",
      nationality: "EG",
      flightNumber: "RW101",
      arrivalTime: "2024-10-06T16:45:00Z",
      departurePort: "NBO",
      gateNumber: "A3",
      seatNumber: "8C",
      status: "arrived",
      riskLevel: "medium",
      documentsVerified: false,
      biometricCaptured: false,
      customsStatus: "pending",
      lastUpdate: "2024-10-06T17:10:00Z",
      queuePosition: 15,
      estimatedProcessingTime: 12,
      alerts: ["Additional Screening Required", "Document Review"]
    },
    {
      id: "TRV003",
      firstName: "Maria",
      lastName: "Santos",
      passportNumber: "BR5555666",
      nationality: "BR",
      flightNumber: "ET308",
      arrivalTime: "2024-10-06T20:30:00Z",
      departurePort: "ADD",
      gateNumber: "B7",
      seatNumber: "22F",
      status: "detained",
      riskLevel: "high",
      documentsVerified: false,
      biometricCaptured: true,
      customsStatus: "inspection",
      lastUpdate: "2024-10-06T20:45:00Z",
      queuePosition: 0,
      estimatedProcessingTime: 0,
      alerts: ["Watchlist Match", "INTERPOL Alert", "Secondary Inspection"]
    },
    {
      id: "TRV004",
      firstName: "David",
      lastName: "Johnson",
      passportNumber: "US7777888",
      nationality: "US",
      flightNumber: "RW101",
      arrivalTime: "2024-10-06T16:45:00Z",
      departurePort: "NBO",
      gateNumber: "A3",
      seatNumber: "5B",
      status: "cleared",
      riskLevel: "low",
      documentsVerified: true,
      biometricCaptured: true,
      customsStatus: "cleared",
      lastUpdate: "2024-10-06T17:05:00Z",
      queuePosition: 0,
      estimatedProcessingTime: 0,
      alerts: []
    }
  ];

  useEffect(() => {
    setTravelers(mockTravelers);
    setFilteredTravelers(mockTravelers);
    
    // Update queue stats
    const inQueue = mockTravelers.filter(t => ['arrived', 'processing'].includes(t.status)).length;
    const avgWait = Math.round(inQueue * 2.5);
    
    setQueueStats(prev => ({
      ...prev,
      totalInQueue: inQueue,
      averageWaitTime: avgWait
    }));

    // Simulate real-time updates
    const timer = setInterval(() => {
      setTravelers(prev => prev.map(t => ({
        ...t,
        lastUpdate: new Date().toISOString(),
        queuePosition: t.status === 'arrived' ? Math.max(1, t.queuePosition - Math.floor(Math.random() * 2)) : t.queuePosition
      })));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filtered = travelers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.flightNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    // Filter by risk level
    if (riskFilter !== 'all') {
      filtered = filtered.filter(t => t.riskLevel === riskFilter);
    }

    setFilteredTravelers(filtered);
  }, [searchTerm, statusFilter, riskFilter, travelers]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approaching': return 'secondary';
      case 'arrived': return 'default';
      case 'processing': return 'destructive';
      case 'cleared': return 'default';
      case 'detained': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Users className="h-6 w-6 text-navy-medium" />
            {t('travelerDashboard.title', 'Traveler Dashboard & Manifest')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('travelerDashboard.subtitle', 'Real-time immigration processing and queue management')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('travelerDashboard.refresh', 'Refresh')}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            {t('travelerDashboard.export', 'Export')}
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('travelerDashboard.inQueue', 'In Queue')}</p>
                <p className="text-2xl font-bold">{queueStats.totalInQueue}</p>
              </div>
              <Users className="h-8 w-8 text-navy-medium" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('travelerDashboard.avgWait', 'Avg Wait')}</p>
                <p className="text-2xl font-bold">{queueStats.averageWaitTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-navy-medium" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('travelerDashboard.boothsActive', 'Booths Active')}</p>
                <p className="text-2xl font-bold">{queueStats.boothsActive}/{queueStats.boothsTotal}</p>
              </div>
              <MapPin className="h-8 w-8 text-navy-medium" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('travelerDashboard.processingRate', 'Processing Rate')}</p>
                <p className="text-2xl font-bold">{queueStats.processingRate}/h</p>
              </div>
              <Shield className="h-8 w-8 text-navy-medium" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">{t('travelerDashboard.dashboard', 'Dashboard')}</TabsTrigger>
          <TabsTrigger value="manifest">{t('travelerDashboard.manifest', 'Manifest')}</TabsTrigger>
          <TabsTrigger value="processing">{t('travelerDashboard.processing', 'Processing')}</TabsTrigger>
          <TabsTrigger value="alerts">{t('travelerDashboard.alerts', 'Alerts')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Live Processing View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('travelerDashboard.liveProcessing', 'Live Processing Status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {travelers.filter(t => t.status === 'processing').map((traveler) => (
                  <div key={traveler.id} className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{traveler.firstName} {traveler.lastName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {traveler.flightNumber} • {traveler.passportNumber}
                        </p>
                      </div>
                      <Badge variant="destructive">PROCESSING</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className={traveler.documentsVerified ? 'text-green-600' : 'text-red-600'}>
                          {traveler.documentsVerified ? 'Docs Verified' : 'Docs Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fingerprint className="h-4 w-4" />
                        <span className={traveler.biometricCaptured ? 'text-green-600' : 'text-red-600'}>
                          {traveler.biometricCaptured ? 'Biometrics OK' : 'Biometrics Pending'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>ETA: {traveler.estimatedProcessingTime}m</span>
                      </div>
                    </div>

                    <Progress value={75} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {t('travelerDashboard.processingStep', 'Processing step 3 of 4: Biometric verification')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manifest" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('travelerDashboard.filters', 'Filters')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>{t('travelerDashboard.search', 'Search')}</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('travelerDashboard.searchPlaceholder', 'Name, passport, flight...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('travelerDashboard.status', 'Status')}</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('travelerDashboard.allStatuses', 'All Statuses')}</SelectItem>
                      <SelectItem value="approaching">{t('travelerDashboard.approaching', 'Approaching')}</SelectItem>
                      <SelectItem value="arrived">{t('travelerDashboard.arrived', 'Arrived')}</SelectItem>
                      <SelectItem value="processing">{t('travelerDashboard.processing', 'Processing')}</SelectItem>
                      <SelectItem value="cleared">{t('travelerDashboard.cleared', 'Cleared')}</SelectItem>
                      <SelectItem value="detained">{t('travelerDashboard.detained', 'Detained')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('travelerDashboard.riskLevel', 'Risk Level')}</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('travelerDashboard.allRisks', 'All Levels')}</SelectItem>
                      <SelectItem value="low">{t('travelerDashboard.lowRisk', 'Low Risk')}</SelectItem>
                      <SelectItem value="medium">{t('travelerDashboard.mediumRisk', 'Medium Risk')}</SelectItem>
                      <SelectItem value="high">{t('travelerDashboard.highRisk', 'High Risk')}</SelectItem>
                      <SelectItem value="critical">{t('travelerDashboard.criticalRisk', 'Critical Risk')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('travelerDashboard.viewSelected', 'View Selected')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traveler List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('travelerDashboard.travelerList', 'Traveler List')} ({filteredTravelers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTravelers.map((traveler) => (
                  <div 
                    key={traveler.id} 
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedTraveler(traveler)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{traveler.firstName} {traveler.lastName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {traveler.passportNumber} • {traveler.nationality} • {traveler.flightNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeColor(traveler.status)}>
                          {traveler.status}
                        </Badge>
                        <Badge variant={getRiskBadgeColor(traveler.riskLevel)}>
                          {traveler.riskLevel}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('travelerDashboard.arrival', 'Arrival')}</Label>
                        <p>{new Date(traveler.arrivalTime).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('travelerDashboard.gate', 'Gate')}</Label>
                        <p>{traveler.gateNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('travelerDashboard.queuePosition', 'Queue Position')}</Label>
                        <p>{traveler.queuePosition > 0 ? `#${traveler.queuePosition}` : '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('travelerDashboard.eta', 'ETA')}</Label>
                        <p>{traveler.estimatedProcessingTime > 0 ? `${traveler.estimatedProcessingTime}m` : '-'}</p>
                      </div>
                    </div>

                    {traveler.alerts.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {traveler.alerts.map((alert, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-xs">
                        <span className={`flex items-center gap-1 ${traveler.documentsVerified ? 'text-green-600' : 'text-red-600'}`}>
                          <CheckCircle className="h-3 w-3" />
                          {t('travelerDashboard.documents', 'Documents')}
                        </span>
                        <span className={`flex items-center gap-1 ${traveler.biometricCaptured ? 'text-green-600' : 'text-red-600'}`}>
                          <CheckCircle className="h-3 w-3" />
                          {t('travelerDashboard.biometrics', 'Biometrics')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('travelerDashboard.lastUpdate', 'Last update')}: {new Date(traveler.lastUpdate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('travelerDashboard.boothStatus', 'Immigration Booth Status')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className={`p-3 border rounded-lg text-center ${
                    i < 8 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <p className="font-medium">Booth {i + 1}</p>
                    <p className={`text-sm ${i < 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      {i < 8 ? 'Active' : 'Inactive'}
                    </p>
                    {i < 8 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Officer {String.fromCharCode(65 + i)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {t('travelerDashboard.activeAlerts', 'Active Alerts')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {travelers.filter(t => t.alerts.length > 0).map((traveler) => (
                  <Alert key={traveler.id} className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{traveler.firstName} {traveler.lastName}</p>
                          <p className="text-sm">{traveler.alerts.join(', ')}</p>
                        </div>
                        <Badge variant="destructive">{traveler.status}</Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}