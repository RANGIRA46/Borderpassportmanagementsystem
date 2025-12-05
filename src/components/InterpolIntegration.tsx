import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Globe,
  UserX,
  FileSearch,
  Activity,
  MapPin,
  Calendar
} from "lucide-react";

interface PassengerRecord {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  status: 'clear' | 'flagged' | 'wanted' | 'watch';
  watchlistType?: string;
  lastKnownLocation?: string;
  alertLevel: 'low' | 'medium' | 'high';
  agencies: string[];
  lastUpdated: Date;
}

interface WatchlistEntry {
  id: string;
  name: string;
  aliases: string[];
  nationality: string;
  dateOfBirth: string;
  charges: string[];
  issuingCountry: string;
  priority: 'red' | 'yellow' | 'blue';
  status: 'active' | 'expired' | 'cancelled';
}

export function InterpolIntegration() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'passport' | 'name' | 'document'>('passport');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<PassengerRecord[]>([]);
  const [watchlistResults, setWatchlistResults] = useState<WatchlistEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connected');

  // Mock INTERPOL database records
  const mockPassengerRecords: PassengerRecord[] = [
    {
      id: 'RW001234',
      firstName: 'John',
      lastName: 'Doe',
      nationality: 'Rwanda',
      passportNumber: 'PC1234567',
      dateOfBirth: '1985-03-15',
      status: 'clear',
      alertLevel: 'low',
      agencies: ['INTERPOL', 'Rwanda Immigration'],
      lastUpdated: new Date('2024-01-20')
    },
    {
      id: 'KE005678',
      firstName: 'Ahmed',
      lastName: 'Hassan',
      nationality: 'Kenya',
      passportNumber: 'A1234567',
      dateOfBirth: '1978-07-22',
      status: 'flagged',
      watchlistType: 'Security Watch',
      lastKnownLocation: 'Nairobi, Kenya',
      alertLevel: 'medium',
      agencies: ['INTERPOL', 'EAC Security'],
      lastUpdated: new Date('2024-01-19')
    },
    {
      id: 'FR009876',
      firstName: 'Marie',
      lastName: 'Dubois',
      nationality: 'France',
      passportNumber: 'FR9876543',
      dateOfBirth: '1990-12-03',
      status: 'wanted',
      watchlistType: 'Red Notice',
      lastKnownLocation: 'Paris, France',
      alertLevel: 'high',
      agencies: ['INTERPOL', 'Europol', 'French Police'],
      lastUpdated: new Date('2024-01-21')
    }
  ];

  const mockWatchlistEntries: WatchlistEntry[] = [
    {
      id: 'RN-2024-001',
      name: 'Marie Dubois',
      aliases: ['Maria Santos', 'M. Durand'],
      nationality: 'France',
      dateOfBirth: '1990-12-03',
      charges: ['Financial Fraud', 'Money Laundering'],
      issuingCountry: 'France',
      priority: 'red',
      status: 'active'
    },
    {
      id: 'YN-2024-045',
      name: 'Ahmed Hassan',
      aliases: ['A. Mohammed'],
      nationality: 'Kenya',
      dateOfBirth: '1978-07-22',
      charges: ['Suspected Terrorism Links'],
      issuingCountry: 'Kenya',
      priority: 'yellow',
      status: 'active'
    }
  ];

  const agencyConnections = [
    { name: 'INTERPOL Lyon', status: 'connected', latency: '120ms', lastSync: '2 min ago' },
    { name: 'EAC Regional Database', status: 'connected', latency: '45ms', lastSync: '1 min ago' },
    { name: 'Europol', status: 'connected', latency: '180ms', lastSync: '3 min ago' },
    { name: 'US FBI NCIC', status: 'connected', latency: '250ms', lastSync: '5 min ago' },
    { name: 'UK Border Force', status: 'connected', latency: '200ms', lastSync: '4 min ago' },
    { name: 'AFRIPOL', status: 'connected', latency: '90ms', lastSync: '2 min ago' }
  ];

  const handleSearch = async () => {
    setLoading(true);
    setSearchResults([]);
    setWatchlistResults([]);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Search in passenger records
    const passengerMatches = mockPassengerRecords.filter(record => {
      if (searchType === 'passport') {
        return record.passportNumber.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === 'name') {
        return record.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               record.lastName.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });

    // Search in watchlist
    const watchlistMatches = mockWatchlistEntries.filter(entry => {
      if (searchType === 'name') {
        return entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               entry.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      return false;
    });

    setSearchResults(passengerMatches);
    setWatchlistResults(watchlistMatches);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-yellow-100 text-yellow-800';
      case 'wanted': return 'bg-red-100 text-red-800';
      case 'watch': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl mb-2 text-navy-dark">INTERPOL Integration</h1>
          <p className="text-navy-medium">Real-time passenger screening and watchlist verification</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-navy-medium">
            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Passenger Search</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Interface */}
          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-navy-dark">
                <Search className="h-5 w-5" />
                <span>Passenger Verification</span>
              </CardTitle>
              <CardDescription>Search across multiple international databases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="searchType">Search Type</Label>
                    <select 
                      id="searchType"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as any)}
                      className="w-full px-3 py-2 border border-blue-light rounded-md bg-white text-navy-dark"
                    >
                      <option value="passport">Passport Number</option>
                      <option value="name">Full Name</option>
                      <option value="document">Document Number</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="searchQuery">Search Query</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="searchQuery"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchType === 'passport' ? 'Enter passport number...' : 'Enter full name...'}
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch}
                        disabled={!searchQuery.trim() || loading}
                        className="bg-navy-medium hover:bg-navy-dark text-white"
                      >
                        {loading ? <Clock className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        Search
                      </Button>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Searching databases...</span>
                      <span>Checking 6 agencies</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {(searchResults.length > 0 || watchlistResults.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Passenger Records */}
              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="text-navy-dark">Passenger Records ({searchResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {searchResults.map((record) => (
                      <div key={record.id} className="border border-blue-light rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-navy-dark">{record.firstName} {record.lastName}</h4>
                            <p className="text-sm text-navy-medium">{record.nationality} • {record.passportNumber}</p>
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-navy-medium">DOB:</span>
                            <span className="ml-2 text-navy-dark">{record.dateOfBirth}</span>
                          </div>
                          <div>
                            <span className="text-navy-medium">Alert Level:</span>
                            <span className={`ml-2 font-medium ${getAlertColor(record.alertLevel)}`}>
                              {record.alertLevel.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        {record.watchlistType && (
                          <div className="mt-2 text-sm">
                            <span className="text-navy-medium">Watchlist:</span>
                            <span className="ml-2 text-red-600">{record.watchlistType}</span>
                          </div>
                        )}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {record.agencies.map((agency, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-medium text-navy-medium">
                              {agency}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Watchlist Matches */}
              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="text-navy-dark">Watchlist Matches ({watchlistResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {watchlistResults.map((entry) => (
                      <div key={entry.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-navy-dark">{entry.name}</h4>
                            <p className="text-sm text-navy-medium">{entry.nationality} • {entry.dateOfBirth}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(entry.priority)}`}></div>
                            <span className="text-xs font-medium">{entry.priority.toUpperCase()} NOTICE</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-navy-medium">Aliases:</span>
                            <span className="ml-2 text-navy-dark">{entry.aliases.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-navy-medium">Charges:</span>
                            <span className="ml-2 text-red-600">{entry.charges.join(', ')}</span>
                          </div>
                          <div>
                            <span className="text-navy-medium">Issuing Country:</span>
                            <span className="ml-2 text-navy-dark">{entry.issuingCountry}</span>
                          </div>
                        </div>
                        <Badge className="mt-2 bg-red-100 text-red-800">
                          {entry.status.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {searchQuery && !loading && searchResults.length === 0 && watchlistResults.length === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                No records found in international databases. Passenger cleared for travel.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWatchlistEntries.map((entry) => (
              <Card key={entry.id} className="border-blue-light">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-navy-dark">{entry.name}</CardTitle>
                      <CardDescription>{entry.nationality}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${getPriorityColor(entry.priority)}`}></div>
                      <span className="text-xs font-medium">{entry.priority.toUpperCase()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-navy-medium">ID:</span>
                      <span className="ml-2 text-navy-dark font-mono">{entry.id}</span>
                    </div>
                    <div>
                      <span className="text-navy-medium">DOB:</span>
                      <span className="ml-2 text-navy-dark">{entry.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="text-navy-medium">Aliases:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {entry.aliases.map((alias, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-navy-medium">Charges:</span>
                      <ul className="mt-1 text-navy-dark">
                        {entry.charges.map((charge, index) => (
                          <li key={index} className="text-xs">• {charge}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-6">
          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="text-navy-dark">Connected Agencies</CardTitle>
              <CardDescription>Real-time status of international database connections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agencyConnections.map((agency, index) => (
                  <div key={index} className="border border-blue-light rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-navy-dark">{agency.name}</h4>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${agency.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-navy-medium capitalize">{agency.status}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-navy-medium">
                      <div>Latency: {agency.latency}</div>
                      <div>Last sync: {agency.lastSync}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <Database className="h-8 w-8 mx-auto text-navy-medium mb-3" />
                <div className="text-2xl font-bold text-navy-dark">1,247,892</div>
                <div className="text-sm text-navy-medium">Total Records</div>
              </CardContent>
            </Card>
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <Search className="h-8 w-8 mx-auto text-blue-medium mb-3" />
                <div className="text-2xl font-bold text-navy-dark">23,456</div>
                <div className="text-sm text-navy-medium">Searches Today</div>
              </CardContent>
            </Card>
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto text-yellow-600 mb-3" />
                <div className="text-2xl font-bold text-navy-dark">124</div>
                <div className="text-sm text-navy-medium">Active Alerts</div>
              </CardContent>
            </Card>
            <Card className="border-blue-light">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto text-green-600 mb-3" />
                <div className="text-2xl font-bold text-navy-dark">99.97%</div>
                <div className="text-sm text-navy-medium">System Uptime</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="text-navy-dark">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '14:23', action: 'Watchlist match detected', user: 'Border Officer #247', severity: 'high' },
                  { time: '14:20', action: 'Passenger cleared through INTERPOL check', user: 'System Auto', severity: 'low' },
                  { time: '14:18', action: 'New red notice received from France', user: 'INTERPOL Lyon', severity: 'medium' },
                  { time: '14:15', action: 'Database sync completed', user: 'System Auto', severity: 'low' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-blue-light rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className={`h-4 w-4 ${
                        activity.severity === 'high' ? 'text-red-600' :
                        activity.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-navy-dark">{activity.action}</div>
                        <div className="text-xs text-navy-medium">by {activity.user}</div>
                      </div>
                    </div>
                    <div className="text-xs text-navy-medium">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}