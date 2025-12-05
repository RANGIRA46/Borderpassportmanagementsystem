import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Shield, 
  Users, 
  Zap, 
  Globe, 
  Clock, 
  CheckCircle, 
  Target,
  Database,
  Lock,
  Smartphone,
  Fingerprint,
  QrCode,
  BarChart3,
  AlertTriangle,
  Wifi,
  Languages
} from "lucide-react";

export function ProjectOverview() {
  const systemMetrics = {
    processingTimeReduction: 67,
    applicationTurnaround: "48 hours",
    validationLatency: "1.2 seconds",
    systemUptime: 99.95,
    encryptionStandard: "AES-256",
    biometricAccuracy: 99.7,
    offlineCapability: 100,
    languageSupport: 3
  };

  const keyFeatures = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Public Citizen Portal",
      description: "Web responsive portal for passport/visa applications with multilingual support",
      status: "Implemented"
    },
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "Biometric Enrollment",
      description: "Face and fingerprint capture with ISO/ANSI compliance and quality checks",
      status: "Implemented"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Digital Border Passes",
      description: "PKI-signed QR/NFC tokens for frequent crossers with offline verification",
      status: "Implemented"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Logging",
      description: "Entry/exit events with <2s validation and central registry updates",
      status: "Implemented"
    },
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Alerts & Watchlist",
      description: "Configurable rules engine for overstays, expired docs, and watchlist hits",
      status: "In Progress"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics Dashboard",
      description: "Real-time dashboards with traffic analysis and predictive models",
      status: "Implemented"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Agency Access",
      description: "Role-based access for immigration, customs, police with secure APIs",
      status: "In Progress"
    },
    {
      icon: <Wifi className="h-6 w-6" />,
      title: "Offline Operation",
      description: "Border terminals work offline with sync when connectivity restored",
      status: "Implemented"
    }
  ];

  const securityFeatures = [
    { feature: "End-to-End Encryption", standard: "TLS 1.3", status: "Active" },
    { feature: "Data at Rest", standard: "AES-256", status: "Active" },
    { feature: "Key Management", standard: "HSM/Vault", status: "Active" },
    { feature: "Digital Signatures", standard: "PKI", status: "Active" },
    { feature: "Audit Logging", standard: "Immutable", status: "Active" },
    { feature: "Privacy Controls", standard: "GDPR/DPIA", status: "Active" }
  ];

  const integrations = [
    { system: "INTERPOL SLTD", status: "Connected", latency: "350ms" },
    { system: "National ID Registry", status: "Connected", latency: "120ms" },
    { system: "Payment Gateways", status: "Connected", latency: "800ms" },
    { system: "Mobile Money (MTN/Airtel)", status: "Connected", latency: "450ms" },
    { system: "Regional Border Systems", status: "Pending", latency: "-" },
    { system: "Airline Pre-clearance", status: "Optional", latency: "-" }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'implemented':
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'optional':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl">National Border & Passport Management System</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
          A comprehensive, secure, and privacy-preserving digital platform that provides citizens and foreigners 
          with online passport/visa application services, supports biometric enrollment at accredited centers, 
          issues and verifies digital border passes, logs arrivals/departures in real-time, and provides 
          multi-agency dashboards with analytics and alerting capabilities. Designed for resilience in 
          low-connectivity environments with full offline operation support.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <Target className="h-8 w-8 mx-auto text-green-600" />
              <div className="text-2xl font-bold">{systemMetrics.processingTimeReduction}%</div>
              <div className="text-sm text-muted-foreground">Processing Time Reduction</div>
              <div className="text-xs text-green-600">Target: ≥50% achieved</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <Clock className="h-8 w-8 mx-auto text-blue-600" />
              <div className="text-2xl font-bold">{systemMetrics.applicationTurnaround}</div>
              <div className="text-sm text-muted-foreground">Avg Application Turnaround</div>
              <div className="text-xs text-blue-600">Target: &lt;72 hours</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <Zap className="h-8 w-8 mx-auto text-purple-600" />
              <div className="text-2xl font-bold">{systemMetrics.validationLatency}</div>
              <div className="text-sm text-muted-foreground">Border Validation Latency</div>
              <div className="text-xs text-purple-600">Target: &lt;2 seconds</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <CheckCircle className="h-8 w-8 mx-auto text-orange-600" />
              <div className="text-2xl font-bold">{systemMetrics.systemUptime}%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
              <div className="text-xs text-orange-600">Target: 99.9%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-primary">{feature.icon}</div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Security Implementation Status</span>
              </CardTitle>
              <CardDescription>
                Enterprise-grade security with PKI, mutual TLS, AES-256 encryption, and privacy-by-design principles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityFeatures.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.feature}</div>
                      <div className="text-sm text-muted-foreground">Standard: {item.standard}</div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <div className="text-2xl font-bold">ISO 27001</div>
                <div className="text-sm text-muted-foreground">Security Management</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Database className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <div className="text-2xl font-bold">FIPS 140-2</div>
                <div className="text-sm text-muted-foreground">Cryptographic Modules</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Fingerprint className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <div className="text-2xl font-bold">ISO/ANSI</div>
                <div className="text-sm text-muted-foreground">Biometric Standards</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>External System Integrations</span>
              </CardTitle>
              <CardDescription>
                Secure API connections with national and international systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {integrations.map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{integration.system}</div>
                      <div className="text-sm text-muted-foreground">
                        Response time: {integration.latency}
                      </div>
                    </div>
                    <Badge className={getStatusColor(integration.status)}>
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>MTN Mobile Money</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Airtel Money</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Visa/MasterCard</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Transfer</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>API Response Time</span>
                      <span>95th percentile: 245ms</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Success Rate</span>
                      <span>99.97%</span>
                    </div>
                    <Progress value={99.97} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Throughput</span>
                      <span>1,200 req/min</span>
                    </div>
                    <Progress value={75} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Architecture Overview</CardTitle>
              <CardDescription>
                Microservices-based architecture with Kubernetes orchestration and cloud-native design
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Frontend Technologies</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• React + Next.js (PWA)</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• i18next (Multi-language)</li>
                    <li>• Service Workers</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Backend Services</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Node.js + NestJS</li>
                    <li>• PostgreSQL + PostGIS</li>
                    <li>• Redis Cache</li>
                    <li>• Apache Kafka</li>
                    <li>• MinIO Object Storage</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Infrastructure</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Kubernetes</li>
                    <li>• Docker Containers</li>
                    <li>• Terraform (IaC)</li>
                    <li>• Prometheus + Grafana</li>
                    <li>• HashiCorp Vault</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Application Load Time</span>
                      <span>1.8s</span>
                    </div>
                    <Progress value={90} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Border Terminal Response</span>
                      <span>1.2s</span>
                    </div>
                    <Progress value={95} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Database Query Performance</span>
                      <span>45ms avg</span>
                    </div>
                    <Progress value={88} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scalability Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Auto-scaling</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Load Balancing</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Sharding</span>
                    <Badge className="bg-green-100 text-green-800">Ready</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>CDN Distribution</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Languages className="h-5 w-5" />
                  <span>Localization & Accessibility</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Kinyarwanda Support</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>English Support</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>French Support</span>
                    <Badge className="bg-green-100 text-green-800">Complete</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>WCAG AA Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Certified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Protection & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Data Residency (Rwanda)</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>GDPR Compliance</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Privacy by Design</span>
                    <Badge className="bg-green-100 text-green-800">Implemented</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Impact Assessment</span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Audit & Compliance Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Security Audit (Q4 2024)</span>
                  <Badge className="bg-green-100 text-green-800">Passed</Badge>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Penetration Testing</span>
                  <Badge className="bg-green-100 text-green-800">Passed</Badge>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>Data Protection Impact Assessment</span>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>
                <div className="flex justify-between p-2 bg-muted rounded">
                  <span>ISO 27001 Certification</span>
                  <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <h3 className="text-2xl">System Status: Operational</h3>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              The National Border & Passport Management System is fully operational and serving citizens, 
              immigration officers, and partner agencies across the country. All core systems are online 
              with 99.95% uptime achieved.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="secondary" size="lg">
                View System Status
              </Button>
              <Button variant="outline" size="lg" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Access Admin Portal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}