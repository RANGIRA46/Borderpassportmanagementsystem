import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Fingerprint,
  Plane,
  MapPin,
  TrendingUp,
  Activity,
  Eye,
  FileText,
  UserCheck,
  XCircle
} from "lucide-react";
import { motion } from "motion/react";

interface TravelerRecord {
  id: string;
  name: string;
  passport: string;
  nationality: string;
  flight: string;
  status: 'clearing' | 'cleared' | 'detained' | 'flagged';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  arrivalTime: string;
  gate: string;
  biometricStatus: 'pending' | 'verified' | 'failed';
}

const mockTravelers: TravelerRecord[] = [
  {
    id: 'T001',
    name: 'John Smith',
    passport: 'US123456789',
    nationality: 'United States',
    flight: 'RW 205',
    status: 'cleared',
    riskLevel: 'low',
    arrivalTime: '14:30',
    gate: 'A12',
    biometricStatus: 'verified'
  },
  {
    id: 'T002',
    name: 'Maria Garcia',
    passport: 'ES987654321',
    nationality: 'Spain',
    flight: 'RW 205',
    status: 'clearing',
    riskLevel: 'low',
    arrivalTime: '14:30',
    gate: 'A12',
    biometricStatus: 'verified'
  },
  {
    id: 'T003',
    name: 'Ahmed Hassan',
    passport: 'EG445566778',
    nationality: 'Egypt',
    flight: 'ET 309',
    status: 'flagged',
    riskLevel: 'medium',
    arrivalTime: '15:15',
    gate: 'B05',
    biometricStatus: 'pending'
  },
  {
    id: 'T004',
    name: 'Li Wei',
    passport: 'CN998877665',
    nationality: 'China',
    flight: 'CA 768',
    status: 'clearing',
    riskLevel: 'low',
    arrivalTime: '16:00',
    gate: 'C08',
    biometricStatus: 'verified'
  }
];

export function OfficerDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    todayCrossings: 1247,
    inQueue: 23,
    avgWaitTime: '8 min',
    activeBooths: 12,
    cleared: 1189,
    detained: 3,
    flagged: 8,
    processingRate: '96 pax/hr'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'clearing': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20';
      case 'flagged': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'detained': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'critical': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="border-b border-[#262626] bg-[#0f0f0f]">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Shield className="h-7 w-7 text-blue-500" />
                Officer Control Center
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Real-time border operations & traveler processing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 border-[#262626] text-gray-300 hover:bg-[#1a1a1a]">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-[#262626] text-gray-300 hover:bg-[#1a1a1a]">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Today's Crossings</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.todayCrossings}
                    </p>
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% from yesterday
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-7 w-7 text-blue-400" />
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
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">In Queue</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.inQueue}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Avg wait: {stats.avgWaitTime}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <Clock className="h-7 w-7 text-orange-400" />
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
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Alerts</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.flagged}
                    </p>
                    <p className="text-xs text-yellow-400 mt-1">
                      {stats.detained} detained
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-7 w-7 text-yellow-400" />
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
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Booths</p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats.activeBooths}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {stats.processingRate}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Activity className="h-7 w-7 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="bg-[#1a1a1a] border border-[#262626]">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-[#262626] data-[state=active]:text-white">
              <Activity className="h-4 w-4" />
              Live Processing
            </TabsTrigger>
            <TabsTrigger value="queue" className="gap-2 data-[state=active]:bg-[#262626] data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Queue Management
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2 data-[state=active]:bg-[#262626] data-[state=active]:text-white">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="verification" className="gap-2 data-[state=active]:bg-[#262626] data-[state=active]:text-white">
              <Fingerprint className="h-4 w-4" />
              Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Search & Filters */}
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, passport, or flight number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#0f0f0f] border-[#262626] text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button variant="outline" className="gap-2 border-[#262626] text-gray-300 hover:bg-[#262626]">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Traveler List */}
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Active Travelers</CardTitle>
                <CardDescription className="text-gray-400">Real-time traveler processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTravelers.map((traveler, index) => (
                    <motion.div
                      key={traveler.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-[#262626] rounded-lg p-4 hover:bg-[#1f1f1f] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {traveler.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-semibold text-white">
                                {traveler.name}
                              </h4>
                              <Badge className={getRiskColor(traveler.riskLevel)}>
                                {traveler.riskLevel.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(traveler.status)}>
                                {traveler.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 mt-1 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {traveler.passport}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {traveler.nationality}
                              </span>
                              <span className="flex items-center gap-1">
                                <Plane className="h-3 w-3" />
                                {traveler.flight}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {traveler.arrivalTime} • Gate {traveler.gate}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {traveler.biometricStatus === 'verified' && (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          )}
                          {traveler.biometricStatus === 'pending' && (
                            <Clock className="h-5 w-5 text-orange-400" />
                          )}
                          {traveler.biometricStatus === 'failed' && (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                          
                          <Button size="sm" variant="outline" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity border-[#262626] text-gray-300">
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue">
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Queue Management</CardTitle>
                <CardDescription className="text-gray-400">Monitor and manage traveler queues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  Queue management interface
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Active Alerts</CardTitle>
                <CardDescription className="text-gray-400">Security alerts and watchlist matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  Alerts interface
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card className="border-[#262626] bg-[#1a1a1a]">
              <CardHeader>
                <CardTitle className="text-white">Identity Verification</CardTitle>
                <CardDescription className="text-gray-400">Biometric and document verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-400">
                  Verification interface
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}