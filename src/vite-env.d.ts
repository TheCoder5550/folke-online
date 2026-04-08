/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_SUPPORT_MAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}