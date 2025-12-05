import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Upload, 
  FileText, 
  Image, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Eye,
  Download,
  Shield,
  Clock,
  Camera,
  Scan,
  FileCheck
} from "lucide-react";
import { cn } from "./ui/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  status: 'uploading' | 'processing' | 'verified' | 'rejected' | 'completed';
  progress: number;
  uploadedAt: Date;
  qualityScore?: number;
  issues?: string[];
  url?: string;
}

export function DocumentUpload() {
  const [applicationRef, setApplicationRef] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    {
      id: 'passport-photo',
      title: 'Passport Photo',
      description: 'Professional passport-style photograph',
      maxSize: 5,
      formats: ['.jpg', '.jpeg', '.png'],
      requirements: [
        'White or light blue background',
        'Face clearly visible',
        'No glasses or headwear',
        'Minimum 600x600 pixels',
        'Maximum 2MB file size'
      ],
      example: '/examples/passport-photo.jpg'
    },
    {
      id: 'identity-document',
      title: 'Identity Document',
      description: 'National ID, birth certificate, or similar',
      maxSize: 10,
      formats: ['.jpg', '.jpeg', '.png', '.pdf'],
      requirements: [
        'Clear, high-resolution scan',
        'All corners visible',
        'Text clearly readable',
        'No shadows or glare',
        'Color scan preferred'
      ],
      example: '/examples/id-document.jpg'
    },
    {
      id: 'supporting-documents',
      title: 'Supporting Documents',
      description: 'Marriage certificate, work permit, etc.',
      maxSize: 10,
      formats: ['.jpg', '.jpeg', '.png', '.pdf'],
      requirements: [
        'Official government documents',
        'Clear and legible',
        'Recent issuance (within 6 months)',
        'Certified copies accepted'
      ],
      example: '/examples/supporting-doc.pdf'
    },
    {
      id: 'financial-proof',
      title: 'Financial Proof',
      description: 'Bank statements, sponsor letters',
      maxSize: 15,
      formats: ['.jpg', '.jpeg', '.png', '.pdf'],
      requirements: [
        'Recent bank statements (last 3 months)',
        'Official letterhead',
        'Clear account information',
        'Sufficient funds evidence'
      ],
      example: '/examples/bank-statement.pdf'
    }
  ];

  const qualityChecks = [
    { name: 'File Format', description: 'Acceptable file type' },
    { name: 'File Size', description: 'Within size limits' },
    { name: 'Resolution', description: 'Minimum pixel requirements' },
    { name: 'Brightness', description: 'Proper lighting and exposure' },
    { name: 'Focus', description: 'Sharp and clear image' },
    { name: 'Content Detection', description: 'Required elements present' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        category: 'uncategorized',
        status: 'uploading',
        progress: 0,
        uploadedAt: new Date()
      };

      setUploadedFiles(prev => [...prev, newFile]);
      simulateUpload(fileId, file);
    });
  };

  const simulateUpload = (fileId: string, file: File) => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          const newProgress = Math.min(f.progress + Math.random() * 20, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            setTimeout(() => simulateProcessing(fileId), 500);
            return { ...f, progress: newProgress, status: 'processing' };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 300);
  };

  const simulateProcessing = (fileId: string) => {
    setTimeout(() => {
      const qualityScore = Math.floor(Math.random() * 30) + 70; // 70-100
      const issues = [];
      
      if (qualityScore < 80) {
        issues.push('Image resolution could be improved');
      }
      if (qualityScore < 75) {
        issues.push('Lighting conditions not optimal');
      }

      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          return {
            ...f,
            status: qualityScore >= 75 ? 'verified' : 'rejected',
            qualityScore,
            issues: issues.length > 0 ? issues : undefined,
            url: `/uploads/${f.name}`
          };
        }
        return f;
      }));
    }, 2000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileCategory = (fileId: string, category: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, category } : f
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'uploading':
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'uploading':
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const allDocumentsVerified = uploadedFiles.length > 0 && 
    uploadedFiles.every(f => f.status === 'verified');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Document Upload Center</h1>
        <p className="text-muted-foreground">
          Upload and verify your documents with automated quality checks and secure storage
        </p>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Application Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Application Reference</CardTitle>
              <CardDescription>
                Enter your application reference number to link uploaded documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="applicationRef">Reference Number</Label>
                  <Input
                    id="applicationRef"
                    placeholder="e.g., PA2024001234"
                    value={applicationRef}
                    onChange={(e) => setApplicationRef(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline">Verify Reference</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Drag and drop files or click to browse. Files are automatically scanned for quality and compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <h4>Upload Documents</h4>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop files here, or click to select files
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                    >
                      Choose Files
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, PDF • Max size: 15MB per file
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents ({uploadedFiles.length})</CardTitle>
                <CardDescription>
                  Review your uploaded files and their verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-muted-foreground">
                            {file.type.includes('image') ? <Image className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatFileSize(file.size)} • {file.uploadedAt.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(file.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(file.status)}
                              <span>{file.status}</span>
                            </div>
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {(file.status === 'uploading' || file.status === 'processing') && (
                        <div className="mb-3">
                          <Progress value={file.progress} className="h-2" />
                          <div className="text-xs text-muted-foreground mt-1">
                            {file.status === 'uploading' ? 'Uploading...' : 'Processing and verifying...'}
                          </div>
                        </div>
                      )}

                      {/* Category Selection */}
                      <div className="mb-3">
                        <Label className="text-sm">Document Category</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {documentCategories.map((category) => (
                            <Button
                              key={category.id}
                              variant={file.category === category.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => updateFileCategory(file.id, category.id)}
                            >
                              {category.title}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Quality Score */}
                      {file.qualityScore && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Quality Score</span>
                            <span className={cn(
                              "text-sm font-medium",
                              file.qualityScore >= 90 ? "text-green-600" :
                              file.qualityScore >= 75 ? "text-yellow-600" : "text-red-600"
                            )}>
                              {file.qualityScore}%
                            </span>
                          </div>
                          <Progress value={file.qualityScore} />
                        </div>
                      )}

                      {/* Issues */}
                      {file.issues && file.issues.length > 0 && (
                        <Alert className="mb-3">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-1">
                              <div className="font-medium">Quality Issues Detected:</div>
                              <ul className="text-sm space-y-1">
                                {file.issues.map((issue, index) => (
                                  <li key={index}>• {issue}</li>
                                ))}
                              </ul>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Actions */}
                      {file.status === 'verified' && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {allDocumentsVerified && (
                  <Alert className="mt-4">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All documents have been successfully verified and uploaded. Your application 
                      will proceed to the next stage of processing.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quality Checks Info */}
          <Card>
            <CardHeader>
              <CardTitle>Automated Quality Checks</CardTitle>
              <CardDescription>
                All uploaded documents undergo automated verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {qualityChecks.map((check, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="text-primary">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{check.name}</div>
                      <div className="text-xs text-muted-foreground">{check.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Technical Requirements:</div>
                    <div className="text-sm space-y-1">
                      <div>• Max file size: {category.maxSize}MB</div>
                      <div>• Formats: {category.formats.join(', ')}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Quality Requirements:</div>
                    <ul className="text-sm space-y-1">
                      {category.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    View Example
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <FileCheck className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tips:</strong> Use good lighting when scanning documents. Avoid shadows and ensure 
              all text is clearly readable. For photos, use a plain white or light blue background. 
              High-quality uploads process faster and reduce the need for resubmission.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Measures</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Encryption in Transit</span>
                  <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Encryption at Rest</span>
                  <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Access Control</span>
                  <Badge className="bg-green-100 text-green-800">RBAC</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Audit Logging</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Data Integrity</span>
                  <Badge className="bg-green-100 text-green-800">Checksums</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Data Residency</span>
                  <Badge className="bg-blue-100 text-blue-800">Rwanda</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Retention Policy</span>
                  <Badge className="bg-blue-100 text-blue-800">7 Years</Badge>
                </div>
                <div className="flex justify-between">
                  <span>GDPR Compliance</span>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Right to Erasure</span>
                  <Badge className="bg-green-100 text-green-800">Supported</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Consent Management</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing & Storage</CardTitle>
              <CardDescription>
                How your documents are processed and stored securely
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Upload className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                    <h4 className="font-medium">1. Upload</h4>
                    <p className="text-sm text-muted-foreground">Encrypted transmission to secure servers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Scan className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                    <h4 className="font-medium">2. Scan & Verify</h4>
                    <p className="text-sm text-muted-foreground">Automated quality and security checks</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="h-8 w-8 mx-auto text-green-600 mb-2" />
                    <h4 className="font-medium">3. Secure Storage</h4>
                    <p className="text-sm text-muted-foreground">Encrypted storage with access controls</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <h4 className="font-medium">Security Guarantees:</h4>
                  <ul className="space-y-1">
                    <li>• All files are encrypted with industry-standard AES-256 encryption</li>
                    <li>• Access is restricted to authorized personnel only</li>
                    <li>• All file operations are logged and audited</li>
                    <li>• Data is backed up and stored redundantly</li>
                    <li>• Files are automatically deleted after retention period</li>
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