import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { imagetools } from 'vite-imagetools'
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

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

type BuildInfo = { site: string; assets: string; assetsSource: string; built: string }

/** `git rev-parse HEAD` in `cwd`, or '' when not a git repo / git missing. */
const gitSha = (cwd: string) => {
    try {
        return execFileSync('git', ['rev-parse', 'HEAD'], { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    } catch {
        return ''
    }
}

/**
 * Site + assets commit SHAs. CI passes BUILD_SHA / ASSETS_SHA (deploy.yml); locally read from git.
 * Internal assets live in this repo -> assets sha = site sha.
 */
const buildInfo = (mode: string, assets: string): BuildInfo => {
    const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
    const assetsSource = env.ASSETS_SOURCE || 'internal'
    const site = env.BUILD_SHA || gitSha(__dirname) || 'unknown'
    const assetsSha =
        env.ASSETS_SHA || (assetsSource === 'internal' ? site : gitSha(assets)) || 'unknown'
    return { site, assets: assetsSha, assetsSource, built: new Date().toISOString() }
}

/**
 * Hidden build info: `<meta name="build">` in index.html (outside the prerender head markers,
 * so every prerendered page keeps it) + `/version.json` (client build only).
 */
const buildInfoPlugin = (info: BuildInfo): Plugin => {
  let ssr = false
  return {
    name: 'build-info',
    configResolved(config) {
        ssr = !!config.build.ssr
    },
    transformIndexHtml(html) {
        const meta = `<meta name="build" content="site=${info.site} assets=${info.assets} built=${info.built}" />`
        return html.replace('<!--head-->', `${meta}\n    <!--head-->`)
    },
    generateBundle() {
        if (ssr) return
        this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify(info, null, 2) + '\n' })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const assets = assetsDir(mode)
  const info = buildInfo(mode, assets)
  return {
    base: '/',
    plugins: [imageSize(), react(), imagetools(), buildInfoPlugin(info)],
    define: { __BUILD_INFO__: JSON.stringify(info) },
    resolve: { alias: { '@assets': assets } },
    // dev server may serve files from an external assets dir outside the project
    server: { fs: { allow: [__dirname, assets] } },
    ssr: {
      // CSS-importing / CJS packages must be bundled into the SSR build
      noExternal: ['react-image-gallery', /^@fontsource\//],
    },
  }
})
