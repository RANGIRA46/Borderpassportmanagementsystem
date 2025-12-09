import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  Fingerprint,
  Camera,
  Navigation
} from "lucide-react";
import { cn } from "./ui/utils";

export function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [appointmentType, setAppointmentType] = useState('document-verification');
  const [applicantData, setApplicantData] = useState({
    applicationRef: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredLanguage: 'en'
  });

  const enrollmentCenters = [
    {
      id: 'kigali-main',
      name: 'Kigali Main Enrollment Center',
      address: 'Kacyiru, Gasabo, Kigali City',
      capacity: 120,
      currentLoad: 78,
      coordinates: { lat: -1.9441, lng: 30.0619 },
      services: ['document-verification', 'photo-capture'],
      operatingHours: '08:00 - 17:00',
      languages: ['kinyarwanda', 'english', 'french'],
      equipment: ['Face Camera', 'Document Scanner'],
      waitTime: '15-20 minutes'
    },
    {
      id: 'nyarugenge',
      name: 'Nyarugenge Service Center',
      address: 'Downtown, Nyarugenge, Kigali City',
      capacity: 80,
      currentLoad: 45,
      coordinates: { lat: -1.9536, lng: 30.0605 },
      services: ['document-verification'],
      operatingHours: '08:30 - 16:30',
      languages: ['kinyarwanda', 'english'],
      equipment: ['Document Scanner'],
      waitTime: '10-15 minutes'
    },
    {
      id: 'gasabo-branch',
      name: 'Gasabo Branch Office',
      address: 'Kimihurura, Gasabo, Kigali City',
      capacity: 60,
      currentLoad: 52,
      coordinates: { lat: -1.9355, lng: 30.1088 },
      services: ['photo-capture'],
      operatingHours: '09:00 - 16:00',
      languages: ['kinyarwanda', 'english', 'french'],
      equipment: ['Face Camera'],
      waitTime: '20-25 minutes'
    },
    {
      id: 'huye-center',
      name: 'Huye Regional Center',
      address: 'Huye, Southern Province',
      capacity: 50,
      currentLoad: 23,
      coordinates: { lat: -2.5969, lng: 29.7391 },
      services: ['document-verification', 'photo-capture'],
      operatingHours: '08:00 - 17:00',
      languages: ['kinyarwanda', 'english'],
      equipment: ['Face Camera', 'Document Scanner'],
      waitTime: '5-10 minutes'
    }
  ];

  const timeSlots = [
    { time: '08:00', available: true, capacity: 8, booked: 2 },
    { time: '08:30', available: true, capacity: 8, booked: 5 },
    { time: '09:00', available: true, capacity: 8, booked: 7 },
    { time: '09:30', available: false, capacity: 8, booked: 8 },
    { time: '10:00', available: true, capacity: 8, booked: 3 },
    { time: '10:30', available: true, capacity: 8, booked: 4 },
    { time: '11:00', available: true, capacity: 8, booked: 6 },
    { time: '11:30', available: true, capacity: 8, booked: 1 },
    { time: '14:00', available: true, capacity: 8, booked: 2 },
    { time: '14:30', available: true, capacity: 8, booked: 4 },
    { time: '15:00', available: true, capacity: 8, booked: 5 },
    { time: '15:30', available: false, capacity: 8, booked: 8 },
    { time: '16:00', available: true, capacity: 8, booked: 3 },
    { time: '16:30', available: true, capacity: 8, booked: 2 }
  ];

  const appointmentTypes = [

    {
      id: 'photo',
      title: 'Photo Capture Only',
      description: 'Professional passport photo',
      duration: '10 minutes',
      icon: <Camera className="h-5 w-5" />,
      requirements: ['Valid application reference', 'Appointment confirmation']
    },
    {
      id: 'document-verification',
      title: 'Document Verification',
      description: 'Original document verification',
      duration: '20 minutes',
      icon: <CheckCircle className="h-5 w-5" />,
      requirements: ['All original documents', 'Application reference', 'Appointment confirmation']
    }
  ];

  const getLoadColor = (load: number, capacity: number) => {
    const percentage = (load / capacity) * 100;
    if (percentage < 60) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLoadBadge = (load: number, capacity: number) => {
    const percentage = (load / capacity) * 100;
    if (percentage < 60) return 'Low';
    if (percentage < 80) return 'Medium';
    return 'High';
  };

  const handleInputChange = (field: string, value: string) => {
    setApplicantData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookAppointment = () => {
    const selectedCenterData = enrollmentCenters.find(c => c.id === selectedCenter);
    const appointmentRef = `APT${Date.now().toString().slice(-6)}`;

    alert(`
      Appointment Booked Successfully!
      
      Reference: ${appointmentRef}
      Type: ${appointmentTypes.find(t => t.id === appointmentType)?.title}
      Date: ${selectedDate?.toLocaleDateString()}
      Time: ${selectedSlot}
      Center: ${selectedCenterData?.name}
      
      Please arrive 15 minutes early with required documents.
      SMS and email confirmations will be sent shortly.
    `);
  };

  const isFormValid = () => {
    return applicantData.applicationRef &&
      applicantData.firstName &&
      applicantData.lastName &&
      applicantData.email &&
      applicantData.phone &&
      selectedDate &&
      selectedCenter &&
      selectedSlot;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Book Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your appointment at one of our accredited centers
        </p>
      </div>

      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          <TabsTrigger value="centers">Enrollment Centers</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="booking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Applicant Information</CardTitle>
                  <CardDescription>
                    Enter your application details to book an appointment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="applicationRef">Application Reference Number *</Label>
                    <Input
                      id="applicationRef"
                      placeholder="e.g., PA2024001234"
                      value={applicantData.applicationRef}
                      onChange={(e) => handleInputChange('applicationRef', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={applicantData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={applicantData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={applicantData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+250 xxx xxx xxx"
                        value={applicantData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="preferredLanguage">Preferred Service Language</Label>
                    <Select onValueChange={(value) => handleInputChange('preferredLanguage', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kinyarwanda">Kinyarwanda</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {appointmentTypes.map((type) => (
                      <div
                        key={type.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-all",
                          appointmentType === type.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setAppointmentType(type.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="text-primary mt-1">{type.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{type.title}</h4>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </div>
                              <Badge variant="outline">{type.duration}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select Enrollment Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enrollmentCenters.map((center) => (
                      <div
                        key={center.id}
                        className={cn(
                          "border rounded-lg p-4 cursor-pointer transition-all",
                          selectedCenter === center.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedCenter(center.id)}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{center.name}</h4>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {center.address}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getLoadColor(center.currentLoad, center.capacity) === 'text-green-600' ? 'bg-green-100 text-green-800' :
                                getLoadColor(center.currentLoad, center.capacity) === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'}>
                                {getLoadBadge(center.currentLoad, center.capacity)} Load
                              </Badge>
                              <div className="text-xs text-muted-foreground mt-1">
                                Wait: {center.waitTime}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {center.operatingHours}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {center.currentLoad}/{center.capacity}
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              {center.languages.includes('kinyarwanda') && <Badge variant="outline" className="text-xs">KIN</Badge>}
                              {center.languages.includes('english') && <Badge variant="outline" className="text-xs">EN</Badge>}
                              {center.languages.includes('french') && <Badge variant="outline" className="text-xs">FR</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date and Time Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Time Slots</CardTitle>
                    <CardDescription>
                      {selectedDate.toLocaleDateString()} - {enrollmentCenters.find(c => c.id === selectedCenter)?.name || 'Select a center'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedSlot === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className="h-12 flex flex-col"
                          size="sm"
                        >
                          <span>{slot.time}</span>
                          <span className="text-xs opacity-70">
                            {slot.booked}/{slot.capacity}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {isFormValid() && (
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span>{appointmentTypes.find(t => t.id === appointmentType)?.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{selectedDate?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{selectedSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{appointmentTypes.find(t => t.id === appointmentType)?.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Center:</span>
                        <span className="text-right">{enrollmentCenters.find(c => c.id === selectedCenter)?.name}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleBookAppointment}
                      className="w-full"
                      size="lg"
                    >
                      Confirm Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="centers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollmentCenters.map((center) => (
              <Card key={center.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {center.address}
                      </div>
                    </div>
                    <Badge className={getLoadColor(center.currentLoad, center.capacity) === 'text-green-600' ? 'bg-green-100 text-green-800' :
                      getLoadColor(center.currentLoad, center.capacity) === 'text-yellow-600' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}>
                      {getLoadBadge(center.currentLoad, center.capacity)} Load
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Operating Hours:</span>
                      <p>{center.operatingHours}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Current Wait:</span>
                      <p>{center.waitTime}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span>
                      <p>{center.currentLoad}/{center.capacity} appointments</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Languages:</span>
                      <div className="flex space-x-1 mt-1">
                        {center.languages.map(lang => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Services Available:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {center.services.map(service => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Equipment:</span>
                    <ul className="text-sm mt-1 space-y-1">
                      {center.equipment.map(item => (
                        <li key={item} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Call Center
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-3 w-3 mr-1" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointmentTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {type.icon}
                    <span>{type.title}</span>
                  </CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium">Required Documents:</span>
                      <ul className="text-sm mt-2 space-y-1">
                        {type.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Duration:</span> {type.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time.
              Late arrivals may result in rescheduling. Bring all required original documents and your
              appointment confirmation (SMS/Email). Data will be encrypted and stored securely
              following ISO/ANSI standards.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>General Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Before Your Visit:</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Confirm your appointment via SMS or email</li>
                    <li>• Prepare all required documents</li>
                    <li>• Review your application details</li>
                    <li>• Plan your route to the enrollment center</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">During Your Visit:</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Check in at the reception desk</li>
                    <li>• Present your appointment confirmation</li>
                    <li>• Follow officer instructions for biometric capture</li>
                    <li>• Review and sign consent forms</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">After Your Visit:</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Receive appointment completion receipt</li>
                    <li>• Monitor application status online</li>
                    <li>• Await processing completion notification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}