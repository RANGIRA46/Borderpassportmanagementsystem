import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  Plane, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Download,
  Calendar,
  Globe,
  Shield,
  Car,
  Package,
  UserCheck,
  Baby,
  MapPin,
  Ship,
  Truck,
  Database,
  BarChart3
} from "lucide-react";

export function EnhancedAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [viewType, setViewType] = useState('overview');

  // Enhanced mock data for comprehensive analytics
  const borderCrossings = [
    { name: 'Mon', entries: 1240, exits: 1180, total: 2420, male: 1200, female: 1120, children: 100 },
    { name: 'Tue', entries: 1180, exits: 1220, total: 2400, male: 1150, female: 1080, children: 170 },
    { name: 'Wed', entries: 1350, exits: 1290, total: 2640, male: 1320, female: 1210, children: 110 },
    { name: 'Thu', entries: 1420, exits: 1380, total: 2800, male: 1400, female: 1250, children: 150 },
    { name: 'Fri', entries: 1680, exits: 1620, total: 3300, male: 1650, female: 1480, children: 170 },
    { name: 'Sat', entries: 980, exits: 920, total: 1900, male: 920, female: 850, children: 130 },
    { name: 'Sun', entries: 850, exits: 890, total: 1740, male: 820, female: 780, children: 140 }
  ];

  // Demographics data
  const demographicsData = [
    { category: 'Adult Male', value: 45, count: 8950, color: '#8884d8' },
    { category: 'Adult Female', value: 42, count: 8340, color: '#82ca9d' },
    { category: 'Children (0-17)', value: 13, count: 2580, color: '#ffc658' }
  ];

  // Cross-border goods and vehicles tracking
  const crossBorderMovement = [
    { name: 'Mon', vehicles: 450, goods: 1200, packages: 890 },
    { name: 'Tue', vehicles: 420, goods: 1150, packages: 920 },
    { name: 'Wed', vehicles: 580, goods: 1340, packages: 1050 },
    { name: 'Thu', vehicles: 620, goods: 1420, packages: 1120 },
    { name: 'Fri', vehicles: 750, goods: 1680, packages: 1380 },
    { name: 'Sat', vehicles: 380, goods: 980, packages: 720 },
    { name: 'Sun', vehicles: 320, goods: 850, packages: 650 }
  ];

  // Vehicle types data
  const vehicleTypes = [
    { type: 'Private Cars', count: 2850, percentage: 52, icon: Car },
    { type: 'Commercial Trucks', count: 1420, percentage: 26, icon: Truck },
    { type: 'Buses', count: 680, percentage: 12, icon: Users },
    { type: 'Motorcycles', count: 340, percentage: 6, icon: Car },
    { type: 'Others', count: 210, percentage: 4, icon: Car }
  ];

  // Goods categories
  const goodsCategories = [
    { category: 'Electronics', value: 25, count: 3250, trend: 'up' },
    { category: 'Textiles', value: 20, count: 2600, trend: 'stable' },
    { category: 'Food Products', value: 18, count: 2340, trend: 'up' },
    { category: 'Medical Supplies', value: 15, count: 1950, trend: 'down' },
    { category: 'Raw Materials', value: 12, count: 1560, trend: 'up' },
    { category: 'Others', value: 10, count: 1300, trend: 'stable' }
  ];

  // Regional movement patterns
  const regionalMovement = [
    { region: 'EAC Members', entries: 4580, exits: 4320, percentage: 65 },
    { region: 'CEPGL Countries', entries: 1240, exits: 1180, percentage: 18 },
    { region: 'SADC Countries', entries: 680, exits: 720, percentage: 10 },
    { region: 'Other African', entries: 320, exits: 340, percentage: 5 },
    { region: 'International', entries: 180, exits: 160, percentage: 2 }
  ];

  const trafficByLocation = [
    { name: 'Kilimanjaro Airport', value: 35, count: 12450, type: 'airport' },
    { name: 'Namanga Border', value: 22, count: 7840, type: 'land' },
    { name: 'Dar Port', value: 18, count: 6420, type: 'port' },
    { name: 'Sirari Border', value: 15, count: 5340, type: 'land' },
    { name: 'Other Points', value: 10, count: 3560, type: 'mixed' }
  ];

  const borderCenterConnectivity = [
    { center: 'Dar es Salaam HQ', connected: 15, total: 15, uptime: 99.8 },
    { center: 'Kilimanjaro', connected: 8, total: 8, uptime: 98.5 },
    { center: 'Mwanza', connected: 6, total: 7, uptime: 92.3 },
    { center: 'Mbeya', connected: 5, total: 6, uptime: 89.7 },
    { center: 'Tanga', connected: 4, total: 5, uptime: 87.2 }
  ];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const getTimeRangeLabel = (range: string) => {
    const labels = {
      '24h': 'Last 24 Hours',
      '7d': 'Last 7 Days',
      '30d': 'Last 30 Days',
      '90d': 'Last 90 Days',
      '1y': 'Last Year'
    };
    return labels[range as keyof typeof labels];
  };

  const generateReport = () => {
    alert('Generating comprehensive analytics report with demographics and cross-border movement data...');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl mb-2">Enhanced Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive border management analytics with demographics and cross-border movement tracking
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-medium">19,870</div>
                <div className="text-sm text-muted-foreground">Total People</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-medium">3,520</div>
                <div className="text-sm text-muted-foreground">Vehicles</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+8.7%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Package className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-medium">8,640</div>
                <div className="text-sm text-muted-foreground">Goods/Packages</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+15.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-medium">38/42</div>
                <div className="text-sm text-muted-foreground">Centers Online</div>
                <div className="flex items-center mt-1">
                  <div className="text-xs text-green-600">90.5% Uptime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-medium">12</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">-23.1%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={viewType} onValueChange={setViewType} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="crossborder">Cross-Border</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Border Crossings</CardTitle>
                <CardDescription>Entry and exit patterns over the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={borderCrossings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="entries" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="exits" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic by Location</CardTitle>
                <CardDescription>Distribution across border points</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficByLocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficByLocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Population Demographics
                </CardTitle>
                <CardDescription>Gender and age distribution of border crossers</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={demographicsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, value }) => `${category}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {demographicsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5" />
                  Daily Demographics Breakdown
                </CardTitle>
                <CardDescription>Gender and age patterns by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={borderCrossings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="male" stackId="a" fill="#8884d8" name="Male" />
                    <Bar dataKey="female" stackId="a" fill="#82ca9d" name="Female" />
                    <Bar dataKey="children" stackId="a" fill="#ffc658" name="Children" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {demographicsData.map((demo, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{demo.category}</h3>
                      <p className="text-2xl font-bold" style={{ color: demo.color }}>{demo.count.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{demo.value}% of total</p>
                    </div>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${demo.color}20` }}>
                      <span className="text-xl font-bold" style={{ color: demo.color }}>{demo.value}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crossborder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Cross-Border Movement
                </CardTitle>
                <CardDescription>Vehicles, goods, and packages crossing borders</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={crossBorderMovement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="vehicles" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="goods" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="packages" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Goods Categories
                </CardTitle>
                <CardDescription>Most transported goods across borders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goodsCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{category.category}</span>
                          <span className="text-sm text-muted-foreground">{category.count.toLocaleString()}</span>
                        </div>
                        <Progress value={category.value} className="h-2" />
                      </div>
                      <Badge 
                        variant={category.trend === 'up' ? 'default' : category.trend === 'down' ? 'destructive' : 'secondary'}
                        className="ml-3"
                      >
                        {category.trend === 'up' ? '↗' : category.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Types Distribution
              </CardTitle>
              <CardDescription>Breakdown of vehicles crossing borders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {vehicleTypes.map((vehicle, index) => {
                  const Icon = vehicle.icon;
                  return (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium text-sm">{vehicle.type}</h3>
                      <p className="text-2xl font-bold text-primary">{vehicle.count.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{vehicle.percentage}%</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Regional Movement Patterns
              </CardTitle>
              <CardDescription>Movement patterns by regional blocs and international visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionalMovement.map((region, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{region.region}</h3>
                      <Badge variant="outline">{region.percentage}%</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Entries: </span>
                        <span className="font-medium text-green-600">{region.entries.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Exits: </span>
                        <span className="font-medium text-blue-600">{region.exits.toLocaleString()}</span>
                      </div>
                    </div>
                    <Progress value={region.percentage} className="mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Border Centers Connectivity
              </CardTitle>
              <CardDescription>Central database connectivity across all border centers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borderCenterConnectivity.map((center, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{center.center}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={center.uptime > 95 ? 'default' : center.uptime > 85 ? 'secondary' : 'destructive'}>
                          {center.uptime}% Uptime
                        </Badge>
                        <Badge variant={center.connected === center.total ? 'default' : 'destructive'}>
                          {center.connected}/{center.total} Online
                        </Badge>
                      </div>
                    </div>
                    <Progress value={(center.connected / center.total) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {center.connected} of {center.total} systems connected to central database
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Real-time system metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database Response Time</span>
                    <span className="text-sm font-medium">142ms</span>
                  </div>
                  <Progress value={85} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Availability</span>
                    <span className="text-sm font-medium">99.7%</span>
                  </div>
                  <Progress value={99.7} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Usage</span>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                  <Progress value={67} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Metrics</CardTitle>
                <CardDescription>Security monitoring and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Security Level</span>
                    </div>
                    <Badge variant="default" className="bg-green-600">HIGH</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Failed Logins: </span>
                      <span className="font-medium">3</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Blocked IPs: </span>
                      <span className="font-medium">12</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Active Sessions: </span>
                      <span className="font-medium">247</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Suspicious Activities: </span>
                      <span className="font-medium">1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}