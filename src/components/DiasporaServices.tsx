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
  Globe,
  Phone,
  MapPin,
  Mail,
  DollarSign,
  Star,
  Building
} from "lucide-react";

export function DiasporaServices() {
  const [activeTab, setActiveTab] = useState('services');
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState('');
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    passportNumber: '',
    currentCountry: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    
    // Diaspora Information
    serviceType: '',
    departureDate: '',
    reasonForLeaving: '',
    yearsAbroad: '',
    educationLevel: '',
    skills: '',
    businessExperience: '',
    
    // Family & Connections
    familyInRwanda: '',
    familyContacts: '',
    visitFrequency: '',
    propertyInRwanda: '',
    investmentsInRwanda: '',
    
    // Service Specific
    eventType: '',
    eventDate: '',
    eventLocation: '',
    eventDescription: '',
    documentsNeeded: '',
    urgencyLevel: '',
    
    // Supporting Information
    contributions: '',
    futureContactPreference: '',
    additionalInfo: ''
  });

  const serviceTypes = [
    { 
      value: 'document-assistance', 
      label: 'Document Assistance', 
      description: 'Help with Rwandan documents while abroad',
      icon: <FileText className="h-5 w-5" />,
      fee: 'Varies'
    },
    { 
      value: 'consular-services', 
      label: 'Consular Services', 
      description: 'Embassy and consular support services',
      icon: <Building className="h-5 w-5" />,
      fee: 'Varies'
    },
    { 
      value: 'investment-support', 
      label: 'Investment Support', 
      description: 'Support for diaspora investments in Rwanda',
      icon: <DollarSign className="h-5 w-5" />,
      fee: 'Free'
    },
    { 
      value: 'community-events', 
      label: 'Community Events', 
      description: 'Organize or participate in diaspora events',
      icon: <Users className="h-5 w-5" />,
      fee: 'Free'
    },
    { 
      value: 'remittance-services', 
      label: 'Remittance Services', 
      description: 'Money transfer and remittance support',
      icon: <Globe className="h-5 w-5" />,
      fee: 'Varies'
    },
    { 
      value: 'return-support', 
      label: 'Return Support', 
      description: 'Assistance for returning to Rwanda',
      icon: <Home className="h-5 w-5" />,
      fee: 'Free'
    },
    { 
      value: 'skills-mapping', 
      label: 'Skills Mapping', 
      description: 'Register your skills for Rwanda development',
      icon: <Star className="h-5 w-5" />,
      fee: 'Free'
    }
  ];

  const diasporaPrograms = [
    {
      title: "Rwanda Diaspora Investment Fund",
      description: "Access funding and support for investment projects in Rwanda",
      benefits: ["Low-interest loans", "Business mentorship", "Tax incentives", "Investment protection"],
      eligibility: "Rwandans living abroad with investment projects"
    },
    {
      title: "Kwihangana Program",
      description: "Annual reunion and networking program for diaspora",
      benefits: ["Networking opportunities", "Skills exchange", "Cultural preservation", "Business partnerships"],
      eligibility: "All Rwandans living in diaspora"
    },
    {
      title: "Skills for Rwanda",
      description: "Share your expertise with Rwanda's development",
      benefits: ["Volunteer opportunities", "Short-term assignments", "Knowledge transfer", "Professional development"],
      eligibility: "Skilled professionals in diaspora"
    },
    {
      title: "Diaspora Bonds",
      description: "Investment opportunities in Rwanda's development",
      benefits: ["Competitive returns", "Support national development", "Portfolio diversification", "Tax benefits"],
      eligibility: "Diaspora with investment capacity"
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
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-8ee81f4f/applications/diaspora`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Diaspora service request submitted successfully!\n\nReference Number: ${result.referenceNumber}\n\nNext Steps: ${result.nextSteps}\n\nOur diaspora team will contact you soon.`);
      } else {
        throw new Error(result.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting diaspora services request:', error);
      alert('There was an error submitting your request. Please try again or contact support.');
    }
  };

  const renderServiceRequestForm = () => {
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
                    The Diaspora services are designed to strengthen the connection between Rwandans abroad 
                    and their homeland. We're here to support your journey and contributions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Personal & Contact Information</h3>
              
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
                    placeholder="City, District, Rwanda"
                  />
                </div>
                
                <div>
                  <Label htmlFor="passportNumber">Rwandan Passport Number</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) => updateFormData('passportNumber', e.target.value)}
                    placeholder="Enter passport number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentCountry">Current Country of Residence *</Label>
                  <Input
                    id="currentCountry"
                    value={formData.currentCountry}
                    onChange={(e) => updateFormData('currentCountry', e.target.value)}
                    placeholder="Country where you currently live"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="Include country code"
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
                <Label htmlFor="currentAddress">Current Address Abroad *</Label>
                <Textarea
                  id="currentAddress"
                  value={formData.currentAddress}
                  onChange={(e) => updateFormData('currentAddress', e.target.value)}
                  placeholder="Enter your complete address in your current country"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium text-navy-dark">Diaspora Background</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departureDate">Year Left Rwanda</Label>
                    <Input
                      id="departureDate"
                      value={formData.departureDate}
                      onChange={(e) => updateFormData('departureDate', e.target.value)}
                      placeholder="e.g., 2010"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="yearsAbroad">Years Living Abroad</Label>
                    <Select value={formData.yearsAbroad} onValueChange={(value) => updateFormData('yearsAbroad', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="11-15">11-15 years</SelectItem>
                        <SelectItem value="15+">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reasonForLeaving">Reason for Living Abroad</Label>
                  <Textarea
                    id="reasonForLeaving"
                    value={formData.reasonForLeaving}
                    onChange={(e) => updateFormData('reasonForLeaving', e.target.value)}
                    placeholder="Education, work, family, etc."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          );

        case 3:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Skills & Experience</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="educationLevel">Highest Education Level</Label>
                  <Select value={formData.educationLevel} onValueChange={(value) => updateFormData('educationLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="secondary">Secondary School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD/Doctorate</SelectItem>
                      <SelectItem value="professional">Professional Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="visitFrequency">How Often Do You Visit Rwanda?</Label>
                  <Select value={formData.visitFrequency} onValueChange={(value) => updateFormData('visitFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="2-3years">Every 2-3 years</SelectItem>
                      <SelectItem value="rarely">Rarely</SelectItem>
                      <SelectItem value="never">Never visited since leaving</SelectItem>
                      <SelectItem value="planning">Planning to visit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills & Expertise</Label>
                <Textarea
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => updateFormData('skills', e.target.value)}
                  placeholder="List your professional skills, expertise areas, languages, etc."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="businessExperience">Business/Entrepreneurial Experience</Label>
                <Textarea
                  id="businessExperience"
                  value={formData.businessExperience}
                  onChange={(e) => updateFormData('businessExperience', e.target.value)}
                  placeholder="Describe any business experience or entrepreneurial activities"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium text-navy-dark">Rwanda Connections</h4>
                
                <div>
                  <Label htmlFor="familyInRwanda">Family in Rwanda</Label>
                  <Textarea
                    id="familyInRwanda"
                    value={formData.familyInRwanda}
                    onChange={(e) => updateFormData('familyInRwanda', e.target.value)}
                    placeholder="Describe family members still in Rwanda"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="propertyInRwanda">Property/Assets in Rwanda</Label>
                  <Textarea
                    id="propertyInRwanda"
                    value={formData.propertyInRwanda}
                    onChange={(e) => updateFormData('propertyInRwanda', e.target.value)}
                    placeholder="Land, houses, businesses, etc."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="investmentsInRwanda">Current Investments in Rwanda</Label>
                  <Textarea
                    id="investmentsInRwanda"
                    value={formData.investmentsInRwanda}
                    onChange={(e) => updateFormData('investmentsInRwanda', e.target.value)}
                    placeholder="Describe any current investments or business interests"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          );

        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4 text-navy-dark">Service Request Details</h3>
              
              {(serviceType === 'community-events') && (
                <div className="space-y-4">
                  <h4 className="font-medium text-navy-dark">Event Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select value={formData.eventType} onValueChange={(value) => updateFormData('eventType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cultural">Cultural Celebration</SelectItem>
                          <SelectItem value="business">Business Networking</SelectItem>
                          <SelectItem value="educational">Educational Seminar</SelectItem>
                          <SelectItem value="fundraising">Fundraising Event</SelectItem>
                          <SelectItem value="memorial">Memorial/Commemoration</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="eventDate">Proposed Event Date</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => updateFormData('eventDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="eventLocation">Event Location</Label>
                    <Input
                      id="eventLocation"
                      value={formData.eventLocation}
                      onChange={(e) => updateFormData('eventLocation', e.target.value)}
                      placeholder="City, Country where event will be held"
                    />
                  </div>

                  <div>
                    <Label htmlFor="eventDescription">Event Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={formData.eventDescription}
                      onChange={(e) => updateFormData('eventDescription', e.target.value)}
                      placeholder="Describe the event, its purpose, expected attendance, etc."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="documentsNeeded">Documents/Support Needed</Label>
                <Textarea
                  id="documentsNeeded"
                  value={formData.documentsNeeded}
                  onChange={(e) => updateFormData('documentsNeeded', e.target.value)}
                  placeholder="Specify what documents, assistance, or support you need"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="urgencyLevel">Urgency Level</Label>
                <Select value={formData.urgencyLevel} onValueChange={(value) => updateFormData('urgencyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait 2-4 weeks</SelectItem>
                    <SelectItem value="medium">Medium - Need within 1-2 weeks</SelectItem>
                    <SelectItem value="high">High - Need within 1 week</SelectItem>
                    <SelectItem value="urgent">Urgent - Need within 2-3 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="contributions">How You'd Like to Contribute to Rwanda</Label>
                <Textarea
                  id="contributions"
                  value={formData.contributions}
                  onChange={(e) => updateFormData('contributions', e.target.value)}
                  placeholder="Describe how you would like to contribute to Rwanda's development"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="futureContactPreference">Future Communication Preference</Label>
                <Select value={formData.futureContactPreference} onValueChange={(value) => updateFormData('futureContactPreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email only</SelectItem>
                    <SelectItem value="phone">Phone calls preferred</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="social">Social media</SelectItem>
                    <SelectItem value="newsletter">Newsletter subscription</SelectItem>
                    <SelectItem value="minimal">Minimal contact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  placeholder="Any other information that would help us serve you better"
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
                Submit Request
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProgramsInfo = () => (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Rwanda values its diaspora community and has established various programs to maintain 
          strong connections and support your contributions to national development.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-6">
        {diasporaPrograms.map((program, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-navy-medium" />
                <span>{program.title}</span>
              </CardTitle>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-navy-dark mb-2">Benefits</h4>
                  <ul className="space-y-1 text-sm">
                    {program.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-navy-dark mb-2">Eligibility</h4>
                  <p className="text-sm text-navy-medium">{program.eligibility}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
        <h1 className="text-3xl mb-4 text-navy-dark">Diaspora Services</h1>
        <p className="text-lg text-navy-medium">Connecting Rwandans worldwide with their homeland</p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services">Request Services</TabsTrigger>
          <TabsTrigger value="programs">Diaspora Programs</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          {renderServiceRequestForm()}
        </TabsContent>

        <TabsContent value="programs">
          {renderProgramsInfo()}
        </TabsContent>
      </Tabs>

      {/* Contact Information */}
      <div className="mt-12">
        <Card className="bg-navy-dark text-blue-lightest">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Diaspora Support Center</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-light" />
                  <span>+250 722 17 46 11</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-light" />
                  <span>diaspora@migration.gov.rw</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-light" />
                  <span>DGIE Headquarters, Kigali</span>
                </div>
              </div>
              <p className="mt-4 text-blue-light">
                Dedicated support for Rwandans living abroad. We're here to help you stay connected.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}