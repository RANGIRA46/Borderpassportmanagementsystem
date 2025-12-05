import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Info,
  Calendar,
  DollarSign,
  Plane,
  MapPin,
  Phone,
  Zap
} from "lucide-react";

export function LaissezPasserApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [documentType, setDocumentType] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    
    // Document Details
    documentType: '',
    isEmergency: false,
    reasonForTravel: '',
    destinationCountry: '',
    travelDate: '',
    returnDate: '',
    emergencyReason: '',
    
    // Current Document Status
    passportStatus: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    lostPassportDetails: '',
    
    // Contact Information
    emergencyContact: '',
    emergencyContactPhone: '',
    localContact: '',
    localContactPhone: '',
    
    // Supporting Information
    previousTravel: '',
    additionalInfo: ''
  });

  const documentTypes = [
    { 
      value: 'laissez-passer', 
      label: 'Laissez-Passer', 
      description: 'Emergency travel document for Rwandan citizens',
      validity: '6 months',
      fee: '$80',
      processingTime: '3-5 business days'
    },
    { 
      value: 'emergency-certificate', 
      label: 'Emergency Travel Certificate', 
      description: 'Temporary travel document for urgent travel',
      validity: '3 months',
      fee: '$100',
      processingTime: '24-48 hours'
    },
    { 
      value: 'return-document', 
      label: 'Return Travel Document', 
      description: 'One-way document for return to Rwanda only',
      validity: 'Single journey',
      fee: '$60',
      processingTime: '2-3 business days'
    },
    { 
      value: 'refugee-travel', 
      label: 'Refugee Travel Document', 
      description: 'For recognized refugees needing to travel',
      validity: '1 year',
      fee: '$120',
      processingTime: '5-7 business days'
    }
  ];

  const requiredDocuments = {
    'laissez-passer': [
      'Completed application form',
      'Proof of Rwandan citizenship (birth certificate, national ID, or previous passport)',
      'Two recent passport-size photos',
      'Police report (if passport was lost/stolen)',
      'Proof of travel necessity',
      'Copy of flight itinerary/booking',
      'Consular fee payment receipt',
      'Emergency contact information'
    ],
    'emergency-certificate': [
      'Completed application form',
      'Proof of identity and citizenship',
      'Two recent passport-size photos',
      'Medical emergency documentation (if applicable)',
      'Death certificate (if for funeral attendance)',
      'Employer letter (if for business emergency)',
      'Proof of financial means for travel',
      'Emergency contact information',
      'Police report (if documents were lost/stolen)'
    ],
    'return-document': [
      'Completed application form',
      'Proof of Rwandan citizenship',
      'Two recent passport-size photos',
      'Explanation letter for return',
      'Sponsor/family contact in Rwanda',
      'Copy of expired/lost passport (if available)',
      'Local police report (if applicable)',
      'Proof of current location/status'
    ],
    'refugee-travel': [
      'Completed application form',
      'Refugee recognition certificate',
      'Two recent passport-size photos',
      'Proof of travel necessity',
      'Sponsor letter from destination country',
      'Medical certificate (if required)',
      'Letter from UNHCR (if applicable)',
      'Return guarantee letter'
    ]
  };

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
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ee81f4f/applications/laissez-passer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ ...formData, isEmergency })
      });

      const result = await response.json();
      
      if (result.success) {
        const processingMessage = isEmergency ? 
          `Emergency application submitted!\n\nReference Number: ${result.referenceNumber}\n\nEstimated Processing Time: ${result.estimatedProcessingTime}\n\nWe will contact you within 24 hours.` :
          `Application submitted successfully!\n\nReference Number: ${result.referenceNumber}\n\nEstimated Processing Time: ${result.estimatedProcessingTime}\n\nYou will receive updates via email and SMS.`;
        alert(processingMessage);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting laissez-passer application:', error);
      alert('There was an error submitting your application. Please try again or contact support.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Select Document Type</h3>
              <div className="grid grid-cols-1 gap-4">
                {documentTypes.map((type) => (
                  <Card 
                    key={type.value} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      documentType === type.value ? 'ring-2 ring-navy-medium border-navy-medium' : 'border-blue-light'
                    }`}
                    onClick={() => {
                      setDocumentType(type.value);
                      updateFormData('documentType', type.value);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-5 w-5 text-navy-medium" />
                            <h4 className="font-medium text-navy-dark">{type.label}</h4>
                            {documentType === type.value && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-navy-medium mb-2">{type.description}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs text-blue-medium">
                            <span><strong>Validity:</strong> {type.validity}</span>
                            <span><strong>Fee:</strong> {type.fee}</span>
                            <span><strong>Processing:</strong> {type.processingTime}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {documentType && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="emergency"
                    checked={isEmergency}
                    onCheckedChange={(checked) => {
                      setIsEmergency(checked as boolean);
                      updateFormData('isEmergency', checked as boolean);
                    }}
                  />
                  <Label htmlFor="emergency" className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    <span>This is an emergency application (24-hour processing)</span>
                  </Label>
                </div>

                {isEmergency && (
                  <Alert className="border-red-500 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription>
                      <strong>Emergency Processing:</strong> Additional fees apply (+$50). 
                      Valid reasons include medical emergencies, death in family, or urgent business matters.
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Emergency travel documents are temporary. 
                    You should apply for a regular passport as soon as possible.
                  </AlertDescription>
                </Alert>
              </div>
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
                  placeholder="Full name as in official documents"
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
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  placeholder="Your nationality"
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
              
              <div>
                <Label htmlFor="occupation">Current Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                  placeholder="Your current job/profession"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="currentAddress">Current Address *</Label>
              <Textarea
                id="currentAddress"
                value={formData.currentAddress}
                onChange={(e) => updateFormData('currentAddress', e.target.value)}
                placeholder="Enter your complete current address"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Separator />
              <h4 className="font-medium text-navy-dark">Current Passport Status</h4>
              
              <div>
                <Label htmlFor="passportStatus">Passport Status *</Label>
                <Select value={formData.passportStatus} onValueChange={(value) => updateFormData('passportStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select passport status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="stolen">Stolen</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="never-had">Never had a passport</SelectItem>
                    <SelectItem value="processing">Under processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.passportStatus === 'lost' || formData.passportStatus === 'stolen' || 
                formData.passportStatus === 'expired' || formData.passportStatus === 'damaged') && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="passportNumber">Previous Passport Number</Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) => updateFormData('passportNumber', e.target.value)}
                      placeholder="Enter passport number"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passportIssueDate">Issue Date</Label>
                    <Input
                      id="passportIssueDate"
                      type="date"
                      value={formData.passportIssueDate}
                      onChange={(e) => updateFormData('passportIssueDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="passportExpiryDate">Expiry Date</Label>
                    <Input
                      id="passportExpiryDate"
                      type="date"
                      value={formData.passportExpiryDate}
                      onChange={(e) => updateFormData('passportExpiryDate', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {(formData.passportStatus === 'lost' || formData.passportStatus === 'stolen') && (
                <div>
                  <Label htmlFor="lostPassportDetails">Details of Loss/Theft *</Label>
                  <Textarea
                    id="lostPassportDetails"
                    value={formData.lostPassportDetails}
                    onChange={(e) => updateFormData('lostPassportDetails', e.target.value)}
                    placeholder="Describe when, where, and how the passport was lost or stolen"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Travel Information</h3>
            
            <div>
              <Label htmlFor="reasonForTravel">Reason for Travel *</Label>
              <Textarea
                id="reasonForTravel"
                value={formData.reasonForTravel}
                onChange={(e) => updateFormData('reasonForTravel', e.target.value)}
                placeholder="Explain the purpose and urgency of your travel"
                rows={3}
              />
            </div>

            {isEmergency && (
              <div>
                <Label htmlFor="emergencyReason">Emergency Justification *</Label>
                <Textarea
                  id="emergencyReason"
                  value={formData.emergencyReason}
                  onChange={(e) => updateFormData('emergencyReason', e.target.value)}
                  placeholder="Detailed explanation of why this is an emergency (attach supporting documents)"
                  rows={3}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="destinationCountry">Destination Country *</Label>
                <Input
                  id="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={(e) => updateFormData('destinationCountry', e.target.value)}
                  placeholder="Primary destination"
                />
              </div>
              
              <div>
                <Label htmlFor="travelDate">Intended Travel Date *</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => updateFormData('travelDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="returnDate">Expected Return Date</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => updateFormData('returnDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Separator />
              <h4 className="font-medium text-navy-dark">Emergency Contact Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => updateFormData('emergencyContact', e.target.value)}
                    placeholder="Full name of emergency contact"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                    placeholder="+XXX XXX XXX XXX"
                  />
                </div>
                
                <div>
                  <Label htmlFor="localContact">Local Contact in Rwanda</Label>
                  <Input
                    id="localContact"
                    value={formData.localContact}
                    onChange={(e) => updateFormData('localContact', e.target.value)}
                    placeholder="Contact person in Rwanda"
                  />
                </div>
                
                <div>
                  <Label htmlFor="localContactPhone">Local Contact Phone</Label>
                  <Input
                    id="localContactPhone"
                    value={formData.localContactPhone}
                    onChange={(e) => updateFormData('localContactPhone', e.target.value)}
                    placeholder="+250 XXX XXX XXX"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="previousTravel">Previous Travel History</Label>
              <Textarea
                id="previousTravel"
                value={formData.previousTravel}
                onChange={(e) => updateFormData('previousTravel', e.target.value)}
                placeholder="Brief description of recent international travel"
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4 text-navy-dark">Required Documents</h3>
            
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                All documents must be originals or certified copies. Police reports for lost/stolen passports 
                are mandatory and must be obtained before application submission.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h4 className="font-medium text-navy-dark">
                Document Checklist for {documentTypes.find(p => p.value === documentType)?.label}
              </h4>
              
              <div className="grid grid-cols-1 gap-3">
                {documentType && requiredDocuments[documentType as keyof typeof requiredDocuments]?.map((doc, index) => (
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

            {isEmergency && (
              <Alert className="border-red-500 bg-red-50">
                <Zap className="h-4 w-4 text-red-500" />
                <AlertDescription>
                  <strong>Emergency Documentation:</strong> Medical certificates, death certificates, 
                  or business emergency letters must be provided for emergency processing.
                </AlertDescription>
              </Alert>
            )}

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

            <div className="space-y-2">
              <Alert>
                <DollarSign className="h-4 w-4" />
                <AlertDescription>
                  <strong>Application Fee:</strong> {documentTypes.find(p => p.value === documentType)?.fee}
                  {isEmergency && ' + $50 emergency processing fee'}
                  <br />
                  Payment can be made at the DGIE office or authorized payment centers.
                </AlertDescription>
              </Alert>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Time:</strong> {isEmergency ? '24-48 hours' : documentTypes.find(p => p.value === documentType)?.processingTime}
                  <br />
                  You will be notified via SMS and email when your document is ready for collection.
                </AlertDescription>
              </Alert>
            </div>
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
            <FileText className="h-8 w-8 text-navy-medium" />
          </div>
        </div>
        <h1 className="text-3xl mb-4 text-navy-dark">Emergency Travel Document Application</h1>
        <p className="text-lg text-navy-medium">Apply for laissez-passer and other emergency travel documents</p>
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
              disabled={currentStep === 1 && !documentType}
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
            Need help? Contact our Emergency Travel Services team at <strong>laissezpasser@migration.gov.rw</strong> or call <strong>+250 722 15 86 92</strong>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}