import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Shield,
  Activity,
  Download,
  RefreshCw,
  Eye,
  Settings,
  Database,
  Server,
  Cpu
} from "lucide-react";
import { motion } from "motion/react";

const applicationData = [
  { month: 'Jan', passports: 450, visas: 320, permits: 180, citizenship: 45 },
  { month: 'Feb', passports: 520, visas: 380, permits: 210, citizenship: 52 },
  { month: 'Mar', passports: 610, visas: 420, permits: 245, citizenship: 61 },
  { month: 'Apr', passports: 580, visas: 390, permits: 220, citizenship: 58 },
  { month: 'May', passports: 670, visas: 460, permits: 280, citizenship: 67 },
  { month: 'Jun', passports: 720, visas: 510, permits: 310, citizenship: 73 }
];

const borderCrossingsData = [
  { time: '00:00', arrivals: 12, departures: 8 },
  { time: '04:00', arrivals: 45, departures: 23 },
  { time: '08:00', arrivals: 156, departures: 89 },
  { time: '12:00', arrivals: 234, departures: 178 },
  { time: '16:00', arrivals: 198, departures: 210 },
  { time: '20:00', arrivals: 112, departures: 145 }
];

const nationalityDistribution = [
  { name: 'East Africa', value: 4200, color: '#3b82f6' },
  { name: 'Europe', value: 2100, color: '#10b981' },
  { name: 'North America', value: 1800, color: '#f59e0b' },
  { name: 'Asia', value: 1500, color: '#8b5cf6' },
  { name: 'Others', value: 900, color: '#6b7280' }
];

const riskAnalytics = [
  { category: 'Low Risk', count: 8450, percentage: 92 },
  { category: 'Medium Risk', count: 520, percentage: 6 },
  { category: 'High Risk', count: 145, percentage: 1.5 },
  { category: 'Critical', count: 35, percentage: 0.5 }
];

export function ProfessionalAdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = {
    totalApplications: 15847,
    applicationChange: '+14.5%',
    borderCrossings: 10523,
    crossingsChange: '+8.2%',
    activeAlerts: 23,
    alertsChange: '-12.3%',
    systemUptime: '99.97%',
    uptimeChange: '+0.02%'
  };

  const systemHealth = {
    apiRespons: 45,
    dbLoad: 67,
    cpuUsage: 42,
    memoryUsage: 58
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-[#0A0F1C] dark:via-[#0D1526] dark:to-[#0A0F1C]">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0D1526]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy-dark dark:text-white flex items-center gap-3">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                National Border System • Administrative Control
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Comprehensive analytics, monitoring & management dashboard
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-200 dark:border-white/10 rounded-lg bg-white dark:bg-[#1E293B] text-navy-dark dark:text-white"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-slate-200 dark:border-white/10 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-blue-100 font-medium">Total Applications</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalApplications.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{stats.applicationChange}</span>
                      <span className="text-xs text-blue-100">vs last period</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-slate-200 dark:border-white/10 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-green-100 font-medium">Border Crossings</p>
                    <p className="text-3xl font-bold mt-2">{stats.borderCrossings.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{stats.crossingsChange}</span>
                      <span className="text-xs text-green-100">vs last period</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-slate-200 dark:border-white/10 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-orange-100 font-medium">Active Alerts</p>
                    <p className="text-3xl font-bold mt-2">{stats.activeAlerts}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm font-medium">{stats.alertsChange}</span>
                      <span className="text-xs text-orange-100">vs last period</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-slate-200 dark:border-white/10 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-purple-100 font-medium">System Uptime</p>
                    <p className="text-3xl font-bold mt-2">{stats.systemUptime}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">{stats.uptimeChange}</span>
                      <span className="text-xs text-purple-100">vs target</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Trends */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-navy-dark dark:text-white">Application Trends</CardTitle>
              <CardDescription>Monthly application volumes by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="passports" fill="#3b82f6" name="Passports" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="visas" fill="#10b981" name="Visas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="permits" fill="#f59e0b" name="Permits" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="citizenship" fill="#8b5cf6" name="Citizenship" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Border Crossings Timeline */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-navy-dark dark:text-white">Border Traffic</CardTitle>
              <CardDescription>Real-time arrivals and departures</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={borderCrossingsData}>
                  <defs>
                    <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDepartures" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis dataKey="time" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="arrivals"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorArrivals)"
                    name="Arrivals"
                  />
                  <Area
                    type="monotone"
                    dataKey="departures"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorDepartures)"
                    name="Departures"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Nationality Distribution */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-navy-dark dark:text-white">Traveler Origins</CardTitle>
              <CardDescription>Distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={nationalityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {nationalityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {nationalityDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <span className="font-semibold text-navy-dark dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Analytics */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-navy-dark dark:text-white">Risk Analysis</CardTitle>
              <CardDescription>Security risk distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAnalytics.map((risk, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{risk.category}</span>
                      <span className="font-semibold text-navy-dark dark:text-white">
                        {risk.count.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${risk.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full ${
                          risk.category === 'Low Risk'
                            ? 'bg-green-500'
                            : risk.category === 'Medium Risk'
                            ? 'bg-yellow-500'
                            : risk.category === 'High Risk'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-navy-dark dark:text-white">System Health</CardTitle>
              <CardDescription>Infrastructure performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-slate-600 dark:text-slate-400">API Response</span>
                    </div>
                    <span className="font-semibold text-navy-dark dark:text-white">
                      {systemHealth.apiRespons}ms
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${100 - systemHealth.apiRespons}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-slate-600 dark:text-slate-400">Database Load</span>
                    </div>
                    <span className="font-semibold text-navy-dark dark:text-white">
                      {systemHealth.dbLoad}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${systemHealth.dbLoad}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-slate-600 dark:text-slate-400">CPU Usage</span>
                    </div>
                    <span className="font-semibold text-navy-dark dark:text-white">
                      {systemHealth.cpuUsage}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500"
                      style={{ width: `${systemHealth.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-slate-600 dark:text-slate-400">Memory Usage</span>
                    </div>
                    <span className="font-semibold text-navy-dark dark:text-white">
                      {systemHealth.memoryUsage}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${systemHealth.memoryUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
