import { useState } from "react";
import { FileText, Scan, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { getCountryInfo } from "./CountrySelector";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  placeOfBirth: string;
  documentNumber: string;
  documentType: string;
  expiryDate?: string;
  issueDate?: string;
  issuingAuthority?: string;
}

interface DocumentScanResult {
  success: boolean;
  data?: PersonalInfo;
  error?: string;
  confidence?: number;
}

interface AutoFillDocumentsProps {
  onDataExtracted: (data: PersonalInfo) => void;
  acceptedDocuments: string[];
  className?: string;
}

export function AutoFillDocuments({ 
  onDataExtracted, 
  acceptedDocuments = ["passport", "nationalId", "drivingLicense"],
  className = "" 
}: AutoFillDocumentsProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<DocumentScanResult | null>(null);
  const [manualEntry, setManualEntry] = useState({
    documentType: "passport",
    documentNumber: ""
  });

  // Simulate document scanning (in real implementation, this would use OCR)
  const simulateDocumentScan = async (documentType: string, documentNumber: string): Promise<DocumentScanResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data based on document type and number
    const mockData: Record<string, PersonalInfo> = {
      "passport": {
        firstName: "John",
        lastName: "Doe",
        middleName: "Michael",
        dateOfBirth: "1990-05-15",
        nationality: "TZ",
        gender: "M",
        placeOfBirth: "Dar es Salaam, Tanzania",
        documentNumber: documentNumber,
        documentType: "passport",
        expiryDate: "2030-05-15",
        issueDate: "2020-05-15",
        issuingAuthority: "Immigration Services Department"
      },
      "nationalId": {
        firstName: "Jane",
        lastName: "Smith",
        dateOfBirth: "1985-08-22",
        nationality: "KE",
        gender: "F",
        placeOfBirth: "Nairobi, Kenya",
        documentNumber: documentNumber,
        documentType: "nationalId",
        issueDate: "2018-08-22",
        issuingAuthority: "National Registration Bureau"
      }
    };

    // Check if document number exists in our mock database
    if (documentNumber.length >= 8) {
      return {
        success: true,
        data: mockData[documentType] || mockData["passport"],
        confidence: 0.95
      };
    } else {
      return {
        success: false,
        error: "Document not found or invalid number",
        confidence: 0.1
      };
    }
  };

  const handleDocumentScan = async () => {
    if (!manualEntry.documentNumber.trim()) {
      setScanResult({
        success: false,
        error: "Please enter a document number"
      });
      return;
    }

    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await simulateDocumentScan(manualEntry.documentType, manualEntry.documentNumber);
      setScanResult(result);
      
      if (result.success && result.data) {
        onDataExtracted(result.data);
      }
    } catch (error) {
      setScanResult({
        success: false,
        error: "Failed to scan document. Please try again."
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanResult(null);

    // Simulate OCR processing
    setTimeout(async () => {
      try {
        // In real implementation, this would send the file to an OCR service
        const result = await simulateDocumentScan("passport", "P123456789");
        setScanResult(result);
        
        if (result.success && result.data) {
          onDataExtracted(result.data);
        }
      } catch (error) {
        setScanResult({
          success: false,
          error: "Failed to process document image. Please ensure the image is clear and try again."
        });
      } finally {
        setIsScanning(false);
      }
    }, 3000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Auto-Fill from Document
        </CardTitle>
        <CardDescription>
          Scan or enter your document details to automatically fill personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <select
                  id="documentType"
                  value={manualEntry.documentType}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, documentType: e.target.value }))}
                  className="w-full mt-1 p-2 border border-input rounded-md bg-background"
                >
                  {acceptedDocuments.includes("passport") && (
                    <option value="passport">Passport</option>
                  )}
                  {acceptedDocuments.includes("nationalId") && (
                    <option value="nationalId">National ID</option>
                  )}
                  {acceptedDocuments.includes("drivingLicense") && (
                    <option value="drivingLicense">Driving License</option>
                  )}
                  {acceptedDocuments.includes("cepgl") && (
                    <option value="cepgl">CEPGL Document</option>
                  )}
                </select>
              </div>
              
              <div>
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  value={manualEntry.documentNumber}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, documentNumber: e.target.value }))}
                  placeholder="Enter document number"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleDocumentScan} 
              disabled={isScanning || !manualEntry.documentNumber.trim()}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning Document...
                </>
              ) : (
                <>
                  <Scan className="mr-2 h-4 w-4" />
                  Scan Document
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Upload Document Image</p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPG, PNG, PDF. Maximum size: 5MB
                </p>
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  disabled={isScanning}
                  className="mt-2"
                />
              </div>
            </div>
            
            {isScanning && (
              <div className="text-center py-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Processing document image...</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {scanResult && (
          <div className="mt-4">
            {scanResult.success ? (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Document scanned successfully! Personal information has been auto-filled.
                  {scanResult.confidence && (
                    <span className="block text-xs mt-1">
                      Confidence: {Math.round(scanResult.confidence * 100)}%
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {scanResult.error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-2">Supported Documents:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {acceptedDocuments.includes("passport") && (
              <li>• East African Community Passports</li>
            )}
            {acceptedDocuments.includes("nationalId") && (
              <li>• National Identity Cards</li>
            )}
            {acceptedDocuments.includes("cepgl") && (
              <li>• CEPGL Travel Documents</li>
            )}
            {acceptedDocuments.includes("drivingLicense") && (
              <li>• Driving Licenses</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility function to validate extracted data
export function validateExtractedData(data: PersonalInfo): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.firstName?.trim()) errors.push("First name is required");
  if (!data.lastName?.trim()) errors.push("Last name is required");
  if (!data.dateOfBirth) errors.push("Date of birth is required");
  if (!data.nationality) errors.push("Nationality is required");
  if (!data.documentNumber?.trim()) errors.push("Document number is required");

  // Validate date format
  if (data.dateOfBirth && isNaN(Date.parse(data.dateOfBirth))) {
    errors.push("Invalid date of birth format");
  }

  // Validate nationality code
  if (data.nationality && !getCountryInfo(data.nationality)) {
    errors.push("Invalid nationality code");
  }

  // Check document expiry
  if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
    errors.push("Document has expired");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Age calculation utility
export function calculateAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export type { PersonalInfo, DocumentScanResult };