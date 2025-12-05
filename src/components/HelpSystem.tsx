import { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Users, 
  Shield, 
  Clock,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useAuth } from "./UserAuth";
import { useTranslation, T } from "./utils/LanguageSelector";

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  userRoles: string[];
  tags: string[];
  lastUpdated: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface ContactMethod {
  type: "phone" | "email" | "chat" | "office";
  label: string;
  value: string;
  hours?: string;
  department?: string;
  priority: "emergency" | "urgent" | "normal";
}

interface UserGuide {
  id: string;
  title: string;
  description: string;
  steps: string[];
  userRoles: string[];
  downloadUrl?: string;
  videoUrl?: string;
}

export function HelpSystem() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { isCustomer, isOfficer, isAdmin, isSuperAdmin } = useAuth();
  const { translate } = useTranslation();

  const getCurrentUserRole = (): string => {
    if (isSuperAdmin) return "super-admin";
    if (isAdmin) return "admin";
    if (isOfficer) return "officer";
    if (isCustomer) return "customer";
    return "public";
  };

  // Help articles based on user roles
  const helpArticles: HelpArticle[] = [
    // Public/Customer Articles
    {
      id: "passport-application",
      title: "How to Apply for a Passport",
      category: "Applications",
      content: "Step-by-step guide to applying for a new passport, including required documents, fees, and processing times.",
      userRoles: ["public", "customer"],
      tags: ["passport", "application", "documents"],
      lastUpdated: "2024-10-01",
      difficulty: "beginner"
    },
    {
      id: "visa-requirements",
      title: "Visa Requirements and Application Process",
      category: "Applications",
      content: "Complete guide to visa types, requirements, and application procedures for different countries.",
      userRoles: ["public", "customer"],
      tags: ["visa", "travel", "requirements"],
      lastUpdated: "2024-09-28",
      difficulty: "beginner"
    },
    {
      id: "cepgl-documents",
      title: "CEPGL Travel Documents",
      category: "Documents",
      content: "Information about CEPGL travel documents for citizens of member countries (DRC, Rwanda, Burundi).",
      userRoles: ["public", "customer"],
      tags: ["cepgl", "travel", "regional"],
      lastUpdated: "2024-10-02",
      difficulty: "beginner"
    },
    {
      id: "appointment-booking",
      title: "Booking and Managing Appointments",
      category: "Services",
      content: "How to book, reschedule, or cancel appointments for various services.",
      userRoles: ["public", "customer"],
      tags: ["appointments", "booking", "schedule"],
      lastUpdated: "2024-09-30",
      difficulty: "beginner"
    },
    {
      id: "document-status",
      title: "Checking Application Status",
      category: "Services",
      content: "How to track your application status and understand processing stages.",
      userRoles: ["public", "customer"],
      tags: ["status", "tracking", "applications"],
      lastUpdated: "2024-09-25",
      difficulty: "beginner"
    },

    // Officer Articles
    {
      id: "biometric-enrollment",
      title: "Biometric Enrollment Procedures",
      category: "Operations",
      content: "Complete guide to conducting biometric enrollment sessions, equipment handling, and data verification.",
      userRoles: ["officer", "admin", "super-admin"],
      tags: ["biometrics", "enrollment", "procedures"],
      lastUpdated: "2024-10-01",
      difficulty: "intermediate"
    },
    {
      id: "border-verification",
      title: "Border Crossing Verification",
      category: "Operations",
      content: "Procedures for verifying documents, checking databases, and processing border crossings.",
      userRoles: ["officer", "admin", "super-admin"],
      tags: ["border", "verification", "security"],
      lastUpdated: "2024-09-29",
      difficulty: "intermediate"
    },
    {
      id: "interpol-integration",
      title: "INTERPOL Database Integration",
      category: "Security",
      content: "How to access and use INTERPOL databases for background checks and alerts.",
      userRoles: ["officer", "admin", "super-admin"],
      tags: ["interpol", "database", "security"],
      lastUpdated: "2024-09-27",
      difficulty: "advanced"
    },

    // Admin Articles
    {
      id: "user-management",
      title: "User Account Management",
      category: "Administration",
      content: "Creating, modifying, and managing user accounts across different access levels.",
      userRoles: ["admin", "super-admin"],
      tags: ["users", "accounts", "permissions"],
      lastUpdated: "2024-10-01",
      difficulty: "intermediate"
    },
    {
      id: "system-analytics",
      title: "Analytics and Reporting",
      category: "Administration",
      content: "Generating reports, analyzing trends, and monitoring system performance.",
      userRoles: ["admin", "super-admin"],
      tags: ["analytics", "reports", "monitoring"],
      lastUpdated: "2024-09-26",
      difficulty: "intermediate"
    },
    {
      id: "agency-coordination",
      title: "Multi-Agency Coordination",
      category: "Administration",
      content: "Managing inter-agency communications, data sharing, and collaborative operations.",
      userRoles: ["admin", "super-admin"],
      tags: ["agencies", "coordination", "collaboration"],
      lastUpdated: "2024-09-28",
      difficulty: "advanced"
    },

    // Super Admin Articles
    {
      id: "system-configuration",
      title: "System Configuration and Maintenance",
      category: "System",
      content: "Advanced system configuration, maintenance procedures, and troubleshooting.",
      userRoles: ["super-admin"],
      tags: ["system", "configuration", "maintenance"],
      lastUpdated: "2024-10-02",
      difficulty: "advanced"
    },
    {
      id: "database-management",
      title: "Central Database Management",
      category: "System",
      content: "Managing the central database, cross-border data synchronization, and security protocols.",
      userRoles: ["super-admin"],
      tags: ["database", "synchronization", "security"],
      lastUpdated: "2024-09-30",
      difficulty: "advanced"
    }
  ];

  // Contact methods based on user role and issue type
  const contactMethods: ContactMethod[] = [
    {
      type: "phone",
      label: "Emergency Hotline",
      value: "+255-800-BORDER (26733)",
      hours: "24/7",
      department: "Emergency Response",
      priority: "emergency"
    },
    {
      type: "phone",
      label: "General Support",
      value: "+255-22-2123456",
      hours: "Mon-Fri 8:00-17:00",
      department: "Customer Service",
      priority: "normal"
    },
    {
      type: "email",
      label: "Technical Support",
      value: "tech.support@immigration.go.tz",
      department: "IT Department",
      priority: "normal"
    },
    {
      type: "email",
      label: "Application Inquiries",
      value: "applications@immigration.go.tz",
      department: "Applications Department",
      priority: "normal"
    },
    {
      type: "chat",
      label: "Live Chat Support",
      value: "Available in system",
      hours: "Mon-Fri 8:00-20:00",
      department: "Online Support",
      priority: "urgent"
    },
    {
      type: "office",
      label: "Immigration Headquarters",
      value: "Kivukoni Front, Dar es Salaam",
      hours: "Mon-Fri 8:00-16:00",
      department: "Main Office",
      priority: "normal"
    }
  ];

  // User guides with role-based access
  const userGuides: UserGuide[] = [
    {
      id: "citizen-guide",
      title: "Citizen Services Guide",
      description: "Complete guide for citizens using immigration services",
      userRoles: ["public", "customer"],
      steps: [
        "Register for an account",
        "Verify your identity",
        "Choose your service",
        "Submit required documents",
        "Pay applicable fees",
        "Track your application"
      ],
      downloadUrl: "/guides/citizen-guide.pdf"
    },
    {
      id: "officer-handbook",
      title: "Immigration Officer Handbook",
      description: "Operational procedures and guidelines for immigration officers",
      userRoles: ["officer", "admin", "super-admin"],
      steps: [
        "System login and authentication",
        "Document verification procedures",
        "Database queries and checks",
        "Processing applications",
        "Inter-agency coordination",
        "Reporting and documentation"
      ],
      downloadUrl: "/guides/officer-handbook.pdf",
      videoUrl: "/training/officer-training.mp4"
    },
    {
      id: "admin-manual",
      title: "System Administration Manual",
      description: "Administrative functions and system management",
      userRoles: ["admin", "super-admin"],
      steps: [
        "User management",
        "System configuration",
        "Report generation",
        "Agency coordination",
        "Security management",
        "Performance monitoring"
      ],
      downloadUrl: "/guides/admin-manual.pdf"
    }
  ];

  // FAQ based on user roles
  const getFAQs = () => {
    const role = getCurrentUserRole();
    const faqs = [
      // Public/Customer FAQs
      {
        question: "How long does passport processing take?",
        answer: "Standard processing time is 10-14 working days. Express service (3-5 days) is available for an additional fee.",
        roles: ["public", "customer"]
      },
      {
        question: "What documents do I need for a visa application?",
        answer: "Required documents include: valid passport, completed application form, passport photos, proof of accommodation, return ticket, and financial statements.",
        roles: ["public", "customer"]
      },
      {
        question: "Can I track my application online?",
        answer: "Yes, you can track your application status using your reference number on our online portal.",
        roles: ["public", "customer"]
      },
      {
        question: "What is a CEPGL document?",
        answer: "CEPGL documents are special travel documents for citizens of member countries (DRC, Rwanda, Burundi) facilitating movement within the CEPGL region.",
        roles: ["public", "customer"]
      },

      // Officer FAQs
      {
        question: "How do I access INTERPOL databases?",
        answer: "Access INTERPOL databases through the secure terminal using your officer credentials. Follow standard verification procedures for all queries.",
        roles: ["officer", "admin", "super-admin"]
      },
      {
        question: "What should I do if biometric equipment fails?",
        answer: "Follow backup procedures: document the issue, use alternative equipment if available, or process manually with supervisor approval.",
        roles: ["officer", "admin", "super-admin"]
      },
      {
        question: "How do I handle suspicious documents?",
        answer: "Immediately flag the document, notify your supervisor, conduct additional verification checks, and follow security protocols.",
        roles: ["officer", "admin", "super-admin"]
      },

      // Admin FAQs
      {
        question: "How do I generate monthly reports?",
        answer: "Access the Analytics dashboard, select the reporting period, choose metrics, and export in your preferred format.",
        roles: ["admin", "super-admin"]
      },
      {
        question: "How do I coordinate with other agencies?",
        answer: "Use the Multi-Agency Access portal to communicate, share data (with proper authorization), and coordinate operations.",
        roles: ["admin", "super-admin"]
      }
    ];

    return faqs.filter(faq => faq.roles.includes(role));
  };

  // Filter articles based on user role and search
  const getFilteredArticles = () => {
    const role = getCurrentUserRole();
    return helpArticles.filter(article => {
      const matchesRole = article.userRoles.includes(role);
      const matchesSearch = searchQuery === "" || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      
      return matchesRole && matchesSearch && matchesCategory;
    });
  };

  const filteredArticles = getFilteredArticles();
  const categories = [...new Set(helpArticles.map(a => a.category))];
  const faqs = getFAQs();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <HelpCircle className="h-8 w-8" />
          <T>help.title</T>
        </h1>
        <p className="text-muted-foreground">
          Find answers, guides, and support for all your immigration service needs
        </p>
      </div>

      {/* Search and Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">Help Articles</TabsTrigger>
          <TabsTrigger value="guides">User Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{article.category}</Badge>
                        <Badge variant="outline">{article.difficulty}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Updated: {new Date(article.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{article.content}</p>
                  <div className="flex items-center gap-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No articles found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          {userGuides
            .filter(guide => guide.userRoles.includes(getCurrentUserRole()))
            .map((guide) => (
              <Card key={guide.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{guide.title}</span>
                    <div className="flex gap-2">
                      {guide.downloadUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      )}
                      {guide.videoUrl && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch Video
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Step-by-step process:</h4>
                    <ol className="space-y-2">
                      {guide.steps.map((step, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {faqs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No FAQs available for your user role.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {contactMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {method.type === "phone" && <Phone className="h-5 w-5" />}
                    {method.type === "email" && <Mail className="h-5 w-5" />}
                    {method.type === "chat" && <MessageCircle className="h-5 w-5" />}
                    {method.type === "office" && <Users className="h-5 w-5" />}
                    {method.label}
                  </CardTitle>
                  {method.department && (
                    <CardDescription>{method.department}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">{method.value}</p>
                    {method.hours && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {method.hours}
                      </div>
                    )}
                    <Badge 
                      variant={
                        method.priority === "emergency" ? "destructive" :
                        method.priority === "urgent" ? "default" : "secondary"
                      }
                    >
                      {method.priority.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Emergency Situations:</strong> For urgent security matters or emergencies at border crossings, 
              call our 24/7 emergency hotline immediately. For general inquiries, please use normal support channels 
              during business hours.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}