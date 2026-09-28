import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

const isHttps = process.env.HTTPS === 'true' || process.env.VITE_HTTPS === 'true' || process.argv.includes('--https');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(isHttps ? [basicSsl()] : [])
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      '.replit.dev',
      '.replit.app',
      '.repl.co',
      process.env.REPLIT_DEV_DOMAIN
    ].filter(Boolean)
  }
});
