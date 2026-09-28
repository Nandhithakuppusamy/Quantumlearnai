import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
