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
import { Checkbox } from "./ui/checkbox";
import { 
  Shield, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Users,
  Heart,
  BookOpen
} from "lucide-react";

export function CitizenshipApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [citizenshipType, setCitizenshipType] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    currentNationality: '',
    passportNumber: '',
    maritalStatus: '',
    spouseName: '',
    spouseNationality: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    
    // Citizenship Details
    citizenshipType: '',
    basisForApplication: '',
    residenceYears: '',
    rwandanSpouse: false,
    rwandanParent: false,
    parentDetails: '',
    languageProficiency: '',
    
    // Rwanda Connection
    entryDate: '',
    residenceHistory: '',
    contributionToRwanda: '',
    criminalRecord: '',
    taxCompliance: '',
    communityInvolvement: '',
    
    // Supporting Information
    references: '',
    additionalInfo: ''
  });

  const citizenshipTypes = [
    { 
      value: 'naturalization', 
      label: 'Naturalization', 
      description: 'For foreign nationals who have lived in Rwanda for required period',
      requirements: 'Minimum 5 years continuous residence',
      fee: '$500'
    },
    { 
      value: 'marriage', 
      label: 'By Marriage', 
      description: 'For foreign nationals married to Rwandan citizens',
      requirements: 'Minimum 3 years marriage to Rwandan citizen',
      fee: '$300'
    },
    { 
      value: 'descent', 
      label: 'By Descent', 
      description: 'For children of Rwandan citizens born abroad',
      requirements: 'At least one Rwandan parent',
      fee: '$200'
    },
    { 
      value: 'adoption', 
      label: 'By Adoption', 
      description: 'For children adopted by Rwandan citizens',
      requirements: 'Legal adoption by Rwandan citizen',
      fee: '$250'
    },
    { 
      value: 'exceptional', 
      label: 'Exceptional Circumstances', 
      description: 'For individuals with exceptional contribution to Rwanda',
      requirements: 'Ministerial approval required',
      fee: '$1000'
    }
  ];

  const requiredDocuments = {
    naturalization: [
      'Valid Passport and copies',
      'Birth Certificate (certified)',
      'Marriage Certificate (if applicable)',
      'Residence Permit history',
      'Tax Clearance Certificate',
      'Police Clearance Certificate (Rwanda and origin country)',
      'Medical Certificate',
      'Proof of Language Proficiency (Kinyarwanda/English/French)',
      'Proof of Residence (5 years)',
      'Employment/Business certificates',
      'Character References (3)',
      'Passport-size Photos (6)',
      'Integration Evidence'
    ],
    marriage: [
      'Valid Passport and copies',
      'Birth Certificate (certified)',
      'Marriage Certificate (certified)',
      'Spouse\'s Rwandan ID/Passport',
      'Proof of Marriage Duration (3+ years)',
      'Joint residence proof',
      'Police Clearance Certificate',
      'Medical Certificate',
      'Tax records (if applicable)',
      'Character References (2)',
      'Passport-size Photos (6)',
      'Spouse affidavit'
    ],
    descent: [
      'Valid Passport and copies',
      'Birth Certificate (certified)',
      'Parent\'s Rwandan citizenship documents',
      'Parent\'s Birth Certificate',
      'Parent\'s Marriage Certificate (if applicable)',
      'DNA test (if required)',
      'Character References (2)',
      'Police Clearance Certificate',
      'Medical Certificate',
      'Passport-size Photos (6)',
      'Affidavit of parentage'
    ],
    adoption: [
      'Valid Passport and copies',
      'Birth Certificate (certified)',
      'Adoption Certificate (certified)',
      'Adoptive Parent\'s Rwandan citizenship documents',
      'Court Adoption Order',
      'Previous custody documents',
      'Medical Certificate',
      'Character References (2)',
      'Passport-size Photos (6)',
      'Adoption agency records'
    ],
    exceptional: [
      'Valid Passport and copies',
      'Birth Certificate (certified)',
      'Detailed CV/Resume',
      'Evidence of exceptional contribution',
      'Letters of recommendation (government officials)',
      'Professional achievements documentation',
      'Investment/Business evidence (if applicable)',
      'Community service records',
      'Police Clearance Certificate',
      'Medical Certificate',
      'Tax records',
      'Passport-size Photos (6)'
    ]
  };

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (field: string, value: string | boolean) => {
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
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ee81f4f/applications/citizenship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Citizenship application submitted successfully!\n\nReference Number: ${result.referenceNumber}\n\nEstimated Processing Time: ${result.estimatedProcessingTime}\n\nYou will receive updates throughout the review process.`);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting citizenship application:', error);
      alert('There was an error submitting your application. Please try again or contact support.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Select Citizenship Type</h3>
              <div className="grid grid-cols-1 gap-4">
                {citizenshipTypes.map((type) => (
                  <Card 
                    key={type.value} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      citizenshipType === type.value ? 'ring-2 ring-navy-medium border-navy-medium' : 'border-blue-light'
                    }`}
                    onClick={() => {
                      setCitizenshipType(type.value);
                      updateFormData('citizenshipType', type.value);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Shield className="h-5 w-5 text-navy-medium" />
                            <h4 className="font-medium text-navy-dark">{type.label}</h4>
                            {citizenshipType === type.value && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-navy-medium mb-2">{type.description}</p>
                          <p className="text-xs text-blue-medium font-medium">{type.requirements}</p>
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

            {citizenshipType && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Citizenship applications are thoroughly reviewed and require extensive documentation. 
                  Processing time is typically 6-12 months. Incomplete applications may be rejected.
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
                  placeholder="Enter your full name as in passport"
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
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => updateFormData('placeOfBirth', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              
              <div>
                <Label htmlFor="currentNationality">Current Nationality *</Label>
                <Input
                  id="currentNationality"
                  value={formData.currentNationality}
                  onChange={(e) => updateFormData('currentNationality', e.target.value)}
                  placeholder="Your current nationality"
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
                <Label htmlFor="maritalStatus">Marital Status *</Label>
                <Select value={formData.maritalStatus} onValueChange={(value) => updateFormData('maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
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
              
              <div>
                <Label htmlFor="occupation">Current Occupation *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                  placeholder="Your current job/profession"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="currentAddress">Current Address in Rwanda *</Label>
              <Textarea
                id="currentAddress"
                value={formData.currentAddress}
                onChange={(e) => updateFormData('currentAddress', e.target.value)}
                placeholder="Enter your complete address in Rwanda"
                rows={3}
              />
            </div>

            {(formData.maritalStatus === 'married') && (
              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium text-navy-dark">Spouse Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spouseName">Spouse Full Name</Label>
                    <Input
                      id="spouseName"
                      value={formData.spouseName}
                      onChange={(e) => updateFormData('spouseName', e.target.value)}
                      placeholder="Enter spouse's full name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="spouseNationality">Spouse Nationality</Label>
                    <Input
                      id="spouseNationality"
                      value={formData.spouseNationality}
                      onChange={(e) => updateFormData('spouseNationality', e.target.value)}
                      placeholder="Spouse's nationality"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Citizenship Basis & Rwanda Connection</h3>
            
            <div>
              <Label htmlFor="basisForApplication">Basis for Citizenship Application *</Label>
              <Textarea
                id="basisForApplication"
                value={formData.basisForApplication}
                onChange={(e) => updateFormData('basisForApplication', e.target.value)}
                placeholder="Explain why you are applying for Rwandan citizenship"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entryDate">Date of First Entry to Rwanda *</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={formData.entryDate}
                  onChange={(e) => updateFormData('entryDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="residenceYears">Years of Continuous Residence *</Label>
                <Select value={formData.residenceYears} onValueChange={(value) => updateFormData('residenceYears', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-4">3-4 years</SelectItem>
                    <SelectItem value="5-6">5-6 years</SelectItem>
                    <SelectItem value="7-10">7-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-navy-dark">Family Connections (if applicable)</h4>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rwandanSpouse"
                    checked={formData.rwandanSpouse}
                    onCheckedChange={(checked) => updateFormData('rwandanSpouse', checked as boolean)}
                  />
                  <Label htmlFor="rwandanSpouse">I am married to a Rwandan citizen</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="rwandanParent"
                    checked={formData.rwandanParent}
                    onCheckedChange={(checked) => updateFormData('rwandanParent', checked as boolean)}
                  />
                  <Label htmlFor="rwandanParent">I have at least one Rwandan parent</Label>
                </div>
              </div>

              {formData.rwandanParent && (
                <div>
                  <Label htmlFor="parentDetails">Rwandan Parent Details</Label>
                  <Textarea
                    id="parentDetails"
                    value={formData.parentDetails}
                    onChange={(e) => updateFormData('parentDetails', e.target.value)}
                    placeholder="Provide details of your Rwandan parent (name, ID number, etc.)"
                    rows={3}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="languageProficiency">Language Proficiency *</Label>
              <Select value={formData.languageProficiency} onValueChange={(value) => updateFormData('languageProficiency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your language proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kinyarwanda-fluent">Kinyarwanda - Fluent</SelectItem>
                  <SelectItem value="kinyarwanda-basic">Kinyarwanda - Basic</SelectItem>
                  <SelectItem value="english-fluent">English - Fluent</SelectItem>
                  <SelectItem value="french-fluent">French - Fluent</SelectItem>
                  <SelectItem value="multiple">Multiple languages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Residence History & Integration</h3>
            
            <div>
              <Label htmlFor="residenceHistory">Complete Residence History in Rwanda *</Label>
              <Textarea
                id="residenceHistory"
                value={formData.residenceHistory}
                onChange={(e) => updateFormData('residenceHistory', e.target.value)}
                placeholder="List all addresses where you have lived in Rwanda with dates"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="contributionToRwanda">Contribution to Rwanda *</Label>
              <Textarea
                id="contributionToRwanda"
                value={formData.contributionToRwanda}
                onChange={(e) => updateFormData('contributionToRwanda', e.target.value)}
                placeholder="Describe your contributions to Rwanda (employment, taxes, community involvement, etc.)"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="communityInvolvement">Community Involvement</Label>
              <Textarea
                id="communityInvolvement"
                value={formData.communityInvolvement}
                onChange={(e) => updateFormData('communityInvolvement', e.target.value)}
                placeholder="Describe your involvement in Rwandan community activities"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="criminalRecord">Criminal Record Declaration *</Label>
                <Select value={formData.criminalRecord} onValueChange={(value) => updateFormData('criminalRecord', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select declaration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-record">No criminal record</SelectItem>
                    <SelectItem value="minor-offenses">Minor offenses only</SelectItem>
                    <SelectItem value="record-exists">Criminal record exists</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="taxCompliance">Tax Compliance Status *</Label>
                <Select value={formData.taxCompliance} onValueChange={(value) => updateFormData('taxCompliance', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliant">Fully compliant</SelectItem>
                    <SelectItem value="minor-issues">Minor issues resolved</SelectItem>
                    <SelectItem value="not-applicable">Not applicable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="references">Character References *</Label>
              <Textarea
                id="references"
                value={formData.references}
                onChange={(e) => updateFormData('references', e.target.value)}
                placeholder="Provide contact information for 3 character references (preferably Rwandan citizens)"
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Required Documents</h3>
            
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                All documents must be original or certified copies. Foreign documents must be authenticated/apostilled 
                and translated into English, French, or Kinyarwanda by certified translators.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-medium text-navy-dark">
                Document Checklist for {citizenshipTypes.find(p => p.value === citizenshipType)?.label}
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                {citizenshipType && requiredDocuments[citizenshipType as keyof typeof requiredDocuments]?.map((doc, index) => (
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

            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                placeholder="Any additional information that supports your application"
                rows={3}
              />
            </div>

            <Alert>
              <DollarSign className="h-4 w-4" />
              <AlertDescription>
                <strong>Application Fee:</strong> {citizenshipTypes.find(p => p.value === citizenshipType)?.fee} 
                (Non-refundable, payment required before application review)
              </AlertDescription>
            </Alert>

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Processing Time:</strong> 6-12 months for standard applications. 
                You will be contacted for interviews and additional requirements as needed.
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
            <Shield className="h-8 w-8 text-navy-medium" />
          </div>
        </div>
        <h1 className="text-3xl mb-4 text-navy-dark">Citizenship Application</h1>
        <p className="text-lg text-navy-medium">Apply for Rwandan citizenship through various pathways</p>
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
              disabled={currentStep === 1 && !citizenshipType}
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
            Need help? Contact our Citizenship Services team at <strong>citizenship@migration.gov.rw</strong> or call <strong>+250 722 16 99 58</strong>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}