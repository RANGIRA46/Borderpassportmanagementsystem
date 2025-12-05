import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Shield, 
  FileText, 
  Users, 
  BookOpen,
  CreditCard,
  AlertTriangle,
  Clock,
  Headphones,
  Building2,
  ExternalLink
} from "lucide-react";

interface DGIEServicesProps {
  onPageChange?: (page: string) => void;
}

export function DGIEServices({ onPageChange }: DGIEServicesProps) {
  const services = [
    {
      id: 'general',
      title: 'General Inquiries',
      description: 'General information about immigration services and procedures',
      icon: <Building2 className="h-6 w-6" />,
      email: 'info@migration.gov.rw',
      phone: '+250 788 15 22 22',
      color: 'bg-navy-medium',
      category: 'General'
    },
    {
      id: 'passport',
      title: 'Passport Services',
      description: 'New passport applications, renewals, and passport-related inquiries',
      icon: <BookOpen className="h-6 w-6" />,
      email: 'passport@migration.gov.rw',
      phone: '+250 722 15 93 72',
      color: 'bg-blue-medium',
      category: 'Travel Documents',
      actionPage: 'apply-passport'
    },
    {
      id: 'visa',
      title: 'Visa Inquiries',
      description: 'Ordinary and online visa applications, visa extensions and renewals',
      icon: <Globe className="h-6 w-6" />,
      email: 'visa@migration.gov.rw',
      phone: '+250 722 17 29 74',
      color: 'bg-blue-medium',
      category: 'Travel Documents',
      actionPage: 'apply-visa'
    },
    {
      id: 'laissez-passer',
      title: 'Laissez-passer & Travel Documents',
      description: 'Emergency travel documents, laissez-passer, and other travel documents',
      icon: <FileText className="h-6 w-6" />,
      email: 'laissezpasser@migration.gov.rw',
      phone: '+250 722 15 86 92',
      color: 'bg-navy-dark',
      category: 'Travel Documents',
      actionPage: 'laissez-passer'
    },
    {
      id: 'permits',
      title: 'Permit Inquiries',
      description: 'Work permits, residence permits, and other immigration permits',
      icon: <CreditCard className="h-6 w-6" />,
      email: 'permit@migration.gov.rw',
      phone: '+250 722 17 29 74',
      color: 'bg-blue-light',
      category: 'Permits',
      actionPage: 'apply-permit'
    },
    {
      id: 'citizenship',
      title: 'Citizenship Services',
      description: 'Citizenship applications, naturalization, and citizenship inquiries',
      icon: <Shield className="h-6 w-6" />,
      email: 'citizenship@migration.gov.rw',
      phone: '+250 722 16 99 58',
      color: 'bg-navy-medium',
      category: 'Citizenship',
      actionPage: 'apply-citizenship'
    },
    {
      id: 'diaspora',
      title: 'Diaspora Services',
      description: 'Services for Rwandans living abroad and diaspora community support',
      icon: <Users className="h-6 w-6" />,
      email: 'diaspora@migration.gov.rw',
      phone: '+250 722 17 46 11',
      color: 'bg-blue-medium',
      category: 'Special Services',
      actionPage: 'diaspora-services'
    },
    {
      id: 'refugee',
      title: 'Refugee Services',
      description: 'Refugee assistance, asylum applications, and refugee-related inquiries',
      icon: <Users className="h-6 w-6" />,
      email: 'refugee@migration.gov.rw',
      phone: '+250 727 00 59 90',
      color: 'bg-navy-dark',
      category: 'Special Services',
      actionPage: 'refugee-services'
    },
    {
      id: 'border-control',
      title: 'Border Control',
      description: 'Border crossing assistance, documentation office, and border inquiries',
      icon: <Shield className="h-6 w-6" />,
      email: 'docoffice@migration.gov.rw',
      phone: '+250 722 17 14 44',
      color: 'bg-red-600',
      category: 'Border Services'
    },
    {
      id: 'customer-care',
      title: 'Communication & Customer Care',
      description: 'Public relations, communication services, and customer support',
      icon: <Headphones className="h-6 w-6" />,
      email: 'pro@migration.gov.rw',
      phone: '+250 722 180 218',
      color: 'bg-green-600',
      category: 'Support'
    }
  ];

  const callCenter = {
    title: 'Call Center',
    description: '24/7 customer support and emergency assistance',
    email: 'callcenter@migration.gov.rw',
    phone: '9090',
    hours: '24/7 Support Available'
  };

  const categories = ['General', 'Travel Documents', 'Permits', 'Citizenship', 'Special Services', 'Border Services', 'Support'];

  const getServicesByCategory = (category: string) => {
    return services.filter(service => service.category === category);
  };

  const handleServiceAction = (service: any) => {
    if (service.actionPage && onPageChange) {
      onPageChange(service.actionPage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex justify-center items-center space-x-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-navy-medium/10 rounded-full border border-navy-medium/20">
            <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-navy-medium" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 text-navy-dark">
          DGIE Services & Contact Directory
        </h1>
        <p className="text-base sm:text-lg text-navy-medium max-w-3xl mx-auto mb-4 sm:mb-6 px-4">
          Directorate General of Immigration and Emigration - Republic of Rwanda
        </p>
        <p className="text-sm sm:text-base text-navy-medium max-w-4xl mx-auto px-4">
          Find the right service for your immigration needs. Each service has dedicated contact information for faster assistance.
        </p>
      </div>

      {/* Emergency Call Center */}
      <div className="mb-8 sm:mb-12">
        <Card className="border-2 border-red-500 bg-gradient-to-r from-red-50 to-white">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                  <Headphones className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-bold text-navy-dark">{callCenter.title}</h3>
                  <Badge className="bg-red-500 text-white">Emergency</Badge>
                </div>
                <p className="text-navy-medium mb-2">{callCenter.description}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-navy-medium">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{callCenter.hours}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open(`tel:${callCenter.phone}`, '_self')}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call {callCenter.phone}
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => window.open(`mailto:${callCenter.email}`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services by Category */}
      {categories.map((category) => {
        const categoryServices = getServicesByCategory(category);
        if (categoryServices.length === 0) return null;

        return (
          <div key={category} className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl text-navy-dark">{category}</h2>
              <Badge variant="outline" className="text-xs sm:text-sm border-blue-medium text-navy-medium">
                {categoryServices.length} Service{categoryServices.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {categoryServices.map((service) => (
                <Card 
                  key={service.id} 
                  className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-blue-light"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2 sm:p-3 rounded-lg text-white ${service.color}`}>
                        {service.icon}
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs border-blue-light text-navy-medium"
                      >
                        {service.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-navy-dark">
                      {service.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-navy-medium mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-medium" />
                        <a 
                          href={`mailto:${service.email}`}
                          className="text-blue-medium hover:text-navy-dark underline font-mono"
                        >
                          {service.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-blue-medium" />
                        <a 
                          href={`tel:${service.phone}`}
                          className="text-blue-medium hover:text-navy-dark underline font-mono"
                        >
                          {service.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
                        onClick={() => window.open(`tel:${service.phone}`, '_self')}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      {service.actionPage ? (
                        <Button 
                          size="sm" 
                          className="bg-navy-medium hover:bg-navy-dark text-white"
                          onClick={() => handleServiceAction(service)}
                        >
                          Apply Now
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-blue-medium text-navy-medium hover:bg-blue-lightest hover:text-navy-dark"
                          onClick={() => window.open(`mailto:${service.email}`, '_blank')}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer Information */}
      <div className="mt-12">
        <Card className="bg-navy-dark text-blue-lightest">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg sm:text-xl mb-4">Office Hours & Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-light">Office Hours</h4>
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 8:00 AM - 12:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-light">Emergency Services</h4>
                  <p>Call Center: 24/7</p>
                  <p>Border Control: 24/7</p>
                  <p>Emergency Travel: On-call</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center text-sm">
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4 text-blue-light" />
                  <span>Kigali, Rwanda</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Globe className="h-4 w-4 text-blue-light" />
                  <span>migration.gov.rw</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}