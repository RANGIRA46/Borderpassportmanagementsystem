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
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { 
  User, 
  MapPin, 
  Camera, 
  CreditCard, 
  CheckCircle,
  Upload,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  Calendar,
  Shield,
  Info
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner@2.0.3";

export function ModernPassportApplication() {
  const { t } = useTranslationWithParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "Rwanda",
    placeOfBirth: "",
    
    // Contact Information
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    
    // Document Details
    passportType: "",
    processingSpeed: "standard",
    currentPassportNumber: "",
    
    // Upload
    photo: null as File | null,
    idDocument: null as File | null,
    
    // Payment
    paymentMethod: ""
  });

  const steps = [
    {
      id: "personal",
      title: t('wizard.personalDetails', {}, 'Personal Details'),
      description: t('wizard.personalDesc', {}, 'Tell us about yourself'),
      icon: <User className="h-5 w-5" />
    },
    {
      id: "contact",
      title: t('wizard.contactInfo', {}, 'Contact Information'),
      description: t('wizard.contactDesc', {}, 'How can we reach you?'),
      icon: <Phone className="h-5 w-5" />
    },
    {
      id: "documents",
      title: t('wizard.documents', {}, 'Documents'),
      description: t('wizard.documentsDesc', {}, 'Upload required files'),
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "payment",
      title: t('wizard.payment', {}, 'Payment'),
      description: t('wizard.paymentDesc', {}, 'Complete your application'),
      icon: <CreditCard className="h-5 w-5" />
    }
  ];

  const handleNext = () => {
    // Validation logic here
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
    toast.success(t('wizard.applicationSubmitted', {}, 'Application submitted successfully!'), {
      description: t('wizard.referenceNumber', {}, 'Reference: RW-PASS-2024-001234')
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalDetailsStep formData={formData} setFormData={setFormData} />;
      case 1:
        return <ContactInformationStep formData={formData} setFormData={setFormData} />;
      case 2:
        return <DocumentsStep formData={formData} setFormData={setFormData} />;
      case 3:
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
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-navy-dark to-navy-medium flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-navy-dark dark:text-white">
                {t('passport.newApplication', {}, 'Passport Application')}
              </h1>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('passport.wizardDesc', {}, 'Complete your application in 4 simple steps')}
              </p>
            </div>
          </div>

          {/* Info Alert */}
          <Alert className="mt-4 border-blue-medium/20 bg-blue-medium/5 dark:bg-blue-500/5">
            <Info className="h-4 w-4 text-blue-medium dark:text-blue-400" />
            <AlertDescription className="text-sm text-navy-dark dark:text-white">
              <strong>Estimated processing time:</strong> 3-5 business days for standard processing.
              All fields marked with * are required.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Wizard */}
        <WizardSteps
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          nextLabel={t('wizard.continue', {}, 'Continue')}
          backLabel={t('wizard.back', {}, 'Back')}
          submitLabel={t('wizard.submitApplication', {}, 'Submit Application')}
        >
          {renderStepContent()}
        </WizardSteps>
      </div>
    </div>
  );
}

// Step Components
function PersonalDetailsStep({ formData, setFormData }: any) {
  const { t } = useTranslationWithParams();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="flex items-center gap-1">
            {t('form.firstName', {}, 'First Name')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder={t('form.enterFirstName', {}, 'Enter your first name')}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="flex items-center gap-1">
            {t('form.lastName', {}, 'Last Name')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder={t('form.enterLastName', {}, 'Enter your last name')}
            className="h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="flex items-center gap-1">
            {t('form.dateOfBirth', {}, 'Date of Birth')} <span className="text-red-500">*</span>
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
          <Label className="flex items-center gap-1">
            {t('form.gender', {}, 'Gender')} <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={formData.gender}
            onValueChange={(value) => setFormData({ ...formData, gender: value })}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male" className="cursor-pointer">{t('form.male', {}, 'Male')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female" className="cursor-pointer">{t('form.female', {}, 'Female')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="cursor-pointer">{t('form.other', {}, 'Other')}</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="placeOfBirth" className="flex items-center gap-1">
            {t('form.placeOfBirth', {}, 'Place of Birth')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
            placeholder={t('form.enterPlaceOfBirth', {}, 'City, Country')}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">
            {t('form.nationality', {}, 'Nationality')}
          </Label>
          <Select
            value={formData.nationality}
            onValueChange={(value) => setFormData({ ...formData, nationality: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Rwanda">Rwanda</SelectItem>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Uganda">Uganda</SelectItem>
              <SelectItem value="Tanzania">Tanzania</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Help Card */}
      <Card className="p-4 bg-blue-lightest dark:bg-[#1a2a3a] border-blue-medium/20">
        <div className="flex gap-3">
          <Info className="h-5 w-5 text-blue-medium dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-navy-dark dark:text-white">
            <strong>Tip:</strong> Make sure your information matches your national ID card exactly.
            Any discrepancies may delay processing.
          </div>
        </div>
      </Card>
    </div>
  );
}

function ContactInformationStep({ formData, setFormData }: any) {
  const { t } = useTranslationWithParams();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            {t('form.email', {}, 'Email Address')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="example@email.com"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {t('form.phone', {}, 'Phone Number')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+250 XXX XXX XXX"
            className="h-12"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {t('form.address', {}, 'Physical Address')} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder={t('form.enterAddress', {}, 'Street address')}
          className="h-12"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">
            {t('form.city', {}, 'City')} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Kigali"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">
            {t('form.district', {}, 'District')} <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.district}
            onValueChange={(value) => setFormData({ ...formData, district: value })}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasabo">Gasabo</SelectItem>
              <SelectItem value="kicukiro">Kicukiro</SelectItem>
              <SelectItem value="nyarugenge">Nyarugenge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Alert className="border-green-500/20 bg-green-500/5">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-sm">
          We'll send application updates to your email and phone number.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function DocumentsStep({ formData, setFormData }: any) {
  const { t } = useTranslationWithParams();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base mb-4 block">
            {t('form.uploadPhoto', {}, 'Upload Passport Photo')} <span className="text-red-500">*</span>
          </Label>
          <Card className="p-6 border-dashed border-2 border-navy-medium/20 dark:border-white/10 hover:border-navy-medium/40 dark:hover:border-blue-500/50 transition-all cursor-pointer bg-blue-lightest/50 dark:bg-[#1a2a3a]">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-navy-medium to-blue-medium flex items-center justify-center mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium text-navy-dark dark:text-white mb-2">
                Click to upload or drag and drop
              </h3>
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mb-2">
                JPEG or PNG • Max 5MB • 600x600px minimum
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </Card>
          <p className="text-xs text-navy-medium/60 dark:text-white/60 mt-2">
            Photo must be taken within the last 6 months with a plain white background
          </p>
        </div>

        <div>
          <Label className="text-base mb-4 block">
            {t('form.uploadID', {}, 'National ID or Birth Certificate')} <span className="text-red-500">*</span>
          </Label>
          <Card className="p-6 border-dashed border-2 border-navy-medium/20 dark:border-white/10 hover:border-navy-medium/40 dark:hover:border-blue-500/50 transition-all cursor-pointer bg-blue-lightest/50 dark:bg-[#1a2a3a]">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-medium to-navy-dark flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-medium text-navy-dark dark:text-white mb-2">
                Upload identity document
              </h3>
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mb-2">
                PDF or Image • Max 10MB
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Alert className="border-blue-medium/20 bg-blue-medium/5">
        <AlertCircle className="h-4 w-4 text-blue-medium" />
        <AlertDescription className="text-sm">
          <strong>Document Requirements:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>All documents must be clear and legible</li>
            <li>Scanned copies must show the entire document</li>
            <li>Photos taken with mobile phones are acceptable if clear</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function PaymentStep({ formData, setFormData }: any) {
  const { t } = useTranslationWithParams();

  const fees = [
    { label: "Application Fee", amount: 50000 },
    { label: "Processing Fee", amount: 30000 },
    { label: "Service Fee", amount: 5000 }
  ];

  const total = fees.reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-6">
      {/* Fee Breakdown */}
      <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] border-navy-medium/10">
        <h3 className="font-medium text-navy-dark dark:text-white mb-4">
          Fee Breakdown
        </h3>
        <div className="space-y-3">
          {fees.map((fee, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-navy-medium/80 dark:text-white/70">{fee.label}</span>
              <span className="font-medium text-navy-dark dark:text-white">
                {fee.amount.toLocaleString()} RWF
              </span>
            </div>
          ))}
          <div className="border-t border-navy-medium/20 dark:border-white/10 pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-medium text-navy-dark dark:text-white">Total Amount</span>
              <span className="text-xl font-bold text-navy-dark dark:text-white">
                {total.toLocaleString()} RWF
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Method */}
      <div className="space-y-4">
        <Label className="text-base">
          Select Payment Method <span className="text-red-500">*</span>
        </Label>
        
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
          className="space-y-3"
        >
          <Card className={`p-4 cursor-pointer transition-all ${formData.paymentMethod === 'momo' ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/5' : 'border-navy-medium/10'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="momo" id="momo" />
              <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="text-2xl">📱</div>
                <div>
                  <div className="font-medium text-navy-dark dark:text-white">MTN Mobile Money</div>
                  <div className="text-sm text-navy-medium/60 dark:text-white/60">Pay with MoMo</div>
                </div>
              </Label>
            </div>
          </Card>

          <Card className={`p-4 cursor-pointer transition-all ${formData.paymentMethod === 'airtel' ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/5' : 'border-navy-medium/10'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="airtel" id="airtel" />
              <Label htmlFor="airtel" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="text-2xl">💳</div>
                <div>
                  <div className="font-medium text-navy-dark dark:text-white">Airtel Money</div>
                  <div className="text-sm text-navy-medium/60 dark:text-white/60">Pay with Airtel Money</div>
                </div>
              </Label>
            </div>
          </Card>

          <Card className={`p-4 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/5' : 'border-navy-medium/10'}`}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                <div className="text-2xl">💳</div>
                <div>
                  <div className="font-medium text-navy-dark dark:text-white">Credit/Debit Card</div>
                  <div className="text-sm text-navy-medium/60 dark:text-white/60">Visa, Mastercard accepted</div>
                </div>
              </Label>
            </div>
          </Card>
        </RadioGroup>
      </div>

      <Alert className="border-green-500/20 bg-green-500/5">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-sm">
          Your payment is secured with 256-bit SSL encryption. You'll receive a confirmation email immediately after payment.
        </AlertDescription>
      </Alert>
    </div>
  );
}
