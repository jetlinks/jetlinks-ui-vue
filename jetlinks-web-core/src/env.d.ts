/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_BASE_API: string;
  readonly VITE_APP_DEV_PROXY_URL: string;
  readonly VITE_PORT: number;
  readonly tagName: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
