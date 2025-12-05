import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Scan, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  MapPin,
  Plane,
  Car,
  Ship,
  Users,
  Activity,
  Database
} from "lucide-react";

interface BorderCrossing {
  id: string;
  passportNumber: string;
  firstName: string;
  lastName: string;
  nationality: string;
  direction: 'entry' | 'exit';
  crossingPoint: string;
  timestamp: Date;
  transportMode: 'air' | 'land' | 'sea';
  status: 'cleared' | 'flagged' | 'detained';
  biometricMatch: number;
  watchlistCheck: 'clear' | 'flagged';
  officerId: string;
}

interface Terminal {
  id: string;
  name: string;
  type: 'airport' | 'land' | 'seaport';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  throughputToday: number;
  averageProcessingTime: number;
  lastUpdate: Date;
}

export function EntryExitLogging() {
  const [passportNumber, setPassportNumber] = useState('');
  const [scanning, setScanning] = useState(false);
  const [recentCrossings, setRecentCrossings] = useState<BorderCrossing[]>([]);
  const [terminals] = useState<Terminal[]>([
    {
      id: 'KGL-INTL',
      name: 'Kigali International Airport',
      type: 'airport',
      status: 'online',
      location: 'Kigali',
      throughputToday: 1247,
      averageProcessingTime: 1.2,
      lastUpdate: new Date()
    },
    {
      id: 'GATUNA',
      name: 'Gatuna Border Post',
      type: 'land',
      status: 'online',
      location: 'Northern Province',
      throughputToday: 856,
      averageProcessingTime: 2.1,
      lastUpdate: new Date()
    },
    {
      id: 'CYANGUGU',
      name: 'Cyangugu Border Post',
      type: 'land',
      status: 'online',
      location: 'Western Province',
      throughputToday: 423,
      averageProcessingTime: 1.8,
      lastUpdate: new Date()
    }
  ]);

  const mockCrossings: BorderCrossing[] = [
    {
      id: 'BC001234',
      passportNumber: 'PC1234567',
      firstName: 'John',
      lastName: 'Doe',
      nationality: 'Rwanda',
      direction: 'entry',
      crossingPoint: 'Kigali International Airport',
      timestamp: new Date('2024-01-21T14:30:00'),
      transportMode: 'air',
      status: 'cleared',
      biometricMatch: 98.5,
      watchlistCheck: 'clear',
      officerId: 'BO247'
    },
    {
      id: 'BC001235',
      passportNumber: 'A1234567',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      nationality: 'Kenya',
      direction: 'entry',
      crossingPoint: 'Gatuna Border Post',
      timestamp: new Date('2024-01-21T13:45:00'),
      transportMode: 'land',
      status: 'flagged',
      biometricMatch: 94.2,
      watchlistCheck: 'flagged',
      officerId: 'BO156'
    },
    {
      id: 'BC001236',
      passportNumber: 'FR9876543',
      firstName: 'Marie',
      lastName: 'Dubois',
      nationality: 'France',
      direction: 'exit',
      crossingPoint: 'Kigali International Airport',
      timestamp: new Date('2024-01-21T12:15:00'),
      transportMode: 'air',
      status: 'cleared',
      biometricMatch: 97.8,
      watchlistCheck: 'clear',
      officerId: 'BO089'
    }
  ];

  const handleMRZScan = async () => {
    setScanning(true);
    
    // Simulate MRZ scanning process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock scanned data
    const mockData = {
      passportNumber: 'PC1234567',
      firstName: 'John',
      lastName: 'Doe',
      nationality: 'Rwanda',
      dateOfBirth: '1985-03-15',
      expiryDate: '2028-03-15'
    };
    
    setPassportNumber(mockData.passportNumber);
    setScanning(false);
    
    // Add to recent crossings
    const newCrossing: BorderCrossing = {
      id: `BC${Date.now()}`,
      passportNumber: mockData.passportNumber,
      firstName: mockData.firstName,
      lastName: mockData.lastName,
      nationality: mockData.nationality,
      direction: 'entry',
      crossingPoint: 'Kigali International Airport',
      timestamp: new Date(),
      transportMode: 'air',
      status: 'cleared',
      biometricMatch: 98.5,
      watchlistCheck: 'clear',
      officerId: 'BO247'
    };
    
    setRecentCrossings(prev => [newCrossing, ...prev.slice(0, 4)]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      case 'detained': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTerminalStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      case 'maintenance': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'air': return <Plane className="h-4 w-4" />;
      case 'land': return <Car className="h-4 w-4" />;
      case 'sea': return <Ship className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'entry' ? '→' : '←';
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-navy-dark">Entry/Exit Logging</h1>
          <p className="text-navy-medium">Real-time border crossing management and verification</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-navy-medium">System Online</span>
        </div>
      </div>

      <Tabs defaultValue="scan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scan">MRZ Scanner</TabsTrigger>
          <TabsTrigger value="recent">Recent Crossings</TabsTrigger>
          <TabsTrigger value="terminals">Border Terminals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* MRZ Scanner Interface */}
            <div className="lg:col-span-2">
              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-navy-dark">
                    <Scan className="h-5 w-5" />
                    <span>MRZ Document Scanner</span>
                  </CardTitle>
                  <CardDescription>Scan passport machine-readable zone for automatic data entry</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-blue-light rounded-lg p-8 text-center">
                    {scanning ? (
                      <div className="space-y-4">
                        <div className="animate-pulse">
                          <Scan className="h-16 w-16 mx-auto text-navy-medium" />
                        </div>
                        <div>
                          <p className="text-navy-dark font-medium">Scanning MRZ...</p>
                          <p className="text-sm text-navy-medium">Please ensure document is flat and well-lit</p>
                        </div>
                        <Progress value={75} className="w-64 mx-auto" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Scan className="h-16 w-16 mx-auto text-navy-medium" />
                        <div>
                          <p className="text-navy-dark font-medium">Position passport in scanning area</p>
                          <p className="text-sm text-navy-medium">Ensure the MRZ (bottom 2 lines) is clearly visible</p>
                        </div>
                        <Button 
                          onClick={handleMRZScan}
                          className="bg-navy-medium hover:bg-navy-dark text-white"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Start Scan
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        placeholder="Auto-filled from scan"
                        readOnly={scanning}
                      />
                    </div>
                    <div>
                      <Label htmlFor="direction">Direction</Label>
                      <select 
                        id="direction"
                        className="w-full px-3 py-2 border border-blue-light rounded-md bg-white text-navy-dark"
                      >
                        <option value="entry">Entry</option>
                        <option value="exit">Exit</option>
                      </select>
                    </div>
                  </div>

                  <Button 
                    disabled={!passportNumber || scanning}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Process Entry/Exit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="text-navy-dark">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-blue-medium text-navy-medium">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Flag for Secondary Inspection
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-blue-medium text-navy-medium">
                    <Database className="h-4 w-4 mr-2" />
                    Check INTERPOL Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-blue-medium text-navy-medium">
                    <Users className="h-4 w-4 mr-2" />
                    Call Supervisor
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-blue-medium text-navy-medium">
                    <Activity className="h-4 w-4 mr-2" />
                    View Travel History
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="text-navy-dark">Processing Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-navy-medium">Today's Crossings:</span>
                    <span className="font-medium text-navy-dark">2,526</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-medium">Average Processing:</span>
                    <span className="font-medium text-navy-dark">1.4 seconds</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-medium">Flags Raised:</span>
                    <span className="font-medium text-red-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-navy-medium">Success Rate:</span>
                    <span className="font-medium text-green-600">99.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="text-navy-dark">Recent Border Crossings</CardTitle>
              <CardDescription>Live feed of processed entries and exits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...recentCrossings, ...mockCrossings].slice(0, 8).map((crossing) => (
                  <div key={crossing.id} className="border border-blue-light rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="flex items-center space-x-2">
                            {getTransportIcon(crossing.transportMode)}
                            <span className="text-lg">{getDirectionIcon(crossing.direction)}</span>
                          </div>
                          <h4 className="font-medium text-navy-dark">
                            {crossing.firstName} {crossing.lastName}
                          </h4>
                          <Badge className={getStatusColor(crossing.status)}>
                            {crossing.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-navy-medium">
                          <div>
                            <span>Passport: </span>
                            <span className="font-medium text-navy-dark">{crossing.passportNumber}</span>
                          </div>
                          <div>
                            <span>Nationality: </span>
                            <span className="font-medium text-navy-dark">{crossing.nationality}</span>
                          </div>
                          <div>
                            <span>Time: </span>
                            <span className="font-medium text-navy-dark">{crossing.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-navy-medium mt-1 flex items-center space-x-4">
                          <span>
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {crossing.crossingPoint}
                          </span>
                          <span>Biometric: {crossing.biometricMatch}%</span>
                          <span>Officer: {crossing.officerId}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-blue-medium text-navy-medium">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terminals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {terminals.map((terminal) => (
              <Card key={terminal.id} className="border-blue-light">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-navy-dark">{terminal.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{terminal.location}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        terminal.status === 'online' ? 'bg-green-500' :
                        terminal.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className={`text-xs font-medium ${getTerminalStatusColor(terminal.status)}`}>
                        {terminal.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-navy-medium">Type:</span>
                      <span className="text-navy-dark capitalize">{terminal.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-medium">Today's Traffic:</span>
                      <span className="text-navy-dark">{terminal.throughputToday.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-medium">Avg Processing:</span>
                      <span className="text-navy-dark">{terminal.averageProcessingTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-navy-medium">Last Update:</span>
                      <span className="text-navy-dark">{terminal.lastUpdate.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto text-navy-medium mb-3" />
                <div className="text-2xl font-bold text-navy-dark">2,526</div>
                <div className="text-sm text-navy-medium">Crossings Today</div>
              </CardContent>
            </Card>
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto text-blue-medium mb-3" />
                <div className="text-2xl font-bold text-navy-dark">1.4s</div>
                <div className="text-sm text-navy-medium">Avg Processing Time</div>
              </CardContent>
            </Card>
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-3" />
                <div className="text-2xl font-bold text-navy-dark">12</div>
                <div className="text-sm text-navy-medium">Flags Raised</div>
              </CardContent>
            </Card>
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-green-600 mb-3" />
                <div className="text-2xl font-bold text-navy-dark">99.2%</div>
                <div className="text-sm text-navy-medium">Success Rate</div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              All border terminals are operating normally. System performance is within expected parameters.
              Real-time monitoring active across all entry points.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}