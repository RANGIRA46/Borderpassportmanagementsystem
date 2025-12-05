import { motion } from "motion/react";
import { DashboardGreeting } from "./modern/DashboardGreeting";
import { ServiceCard } from "./modern/ServiceCard";
import { useAuth } from "./UserAuth";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { 
  FileText, 
  Globe, 
  Ticket, 
  Shield, 
  MapPin, 
  Users, 
  Plane,
  Calendar,
  Search,
  CreditCard,
  Fingerprint,
  FileCheck,
  ArrowRight,
  Zap,
  Lock,
  Clock
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface ModernHomePageProps {
  onPageChange: (page: string) => void;
}

export function ModernHomePage({ onPageChange }: ModernHomePageProps) {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslationWithParams();

  const services = [
    {
      id: 'apply-passport',
      title: t('passport.title', {}, 'Passport Application'),
      description: t('home.passportDesc', {}, 'Apply for a new passport or renew your existing one'),
      icon: <FileText className="h-7 w-7" />,
      color: "from-navy-dark to-navy-medium",
      popular: true,
      estimated: "3-5 days",
      illustration: "🛂"
    },
    {
      id: 'apply-visa',
      title: t('visa.title', {}, 'Visa Application'),
      description: t('home.visaDesc', {}, 'Apply for tourist, business, or transit visas'),
      icon: <Globe className="h-7 w-7" />,
      color: "from-blue-medium to-navy-medium",
      popular: true,
      estimated: "7-10 days",
      illustration: "✈️"
    },
    {
      id: 'apply-permit',
      title: t('permit.title', {}, 'Residence Permit'),
      description: t('home.permitDesc', {}, 'Apply for work or residence permits'),
      icon: <Ticket className="h-7 w-7" />,
      color: "from-navy-medium to-blue-medium",
      estimated: "14 days",
      illustration: "🏠"
    },
    {
      id: 'apply-citizenship',
      title: t('citizenship.title', {}, 'Citizenship'),
      description: t('home.citizenshipDesc', {}, 'Apply for Rwandan citizenship'),
      icon: <Shield className="h-7 w-7" />,
      color: "from-blue-medium to-navy-dark",
      estimated: "60 days",
      illustration: "🇷🇼"
    },
    {
      id: 'cepgl-service',
      title: t('cepgl.title', {}, 'CEPGL Pass'),
      description: t('home.cepglDesc', {}, 'Regional travel document for East African Community'),
      icon: <MapPin className="h-7 w-7" />,
      color: "from-navy-medium to-blue-light",
      illustration: "🌍"
    },
    {
      id: 'refugee-services',
      title: t('refugee.title', {}, 'Refugee Services'),
      description: t('home.refugeeDesc', {}, 'Documentation and support for refugees'),
      icon: <Users className="h-7 w-7" />,
      color: "from-blue-light to-navy-medium",
      illustration: "🤝"
    }
  ];

  const quickActions = [
    {
      id: 'status',
      title: t('nav.status', {}, 'Check Status'),
      description: 'Track your application',
      icon: <Search className="h-5 w-5" />,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 'appointments',
      title: t('nav.appointments', {}, 'Book Appointment'),
      description: 'Schedule biometric enrollment',
      icon: <Calendar className="h-5 w-5" />,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      id: 'payments',
      title: t('nav.payments', {}, 'Make Payment'),
      description: 'Pay application fees',
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-green-600 dark:text-green-400"
    },
    {
      id: 'documents',
      title: t('nav.documents', {}, 'Upload Documents'),
      description: 'Submit required documents',
      icon: <FileCheck className="h-5 w-5" />,
      color: "text-orange-600 dark:text-orange-400"
    }
  ];

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Fast Processing",
      description: "Most applications processed within 48 hours"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure Platform",
      description: "Bank-level encryption for your data"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Access",
      description: "Apply anytime, from anywhere"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-Language",
      description: "Available in 4 languages"
    }
  ];

  return (
    <div className="min-h-screen bg-blue-lightest dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Greeting */}
        <DashboardGreeting onPageChange={onPageChange} />

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl text-navy-dark dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card
                  onClick={() => onPageChange(action.id)}
                  className="p-4 cursor-pointer border-navy-medium/10 dark:border-white/10 hover:border-navy-medium/30 dark:hover:border-blue-500/50 transition-all bg-white dark:bg-[#1E1E1E] group"
                >
                  <div className={`${action.color} mb-3 group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <h3 className="font-medium text-sm text-navy-dark dark:text-white mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-navy-medium/60 dark:text-white/60">
                    {action.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl text-navy-dark dark:text-white">
                {t('home.services', {}, 'Our Services')}
              </h2>
              <p className="text-sm text-navy-medium/60 dark:text-white/60 mt-1">
                Choose from our comprehensive range of immigration services
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onPageChange('services')}
              className="text-navy-medium dark:text-blue-400 hover:text-navy-dark dark:hover:text-blue-300 hidden md:flex"
            >
              View All Services
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              >
                <ServiceCard
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  color={service.color}
                  popular={service.popular}
                  estimated={service.estimated}
                  onClick={() => onPageChange(service.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-xl text-navy-dark dark:text-white mb-6 text-center">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
              >
                <Card className="p-6 text-center border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E] hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-navy-medium to-blue-medium text-white mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium text-navy-dark dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-navy-medium/60 dark:text-white/60">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-navy-dark via-navy-medium to-blue-medium">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              <div className="relative z-10 p-8 text-center">
                <h2 className="text-2xl md:text-3xl text-white mb-3">
                  Ready to Get Started?
                </h2>
                <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                  Create an account to track your applications, book appointments, and access personalized services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => onPageChange('login')}
                    className="bg-white text-navy-dark hover:bg-white/90 shadow-xl"
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onPageChange('apply-passport')}
                    className="border-white text-white hover:bg-white/10"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
