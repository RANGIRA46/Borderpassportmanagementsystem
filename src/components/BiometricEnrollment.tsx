import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BiometricCapture } from "./BiometricCapture";
import { CameraCapture } from "./utils/CameraManager";
import { 
  Camera, 
  Fingerprint, 
  Eye, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Upload, 
  Download, 
  RefreshCw,
  Settings,
  Shield,
  Clock,
  Users,
  Activity,
  Info,
  AlertCircle
} from "lucide-react";

interface BiometricData {
  id: string;
  type: 'fingerprint' | 'facial' | 'iris';
  quality: number;
  timestamp: Date;
  imageData?: string;
  features?: string;
}

interface EnrollmentSession {
  id: string;
  applicantId: string;
  applicantName: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  biometrics: BiometricData[];
  startTime: Date;
  completedTime?: Date;
  officer: string;
}

export function BiometricEnrollment() {
  const [currentTab, setCurrentTab] = useState('enrollment');
  const [sessions, setSessions] = useState<EnrollmentSession[]>([]);
  const [currentSession, setCurrentSession] = useState<EnrollmentSession | null>(null);
  const [enrollmentStep, setEnrollmentStep] = useState(0);
  const [biometricData, setBiometricData] = useState<BiometricData[]>([]);
  const [applicantName, setApplicantName] = useState('');
  const [applicationRef, setApplicationRef] = useState('');

  // Enrollment steps
  const enrollmentSteps = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'facial', label: 'Facial Scan', icon: Camera },
    { id: 'fingerprint', label: 'Fingerprints', icon: Fingerprint },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ];

  // Mock sessions data
  const mockSessions: EnrollmentSession[] = [
    {
      id: 'ES001',
      applicantId: 'APP123',
      applicantName: 'John Doe',
      status: 'completed',
      biometrics: [
        {
          id: 'BIO001',
          type: 'facial',
          quality: 95,
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: 'BIO002',
          type: 'fingerprint',
          quality: 92,
          timestamp: new Date(Date.now() - 240000)
        }
      ],
      startTime: new Date(Date.now() - 600000),
      completedTime: new Date(Date.now() - 180000),
      officer: 'Officer Smith'
    },
    {
      id: 'ES002',
      applicantId: 'APP124',
      applicantName: 'Jane Smith',
      status: 'in-progress',
      biometrics: [
        {
          id: 'BIO003',
          type: 'facial',
          quality: 88,
          timestamp: new Date(Date.now() - 120000)
        }
      ],
      startTime: new Date(Date.now() - 300000),
      officer: 'Officer Johnson'
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
  }, []);

  const startNewSession = () => {
    const newSession: EnrollmentSession = {
      id: `ES${Date.now()}`,
      applicantId: `APP${Date.now()}`,
      applicantName: applicantName || 'New Applicant',
      status: 'pending',
      biometrics: [],
      startTime: new Date(),
      officer: 'Current Officer'
    };
    
    setCurrentSession(newSession);
    setEnrollmentStep(0);
    setBiometricData([]);
    setCurrentTab('enrollment');
  };

  const handleBiometricCapture = (capture: CameraCapture, type: 'facial' | 'fingerprint' | 'iris') => {
    const newBiometric: BiometricData = {
      id: `BIO${Date.now()}`,
      type,
      quality: capture.quality,
      timestamp: capture.timestamp,
      imageData: capture.imageData
    };

    setBiometricData(prev => [...prev, newBiometric]);
  };

  const completeEnrollment = () => {
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        status: 'completed' as const,
        completedTime: new Date(),
        biometrics: biometricData
      };
      
      setSessions(prev => [...prev, completedSession]);
      setCurrentSession(null);
      setBiometricData([]);
      setEnrollmentStep(0);
      setApplicantName('');
      setApplicationRef('');
    }
  };

  const getStepIcon = (stepIndex: number) => {
    const IconComponent = enrollmentSteps[stepIndex].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  const canProceedToNext = () => {
    switch (enrollmentStep) {
      case 0: return applicantName.trim().length > 0;
      case 1: return biometricData.some(b => b.type === 'facial');
      case 2: return biometricData.some(b => b.type === 'fingerprint');
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Biometric Enrollment Center
              </h1>
              <p className="text-gray-600">
                Secure biometric data capture and enrollment system
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Secure Environment
              </Badge>
              <Button onClick={startNewSession}>
                <User className="h-4 w-4 mr-2" />
                New Enrollment
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="enrollment">
              <User className="h-4 w-4 mr-2" />
              Active Enrollment
            </TabsTrigger>
            <TabsTrigger value="sessions">
              <Clock className="h-4 w-4 mr-2" />
              Session History
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Active Enrollment Tab */}
          <TabsContent value="enrollment" className="space-y-6">
            {currentSession ? (
              <div className="space-y-6">
                {/* Progress Steps */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {enrollmentSteps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            index <= enrollmentStep 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {getStepIcon(index)}
                          </div>
                          <div className="ml-2 hidden sm:block">
                            <div className={`text-sm font-medium ${
                              index <= enrollmentStep ? 'text-blue-600' : 'text-gray-500'
                            }`}>
                              {step.label}
                            </div>
                          </div>
                          {index < enrollmentSteps.length - 1 && (
                            <div className={`w-8 h-0.5 mx-4 ${
                              index < enrollmentStep ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enrollment Content */}
                {enrollmentStep === 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Applicant Information</CardTitle>
                      <CardDescription>
                        Enter the basic information for this enrollment session
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Applicant Name *</Label>
                          <Input 
                            placeholder="Enter full name" 
                            value={applicantName}
                            onChange={(e) => setApplicantName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Application Reference</Label>
                          <Input 
                            placeholder="e.g., PA2024001234" 
                            value={applicationRef}
                            onChange={(e) => setApplicationRef(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Ensure all applicant information is accurate before proceeding to biometric capture.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-end">
                        <Button 
                          onClick={() => setEnrollmentStep(1)}
                          disabled={!canProceedToNext()}
                        >
                          Continue to Biometric Capture
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {enrollmentStep === 1 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-2">Facial Recognition Capture</h2>
                      <p className="text-gray-600">Capture facial biometric data for identity verification</p>
                    </div>
                    
                    <BiometricCapture 
                      captureType="facial"
                      onCapture={(capture) => handleBiometricCapture(capture, 'facial')}
                      required
                    />

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setEnrollmentStep(0)}>
                        Back
                      </Button>
                      <Button 
                        onClick={() => setEnrollmentStep(2)}
                        disabled={!canProceedToNext()}
                      >
                        Continue to Fingerprints
                      </Button>
                    </div>
                  </div>
                )}

                {enrollmentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-2">Fingerprint Capture</h2>
                      <p className="text-gray-600">Capture fingerprint biometric data</p>
                    </div>
                    
                    <BiometricCapture 
                      captureType="fingerprint"
                      onCapture={(capture) => handleBiometricCapture(capture, 'fingerprint')}
                      required
                    />

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setEnrollmentStep(1)}>
                        Back
                      </Button>
                      <Button 
                        onClick={() => setEnrollmentStep(3)}
                        disabled={!canProceedToNext()}
                      >
                        Continue to Review
                      </Button>
                    </div>
                  </div>
                )}

                {enrollmentStep === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Review & Complete</CardTitle>
                      <CardDescription>
                        Review all captured data before finalizing the enrollment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Enrollment Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div><strong>Applicant:</strong> {currentSession.applicantName}</div>
                            <div><strong>Application Ref:</strong> {applicationRef || 'N/A'}</div>
                            <div><strong>Started:</strong> {currentSession.startTime.toLocaleString()}</div>
                            <div><strong>Officer:</strong> {currentSession.officer}</div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Captured Biometric Data</h4>
                          <div className="space-y-2">
                            {biometricData.map((data) => (
                              <div key={data.id} className="flex justify-between items-center text-sm">
                                <span className="capitalize flex items-center">
                                  {data.type === 'facial' && <Camera className="h-4 w-4 mr-2" />}
                                  {data.type === 'fingerprint' && <Fingerprint className="h-4 w-4 mr-2" />}
                                  {data.type === 'iris' && <Eye className="h-4 w-4 mr-2" />}
                                  {data.type}
                                </span>
                                <Badge variant={data.quality > 85 ? "default" : "secondary"}>
                                  {data.quality}% Quality
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {biometricData.length === 0 && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            No biometric data captured. Please go back and complete the required captures.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setEnrollmentStep(2)}>
                          Back
                        </Button>
                        <Button 
                          onClick={completeEnrollment} 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={biometricData.length === 0}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Complete Enrollment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Active Enrollment</h3>
                  <p className="text-gray-600 mb-6">Start a new biometric enrollment session</p>
                  <Button onClick={startNewSession}>
                    <User className="h-4 w-4 mr-2" />
                    Start New Enrollment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Session History Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Enrollment Sessions</CardTitle>
                <CardDescription>
                  History of all biometric enrollment sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{session.applicantName}</h4>
                          <p className="text-sm text-gray-600">ID: {session.applicantId}</p>
                        </div>
                        <Badge variant={
                          session.status === 'completed' ? 'default' :
                          session.status === 'in-progress' ? 'secondary' :
                          session.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Started:</span>
                          <div>{session.startTime.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Officer:</span>
                          <div>{session.officer}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Biometrics:</span>
                          <div>{session.biometrics.length} captured</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div>
                            {session.completedTime 
                              ? `${Math.round((session.completedTime.getTime() - session.startTime.getTime()) / 60000)} min`
                              : 'In progress'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-600">{sessions.length}</div>
                  <div className="text-sm text-gray-600">Total Sessions</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sessions.filter(s => s.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {sessions.reduce((sum, s) => sum + s.biometrics.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Biometrics Captured</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Camera System</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fingerprint Scanner</span>
                    <Badge className="bg-green-100 text-green-800">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database Connection</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Backup System</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Standby</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}