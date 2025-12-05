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
  Truck
} from "lucide-react";

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

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

  const trafficByLocation = [
    { name: 'Kilimanjaro Airport', value: 35, count: 12450, type: 'airport' },
    { name: 'Namanga Border', value: 22, count: 7840, type: 'land' },
    { name: 'Dar Port', value: 18, count: 6420, type: 'port' },
    { name: 'Sirari Border', value: 15, count: 5340, type: 'land' },
    { name: 'Other Points', value: 10, count: 3560, type: 'mixed' }
  ];

  // Regional movement patterns
  const regionalMovement = [
    { region: 'EAC Members', entries: 4580, exits: 4320, percentage: 65 },
    { region: 'CEPGL Countries', entries: 1240, exits: 1180, percentage: 18 },
    { region: 'SADC Countries', entries: 680, exits: 720, percentage: 10 },
    { region: 'Other African', entries: 320, exits: 340, percentage: 5 },
    { region: 'International', entries: 180, exits: 160, percentage: 2 }
  ];

  const hourlyTraffic = [
    { hour: '00:00', traffic: 45, vehicles: 12, goods: 23 },
    { hour: '02:00', traffic: 23, vehicles: 8, goods: 15 },
    { hour: '04:00', traffic: 34, vehicles: 15, goods: 28 },
    { hour: '06:00', traffic: 89, vehicles: 25, goods: 45 },
    { hour: '08:00', traffic: 234, vehicles: 65, goods: 120 },
    { hour: '10:00', traffic: 345, vehicles: 95, goods: 180 },
    { hour: '12:00', traffic: 423, vehicles: 120, goods: 220 },
    { hour: '14:00', traffic: 456, vehicles: 130, goods: 240 },
    { hour: '16:00', traffic: 378, vehicles: 105, goods: 195 },
    { hour: '18:00', traffic: 289, vehicles: 80, goods: 150 },
    { hour: '20:00', traffic: 234, vehicles: 65, goods: 120 },
    { hour: '22:00', traffic: 123, vehicles: 35, goods: 65 }
  ];

  const processsingTimes = [
    { location: 'Kilimanjaro Airport', avgTime: 4.2, target: 5.0, efficiency: 84 },
    { location: 'Namanga Border', avgTime: 3.8, target: 5.0, efficiency: 92 },
    { location: 'Dar Port', avgTime: 6.1, target: 5.0, efficiency: 78 },
    { location: 'Sirari Border', avgTime: 2.9, target: 5.0, efficiency: 96 },
    { location: 'Mtwara Port', avgTime: 4.5, target: 5.0, efficiency: 88 }
  ];

  const overstayAlerts = [
    { nationality: 'Kenya', count: 23, trend: 'up', riskLevel: 'medium' },
    { nationality: 'Uganda', count: 18, trend: 'down', riskLevel: 'low' },
    { nationality: 'Rwanda', count: 15, trend: 'up', riskLevel: 'medium' },
    { nationality: 'Burundi', count: 12, trend: 'stable', riskLevel: 'low' },
    { nationality: 'DRC', count: 8, trend: 'down', riskLevel: 'low' }
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
    alert('Generating comprehensive analytics report...');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive border management analytics and insights
          </p>
        </div>
        <div className="flex space-x-2">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-medium">15,247</div>
                <div className="text-sm text-muted-foreground">Total Crossings</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-medium">4.2m</div>
                <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">-8.3%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-medium">76</div>
                <div className="text-sm text-muted-foreground">Active Alerts</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-xs text-red-600">+5.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-medium">98.7%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-xs text-green-600">+0.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="processing">Processing Times</TabsTrigger>
          <TabsTrigger value="locations">Location Insights</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Overstays</TabsTrigger>
          <TabsTrigger value="trends">Trends & Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Border Crossings Trend</CardTitle>
                <CardDescription>
                  Daily entries and exits for {getTimeRangeLabel(timeRange)}
                </CardDescription>
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
                <CardTitle>Hourly Traffic Distribution</CardTitle>
                <CardDescription>
                  Peak hours and traffic patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="traffic" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Volume by Day</CardTitle>
              <CardDescription>
                Detailed breakdown of border crossing volumes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={borderCrossings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entries" fill="#8884d8" />
                  <Bar dataKey="exits" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processing Time Performance</CardTitle>
              <CardDescription>
                Average processing times vs. targets by location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processsingTimes.map((location, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{location.location}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{location.avgTime}m avg</span>
                        <Badge variant={location.avgTime <= location.target ? "default" : "destructive"}>
                          {location.avgTime <= location.target ? "On Target" : "Over Target"}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress 
                        value={(location.avgTime / location.target) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0m</span>
                        <span>Target: {location.target}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Time Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Best Performance</span>
                      <span className="font-medium">Border Point A - 2.9m</span>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Needs Attention</span>
                      <span className="font-medium">Miami Port - 6.1m</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Overall Average</span>
                      <span className="font-medium">4.3m</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Automated Processing</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biometric Verification</span>
                    <span className="font-medium">89%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Digital Pass Usage</span>
                    <span className="font-medium">34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Manual Override Rate</span>
                    <span className="font-medium">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Location</CardTitle>
                <CardDescription>
                  Distribution of border crossings by entry/exit points
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficByLocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>
                  Key metrics by border crossing location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficByLocation.map((location, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-muted-foreground">{location.count.toLocaleString()} crossings</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{location.value}%</div>
                        <div className="text-xs text-muted-foreground">of total traffic</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Overstay Alerts by Nationality</CardTitle>
                <CardDescription>
                  Recent visa overstay patterns and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overstayAlerts.map((alert, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <span>{alert.nationality}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="destructive">{alert.count}</Badge>
                        {alert.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-600" />}
                        {alert.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-600" />}
                        {alert.trend === 'stable' && <span className="text-yellow-600">—</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Categories</CardTitle>
                <CardDescription>
                  Breakdown of current active alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Visa Overstays</span>
                    <Badge variant="destructive">23</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Document Fraud</span>
                    <Badge variant="destructive">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Watchlist Matches</span>
                    <Badge variant="destructive">8</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>System Anomalies</span>
                    <Badge variant="secondary">15</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Biometric Failures</span>
                    <Badge variant="secondary">18</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alert Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">High Priority: Visa overstay detected</span>
                  </div>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Medium: Biometric verification failed</span>
                  </div>
                  <span className="text-xs text-muted-foreground">15 min ago</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Info: System maintenance scheduled</span>
                  </div>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>
                Forecasts and trend analysis for border management planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <Calendar className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <h4>Peak Season Forecast</h4>
                  <p className="text-2xl font-medium">+45%</p>
                  <p className="text-sm text-muted-foreground">Expected increase in next 30 days</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <h4>Efficiency Trend</h4>
                  <p className="text-2xl font-medium">+12%</p>
                  <p className="text-sm text-muted-foreground">Processing time improvement</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <h4>Security Score</h4>
                  <p className="text-2xl font-medium">94.8</p>
                  <p className="text-sm text-muted-foreground">Overall system security rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Capacity Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Current Capacity Utilization</span>
                      <span>73%</span>
                    </div>
                    <Progress value={73} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Projected Peak Utilization</span>
                      <span>91%</span>
                    </div>
                    <Progress value={91} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recommendation: Consider additional staffing during peak hours (8 AM - 2 PM)
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technology Adoption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Digital Pass Usage</span>
                    <span className="text-green-600">↑ 23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Biometric Enrollment</span>
                    <span className="text-green-600">↑ 18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile App Downloads</span>
                    <span className="text-green-600">↑ 31%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Automated Processing</span>
                    <span className="text-green-600">↑ 15%</span>
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