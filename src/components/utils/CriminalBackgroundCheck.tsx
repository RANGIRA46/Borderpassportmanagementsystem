import { useState, useEffect } from "react";
import { Shield, AlertTriangle, CheckCircle, XCircle, Database, Eye, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface CriminalRecord {
  id: string;
  type: "conviction" | "charge" | "warrant" | "alert";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  date: string;
  location: string;
  status: "active" | "resolved" | "pending";
  jurisdiction: string;
  caseNumber?: string;
  agency: string;
}

interface WatchlistMatch {
  id: string;
  source: "interpol" | "local" | "regional" | "immigration";
  type: "wanted" | "monitoring" | "restricted" | "alert";
  reason: string;
  priority: "low" | "medium" | "high" | "urgent";
  dateAdded: string;
  lastUpdated: string;
  jurisdiction: string;
  contactAgency: string;
}

interface BackgroundCheckResult {
  status: "clear" | "flagged" | "restricted" | "denied";
  riskLevel: "low" | "medium" | "high" | "critical";
  criminalRecords: CriminalRecord[];
  watchlistMatches: WatchlistMatch[];
  verificationSources: string[];
  lastChecked: string;
  checkDuration: number;
  confidence: number;
}

interface CriminalBackgroundCheckProps {
  documentNumber: string;
  documentType: string;
  nationality: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  onResultsReady: (results: BackgroundCheckResult) => void;
  autoCheck?: boolean;
  className?: string;
}

export function CriminalBackgroundCheck({
  documentNumber,
  documentType,
  nationality,
  firstName,
  lastName,
  dateOfBirth,
  onResultsReady,
  autoCheck = false,
  className = ""
}: CriminalBackgroundCheckProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [checkProgress, setCheckProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [results, setResults] = useState<BackgroundCheckResult | null>(null);
  const [alertsSent, setAlertsSent] = useState<string[]>([]);

  // Check steps for progress indicator
  const checkSteps = [
    { step: "local", name: "Local Database", duration: 1000 },
    { step: "national", name: "National Records", duration: 1500 },
    { step: "regional", name: "Regional Systems", duration: 2000 },
    { step: "interpol", name: "INTERPOL Database", duration: 2500 },
    { step: "watchlist", name: "Watchlist Verification", duration: 1000 },
    { step: "crossref", name: "Cross-Reference Check", duration: 1500 }
  ];

  // Simulate comprehensive background check
  const performBackgroundCheck = async (): Promise<BackgroundCheckResult> => {
    const startTime = Date.now();
    let progress = 0;

    for (const { step, name, duration } of checkSteps) {
      setCurrentStep(name);
      
      // Simulate step processing
      const stepStart = Date.now();
      while (Date.now() - stepStart < duration) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const stepProgress = Math.min(100, ((Date.now() - stepStart) / duration) * 100);
        const totalStepProgress = (checkSteps.findIndex(s => s.step === step) + stepProgress / 100) / checkSteps.length * 100;
        setCheckProgress(totalStepProgress);
      }
      
      progress += 100 / checkSteps.length;
    }

    // Generate mock results based on document details
    const mockResults = generateMockResults(documentNumber, nationality, firstName, lastName);
    const checkDuration = Date.now() - startTime;

    return {
      ...mockResults,
      checkDuration,
      lastChecked: new Date().toISOString()
    };
  };

  // Generate realistic mock results
  const generateMockResults = (docNum: string, nat: string, fName: string, lName: string): Omit<BackgroundCheckResult, 'checkDuration' | 'lastChecked'> => {
    // Simulate different scenarios based on document number
    const riskIndicator = parseInt(docNum.slice(-2)) || 0;
    
    if (riskIndicator > 85) {
      // High risk scenario
      return {
        status: "restricted",
        riskLevel: "critical",
        criminalRecords: [
          {
            id: "CR001",
            type: "conviction",
            severity: "high",
            description: "Fraud and financial crimes",
            date: "2019-03-15",
            location: "Dar es Salaam, Tanzania",
            status: "active",
            jurisdiction: "Tanzania",
            caseNumber: "TC-2019-001234",
            agency: "Tanzania Police Force"
          }
        ],
        watchlistMatches: [
          {
            id: "WL001",
            source: "interpol",
            type: "wanted",
            reason: "International fraud investigation",
            priority: "high",
            dateAdded: "2020-01-10",
            lastUpdated: "2024-10-01",
            jurisdiction: "International",
            contactAgency: "INTERPOL NCB"
          }
        ],
        verificationSources: ["Tanzania Police", "INTERPOL", "EAC Immigration", "Regional Courts"],
        confidence: 0.95
      };
    } else if (riskIndicator > 70) {
      // Medium risk scenario
      return {
        status: "flagged",
        riskLevel: "medium",
        criminalRecords: [
          {
            id: "CR002",
            type: "charge",
            severity: "medium",
            description: "Traffic violations",
            date: "2022-08-20",
            location: "Nairobi, Kenya",
            status: "resolved",
            jurisdiction: "Kenya",
            agency: "Kenya Police Service"
          }
        ],
        watchlistMatches: [],
        verificationSources: ["Kenya Police", "EAC Immigration", "Local Courts"],
        confidence: 0.88
      };
    } else if (riskIndicator > 50) {
      // Low risk scenario
      return {
        status: "flagged",
        riskLevel: "low",
        criminalRecords: [],
        watchlistMatches: [
          {
            id: "WL002",
            source: "local",
            type: "monitoring",
            reason: "Routine immigration monitoring",
            priority: "low",
            dateAdded: "2023-06-15",
            lastUpdated: "2024-09-15",
            jurisdiction: "Tanzania",
            contactAgency: "Immigration Services"
          }
        ],
        verificationSources: ["Tanzania Immigration", "Local Records"],
        confidence: 0.82
      };
    } else {
      // Clear scenario
      return {
        status: "clear",
        riskLevel: "low",
        criminalRecords: [],
        watchlistMatches: [],
        verificationSources: ["Tanzania Police", "Immigration Services", "Regional Database"],
        confidence: 0.92
      };
    }
  };

  // Send alerts to relevant agencies
  const sendAlertsToAgencies = async (results: BackgroundCheckResult) => {
    const alertsToSend: string[] = [];

    if (results.riskLevel === "critical" || results.riskLevel === "high") {
      alertsToSend.push("Border Control");
      alertsToSend.push("Immigration Services");
      alertsToSend.push("National Security");
    }

    if (results.watchlistMatches.some(w => w.source === "interpol")) {
      alertsToSend.push("INTERPOL NCB");
    }

    if (results.criminalRecords.some(r => r.status === "active")) {
      alertsToSend.push("Law Enforcement");
    }

    // Simulate sending alerts
    for (const agency of alertsToSend) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAlertsSent(prev => [...prev, agency]);
    }
  };

  const handleBackgroundCheck = async () => {
    setIsChecking(true);
    setCheckProgress(0);
    setResults(null);
    setAlertsSent([]);

    try {
      const checkResults = await performBackgroundCheck();
      setResults(checkResults);
      onResultsReady(checkResults);

      // Send alerts if necessary
      if (checkResults.riskLevel !== "low") {
        await sendAlertsToAgencies(checkResults);
      }
    } catch (error) {
      console.error("Background check failed:", error);
    } finally {
      setIsChecking(false);
      setCurrentStep("");
      setCheckProgress(100);
    }
  };

  // Auto-check when component mounts if enabled
  useEffect(() => {
    if (autoCheck && documentNumber && firstName && lastName) {
      handleBackgroundCheck();
    }
  }, [autoCheck, documentNumber, firstName, lastName]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clear": return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "flagged": return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "restricted": return <XCircle className="h-5 w-5 text-orange-600" />;
      case "denied": return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Criminal Background Check
        </CardTitle>
        <CardDescription>
          Comprehensive security screening across local, regional, and international databases
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!autoCheck && !isChecking && !results && (
          <div className="text-center py-6">
            <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Click to perform comprehensive background verification
            </p>
            <Button onClick={handleBackgroundCheck}>
              <Database className="mr-2 h-4 w-4" />
              Run Background Check
            </Button>
          </div>
        )}

        {isChecking && (
          <div className="space-y-4">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 animate-pulse text-primary" />
              <h4 className="font-medium">Running Security Check</h4>
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>
            
            <Progress value={checkProgress} className="w-full" />
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              {checkSteps.map((step, index) => (
                <div 
                  key={step.step}
                  className={`p-2 rounded flex items-center gap-2 ${
                    checkProgress > (index / checkSteps.length * 100) 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  {checkProgress > (index / checkSteps.length * 100) ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {step.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <Alert className={getRiskColor(results.riskLevel)}>
              {getStatusIcon(results.status)}
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Status: {results.status.toUpperCase()}</strong>
                    <p className="text-sm mt-1">
                      Risk Level: {results.riskLevel.toUpperCase()} | 
                      Confidence: {Math.round(results.confidence * 100)}%
                    </p>
                  </div>
                  <Badge variant="outline" className={getRiskColor(results.riskLevel)}>
                    {results.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="criminal">Criminal Records</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-medium">Check Details</h5>
                    <div className="text-sm space-y-1">
                      <p>Duration: {results.checkDuration}ms</p>
                      <p>Sources: {results.verificationSources.length}</p>
                      <p>Last Updated: {new Date(results.lastChecked).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">Risk Assessment</h5>
                    <div className="text-sm space-y-1">
                      <p>Criminal Records: {results.criminalRecords.length}</p>
                      <p>Watchlist Matches: {results.watchlistMatches.length}</p>
                      <p>Active Issues: {results.criminalRecords.filter(r => r.status === "active").length}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="criminal" className="space-y-3">
                {results.criminalRecords.length > 0 ? (
                  results.criminalRecords.map((record) => (
                    <Card key={record.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={record.severity === "high" ? "destructive" : "secondary"}>
                              {record.type}
                            </Badge>
                            <Badge variant="outline">{record.severity}</Badge>
                          </div>
                          <p className="font-medium">{record.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {record.location} • {new Date(record.date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {record.agency} • Case: {record.caseNumber}
                          </p>
                        </div>
                        <Badge variant={record.status === "active" ? "destructive" : "secondary"}>
                          {record.status}
                        </Badge>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No criminal records found</p>
                )}
              </TabsContent>

              <TabsContent value="watchlist" className="space-y-3">
                {results.watchlistMatches.length > 0 ? (
                  results.watchlistMatches.map((match) => (
                    <Card key={match.id} className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={match.priority === "urgent" ? "destructive" : "secondary"}>
                              {match.source.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{match.type}</Badge>
                          </div>
                          <p className="font-medium">{match.reason}</p>
                          <p className="text-sm text-muted-foreground">
                            Added: {new Date(match.dateAdded).toLocaleDateString()} • 
                            Updated: {new Date(match.lastUpdated).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contact: {match.contactAgency}
                          </p>
                        </div>
                        <Badge variant={match.priority === "urgent" ? "destructive" : "secondary"}>
                          {match.priority}
                        </Badge>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No watchlist matches found</p>
                )}
              </TabsContent>

              <TabsContent value="alerts" className="space-y-3">
                {alertsSent.length > 0 ? (
                  <div className="space-y-2">
                    <h5 className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Agencies Notified ({alertsSent.length})
                    </h5>
                    {alertsSent.map((agency, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{agency}</span>
                        <Badge variant="outline" className="ml-auto">Notified</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No alerts required for this check
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { CriminalRecord, WatchlistMatch, BackgroundCheckResult };