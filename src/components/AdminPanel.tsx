import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function AdminPanel() {
  const [applications] = useState([
    {
      id: 'PP2024001234',
      applicant: 'John Smith',
      type: 'New Passport',
      submissionDate: '2024-01-15',
      status: 'Under Review',
      priority: 'Normal',
      assignedTo: 'Agent Smith',
      documents: 4,
      completeness: 95
    },
    {
      id: 'PP2024001235',
      applicant: 'Jane Doe',
      type: 'Renewal',
      submissionDate: '2024-01-14',
      status: 'Approved',
      priority: 'Expedited',
      assignedTo: 'Agent Jones',
      documents: 3,
      completeness: 100
    },
    {
      id: 'PP2024001236',
      applicant: 'Bob Wilson',
      type: 'Replacement',
      submissionDate: '2024-01-13',
      status: 'Pending Documents',
      priority: 'Normal',
      assignedTo: 'Agent Brown',
      documents: 2,
      completeness: 60
    },
    {
      id: 'PP2024001237',
      applicant: 'Alice Johnson',
      type: 'New Passport',
      submissionDate: '2024-01-12',
      status: 'In Production',
      priority: 'Normal',
      assignedTo: 'Agent Davis',
      documents: 4,
      completeness: 100
    }
  ]);

  const [borderAlerts] = useState([
    {
      id: '1',
      type: 'Security Alert',
      location: 'JFK Airport',
      description: 'Suspicious document detected',
      time: '2024-01-15 14:30',
      severity: 'High',
      status: 'Active'
    },
    {
      id: '2',
      type: 'System Alert',
      location: 'LAX Airport',
      description: 'Database connectivity issue',
      time: '2024-01-15 13:15',
      severity: 'Medium',
      status: 'Resolved'
    },
    {
      id: '3',
      type: 'Process Alert',
      location: 'Miami Airport',
      description: 'Processing queue backup',
      time: '2024-01-15 12:00',
      severity: 'Low',
      status: 'Monitoring'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = applications.filter(app => {
    const statusMatch = filterStatus === 'all' || app.status.toLowerCase().replace(' ', '') === filterStatus;
    const searchMatch = searchTerm === '' || 
      app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase().replace(' ', '')) {
      case 'approved':
        return 'default';
      case 'underreview':
        return 'secondary';
      case 'pendingdocuments':
        return 'destructive';
      case 'inproduction':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'Expedited' ? 'destructive' : 'outline';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'Under Review').length;
    const approved = applications.filter(app => app.status === 'Approved').length;
    const processing = applications.filter(app => app.status === 'In Production').length;
    
    return { total, pending, approved, processing };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-medium mb-2">Administrative Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">Manage passport applications and border operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <span className="text-xl sm:text-2xl mb-2 sm:mb-0">📊</span>
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <span className="text-xl sm:text-2xl mb-2 sm:mb-0">⏳</span>
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <span className="text-xl sm:text-2xl mb-2 sm:mb-0">✅</span>
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold">{stats.approved}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Approved Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
              <span className="text-xl sm:text-2xl mb-2 sm:mb-0">🏭</span>
              <div className="text-center sm:text-left">
                <p className="text-xl sm:text-2xl font-bold">{stats.processing}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">In Production</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="applications" className="text-xs sm:text-sm py-2">Applications</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs sm:text-sm py-2">Border Alerts</TabsTrigger>
          <TabsTrigger value="reports" className="text-xs sm:text-sm py-2">Reports</TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm py-2">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Passport Applications</CardTitle>
                  <CardDescription>Manage and review passport applications</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Search applications..."
                    className="w-full sm:w-64 h-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="underreview">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pendingdocuments">Pending Docs</SelectItem>
                      <SelectItem value="inproduction">In Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Application ID</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-sm">{app.id}</TableCell>
                        <TableCell>{app.applicant}</TableCell>
                        <TableCell>{app.type}</TableCell>
                        <TableCell>{app.submissionDate}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(app.priority)}>
                            {app.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.assignedTo}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-muted rounded-full">
                              <div 
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${app.completeness}%` }}
                              />
                            </div>
                            <span className="text-sm">{app.completeness}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-base">{app.applicant}</div>
                          <div className="text-sm text-muted-foreground font-mono">{app.id}</div>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant={getStatusColor(app.status)} className="text-xs">
                            {app.status}
                          </Badge>
                          <Badge variant={getPriorityColor(app.priority)} className="text-xs">
                            {app.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span>{app.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submitted:</span>
                          <span>{app.submissionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Assigned:</span>
                          <span>{app.assignedTo}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Progress:</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-muted rounded-full">
                              <div 
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${app.completeness}%` }}
                              />
                            </div>
                            <span className="text-xs">{app.completeness}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">View</Button>
                        <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Border Security Alerts</CardTitle>
              <CardDescription>Monitor security alerts and system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borderAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>{alert.type}</TableCell>
                        <TableCell>{alert.location}</TableCell>
                        <TableCell>{alert.description}</TableCell>
                        <TableCell>{alert.time}</TableCell>
                        <TableCell>
                          <Badge variant={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={alert.status === 'Active' ? 'destructive' : 'default'}>
                            {alert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Resolve</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {borderAlerts.map((alert) => (
                  <Card key={alert.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-base">{alert.type}</div>
                          <div className="text-sm text-muted-foreground">{alert.location}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                            {alert.severity}
                          </Badge>
                          <Badge variant={alert.status === 'Active' ? 'destructive' : 'default'} className="text-xs">
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Description:</span>
                          <p className="mt-1">{alert.description}</p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="text-xs">{alert.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">View</Button>
                        <Button size="sm" variant="outline" className="flex-1">Resolve</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Application Reports</CardTitle>
                <CardDescription>Generate reports on passport applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start h-12 text-left">
                  <span className="mr-3">📊</span>
                  Daily Application Summary
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">📈</span>
                  Monthly Processing Statistics
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🕒</span>
                  Processing Time Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">📋</span>
                  Document Verification Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Border Reports</CardTitle>
                <CardDescription>Generate reports on border operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🛂</span>
                  Border Crossing Summary
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🚨</span>
                  Security Incidents Report
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🌍</span>
                  Country-wise Statistics
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">⏱️</span>
                  Processing Times by Location
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">System Configuration</CardTitle>
                <CardDescription>Manage system settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">⚙️</span>
                  General Settings
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">👥</span>
                  User Management
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🔐</span>
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">📧</span>
                  Notification Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Data Management</CardTitle>
                <CardDescription>Manage data backup and maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">💾</span>
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🔄</span>
                  System Maintenance
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">📊</span>
                  Data Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start h-12 text-left">
                  <span className="mr-3">🗂️</span>
                  Archive Management
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}