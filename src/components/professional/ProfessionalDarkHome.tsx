import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  FileText,
  Globe,
  Search,
  Calendar,
  Upload,
  CreditCard,
  Shield,
  Clock,
  Zap,
  TrendingUp,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface ProfessionalDarkHomeProps {
  onPageChange: (page: string) => void;
  userName?: string;
}

export function ProfessionalDarkHome({ onPageChange, userName = "User" }: ProfessionalDarkHomeProps) {
  const stats = [
    {
      icon: Zap,
      value: "48hrs",
      label: "Average Processing",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Globe,
      value: "4",
      label: "Languages Supported",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Users,
      value: "250K+",
      label: "Citizens Served",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: CheckCircle2,
      value: "99.8%",
      label: "Success Rate",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const services = [
    {
      id: 'apply-passport',
      title: 'Passport Application',
      description: 'Apply for a new passport or renew your existing one',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      popular: true
    },
    {
      id: 'apply-visa',
      title: 'Visa Application',
      description: 'Apply for entry visas and travel permits',
      icon: Globe,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'status',
      title: 'Track Application',
      description: 'Check the status of your submitted applications',
      icon: Search,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'appointments',
      title: 'Book Appointment',
      description: 'Schedule biometric enrollment and interviews',
      icon: Calendar,
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'documents',
      title: 'Upload Documents',
      description: 'Submit required documents securely',
      icon: Upload,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'payments',
      title: 'Make Payment',
      description: 'Pay fees and view payment history',
      icon: CreditCard,
      color: 'from-rose-500 to-red-600'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      <div className="border-b border-[#262626] bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-amber-500 font-medium">{getGreeting()}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Welcome to Rwanda Immigration
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl"
          >
            Your secure portal for passport, visa, and immigration services.
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <Card className="border-[#262626] bg-[#1a1a1a] hover:bg-[#1f1f1f] transition-all duration-300">
                  <CardContent className="pt-6 text-center">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${stat.color} mb-4`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Quick Services</h2>
          <p className="text-gray-400">Access our most popular services</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card
                className="border-[#262626] bg-[#1a1a1a] hover:bg-[#1f1f1f] hover:border-[#333333] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => onPageChange(service.id)}
              >
                {service.popular && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                
                <CardContent className="pt-8 pb-6">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Get started
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16"
        >
          <Card className="border-[#262626] bg-gradient-to-br from-[#1a1a1a] to-[#1f1f1f] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Secure & Private</h4>
                    <p className="text-sm text-gray-400">
                      Bank-level encryption protects your personal information
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Fast Processing</h4>
                    <p className="text-sm text-gray-400">
                      Most applications processed within 48 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">24/7 Support</h4>
                    <p className="text-sm text-gray-400">
                      Our team is always here to help you
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Need Help Getting Started?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Our support team is available 24/7 to assist you with any questions about your application
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={() => onPageChange('help')}
            >
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#262626] text-white hover:bg-[#1a1a1a] px-8"
              onClick={() => onPageChange('status')}
            >
              Track Application
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
