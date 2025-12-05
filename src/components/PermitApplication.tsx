import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { 
  CreditCard, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Download
} from "lucide-react";

export function PermitApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [permitType, setPermitType] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    
    // Permit Details
    permitType: '',
    permitCategory: '',
    purposeOfStay: '',
    intendedDuration: '',
    employerName: '',
    jobTitle: '',
    workLocation: '',
    sponsorInformation: '',
    
    // Supporting Information
    previousPermits: '',
    criminalRecord: '',
    medicalCertificate: '',
    additionalInfo: ''
  });

  const permitTypes = [
    { value: 'work', label: 'Work Permit', description: 'For employment in Rwanda', fee: '$200' },
    { value: 'residence', label: 'Residence Permit', description: 'For long-term residence', fee: '$150' },
    { value: 'investment', label: 'Investment Permit', description: 'For business investment', fee: '$300' },
    { value: 'student', label: 'Student Permit', description: 'For educational purposes', fee: '$100' },
    { value: 'special', label: 'Special Permit', description: 'For special circumstances', fee: '$250' }
  ];

  const requiredDocuments = {
    work: [
      'Valid Passport (minimum 6 months validity)',
      'Employment Contract or Job Offer Letter',
      'Academic Qualifications/Certificates',
      'Professional Experience Certificates',
      'Medical Certificate',
      'Police Clearance Certificate',
      'Passport-size Photos (4)',
      'CV/Resume'
    ],
    residence: [
      'Valid Passport (minimum 6 months validity)',
      'Proof of Financial Means',
      'Accommodation Proof',
      'Medical Certificate',
      'Police Clearance Certificate',
      'Passport-size Photos (4)',
      'Sponsor Letter (if applicable)'
    ],
    investment: [
      'Valid Passport (minimum 6 months validity)',
      'Business Plan',
      'Proof of Investment Capital',
      'Company Registration Documents',
      'Medical Certificate',
      'Police Clearance Certificate',
      'Passport-size Photos (4)',
      'Bank Statements'
    ],
    student: [
      'Valid Passport (minimum 6 months validity)',
      'Letter of Admission',
      'Academic Transcripts',
      'Proof of Financial Support',
      'Medical Certificate',
      'Passport-size Photos (4)',
      'Accommodation Proof'
    ],
    special: [
      'Valid Passport (minimum 6 months validity)',
      'Supporting Documents (case-specific)',
      'Sponsor Letter',
      'Medical Certificate',
      'Police Clearance Certificate',
      'Passport-size Photos (4)'
    ]
  };

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ee81f4f/applications/permit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Permit application submitted successfully!\n\nReference Number: ${result.referenceNumber}\n\nEstimated Processing Time: ${result.estimatedProcessingTime}\n\nYou will receive updates via email and SMS.`);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting permit application:', error);
      alert('There was an error submitting your application. Please try again or contact support.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Select Permit Type</h3>
              <div className="grid grid-cols-1 gap-4">
                {permitTypes.map((type) => (
                  <Card 
                    key={type.value} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      permitType === type.value ? 'ring-2 ring-navy-medium border-navy-medium' : 'border-blue-light'
                    }`}
                    onClick={() => {
                      setPermitType(type.value);
                      updateFormData('permitType', type.value);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CreditCard className="h-5 w-5 text-navy-medium" />
                            <h4 className="font-medium text-navy-dark">{type.label}</h4>
                            {permitType === type.value && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-navy-medium">{type.description}</p>
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {type.fee}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {permitType && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Time:</strong> Permit applications typically take 10-15 business days to process. 
                  Rush processing is available for an additional fee.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => updateFormData('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  placeholder="Enter your nationality"
                />
              </div>
              
              <div>
                <Label htmlFor="passportNumber">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => updateFormData('passportNumber', e.target.value)}
                  placeholder="Enter passport number"
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                  placeholder="+250 XXX XXX XXX"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="currentAddress">Current Address *</Label>
              <Textarea
                id="currentAddress"
                value={formData.currentAddress}
                onChange={(e) => updateFormData('currentAddress', e.target.value)}
                placeholder="Enter your current address"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Permit Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purposeOfStay">Purpose of Stay *</Label>
                <Textarea
                  id="purposeOfStay"
                  value={formData.purposeOfStay}
                  onChange={(e) => updateFormData('purposeOfStay', e.target.value)}
                  placeholder="Describe the purpose of your stay"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="intendedDuration">Intended Duration *</Label>
                <Select value={formData.intendedDuration} onValueChange={(value) => updateFormData('intendedDuration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                    <SelectItem value="2years">2 Years</SelectItem>
                    <SelectItem value="3years">3 Years</SelectItem>
                    <SelectItem value="5years">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(permitType === 'work' || permitType === 'investment') && (
              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium text-navy-dark">Employment/Business Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employerName">Employer/Company Name *</Label>
                    <Input
                      id="employerName"
                      value={formData.employerName}
                      onChange={(e) => updateFormData('employerName', e.target.value)}
                      placeholder="Enter employer/company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="jobTitle">Job Title/Position *</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => updateFormData('jobTitle', e.target.value)}
                      placeholder="Enter job title"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="workLocation">Work Location *</Label>
                  <Input
                    id="workLocation"
                    value={formData.workLocation}
                    onChange={(e) => updateFormData('workLocation', e.target.value)}
                    placeholder="Enter work location address"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="sponsorInformation">Sponsor Information (if applicable)</Label>
              <Textarea
                id="sponsorInformation"
                value={formData.sponsorInformation}
                onChange={(e) => updateFormData('sponsorInformation', e.target.value)}
                placeholder="Provide sponsor details if applicable"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Required Documents</h3>
            
            {permitType && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Please ensure all documents are recent (issued within the last 6 months) and in English or Kinyarwanda. 
                  Documents in other languages must be translated and notarized.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-navy-dark">Document Checklist for {permitTypes.find(p => p.value === permitType)?.label}</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {permitType && requiredDocuments[permitType as keyof typeof requiredDocuments]?.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-blue-light rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-navy-medium" />
                      <span className="text-sm text-navy-dark">{doc}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-navy-dark">Additional Information</h4>
              
              <div>
                <Label htmlFor="previousPermits">Previous Rwanda Permits (if any)</Label>
                <Textarea
                  id="previousPermits"
                  value={formData.previousPermits}
                  onChange={(e) => updateFormData('previousPermits', e.target.value)}
                  placeholder="List any previous permits or applications"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  placeholder="Any additional information you'd like to provide"
                  rows={3}
                />
              </div>
            </div>

            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Application Fee:</strong> {permitTypes.find(p => p.value === permitType)?.fee} 
                (Payment can be made online or at the DGIE office)
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center space-x-3 mb-4">
          <div className="p-3 bg-navy-medium/10 rounded-full border border-navy-medium/20">
            <CreditCard className="h-8 w-8 text-navy-medium" />
          </div>
        </div>
        <h1 className="text-3xl mb-4 text-navy-dark">Permit Application</h1>
        <p className="text-lg text-navy-medium">Apply for residence, work, or other permits in Rwanda</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-navy-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-navy-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-4">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-navy-medium text-white' 
                  : 'bg-blue-light text-navy-medium'
              }`}>
                {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < totalSteps && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-navy-medium' : 'bg-blue-light'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        <div className="space-x-2">
          {currentStep < totalSteps ? (
            <Button 
              onClick={nextStep}
              disabled={currentStep === 1 && !permitType}
              className="bg-navy-medium hover:bg-navy-dark text-white"
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Application
            </Button>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Need help? Contact our Permit Services team at <strong>permit@migration.gov.rw</strong> or call <strong>+250 722 17 29 74</strong>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}