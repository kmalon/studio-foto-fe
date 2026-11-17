import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

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

/**
 * `@assets` alias target. `.env` (or process env) ASSETS_SOURCE=internal -> src/assets,
 * external -> ASSETS_DIR (relative to project root or absolute; same layout incl. altText.ts).
 */
const assetsDir = (mode: string) => {
    const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
    const source = env.ASSETS_SOURCE || 'internal'
    if (source === 'internal') return resolve(__dirname, 'src/assets')
    if (source !== 'external') throw new Error(`ASSETS_SOURCE must be 'internal' or 'external', got '${source}'`)
    if (!env.ASSETS_DIR) throw new Error('ASSETS_SOURCE=external requires ASSETS_DIR')
    const dir = resolve(__dirname, env.ASSETS_DIR)
    if (!existsSync(dir)) throw new Error(`External assets dir not found: ${dir} (ASSETS_DIR=${env.ASSETS_DIR})`)
    return dir
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const assets = assetsDir(mode)
  return {
    base: '/',
    plugins: [imageSize(), react(), imagetools()],
    resolve: { alias: { '@assets': assets } },
    // dev server may serve files from an external assets dir outside the project
    server: { fs: { allow: [__dirname, assets] } },
    ssr: {
      // CSS-importing / CJS packages must be bundled into the SSR build
      noExternal: ['react-image-gallery', /^@fontsource\//],
    },
  }
})
