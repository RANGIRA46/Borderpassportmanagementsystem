import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DocumentMeta, getSignedUrl } from "../services/documentService";

interface DocumentViewerProps {
  documents: DocumentMeta[];
  initialIndex?: number;
  onClose: () => void;
}

export function DocumentViewer({
  documents,
  initialIndex = 0,
  onClose,
}: DocumentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const current = documents[currentIndex];

  // Resolve URL (from stored url or signed URL)
  useEffect(() => {
    if (!current) return;
    setResolvedUrl(null);
    setIsLoading(true);
    if (current.url) {
      setResolvedUrl(current.url);
      setIsLoading(false);
      return;
    }
    getSignedUrl(current.id).then((url) => {
      setResolvedUrl(url);
      setIsLoading(false);
    });
  }, [current]);

  // Reset view state when navigating
  useEffect(() => {
    setZoom(1);
    setRotation(0);
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  });

  function navigate(dir: -1 | 1) {
    setCurrentIndex((i) => {
      const next = i + dir;
      if (next < 0 || next >= documents.length) return i;
      return next;
    });
  }

  function handleDownload() {
    if (!resolvedUrl) return;
    const a = document.createElement("a");
    a.href = resolvedUrl;
    a.download = current.originalName;
    a.click();
  }

  function handlePrint() {
    if (!resolvedUrl) return;
    const win = window.open(resolvedUrl, "_blank");
    win?.print();
  }

  const isImage = current?.mimeType?.startsWith("image/");
  const isPdf = current?.mimeType === "application/pdf";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[9998] flex flex-col bg-black/95 ${
        isFullscreen ? "" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Document viewer"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="h-4 w-4 text-white/70 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {current?.originalName}
            </p>
            {documents.length > 1 && (
              <p className="text-xs text-white/50">
                {currentIndex + 1} of {documents.length}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-white/50 w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          {isImage && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              title="Rotate"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setIsFullscreen((f) => !f)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handlePrint}
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleDownload}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onClose}
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Navigation arrows */}
        {documents.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => navigate(-1)}
              className="absolute left-4 z-10 h-10 w-10 p-0 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIndex === documents.length - 1}
              onClick={() => navigate(1)}
              className="absolute right-4 z-10 h-10 w-10 p-0 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {isLoading && (
          <div className="text-white/50 text-sm">Loading…</div>
        )}

        {!isLoading && !resolvedUrl && (
          <div className="flex flex-col items-center gap-3 text-white/50">
            <FileText className="h-16 w-16" />
            <p className="text-sm">Preview not available</p>
          </div>
        )}

        {!isLoading && resolvedUrl && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center w-full h-full overflow-auto p-4"
            >
              {isImage ? (
                <img
                  src={resolvedUrl}
                  alt={current.originalName}
                  className="max-w-full max-h-full object-contain select-none"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.2s ease",
                  }}
                  draggable={false}
                />
              ) : isPdf ? (
                <iframe
                  src={`${resolvedUrl}#toolbar=1`}
                  className="w-full h-full rounded"
                  title={current.originalName}
                  style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-white/70">
                  <FileText className="h-20 w-20" />
                  <p className="text-sm">{current.originalName}</p>
                  <Button onClick={handleDownload} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download to view
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Thumbnail strip */}
      {documents.length > 1 && (
        <div className="flex gap-2 px-4 py-3 bg-black/80 overflow-x-auto flex-shrink-0">
          {documents.map((doc, i) => (
            <button
              key={doc.id}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 h-12 w-12 rounded-md border-2 flex items-center justify-center transition-all ${
                i === currentIndex
                  ? "border-primary bg-primary/20"
                  : "border-white/20 bg-white/10 hover:border-white/40"
              }`}
            >
              {doc.mimeType.startsWith("image/") && doc.url ? (
                <img
                  src={doc.url}
                  alt={doc.originalName}
                  className="h-full w-full object-cover rounded"
                />
              ) : (
                <FileText className="h-5 w-5 text-white/70" />
              )}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
