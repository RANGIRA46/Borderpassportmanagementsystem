import { useState } from "react";
import { 
  Globe, 
  MapPin, 
  Users, 
  FileText, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Plane,
  Car,
  Ship,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { CountrySelector, PhoneInput, Country } from "./utils/CountrySelector";
import { DatePicker } from "./utils/DatePicker";
import { AutoFillDocuments, PersonalInfo } from "./utils/AutoFillDocuments";
import { useTranslation, T } from "./utils/LanguageSelector";

interface CEPGLApplication {
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: Date | undefined;
    nationality: string;
    gender: string;
    placeOfBirth: string;
    maritalStatus: string;
    occupation: string;
  };
  contactInfo: {
    phoneNumber: string;
    email: string;
    residentialAddress: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  travelInfo: {
    purposeOfTravel: string;
    destinationCountries: string[];
    travelMode: string;
    estimatedDuration: string;
    accommodationInfo: string;
    sponsorInfo?: string;
  };
  documents: {
    nationalId: string;
    passport?: string;
    birthCertificate?: string;
    proofOfResidence: boolean;
    photographs: boolean;
  };
}

const CEPGL_COUNTRIES = [
  { code: "CD", name: "Democratic Republic of Congo", flag: "🇨🇩" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" }
];

const TRAVEL_PURPOSES = [
  "Business",
  "Tourism", 
  "Family Visit",
  "Medical Treatment",
  "Education",
  "Conference/Meeting",
  "Religious Activities",
  "Cultural Exchange",
  "Research",
  "Other"
];

const TRAVEL_MODES = [
  { id: "air", label: "Air Travel", icon: Plane },
  { id: "road", label: "Road Transport", icon: Car },
  { id: "water", label: "Water Transport", icon: Ship }
];

export function CEPGLService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [application, setApplication] = useState<CEPGLApplication>({
    personalInfo: {
      firstName: "",
      lastName: "",
      middleName: "",
      dateOfBirth: undefined,
      nationality: "",
      gender: "",
      placeOfBirth: "",
      maritalStatus: "",
      occupation: ""
    },
    contactInfo: {
      phoneNumber: "",
      email: "",
      residentialAddress: "",
      emergencyContact: "",
      emergencyPhone: ""
    },
    travelInfo: {
      purposeOfTravel: "",
      destinationCountries: [],
      travelMode: "",
      estimatedDuration: "",
      accommodationInfo: "",
      sponsorInfo: ""
    },
    documents: {
      nationalId: "",
      passport: "",
      birthCertificate: "",
      proofOfResidence: false,
      photographs: false
    }
  });
  
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const { translate } = useTranslation();

  const handleAutoFill = (data: PersonalInfo) => {
    setApplication(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName || "",
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        nationality: data.nationality,
        gender: data.gender,
        placeOfBirth: data.placeOfBirth
      },
      documents: {
        ...prev.documents,
        nationalId: data.documentType === "nationalId" ? data.documentNumber : prev.documents.nationalId,
        passport: data.documentType === "passport" ? data.documentNumber : prev.documents.passport
      }
    }));
  };

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setApplication(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        nationality: country.code
      }
    }));
  };

  const updatePersonalInfo = (field: string, value: any) => {
    setApplication(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateContactInfo = (field: string, value: string) => {
    setApplication(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const updateTravelInfo = (field: string, value: any) => {
    setApplication(prev => ({
      ...prev,
      travelInfo: {
        ...prev.travelInfo,
        [field]: value
      }
    }));
  };

  const updateDocuments = (field: string, value: any) => {
    setApplication(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          application.personalInfo.firstName &&
          application.personalInfo.lastName &&
          application.personalInfo.dateOfBirth &&
          application.personalInfo.nationality &&
          application.personalInfo.gender
        );
      case 2:
        return !!(
          application.contactInfo.phoneNumber &&
          application.contactInfo.email &&
          application.contactInfo.residentialAddress
        );
      case 3:
        return !!(
          application.travelInfo.purposeOfTravel &&
          application.travelInfo.destinationCountries.length > 0 &&
          application.travelInfo.travelMode
        );
      case 4:
        return !!(
          application.documents.nationalId &&
          application.documents.proofOfResidence &&
          application.documents.photographs
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setApplicationSubmitted(true);
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (applicationSubmitted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Application Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-4">
              Your CEPGL travel document application has been received and is being processed.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-medium">Reference Number: CEPGL-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Processing time: 5-7 business days
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => window.print()}>
                Download Receipt
              </Button>
              <Button variant="outline" onClick={() => setApplicationSubmitted(false)}>
                Submit Another Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Globe className="h-8 w-8" />
          CEPGL Travel Document Application
        </h1>
        <p className="text-muted-foreground">
          Apply for travel documents under the Economic Community of the Great Lakes Countries
        </p>
      </div>

      {/* CEPGL Information */}
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertDescription>
          <strong>About CEPGL:</strong> The Economic Community of the Great Lakes Countries (CEPGL) facilitates 
          free movement of people and goods between member states: Democratic Republic of Congo, Rwanda, and Burundi.
        </AlertDescription>
      </Alert>

      {/* Member Countries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            CEPGL Member Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {CEPGL_COUNTRIES.map((country) => (
              <div key={country.code} className="text-center p-3 border rounded-lg">
                <div className="text-3xl mb-2">{country.flag}</div>
                <p className="font-medium">{country.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 5: {
                currentStep === 1 ? "Personal Information" :
                currentStep === 2 ? "Contact Details" :
                currentStep === 3 ? "Travel Information" :
                currentStep === 4 ? "Documents" : "Review & Submit"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                <h3 className="text-lg font-medium">Personal Information</h3>
              </div>

              <AutoFillDocuments
                onDataExtracted={handleAutoFill}
                acceptedDocuments={["passport", "nationalId", "cepgl"]}
                className="mb-6"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={application.personalInfo.firstName}
                    onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={application.personalInfo.lastName}
                    onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={application.personalInfo.middleName}
                    onChange={(e) => updatePersonalInfo("middleName", e.target.value)}
                  />
                </div>
                <div>
                  <DatePicker
                    value={application.personalInfo.dateOfBirth}
                    onValueChange={(date) => updatePersonalInfo("dateOfBirth", date)}
                    nationality={application.personalInfo.nationality}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <CountrySelector
                    value={application.personalInfo.nationality}
                    onValueChange={handleCountryChange}
                    prioritizeRegions={["CEPGL", "EAC"]}
                    showFlag={true}
                    showRegion={true}
                  />
                </div>
                <div>
                  <Label>Gender *</Label>
                  <RadioGroup 
                    value={application.personalInfo.gender}
                    onValueChange={(value) => updatePersonalInfo("gender", value)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="M" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="F" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="placeOfBirth">Place of Birth</Label>
                  <Input
                    id="placeOfBirth"
                    value={application.personalInfo.placeOfBirth}
                    onChange={(e) => updatePersonalInfo("placeOfBirth", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={application.personalInfo.occupation}
                    onChange={(e) => updatePersonalInfo("occupation", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                <h3 className="text-lg font-medium">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <PhoneInput
                    value={application.contactInfo.phoneNumber}
                    onValueChange={(value) => updateContactInfo("phoneNumber", value)}
                    countryCode={application.personalInfo.nationality}
                    onCountryChange={handleCountryChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={application.contactInfo.email}
                    onChange={(e) => updateContactInfo("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={application.contactInfo.emergencyContact}
                    onChange={(e) => updateContactInfo("emergencyContact", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Residential Address *</Label>
                  <Textarea
                    id="address"
                    value={application.contactInfo.residentialAddress}
                    onChange={(e) => updateContactInfo("residentialAddress", e.target.value)}
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Plane className="h-5 w-5" />
                <h3 className="text-lg font-medium">Travel Information</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Purpose of Travel *</Label>
                  <select
                    id="purpose"
                    value={application.travelInfo.purposeOfTravel}
                    onChange={(e) => updateTravelInfo("purposeOfTravel", e.target.value)}
                    className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                    required
                  >
                    <option value="">Select purpose</option>
                    {TRAVEL_PURPOSES.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Destination Countries *</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {CEPGL_COUNTRIES.map((country) => (
                      <div key={country.code} className="flex items-center space-x-2">
                        <Checkbox
                          id={country.code}
                          checked={application.travelInfo.destinationCountries.includes(country.code)}
                          onCheckedChange={(checked) => {
                            const destinations = application.travelInfo.destinationCountries;
                            if (checked) {
                              updateTravelInfo("destinationCountries", [...destinations, country.code]);
                            } else {
                              updateTravelInfo("destinationCountries", destinations.filter(c => c !== country.code));
                            }
                          }}
                        />
                        <Label htmlFor={country.code} className="flex items-center gap-2">
                          {country.flag} {country.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Mode of Travel *</Label>
                  <RadioGroup 
                    value={application.travelInfo.travelMode}
                    onValueChange={(value) => updateTravelInfo("travelMode", value)}
                    className="grid grid-cols-3 gap-4 mt-2"
                  >
                    {TRAVEL_MODES.map(mode => {
                      const Icon = mode.icon;
                      return (
                        <div key={mode.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={mode.id} id={mode.id} />
                          <Label htmlFor={mode.id} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {mode.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="duration">Estimated Duration of Stay</Label>
                  <Input
                    id="duration"
                    value={application.travelInfo.estimatedDuration}
                    onChange={(e) => updateTravelInfo("estimatedDuration", e.target.value)}
                    placeholder="e.g., 2 weeks, 1 month"
                  />
                </div>

                <div>
                  <Label htmlFor="accommodation">Accommodation Information</Label>
                  <Textarea
                    id="accommodation"
                    value={application.travelInfo.accommodationInfo}
                    onChange={(e) => updateTravelInfo("accommodationInfo", e.target.value)}
                    placeholder="Hotel details, host information, etc."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5" />
                <h3 className="text-lg font-medium">Required Documents</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="nationalId">National ID Number *</Label>
                  <Input
                    id="nationalId"
                    value={application.documents.nationalId}
                    onChange={(e) => updateDocuments("nationalId", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="passport">Passport Number (if available)</Label>
                  <Input
                    id="passport"
                    value={application.documents.passport}
                    onChange={(e) => updateDocuments("passport", e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="proofOfResidence"
                      checked={application.documents.proofOfResidence}
                      onCheckedChange={(checked) => updateDocuments("proofOfResidence", checked)}
                    />
                    <Label htmlFor="proofOfResidence">Proof of residence uploaded *</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="photographs"
                      checked={application.documents.photographs}
                      onCheckedChange={(checked) => updateDocuments("photographs", checked)}
                    />
                    <Label htmlFor="photographs">Passport-size photographs uploaded *</Label>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    All documents must be clear, legible, and in PDF or image format (JPG, PNG). 
                    Ensure all information is visible and matches your application details.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5" />
                <h3 className="text-lg font-medium">Review Application</h3>
              </div>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="travel">Travel</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {application.personalInfo.firstName} {application.personalInfo.middleName} {application.personalInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {application.personalInfo.dateOfBirth?.toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nationality</p>
                      <p className="font-medium">{application.personalInfo.nationality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">{application.personalInfo.gender}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.contactInfo.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.contactInfo.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">{application.contactInfo.residentialAddress}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="travel" className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Purpose</p>
                      <p className="font-medium">{application.travelInfo.purposeOfTravel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mode of Travel</p>
                      <p className="font-medium">{application.travelInfo.travelMode}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Destinations</p>
                      <div className="flex gap-2">
                        {application.travelInfo.destinationCountries.map(code => {
                          const country = CEPGL_COUNTRIES.find(c => c.code === code);
                          return (
                            <Badge key={code} variant="secondary">
                              {country?.flag} {country?.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>National ID:</span>
                      <span className="font-medium">{application.documents.nationalId}</span>
                    </div>
                    {application.documents.passport && (
                      <div className="flex justify-between">
                        <span>Passport:</span>
                        <span className="font-medium">{application.documents.passport}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Proof of Residence:</span>
                      <Badge variant={application.documents.proofOfResidence ? "default" : "destructive"}>
                        {application.documents.proofOfResidence ? "Uploaded" : "Missing"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Photographs:</span>
                      <Badge variant={application.documents.photographs ? "default" : "destructive"}>
                        {application.documents.photographs ? "Uploaded" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Information:</strong> Your application will be processed within 5-7 business days. 
                  You will receive email notifications about status updates. Processing fee: $25 USD.
                </AlertDescription>
              </Alert>
            </div>
          )}
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
        
        {currentStep < 5 ? (
          <Button 
            onClick={nextStep}
            disabled={!validateStep(currentStep)}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={!validateStep(currentStep) || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}