import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration combinée pour Vite et Vitest
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
