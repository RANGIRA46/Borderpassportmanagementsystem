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

export function PassportApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    gender: '',
    
    // Contact Information
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Passport Details
    applicationType: '',
    passportType: '',
    expedited: false,
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    alert('Application submitted successfully! Your reference number is: PP2024001234');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">Place of Birth *</Label>
                <Input
                  id="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Gender *</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-medium">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-medium">Passport Details</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Application Type *</Label>
                <RadioGroup
                  value={formData.applicationType}
                  onValueChange={(value) => handleInputChange('applicationType', value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className="flex-1 cursor-pointer">New Passport</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="renewal" id="renewal" />
                    <Label htmlFor="renewal" className="flex-1 cursor-pointer">Passport Renewal</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="replacement" id="replacement" />
                    <Label htmlFor="replacement" className="flex-1 cursor-pointer">Passport Replacement</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passportType">Passport Type *</Label>
                <Select onValueChange={(value) => handleInputChange('passportType', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select passport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular Passport Book</SelectItem>
                    <SelectItem value="card">Passport Card</SelectItem>
                    <SelectItem value="both">Both Book and Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <Checkbox
                  id="expedited"
                  checked={formData.expedited}
                  onCheckedChange={(checked) => handleInputChange('expedited', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="expedited" className="cursor-pointer text-base">
                    Expedited Processing (+$60)
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive your passport in 2-3 business days instead of the standard 5-7 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-medium">Emergency Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name *</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="emergencyRelation">Relationship *</Label>
                <Select onValueChange={(value) => handleInputChange('emergencyRelation', value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 bg-muted rounded-lg">
              <h4 className="font-medium mb-4">Application Summary</h4>
              <div className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{formData.applicationType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passport:</span>
                  <span>{formData.passportType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expedited:</span>
                  <span>{formData.expedited ? 'Yes' : 'No'}</span>
                </div>
                <div className="pt-3 border-t flex flex-wrap gap-2">
                  <Badge className="text-sm">Processing Fee: $130</Badge>
                  {formData.expedited && <Badge variant="secondary" className="text-sm">Expedited Fee: $60</Badge>}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
                <span>📋</span>
                <span>Passport Application</span>
              </CardTitle>
              <CardDescription className="mt-2 text-sm sm:text-base">
                Step {currentStep} of {totalSteps}: Complete your passport application
              </CardDescription>
            </div>
            <Badge variant="outline" className="self-start sm:self-center">
              Application ID: PA2024001234
            </Badge>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {renderStepContent()}
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="h-11 sm:w-auto"
            >
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={handleNextStep} className="h-11 sm:w-auto">
                Next Step
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="h-11 sm:w-auto">
                Submit Application
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}