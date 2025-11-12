import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: set your repo name here, exactly as in GitHub
  base: '/puzzle/',
  build: { outDir: 'docs' }
})
