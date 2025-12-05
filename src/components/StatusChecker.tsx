import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

export function StatusChecker() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [applicationData, setApplicationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusCheck = async () => {
    if (!referenceNumber.trim()) {
      alert('Please enter a reference number');
      return;
    }

    setIsLoading(true);
    
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ee81f4f/applications/status/${referenceNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        // Transform backend data to match component expectations
        const transformedData = {
          referenceNumber: result.application.referenceNumber,
          applicantName: result.application.formData?.fullName || 'N/A',
          applicationType: getApplicationTypeLabel(result.application.type),
          submissionDate: new Date(result.application.submittedAt).toLocaleDateString(),
          currentStatus: formatStatus(result.application.status),
          estimatedCompletion: getEstimatedCompletion(result.application.type, result.application.submittedAt),
          isEmergency: result.application.isEmergency,
          stages: generateStages(result.application.type, result.application.status, result.application.statusHistory),
          documents: generateDocumentStatus(result.application.type),
          statusHistory: result.application.statusHistory
        };
        
        setApplicationData(transformedData);
      } else {
        if (response.status === 404) {
          alert('Application not found. Please check your reference number and try again.');
        } else {
          throw new Error(result.error || 'Failed to fetch application status');
        }
        setApplicationData(null);
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      alert('There was an error checking your application status. Please try again.');
      setApplicationData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getApplicationTypeLabel = (type: string) => {
    const typeLabels = {
      'passport': 'Passport Application',
      'visa': 'Visa Application',
      'permit': 'Permit Application',
      'citizenship': 'Citizenship Application',
      'laissez-passer': 'Emergency Travel Document',
      'refugee': 'Refugee Services',
      'diaspora': 'Diaspora Services'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getEstimatedCompletion = (type: string, submittedAt: string) => {
    const processingDays = {
      'passport': 15,
      'visa': 10,
      'permit': 15,
      'citizenship': 180,
      'laissez-passer': 5,
      'refugee': 30,
      'diaspora': 7
    };
    
    const days = processingDays[type as keyof typeof processingDays] || 10;
    const completionDate = new Date(submittedAt);
    completionDate.setDate(completionDate.getDate() + days);
    return completionDate.toLocaleDateString();
  };

  const generateStages = (type: string, currentStatus: string, statusHistory: any[]) => {
    const allStages = {
      'passport': [
        'Application Submitted',
        'Document Verification',
        'Background Check',
        'Production',
        'Quality Control',
        'Ready for Collection'
      ],
      'visa': [
        'Application Submitted',
        'Document Review',
        'Background Verification',
        'Decision',
        'Visa Issuance'
      ],
      'permit': [
        'Application Submitted',
        'Document Verification',
        'Eligibility Check',
        'Background Check',
        'Decision',
        'Permit Issuance'
      ],
      'citizenship': [
        'Application Submitted',
        'Document Review',
        'Background Check',
        'Interview Scheduled',
        'Decision Review',
        'Certificate Issuance'
      ],
      'laissez-passer': [
        'Application Submitted',
        'Emergency Verification',
        'Document Production',
        'Ready for Collection'
      ],
      'refugee': [
        'Request Submitted',
        'Case Assignment',
        'Interview Scheduled',
        'Status Determination',
        'Services Provision'
      ],
      'diaspora': [
        'Request Submitted',
        'Team Assignment',
        'Processing',
        'Response Provided'
      ]
    };

    const stages = allStages[type as keyof typeof allStages] || allStages.passport;
    const statusMap = {
      'submitted': 0,
      'under_review': 1,
      'pending_documents': 1,
      'approved': stages.length - 1,
      'rejected': 1,
      'completed': stages.length - 1
    };

    const currentStageIndex = statusMap[currentStatus as keyof typeof statusMap] || 0;

    return stages.map((stageName, index) => ({
      name: stageName,
      status: index <= currentStageIndex ? 'completed' : 
              index === currentStageIndex + 1 ? 'in-progress' : 'pending',
      date: index <= currentStageIndex ? 
            statusHistory[Math.min(index, statusHistory.length - 1)]?.timestamp?.split('T')[0] : null
    }));
  };

  const generateDocumentStatus = (type: string) => {
    const requiredDocs = {
      'passport': ['Application Form', 'Photo', 'Birth Certificate', 'ID Proof'],
      'visa': ['Application Form', 'Passport Copy', 'Photo', 'Support Documents'],
      'permit': ['Application Form', 'Passport Copy', 'Qualification Documents', 'Support Letters'],
      'citizenship': ['Application Form', 'Birth Certificate', 'Residence Proof', 'Character References'],
      'laissez-passer': ['Application Form', 'ID Proof', 'Emergency Documentation'],
      'refugee': ['Application Form', 'Identity Documents', 'Supporting Evidence'],
      'diaspora': ['Request Form', 'ID Documents', 'Supporting Information']
    };

    const docs = requiredDocs[type as keyof typeof requiredDocs] || requiredDocs.passport;
    return docs.map(doc => ({
      name: doc,
      status: Math.random() > 0.3 ? 'approved' : 'pending'
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getProgressPercentage = () => {
    if (!applicationData) return 0;
    const completed = applicationData.stages.filter((stage: any) => stage.status === 'completed').length;
    return (completed / applicationData.stages.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
            <span>🔍</span>
            <span>Check Application Status</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter your reference number to track any application (passport, visa, permit, citizenship, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="e.g., PP2024001234"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleStatusCheck}
                disabled={isLoading}
                className="h-11 w-full sm:w-auto px-8"
              >
                {isLoading ? 'Checking...' : 'Check Status'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {applicationData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Application Details</CardTitle>
                  <CardDescription className="mt-1 font-mono text-sm">
                    Reference: {applicationData.referenceNumber}
                  </CardDescription>
                </div>
                <Badge className="text-sm self-start">
                  {applicationData.currentStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Applicant Name</Label>
                  <p className="text-base">{applicationData.applicantName}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Application Type</Label>
                  <p className="text-base">{applicationData.applicationType}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Submission Date</Label>
                  <p className="text-base">{applicationData.submissionDate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Estimated Completion</Label>
                  <p className="text-base">{applicationData.estimatedCompletion}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Overall Progress</Label>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(getProgressPercentage())}% Complete
                  </span>
                </div>
                <Progress value={getProgressPercentage()} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Processing Stages</CardTitle>
              <CardDescription>Track the progress of your application through each stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationData.stages.map((stage: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {stage.status === 'completed' ? (
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                          ✓
                        </div>
                      ) : stage.status === 'in-progress' ? (
                        <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm">
                          ⏳
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <span className="font-medium text-sm sm:text-base">{stage.name}</span>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <Badge variant={getStatusColor(stage.status)} className="text-xs self-start">
                            {stage.status.replace('-', ' ')}
                          </Badge>
                          {stage.date && (
                            <span className="text-xs sm:text-sm text-muted-foreground">{stage.date}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Document Status</CardTitle>
              <CardDescription>Status of submitted documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationData.documents.map((doc: any, index: number) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="text-sm sm:text-base font-medium">{doc.name}</span>
                      <Badge variant={getStatusColor(doc.status)} className="text-xs self-start">
                        {doc.status}
                      </Badge>
                    </div>
                    {index < applicationData.documents.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm sm:text-base mb-6">
                <p>• Your application is currently under review</p>
                <p>• You will receive an email notification when the next stage begins</p>
                <p>• If additional documents are required, you will be contacted directly</p>
                <p>• Estimated processing time: 5-7 business days</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="h-11">Download Receipt</Button>
                <Button variant="outline" className="h-11">Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}