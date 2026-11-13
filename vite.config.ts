import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import sharp from 'sharp'

/**
 * `import size from './photo.webp?size'` -> `{ width, height }` read from the file header
 * at build time (no image emitted). Lets the masonry lay photos out during prerender.
 */
const imageSize = (): Plugin => ({
    name: 'image-size',
    enforce: 'pre',
    async load(id) {
        const [file, query] = id.split('?')
        if (query !== 'size') return null
        this.addWatchFile(file)
        const { width, height, orientation } = await sharp(file).metadata()
        // EXIF orientation 5-8 = rotated 90° -> browsers swap the displayed dimensions
        const rotated = (orientation ?? 1) >= 5
        const size = rotated ? { width: height, height: width } : { width, height }
        return `export default ${JSON.stringify(size)}`
    },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/studio-foto-fe/',
  plugins: [imageSize(), react(), imagetools()],
  ssr: {
    // CSS-importing / CJS packages must be bundled into the SSR build
    noExternal: ['react-image-gallery', /^@fontsource\//],
  },
})
