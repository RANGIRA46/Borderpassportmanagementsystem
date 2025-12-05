import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { 
  Shield, 
  Fingerprint, 
  Eye, 
  Camera, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Database,
  Scan,
  FileText,
  History,
  RefreshCw,
  Info,
  AlertCircle,
  Settings
} from "lucide-react";

interface BiometricSample {
  id: string;
  type: 'fingerprint' | 'facial' | 'iris';
  quality: number;
  confidence: number;
  captured: Date;
  device: string;
}

interface VerificationResult {
  id: string;
  status: 'verified' | 'failed' | 'partial' | 'flagged';
  confidence: number;
  matchedRecords: number;
  alerts: Array<{
    type: 'interpol' | 'watchlist' | 'duplicate' | 'expired';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  biometricMatches: Array<{
    type: string;
    confidence: number;
    recordId: string;
  }>;
  timestamp: Date;
}

interface PersonRecord {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber?: string;
  nationalId?: string;
  status: 'clear' | 'flagged' | 'wanted' | 'expired';
  lastSeen?: Date;
  alerts: number;
  biometricData: {
    fingerprints: boolean;
    facial: boolean;
    iris: boolean;
  };
}

export function IdentityVerification() {
  const [currentTab, setCurrentTab] = useState('live-verify');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [searchResults, setSearchResults] = useState<PersonRecord[]>([]);
  const [biometricSamples, setBiometricSamples] = useState<BiometricSample[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('scanner-01');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock data for demonstration
  const mockPersonRecords: PersonRecord[] = [
    {
      id: 'P001',
      firstName: 'Jean',
      lastName: 'Mukamana',
      dateOfBirth: '1985-03-15',
      nationality: 'Rwanda',
      passportNumber: 'RP1234567',
      nationalId: '1198500000000123',
      status: 'clear',
      lastSeen: new Date('2024-01-20'),
      alerts: 0,
      biometricData: { fingerprints: true, facial: true, iris: false }
    },
    {
      id: 'P002',
      firstName: 'Marie',
      lastName: 'Dubois',
      dateOfBirth: '1978-11-22',
      nationality: 'France',
      passportNumber: 'FR9876543',
      status: 'flagged',
      alerts: 3,
      biometricData: { fingerprints: true, facial: true, iris: true }
    },
    {
      id: 'P003',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      dateOfBirth: '1990-07-08',
      nationality: 'Egypt',
      passportNumber: 'EG5555444',
      status: 'wanted',
      alerts: 1,
      biometricData: { fingerprints: false, facial: true, iris: false }
    }
  ];

  const availableDevices = [
    { id: 'scanner-01', name: 'Fingerprint Scanner - Terminal 1', type: 'fingerprint', online: true },
    { id: 'camera-01', name: 'Facial Recognition Camera - Gate A', type: 'facial', online: true },
    { id: 'iris-01', name: 'Iris Scanner - VIP Lounge', type: 'iris', online: false },
    { id: 'mobile-01', name: 'Mobile Biometric Kit', type: 'multi', online: true }
  ];

  useEffect(() => {
    checkCameraPermissions();
    
    return () => {
      // Cleanup camera stream on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkCameraPermissions = async () => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setCameraPermission(permission.state === 'granted' ? 'granted' : 
                           permission.state === 'denied' ? 'denied' : 'pending');
        
        permission.onchange = () => {
          setCameraPermission(permission.state === 'granted' ? 'granted' : 
                             permission.state === 'denied' ? 'denied' : 'pending');
        };
      }
    } catch (error) {
      console.log('Permissions API not available');
    }
  };

  const requestCameraAccess = async () => {
    try {
      setCameraError(null);
      setCameraPermission('pending');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      setCameraStream(stream);
      setCameraPermission('granted');
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return true;
    } catch (error: any) {
      console.error('Camera access error:', error);
      setCameraPermission('denied');
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please enable camera permissions and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is being used by another application.');
      } else if (error.name === 'OverconstrainedError') {
        setCameraError('Camera does not support the required settings.');
      } else {
        setCameraError(`Camera error: ${error.message || 'Unknown error'}`);
      }
      
      return false;
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startLiveVerification = async () => {
    // For facial verification, request camera access first
    if (selectedDevice === 'camera-01' && !cameraStream) {
      const cameraReady = await requestCameraAccess();
      if (!cameraReady) return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setVerificationResult(null);

    // Simulate biometric capture process
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          
          // Simulate verification result
          const mockResult: VerificationResult = {
            id: `VER${Date.now()}`,
            status: Math.random() > 0.7 ? 'flagged' : 'verified',
            confidence: Math.round((Math.random() * 30 + 70) * 100) / 100,
            matchedRecords: Math.floor(Math.random() * 3),
            alerts: Math.random() > 0.8 ? [
              {
                type: 'interpol',
                message: 'Subject matches INTERPOL Red Notice database',
                severity: 'critical'
              }
            ] : [],
            biometricMatches: [
              {
                type: 'fingerprint',
                confidence: 94.5,
                recordId: 'P001'
              },
              {
                type: 'facial',
                confidence: 88.2,
                recordId: 'P001'
              }
            ],
            timestamp: new Date()
          };
          
          setVerificationResult(mockResult);
          
          // Add biometric sample
          const newSample: BiometricSample = {
            id: `BS${Date.now()}`,
            type: selectedDevice === 'camera-01' ? 'facial' : 'fingerprint',
            quality: Math.round((Math.random() * 20 + 80) * 100) / 100,
            confidence: mockResult.confidence,
            captured: new Date(),
            device: selectedDevice
          };
          
          setBiometricSamples(prev => [newSample, ...prev.slice(0, 4)]);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
  };

  const searchPersonRecords = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = mockPersonRecords.filter(person =>
      person.firstName.toLowerCase().includes(query.toLowerCase()) ||
      person.lastName.toLowerCase().includes(query.toLowerCase()) ||
      person.passportNumber?.toLowerCase().includes(query.toLowerCase()) ||
      person.nationalId?.includes(query)
    );

    setSearchResults(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      case 'wanted': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'flagged': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  useEffect(() => {
    searchPersonRecords(searchQuery);
  }, [searchQuery]);

  const renderCameraPreview = () => {
    if (selectedDevice !== 'camera-01') return null;

    if (cameraPermission === 'denied') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Camera access denied. Please enable camera permissions in your browser settings.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="ml-2"
            >
              Refresh Page
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (!cameraStream) {
      return (
        <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Camera will start when verification begins</p>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="relative bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 object-cover"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          
          {/* Verification overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-2 border-white border-dashed rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-navy-dark p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-lightest mb-2">
                Identity Verification Center
              </h1>
              <p className="text-blue-light">
                Advanced biometric verification and identity matching system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Shield className="h-3 w-3 mr-1" />
                All Systems Online
              </Badge>
              <Button variant="outline" className="border-blue-light text-blue-light">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-navy-medium">
            <TabsTrigger value="live-verify" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Scan className="h-4 w-4 mr-2" />
              Live Verification
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Search className="h-4 w-4 mr-2" />
              Database Search
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <History className="h-4 w-4 mr-2" />
              Verification History
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Camera className="h-4 w-4 mr-2" />
              Device Status
            </TabsTrigger>
          </TabsList>

          {/* Live Verification Tab */}
          <TabsContent value="live-verify" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Verification Control Panel */}
              <div className="lg:col-span-1">
                <Card className="bg-navy-medium border-blue-medium">
                  <CardHeader>
                    <CardTitle className="text-blue-lightest flex items-center">
                      <Fingerprint className="h-5 w-5 mr-2" />
                      Biometric Capture
                    </CardTitle>
                    <CardDescription className="text-blue-light">
                      Configure and initiate biometric verification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-blue-light">Capture Device</Label>
                      <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                        <SelectTrigger className="bg-navy-dark border-blue-medium text-blue-lightest">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-medium border-blue-medium">
                          {availableDevices.map((device) => (
                            <SelectItem key={device.id} value={device.id} className="text-blue-lightest">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${device.online ? 'bg-green-400' : 'bg-red-400'}`} />
                                <span>{device.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Camera Preview for facial recognition */}
                    {renderCameraPreview()}

                    <div className="space-y-2">
                      <Label className="text-blue-light">Biometric Types</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-blue-medium text-white">
                          <Fingerprint className="h-3 w-3 mr-1" />
                          Fingerprint
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-medium text-white">
                          <Camera className="h-3 w-3 mr-1" />
                          Facial
                        </Badge>
                        <Badge variant="outline" className="border-blue-light text-blue-light">
                          <Eye className="h-3 w-3 mr-1" />
                          Iris (Offline)
                        </Badge>
                      </div>
                    </div>

                    {isScanning && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-light">Scanning Progress</span>
                          <span className="text-blue-lightest">{Math.round(scanProgress)}%</span>
                        </div>
                        <Progress value={scanProgress} className="bg-navy-dark" />
                      </div>
                    )}

                    {/* Error Display */}
                    {cameraError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          {cameraError}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      onClick={startLiveVerification}
                      disabled={isScanning || (selectedDevice === 'camera-01' && cameraPermission === 'denied')}
                      className="w-full bg-blue-light hover:bg-blue-medium text-navy-dark"
                    >
                      {isScanning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Scan className="h-4 w-4 mr-2" />
                          Start Verification
                        </>
                      )}
                    </Button>

                    {selectedDevice === 'camera-01' && !cameraStream && cameraPermission !== 'denied' && (
                      <Button 
                        onClick={requestCameraAccess}
                        variant="outline"
                        className="w-full border-blue-light text-blue-light"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Enable Camera
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Biometric Samples */}
                <Card className="bg-navy-medium border-blue-medium mt-6">
                  <CardHeader>
                    <CardTitle className="text-blue-lightest">Recent Samples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {biometricSamples.length === 0 ? (
                        <p className="text-blue-light text-sm text-center py-4">
                          No samples captured yet
                        </p>
                      ) : (
                        biometricSamples.map((sample) => (
                          <div key={sample.id} className="border border-blue-medium rounded-lg p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <Fingerprint className="h-4 w-4 text-blue-light" />
                                <span className="text-blue-lightest text-sm capitalize">{sample.type}</span>
                              </div>
                              <Badge className={`text-xs ${sample.quality > 90 ? 'bg-green-600' : sample.quality > 70 ? 'bg-yellow-600' : 'bg-red-600'}`}>
                                {sample.quality}% Quality
                              </Badge>
                            </div>
                            <div className="text-xs text-blue-light">
                              {sample.captured.toLocaleTimeString()} • {sample.confidence}% Confidence
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Verification Results */}
              <div className="lg:col-span-2">
                {verificationResult ? (
                  <Card className="bg-navy-medium border-blue-medium">
                    <CardHeader>
                      <CardTitle className="text-blue-lightest flex items-center justify-between">
                        <div className="flex items-center">
                          {getVerificationStatusIcon(verificationResult.status)}
                          <span className="ml-2">Verification Result</span>
                        </div>
                        <Badge className={`${
                          verificationResult.status === 'verified' ? 'bg-green-600' :
                          verificationResult.status === 'flagged' ? 'bg-red-600' :
                          verificationResult.status === 'partial' ? 'bg-yellow-600' :
                          'bg-gray-600'
                        } text-white`}>
                          {verificationResult.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-blue-light">
                        ID: {verificationResult.id} • {verificationResult.timestamp.toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Alerts */}
                      {verificationResult.alerts.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-blue-lightest">Security Alerts</h4>
                          {verificationResult.alerts.map((alert, index) => (
                            <Alert key={index} className="border-red-500 bg-red-500/10">
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                              <AlertDescription className="text-red-200">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{alert.type.toUpperCase()} Alert</div>
                                    <div className="text-sm">{alert.message}</div>
                                  </div>
                                  <Badge className={`ml-2 ${
                                    alert.severity === 'critical' ? 'bg-red-600' :
                                    alert.severity === 'high' ? 'bg-orange-600' :
                                    alert.severity === 'medium' ? 'bg-yellow-600' :
                                    'bg-blue-600'
                                  } text-white`}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      )}

                      {/* Biometric Matches */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-blue-lightest mb-3">Biometric Matches</h4>
                          <div className="space-y-2">
                            {verificationResult.biometricMatches.map((match, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-navy-dark rounded">
                                <div className="flex items-center space-x-2">
                                  <Fingerprint className="h-4 w-4 text-blue-light" />
                                  <span className="text-blue-lightest text-sm capitalize">{match.type}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-blue-lightest text-sm font-medium">{match.confidence}%</div>
                                  <div className="text-blue-light text-xs">ID: {match.recordId}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-blue-lightest mb-3">Verification Metrics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-blue-light">Overall Confidence</span>
                              <span className="text-blue-lightest font-medium">{verificationResult.confidence}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-light">Database Matches</span>
                              <span className="text-blue-lightest font-medium">{verificationResult.matchedRecords}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-light">Processing Time</span>
                              <span className="text-blue-lightest font-medium">2.4s</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-medium">
                        <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                        <Button variant="outline" className="border-blue-light text-blue-light">
                          <Database className="h-4 w-4 mr-2" />
                          View Full Record
                        </Button>
                        <Button variant="outline" className="border-blue-light text-blue-light">
                          <History className="h-4 w-4 mr-2" />
                          Check History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-navy-medium border-blue-medium">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Scan className="h-16 w-16 text-blue-light mb-4" />
                      <h3 className="text-xl font-medium text-blue-lightest mb-2">Ready for Verification</h3>
                      <p className="text-blue-light text-center">
                        Select a biometric device and click "Start Verification" to begin identity verification process.
                      </p>
                      {selectedDevice === 'camera-01' && cameraPermission === 'denied' && (
                        <Alert className="mt-4 max-w-md">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            Camera access is required for facial recognition. Please enable camera permissions.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Database Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Database Search</CardTitle>
                <CardDescription className="text-blue-light">
                  Search person records by name, passport, or national ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by name, passport number, or national ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-navy-dark border-blue-medium text-blue-lightest"
                    />
                  </div>
                  <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div className="space-y-4">
                  {searchResults.length === 0 && searchQuery ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-blue-light mx-auto mb-3" />
                      <p className="text-blue-light">No records found matching your search criteria</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-blue-light mx-auto mb-3" />
                      <p className="text-blue-light">Enter search criteria to find person records</p>
                    </div>
                  ) : (
                    searchResults.map((person) => (
                      <Card key={person.id} className="bg-navy-dark border-blue-medium">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-blue-lightest font-medium">
                                {person.firstName} {person.lastName}
                              </h4>
                              <p className="text-blue-light text-sm">
                                {person.dateOfBirth} • {person.nationality}
                              </p>
                            </div>
                            <Badge className={getStatusColor(person.status)}>
                              {person.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-blue-light text-xs">Passport</p>
                              <p className="text-blue-lightest text-sm">{person.passportNumber || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-blue-light text-xs">National ID</p>
                              <p className="text-blue-lightest text-sm">{person.nationalId || 'N/A'}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              {person.biometricData.fingerprints && (
                                <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                                  <Fingerprint className="h-3 w-3 mr-1" />
                                  FP
                                </Badge>
                              )}
                              {person.biometricData.facial && (
                                <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                                  <Camera className="h-3 w-3 mr-1" />
                                  Face
                                </Badge>
                              )}
                              {person.biometricData.iris && (
                                <Badge variant="outline" className="border-green-500 text-green-400 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Iris
                                </Badge>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                                View Details
                              </Button>
                              <Button size="sm" className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                                Verify Identity
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Recent Verification History</CardTitle>
                <CardDescription className="text-blue-light">
                  Track all identity verification activities and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <Card key={index} className="bg-navy-dark border-blue-medium">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-3">
                            {getVerificationStatusIcon(index === 0 ? 'flagged' : index === 1 ? 'failed' : 'verified')}
                            <div>
                              <h4 className="text-blue-lightest font-medium">Verification #{`VER${Date.now() - index * 1000}`}</h4>
                              <p className="text-blue-light text-sm">
                                {new Date(Date.now() - index * 60000).toLocaleString()}
                              </p>
                              <p className="text-blue-light text-xs mt-1">
                                Device: {availableDevices[index % availableDevices.length].name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={index === 0 ? 'bg-red-600' : index === 1 ? 'bg-red-600' : 'bg-green-600'}>
                              {index === 0 ? 'FLAGGED' : index === 1 ? 'FAILED' : 'VERIFIED'}
                            </Badge>
                            <p className="text-blue-light text-sm mt-1">
                              Confidence: {Math.round((Math.random() * 30 + 70) * 100) / 100}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Device Status Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableDevices.map((device) => (
                <Card key={device.id} className="bg-navy-medium border-blue-medium">
                  <CardHeader>
                    <CardTitle className="text-blue-lightest flex items-center justify-between">
                      <div className="flex items-center">
                        <Camera className="h-5 w-5 mr-2" />
                        {device.name}
                      </div>
                      <div className={`w-3 h-3 rounded-full ${device.online ? 'bg-green-400' : 'bg-red-400'}`} />
                    </CardTitle>
                    <CardDescription className="text-blue-light">
                      Type: {device.type} • Status: {device.online ? 'Online' : 'Offline'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-light">Last Used</span>
                        <span className="text-blue-lightest">{new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-light">Success Rate</span>
                        <span className="text-blue-lightest">{Math.round((Math.random() * 10 + 90) * 100) / 100}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-light">Total Scans Today</span>
                        <span className="text-blue-lightest">{Math.floor(Math.random() * 100 + 50)}</span>
                      </div>
                      <Button 
                        className="w-full bg-blue-light hover:bg-blue-medium text-navy-dark"
                        disabled={!device.online}
                      >
                        {device.online ? 'Run Diagnostics' : 'Device Offline'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}