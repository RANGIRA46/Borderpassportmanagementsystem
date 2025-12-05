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
  Clock, 
  Users, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Database,
  Globe,
  Radar,
  MapPin,
  Calendar,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Bell
} from "lucide-react";

interface PreArrivalPassenger {
  id: string;
  pnr: string;
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  flightNumber: string;
  arrivalDate: string;
  arrivalTime: string;
  departurePort: string;
  seatNumber: string;
  ticketType: string;
  bookingDate: string;
  travelHistory: string[];
  visaStatus: 'valid' | 'expired' | 'required' | 'exempt';
  riskScore: number;
  watchlistStatus: 'clear' | 'flagged' | 'wanted';
  preScreeningStatus: 'pending' | 'completed' | 'flagged';
  documentsReceived: boolean;
  biometricPreCheck: boolean;
  estimatedProcessingTime: number;
  priorityStatus: 'standard' | 'expedited' | 'diplomatic' | 'crew';
  alerts: string[];
}

interface FlightPreArrival {
  flightNumber: string;
  airline: string;
  aircraft: string;
  origin: string;
  destination: string;
  scheduledArrival: string;
  estimatedArrival: string;
  status: 'scheduled' | 'delayed' | 'on-time' | 'cancelled';
  totalPassengers: number;
  preScreenedPassengers: number;
  flaggedPassengers: number;
  crewMembers: number;
  dataCompleteness: number;
}

export function PreArrivalData() {
  const { t } = useTranslation();
  const [flights, setFlights] = useState<FlightPreArrival[]>([]);
  const [passengers, setPassengers] = useState<PreArrivalPassenger[]>([]);
  const [filteredPassengers, setFilteredPassengers] = useState<PreArrivalPassenger[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [processingProgress, setProcessingProgress] = useState(0);

  // Mock pre-arrival data
  const mockFlights: FlightPreArrival[] = [
    {
      flightNumber: "RW101",
      airline: "RwandAir",
      aircraft: "Boeing 737-800",
      origin: "Nairobi (NBO)",
      destination: "Kigali (KGL)",
      scheduledArrival: "2024-10-07T16:45:00Z",
      estimatedArrival: "2024-10-07T16:45:00Z",
      status: "on-time",
      totalPassengers: 186,
      preScreenedPassengers: 175,
      flaggedPassengers: 3,
      crewMembers: 8,
      dataCompleteness: 94
    },
    {
      flightNumber: "ET308",
      airline: "Ethiopian Airlines",
      aircraft: "Airbus A350-900",
      origin: "Addis Ababa (ADD)",
      destination: "Kigali (KGL)",
      scheduledArrival: "2024-10-07T20:30:00Z",
      estimatedArrival: "2024-10-07T20:45:00Z",
      status: "delayed",
      totalPassengers: 295,
      preScreenedPassengers: 280,
      flaggedPassengers: 5,
      crewMembers: 12,
      dataCompleteness: 89
    },
    {
      flightNumber: "KQ472",
      airline: "Kenya Airways",
      aircraft: "Boeing 787-8",
      origin: "Nairobi (NBO)",
      destination: "Kigali (KGL)",
      scheduledArrival: "2024-10-07T14:15:00Z",
      estimatedArrival: "2024-10-07T14:15:00Z",
      status: "scheduled",
      totalPassengers: 234,
      preScreenedPassengers: 234,
      flaggedPassengers: 1,
      crewMembers: 10,
      dataCompleteness: 100
    }
  ];

  const mockPassengers: PreArrivalPassenger[] = [
    {
      id: "PAX001",
      pnr: "ABC123",
      firstName: "Jean",
      lastName: "Mukamana",
      passportNumber: "PA1234567",
      nationality: "RW",
      dateOfBirth: "1985-03-15",
      flightNumber: "RW101",
      arrivalDate: "2024-10-07",
      arrivalTime: "16:45",
      departurePort: "NBO",
      seatNumber: "14A",
      ticketType: "Economy",
      bookingDate: "2024-09-15",
      travelHistory: ["KGL", "NBO", "DXB", "LHR"],
      visaStatus: "exempt",
      riskScore: 15,
      watchlistStatus: "clear",
      preScreeningStatus: "completed",
      documentsReceived: true,
      biometricPreCheck: true,
      estimatedProcessingTime: 3,
      priorityStatus: "standard",
      alerts: []
    },
    {
      id: "PAX002",
      pnr: "DEF456",
      firstName: "Ahmed",
      lastName: "Hassan",
      passportNumber: "EG9876543",
      nationality: "EG",
      dateOfBirth: "1978-11-22",
      flightNumber: "RW101",
      arrivalDate: "2024-10-07",
      arrivalTime: "16:45",
      departurePort: "NBO",
      seatNumber: "8C",
      ticketType: "Business",
      bookingDate: "2024-10-01",
      travelHistory: ["CAI", "NBO", "KGL"],
      visaStatus: "valid",
      riskScore: 65,
      watchlistStatus: "flagged",
      preScreeningStatus: "flagged",
      documentsReceived: true,
      biometricPreCheck: false,
      estimatedProcessingTime: 12,
      priorityStatus: "standard",
      alerts: ["Late booking", "Unusual travel pattern"]
    },
    {
      id: "PAX003",
      pnr: "GHI789",
      firstName: "Maria",
      lastName: "Santos",
      passportNumber: "BR5555666",
      nationality: "BR",
      dateOfBirth: "1990-07-08",
      flightNumber: "ET308",
      arrivalDate: "2024-10-07",
      arrivalTime: "20:30",
      departurePort: "ADD",
      seatNumber: "22F",
      ticketType: "Economy",
      bookingDate: "2024-10-05",
      travelHistory: ["SAO", "ADD", "KGL"],
      visaStatus: "required",
      riskScore: 85,
      watchlistStatus: "wanted",
      preScreeningStatus: "flagged",
      documentsReceived: false,
      biometricPreCheck: false,
      estimatedProcessingTime: 25,
      priorityStatus: "standard",
      alerts: ["INTERPOL alert", "Missing documents", "High risk profile"]
    }
  ];

  useEffect(() => {
    setFlights(mockFlights);
    setPassengers(mockPassengers);
    setFilteredPassengers(mockPassengers);
    
    // Simulate real-time processing
    const timer = setInterval(() => {
      setProcessingProgress(prev => (prev >= 100 ? 0 : prev + 5));
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

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.preScreeningStatus === statusFilter);
    }

    // Filter by risk level
    if (riskFilter !== 'all') {
      const riskLevel = riskFilter as 'low' | 'medium' | 'high';
      filtered = filtered.filter(p => {
        if (riskLevel === 'low') return p.riskScore < 30;
        if (riskLevel === 'medium') return p.riskScore >= 30 && p.riskScore < 70;
        if (riskLevel === 'high') return p.riskScore >= 70;
        return true;
      });
    }

    setFilteredPassengers(filtered);
  }, [selectedFlight, searchTerm, statusFilter, riskFilter, passengers]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'completed': return 'default';
      case 'flagged': return 'destructive';
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

  const getFlightStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-green-600';
      case 'delayed': return 'text-yellow-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600';
    if (score < 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Radar className="h-6 w-6 text-navy-medium" />
            {t('preArrival.title', 'Pre-Arrival Passenger Data')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('preArrival.subtitle', 'Advanced passenger information processing and risk assessment before arrival')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="h-3 w-3" />
            {t('preArrival.apiConnected', 'API Connected')}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            {t('preArrival.realTime', 'Real-time')}
          </Badge>
        </div>
      </div>

      {/* Processing Status */}
      <Alert>
        <RefreshCw className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>{t('preArrival.processingStatus', 'Pre-arrival data processing in progress')}</span>
            <Badge variant="secondary">{processingProgress}%</Badge>
          </div>
          <Progress value={processingProgress} className="mt-2" />
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('preArrival.overview', 'Overview')}</TabsTrigger>
          <TabsTrigger value="flights">{t('preArrival.flights', 'Flights')}</TabsTrigger>
          <TabsTrigger value="passengers">{t('preArrival.passengers', 'Passengers')}</TabsTrigger>
          <TabsTrigger value="screening">{t('preArrival.screening', 'Screening')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('preArrival.totalFlights', 'Total Flights')}</p>
                    <p className="text-2xl font-bold">{flights.length}</p>
                  </div>
                  <Plane className="h-8 w-8 text-navy-medium" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('preArrival.totalPassengers', 'Total Passengers')}</p>
                    <p className="text-2xl font-bold">{passengers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-navy-medium" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('preArrival.preScreened', 'Pre-screened')}</p>
                    <p className="text-2xl font-bold text-green-600">{passengers.filter(p => p.preScreeningStatus === 'completed').length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('preArrival.flagged', 'Flagged')}</p>
                    <p className="text-2xl font-bold text-red-600">{passengers.filter(p => p.preScreeningStatus === 'flagged').length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Arrivals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t('preArrival.upcomingArrivals', 'Upcoming Arrivals')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {flights.map((flight) => (
                  <div key={flight.flightNumber} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <h4 className="font-medium">{flight.flightNumber} - {flight.airline}</h4>
                          <p className="text-sm text-muted-foreground">{flight.origin} → {flight.destination}</p>
                        </div>
                      </div>
                      <Badge variant={flight.status === 'on-time' ? 'default' : 'secondary'}>
                        {flight.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.scheduled', 'Scheduled')}</Label>
                        <p>{new Date(flight.scheduledArrival).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.estimated', 'Estimated')}</Label>
                        <p className={getFlightStatusColor(flight.status)}>
                          {new Date(flight.estimatedArrival).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.passengers', 'Passengers')}</Label>
                        <p>{flight.totalPassengers}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.screened', 'Screened')}</Label>
                        <p className="text-green-600">{flight.preScreenedPassengers}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.flagged', 'Flagged')}</Label>
                        <p className="text-red-600">{flight.flaggedPassengers}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{t('preArrival.dataCompleteness', 'Data Completeness')}</span>
                        <span>{flight.dataCompleteness}%</span>
                      </div>
                      <Progress value={flight.dataCompleteness} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {flights.map((flight) => (
              <Card key={flight.flightNumber} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedFlight(flight.flightNumber)}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{flight.flightNumber}</span>
                    <Badge variant={flight.status === 'on-time' ? 'default' : 'secondary'}>
                      {flight.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{flight.airline}</h4>
                    <p className="text-sm text-muted-foreground">{flight.aircraft}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('preArrival.origin', 'Origin')}</Label>
                      <p>{flight.origin}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('preArrival.destination', 'Destination')}</Label>
                      <p>{flight.destination}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('preArrival.scheduled', 'Scheduled')}</Label>
                      <p>{new Date(flight.scheduledArrival).toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('preArrival.estimated', 'Estimated')}</Label>
                      <p>{new Date(flight.estimatedArrival).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-blue-50 rounded">
                      <p className="text-lg font-semibold">{flight.totalPassengers}</p>
                      <p className="text-xs text-muted-foreground">{t('preArrival.totalPax', 'Total PAX')}</p>
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <p className="text-lg font-semibold">{flight.preScreenedPassengers}</p>
                      <p className="text-xs text-muted-foreground">{t('preArrival.screened', 'Screened')}</p>
                    </div>
                  </div>
                  
                  {flight.flaggedPassengers > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {flight.flaggedPassengers} {t('preArrival.passengersRequireAttention', 'passengers require attention')}
                      </AlertDescription>
                    </Alert>
                  )}
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
                {t('preArrival.filters', 'Passenger Filters')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>{t('preArrival.flight', 'Flight')}</Label>
                  <Select value={selectedFlight} onValueChange={setSelectedFlight}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('preArrival.allFlights', 'All Flights')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('preArrival.allFlights', 'All Flights')}</SelectItem>
                      {flights.map(flight => (
                        <SelectItem key={flight.flightNumber} value={flight.flightNumber}>
                          {flight.flightNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('preArrival.search', 'Search')}</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('preArrival.searchPlaceholder', 'Name, passport, PNR...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('preArrival.status', 'Status')}</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('preArrival.allStatuses', 'All Statuses')}</SelectItem>
                      <SelectItem value="pending">{t('preArrival.pending', 'Pending')}</SelectItem>
                      <SelectItem value="completed">{t('preArrival.completed', 'Completed')}</SelectItem>
                      <SelectItem value="flagged">{t('preArrival.flagged', 'Flagged')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('preArrival.riskLevel', 'Risk Level')}</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('preArrival.allRisks', 'All Levels')}</SelectItem>
                      <SelectItem value="low">{t('preArrival.lowRisk', 'Low Risk')}</SelectItem>
                      <SelectItem value="medium">{t('preArrival.mediumRisk', 'Medium Risk')}</SelectItem>
                      <SelectItem value="high">{t('preArrival.highRisk', 'High Risk')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('preArrival.refresh', 'Refresh')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {t('preArrival.export', 'Export')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Passenger List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('preArrival.passengerList', 'Passenger List')} ({filteredPassengers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredPassengers.map((passenger) => (
                  <div key={passenger.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{passenger.firstName} {passenger.lastName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {passenger.passportNumber} • {passenger.nationality} • {passenger.flightNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeColor(passenger.preScreeningStatus)}>
                          {passenger.preScreeningStatus}
                        </Badge>
                        <Badge variant={getWatchlistBadgeColor(passenger.watchlistStatus)}>
                          {passenger.watchlistStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.arrivalTime', 'Arrival Time')}</Label>
                        <p>{passenger.arrivalTime}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.seat', 'Seat')}</Label>
                        <p>{passenger.seatNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.riskScore', 'Risk Score')}</Label>
                        <p className={getRiskColor(passenger.riskScore)}>
                          {passenger.riskScore}/100 ({getRiskLevel(passenger.riskScore)})
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.eta', 'ETA Processing')}</Label>
                        <p>{passenger.estimatedProcessingTime}m</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${passenger.documentsReceived ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-xs">{t('preArrival.documents', 'Documents')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${passenger.biometricPreCheck ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-xs">{t('preArrival.biometrics', 'Biometrics')}</span>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.visaStatus', 'Visa Status')}</Label>
                        <p className="text-xs">{passenger.visaStatus}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('preArrival.priority', 'Priority')}</Label>
                        <p className="text-xs capitalize">{passenger.priorityStatus}</p>
                      </div>
                    </div>

                    {passenger.alerts.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {passenger.alerts.map((alert, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-3 gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        {t('preArrival.viewDetails', 'Details')}
                      </Button>
                      {passenger.preScreeningStatus === 'flagged' && (
                        <Button variant="destructive" size="sm">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {t('preArrival.reviewFlag', 'Review Flag')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('preArrival.preScreeningResults', 'Pre-screening Results')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPassengers.filter(p => p.preScreeningStatus === 'flagged').map((passenger) => (
                  <div key={passenger.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-red-800">
                        {passenger.firstName} {passenger.lastName}
                      </h4>
                      <Badge variant="destructive">
                        {passenger.preScreeningStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-red-700 mb-3">
                      <div>
                        <Label className="text-xs">{t('preArrival.passport', 'Passport')}</Label>
                        <p>{passenger.passportNumber}</p>
                      </div>
                      <div>
                        <Label className="text-xs">{t('preArrival.riskScore', 'Risk Score')}</Label>
                        <p>{passenger.riskScore}/100</p>
                      </div>
                    </div>
                    
                    {passenger.alerts.length > 0 && (
                      <div className="mb-3">
                        <Label className="text-xs text-red-800">{t('preArrival.alerts', 'Alerts')}</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {passenger.alerts.map((alert, idx) => (
                            <Badge key={idx} variant="destructive" className="text-xs">
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-3 w-3 mr-1" />
                        {t('preArrival.viewFullProfile', 'View Full Profile')}
                      </Button>
                      <Button variant="destructive" size="sm">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {t('preArrival.escalate', 'Escalate')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}