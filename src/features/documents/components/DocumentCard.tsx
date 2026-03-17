import { useState } from "react";
import {
  FileText,
  Image,
  Download,
  Trash2,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  DocumentMeta,
  DocumentStatus,
  DOCUMENT_CATEGORY_LABELS,
  deleteDocument,
  removeLocalDocument,
  getSignedUrl,
} from "../services/documentService";

interface DocumentCardProps {
  document: DocumentMeta;
  onDeleted?: (id: string) => void;
  onPreview?: (doc: DocumentMeta) => void;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; color: string; Icon: React.ElementType }
> = {
  uploading: {
    label: "Uploading",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    Icon: Clock,
  },
  verified: {
    label: "Verified",
    color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    Icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    Icon: AlertCircle,
  },
  "pending-review": {
    label: "Pending Review",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    Icon: Clock,
  },
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function DocumentCard({ document: doc, onDeleted, onPreview }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const statusCfg = STATUS_CONFIG[doc.status];

  const handleDelete = async () => {
    if (!confirm(`Delete "${doc.originalName}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    await deleteDocument(doc.id);
    removeLocalDocument(doc.id);
    onDeleted?.(doc.id);
    setIsDeleting(false);
  };

  const handleDownload = async () => {
    const url = doc.url ?? (await getSignedUrl(doc.id));
    if (url) {
      const a = window.document.createElement("a");
      a.href = url;
      a.download = doc.originalName;
      a.click();
    }
  };

  const isImage = doc.mimeType.startsWith("image/");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="group relative flex gap-3 p-4 rounded-xl border dark:border-white/10 bg-white dark:bg-[#1a1a1a] hover:shadow-md transition-shadow"
    >
      {/* File type icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        {isImage ? (
          <Image className="h-5 w-5 text-blue-500" />
        ) : (
          <FileText className="h-5 w-5 text-orange-500" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium dark:text-white truncate">
              {doc.originalName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {DOCUMENT_CATEGORY_LABELS[doc.category]} · {formatBytes(doc.size)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Uploaded {formatDate(doc.uploadedAt)}
              {doc.version > 1 && (
                <span className="ml-2 text-gray-400">v{doc.version}</span>
              )}
            </p>
          </div>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isDeleting}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onPreview && (
                <DropdownMenuItem onClick={() => onPreview(doc)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status badge */}
        <div className="mt-2">
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.color}`}
          >
            <statusCfg.Icon className="h-3 w-3" />
            {statusCfg.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
