/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL_API: string;
  readonly MODE: 'development' | 'production' | 'test';
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
