import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function BorderRecords() {
  const [passportNumber, setPassportNumber] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterYear, setFilterYear] = useState('all');

  const mockRecords = [
    {
      id: '1',
      date: '2024-01-15',
      time: '14:30',
      location: 'JFK Airport, New York',
      country: 'United States',
      type: 'Entry',
      purpose: 'Tourism',
      officer: 'J.SMITH',
      status: 'Approved'
    },
    {
      id: '2',
      date: '2024-01-10',
      time: '09:15',
      location: 'Heathrow Airport, London',
      country: 'United Kingdom',
      type: 'Exit',
      purpose: 'Tourism',
      officer: 'M.JONES',
      status: 'Approved'
    },
    {
      id: '3',
      date: '2024-01-05',
      time: '16:45',
      location: 'Heathrow Airport, London',
      country: 'United Kingdom',
      type: 'Entry',
      purpose: 'Business',
      officer: 'A.BROWN',
      status: 'Approved'
    },
    {
      id: '4',
      date: '2023-12-20',
      time: '11:20',
      location: 'LAX Airport, Los Angeles',
      country: 'United States',
      type: 'Exit',
      purpose: 'Business',
      officer: 'K.WILSON',
      status: 'Approved'
    },
    {
      id: '5',
      date: '2023-12-15',
      time: '08:30',
      location: 'Toronto Pearson Airport',
      country: 'Canada',
      type: 'Entry',
      purpose: 'Transit',
      officer: 'R.GARCIA',
      status: 'Approved'
    }
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRecords(mockRecords);
      setIsLoading(false);
    }, 1000);
  };

  const filteredRecords = records.filter(record => {
    const typeMatch = filterType === 'all' || record.type.toLowerCase() === filterType;
    const yearMatch = filterYear === 'all' || record.date.startsWith(filterYear);
    return typeMatch && yearMatch;
  });

  const getTypeColor = (type: string) => {
    return type === 'Entry' ? 'default' : 'secondary';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'denied':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTravelStats = () => {
    const entries = records.filter(r => r.type === 'Entry').length;
    const exits = records.filter(r => r.type === 'Exit').length;
    const countries = new Set(records.map(r => r.country)).size;
    return { entries, exits, countries };
  };

  const stats = getTravelStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl">
            <span>🛂</span>
            <span>Border Crossing Records</span>
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            View your travel history and border crossing records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="passport">Passport Number</Label>
              <Input
                id="passport"
                placeholder="e.g., A1234567"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="h-11 w-full sm:w-auto px-8"
              >
                {isLoading ? 'Searching...' : 'Search Records'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {records.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-3xl">📥</span>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats.entries}</p>
                    <p className="text-sm text-muted-foreground">Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-3xl">📤</span>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats.exits}</p>
                    <p className="text-sm text-muted-foreground">Exits</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl sm:text-3xl">🌍</span>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats.countries}</p>
                    <p className="text-sm text-muted-foreground">Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Travel History</CardTitle>
                  <CardDescription>All border crossing records</CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-32 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="entry">Entry Only</SelectItem>
                      <SelectItem value="exit">Exit Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="w-full sm:w-32 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="h-10">Export PDF</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.date}</div>
                            <div className="text-sm text-muted-foreground">{record.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell>{record.country}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(record.type)}>
                            {record.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.purpose}</TableCell>
                        <TableCell className="font-mono text-sm">{record.officer}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredRecords.map((record) => (
                  <Card key={record.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-base">{record.date}</div>
                          <div className="text-sm text-muted-foreground">{record.time}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getTypeColor(record.type)} className="text-xs">
                            {record.type}
                          </Badge>
                          <Badge variant={getStatusColor(record.status)} className="text-xs">
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="text-right">{record.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Country:</span>
                          <span>{record.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Purpose:</span>
                          <span>{record.purpose}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Officer:</span>
                          <span className="font-mono text-xs">{record.officer}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}