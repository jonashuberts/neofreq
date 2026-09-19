/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FREQTRADE_URL?: string;
  readonly VITE_FREQTRADE_LAN_URL?: string;
  readonly VITE_FREQTRADE_USER?: string;
  readonly VITE_FREQTRADE_PASSWORD?: string;
  readonly VITE_POLL_INTERVAL?: string;
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
declare const __APP_BUILD_TIME__: string;
