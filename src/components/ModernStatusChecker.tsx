import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileText,
  Calendar,
  MapPin,
  Download,
  Bell,
  ArrowRight,
  Package,
  Truck,
  Home as HomeIcon,
  CheckCheck
} from "lucide-react";
import { useTranslationWithParams } from "./utils/TranslationUtils";

export function ModernStatusChecker() {
  const { t } = useTranslationWithParams();
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [application, setApplication] = useState<any>(null);

  const handleSearch = () => {
    setIsSearching(true);
    // Mock data - replace with actual API call
    setTimeout(() => {
      setApplication({
        reference: "RW-PASS-2024-001234",
        type: "Passport Application",
        applicant: "John Doe",
        status: "processing",
        progress: 75,
        submittedDate: "Nov 15, 2024",
        estimatedCompletion: "Nov 22, 2024",
        currentStage: "Biometric Verification",
        timeline: [
          { stage: "Application Submitted", date: "Nov 15, 2024", status: "completed" },
          { stage: "Payment Confirmed", date: "Nov 15, 2024", status: "completed" },
          { stage: "Document Verification", date: "Nov 16, 2024", status: "completed" },
          { stage: "Biometric Verification", date: "In Progress", status: "active" },
          { stage: "Passport Printing", date: "Pending", status: "pending" },
          { stage: "Ready for Collection", date: "Pending", status: "pending" }
        ],
        appointment: {
          date: "Nov 20, 2024",
          time: "10:00 AM",
          location: "Main Immigration Office, Kigali"
        }
      });
      setIsSearching(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "active":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
    }
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
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-medium to-navy-medium flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-navy-dark dark:text-white">
                {t('status.checkStatus', {}, 'Check Application Status')}
              </h1>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('status.trackDesc', {}, 'Track your application in real-time')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        {!application && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-medium to-navy-medium mb-4">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-2">
                    Enter Your Details
                  </h2>
                  <p className="text-sm text-navy-medium/60 dark:text-white/60">
                    Use your reference number and email to track your application
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reference" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Reference Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reference"
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="e.g., RW-PASS-2024-001234"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !reference || !email}
                  className="w-full h-12 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium text-base"
                >
                  {isSearching ? (
                    <>
                      <Clock className="h-5 w-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Check Status
                    </>
                  )}
                </Button>

                <Alert className="border-blue-medium/20 bg-blue-medium/5">
                  <FileText className="h-4 w-4 text-blue-medium" />
                  <AlertDescription className="text-sm">
                    Your reference number was sent to your email when you submitted your application.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Application Status */}
        {application && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Overview */}
            <Card className="p-8 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <Badge className={`${getStatusColor(application.status)} mb-3`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                  <h2 className="text-2xl font-medium text-navy-dark dark:text-white mb-1">
                    {application.type}
                  </h2>
                  <p className="text-sm text-navy-medium/60 dark:text-white/60">
                    Reference: {application.reference}
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-navy-dark dark:text-white">
                    Current Stage: {application.currentStage}
                  </span>
                  <span className="text-sm font-bold text-navy-dark dark:text-white">
                    {application.progress}%
                  </span>
                </div>
                <Progress value={application.progress} className="h-3" />
                <div className="flex justify-between text-xs text-navy-medium/60 dark:text-white/60 mt-2">
                  <span>Submitted: {application.submittedDate}</span>
                  <span>Est. Completion: {application.estimatedCompletion}</span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-lightest dark:bg-[#1a2a3a]">
                  <div className="h-10 w-10 rounded-lg bg-blue-medium/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-medium" />
                  </div>
                  <div>
                    <div className="text-xs text-navy-medium/60 dark:text-white/60">Applicant</div>
                    <div className="text-sm font-medium text-navy-dark dark:text-white">
                      {application.applicant}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-lightest dark:bg-[#1a2a3a]">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-navy-medium/60 dark:text-white/60">Submitted</div>
                    <div className="text-sm font-medium text-navy-dark dark:text-white">
                      {application.submittedDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-lightest dark:bg-[#1a2a3a]">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xs text-navy-medium/60 dark:text-white/60">Est. Ready</div>
                    <div className="text-sm font-medium text-navy-dark dark:text-white">
                      {application.estimatedCompletion}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-8 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
              <h3 className="text-lg font-medium text-navy-dark dark:text-white mb-6">
                Application Timeline
              </h3>

              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-navy-medium/20 dark:bg-white/10" />

                <div className="space-y-6">
                  {application.timeline.map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-start gap-4"
                    >
                      {/* Icon */}
                      <div className={`relative z-10 flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                        item.status === 'completed' 
                          ? 'bg-green-500' 
                          : item.status === 'active'
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        {getStatusIcon(item.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-navy-dark dark:text-white mb-1">
                              {item.stage}
                            </h4>
                            <p className="text-sm text-navy-medium/60 dark:text-white/60">
                              {item.date}
                            </p>
                          </div>
                          {item.status === 'completed' && (
                            <CheckCheck className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Upcoming Appointment */}
            {application.appointment && (
              <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-gradient-to-br from-blue-50 to-white dark:from-[#1a2a3a] dark:to-[#1E1E1E]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-navy-medium to-blue-medium flex items-center justify-center">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-navy-dark dark:text-white mb-1">
                          Upcoming Biometric Appointment
                        </h3>
                        <p className="text-sm text-navy-medium/60 dark:text-white/60">
                          Don't forget to bring your original documents
                        </p>
                      </div>
                      <Badge variant="outline" className="border-navy-medium/20 dark:border-white/20">
                        <Bell className="h-3 w-3 mr-1" />
                        Reminder Set
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-navy-dark dark:text-white mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-navy-medium dark:text-blue-400" />
                        {application.appointment.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-navy-medium dark:text-blue-400" />
                        {application.appointment.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-navy-medium dark:text-blue-400" />
                        {application.appointment.location}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setApplication(null)}
                variant="outline"
                className="flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Check Another Application
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-navy-medium to-blue-medium hover:from-navy-dark hover:to-navy-medium"
              >
                Contact Support
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
