import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AgencyCard } from "./multi-agency/AgencyCard";
import { Agency, DataExchange, CoordinationRequest } from "./multi-agency/types";
import { 
  MOCK_AGENCIES, 
  MOCK_DATA_EXCHANGES, 
  MOCK_COORDINATION_REQUESTS 
} from "./multi-agency/constants";
import { 
  filterAgencies, 
  filterDataExchanges, 
  getAgencyStats,
  sortAgenciesByPriority,
  getStatusColor,
  getPriorityColor,
  formatDataSize,
  formatResponseTime
} from "./multi-agency/utils";
import { 
  Globe, 
  Shield, 
  Database, 
  Users, 
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Send,
  Download,
  Upload
} from "lucide-react";

export function MultiAgencyAccess() {
  const [currentTab, setCurrentTab] = useState('agencies');
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [dataExchanges, setDataExchanges] = useState<DataExchange[]>([]);
  const [coordinationRequests, setCoordinationRequests] = useState<CoordinationRequest[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    setAgencies(sortAgenciesByPriority(MOCK_AGENCIES));
    setDataExchanges(MOCK_DATA_EXCHANGES);
    setCoordinationRequests(MOCK_COORDINATION_REQUESTS);
  }, []);

  const filteredAgencies = filterAgencies(agencies, searchQuery, filterStatus);
  const filteredExchanges = filterDataExchanges(dataExchanges, searchQuery, filterStatus, filterPriority);
  const stats = getAgencyStats(agencies);

  const handleViewDetails = (agency: Agency) => {
    setSelectedAgency(agency);
  };

  const handleManageConnection = (agency: Agency) => {
    console.log('Managing connection for:', agency.name);
  };

  const handleViewStatistics = (agency: Agency) => {
    console.log('Viewing statistics for:', agency.name);
  };

  return (
    <div className="min-h-screen bg-navy-dark p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-lightest mb-2">
                Multi-Agency Coordination Center
              </h1>
              <p className="text-blue-light">
                Coordinate with international law enforcement and border control agencies
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="border-green-500 text-green-400">
                <Shield className="h-3 w-3 mr-1" />
                {stats.connectedAgencies} Agencies Connected
              </Badge>
              <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-navy-medium border-blue-medium max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-blue-lightest">New Coordination Request</DialogTitle>
                    <DialogDescription className="text-blue-light">
                      Create a new request for multi-agency coordination
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-light text-sm font-medium">Request Title</label>
                      <Input className="bg-navy-dark border-blue-medium text-blue-lightest mt-1" />
                    </div>
                    <div>
                      <label className="text-blue-light text-sm font-medium">Select Agencies</label>
                      <Select>
                        <SelectTrigger className="bg-navy-dark border-blue-medium text-blue-lightest">
                          <SelectValue placeholder="Choose agencies..." />
                        </SelectTrigger>
                        <SelectContent className="bg-navy-medium border-blue-medium">
                          {agencies.filter(a => a.status === 'connected').map(agency => (
                            <SelectItem key={agency.id} value={agency.id} className="text-blue-lightest">
                              {agency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setIsNewRequestOpen(false)} className="border-blue-light text-blue-light">
                        Cancel
                      </Button>
                      <Button className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                        Create Request
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🌐</div>
              <div className="text-2xl font-bold text-blue-lightest">{stats.totalAgencies}</div>
              <div className="text-sm text-blue-light">Total Agencies</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-blue-lightest">{stats.connectedAgencies}</div>
              <div className="text-sm text-blue-light">Connected</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-2xl font-bold text-blue-lightest">{stats.totalQueries.toLocaleString()}</div>
              <div className="text-sm text-blue-light">Total Queries</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-blue-lightest">{stats.avgResponseTime}s</div>
              <div className="text-sm text-blue-light">Avg Response</div>
            </CardContent>
          </Card>
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🚨</div>
              <div className="text-2xl font-bold text-blue-lightest">{stats.totalAlerts}</div>
              <div className="text-sm text-blue-light">Alerts Received</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-navy-medium">
            <TabsTrigger value="agencies" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Globe className="h-4 w-4 mr-2" />
              Agencies
            </TabsTrigger>
            <TabsTrigger value="exchanges" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Database className="h-4 w-4 mr-2" />
              Data Exchange
            </TabsTrigger>
            <TabsTrigger value="coordination" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <Users className="h-4 w-4 mr-2" />
              Coordination
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-light data-[state=active]:text-navy-dark">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <Card className="bg-navy-medium border-blue-medium">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search agencies, exchanges, or requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-navy-dark border-blue-medium text-blue-lightest"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48 bg-navy-dark border-blue-medium text-blue-lightest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-medium border-blue-medium">
                    <SelectItem value="all" className="text-blue-lightest">All Status</SelectItem>
                    <SelectItem value="connected" className="text-blue-lightest">Connected</SelectItem>
                    <SelectItem value="disconnected" className="text-blue-lightest">Disconnected</SelectItem>
                    <SelectItem value="maintenance" className="text-blue-lightest">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="border-blue-light text-blue-light">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agencies Tab */}
          <TabsContent value="agencies" className="space-y-6">
            {filteredAgencies.length === 0 ? (
              <Card className="bg-navy-medium border-blue-medium">
                <CardContent className="text-center py-12">
                  <Globe className="h-16 w-16 text-blue-light mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-blue-lightest mb-2">No Agencies Found</h3>
                  <p className="text-blue-light">
                    {searchQuery ? 'No agencies match your search criteria.' : 'No agencies configured.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAgencies.map((agency) => (
                  <AgencyCard
                    key={agency.id}
                    agency={agency}
                    onViewDetails={handleViewDetails}
                    onManageConnection={handleManageConnection}
                    onViewStatistics={handleViewStatistics}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Data Exchange Tab */}
          <TabsContent value="exchanges" className="space-y-6">
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Recent Data Exchanges</CardTitle>
                <CardDescription className="text-blue-light">
                  Monitor all data exchanges with partner agencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredExchanges.map((exchange) => (
                    <Card key={exchange.id} className="bg-navy-dark border-blue-medium">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-blue-lightest font-medium">{exchange.subject}</h4>
                              <Badge className={getPriorityColor(exchange.priority)}>
                                {exchange.priority.toUpperCase()}
                              </Badge>
                              <Badge className={getStatusColor(exchange.status)}>
                                {exchange.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-blue-light text-sm mb-2">{exchange.details}</p>
                            <div className="flex items-center space-x-4 text-xs text-blue-light">
                              <span>Agency: {agencies.find(a => a.id === exchange.agencyId)?.name}</span>
                              <span>Size: {formatDataSize(exchange.dataSize)}</span>
                              <span>Time: {exchange.timestamp.toLocaleString()}</span>
                              {exchange.responseTime && (
                                <span>Response: {formatResponseTime(exchange.responseTime)}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coordination Tab */}
          <TabsContent value="coordination" className="space-y-6">
            <Card className="bg-navy-medium border-blue-medium">
              <CardHeader>
                <CardTitle className="text-blue-lightest">Coordination Requests</CardTitle>
                <CardDescription className="text-blue-light">
                  Manage multi-agency coordination and joint operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coordinationRequests.map((request) => (
                    <Card key={request.id} className="bg-navy-dark border-blue-medium">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-blue-lightest font-medium">{request.title}</h4>
                            <p className="text-blue-light text-sm">{request.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(request.priority)}>
                              {request.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-blue-light mb-3">
                          Created by {request.requestor} • {request.created.toLocaleDateString()}
                          {request.deadline && ` • Deadline: ${request.deadline.toLocaleDateString()}`}
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {request.agencies.map((agencyId) => {
                            const agency = agencies.find(a => a.id === agencyId);
                            return agency ? (
                              <Badge key={agencyId} variant="outline" className="border-blue-light text-blue-light text-xs">
                                {agency.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-light text-sm">
                            {request.responses.length} response(s) received
                          </span>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-blue-light text-blue-light">
                              View Details
                            </Button>
                            <Button size="sm" className="bg-blue-light hover:bg-blue-medium text-navy-dark">
                              Manage
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Connection Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {agencies.slice(0, 5).map((agency) => {
                      const successRate = Math.round((agency.statistics.successfulQueries / agency.statistics.totalQueries) * 100);
                      return (
                        <div key={agency.id} className="flex justify-between items-center">
                          <span className="text-blue-light text-sm">{agency.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-lightest text-sm">{successRate}%</span>
                            <div className={`w-2 h-2 rounded-full ${
                              successRate > 95 ? 'bg-green-500' :
                              successRate > 85 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-navy-medium border-blue-medium">
                <CardHeader>
                  <CardTitle className="text-blue-lightest">Query Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-16 w-16 text-blue-light mx-auto mb-4" />
                    <p className="text-blue-light">Detailed analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}