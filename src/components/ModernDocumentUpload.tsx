import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  File, 
  CheckCircle, 
  X,
  AlertCircle,
  Info,
  Camera,
  Paperclip
} from "lucide-react";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import { toast } from "sonner@2.0.3";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export function ModernDocumentUpload() {
  const { t } = useTranslationWithParams();
  const [reference, setReference] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index + '',
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));

      if (progress >= 100) {
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === fileId ? { ...f, status: 'completed' } : f
        ));
        toast.success('File uploaded successfully!');
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-8 w-8" />;
    if (type === 'application/pdf') return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const requiredDocuments = [
    { 
      id: 'passport-photo', 
      name: 'Passport Photo', 
      description: 'Recent photo, white background', 
      required: true,
      icon: '📸',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'id-document', 
      name: 'National ID or Birth Certificate', 
      description: 'Clear copy, all corners visible', 
      required: true,
      icon: '🪪',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'proof-address', 
      name: 'Proof of Address', 
      description: 'Utility bill or bank statement', 
      required: true,
      icon: '🏠',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'supporting-docs', 
      name: 'Supporting Documents', 
      description: 'Any additional required documents', 
      required: false,
      icon: '📄',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-blue-lightest dark:bg-[#0a0a0a] py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-navy-dark dark:text-white">
                {t('documents.upload', {}, 'Upload Documents')}
              </h1>
              <p className="text-sm text-navy-medium/60 dark:text-white/60">
                {t('documents.uploadDesc', {}, 'Submit your required documents securely')}
              </p>
            </div>
          </div>

          <Alert className="mt-4 border-blue-medium/20 bg-blue-medium/5 dark:bg-blue-500/5">
            <Info className="h-4 w-4 text-blue-medium dark:text-blue-400" />
            <AlertDescription className="text-sm text-navy-dark dark:text-white">
              <strong>Requirements:</strong> Files must be in PDF, JPG, or PNG format. Maximum file size: 5MB per file.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* Reference Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
            <Label htmlFor="reference" className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4" />
              Application Reference Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., RW-PASS-2024-001234"
              className="h-12 text-base"
            />
            <p className="text-xs text-navy-medium/60 dark:text-white/60 mt-2">
              Enter your application reference number to link these documents
            </p>
          </Card>
        </motion.div>

        {/* Required Documents Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-lg font-medium text-navy-dark dark:text-white mb-4">
            Required Documents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="p-4 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]"
              >
                <div className="flex items-start gap-3">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {doc.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-medium text-navy-dark dark:text-white text-sm">
                        {doc.name}
                      </h3>
                      {doc.required && (
                        <Badge variant="outline" className="text-xs border-red-500/20 text-red-600">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-navy-medium/60 dark:text-white/60">
                      {doc.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className={`p-8 border-2 border-dashed transition-all cursor-pointer ${
              dragActive 
                ? 'border-navy-medium dark:border-blue-500 bg-navy-medium/5 dark:bg-blue-500/5' 
                : 'border-navy-medium/20 dark:border-white/10 hover:border-navy-medium/40'
            } bg-white dark:bg-[#1E1E1E]`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={{ y: dragActive ? -10 : 0 }}
                  className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4"
                >
                  <Upload className="h-10 w-10 text-white" />
                </motion.div>
                
                <h3 className="text-lg font-medium text-navy-dark dark:text-white mb-2">
                  {dragActive ? 'Drop files here' : 'Drag & drop files here'}
                </h3>
                
                <p className="text-sm text-navy-medium/60 dark:text-white/60 mb-4">
                  or click to browse from your device
                </p>
                
                <div className="flex items-center gap-2 text-xs text-navy-medium/60 dark:text-white/60">
                  <Badge variant="outline" className="border-navy-medium/20">
                    PDF
                  </Badge>
                  <Badge variant="outline" className="border-navy-medium/20">
                    JPG
                  </Badge>
                  <Badge variant="outline" className="border-navy-medium/20">
                    PNG
                  </Badge>
                  <span>• Max 5MB</span>
                </div>
              </div>
            </label>
          </Card>
        </motion.div>

        {/* Uploaded Files */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-lg font-medium text-navy-dark dark:text-white mb-4">
              Uploaded Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file) => (
                <Card
                  key={file.id}
                  className="p-4 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]"
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      file.status === 'completed' 
                        ? 'bg-green-500/10 text-green-600' 
                        : file.status === 'error'
                        ? 'bg-red-500/10 text-red-600'
                        : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      {file.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : file.status === 'error' ? (
                        <AlertCircle className="h-6 w-6" />
                      ) : (
                        getFileIcon(file.type)
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm text-navy-dark dark:text-white truncate">
                            {file.name}
                          </h4>
                          <p className="text-xs text-navy-medium/60 dark:text-white/60">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {file.status === 'uploading' && (
                        <div className="space-y-1">
                          <Progress value={file.progress} className="h-1.5" />
                          <p className="text-xs text-navy-medium/60 dark:text-white/60">
                            Uploading... {file.progress}%
                          </p>
                        </div>
                      )}

                      {file.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 border-0 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <Button
              disabled={!reference || files.some(f => f.status === 'uploading')}
              className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-base"
              onClick={() => {
                toast.success('Documents submitted successfully!', {
                  description: 'We\'ll review your documents within 24 hours'
                });
              }}
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Submit Documents
            </Button>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="p-6 bg-blue-lightest dark:bg-[#1a2a3a] border-navy-medium/10">
            <h3 className="font-medium text-navy-dark dark:text-white mb-3 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Tips for Better Quality
            </h3>
            <ul className="space-y-2 text-sm text-navy-medium/80 dark:text-white/70">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Ensure documents are well-lit and all text is clearly readable
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                All four corners of the document should be visible
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Photos should have a plain white or light background
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Avoid glare, shadows, or blurry images
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
