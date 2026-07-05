import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@ceo-os/database', '@ceo-os/shared', '@ceo-os/ai']
      })
    ],
    build: {
      rollupOptions: {
        external: ['sql.js', 'electron-updater']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [
      react(),
      {
        name: 'remove-crossorigin',
        transformIndexHtml(html) {
          return html.replace(/crossorigin/g, '')
        }
      }
    ],
    base: './',
    build: {
      modulePreload: false
    },
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      },
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client']
    }
  }
})
