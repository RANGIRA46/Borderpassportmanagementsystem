import { useState } from 'react';
import { useDataManager } from '../DataManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Download, 
  Upload, 
  Database, 
  FileCheck, 
  AlertCircle, 
  CheckCircle,
  Trash2,
  RefreshCw
} from 'lucide-react';

export function DataExporter() {
  const dataManager = useDataManager();
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleExportAll = () => {
    try {
      setIsLoading(true);
      
      // Gather all system data
      const systemData = {
        applications: [],
        borderRecords: dataManager.getBorderRecords(),
        watchlist: dataManager.getWatchlist(),
        stats: dataManager.getSystemStats(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Collect all user applications
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('border_system_applications_')) {
          const userId = key.replace('border_system_applications_', '');
          const userApps = dataManager.getUserApplications(userId);
          systemData.applications.push(...userApps);
        }
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(systemData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `border_system_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setExportStatus('success');
      
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.applications || !data.borderRecords || !data.watchlist) {
          throw new Error('Invalid backup file format');
        }

        // Import applications
        data.applications.forEach((app: any) => {
          dataManager.saveApplication(app);
        });

        // Import border records
        data.borderRecords.forEach((record: any) => {
          dataManager.saveBorderRecord(record);
        });

        // Import watchlist entries
        data.watchlist.forEach((entry: any) => {
          dataManager.addToWatchlist(entry);
        });

        setImportStatus('success');
        
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL system data? This action cannot be undone.')) {
      setIsLoading(true);
      dataManager.clearSystemData();
      setIsLoading(false);
      window.location.reload(); // Refresh to reinitialize
    }
  };

  const stats = dataManager.getSystemStats();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-navy-dark mb-2">System Data Management</h1>
        <p className="text-blue-medium">Export, import, and manage Border Management System data</p>
      </div>

      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Current System Data
          </CardTitle>
          <CardDescription>
            Overview of data currently stored in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl text-navy-dark">{stats.applications.total}</div>
              <div className="text-sm text-blue-medium">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-navy-dark">{stats.borderCrossings.total}</div>
              <div className="text-sm text-blue-medium">Border Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-navy-dark">{stats.security.watchlistEntries}</div>
              <div className="text-sm text-blue-medium">Watchlist Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-navy-dark">{stats.security.highAlerts}</div>
              <div className="text-sm text-blue-medium">High Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export System Data
          </CardTitle>
          <CardDescription>
            Download a complete backup of all system data as JSON
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {exportStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                System data exported successfully! Check your downloads folder.
              </AlertDescription>
            </Alert>
          )}
          
          {exportStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Export failed. Please try again or check browser console for details.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleExportAll}
            disabled={isLoading}
            className="w-full bg-navy-medium hover:bg-navy-dark text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import System Data
          </CardTitle>
          <CardDescription>
            Upload and restore data from a previous backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {importStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Data imported successfully! The system has been updated.
              </AlertDescription>
            </Alert>
          )}
          
          {importStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Import failed. Please check the file format and try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="import-file" className="block text-sm text-navy-dark">
              Select backup file (JSON format):
            </label>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImportData}
              disabled={isLoading}
              className="block w-full text-sm text-blue-medium
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:bg-blue-light file:text-navy-dark
                hover:file:bg-blue-medium file:cursor-pointer
                cursor-pointer"
            />
          </div>

          <Alert>
            <FileCheck className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Importing data will merge with existing data. 
              Duplicate entries may be created.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that will permanently delete data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> These actions cannot be undone. 
              Make sure to export your data first if you want to keep it.
            </AlertDescription>
          </Alert>

          <Button 
            variant="destructive"
            onClick={handleClearAllData}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All System Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataExporter;