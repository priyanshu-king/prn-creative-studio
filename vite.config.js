import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages hosts this project under /prn-creative-studio/.
  // Local development and other hosts keep the root path.
  base: process.env.GITHUB_PAGES === 'true' ? '/prn-creative-studio/' : '/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/fabric'))    return 'vendor-fabric';
          if (id.includes('node_modules/jspdf'))     return 'vendor-jspdf';
          if (id.includes('node_modules/zustand'))   return 'vendor-zustand';
          if (id.includes('node_modules/react-dom')) return 'vendor-react';
          if (id.includes('node_modules/react-router-dom')) return 'vendor-router';
        },
      },
    },
  },
})
