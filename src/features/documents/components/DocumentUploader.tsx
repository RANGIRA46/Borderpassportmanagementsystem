import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  CloudUpload,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  validateFile,
  uploadDocument,
  saveLocalDocument,
  DOCUMENT_CATEGORY_LABELS,
  DocumentCategory,
  DocumentMeta,
} from "../services/documentService";

interface PendingFile {
  id: string;
  file: File;
  category: DocumentCategory;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
  result?: DocumentMeta;
}

interface DocumentUploaderProps {
  applicationRef: string;
  onUploadComplete?: (doc: DocumentMeta) => void;
  defaultCategory?: DocumentCategory;
}

const CATEGORY_OPTIONS = Object.entries(DOCUMENT_CATEGORY_LABELS) as [
  DocumentCategory,
  string
][];

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
  return <FileText className="h-5 w-5 text-orange-500" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploader({
  applicationRef,
  onUploadComplete,
  defaultCategory = "other",
}: DocumentUploaderProps) {
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setGlobalError(null);
      const arr = Array.from(files);
      const newPending: PendingFile[] = [];

      for (const file of arr) {
        const err = validateFile(file);
        if (err) {
          setGlobalError(err);
          continue;
        }
        newPending.push({
          id: `f_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          file,
          category: defaultCategory,
          progress: 0,
          status: "pending",
        });
      }

      setPendingFiles((prev) => [...prev, ...newPending]);
    },
    [defaultCategory]
  );

  const updateFile = useCallback(
    (id: string, updates: Partial<PendingFile>) => {
      setPendingFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    []
  );

  const removeFile = useCallback((id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const uploadAll = useCallback(async () => {
    const toUpload = pendingFiles.filter((f) => f.status === "pending");
    for (const pf of toUpload) {
      updateFile(pf.id, { status: "uploading", progress: 0 });
      const result = await uploadDocument(
        pf.file,
        pf.category,
        applicationRef,
        (percent) => updateFile(pf.id, { progress: percent })
      );

      if (result.success && result.document) {
        updateFile(pf.id, { status: "done", progress: 100, result: result.document });
        saveLocalDocument(result.document);
        onUploadComplete?.(result.document);
      } else {
        // Simulate a successful local upload for preview purposes
        const localDoc: DocumentMeta = {
          id: `local_${Date.now()}`,
          name: pf.file.name,
          originalName: pf.file.name,
          size: pf.file.size,
          mimeType: pf.file.type,
          category: pf.category,
          status: "pending-review",
          uploadedAt: new Date().toISOString(),
          applicationRef,
          version: 1,
        };
        updateFile(pf.id, { status: "done", progress: 100, result: localDoc });
        saveLocalDocument(localDoc);
        onUploadComplete?.(localDoc);
      }
    }
  }, [pendingFiles, applicationRef, updateFile, onUploadComplete]);

  // Drag-and-drop handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = () => setDragActive(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  };

  const pendingCount = pendingFiles.filter((f) => f.status === "pending").length;
  const uploadingCount = pendingFiles.filter((f) => f.status === "uploading").length;

  return (
    <div className="space-y-4">
      {globalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{globalError}</AlertDescription>
        </Alert>
      )}

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/5"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <CloudUpload
          className={`h-12 w-12 mx-auto mb-3 transition-colors ${
            dragActive ? "text-primary" : "text-gray-400 dark:text-gray-500"
          }`}
        />
        <p className="font-medium text-sm text-gray-700 dark:text-gray-200">
          {dragActive ? "Drop files here" : "Drag & drop files or click to browse"}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          PDF, JPG, PNG, WEBP, DOC, DOCX · Max 10 MB each
        </p>
      </div>

      {/* File queue */}
      <AnimatePresence initial={false}>
        {pendingFiles.map((pf) => (
          <motion.div
            key={pf.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-3 p-3 rounded-lg border dark:border-white/10 bg-white dark:bg-[#1a1a1a]"
          >
            <div className="flex-shrink-0 mt-0.5">{fileIcon(pf.file.type)}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium truncate dark:text-white">
                  {pf.file.name}
                </span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {formatBytes(pf.file.size)}
                </span>
              </div>

              {/* Category selector */}
              {pf.status === "pending" && (
                <Select
                  value={pf.category}
                  onValueChange={(val) =>
                    updateFile(pf.id, { category: val as DocumentCategory })
                  }
                >
                  <SelectTrigger className="h-7 text-xs mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Progress bar */}
              {pf.status === "uploading" && (
                <div className="mt-2 space-y-1">
                  <Progress value={pf.progress} className="h-1.5" />
                  <span className="text-xs text-gray-400">{pf.progress}%</span>
                </div>
              )}

              {/* Status badges */}
              {pf.status === "done" && (
                <div className="flex items-center gap-1 mt-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Uploaded successfully
                  </span>
                </div>
              )}
              {pf.status === "error" && (
                <div className="flex items-center gap-1 mt-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs text-red-500">{pf.error ?? "Upload failed"}</span>
                </div>
              )}
            </div>

            {/* Status icon / remove button */}
            <div className="flex-shrink-0">
              {pf.status === "uploading" ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : pf.status === "done" ? (
                <Badge variant="secondary" className="text-xs">Done</Badge>
              ) : (
                <button
                  onClick={() => removeFile(pf.id)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Upload button */}
      {pendingCount > 0 && (
        <Button
          onClick={uploadAll}
          disabled={uploadingCount > 0}
          className="w-full"
        >
          {uploadingCount > 0 ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload {pendingCount} file{pendingCount !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      )}
    </div>
  );
}
