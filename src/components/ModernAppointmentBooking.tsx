import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Calendar as CalendarIcon, Clock, MapPin, User, CheckCircle, Info, ArrowRight, Phone, Mail } from "lucide-react";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { toast } from "sonner@2.0.3";

export function ModernAppointmentBooking() {
  const { t } = useTranslationWithParams();
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');
  const [formData, setFormData] = useState({
    service: "",
    location: "",
    date: "",
    time: "",
    fullName: "",
    email: "",
    phone: "",
    reference: ""
  });

  const services = [
    { id: 'biometric', name: 'Biometric Enrollment', duration: '30 min', icon: '👆', color: 'from-blue-500 to-blue-600' },
    { id: 'document', name: 'Document Collection', duration: '15 min', icon: '📄', color: 'from-green-500 to-green-600' },
    { id: 'verification', name: 'Identity Verification', duration: '20 min', icon: '🔍', color: 'from-purple-500 to-purple-600' },
    { id: 'consultation', name: 'Immigration Consultation', duration: '45 min', icon: '💬', color: 'from-orange-500 to-orange-600' }
  ];

  const locations = [
    { id: 'kigali-main', name: 'Main Immigration Office', address: 'KG 5 Ave, Kigali', available: true },
    { id: 'kigali-kimihurura', name: 'Kimihurura Branch', address: 'KG 7 Ave, Kigali', available: true },
    { id: 'musanze', name: 'Musanze Office', address: 'Musanze District', available: true },
    { id: 'rubavu', name: 'Rubavu Office', address: 'Rubavu District', available: false }
  ];

  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
  ];

  const handleBooking = () => {
    toast.success(t('appointment.booked', {}, 'Appointment booked successfully!'), {
      description: 'Confirmation sent to your email'
    });
    setStep('confirm');
  };

  return (
    <div className="min-h-screen bg-blue-lightest dark:bg-[#0a0a0a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-navy-dark dark:text-white">
                {t('appointment.title', {}, 'Book an Appointment')}
              </h1>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('appointment.desc', {}, 'Schedule your visit at a convenient time')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'select' ? 'text-navy-dark dark:text-white' : step === 'details' || step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'select' ? 'bg-navy-medium text-white' : step === 'details' || step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                {step === 'details' || step === 'confirm' ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">Select Service</span>
            </div>
            <div className="h-0.5 w-12 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'details' ? 'text-navy-dark dark:text-white' : step === 'confirm' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-navy-medium text-white' : step === 'confirm' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                {step === 'confirm' ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className="hidden sm:inline text-sm font-medium">Your Details</span>
            </div>
            <div className="h-0.5 w-12 bg-gray-300" />
            <div className={`flex items-center gap-2 ${step === 'confirm' ? 'text-navy-dark dark:text-white' : 'text-gray-400'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-navy-medium text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="hidden sm:inline text-sm font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Service */}
        {step === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-lg font-medium text-navy-dark dark:text-white mb-4">
                Choose Your Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      onClick={() => setFormData({ ...formData, service: service.id })}
                      className={`p-6 cursor-pointer transition-all ${
                        formData.service === service.id
                          ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/5 shadow-lg'
                          : 'border-navy-medium/10 hover:border-navy-medium/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                          {service.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-navy-dark dark:text-white">
                              {service.name}
                            </h3>
                            {formData.service === service.id && (
                              <CheckCircle className="h-5 w-5 text-navy-medium dark:text-blue-500" />
                            )}
                          </div>
                          <Badge variant="outline" className="border-navy-medium/20">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.duration}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-lg font-medium text-navy-dark dark:text-white mb-4">
                Select Location & Date
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Office Location
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id} disabled={!loc.available}>
                          <div className="flex items-center gap-2">
                            {loc.name}
                            {!loc.available && <Badge variant="outline" className="ml-2 text-xs">Full</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Preferred Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="h-12"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Preferred Time
                    </Label>
                    <Select
                      value={formData.time}
                      onValueChange={(value) => setFormData({ ...formData, time: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => setStep('details')}
              disabled={!formData.service || !formData.location || !formData.date || !formData.time}
              className="w-full h-12 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium"
            >
              Continue to Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Step 2: Personal Details */}
        {step === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h2 className="text-lg font-medium text-navy-dark dark:text-white mb-4">
                Your Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
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
                  <Label htmlFor="reference">
                    Application Reference (Optional)
                  </Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="e.g., RW-PASS-2024-001234"
                    className="h-12"
                  />
                </div>
              </div>
            </Card>

            <Alert className="border-blue-medium/20 bg-blue-medium/5">
              <Info className="h-4 w-4 text-blue-medium" />
              <AlertDescription className="text-sm">
                A confirmation email will be sent to your email address. Please arrive 10 minutes before your scheduled time.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                className="flex-1 h-12"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                disabled={!formData.fullName || !formData.email || !formData.phone}
                className="flex-1 h-12 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium"
              >
                Confirm Booking
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirm' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="p-8 text-center border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500 mb-4"
              >
                <CheckCircle className="h-10 w-10 text-white" />
              </motion.div>

              <h2 className="text-2xl font-medium text-navy-dark dark:text-white mb-2">
                Appointment Confirmed!
              </h2>
              <p className="text-navy-medium/60 dark:text-white/60 mb-6">
                Your appointment has been successfully booked
              </p>

              <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] border-navy-medium/10 text-left">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-navy-medium/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-navy-medium" />
                    </div>
                    <div>
                      <div className="text-xs text-navy-medium/60 dark:text-white/60">Name</div>
                      <div className="font-medium text-navy-dark dark:text-white">{formData.fullName}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-navy-medium/60 dark:text-white/60">Service</div>
                      <div className="font-medium text-navy-dark dark:text-white">
                        {services.find(s => s.id === formData.service)?.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-navy-medium/60 dark:text-white/60">Date & Time</div>
                      <div className="font-medium text-navy-dark dark:text-white">
                        {formData.date} at {formData.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-navy-medium/60 dark:text-white/60">Location</div>
                      <div className="font-medium text-navy-dark dark:text-white">
                        {locations.find(l => l.id === formData.location)?.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Alert className="mt-6 border-green-500/20 bg-green-500/5">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-sm text-left">
                  A confirmation email has been sent to <strong>{formData.email}</strong> with your appointment details and directions.
                </AlertDescription>
              </Alert>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => window.print()}
              >
                Print Confirmation
              </Button>
              <Button
                className="flex-1 h-12 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium"
                onClick={() => {
                  setStep('select');
                  setFormData({
                    service: "",
                    location: "",
                    date: "",
                    time: "",
                    fullName: "",
                    email: "",
                    phone: "",
                    reference: ""
                  });
                }}
              >
                Book Another Appointment
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
