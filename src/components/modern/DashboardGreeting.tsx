import { motion } from "motion/react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  Calendar,
  FileText,
  Bell
} from "lucide-react";
import { useAuth } from "../UserAuth";
import { useTranslationWithParams } from "../utils/TranslationUtils";

interface Application {
  id: string;
  type: string;
  status: "processing" | "approved" | "pending" | "completed";
  progress: number;
  updatedAt: string;
  reference: string;
}

interface DashboardGreetingProps {
  onPageChange: (page: string) => void;
}

export function DashboardGreeting({ onPageChange }: DashboardGreetingProps) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslationWithParams();

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('greeting.morning', {}, 'Good Morning') : 
                   hour < 18 ? t('greeting.afternoon', {}, 'Good Afternoon') : 
                   t('greeting.evening', {}, 'Good Evening');

  // Mock application data - in real app, this would come from API
  const applications: Application[] = isAuthenticated ? [
    {
      id: "PASS-2024-001",
      type: "Passport Application",
      status: "processing",
      progress: 75,
      updatedAt: "2 hours ago",
      reference: "RW-PASS-2024-001234"
    }
  ] : [];

  const upcomingAppointment = isAuthenticated ? {
    date: "Dec 15, 2024",
    time: "10:00 AM",
    location: "Main Immigration Office, Kigali",
    type: "Biometric Enrollment"
  } : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-navy-medium" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "processing":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-navy-medium/10 text-navy-medium dark:text-white";
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-navy-dark via-navy-medium to-blue-medium dark:from-[#1a2a3a] dark:to-[#2a4a5a]">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              style={{
                backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative z-10 p-8">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <span className="text-sm text-white/80">{greeting}</span>
                </div>
                <h1 className="text-3xl md:text-4xl text-white mb-2">
                  {isAuthenticated && user ? (
                    <>Welcome back, {user.firstName}!</>
                  ) : (
                    <>Welcome to Rwanda Immigration</>
                  )}
                </h1>
                <p className="text-white/70 max-w-2xl">
                  {isAuthenticated ? (
                    <>Everything you need to manage your immigration services in one place.</>
                  ) : (
                    <>Your secure portal for passport, visa, and immigration services.</>
                  )}
                </p>
              </div>

              {isAuthenticated && applications.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="text-sm text-white/80 mb-1">Active Applications</div>
                  <div className="text-3xl text-white">{applications.length}</div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Active Applications */}
      {isAuthenticated && applications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-navy-dark dark:text-white">
              Your Applications
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange('status')}
              className="text-navy-medium dark:text-blue-400 hover:text-navy-dark dark:hover:text-blue-300"
            >
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid gap-4">
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-6 border-navy-medium/10 dark:border-white/10 hover:border-navy-medium/30 dark:hover:border-blue-500/50 transition-all cursor-pointer bg-white dark:bg-[#1E1E1E]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(app.status)}
                      <div>
                        <h3 className="font-medium text-navy-dark dark:text-white mb-1">
                          {app.type}
                        </h3>
                        <p className="text-sm text-navy-medium/60 dark:text-white/60">
                          {app.reference}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(app.status)} border-0`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-navy-medium/60 dark:text-white/60">
                        Progress
                      </span>
                      <span className="text-navy-dark dark:text-white font-medium">
                        {app.progress}%
                      </span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-navy-medium/60 dark:text-white/60">
                      <span>Last updated {app.updatedAt}</span>
                      <span className="text-navy-medium dark:text-blue-400 hover:underline cursor-pointer">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Upcoming Appointment */}
      {isAuthenticated && upcomingAppointment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl text-navy-dark dark:text-white mb-4">
            Upcoming Appointment
          </h2>
          <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-gradient-to-br from-blue-50 to-white dark:from-[#1a2a3a] dark:to-[#1E1E1E]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-gradient-to-br from-navy-medium to-blue-medium flex items-center justify-center">
                <Calendar className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-navy-dark dark:text-white mb-1">
                      {upcomingAppointment.type}
                    </h3>
                    <p className="text-sm text-navy-medium/60 dark:text-white/60">
                      {upcomingAppointment.location}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-navy-medium/20 dark:border-white/20">
                    <Bell className="h-3 w-3 mr-1" />
                    Reminder Set
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-navy-dark dark:text-white mt-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-navy-medium dark:text-blue-400" />
                    {upcomingAppointment.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-navy-medium dark:text-blue-400" />
                    {upcomingAppointment.time}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Stats for Non-Authenticated Users */}
      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="p-6 text-center border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-navy-dark dark:text-white mb-1">48hrs</div>
            <div className="text-sm text-navy-medium/60 dark:text-white/60">Average Processing</div>
          </Card>
          
          <Card className="p-6 text-center border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-navy-dark dark:text-white mb-1">4</div>
            <div className="text-sm text-navy-medium/60 dark:text-white/60">Languages Supported</div>
          </Card>
          
          <Card className="p-6 text-center border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-2xl font-bold text-navy-dark dark:text-white mb-1">100%</div>
            <div className="text-sm text-navy-medium/60 dark:text-white/60">Secure & Encrypted</div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
