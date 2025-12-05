import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Download,
  Eye,
  Package
} from "lucide-react";
import { motion } from "motion/react";

const mockApplication = {
  referenceNumber: 'RW-PSP-2024-001847',
  type: 'Passport Application',
  applicant: 'John Mukiza Smith',
  submittedDate: '2024-11-15',
  estimatedCompletion: '2024-12-05',
  currentStatus: 'biometric-verified',
  progress: 75,
  stages: [
    { id: 1, name: 'Application Submitted', status: 'completed', date: '2024-11-15', icon: FileText },
    { id: 2, name: 'Payment Verified', status: 'completed', date: '2024-11-15', icon: CheckCircle2 },
    { id: 3, name: 'Document Review', status: 'completed', date: '2024-11-18', icon: FileText },
    { id: 4, name: 'Biometric Enrollment', status: 'completed', date: '2024-11-22', icon: User },
    { id: 5, name: 'Security Clearance', status: 'in-progress', date: null, icon: Clock },
    { id: 6, name: 'Passport Production', status: 'pending', date: null, icon: Package },
    { id: 7, name: 'Ready for Collection', status: 'pending', date: null, icon: CheckCircle2 }
  ],
  documents: [
    { name: 'National ID Card', status: 'verified' },
    { name: 'Birth Certificate', status: 'verified' },
    { name: 'Passport Photos', status: 'verified' },
    { name: 'Proof of Address', status: 'verified' }
  ],
  appointment: {
    type: 'Biometric Enrollment',
    date: '2024-11-22',
    time: '10:30 AM',
    location: 'Immigration Office - Kigali City',
    status: 'completed'
  },
  payment: {
    amount: 60000,
    currency: 'RWF',
    method: 'Mobile Money',
    status: 'Paid',
    reference: 'MTN-20241115-8473'
  }
};

export function ProfessionalStatusTracker() {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (referenceNumber.trim()) {
      setShowResults(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 dark:text-green-400';
      case 'in-progress': return 'text-blue-600 dark:text-blue-400';
      case 'pending': return 'text-slate-400 dark:text-slate-500';
      default: return 'text-slate-400 dark:text-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-[#0A0F1C] dark:via-[#0D1526] dark:to-[#0A0F1C] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-navy-dark dark:text-white mb-2">
            Track Your Application
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Enter your reference number to check the status of your application
          </p>
        </motion.div>

        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Enter reference number (e.g., RW-PSP-2024-001847)"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10 h-12 text-base"
                  />
                </div>
                <Button onClick={handleSearch} size="lg" className="px-8">
                  Track Status
                </Button>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <AlertCircle className="h-4 w-4" />
                <span>Your reference number was sent to your email and SMS after submission</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Application Summary */}
            <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-navy-dark dark:text-white text-xl">
                      {mockApplication.type}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Reference: <span className="font-mono font-semibold">{mockApplication.referenceNumber}</span>
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-500 text-white text-base px-4 py-1">
                    In Progress
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Applicant</p>
                      <p className="text-sm font-semibold text-navy-dark dark:text-white">
                        {mockApplication.applicant}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Submitted</p>
                      <p className="text-sm font-semibold text-navy-dark dark:text-white">
                        {new Date(mockApplication.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Expected Completion</p>
                      <p className="text-sm font-semibold text-navy-dark dark:text-white">
                        {new Date(mockApplication.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                    <span className="font-semibold text-navy-dark dark:text-white">
                      {mockApplication.progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${mockApplication.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Stages */}
            <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-navy-dark dark:text-white">Processing Stages</CardTitle>
                <CardDescription>Track your application through each stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockApplication.stages.map((stage, index) => (
                    <div key={stage.id} className="flex gap-4">
                      {/* Timeline Connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            stage.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : stage.status === 'in-progress'
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          }`}
                        >
                          <stage.icon className="h-5 w-5" />
                        </div>
                        {index < mockApplication.stages.length - 1 && (
                          <div
                            className={`w-0.5 flex-1 min-h-[40px] ${
                              stage.status === 'completed'
                                ? 'bg-green-500'
                                : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        )}
                      </div>

                      {/* Stage Details */}
                      <div className="flex-1 pb-8">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`font-semibold ${getStatusColor(stage.status)}`}>
                              {stage.name}
                            </h4>
                            {stage.date && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Completed on {new Date(stage.date).toLocaleDateString()}
                              </p>
                            )}
                            {stage.status === 'in-progress' && (
                              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                                Currently processing...
                              </p>
                            )}
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              stage.status === 'completed'
                                ? 'border-green-500 text-green-600 dark:text-green-400'
                                : stage.status === 'in-progress'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-slate-300 text-slate-500'
                            }
                          >
                            {stage.status === 'completed'
                              ? 'Completed'
                              : stage.status === 'in-progress'
                              ? 'In Progress'
                              : 'Pending'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Documents */}
              <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-navy-dark dark:text-white text-lg">
                    Submitted Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockApplication.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-navy-dark dark:text-white">
                            {doc.name}
                          </span>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment & Appointment */}
              <div className="space-y-6">
                {/* Payment Info */}
                <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-navy-dark dark:text-white text-lg">
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Amount</span>
                      <span className="font-semibold text-navy-dark dark:text-white">
                        {mockApplication.payment.amount.toLocaleString()} {mockApplication.payment.currency}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Method</span>
                      <span className="font-medium text-navy-dark dark:text-white">
                        {mockApplication.payment.method}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                      <Badge className="bg-green-500 text-white">
                        {mockApplication.payment.status}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Reference
                        </span>
                        <span className="text-xs font-mono text-navy-dark dark:text-white">
                          {mockApplication.payment.reference}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appointment Info */}
                <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-navy-dark dark:text-white text-lg">
                      Appointment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-navy-dark dark:text-white">
                          {mockApplication.appointment.type}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(mockApplication.appointment.date).toLocaleDateString()} at {mockApplication.appointment.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {mockApplication.appointment.location}
                      </p>
                    </div>
                    <Badge className="bg-green-500 text-white w-full justify-center">
                      {mockApplication.appointment.status.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Actions */}
            <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Eye className="h-4 w-4" />
                    View Full Details
                  </Button>
                  <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">
                    <Phone className="h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
