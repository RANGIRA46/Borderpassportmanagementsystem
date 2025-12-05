import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useTranslation } from "./utils/LanguageSelector";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  Brain,
  Target,
  Database,
  Users,
  Clock,
  Globe,
  FileText,
  Search,
  Download,
  RefreshCw,
  BarChart3,
  Zap
} from "lucide-react";

interface RiskFactor {
  id: string;
  category: 'travel' | 'document' | 'biometric' | 'behavioral' | 'historical';
  factor: string;
  weight: number;
  score: number;
  status: 'normal' | 'elevated' | 'high' | 'critical';
  description: string;
}

interface TravelerRiskProfile {
  id: string;
  travelerId: string;
  travelerName: string;
  passportNumber: string;
  nationality: string;
  overallRiskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  recommendations: string[];
  lastAssessment: string;
  assessmentVersion: string;
  confidence: number;
}

interface RiskModel {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastTrained: string;
  status: 'active' | 'training' | 'deprecated';
  parameters: Record<string, number>;
}

export function RiskAssessment() {
  const { t } = useTranslation();
  const [riskProfiles, setRiskProfiles] = useState<TravelerRiskProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<TravelerRiskProfile | null>(null);
  const [riskModels, setRiskModels] = useState<RiskModel[]>([]);
  const [activeTab, setActiveTab] = useState('assessment');
  const [searchTerm, setSearchTerm] = useState('');
  const [assessmentProgress, setAssessmentProgress] = useState(0);

  // Mock risk assessment data
  const mockRiskProfiles: TravelerRiskProfile[] = [
    {
      id: "RISK001",
      travelerId: "TRV001",
      travelerName: "Jean Mukamana",
      passportNumber: "PA1234567",
      nationality: "RW",
      overallRiskScore: 15,
      riskLevel: "low",
      confidence: 95,
      lastAssessment: "2024-10-06T17:15:00Z",
      assessmentVersion: "v2.1",
      riskFactors: [
        {
          id: "RF001",
          category: "travel",
          factor: "Frequent Travel Pattern",
          weight: 0.2,
          score: 10,
          status: "normal",
          description: "Regular business travel pattern consistent with profession"
        },
        {
          id: "RF002",
          category: "document",
          factor: "Document Authenticity",
          weight: 0.3,
          score: 5,
          status: "normal",
          description: "All travel documents verified authentic"
        }
      ],
      recommendations: [
        "Standard processing",
        "Routine document check"
      ]
    },
    {
      id: "RISK002",
      travelerId: "TRV002",
      travelerName: "Ahmed Hassan",
      passportNumber: "EG9876543",
      nationality: "EG",
      overallRiskScore: 65,
      riskLevel: "medium",
      confidence: 87,
      lastAssessment: "2024-10-06T17:10:00Z",
      assessmentVersion: "v2.1",
      riskFactors: [
        {
          id: "RF003",
          category: "travel",
          factor: "Unusual Travel Route",
          weight: 0.25,
          score: 70,
          status: "elevated",
          description: "Traveled through high-risk transit country"
        },
        {
          id: "RF004",
          category: "historical",
          factor: "Previous Violations",
          weight: 0.15,
          score: 60,
          status: "elevated",
          description: "Minor visa overstay 3 years ago"
        }
      ],
      recommendations: [
        "Enhanced screening",
        "Additional document verification",
        "Secondary interview if flagged"
      ]
    },
    {
      id: "RISK003",
      travelerId: "TRV003",
      travelerName: "Maria Santos",
      passportNumber: "BR5555666",
      nationality: "BR",
      overallRiskScore: 85,
      riskLevel: "high",
      confidence: 92,
      lastAssessment: "2024-10-06T20:45:00Z",
      assessmentVersion: "v2.1",
      riskFactors: [
        {
          id: "RF005",
          category: "behavioral",
          factor: "Suspicious Behavior Pattern",
          weight: 0.35,
          score: 90,
          status: "high",
          description: "Nervous behavior, inconsistent statements"
        },
        {
          id: "RF006",
          category: "document",
          factor: "Document Discrepancies",
          weight: 0.25,
          score: 80,
          status: "high",
          description: "Minor inconsistencies in travel documentation"
        }
      ],
      recommendations: [
        "Mandatory secondary inspection",
        "Supervisor approval required",
        "INTERPOL database check",
        "Enhanced biometric verification"
      ]
    }
  ];

  const mockRiskModels: RiskModel[] = [
    {
      id: "MODEL001",
      name: "Advanced Threat Detection",
      version: "v2.1",
      accuracy: 94.7,
      lastTrained: "2024-09-15",
      status: "active",
      parameters: {
        "travel_pattern_weight": 0.25,
        "document_authenticity_weight": 0.30,
        "biometric_confidence_weight": 0.20,
        "behavioral_analysis_weight": 0.15,
        "historical_violations_weight": 0.10
      }
    },
    {
      id: "MODEL002",
      name: "ML Behavioral Analysis",
      version: "v1.8",
      accuracy: 89.2,
      lastTrained: "2024-08-30",
      status: "training",
      parameters: {
        "speech_pattern_weight": 0.20,
        "facial_micro_expressions": 0.25,
        "body_language_indicators": 0.30,
        "stress_markers": 0.25
      }
    }
  ];

  useEffect(() => {
    setRiskProfiles(mockRiskProfiles);
    setRiskModels(mockRiskModels);
    
    // Simulate real-time assessment progress
    const timer = setInterval(() => {
      setAssessmentProgress(prev => (prev >= 100 ? 0 : prev + 8));
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getFactorStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'elevated': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      case 'critical': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'travel': return <Globe className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'biometric': return <Eye className="h-4 w-4" />;
      case 'behavioral': return <Brain className="h-4 w-4" />;
      case 'historical': return <Clock className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-navy-medium" />
            {t('riskAssessment.title', 'Risk Assessment & Analytics')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('riskAssessment.subtitle', 'AI-powered threat detection and passenger risk analysis')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            {t('riskAssessment.aiPowered', 'AI Powered')}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {t('riskAssessment.realTime', 'Real-time')}
          </Badge>
        </div>
      </div>

      {/* Real-time Assessment Progress */}
      <Alert>
        <RefreshCw className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span>{t('riskAssessment.liveAssessment', 'Live Risk Assessment in Progress')}</span>
            <Badge variant="secondary">{assessmentProgress}%</Badge>
          </div>
          <Progress value={assessmentProgress} className="mt-2" />
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assessment">{t('riskAssessment.assessment', 'Assessment')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('riskAssessment.analytics', 'Analytics')}</TabsTrigger>
          <TabsTrigger value="models">{t('riskAssessment.models', 'Models')}</TabsTrigger>
          <TabsTrigger value="reports">{t('riskAssessment.reports', 'Reports')}</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Profiles List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t('riskAssessment.riskProfiles', 'Risk Profiles')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('riskAssessment.searchProfiles', 'Search profiles...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {riskProfiles
                    .filter(profile => 
                      profile.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      profile.passportNumber.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((profile) => (
                    <div
                      key={profile.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedProfile?.id === profile.id ? 'border-navy-medium bg-blue-lightest' : 'hover:border-blue-light'
                      }`}
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{profile.travelerName}</p>
                          <p className="text-xs text-muted-foreground">{profile.passportNumber}</p>
                        </div>
                        <Badge variant={getRiskBadgeColor(profile.riskLevel)} className="text-xs">
                          {profile.riskLevel}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Risk Score</span>
                          <span className={getRiskLevelColor(profile.riskLevel)}>
                            {profile.overallRiskScore}/100
                          </span>
                        </div>
                        <Progress value={profile.overallRiskScore} className="h-1" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Confidence: {profile.confidence}%</span>
                          <span>{profile.assessmentVersion}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Detailed Risk Analysis */}
            <div className="lg:col-span-2">
              {selectedProfile ? (
                <div className="space-y-4">
                  {/* Profile Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{selectedProfile.travelerName}</span>
                        <Badge variant={getRiskBadgeColor(selectedProfile.riskLevel)} className="text-lg px-3 py-1">
                          {selectedProfile.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{t('riskAssessment.passportNumber', 'Passport Number')}</Label>
                          <Input value={selectedProfile.passportNumber} readOnly />
                        </div>
                        <div>
                          <Label>{t('riskAssessment.nationality', 'Nationality')}</Label>
                          <Input value={selectedProfile.nationality} readOnly />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className={`text-2xl font-bold ${getRiskLevelColor(selectedProfile.riskLevel)}`}>
                            {selectedProfile.overallRiskScore}
                          </p>
                          <p className="text-sm text-muted-foreground">{t('riskAssessment.riskScore', 'Risk Score')}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-2xl font-bold text-blue-600">{selectedProfile.confidence}%</p>
                          <p className="text-sm text-muted-foreground">{t('riskAssessment.confidence', 'Confidence')}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-2xl font-bold text-gray-600">{selectedProfile.riskFactors.length}</p>
                          <p className="text-sm text-muted-foreground">{t('riskAssessment.factors', 'Factors')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Risk Factors */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {t('riskAssessment.riskFactors', 'Risk Factors Analysis')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedProfile.riskFactors.map((factor) => (
                        <div key={factor.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(factor.category)}
                              <span className="font-medium">{factor.factor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {factor.category}
                              </Badge>
                              <Badge variant={factor.status === 'normal' ? 'default' : 'destructive'} className="text-xs">
                                {factor.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Factor Score</span>
                              <span className={getFactorStatusColor(factor.status)}>
                                {factor.score}/100
                              </span>
                            </div>
                            <Progress value={factor.score} className="h-2" />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Weight in Model: {(factor.weight * 100).toFixed(0)}%</span>
                              <span>Contribution: {(factor.weight * factor.score).toFixed(1)} points</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {t('riskAssessment.recommendations', 'Security Recommendations')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedProfile.recommendations.map((recommendation, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                            <AlertTriangle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button>
                          <Shield className="h-4 w-4 mr-2" />
                          {t('riskAssessment.implementRecommendations', 'Implement Recommendations')}
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          {t('riskAssessment.exportReport', 'Export Report')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('riskAssessment.selectProfile', 'Select a Risk Profile')}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {t('riskAssessment.selectProfileDesc', 'Choose a traveler from the left panel to view detailed risk analysis and security recommendations.')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('riskAssessment.totalAssessments', 'Total Assessments')}</p>
                    <p className="text-2xl font-bold">1,247</p>
                  </div>
                  <Users className="h-8 w-8 text-navy-medium" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('riskAssessment.highRisk', 'High Risk Detected')}</p>
                    <p className="text-2xl font-bold text-red-600">23</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('riskAssessment.avgAccuracy', 'Model Accuracy')}</p>
                    <p className="text-2xl font-bold text-green-600">94.7%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('riskAssessment.avgProcessingTime', 'Avg Processing')}</p>
                    <p className="text-2xl font-bold">1.2s</p>
                  </div>
                  <Clock className="h-8 w-8 text-navy-medium" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {t('riskAssessment.mlModels', 'Machine Learning Models')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskModels.map((model) => (
                  <div key={model.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{model.name}</h4>
                        <p className="text-sm text-muted-foreground">{model.version}</p>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('riskAssessment.accuracy', 'Accuracy')}</Label>
                        <p className="text-green-600 font-medium">{model.accuracy}%</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('riskAssessment.lastTrained', 'Last Trained')}</Label>
                        <p>{new Date(model.lastTrained).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('riskAssessment.parameters', 'Parameters')}</Label>
                        <p>{Object.keys(model.parameters).length}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        {t('riskAssessment.viewDetails', 'View Details')}
                      </Button>
                      {model.status === 'active' && (
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-3 w-3 mr-1" />
                          {t('riskAssessment.retrain', 'Retrain')}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('riskAssessment.riskReports', 'Risk Assessment Reports')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-24 flex-col">
                  <Download className="h-6 w-6 mb-2" />
                  {t('riskAssessment.dailyReport', 'Daily Risk Report')}
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  {t('riskAssessment.analyticsReport', 'Analytics Report')}
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  {t('riskAssessment.trendAnalysis', 'Trend Analysis')}
                </Button>
                <Button variant="outline" className="h-24 flex-col">
                  <Shield className="h-6 w-6 mb-2" />
                  {t('riskAssessment.securitySummary', 'Security Summary')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}