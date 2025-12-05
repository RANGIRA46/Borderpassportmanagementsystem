import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "./utils/LanguageSelector";
import { 
  FileText, 
  Bell, 
  Users, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Send,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Calendar,
  Target
} from "lucide-react";

interface Bulletin {
  id: string;
  title: string;
  content: string;
  category: 'security' | 'policy' | 'operational' | 'emergency' | 'training';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'published' | 'archived';
  targetAudience: string[];
  author: string;
  createdAt: string;
  publishedAt?: string;
  expiresAt?: string;
  tags: string[];
  attachments: string[];
  readCount: number;
  acknowledgedCount: number;
  languages: string[];
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  variables: string[];
  lastUsed: string;
  usageCount: number;
}

export function ContentBulletinManagement() {
  const { t } = useTranslation();
  const [bulletins, setBulletins] = useState<Bulletin[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedBulletin, setSelectedBulletin] = useState<Bulletin | null>(null);
  const [activeTab, setActiveTab] = useState('bulletins');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [newBulletin, setNewBulletin] = useState<Partial<Bulletin>>({
    title: '',
    content: '',
    category: 'operational',
    priority: 'medium',
    targetAudience: [],
    tags: [],
    languages: ['en']
  });

  // Mock bulletin data
  const mockBulletins: Bulletin[] = [
    {
      id: "BULL001",
      title: "New Security Protocol Update",
      content: "Effective immediately, all immigration officers must implement enhanced biometric verification procedures for travelers from high-risk countries...",
      category: "security",
      priority: "high",
      status: "published",
      targetAudience: ["immigration-officers", "security-staff", "supervisors"],
      author: "Security Director",
      createdAt: "2024-10-06T09:00:00Z",
      publishedAt: "2024-10-06T10:00:00Z",
      expiresAt: "2024-11-06T23:59:59Z",
      tags: ["biometric", "verification", "high-risk"],
      attachments: ["security-protocol-v2.1.pdf"],
      readCount: 45,
      acknowledgedCount: 38,
      languages: ["en", "fr", "sw", "rw"]
    },
    {
      id: "BULL002",
      title: "Holiday Schedule Adjustments",
      content: "Please note the following schedule changes for the upcoming national holidays. Staffing levels will be adjusted accordingly...",
      category: "operational",
      priority: "medium",
      status: "published",
      targetAudience: ["all-staff"],
      author: "Operations Manager",
      createdAt: "2024-10-05T14:30:00Z",
      publishedAt: "2024-10-05T15:00:00Z",
      tags: ["schedule", "holidays", "staffing"],
      attachments: [],
      readCount: 78,
      acknowledgedCount: 65,
      languages: ["en", "fr", "rw"]
    },
    {
      id: "BULL003",
      title: "Emergency: System Maintenance Tonight",
      content: "URGENT: The immigration database will be offline tonight from 11 PM to 3 AM for critical security updates. Use backup procedures...",
      category: "emergency",
      priority: "critical",
      status: "published",
      targetAudience: ["immigration-officers", "it-staff", "supervisors"],
      author: "IT Director",
      createdAt: "2024-10-06T16:00:00Z",
      publishedAt: "2024-10-06T16:05:00Z",
      expiresAt: "2024-10-07T06:00:00Z",
      tags: ["system", "maintenance", "emergency", "database"],
      attachments: ["backup-procedures.pdf"],
      readCount: 62,
      acknowledgedCount: 59,
      languages: ["en", "fr"]
    },
    {
      id: "BULL004",
      title: "New Training Module Available",
      content: "A new training module on advanced document verification techniques is now available in the learning management system...",
      category: "training",
      priority: "low",
      status: "draft",
      targetAudience: ["immigration-officers", "new-hires"],
      author: "Training Coordinator",
      createdAt: "2024-10-06T11:00:00Z",
      tags: ["training", "documents", "verification"],
      attachments: ["training-outline.pdf"],
      readCount: 0,
      acknowledgedCount: 0,
      languages: ["en"]
    }
  ];

  const mockTemplates: NotificationTemplate[] = [
    {
      id: "TEMP001",
      name: "Security Alert Template",
      subject: "URGENT: Security Alert - {{threat_level}}",
      content: "Dear {{recipient_name}},\n\nThis is an urgent security alert regarding {{threat_description}}.\n\nImmediate actions required:\n{{action_items}}\n\nPlease acknowledge receipt.",
      category: "security",
      variables: ["threat_level", "recipient_name", "threat_description", "action_items"],
      lastUsed: "2024-10-01T10:30:00Z",
      usageCount: 15
    },
    {
      id: "TEMP002",
      name: "Policy Update Template",
      subject: "Policy Update: {{policy_name}}",
      content: "Dear Team,\n\nWe are implementing updates to {{policy_name}} effective {{effective_date}}.\n\nKey changes:\n{{changes_summary}}\n\nPlease review and acknowledge.",
      category: "policy",
      variables: ["policy_name", "effective_date", "changes_summary"],
      lastUsed: "2024-09-28T14:15:00Z",
      usageCount: 8
    }
  ];

  useEffect(() => {
    setBulletins(mockBulletins);
    setTemplates(mockTemplates);
  }, []);

  const filteredBulletins = bulletins.filter(bulletin => {
    const matchesSearch = bulletin.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bulletin.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bulletin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || bulletin.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || bulletin.priority === priorityFilter;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'published': return 'default';
      case 'archived': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'policy': return <FileText className="h-4 w-4" />;
      case 'operational': return <Users className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'training': return <Globe className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleCreateBulletin = () => {
    const bulletin: Bulletin = {
      id: `BULL${String(bulletins.length + 1).padStart(3, '0')}`,
      ...newBulletin as Bulletin,
      author: "Current User",
      createdAt: new Date().toISOString(),
      status: 'draft',
      readCount: 0,
      acknowledgedCount: 0,
      attachments: []
    };
    
    setBulletins([...bulletins, bulletin]);
    setNewBulletin({
      title: '',
      content: '',
      category: 'operational',
      priority: 'medium',
      targetAudience: [],
      tags: [],
      languages: ['en']
    });
    setIsCreating(false);
  };

  const handlePublishBulletin = (bulletinId: string) => {
    setBulletins(bulletins.map(b => 
      b.id === bulletinId 
        ? { ...b, status: 'published', publishedAt: new Date().toISOString() }
        : b
    ));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-navy-medium" />
            {t('contentManagement.title', 'Content & Bulletin Management')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('contentManagement.subtitle', 'Manage internal communications and operational bulletins')}
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('contentManagement.createBulletin', 'Create Bulletin')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bulletins">{t('contentManagement.bulletins', 'Bulletins')}</TabsTrigger>
          <TabsTrigger value="templates">{t('contentManagement.templates', 'Templates')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('contentManagement.analytics', 'Analytics')}</TabsTrigger>
          <TabsTrigger value="settings">{t('contentManagement.settings', 'Settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="bulletins" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {t('contentManagement.filters', 'Filters')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>{t('contentManagement.search', 'Search')}</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('contentManagement.searchPlaceholder', 'Search bulletins...')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>{t('contentManagement.category', 'Category')}</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('contentManagement.allCategories', 'All Categories')}</SelectItem>
                      <SelectItem value="security">{t('contentManagement.security', 'Security')}</SelectItem>
                      <SelectItem value="policy">{t('contentManagement.policy', 'Policy')}</SelectItem>
                      <SelectItem value="operational">{t('contentManagement.operational', 'Operational')}</SelectItem>
                      <SelectItem value="emergency">{t('contentManagement.emergency', 'Emergency')}</SelectItem>
                      <SelectItem value="training">{t('contentManagement.training', 'Training')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('contentManagement.priority', 'Priority')}</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('contentManagement.allPriorities', 'All Priorities')}</SelectItem>
                      <SelectItem value="low">{t('contentManagement.lowPriority', 'Low')}</SelectItem>
                      <SelectItem value="medium">{t('contentManagement.mediumPriority', 'Medium')}</SelectItem>
                      <SelectItem value="high">{t('contentManagement.highPriority', 'High')}</SelectItem>
                      <SelectItem value="critical">{t('contentManagement.criticalPriority', 'Critical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {t('contentManagement.export', 'Export')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulletin List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t('contentManagement.bulletinList', 'Bulletin List')} ({filteredBulletins.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredBulletins.map((bulletin) => (
                      <div
                        key={bulletin.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          selectedBulletin?.id === bulletin.id ? 'border-navy-medium bg-blue-lightest' : ''
                        }`}
                        onClick={() => setSelectedBulletin(bulletin)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(bulletin.category)}
                            <h4 className="font-medium">{bulletin.title}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityBadgeColor(bulletin.priority)}>
                              {bulletin.priority}
                            </Badge>
                            <Badge variant={getStatusBadgeColor(bulletin.status)}>
                              {bulletin.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {bulletin.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>By {bulletin.author}</span>
                            <span>{new Date(bulletin.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>{bulletin.readCount} reads</span>
                            <span>{bulletin.acknowledgedCount} acks</span>
                          </div>
                        </div>

                        {bulletin.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {bulletin.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {bulletin.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{bulletin.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bulletin Details */}
            <div>
              {selectedBulletin ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedBulletin.title}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.author', 'Author')}</Label>
                        <p>{selectedBulletin.author}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.category', 'Category')}</Label>
                        <p className="capitalize">{selectedBulletin.category}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.priority', 'Priority')}</Label>
                        <Badge variant={getPriorityBadgeColor(selectedBulletin.priority)} className="text-xs">
                          {selectedBulletin.priority}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.status', 'Status')}</Label>
                        <Badge variant={getStatusBadgeColor(selectedBulletin.status)} className="text-xs">
                          {selectedBulletin.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">{t('contentManagement.content', 'Content')}</Label>
                      <div className="p-3 bg-gray-50 rounded text-sm mt-1">
                        {selectedBulletin.content}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">{t('contentManagement.targetAudience', 'Target Audience')}</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBulletin.targetAudience.map((audience, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {audience}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">{t('contentManagement.languages', 'Languages')}</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedBulletin.languages.map((lang, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.readCount', 'Read Count')}</Label>
                        <p className="text-blue-600">{selectedBulletin.readCount}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.acknowledged', 'Acknowledged')}</Label>
                        <p className="text-green-600">{selectedBulletin.acknowledgedCount}</p>
                      </div>
                    </div>

                    {selectedBulletin.status === 'draft' && (
                      <Button 
                        className="w-full"
                        onClick={() => handlePublishBulletin(selectedBulletin.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {t('contentManagement.publish', 'Publish Bulletin')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {t('contentManagement.selectBulletin', 'Select a Bulletin')}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {t('contentManagement.selectBulletinDesc', 'Choose a bulletin from the list to view details and manage its content.')}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('contentManagement.notificationTemplates', 'Notification Templates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.subject', 'Subject')}</Label>
                        <p className="font-mono text-xs">{template.subject}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('contentManagement.variables', 'Variables')}</Label>
                        <p className="text-xs">{template.variables.join(', ')}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <Label className="text-xs text-muted-foreground">{t('contentManagement.content', 'Content')}</Label>
                      <div className="p-2 bg-gray-50 rounded text-xs font-mono mt-1">
                        {template.content.slice(0, 200)}...
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Used {template.usageCount} times</span>
                      <span>Last used: {new Date(template.lastUsed).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contentManagement.totalBulletins', 'Total Bulletins')}</p>
                    <p className="text-2xl font-bold">{bulletins.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-navy-medium" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contentManagement.published', 'Published')}</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bulletins.filter(b => b.status === 'published').length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contentManagement.avgReadRate', 'Avg Read Rate')}</p>
                    <p className="text-2xl font-bold text-blue-600">78%</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contentManagement.avgAckRate', 'Avg Ack Rate')}</p>
                    <p className="text-2xl font-bold text-purple-600">85%</p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('contentManagement.languageSettings', 'Language Settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>{t('contentManagement.defaultLanguage', 'Default Language')}</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="sw">Kiswahili</SelectItem>
                      <SelectItem value="rw">Kinyarwanda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t('contentManagement.enabledLanguages', 'Enabled Languages')}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['English', 'French', 'Kiswahili', 'Kinyarwanda'].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{lang}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('contentManagement.notificationSettings', 'Notification Settings')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('contentManagement.autoNotify', 'Auto-notify on Publish')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('contentManagement.autoNotifyDesc', 'Automatically send notifications when bulletins are published')}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('contentManagement.requireAck', 'Require Acknowledgment')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('contentManagement.requireAckDesc', 'Require staff to acknowledge reading critical bulletins')}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Bulletin Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{t('contentManagement.createNewBulletin', 'Create New Bulletin')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t('contentManagement.title', 'Title')}</Label>
                <Input
                  value={newBulletin.title}
                  onChange={(e) => setNewBulletin({...newBulletin, title: e.target.value})}
                  placeholder={t('contentManagement.titlePlaceholder', 'Enter bulletin title...')}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('contentManagement.category', 'Category')}</Label>
                  <Select 
                    value={newBulletin.category} 
                    onValueChange={(value) => setNewBulletin({...newBulletin, category: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security">{t('contentManagement.security', 'Security')}</SelectItem>
                      <SelectItem value="policy">{t('contentManagement.policy', 'Policy')}</SelectItem>
                      <SelectItem value="operational">{t('contentManagement.operational', 'Operational')}</SelectItem>
                      <SelectItem value="emergency">{t('contentManagement.emergency', 'Emergency')}</SelectItem>
                      <SelectItem value="training">{t('contentManagement.training', 'Training')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>{t('contentManagement.priority', 'Priority')}</Label>
                  <Select 
                    value={newBulletin.priority} 
                    onValueChange={(value) => setNewBulletin({...newBulletin, priority: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">{t('contentManagement.lowPriority', 'Low')}</SelectItem>
                      <SelectItem value="medium">{t('contentManagement.mediumPriority', 'Medium')}</SelectItem>
                      <SelectItem value="high">{t('contentManagement.highPriority', 'High')}</SelectItem>
                      <SelectItem value="critical">{t('contentManagement.criticalPriority', 'Critical')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>{t('contentManagement.content', 'Content')}</Label>
                <Textarea
                  value={newBulletin.content}
                  onChange={(e) => setNewBulletin({...newBulletin, content: e.target.value})}
                  placeholder={t('contentManagement.contentPlaceholder', 'Enter bulletin content...')}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  {t('contentManagement.cancel', 'Cancel')}
                </Button>
                <Button onClick={handleCreateBulletin}>
                  {t('contentManagement.create', 'Create')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}