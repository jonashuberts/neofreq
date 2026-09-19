import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const targetServer = env.VITE_FREQTRADE_URL || 'http://localhost:8080';

  return {
    base: './',
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_BUILD_TIMESTAMP__: Date.now(),
      __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    server: {
      host: true,
      port: 5173,
      allowedHosts: true,
      proxy: {
        // Proxy requests from /api to the Freqtrade server to eliminate any CORS or mixed-content issues
        '/api': {
          target: targetServer,
          changeOrigin: true,
          secure: false,
          headers: env.VITE_FREQTRADE_USER && env.VITE_FREQTRADE_PASSWORD ? {
            Authorization: `Basic ${Buffer.from(`${env.VITE_FREQTRADE_USER}:${env.VITE_FREQTRADE_PASSWORD}`).toString('base64')}`
          } : undefined
        }
      }
    }
  };
});
