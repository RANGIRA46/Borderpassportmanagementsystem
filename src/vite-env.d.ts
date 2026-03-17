/// <reference types="vite/client" />

// Fallback augmentation when vite package is not installed locally
interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
