import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
  },
  test: { environment: 'happy-dom', setupFiles: ['./src/tests-setup.ts'] },
});
