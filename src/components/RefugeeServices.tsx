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
  Users, 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Info,
  Calendar,
  Home,
  Heart,
  Shield,
  HelpCircle,
  Phone,
  MapPin
} from "lucide-react";

export function RefugeeServices() {
  const [activeTab, setActiveTab] = useState('asylum');
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    languagesSpoken: '',
    
    // Family Information
    maritalStatus: '',
    familyMembers: '',
    childrenDetails: '',
    spouseDetails: '',
    
    // Refugee Status
    serviceType: '',
    countryOfOrigin: '',
    reasonForFleeing: '',
    persecutionDetails: '',
    arrivalDate: '',
    entryPoint: '',
    previousApplications: '',
    
    // Current Situation
    currentAccommodation: '',
    supportNeeded: '',
    medicalNeeds: '',
    educationNeeds: '',
    employmentStatus: '',
    vulnerabilities: '',
    
    // Documentation
    hasDocuments: false,
    documentsDescription: '',
    witnessContacts: '',
    
    // Supporting Information
    additionalInfo: ''
  });

  const serviceTypes = [
    { 
      value: 'asylum', 
      label: 'Asylum Application', 
      description: 'Apply for protection as a refugee in Rwanda',
      icon: <Shield className="h-5 w-5" />,
      fee: 'Free'
    },
    { 
      value: 'family-reunion', 
      label: 'Family Reunification', 
      description: 'Bring family members to join you in Rwanda',
      icon: <Users className="h-5 w-5" />,
      fee: 'Free'
    },
    { 
      value: 'travel-document', 
      label: 'Refugee Travel Document', 
      description: 'Apply for travel documents for recognized refugees',
      icon: <FileText className="h-5 w-5" />,
      fee: '$120'
    },
    { 
      value: 'status-review', 
      label: 'Status Review', 
      description: 'Review or appeal refugee status decision',
      icon: <HelpCircle className="h-5 w-5" />,
      fee: 'Free'
    },
    { 
      value: 'integration-support', 
      label: 'Integration Support', 
      description: 'Access integration and settlement services',
      icon: <Home className="h-5 w-5" />,
      fee: 'Free'
    }
  ];

  const totalSteps = 4;
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
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ee81f4f/applications/refugee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Refugee services application submitted successfully!\n\nReference Number: ${result.referenceNumber}\n\nNext Steps: ${result.nextSteps}\n\nYou will be contacted by a case worker soon.`);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting refugee services application:', error);
      alert('There was an error submitting your application. Please try again or contact support.');
    }
  };

  const renderServiceApplicationForm = () => {
    const renderStepContent = () => {
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-navy-dark">Select Service Type</h3>
                <div className="grid grid-cols-1 gap-4">
                  {serviceTypes.map((type) => (
                    <Card 
                      key={type.value} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        serviceType === type.value ? 'ring-2 ring-navy-medium border-navy-medium' : 'border-blue-light'
                      }`}
                      onClick={() => {
                        setServiceType(type.value);
                        updateFormData('serviceType', type.value);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {type.icon}
                              <h4 className="font-medium text-navy-dark">{type.label}</h4>
                              {serviceType === type.value && (
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

              {serviceType && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All refugee services are provided free of charge except travel documents. 
                    You have the right to an interpreter during all proceedings.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Personal & Family Information</h3>
              
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
                  <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                  <Input
                    id="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={(e) => updateFormData('placeOfBirth', e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <Label htmlFor="nationality">Nationality/Country of Origin *</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => updateFormData('nationality', e.target.value)}
                    placeholder="Your country of origin"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+250 XXX XXX XXX"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="Enter email if available"
                  />
                </div>

                <div>
                  <Label htmlFor="languagesSpoken">Languages Spoken *</Label>
                  <Input
                    id="languagesSpoken"
                    value={formData.languagesSpoken}
                    onChange={(e) => updateFormData('languagesSpoken', e.target.value)}
                    placeholder="List languages you speak"
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
              </div>
              
              <div>
                <Label htmlFor="currentAddress">Current Address in Rwanda</Label>
                <Textarea
                  id="currentAddress"
                  value={formData.currentAddress}
                  onChange={(e) => updateFormData('currentAddress', e.target.value)}
                  placeholder="Enter your current address or camp location"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium text-navy-dark">Family Information</h4>
                
                <div>
                  <Label htmlFor="familyMembers">Family Members with You</Label>
                  <Textarea
                    id="familyMembers"
                    value={formData.familyMembers}
                    onChange={(e) => updateFormData('familyMembers', e.target.value)}
                    placeholder="List family members currently with you (names, ages, relationship)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="childrenDetails">Children Details</Label>
                  <Textarea
                    id="childrenDetails"
                    value={formData.childrenDetails}
                    onChange={(e) => updateFormData('childrenDetails', e.target.value)}
                    placeholder="Details about your children (ages, school needs, etc.)"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Refugee Status & Background</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="countryOfOrigin">Country of Origin *</Label>
                  <Input
                    id="countryOfOrigin"
                    value={formData.countryOfOrigin}
                    onChange={(e) => updateFormData('countryOfOrigin', e.target.value)}
                    placeholder="Country you fled from"
                  />
                </div>
                
                <div>
                  <Label htmlFor="arrivalDate">Date of Arrival in Rwanda *</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate}
                    onChange={(e) => updateFormData('arrivalDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="entryPoint">Entry Point to Rwanda</Label>
                  <Select value={formData.entryPoint} onValueChange={(value) => updateFormData('entryPoint', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entry point" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kagitumba">Kagitumba (Uganda border)</SelectItem>
                      <SelectItem value="nemba">Nemba (Burundi border)</SelectItem>
                      <SelectItem value="la-corniche">La Corniche (DRC border)</SelectItem>
                      <SelectItem value="airport">Kigali International Airport</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="reasonForFleeing">Reason for Fleeing Your Country *</Label>
                <Textarea
                  id="reasonForFleeing"
                  value={formData.reasonForFleeing}
                  onChange={(e) => updateFormData('reasonForFleeing', e.target.value)}
                  placeholder="Explain why you left your country (persecution, war, violence, etc.)"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="persecutionDetails">Details of Persecution or Threat *</Label>
                <Textarea
                  id="persecutionDetails"
                  value={formData.persecutionDetails}
                  onChange={(e) => updateFormData('persecutionDetails', e.target.value)}
                  placeholder="Provide specific details about the persecution or threats you faced"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="previousApplications">Previous Asylum Applications</Label>
                <Textarea
                  id="previousApplications"
                  value={formData.previousApplications}
                  onChange={(e) => updateFormData('previousApplications', e.target.value)}
                  placeholder="Have you applied for asylum in other countries? Provide details."
                  rows={2}
                />
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  All information provided will be kept confidential. You have the right to legal representation 
                  and an interpreter during the refugee status determination process.
                </AlertDescription>
              </Alert>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Current Needs & Support</h3>
              
              <div>
                <Label htmlFor="currentAccommodation">Current Accommodation Status *</Label>
                <Select value={formData.currentAccommodation} onValueChange={(value) => updateFormData('currentAccommodation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accommodation status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refugee-camp">Refugee camp</SelectItem>
                    <SelectItem value="transit-center">Transit center</SelectItem>
                    <SelectItem value="host-family">Staying with host family</SelectItem>
                    <SelectItem value="rented">Rented accommodation</SelectItem>
                    <SelectItem value="homeless">No accommodation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="supportNeeded">Immediate Support Needed</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Food', 'Shelter', 'Medical care', 'Education', 'Legal aid', 'Clothing', 'Translation', 'Employment'].map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox id={support} />
                      <Label htmlFor={support} className="text-sm">{support}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicalNeeds">Medical Needs</Label>
                  <Textarea
                    id="medicalNeeds"
                    value={formData.medicalNeeds}
                    onChange={(e) => updateFormData('medicalNeeds', e.target.value)}
                    placeholder="Describe any medical conditions or needs"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="educationNeeds">Education Needs</Label>
                  <Textarea
                    id="educationNeeds"
                    value={formData.educationNeeds}
                    onChange={(e) => updateFormData('educationNeeds', e.target.value)}
                    placeholder="Education needs for you or your children"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vulnerabilities">Special Vulnerabilities</Label>
                <Textarea
                  id="vulnerabilities"
                  value={formData.vulnerabilities}
                  onChange={(e) => updateFormData('vulnerabilities', e.target.value)}
                  placeholder="Any disabilities, trauma, unaccompanied minors, or other vulnerabilities"
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium text-navy-dark">Documentation & Evidence</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hasDocuments"
                    checked={formData.hasDocuments}
                    onCheckedChange={(checked) => updateFormData('hasDocuments', checked as boolean)}
                  />
                  <Label htmlFor="hasDocuments">I have documents to support my case</Label>
                </div>

                {formData.hasDocuments && (
                  <div>
                    <Label htmlFor="documentsDescription">Description of Available Documents</Label>
                    <Textarea
                      id="documentsDescription"
                      value={formData.documentsDescription}
                      onChange={(e) => updateFormData('documentsDescription', e.target.value)}
                      placeholder="List any documents you have (passport, ID, photos, medical records, etc.)"
                      rows={2}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="witnessContacts">Witness Contacts</Label>
                  <Textarea
                    id="witnessContacts"
                    value={formData.witnessContacts}
                    onChange={(e) => updateFormData('witnessContacts', e.target.value)}
                    placeholder="Contact information for people who can support your case"
                    rows={2}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  placeholder="Any other information you think is important for your case"
                  rows={3}
                />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="space-y-8">
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
                disabled={currentStep === 1 && !serviceType}
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
      </div>
    );
  };

  const renderServiceInfo = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Rwanda is committed to protecting refugees and asylum seekers according to international law. 
          All services are provided free of charge.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-navy-medium" />
              <span>Refugee Protection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Protection from return to country of origin</li>
              <li>• Right to remain in Rwanda during process</li>
              <li>• Access to basic services and assistance</li>
              <li>• Legal representation and interpretation</li>
              <li>• Confidential and fair assessment</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-navy-medium" />
              <span>Support Services</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Emergency accommodation</li>
              <li>• Medical care and mental health support</li>
              <li>• Education for children</li>
              <li>• Livelihood and skills training</li>
              <li>• Community integration programs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-navy-medium" />
              <span>Family Unity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Family reunification assistance</li>
              <li>• Special protection for unaccompanied minors</li>
              <li>• Support for separated families</li>
              <li>• Family tracing services</li>
              <li>• Counseling and psychosocial support</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-navy-medium" />
              <span>Integration Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Language training programs</li>
              <li>• Cultural orientation</li>
              <li>• Employment and business opportunities</li>
              <li>• Access to microfinance</li>
              <li>• Community engagement activities</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center space-x-3 mb-4">
          <div className="p-3 bg-navy-medium/10 rounded-full border border-navy-medium/20">
            <Users className="h-8 w-8 text-navy-medium" />
          </div>
        </div>
        <h1 className="text-3xl mb-4 text-navy-dark">Refugee Services</h1>
        <p className="text-lg text-navy-medium">Comprehensive support for refugees and asylum seekers in Rwanda</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="asylum">Apply for Services</TabsTrigger>
          <TabsTrigger value="info">Service Information</TabsTrigger>
        </TabsList>

        <TabsContent value="asylum">
          {renderServiceApplicationForm()}
        </TabsContent>

        <TabsContent value="info">
          {renderServiceInfo()}
        </TabsContent>
      </Tabs>

      {/* Contact Information */}
      <div className="mt-12">
        <Card className="bg-navy-dark text-blue-lightest">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">24/7 Refugee Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-light" />
                  <span>+250 727 00 59 90</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-light" />
                  <span>refugee@migration.gov.rw</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-light" />
                  <span>DGIE Offices, Kigali</span>
                </div>
              </div>
              <p className="mt-4 text-blue-light">
                Emergency assistance available 24/7. Interpretation services provided.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}