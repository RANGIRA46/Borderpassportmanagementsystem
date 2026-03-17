import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FolderOpen,
  Search,
  Filter,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { DocumentUploader } from "../components/DocumentUploader";
import { DocumentCard } from "../components/DocumentCard";
import { DocumentViewer } from "../components/DocumentViewer";
import {
  DocumentMeta,
  DocumentCategory,
  DOCUMENT_CATEGORY_LABELS,
  getDocuments,
  getLocalDocuments,
} from "../services/documentService";

interface DocumentsPageProps {
  applicationRef?: string;
}

export function DocumentsPage({ applicationRef = "GENERAL" }: DocumentsPageProps) {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "all">("all");
  const [viewerDocs, setViewerDocs] = useState<DocumentMeta[] | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDocuments = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);

    // Try API first, fall back to local storage
    const remote = await getDocuments(applicationRef);
    if (remote.length > 0) {
      setDocuments(remote);
    } else {
      setDocuments(getLocalDocuments());
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadDocuments();
  }, [applicationRef]);

  const handleUploadComplete = (doc: DocumentMeta) => {
    setDocuments((prev) => {
      const existing = prev.findIndex((d) => d.id === doc.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = doc;
        return updated;
      }
      return [doc, ...prev];
    });
  };

  const handleDeleted = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handlePreview = (doc: DocumentMeta) => {
    const previewable = filteredDocuments.filter(
      (d) => d.mimeType.startsWith("image/") || d.mimeType === "application/pdf"
    );
    const idx = previewable.findIndex((d) => d.id === doc.id);
    setViewerDocs(previewable.length > 0 ? previewable : [doc]);
    setViewerIndex(idx >= 0 ? idx : 0);
  };

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      !searchQuery ||
      doc.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      DOCUMENT_CATEGORY_LABELS[doc.category]
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryCounts = documents.reduce<Record<string, number>>(
    (acc, doc) => ({ ...acc, [doc.category]: (acc[doc.category] ?? 0) + 1 }),
    {}
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">My Documents</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your uploaded documents for application{" "}
            <span className="font-medium">{applicationRef}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadDocuments(true)}
          disabled={isRefreshing}
          aria-label="Refresh"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <Tabs defaultValue="my-docs">
        <TabsList>
          <TabsTrigger value="my-docs">
            <FolderOpen className="h-4 w-4 mr-2" />
            My Documents
            <Badge variant="secondary" className="ml-2 text-xs">
              {documents.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload New
          </TabsTrigger>
        </TabsList>

        {/* Documents list tab */}
        <TabsContent value="my-docs" className="space-y-4 mt-4">
          {/* Search & filter */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as DocumentCategory | "all")}
            >
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                    {categoryCounts[val] ? (
                      <span className="ml-1 text-gray-400">
                        ({categoryCounts[val]})
                      </span>
                    ) : null}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Document grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredDocuments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="font-medium text-gray-500 dark:text-gray-400">
                    {searchQuery || categoryFilter !== "all"
                      ? "No matching documents"
                      : "No documents uploaded yet"}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {searchQuery || categoryFilter !== "all"
                      ? "Try adjusting your search or filter"
                      : "Upload your first document using the Upload tab"}
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredDocuments.map((doc) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onDeleted={handleDeleted}
                      onPreview={handlePreview}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </TabsContent>

        {/* Upload tab */}
        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUploader
                applicationRef={applicationRef}
                onUploadComplete={handleUploadComplete}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document viewer overlay */}
      <AnimatePresence>
        {viewerDocs && (
          <DocumentViewer
            documents={viewerDocs}
            initialIndex={viewerIndex}
            onClose={() => setViewerDocs(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
