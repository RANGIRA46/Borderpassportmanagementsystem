import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, Upload, FileText, CreditCard } from "lucide-react";
import { cn } from "./ui/utils";

export function VisaApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    visaType: '',
    purpose: '',
    duration: '',
    entryType: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    email: '',
    phone: '',
    address: '',
    occupation: '',
    employer: '',
    travelHistory: '',
    accommodationDetails: '',
    sponsor: '',
    financialSupport: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentLocation: '',
    paymentMethod: ''
  });

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const visaTypes = [
    { value: 'tourist', label: 'Tourist Visa', duration: '30-90 days', fee: '$50' },
    { value: 'business', label: 'Business Visa', duration: '30-180 days', fee: '$100' },
    { value: 'student', label: 'Student Visa', duration: '1-4 years', fee: '$200' },
    { value: 'work', label: 'Work Visa', duration: '1-3 years', fee: '$300' },
    { value: 'transit', label: 'Transit Visa', duration: '72 hours', fee: '$25' },
    { value: 'diplomatic', label: 'Diplomatic Visa', duration: 'As required', fee: 'Exempt' }
  ];

  const appointmentSlots = [
    { time: '09:00', available: true },
    { time: '10:00', available: false },
    { time: '11:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: false },
    { time: '16:00', available: true }
  ];

  const requiredDocuments = {
    tourist: ['passport', 'photo', 'itinerary', 'accommodation', 'financial'],
    business: ['passport', 'photo', 'invitation', 'company-letter', 'financial'],
    student: ['passport', 'photo', 'admission-letter', 'financial', 'academic'],
    work: ['passport', 'photo', 'work-permit', 'contract', 'qualifications'],
    transit: ['passport', 'photo', 'onward-ticket'],
    diplomatic: ['passport', 'diplomatic-note', 'official-letter']
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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

  const submitApplication = () => {
    alert('Visa application submitted successfully! Reference: VA2024001234');
  };

  const getStepTitle = (step: number) => {
    const titles = {
      1: 'Visa Type & Purpose',
      2: 'Personal Information',
      3: 'Travel & Accommodation',
      4: 'Document Upload',
      5: 'Appointment Booking',
      6: 'Payment & Review'
    };
    return titles[step as keyof typeof titles];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3>Visa Type & Purpose</h3>
            <div className="grid grid-cols-1 gap-4">
              {visaTypes.map((visa) => (
                <div
                  key={visa.value}
                  className={cn(
                    "border rounded-lg p-4 cursor-pointer transition-all",
                    formData.visaType === visa.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleInputChange('visaType', visa.value)}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroup value={formData.visaType} onValueChange={(value) => handleInputChange('visaType', value)}>
                      <RadioGroupItem value={visa.value} id={visa.value} />
                    </RadioGroup>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{visa.label}</h4>
                          <p className="text-sm text-muted-foreground">Duration: {visa.duration}</p>
                        </div>
                        <Badge variant="outline">{visa.fee}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Select onValueChange={(value) => handleInputChange('purpose', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tourism">Tourism</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="conference">Conference/Meeting</SelectItem>
                    <SelectItem value="medical">Medical Treatment</SelectItem>
                    <SelectItem value="family">Visiting Family/Friends</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Intended Duration of Stay</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 14 days"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
              </div>
              <div>
                <Label>Entry Type</Label>
                <RadioGroup
                  value={formData.entryType}
                  onValueChange={(value) => handleInputChange('entryType', value)}
                  className="flex space-x-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single">Single Entry</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple" id="multiple" />
                    <Label htmlFor="multiple">Multiple Entry</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3>Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality *</Label>
                <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                    <SelectItem value="fr">France</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="passportNumber">Passport Number *</Label>
                <Input
                  id="passportNumber"
                  value={formData.passportNumber}
                  onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="passportExpiry">Passport Expiry Date *</Label>
                <Input
                  id="passportExpiry"
                  type="date"
                  value={formData.passportExpiry}
                  onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Current Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="employer">Employer</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3>Travel & Accommodation Details</h3>
            <div>
              <Label htmlFor="accommodationDetails">Accommodation Details *</Label>
              <Textarea
                id="accommodationDetails"
                placeholder="Hotel name, address, or host details"
                value={formData.accommodationDetails}
                onChange={(e) => handleInputChange('accommodationDetails', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="travelHistory">Recent Travel History</Label>
              <Textarea
                id="travelHistory"
                placeholder="List countries visited in the last 5 years"
                value={formData.travelHistory}
                onChange={(e) => handleInputChange('travelHistory', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sponsor">Sponsor/Inviting Party</Label>
                <Input
                  id="sponsor"
                  placeholder="Name and contact details"
                  value={formData.sponsor}
                  onChange={(e) => handleInputChange('sponsor', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="financialSupport">Financial Support</Label>
                <Select onValueChange={(value) => handleInputChange('financialSupport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who will cover expenses?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">Self-funded</SelectItem>
                    <SelectItem value="sponsor">Sponsored</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="scholarship">Scholarship</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3>Document Upload</h3>
            <div className="bg-muted p-4 rounded-lg">
              <h4>Required Documents for {formData.visaType} Visa:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                {formData.visaType && requiredDocuments[formData.visaType as keyof typeof requiredDocuments]?.map((doc, index) => (
                  <li key={index}>{doc.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
                ))}
              </ul>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <h4>Upload Documents</h4>
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to select
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4>Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3>Appointment Booking</h3>
            <div>
              <Label>Select Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedDate && (
              <div>
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {appointmentSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={formData.appointmentTime === slot.time ? "default" : "outline"}
                      disabled={!slot.available}
                      onClick={() => handleInputChange('appointmentTime', slot.time)}
                      className="h-12"
                    >
                      {slot.time}
                      {!slot.available && (
                        <span className="ml-2 text-xs">(Booked)</span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="appointmentLocation">Appointment Location</Label>
              <Select onValueChange={(value) => handleInputChange('appointmentLocation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-office">Main Immigration Office</SelectItem>
                  <SelectItem value="embassy-downtown">Embassy Downtown</SelectItem>
                  <SelectItem value="consulate-north">Consulate North Branch</SelectItem>
                  <SelectItem value="service-center">Visa Service Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3>Payment & Final Review</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Application Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Visa Type:</span>
                    <p>{formData.visaType}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Purpose:</span>
                    <p>{formData.purpose}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Applicant:</span>
                    <p>{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nationality:</span>
                    <p>{formData.nationality}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Appointment:</span>
                    <p>{selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'} at {formData.appointmentTime}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p>{formData.appointmentLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Visa Processing Fee:</span>
                    <span>$100.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service Charge:</span>
                    <span>$10.00</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center font-medium">
                    <span>Total Amount:</span>
                    <span>$110.00</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mobile" id="mobile" />
                      <Label htmlFor="mobile">Mobile Money</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank">Bank Transfer</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="mt-4 space-y-3">
                    <Input placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" />
                    </div>
                    <Input placeholder="Cardholder Name" />
                  </div>
                )}

                {formData.paymentMethod === 'mobile' && (
                  <div className="mt-4 space-y-3">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mobile Money Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                        <SelectItem value="orange">Orange Money</SelectItem>
                        <SelectItem value="tigo">Tigo Cash</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Mobile Number" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>📄</span>
                <span>Visa Application</span>
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {totalSteps}: {getStepTitle(currentStep)}
              </CardDescription>
            </div>
            <Badge variant="outline">
              Application ID: VA2024001234
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                Next Step
              </Button>
            ) : (
              <Button onClick={submitApplication}>
                Submit Application & Pay
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}