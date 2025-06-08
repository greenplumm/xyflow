import * as path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@xyflow/vue': path.resolve(__dirname, 'src')
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
      name: 'XyflowVue',
      fileName: (format) => `xyflow-vue.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});