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
  Plane, 
  Users, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Shield,
  Database,
  Globe,
  FileText,
  Download,
  RefreshCw,
  Filter,
  Eye
} from "lucide-react";

interface PassengerRecord {
  id: string;
  pnr: string;
  flightNumber: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  seatNumber: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  watchlistStatus: 'clear' | 'flagged' | 'wanted';
  biometricStatus: 'verified' | 'pending' | 'failed';
  arrivalTime: string;
  departurePort: string;
  destinationPort: string;
  visaStatus: string;
  lastScreening: string;
  additionalChecks: string[];
}

interface FlightManifest {
  flightNumber: string;
  airline: string;
  aircraft: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  totalPassengers: number;
  processedPassengers: number;
  flaggedPassengers: number;
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived';
}

export function AdvancedPassengerInfo() {
  const { t } = useTranslation();
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [passengers, setPassengers] = useState<PassengerRecord[]>([]);
  const [filteredPassengers, setFilteredPassengers] = useState<PassengerRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('manifest');

  // Mock flight manifests
  const [flightManifests] = useState<FlightManifest[]>([
    {
      flightNumber: "RW101",
      airline: "RwandAir",
      aircraft: "Boeing 737-800",
      departureTime: "2024-10-06T14:30:00Z",
      arrivalTime: "2024-10-06T16:45:00Z",
      origin: "Nairobi (NBO)",
      destination: "Kigali (KGL)",
      totalPassengers: 186,
      processedPassengers: 186,
      flaggedPassengers: 3,
      status: "arrived"
    },
    {
      flightNumber: "ET308",
      airline: "Ethiopian Airlines", 
      aircraft: "Airbus A350-900",
      departureTime: "2024-10-06T18:15:00Z",
      arrivalTime: "2024-10-06T20:30:00Z",
      origin: "Addis Ababa (ADD)",
      destination: "Kigali (KGL)",
      totalPassengers: 295,
      processedPassengers: 230,
      flaggedPassengers: 1,
      status: "boarding"
    }
  ]);

  // Mock passenger data
  const mockPassengers: PassengerRecord[] = [
    {
      id: "PAX001",
      pnr: "ABC123",
      flightNumber: "RW101",
      firstName: "Jean",
      lastName: "Mukamana",
      passportNumber: "PA1234567",
      nationality: "RW",
      dateOfBirth: "1985-03-15",
      seatNumber: "14A",
      riskLevel: "low",
      watchlistStatus: "clear",
      biometricStatus: "verified",
      arrivalTime: "2024-10-06T16:45:00Z",
      departurePort: "NBO",
      destinationPort: "KGL",
      visaStatus: "Valid",
      lastScreening: "2024-10-06T16:30:00Z",
      additionalChecks: ["Biometric", "Document"]
    },
    {
      id: "PAX002",
      pnr: "DEF456",
      flightNumber: "RW101",
      firstName: "Ahmed",
      lastName: "Hassan",
      passportNumber: "EG9876543",
      nationality: "EG",
      dateOfBirth: "1978-11-22",
      seatNumber: "8C",
      riskLevel: "medium",
      watchlistStatus: "flagged",
      biometricStatus: "pending",
      arrivalTime: "2024-10-06T16:45:00Z",
      departurePort: "NBO",
      destinationPort: "KGL",
      visaStatus: "Tourist Visa",
      lastScreening: "2024-10-06T16:25:00Z",
      additionalChecks: ["Enhanced Screening", "Secondary Inspection"]
    },
    {
      id: "PAX003",
      pnr: "GHI789",
      flightNumber: "ET308",
      firstName: "Maria",
      lastName: "Santos",
      passportNumber: "BR5555666",
      nationality: "BR",
      dateOfBirth: "1990-07-08",
      seatNumber: "22F",
      riskLevel: "high",
      watchlistStatus: "wanted",
      biometricStatus: "failed",
      arrivalTime: "2024-10-06T20:30:00Z",
      departurePort: "ADD",
      destinationPort: "KGL",
      visaStatus: "Business Visa",
      lastScreening: "2024-10-06T18:00:00Z",
      additionalChecks: ["INTERPOL Check", "Criminal Background", "Enhanced Screening"]
    }
  ];

  useEffect(() => {
    setPassengers(mockPassengers);
    setFilteredPassengers(mockPassengers);
    
    // Simulate real-time screening progress
    const timer = setInterval(() => {
      setScreeningProgress(prev => (prev >= 100 ? 0 : prev + 5));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let filtered = passengers;

    // Filter by flight
    if (selectedFlight) {
      filtered = filtered.filter(p => p.flightNumber === selectedFlight);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.pnr.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by risk level
    if (riskFilter !== 'all') {
      filtered = filtered.filter(p => p.riskLevel === riskFilter);
    }

    setFilteredPassengers(filtered);
  }, [selectedFlight, searchTerm, riskFilter, passengers]);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getWatchlistBadgeColor = (status: string) => {
    switch (status) {
      case 'clear': return 'default';
      case 'flagged': return 'secondary';
      case 'wanted': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Plane className="h-6 w-6 text-navy-medium" />
            {t('api.title', 'Advanced Passenger Information (API) & PNR')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('api.subtitle', 'Real-time passenger data processing and risk assessment')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            {t('api.connected', 'IATA Connected')}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {t('api.realTime', 'Real-time')}
          </Badge>
        </div>
      </div>

      {/* Real-time Screening Progress */}
      <Alert>
        <RefreshCw className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>{t('api.liveScreening', 'Live Passenger Screening in Progress')}</span>
            <Badge variant="secondary">{screeningProgress}%</Badge>
          </div>
          <Progress value={screeningProgress} className="mt-2" />
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manifest">{t('api.manifest', 'Flight Manifest')}</TabsTrigger>
          <TabsTrigger value="passengers">{t('api.passengers', 'Passenger List')}</TabsTrigger>
          <TabsTrigger value="watchlist">{t('api.watchlist', 'Watchlist Check')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('api.analytics', 'Analytics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="manifest" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flightManifests.map((flight) => (
              <Card key={flight.flightNumber} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedFlight(flight.flightNumber)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{flight.flightNumber} - {flight.airline}</span>
                    <Badge variant={
                      flight.status === 'arrived' ? 'default' :
                      flight.status === 'departed' ? 'secondary' :
                      flight.status === 'boarding' ? 'destructive' : 'outline'
                    }>
                      {flight.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('api.aircraft', 'Aircraft')}</Label>
                      <p>{flight.aircraft}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('api.route', 'Route')}</Label>
                      <p>{flight.origin} → {flight.destination}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('api.departure', 'Departure')}</Label>
                      <p>{new Date(flight.departureTime).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('api.arrival', 'Arrival')}</Label>
                      <p>{new Date(flight.arrivalTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-lg font-semibold">{flight.totalPassengers}</p>
                      <p className="text-xs text-muted-foreground">{t('api.totalPax', 'Total PAX')}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-lg font-semibold">{flight.processedPassengers}</p>
                      <p className="text-xs text-muted-foreground">{t('api.processed', 'Processed')}</p>
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <p className="text-lg font-semibold">{flight.flaggedPassengers}</p>
                      <p className="text-xs text-muted-foreground">{t('api.flagged', 'Flagged')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="passengers" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('api.filters', 'Passenger Filters')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>{t('api.flight', 'Flight')}</Label>
                  <Select value={selectedFlight} onValueChange={setSelectedFlight}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('api.allFlights', 'All Flights')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('api.allFlights', 'All Flights')}</SelectItem>
                      {flightManifests.map(flight => (
                        <SelectItem key={flight.flightNumber} value={flight.flightNumber}>
                          {flight.flightNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('api.riskLevel', 'Risk Level')}</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('api.allRisks', 'All Levels')}</SelectItem>
                      <SelectItem value="low">{t('api.lowRisk', 'Low Risk')}</SelectItem>
                      <SelectItem value="medium">{t('api.mediumRisk', 'Medium Risk')}</SelectItem>
                      <SelectItem value="high">{t('api.highRisk', 'High Risk')}</SelectItem>
                      <SelectItem value="critical">{t('api.criticalRisk', 'Critical Risk')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('api.search', 'Search')}</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('api.searchPlaceholder', 'Name, Passport, PNR...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    {t('api.export', 'Export')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('api.passengerList', 'Passenger List')} ({filteredPassengers.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPassengers.map((passenger) => (
                  <div key={passenger.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{passenger.firstName} {passenger.lastName}</h4>
                          <p className="text-sm text-muted-foreground">{passenger.passportNumber} • {passenger.nationality}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRiskBadgeColor(passenger.riskLevel)}>
                          {passenger.riskLevel} risk
                        </Badge>
                        <Badge variant={getWatchlistBadgeColor(passenger.watchlistStatus)}>
                          {passenger.watchlistStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('api.flight', 'Flight')}</Label>
                        <p>{passenger.flightNumber} • {passenger.seatNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('api.biometric', 'Biometric')}</Label>
                        <p className={getStatusColor(passenger.biometricStatus)}>
                          {passenger.biometricStatus}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('api.visa', 'Visa Status')}</Label>
                        <p>{passenger.visaStatus}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('api.lastScreening', 'Last Screening')}</Label>
                        <p>{new Date(passenger.lastScreening).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {passenger.additionalChecks.length > 0 && (
                      <div className="mt-3">
                        <Label className="text-xs text-muted-foreground">{t('api.additionalChecks', 'Additional Checks')}</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {passenger.additionalChecks.map((check, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {check}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-3 gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        {t('api.viewDetails', 'Details')}
                      </Button>
                      {passenger.watchlistStatus === 'wanted' && (
                        <Button variant="destructive" size="sm">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {t('api.detain', 'Detain')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('api.watchlistScreening', 'Watchlist Screening Results')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPassengers.filter(p => p.watchlistStatus !== 'clear').map((passenger) => (
                  <div key={passenger.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-800">
                        {passenger.firstName} {passenger.lastName}
                      </h4>
                      <Badge variant="destructive">
                        {passenger.watchlistStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-red-700">
                      <div>
                        <Label className="text-xs">{t('api.passport', 'Passport')}</Label>
                        <p>{passenger.passportNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs">{t('api.nationality', 'Nationality')}</Label>
                        <p>{passenger.nationality}</p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3 gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        {t('api.viewWatchlistEntry', 'View Entry')}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t('api.alertSecurity', 'Alert Security')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {t('api.totalProcessed', 'Total Processed')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-navy-medium">481</p>
                <p className="text-sm text-muted-foreground">{t('api.last24h', 'Last 24 hours')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {t('api.riskDetected', 'Risk Detected')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-red-600">4</p>
                <p className="text-sm text-muted-foreground">{t('api.requiring', 'Requiring attention')}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {t('api.avgProcessing', 'Avg Processing')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-green-600">2.3s</p>
                <p className="text-sm text-muted-foreground">{t('api.perPassenger', 'Per passenger')}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}