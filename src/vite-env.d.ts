/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_MODE: 'synthetic' | 'open'
  readonly VITE_FRED_API_KEY?: string
  readonly VITE_CUSTOM_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
