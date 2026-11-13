import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'

// https://vite.dev/config/
export default defineConfig({
  base: '/studio-foto-fe/',
  plugins: [react(), imagetools()],
  ssr: {
    // CSS-importing / CJS packages must be bundled into the SSR build
    noExternal: ['react-image-gallery', /^@fontsource\//],
  },
})
