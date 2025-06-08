import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: path.resolve(__dirname, '../../tooling/postcss-config')
  },
  resolve: {
    alias: {
      '@xyflow/vue': path.resolve(__dirname, '../../packages/vue/src'),
    }
  },
  server: {
    fs: {
      allow: ['../..']
    }
  }
})