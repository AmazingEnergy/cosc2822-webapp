import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      // Remove the 'crypto-js' from 'external' to allow it to be bundled correctly
      external: [],
    },
  },
});
