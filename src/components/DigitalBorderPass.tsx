import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { QrCode, CreditCard, Clock, Users, Shield, Download, Eye, Ban } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function DigitalBorderPass() {
  const [activeTab, setActiveTab] = useState('apply');
  const [applicationData, setApplicationData] = useState({
    passType: '',
    category: '',
    duration: '',
    firstName: '',
    lastName: '',
    passportNumber: '',
    nationality: '',
    employer: '',
    businessType: '',
    frequencyEstimate: '',
    routes: '',
    purpose: ''
  });

  const [issuedPasses, setIssuedPasses] = useState([
    {
      id: 'DBP2024001',
      holder: 'John Smith',
      type: 'Business Pass',
      category: 'Frequent Trader',
      status: 'Active',
      issued: '2024-01-15',
      expires: '2024-12-15',
      usageCount: 23,
      lastUsed: '2024-01-20'
    },
    {
      id: 'DBP2024002',
      holder: 'Maria Garcia',
      type: 'Diplomatic Pass',
      category: 'Embassy Staff',
      status: 'Active',
      issued: '2024-01-10',
      expires: '2025-01-10',
      usageCount: 45,
      lastUsed: '2024-01-22'
    },
    {
      id: 'DBP2024003',
      holder: 'Ahmed Hassan',
      type: 'Transit Pass',
      category: 'Airline Crew',
      status: 'Suspended',
      issued: '2024-01-05',
      expires: '2024-07-05',
      usageCount: 67,
      lastUsed: '2024-01-18'
    }
  ]);

  const passTypes = [
    { 
      value: 'business', 
      label: 'Business Pass', 
      description: 'For frequent business travelers',
      fee: '$200',
      duration: '1 year'
    },
    { 
      value: 'diplomatic', 
      label: 'Diplomatic Pass', 
      description: 'For diplomatic personnel',
      fee: 'Exempt',
      duration: '2 years'
    },
    { 
      value: 'transit', 
      label: 'Transit Pass', 
      description: 'For airline and transport crew',
      fee: '$100',
      duration: '6 months'
    },
    { 
      value: 'student', 
      label: 'Student Pass', 
      description: 'For students crossing regularly',
      fee: '$50',
      duration: '1 year'
    }
  ];

  const categories = {
    business: ['Frequent Trader', 'Corporate Executive', 'Sales Representative', 'Consultant'],
    diplomatic: ['Ambassador', 'Embassy Staff', 'Consular Officer', 'UN Personnel'],
    transit: ['Airline Crew', 'Ship Crew', 'Truck Driver', 'Tour Guide'],
    student: ['Exchange Student', 'Research Student', 'Cross-border Student']
  };

  const handleInputChange = (field: string, value: string) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitApplication = () => {
    alert('Digital Border Pass application submitted! Reference: DBA2024001234');
  };

  const generateQRCode = (passId: string) => {
    // In a real implementation, this would generate an actual QR code
    alert(`QR Code generated for pass ${passId}`);
  };

  const revokePass = (passId: string) => {
    setIssuedPasses(prev => 
      prev.map(pass => 
        pass.id === passId 
          ? { ...pass, status: 'Revoked' }
          : pass
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'revoked': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Digital Border Pass Management</h1>
        <p className="text-muted-foreground">
          Issue and manage electronic border passes for frequent crossers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="apply">Apply for Pass</TabsTrigger>
          <TabsTrigger value="manage">Manage Passes</TabsTrigger>
          <TabsTrigger value="verify">Verify Pass</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="apply" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Digital Border Pass Application</CardTitle>
              <CardDescription>
                Apply for a digital border pass to expedite your border crossings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pass Type Selection */}
                <div>
                  <Label className="text-base">Select Pass Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {passTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          applicationData.passType === type.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleInputChange('passType', type.value)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4>{type.label}</h4>
                          <Badge variant="outline">{type.fee}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Valid for {type.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Selection */}
                {applicationData.passType && (
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories[applicationData.passType as keyof typeof categories]?.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={applicationData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={applicationData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="passportNumber">Passport Number *</Label>
                    <Input
                      id="passportNumber"
                      value={applicationData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Select onValueChange={(value) => handleInputChange('nationality', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Professional Information */}
                {applicationData.passType === 'business' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employer">Employer/Company</Label>
                      <Input
                        id="employer"
                        value={applicationData.employer}
                        onChange={(e) => handleInputChange('employer', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Input
                        id="businessType"
                        value={applicationData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Travel Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequencyEstimate">Estimated Monthly Border Crossings</Label>
                    <Select onValueChange={(value) => handleInputChange('frequencyEstimate', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 times</SelectItem>
                        <SelectItem value="11-20">11-20 times</SelectItem>
                        <SelectItem value="21-30">21-30 times</SelectItem>
                        <SelectItem value="30+">More than 30 times</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="routes">Primary Border Routes</Label>
                    <Input
                      id="routes"
                      placeholder="e.g., JFK Airport, Land Border A, Port X"
                      value={applicationData.routes}
                      onChange={(e) => handleInputChange('routes', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">Primary Purpose of Travel</Label>
                    <Input
                      id="purpose"
                      placeholder="Brief description of travel purpose"
                      value={applicationData.purpose}
                      onChange={(e) => handleInputChange('purpose', e.target.value)}
                    />
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Digital border passes are cryptographically signed and can be validated offline. 
                    All data is stored securely and access is audited.
                  </AlertDescription>
                </Alert>

                <Button onClick={submitApplication} className="w-full">
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Issued Digital Border Passes</span>
              </CardTitle>
              <CardDescription>
                Manage active, suspended, and revoked border passes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pass ID</TableHead>
                    <TableHead>Holder</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issuedPasses.map((pass) => (
                    <TableRow key={pass.id}>
                      <TableCell className="font-mono text-sm">{pass.id}</TableCell>
                      <TableCell>{pass.holder}</TableCell>
                      <TableCell>{pass.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(pass.status)}>
                          {pass.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{pass.expires}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{pass.usageCount} times</div>
                          <div className="text-muted-foreground">Last: {pass.lastUsed}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateQRCode(pass.id)}
                          >
                            <QrCode className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {pass.status === 'Active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => revokePass(pass.id)}
                            >
                              <Ban className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pass Verification</CardTitle>
              <CardDescription>
                Verify digital border pass authenticity and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passId">Pass ID or QR Code Data</Label>
                    <Input
                      id="passId"
                      placeholder="Enter pass ID or scan QR code"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full">
                      Verify Pass
                    </Button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h4>Scan QR Code</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use camera to scan digital border pass QR code
                  </p>
                  <Button variant="outline" className="mt-4">
                    Open Camera Scanner
                  </Button>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Verification can be performed offline. Digital signatures ensure pass authenticity 
                    and prevent tampering. All verification attempts are logged for audit purposes.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl">1,247</div>
                    <div className="text-sm text-muted-foreground">Active Passes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl">89</div>
                    <div className="text-sm text-muted-foreground">New This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Ban className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-2xl">12</div>
                    <div className="text-sm text-muted-foreground">Revoked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl">34</div>
                    <div className="text-sm text-muted-foreground">Expiring Soon</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pass Usage Analytics</CardTitle>
              <CardDescription>
                Monitor digital border pass usage patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4>Business Passes</h4>
                    <div className="text-2xl font-medium">674</div>
                    <div className="text-sm text-muted-foreground">54% of total</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4>Transit Passes</h4>
                    <div className="text-2xl font-medium">398</div>
                    <div className="text-sm text-muted-foreground">32% of total</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4>Diplomatic Passes</h4>
                    <div className="text-2xl font-medium">175</div>
                    <div className="text-sm text-muted-foreground">14% of total</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-3">Recent Pass Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">DBP2024001 - John Smith (Business)</span>
                      <span className="text-xs text-muted-foreground">Used 2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">DBP2024002 - Maria Garcia (Diplomatic)</span>
                      <span className="text-xs text-muted-foreground">Used 4 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">DBP2024003 - Ahmed Hassan (Transit)</span>
                      <span className="text-xs text-muted-foreground">Used 6 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}