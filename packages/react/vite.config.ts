import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@xyflow/react': path.resolve(__dirname, 'src')
    }
  },
  server: {
    fs: {
      allow: ['../..'],
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'XyflowReact',
      fileName: (format) => `xyflow-react.${format}.js`
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          vue: 'React'
        }
      }
    }
  }
});