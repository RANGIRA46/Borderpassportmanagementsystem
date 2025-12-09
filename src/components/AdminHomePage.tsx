import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useAuth } from "./UserAuth";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Database,
  FileText,
  Fingerprint,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  Eye,
  CheckCircle,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard
} from "lucide-react";

interface AdminHomePageProps {
  onPageChange: (page: string) => void;
}

export function AdminHomePage({ onPageChange }: AdminHomePageProps) {
  const { user, isOfficer, isAdmin, isSuperAdmin } = useAuth();

  // Real-time system metrics
  const systemMetrics = {
    totalApplicationsToday: 156,
    pendingReview: 23,
    alertsActive: 7,
    borderCrossingsToday: 2847,
    systemUptime: 99.97,
    avgProcessingTime: 1.2,
    successRate: 98.9,
    watchlistHits: 3
  };

  // Critical alerts requiring immediate attention
  const criticalAlerts = [
    {
      id: 'AL001',
      type: 'security',
      priority: 'high',
      title: 'INTERPOL Red Notice Match',
      description: 'Passenger Marie Dubois flagged at Kigali Airport',
      timestamp: '2 minutes ago',
      action: 'Review Required'
    },

    {
      id: 'AL003',
      type: 'operational',
      priority: 'medium',
      title: 'High Volume Detected',
      description: 'Application submissions 45% above normal',
      timestamp: '1 hour ago',
      action: 'Scale Resources'
    }
  ];

  // Performance indicators with trends
  const performanceIndicators = [
    {
      icon: <FileText className="h-8 w-8 text-blue-light" />,
      value: systemMetrics.totalApplicationsToday.toString(),
      label: 'Applications Today',
      change: '+12%',
      trend: 'up' as const,
      sublabel: 'vs yesterday'
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
      value: systemMetrics.pendingReview.toString(),
      label: 'Pending Review',
      change: '-8%',
      trend: 'down' as const,
      sublabel: 'requires attention'
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      value: systemMetrics.alertsActive.toString(),
      label: 'Active Alerts',
      change: '+2',
      trend: 'up' as const,
      sublabel: 'security related'
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      value: systemMetrics.borderCrossingsToday.toLocaleString(),
      label: 'Border Crossings',
      change: '+5%',
      trend: 'up' as const,
      sublabel: 'within normal range'
    }
  ];

  // Quick action items based on role
  const getQuickActions = () => {
    const baseActions = [
      {
        id: 'entry-exit',
        title: 'Border Control',
        description: 'Real-time entry/exit logging and verification',
        icon: <Shield className="h-6 w-6" />,
        color: 'bg-red-600',
        urgent: true
      },
      {
        id: 'alerts',
        title: 'Active Alerts',
        description: 'Review security alerts and watchlist matches',
        icon: <AlertTriangle className="h-6 w-6" />,
        color: 'bg-yellow-600',
        urgent: true
      },

      {
        id: 'interpol',
        title: 'INTERPOL Database',
        description: 'International passenger verification',
        icon: <Database className="h-6 w-6" />,
        color: 'bg-navy-medium',
        urgent: false
      }
    ];

    const adminActions = [
      {
        id: 'analytics',
        title: 'System Analytics',
        description: 'Comprehensive performance and usage reports',
        icon: <BarChart3 className="h-6 w-6" />,
        color: 'bg-green-600',
        urgent: false
      },
      {
        id: 'agencies',
        title: 'Multi-Agency Access',
        description: 'Coordinate with international agencies',
        icon: <Globe className="h-6 w-6" />,
        color: 'bg-purple-600',
        urgent: false
      }
    ];

    let actions = [...baseActions];
    if (isAdmin || isSuperAdmin) {
      actions = [...actions, ...adminActions];
    }

    return actions;
  };

  // Recent activity feed
  const recentActivity = [
    {
      time: '14:32',
      action: 'Border Alert',
      details: 'Red Notice match at Kigali Airport - Officer BO247 notified',
      type: 'critical',
      user: 'System'
    },
    {
      time: '14:28',
      action: 'Application Approved',
      details: 'Passport application PA2024001456 approved by Officer Smith',
      type: 'success',
      user: 'M. Smith'
    },

    {
      time: '14:20',
      action: 'Payment Processed',
      details: 'Visa fee payment of 75,000 RWF confirmed via MTN Money',
      type: 'success',
      user: 'System'
    },
    {
      time: '14:15',
      action: 'System Update',
      details: 'INTERPOL database sync completed - 1,247 new records',
      type: 'info',
      user: 'System'
    }
  ];

  const quickActions = getQuickActions();

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark text-blue-lightest">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-blue-lightest mb-2">
                Control Center Dashboard
              </h1>
              <p className="text-blue-light">
                Welcome back, {user?.firstName}. {systemMetrics.alertsActive} alerts require attention.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                variant="outline"
                className="px-3 py-1 text-sm border-blue-light text-blue-light bg-navy-medium/50"
              >
                <Activity className="h-3 w-3 mr-1" />
                System Online
              </Badge>
              <div className="text-right text-sm">
                <div className="text-blue-lightest font-medium">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-blue-light">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts Section */}
        {criticalAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-blue-lightest mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Critical Alerts ({criticalAlerts.length})
            </h2>
            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <Card key={alert.id} className={`${getAlertColor(alert.priority)} bg-navy-medium border-none`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-blue-lightest">{alert.title}</h4>
                          <Badge
                            className={`text-xs ${alert.priority === 'high' ? 'bg-red-500 text-white' :
                                alert.priority === 'medium' ? 'bg-yellow-500 text-black' :
                                  'bg-blue-500 text-white'
                              }`}
                          >
                            {alert.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-blue-light text-sm mb-2">{alert.description}</p>
                        <div className="text-xs text-blue-light">{alert.timestamp}</div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-blue-light hover:bg-blue-medium text-navy-dark"
                        onClick={() => onPageChange('alerts')}
                      >
                        {alert.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Performance Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {performanceIndicators.map((indicator, index) => (
            <Card key={index} className="bg-navy-medium border-blue-medium hover:bg-navy-medium/80 transition-colors">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="flex justify-center mb-3">
                  {indicator.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold mb-1 text-blue-lightest">{indicator.value}</div>
                <div className="text-xs sm:text-sm text-blue-light mb-2">{indicator.label}</div>
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp className={`h-3 w-3 ${indicator.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`} />
                  <span className={`text-xs font-medium ${indicator.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {indicator.change}
                  </span>
                </div>
                <div className="text-xs text-blue-light mt-1">{indicator.sublabel}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-blue-lightest mb-4">Priority Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Card
                  key={action.id}
                  className="bg-navy-medium border-blue-medium cursor-pointer hover:bg-navy-medium/80 transition-all duration-200 hover:-translate-y-1"
                  onClick={() => onPageChange(action.id)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg text-white ${action.color}`}>
                        {action.icon}
                      </div>
                      {action.urgent && (
                        <Badge className="bg-red-500 text-white text-xs">Urgent</Badge>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-lightest">{action.title}</h3>
                    <p className="text-xs sm:text-sm text-blue-light mb-4">{action.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-light text-blue-light hover:bg-blue-light hover:text-navy-dark"
                    >
                      Access Tool
                      <ArrowRight className="h-3 w-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-blue-lightest mb-4">Recent Activity</h2>
            <Card className="bg-navy-medium border-blue-medium">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-lightest">{activity.action}</p>
                          <span className="text-xs text-blue-light">{activity.time}</span>
                        </div>
                        <p className="text-xs text-blue-light mt-1">{activity.details}</p>
                        <p className="text-xs text-blue-light/70 mt-1">by {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 border-blue-light text-blue-light hover:bg-blue-light hover:text-navy-dark"
                >
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-navy-medium border-blue-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-lightest">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Security Status</span>
              </CardTitle>
              <CardDescription className="text-blue-light">All security systems operational</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-light">INTERPOL Connection</span>
                    <span className="text-green-400 font-medium">100%</span>
                  </div>
                  <Progress value={100} className="h-2 bg-navy-dark" />
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-light">Border Terminals</span>
                    <span className="text-green-400 font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2 bg-navy-dark" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-medium border-blue-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-lightest">
                <BarChart3 className="h-5 w-5 text-blue-light" />
                <span>Performance Metrics</span>
              </CardTitle>
              <CardDescription className="text-blue-light">Real-time system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-light">Response Time</span>
                    <span className="text-blue-light font-medium">{systemMetrics.avgProcessingTime}s</span>
                  </div>
                  <Progress value={85} className="h-2 bg-navy-dark" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-light">Success Rate</span>
                    <span className="text-green-400 font-medium">{systemMetrics.successRate}%</span>
                  </div>
                  <Progress value={systemMetrics.successRate} className="h-2 bg-navy-dark" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-blue-light">System Uptime</span>
                    <span className="text-green-400 font-medium">{systemMetrics.systemUptime}%</span>
                  </div>
                  <Progress value={systemMetrics.systemUptime} className="h-2 bg-navy-dark" />
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 border-blue-light text-blue-light hover:bg-blue-light hover:text-navy-dark"
                onClick={() => onPageChange('analytics')}
              >
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}