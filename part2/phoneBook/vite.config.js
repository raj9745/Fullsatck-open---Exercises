import { defineConfig } from 'vite';
export default defineConfig({
  // other config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});