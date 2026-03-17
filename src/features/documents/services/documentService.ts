/**
 * Document service – handles upload, retrieval and deletion of documents via
 * the Supabase Edge Function backend.
 */

export interface DocumentMeta {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedAt: string;
  url?: string;
  thumbnailUrl?: string;
  applicationRef?: string;
  uploaderEmail?: string;
  version: number;
}

export type DocumentCategory =
  | "passport-photo"
  | "birth-certificate"
  | "national-id"
  | "proof-of-residence"
  | "travel-history"
  | "visa-support"
  | "other";

export type DocumentStatus =
  | "uploading"
  | "processing"
  | "verified"
  | "rejected"
  | "pending-review";

export interface UploadResult {
  success: boolean;
  document?: DocumentMeta;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  "passport-photo": "Passport Photo",
  "birth-certificate": "Birth Certificate",
  "national-id": "National ID",
  "proof-of-residence": "Proof of Residence",
  "travel-history": "Travel History",
  "visa-support": "Visa Support Letter",
  other: "Other Document",
};

const API_BASE =
  typeof window !== "undefined"
    ? (import.meta as unknown as { env: Record<string, string> }).env
        ?.VITE_API_BASE_URL ?? "/make-server-8ee81f4f"
    : "/make-server-8ee81f4f";

// ── Validation helpers ────────────────────────────────────────────────────────

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File "${file.name}" exceeds 10 MB limit.`;
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `File type "${file.type}" is not supported. Please use PDF, JPG, PNG, WEBP, DOC, or DOCX.`;
  }
  return null;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function uploadDocument(
  file: File,
  category: DocumentCategory,
  applicationRef: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const validationError = validateFile(file);
  if (validationError) return { success: false, error: validationError };

  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("applicationRef", applicationRef);

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as { document?: DocumentMeta };
          resolve({ success: true, document: data.document });
        } catch {
          resolve({ success: false, error: "Invalid server response" });
        }
      } else {
        resolve({ success: false, error: `Upload failed (${xhr.status})` });
      }
    });

    xhr.addEventListener("error", () => {
      resolve({ success: false, error: "Network error during upload" });
    });

    xhr.open("POST", `${API_BASE}/documents/upload`);
    xhr.send(formData);
  });
}

export async function getDocuments(
  applicationRef?: string
): Promise<DocumentMeta[]> {
  try {
    const url = applicationRef
      ? `${API_BASE}/documents?applicationRef=${encodeURIComponent(applicationRef)}`
      : `${API_BASE}/documents`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = (await response.json()) as { documents?: DocumentMeta[] };
    return data.documents ?? [];
  } catch {
    return [];
  }
}

export async function deleteDocument(documentId: string): Promise<DeleteResult> {
  try {
    const response = await fetch(`${API_BASE}/documents/${documentId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: text };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Delete failed",
    };
  }
}

export async function getSignedUrl(documentId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${API_BASE}/documents/${documentId}/signed-url`
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

// ── Local document store (fallback when API is unavailable) ───────────────────

const LOCAL_DOCS_KEY = "bpms_documents";

export function getLocalDocuments(): DocumentMeta[] {
  try {
    const stored = localStorage.getItem(LOCAL_DOCS_KEY);
    return stored ? (JSON.parse(stored) as DocumentMeta[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalDocument(doc: DocumentMeta): void {
  const docs = getLocalDocuments();
  const idx = docs.findIndex((d) => d.id === doc.id);
  if (idx >= 0) {
    docs[idx] = doc;
  } else {
    docs.unshift(doc);
  }
  localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docs));
}

export function removeLocalDocument(id: string): void {
  const docs = getLocalDocuments().filter((d) => d.id !== id);
  localStorage.setItem(LOCAL_DOCS_KEY, JSON.stringify(docs));
}
