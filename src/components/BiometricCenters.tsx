import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  MapPin, 
  Users, 
  Clock, 
  Calendar, 
  Phone, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Fingerprint,
  Camera,
  Shield,
  Wifi,
  WifiOff,
  Activity
} from "lucide-react";

interface BiometricCenter {
  id: string;
  name: string;
  address: string;
  district: string;
  province: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
    manager: string;
  };
  capacity: {
    daily: number;
    current: number;
    peak: number;
  };
  equipment: {
    fingerprintScanners: number;
    facialCameras: number;
    irisScanners: number;
    computers: number;
  };
  services: string[];
  status: 'active' | 'maintenance' | 'closed' | 'limited';
  hours: {
    weekdays: string;
    weekends: string;
  };
  metrics: {
    totalEnrollments: number;
    successRate: number;
    avgWaitTime: number;
    customerSatisfaction: number;
  };
  lastInspection: Date;
  nextInspection: Date;
  connectivity: 'excellent' | 'good' | 'poor' | 'offline';
}

interface Appointment {
  id: string;
  centerId: string;
  applicantName: string;
  service: string;
  scheduledTime: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'no-show' | 'cancelled';
  estimatedDuration: number;
}

export function BiometricCenters() {
  const [currentTab, setCurrentTab] = useState('overview');
  const [centers, setCenters] = useState<BiometricCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<BiometricCenter | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for biometric centers
  const mockCenters: BiometricCenter[] = [
    {
      id: 'CTR001',
      name: 'Kigali Main Immigration Center',
      address: 'KG 7 Ave, Kigali City',
      district: 'Gasabo',
      province: 'Kigali City',
      coordinates: { lat: -1.9441, lng: 30.0619 },
      contact: {
        phone: '+250 788 123 456',
        email: 'kigali.main@immigration.gov.rw',
        manager: 'Jean Baptiste Nzeyimana'
      },
      capacity: { daily: 200, current: 45, peak: 180 },
      equipment: {
        fingerprintScanners: 8,
        facialCameras: 6,
        irisScanners: 2,
        computers: 10
      },
      services: ['Passport Biometrics', 'Visa Biometrics', 'National ID', 'Work Permit'],
      status: 'active',
      hours: {
        weekdays: '8:00 AM - 5:00 PM',
        weekends: '9:00 AM - 2:00 PM'
      },
      metrics: {
        totalEnrollments: 15420,
        successRate: 98.7,
        avgWaitTime: 12,
        customerSatisfaction: 4.6
      },
      lastInspection: new Date('2024-01-15'),
      nextInspection: new Date('2024-04-15'),
      connectivity: 'excellent'
    },
    {
      id: 'CTR002',
      name: 'Huye District Service Center',
      address: 'Huye District, Southern Province',
      district: 'Huye',
      province: 'Southern Province',
      coordinates: { lat: -2.5965, lng: 29.7386 },
      contact: {
        phone: '+250 788 123 457',
        email: 'huye@immigration.gov.rw',
        manager: 'Marie Claire Uwimana'
      },
      capacity: { daily: 100, current: 23, peak: 85 },
      equipment: {
        fingerprintScanners: 4,
        facialCameras: 3,
        irisScanners: 1,
        computers: 5
      },
      services: ['Passport Biometrics', 'National ID', 'Birth Certificate'],
      status: 'active',
      hours: {
        weekdays: '8:00 AM - 4:00 PM',
        weekends: 'Closed'
      },
      metrics: {
        totalEnrollments: 8920,
        successRate: 97.2,
        avgWaitTime: 8,
        customerSatisfaction: 4.4
      },
      lastInspection: new Date('2024-01-10'),
      nextInspection: new Date('2024-04-10'),
      connectivity: 'good'
    },
    {
      id: 'CTR003',
      name: 'Musanze Border Post',
      address: 'Musanze District, Northern Province',
      district: 'Musanze',
      province: 'Northern Province',
      coordinates: { lat: -1.4996, lng: 29.6346 },
      contact: {
        phone: '+250 788 123 458',
        email: 'musanze@immigration.gov.rw',
        manager: 'Paul Kagame Nshimiyimana'
      },
      capacity: { daily: 150, current: 67, peak: 120 },
      equipment: {
        fingerprintScanners: 6,
        facialCameras: 4,
        irisScanners: 1,
        computers: 7
      },
      services: ['Border Control', 'Transit Visa', 'Emergency Documents'],
      status: 'active',
      hours: {
        weekdays: '24/7',
        weekends: '24/7'
      },
      metrics: {
        totalEnrollments: 12350,
        successRate: 96.8,
        avgWaitTime: 15,
        customerSatisfaction: 4.2
      },
      lastInspection: new Date('2024-01-20'),
      nextInspection: new Date('2024-04-20'),
      connectivity: 'poor'
    },
    {
      id: 'CTR004',
      name: 'Rubavu Immigration Office',
      address: 'Rubavu District, Western Province',
      district: 'Rubavu',
      province: 'Western Province',
      coordinates: { lat: -1.6707, lng: 29.2609 },
      contact: {
        phone: '+250 788 123 459',
        email: 'rubavu@immigration.gov.rw',
        manager: 'Agnes Mukamana'
      },
      capacity: { daily: 80, current: 12, peak: 60 },
      equipment: {
        fingerprintScanners: 3,
        facialCameras: 2,
        irisScanners: 0,
        computers: 4
      },
      services: ['Passport Biometrics', 'Work Permit'],
      status: 'maintenance',
      hours: {
        weekdays: '8:00 AM - 4:00 PM',
        weekends: 'Closed'
      },
      metrics: {
        totalEnrollments: 5640,
        successRate: 95.5,
        avgWaitTime: 20,
        customerSatisfaction: 4.0
      },
      lastInspection: new Date('2024-01-05'),
      nextInspection: new Date('2024-02-05'),
      connectivity: 'offline'
    }
  ];

  const mockAppointments: Appointment[] = [
    {
      id: 'APT001',
      centerId: 'CTR001',
      applicantName: 'John Doe',
      service: 'Passport Biometrics',
      scheduledTime: new Date(Date.now() + 3600000),
      status: 'scheduled',
      estimatedDuration: 30
    },
    {
      id: 'APT002',
      centerId: 'CTR001',
      applicantName: 'Jane Smith',
      service: 'Visa Biometrics',
      scheduledTime: new Date(Date.now() + 1800000),
      status: 'in-progress',
      estimatedDuration: 25
    },
    {
      id: 'APT003',
      centerId: 'CTR002',
      applicantName: 'Alice Johnson',
      service: 'National ID',
      scheduledTime: new Date(Date.now() + 7200000),
      status: 'scheduled',
      estimatedDuration: 20
    }
  ];

  useEffect(() => {
    setCenters(mockCenters);
    setAppointments(mockAppointments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'limited': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConnectivityIcon = (connectivity: string) => {
    switch (connectivity) {
      case 'excellent': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'good': return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'poor': return <Wifi className="h-4 w-4 text-yellow-500" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-500" />;
      default: return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAppointmentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Activity className="h-4 w-4 text-blue-500" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'no-show': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         center.province.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || center.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCapacity = centers.reduce((sum, center) => sum + center.capacity.daily, 0);
  const totalCurrent = centers.reduce((sum, center) => sum + center.capacity.current, 0);
  const avgUtilization = Math.round((totalCurrent / totalCapacity) * 100);

  return (
    <div className="min-h-screen bg-navy-dark p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-lightest mb-2">
                Biometric Centers Management
              </h1>
              <p className="text-blue-light">
                Monitor and manage biometric enrollment centers across Rwanda
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-blue-light text-blue-light">
                {centers.filter(c => c.status === 'active').length} Active Centers
              </Badge>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Center
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-navy-medium border-blue-medium max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-blue-lightest">Add New Biometric Center</DialogTitle>
                    <DialogDescription className="text-blue-light">
                      Configure a new biometric enrollment center location
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-blue-light">Center Name</Label>
                        <Input className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                      <div>
                        <Label className="text-blue-light">District</Label>
                        <Select>
                          <SelectTrigger className="bg-navy-dark border-blue-medium text-blue-lightest">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent className="bg-navy-medium border-blue-medium">
                            <SelectItem value="gasabo" className="text-blue-lightest">Gasabo</SelectItem>
                            <SelectItem value="huye" className="text-blue-lightest">Huye</SelectItem>
                            <SelectItem value="musanze" className="text-blue-lightest">Musanze</SelectItem>
                            <SelectItem value="rubavu" className="text-blue-lightest">Rubavu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-blue-light">Address</Label>
                      <Textarea className="bg-navy-dark border-blue-medium text-blue-lightest" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-blue-light">Daily Capacity</Label>
                        <Input type="number" className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                      <div>
                        <Label className="text-blue-light">Manager Name</Label>
                        <Input className="bg-navy-dark border-blue-medium text-blue-lightest" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-blue-light text-blue-light">
                        Cancel
                      </Button>
                      <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                        Create Center
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-2xl font-bold text-blue-lightest">{centers.length}</div>
              <div className="text-sm text-blue-light">Total Centers</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-blue-lightest">{centers.filter(c => c.status === 'active').length}</div>
              <div className="text-sm text-blue-light">Active Centers</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-blue-lightest">{totalCurrent}</div>
              <div className="text-sm text-blue-light">Current Capacity</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-blue-lightest">{avgUtilization}%</div>
              <div className="text-sm text-blue-light">Avg Utilization</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-navy-medium">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="centers" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <MapPin className="h-4 w-4 mr-2" />
              Centers
            </TabsTrigger>
            <TabsTrigger value="appointments" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Calendar className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Activity className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">System Status</CardTitle>
                  <CardDescription className="text-blue-light">
                    Real-time status of all biometric centers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {centers.map((center) => (
                    <div key={center.id} className="flex justify-between items-center p-3 bg-navy-dark rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getConnectivityIcon(center.connectivity)}
                        <div>
                          <div className="text-blue-lightest text-sm font-medium">{center.name}</div>
                          <div className="text-blue-light text-xs">{center.district}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(center.status)}>
                          {center.status}
                        </Badge>
                        <div className="text-right">
                          <div className="text-blue-lightest text-sm">{center.capacity.current}/{center.capacity.daily}</div>
                          <div className="text-blue-light text-xs">
                            {Math.round((center.capacity.current / center.capacity.daily) * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Recent Activity</CardTitle>
                  <CardDescription className="text-blue-light">
                    Latest events across all centers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: '14:32', action: 'Equipment Maintenance', center: 'Rubavu', type: 'warning' },
                      { time: '14:15', action: 'New Enrollment', center: 'Kigali Main', type: 'success' },
                      { time: '14:08', action: 'System Update', center: 'Huye', type: 'info' },
                      { time: '13:45', action: 'Capacity Alert', center: 'Musanze', type: 'warning' },
                      { time: '13:22', action: 'Inspection Completed', center: 'Kigali Main', type: 'success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' :
                          activity.type === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-blue-lightest text-sm">{activity.action}</p>
                            <span className="text-blue-light text-xs">{activity.time}</span>
                          </div>
                          <p className="text-blue-light text-xs mt-1">{activity.center}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Capacity Overview */}
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Capacity Overview</CardTitle>
                <CardDescription className="text-blue-light">
                  Current utilization across all centers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centers.map((center) => {
                    const utilization = Math.round((center.capacity.current / center.capacity.daily) * 100);
                    return (
                      <div key={center.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-lightest text-sm font-medium">{center.name}</span>
                            <Badge className={getStatusColor(center.status)} />
                          </div>
                          <span className="text-blue-light text-sm">
                            {center.capacity.current}/{center.capacity.daily} ({utilization}%)
                          </span>
                        </div>
                        <Progress 
                          value={utilization} 
                          className={`h-2 ${
                            utilization > 90 ? 'bg-red-500' :
                            utilization > 70 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Centers Tab */}
          <TabsContent value="centers" className="space-y-6">
            {/* Filters */}
            <Card className="bg-navy-medium border-blue-medium">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search centers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-navy-dark border-blue-medium text-blue-lightest"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48 bg-navy-dark border-blue-medium text-blue-lightest">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-medium border-blue-medium">
                      <SelectItem value="all" className="text-blue-lightest">All Statuses</SelectItem>
                      <SelectItem value="active" className="text-blue-lightest">Active</SelectItem>
                      <SelectItem value="maintenance" className="text-blue-lightest">Maintenance</SelectItem>
                      <SelectItem value="closed" className="text-blue-lightest">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Centers Grid */}
            <div className="space-y-6">
              {filteredCenters.map((center) => (
                <Card key={center.id} className="bg-navy-medium border-blue-medium">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-blue-lightest flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          {center.name}
                        </CardTitle>
                        <CardDescription className="text-blue-light">
                          {center.address} • {center.district}, {center.province}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getConnectivityIcon(center.connectivity)}
                        <Badge className={getStatusColor(center.status)}>
                          {center.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-blue-lightest font-medium mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-blue-light" />
                            <span className="text-blue-light">{center.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-blue-light" />
                            <span className="text-blue-light">{center.contact.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-light" />
                            <span className="text-blue-light">{center.contact.manager}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-blue-lightest font-medium mb-3">Capacity & Hours</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-light">Daily Capacity:</span>
                            <span className="text-blue-lightest">{center.capacity.daily}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-light">Current Load:</span>
                            <span className="text-blue-lightest">{center.capacity.current}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-light">Peak Load:</span>
                            <span className="text-blue-lightest">{center.capacity.peak}</span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-blue-medium">
                            <div className="text-blue-light">Weekdays: {center.hours.weekdays}</div>
                            <div className="text-blue-light">Weekends: {center.hours.weekends}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-blue-lightest font-medium mb-3">Equipment Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Fingerprint className="h-4 w-4 text-blue-light" />
                              <span className="text-blue-light">Fingerprint</span>
                            </div>
                            <span className="text-blue-lightest">{center.equipment.fingerprintScanners}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Camera className="h-4 w-4 text-blue-light" />
                              <span className="text-blue-light">Facial</span>
                            </div>
                            <span className="text-blue-lightest">{center.equipment.facialCameras}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4 text-blue-light" />
                              <span className="text-blue-light">Iris</span>
                            </div>
                            <span className="text-blue-lightest">{center.equipment.irisScanners}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h4 className="text-blue-lightest font-medium mb-3">Performance Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-blue-lightest text-lg font-bold">{center.metrics.totalEnrollments.toLocaleString()}</div>
                          <div className="text-blue-light text-sm">Total Enrollments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-lightest text-lg font-bold">{center.metrics.successRate}%</div>
                          <div className="text-blue-light text-sm">Success Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-lightest text-lg font-bold">{center.metrics.avgWaitTime}min</div>
                          <div className="text-blue-light text-sm">Avg Wait Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-blue-lightest text-lg font-bold">{center.metrics.customerSatisfaction}/5</div>
                          <div className="text-blue-light text-sm">Satisfaction</div>
                        </div>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-blue-lightest font-medium mb-3">Available Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {center.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="border-blue-light text-blue-light">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-medium">
                      <Button 
                        size="sm" 
                        className="bg-blue-light hover:bg-blue-medium text-navy-dark"
                        onClick={() => setSelectedCenter(center)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Today's Appointments</CardTitle>
                <CardDescription className="text-blue-light">
                  Manage appointments across all biometric centers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => {
                    const center = centers.find(c => c.id === appointment.centerId);
                    return (
                      <Card key={appointment.id} className="bg-navy-dark border-blue-medium">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start space-x-3">
                              {getAppointmentStatusIcon(appointment.status)}
                              <div>
                                <h4 className="text-blue-lightest font-medium">{appointment.applicantName}</h4>
                                <p className="text-blue-light text-sm">{appointment.service}</p>
                                <p className="text-blue-light text-xs mt-1">
                                  {center?.name} • {appointment.scheduledTime.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                appointment.status === 'completed' ? 'bg-green-600' :
                                appointment.status === 'in-progress' ? 'bg-blue-600' :
                                appointment.status === 'scheduled' ? 'bg-gray-600' :
                                'bg-red-600'
                              }>
                                {appointment.status.replace('-', ' ').toUpperCase()}
                              </Badge>
                              <p className="text-blue-light text-sm mt-1">
                                {appointment.estimatedDuration} min
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Enrollment Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-blue-light mx-auto mb-4" />
                    <p className="text-blue-light">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {centers.map((center) => (
                      <div key={center.id} className="flex justify-between">
                        <span className="text-blue-light">{center.name}</span>
                        <span className="text-blue-lightest">{center.metrics.successRate}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}