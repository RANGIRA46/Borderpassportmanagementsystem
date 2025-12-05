import { useState } from "react";
import { WizardSteps } from "./modern/WizardSteps";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { 
  Plane, 
  Globe, 
  Calendar,
  Upload,
  CreditCard,
  Info,
  MapPin,
  Briefcase,
  Users,
  Home,
  CheckCircle
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

export function ModernVisaApplication() {
  const { t } = useTranslationWithParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Visa Type
    visaType: "",
    purpose: "",
    duration: "",
    
    // Personal Details
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    
    // Travel Information
    arrivalDate: "",
    departureDate: "",
    portOfEntry: "",
    accommodation: "",
    
    // Supporting Documents
    invitationLetter: null as File | null,
    hotelBooking: null as File | null,
    flightTicket: null as File | null,
    
    // Payment
    paymentMethod: ""
  });

  const steps = [
    {
      id: "type",
      title: t('visa.selectType', {}, 'Visa Type'),
      description: t('visa.typeDesc', {}, 'Choose your visa category'),
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: "personal",
      title: t('wizard.personalDetails', {}, 'Personal Details'),
      description: t('wizard.personalDesc', {}, 'Your information'),
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "travel",
      title: t('visa.travelInfo', {}, 'Travel Information'),
      description: t('visa.travelDesc', {}, 'Your trip details'),
      icon: <Plane className="h-5 w-5" />
    },
    {
      id: "documents",
      title: t('wizard.documents', {}, 'Documents'),
      description: t('wizard.documentsDesc', {}, 'Upload required files'),
      icon: <Upload className="h-5 w-5" />
    },
    {
      id: "payment",
      title: t('wizard.payment', {}, 'Payment'),
      description: t('wizard.paymentDesc', {}, 'Complete application'),
      icon: <CreditCard className="h-5 w-5" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toast.success(t('wizard.stepCompleted', {}, 'Step completed!'));
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success(t('visa.submitted', {}, 'Visa application submitted!'), {
      description: t('visa.reference', {}, 'Reference: RW-VISA-2024-001234')
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <VisaTypeStep formData={formData} setFormData={setFormData} />;
      case 1:
        return <PersonalDetailsStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <TravelInfoStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <DocumentsStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <PaymentStep formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-blue-lightest dark:bg-[#0a0a0a] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-medium to-navy-medium flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-navy-dark dark:text-white">
                {t('visa.application', {}, 'Visa Application')}
              </h1>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('visa.wizardDesc', {}, 'Apply for your Rwanda visa in 5 simple steps')}
              </p>
            </div>
          </div>

          <Alert className="mt-4 border-blue-medium/20 bg-blue-medium/5 dark:bg-blue-500/5">
            <Info className="h-4 w-4 text-blue-medium dark:text-blue-400" />
            <AlertDescription className="text-sm text-navy-dark dark:text-white">
              <strong>Processing time:</strong> Tourist visas: 3-5 days | Business visas: 5-7 days.
              E-Visa available for most nationalities.
            </AlertDescription>
          </Alert>
        </motion.div>

        <WizardSteps
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
        >
          {renderStepContent()}
        </WizardSteps>
      </div>
    </div>
  );
}

function VisaTypeStep({ formData, setFormData }: any) {
  const { t } = useTranslationWithParams();

  const visaTypes = [
    {
      id: 'tourist',
      title: 'Tourist Visa',
      description: 'For leisure, sightseeing, and visiting friends/family',
      icon: '🏖️',
      duration: 'Up to 30 days',
      fee: '$50',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'business',
      title: 'Business Visa',
      description: 'For conferences, meetings, and business activities',
      icon: '💼',
      duration: 'Up to 90 days',
      fee: '$100',
      color: 'from-navy-medium to-navy-dark'
    },
    {
      id: 'transit',
      title: 'Transit Visa',
      description: 'For passing through Rwanda en route to another country',
      icon: '✈️',
      duration: 'Up to 72 hours',
      fee: '$30',
      color: 'from-blue-light to-navy-medium'
    },
    {
      id: 'conference',
      title: 'Conference Visa',
      description: 'For attending official conferences and events',
      icon: '🎤',
      duration: 'Event duration',
      fee: '$50',
      color: 'from-navy-dark to-blue-medium'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-navy-dark dark:text-white mb-4">
          Select Your Visa Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visaTypes.map((visa) => (
            <motion.div
              key={visa.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                onClick={() => setFormData({ ...formData, visaType: visa.id })}
                className={`p-6 cursor-pointer transition-all ${
                  formData.visaType === visa.id
                    ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/5 shadow-lg'
                    : 'border-navy-medium/10 hover:border-navy-medium/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${visa.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {visa.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-navy-dark dark:text-white">
                        {visa.title}
                      </h4>
                      {formData.visaType === visa.id && (
                        <CheckCircle className="h-5 w-5 text-navy-medium dark:text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-navy-medium/70 dark:text-white/60 mb-3">
                      {visa.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <Badge variant="outline" className="border-navy-medium/20">
                        <Calendar className="h-3 w-3 mr-1" />
                        {visa.duration}
                      </Badge>
                      <Badge variant="outline" className="border-green-500/20 text-green-700 dark:text-green-400">
                        {visa.fee}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="purpose">
            Purpose of Visit <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="purpose"
            value={formData.purpose}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="Briefly describe the purpose of your visit..."
            className="min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">
            Intended Duration of Stay <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => setFormData({ ...formData, duration: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-7">1-7 days</SelectItem>
              <SelectItem value="8-14">8-14 days</SelectItem>
              <SelectItem value="15-30">15-30 days</SelectItem>
              <SelectItem value="30+">30+ days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function PersonalDetailsStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="As shown in passport"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="As shown in passport"
            className="h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of Birth <span className="text-red-500">*</span>
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">
            Nationality <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            placeholder="Country of citizenship"
            className="h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="passportNumber">
            Passport Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="passportNumber"
            value={formData.passportNumber}
            onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
            placeholder="e.g., AB1234567"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passportExpiry">
            Passport Expiry Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="passportExpiry"
            type="date"
            value={formData.passportExpiry}
            onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
            className="h-12"
          />
        </div>
      </div>

      <Alert className="border-blue-medium/20 bg-blue-medium/5">
        <Info className="h-4 w-4 text-blue-medium" />
        <AlertDescription className="text-sm">
          Your passport must be valid for at least 6 months from your intended date of entry into Rwanda.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function TravelInfoStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="arrivalDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Arrival Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="arrivalDate"
            type="date"
            value={formData.arrivalDate}
            onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departureDate" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Departure Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="departureDate"
            type="date"
            value={formData.departureDate}
            onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="portOfEntry" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Port of Entry <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.portOfEntry}
          onValueChange={(value) => setFormData({ ...formData, portOfEntry: value })}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select port of entry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kigali">Kigali International Airport</SelectItem>
            <SelectItem value="rusizi">Rusizi Border Post</SelectItem>
            <SelectItem value="gatuna">Gatuna Border Post</SelectItem>
            <SelectItem value="kagitumba">Kagitumba Border Post</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accommodation" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Accommodation in Rwanda <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="accommodation"
          value={formData.accommodation}
          onChange={(e) => setFormData({ ...formData, accommodation: e.target.value })}
          placeholder="Hotel name and address or host contact details..."
          className="min-h-24"
        />
      </div>
    </div>
  );
}

function DocumentsStep({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <Alert className="border-blue-medium/20 bg-blue-medium/5">
        <Info className="h-4 w-4 text-blue-medium" />
        <AlertDescription className="text-sm">
          <strong>Required documents:</strong> All files must be clear, in PDF or JPG format, max 5MB each.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label className="text-base mb-3 block">
            Invitation Letter or Hotel Booking <span className="text-red-500">*</span>
          </Label>
          <Card className="p-6 border-dashed border-2 border-navy-medium/20 hover:border-navy-medium/40 transition-all cursor-pointer bg-blue-lightest/50 dark:bg-[#1a2a3a]">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-navy-medium to-blue-medium flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium text-navy-dark dark:text-white mb-2">
                Upload invitation or booking confirmation
              </h3>
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mb-2">
                PDF or Image • Max 5MB
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Label className="text-base mb-3 block">
            Flight Ticket (Optional)
          </Label>
          <Card className="p-6 border-dashed border-2 border-navy-medium/20 hover:border-navy-medium/40 transition-all cursor-pointer bg-blue-lightest/50 dark:bg-[#1a2a3a]">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-medium to-navy-dark flex items-center justify-center mb-4">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium text-navy-dark dark:text-white mb-2">
                Upload flight itinerary
              </h3>
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mb-2">
                PDF or Image • Max 5MB
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ formData, setFormData }: any) {
  const fees = [
    { label: "Visa Fee", amount: formData.visaType === 'business' ? 100 : formData.visaType === 'transit' ? 30 : 50 },
    { label: "Processing Fee", amount: 10 },
    { label: "Service Charge", amount: 5 }
  ];

  const total = fees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] border-navy-medium/10">
        <h3 className="font-medium text-navy-dark dark:text-white mb-4">
          Fee Breakdown
        </h3>
        <div className="space-y-3">
          {fees.map((fee, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-navy-medium/80 dark:text-white/70">{fee.label}</span>
              <span className="font-medium text-navy-dark dark:text-white">
                ${fee.amount}
              </span>
            </div>
          ))}
          <div className="border-t border-navy-medium/20 dark:border-white/10 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-medium text-navy-dark dark:text-white">Total Amount</span>
              <span className="text-xl font-bold text-navy-dark dark:text-white">
                ${total} USD
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Label className="text-base">
          Select Payment Method <span className="text-red-500">*</span>
        </Label>
        
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          className="space-y-3"
        >
          <Card className={`p-4 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5' : 'border-navy-medium/10'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="text-2xl">💳</div>
                <div>
                  <div className="font-medium text-navy-dark dark:text-white">Credit/Debit Card</div>
                  <div className="text-sm text-navy-medium/60 dark:text-white/60">Visa, Mastercard, Amex</div>
                </div>
              </Label>
            </div>
          </Card>

          <Card className={`p-4 cursor-pointer transition-all ${formData.paymentMethod === 'momo' ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5' : 'border-navy-medium/10'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-medium text-navy-dark dark:text-white">Mobile Money</div>
                  <div className="text-sm text-navy-medium/60 dark:text-white/60">MTN, Airtel</div>
                </div>
              </Label>
            </div>
          </Card>
        </RadioGroup>
      </div>

      <Alert className="border-green-500/20 bg-green-500/5">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-sm">
          Payment secured with SSL encryption. E-Visa will be sent to your email within 3-7 business days.
        </AlertDescription>
      </Alert>
    </div>
  );
}
