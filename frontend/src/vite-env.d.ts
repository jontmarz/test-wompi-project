interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WOMPI_PUBLIC_KEY_TEST: string
  readonly VITE_WOMPI_PUBLIC_KEY_PROD: string
  readonly VITE_WOMPI_INTEGRITY_KEY_PROD: string
  readonly VITE_WOMPI_INTEGRITY_KEY_TEST: string
  readonly VITE_ENVIRONMENT: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
