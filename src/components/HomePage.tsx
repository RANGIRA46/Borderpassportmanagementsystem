import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useAuth } from "./UserAuth";
import { useTranslation, T } from "./utils/LanguageSelector";
import { useTranslationWithParams, formatDate, formatCurrency } from "./utils/TranslationUtils";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Zap,
  Globe,
  Fingerprint,
  QrCode,
  BarChart3,
  AlertTriangle,
  Languages,
  FileText,
  Calendar,
  CreditCard,
  Database,
  LogIn,
  UserPlus,
  User,
  Settings
} from "lucide-react";

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const { user, isAuthenticated, isCustomer, isOfficer, isAdmin, isSuperAdmin } = useAuth();
  const { currentLanguage } = useTranslation();
  const { t } = useTranslationWithParams();

  const systemStats = {
    totalApplications: 15247,
    processingTime: "48 hours",
    successRate: 98.7,
    uptime: 99.95,
    activeUsers: 1247,
    pendingApplications: 234,
    alertsToday: 12,
    borderCrossings: 2526
  };

  // Get personalized quick actions based on user role with translations
  const getQuickActions = () => {
    const publicActions = [
      {
        id: 'apply-passport',
        title: t('passport.title'),
        description: t('home.submitPassportApplication'),
        icon: <CheckCircle className="h-6 w-6" />,
        color: 'bg-navy-medium',
        popular: true,
        requiresAuth: false
      },
      {
        id: 'apply-visa',
        title: t('visa.title'),
        description: t('home.completeVisaApplication'),
        icon: <Globe className="h-6 w-6" />,
        color: 'bg-blue-medium',
        popular: true,
        requiresAuth: false
      },
      {
        id: 'status',
        title: t('nav.status'),
        description: t('home.trackApplicationProgress'),
        icon: <Clock className="h-6 w-6" />,
        color: 'bg-blue-light',
        popular: false,
        requiresAuth: false
      },
      {
        id: 'appointments',
        title: t('nav.appointments'),
        icon: <Calendar className="h-6 w-6" />,
        color: 'bg-navy-dark',
        popular: true,
        requiresAuth: false
      }
    ];

    const customerActions = [
      ...publicActions,
      {
        id: 'border-pass',
        title: 'Digital Border Pass',
        description: 'Apply for frequent crosser pass',
        icon: <QrCode className="h-6 w-6" />,
        color: 'bg-blue-medium',
        popular: false,
        requiresAuth: true
      },
      {
        id: 'payments',
        title: 'Payment Center',
        description: 'Pay fees and track payments',
        icon: <CreditCard className="h-6 w-6" />,
        color: 'bg-navy-medium',
        popular: false,
        requiresAuth: false
      }
    ];

    const officerActions = [
      ...customerActions,

      {
        id: 'entry-exit',
        title: 'Border Control',
        description: 'Manage border crossings and validations',
        icon: <Shield className="h-6 w-6" />,
        color: 'bg-navy-medium',
        popular: true,
        requiresAuth: true
      },
      {
        id: 'records',
        title: 'Travel Records',
        description: 'View and manage travel records',
        icon: <FileText className="h-6 w-6" />,
        color: 'bg-blue-light',
        popular: false,
        requiresAuth: true
      }
    ];

    const adminActions = [
      ...officerActions,
      {
        id: 'admin-dashboard',
        title: 'Admin Dashboard',
        description: 'System overview and management',
        icon: <BarChart3 className="h-6 w-6" />,
        color: 'bg-navy-dark',
        popular: true,
        requiresAuth: true
      },
      {
        id: 'analytics',
        title: 'Analytics & Reports',
        description: 'View system analytics and generate reports',
        icon: <BarChart3 className="h-6 w-6" />,
        color: 'bg-blue-medium',
        popular: true,
        requiresAuth: true
      },
      {
        id: 'interpol',
        title: 'INTERPOL Integration',
        description: 'International database verification',
        icon: <Database className="h-6 w-6" />,
        color: 'bg-navy-dark',
        popular: false,
        requiresAuth: true
      },
      {
        id: 'alerts',
        title: 'Alerts & Watchlist',
        description: 'Monitor alerts and manage watchlists',
        icon: <AlertTriangle className="h-6 w-6" />,
        color: 'bg-yellow-600',
        popular: false,
        requiresAuth: true
      }
    ];

    if (!isAuthenticated) return publicActions;
    if (isSuperAdmin || isAdmin) return adminActions;
    if (isOfficer) return officerActions;
    if (isCustomer) return customerActions;
    return publicActions;
  };



  const getPersonalizedStats = () => {
    if (!isAuthenticated) {
      return [
        {
          icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-navy-medium" />,
          value: systemStats.totalApplications.toLocaleString(),
          label: 'Applications Processed',
          sublabel: 'All time'
        },
        {
          icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-medium" />,
          value: systemStats.processingTime,
          label: 'Avg Processing Time',
          sublabel: '67% reduction achieved'
        },
        {
          icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-navy-dark" />,
          value: systemStats.borderCrossings.toLocaleString(),
          label: 'Border Crossings Today',
          sublabel: 'Real-time tracking'
        },
        {
          icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-medium" />,
          value: `${systemStats.uptime}%`,
          label: 'System Uptime',
          sublabel: 'Above target'
        }
      ];
    }

    if (isCustomer) {
      return [
        {
          icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-navy-medium" />,
          value: '2',
          label: 'Active Applications',
          sublabel: 'In progress'
        },
        {
          icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-medium" />,
          value: '36h',
          label: 'Avg Processing Time',
          sublabel: 'Current applications'
        },
        {
          icon: <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-navy-dark" />,
          value: '1',
          label: 'Upcoming Appointments',
          sublabel: 'This week'
        },
        {
          icon: <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-medium" />,
          value: '5',
          label: 'Completed Applications',
          sublabel: 'All time'
        }
      ];
    } else {
      return [
        {
          icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 text-navy-medium" />,
          value: systemStats.activeUsers.toLocaleString(),
          label: 'Active Users',
          sublabel: '+12.5% this month'
        },
        {
          icon: <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-medium" />,
          value: systemStats.pendingApplications.toString(),
          label: 'Pending Applications',
          sublabel: 'Require attention'
        },
        {
          icon: <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />,
          value: systemStats.alertsToday.toString(),
          label: 'Alerts Today',
          sublabel: 'Watchlist & overstays'
        },
        {
          icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-navy-dark" />,
          value: `${systemStats.uptime}%`,
          label: 'System Uptime',
          sublabel: 'Above target'
        }
      ];
    }
  };



  const quickActions = getQuickActions();
  const personalizedStats = getPersonalizedStats();

  const handleActionClick = (action: any) => {
    if (action.requiresAuth && !isAuthenticated) {
      onPageChange('login');
    } else {
      onPageChange(action.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex justify-center items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-navy-medium/10 rounded-full border border-navy-medium/20">
            <Shield className="h-8 w-8 sm:h-12 sm:w-12 text-navy-medium" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 text-navy-dark">
          {user ? `${t('system.welcome')}, ${user.firstName}` : t('home.welcome')}
        </h1>
        <p className="text-base sm:text-lg text-navy-medium max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
          {isAuthenticated
            ? (isCustomer
              ? t('home.signInBenefits')
              : t('home.description')
            )
            : t('home.description')
          }
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            onClick={() => onPageChange('overview')}
            className="w-full sm:w-auto bg-navy-medium hover:bg-navy-dark text-white border-0"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('home.systemOverview')}
          </Button>
          {!isAuthenticated ? (
            <>
              <Button
                size="lg"
                onClick={() => onPageChange('login')}
                className="w-full sm:w-auto bg-blue-medium hover:bg-blue-light text-white border-0"
              >
                <LogIn className="h-4 w-4 mr-2" />
                {t('nav.signIn')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onPageChange('apply-passport')}
                className="w-full sm:w-auto border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
              >
                {t('home.startApplication')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange(isCustomer ? 'apply-passport' : 'admin-dashboard')}
              className="w-full sm:w-auto border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
            >
              {isCustomer ? t('home.startApplication') : t('admin.dashboard')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>

      {/* User Status Badge */}
      <div className="flex justify-center mb-6">
        {isAuthenticated && user ? (
          <Badge
            variant="outline"
            className={`px-4 py-2 text-sm border-2 ${isCustomer ? 'bg-blue-lightest text-navy-medium border-blue-light' :
                isAdmin || isSuperAdmin ? 'bg-navy-dark text-white border-navy-medium' :
                  'bg-blue-medium text-white border-blue-medium'
              }`}
          >
            {isCustomer ? (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Customer Portal</span>
              </div>
            ) : isAdmin || isSuperAdmin ? (
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Administrator Dashboard</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Settings className="h-3 w-3" />
                <span>Officer Interface</span>
              </div>
            )}
          </Badge>
        ) : (
          <div className="flex space-x-2">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm border-2 bg-blue-lightest text-navy-medium border-blue-light"
            >
              <div className="flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>{t('home.guestAccess')}</span>
              </div>
            </Badge>
            <Button
              size="sm"
              onClick={() => onPageChange('login')}
              className="bg-navy-medium hover:bg-navy-dark text-white"
            >
              <LogIn className="h-3 w-3 mr-1" />
              {t('home.signInFullAccess')}
            </Button>
          </div>
        )}
      </div>

      {/* Authentication Prompt for Guests */}
      {!isAuthenticated && (
        <div className="mb-8 sm:mb-12">
          <Card className="border-blue-medium bg-gradient-to-r from-blue-lightest to-white">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl mb-2 text-navy-dark">{t('home.getFullAccess')}</h3>
                  <p className="text-navy-medium text-sm sm:text-base">
                    {t('home.signInBenefits')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() => onPageChange('login')}
                    className="bg-navy-medium hover:bg-navy-dark text-white"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('nav.signIn')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onPageChange('login')}
                    className="border-blue-medium text-navy-medium hover:bg-blue-lightest"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {t('nav.register')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Personalized Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {personalizedStats.map((stat, index) => (
          <Card key={index} className="border-blue-light hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex justify-center mb-2 sm:mb-3">
                {stat.icon}
              </div>
              <div className="text-xl sm:text-2xl font-bold mb-1 text-navy-dark">{stat.value}</div>
              <div className="text-xs sm:text-sm text-navy-medium mb-1">{stat.label}</div>
              <Badge variant="secondary" className="text-xs bg-blue-lightest text-navy-medium border border-blue-light">
                {stat.sublabel}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl text-navy-dark">
            {isAuthenticated
              ? (isCustomer ? 'Your Services' : isAdmin || isSuperAdmin ? 'Administrative Tools' : 'Officer Tools')
              : 'Available Services'
            }
          </h2>
          <Badge variant="outline" className="text-xs sm:text-sm border-blue-medium text-navy-medium">
            {isAuthenticated
              ? `${user?.role === 'customer' ? 'Customer' : user?.role === 'admin' ? 'Administrator' : user?.role === 'super-admin' ? 'Super Admin' : 'Officer'} Access`
              : 'Public + Login for More'
            }
          </Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.slice(0, 9).map((action) => (
            <Card
              key={action.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-blue-light"
              onClick={() => handleActionClick(action)}
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 sm:p-3 rounded-lg text-white ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    {action.popular && (
                      <Badge variant="secondary" className="text-xs bg-blue-lightest text-navy-medium border border-blue-light">
                        Popular
                      </Badge>
                    )}
                    {action.requiresAuth && !isAuthenticated && (
                      <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-700">
                        Login Required
                      </Badge>
                    )}
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 text-navy-dark">{action.title}</h3>
                <p className="text-xs sm:text-sm text-navy-medium mb-4 line-clamp-2">{action.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
                >
                  {action.requiresAuth && !isAuthenticated ? 'Sign In to Access' : 'Open Service'}
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>



      {/* System Health for Staff Users */}
      {(isOfficer || isAdmin || isSuperAdmin) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-navy-dark">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-navy-medium" />
                <span>Security Status</span>
              </CardTitle>
              <CardDescription className="text-navy-medium">All security systems are operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-navy-medium">INTERPOL Connection</span>
                    <span className="text-blue-medium font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-navy-medium">Data Encryption</span>
                    <span className="text-blue-medium font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-navy-medium">Access Controls</span>
                    <span className="text-blue-medium font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
              >
                View Security Details
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-navy-dark">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-navy-medium" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-navy-medium">Real-time system performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-navy-medium">API Response Time</span>
                    <span className="text-blue-medium font-medium">245ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-navy-medium">Border Processing</span>
                    <span className="text-blue-medium font-medium">1.2s</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-navy-medium">System Availability</span>
                    <span className="text-blue-medium font-medium">99.95%</span>
                  </div>
                  <Progress value={99.95} className="h-2" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
                onClick={() => onPageChange('analytics')}
              >
                View Full Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Support Information */}
      <Card className="bg-blue-lightest border-blue-light">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl mb-4 text-navy-dark">Need Help?</h3>
            <p className="text-navy-medium mb-4 sm:mb-6 text-sm sm:text-base">
              Our support team is available 24/7 to assist with applications, appointments, and system access.
              {!isAuthenticated && " Sign in for personalized support and faster resolution."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center text-sm">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-navy-medium">Emergency: +250 788 123 000</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-medium" />
                <span className="text-navy-medium">Support: +250 788 123 456</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4 text-navy-medium" />
                <span className="text-navy-medium">Online Chat Available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}