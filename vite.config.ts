import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import favicons from '@peterek/vite-plugin-favicons'

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    favicons('logo.png', {
      appName: "Folke Online - Proof editor",
      appShortName: "Folke",
      appDescription: "An interactive proof editor for propositional and first-order logic",
      developerName: "TheCoder5550 and the Folke team",
      developerURL: "https://github.com/TheCoder5550/folke-online"
    })
  ],
  
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        editor: resolve(__dirname, 'editor/index.html'),
        exercises: resolve(__dirname, 'exercises/index.html'),
        guide: resolve(__dirname, 'guide/index.html'),
      },
    },
  },
})
