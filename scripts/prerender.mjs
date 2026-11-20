// Post-build prerender: GitHub Pages is static, so every route gets its own
// fully rendered HTML (content, title, description, canonical, OG, JSON-LD) and
// the client hydrates it. Also writes 404.html (noindex), redirect stubs for the
// old English URLs, sitemap.xml (with image entries) and robots.txt.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const dist = 'dist'
const ssrDir = 'dist-ssr'
const { render, pages, redirects, pageUrl, absUrl, SITE_URL } = await import(
    pathToFileURL(join(ssrDir, 'entry-server.js')).href
)

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const HEAD = /<!--head-->[\s\S]*<!--\/head-->/
if (!template.includes('<!--app-->') || !HEAD.test(template)) {
    throw new Error('prerender: index.html is missing <!--head--> / <!--app--> markers')
}

const page = (path) => {
    const rendered = render(path)
    // React emits resource hints (<link rel="preload">) at the start of the markup — move them to <head>
    const hints = rendered.html.match(/^(?:<link [^>]*\/>)+/)?.[0] ?? ''
    const html = rendered.html.slice(hints.length)
    const head = `${rendered.head}\n    ${hints}`
    // function replacers: rendered markup may contain `$` sequences
    return template.replace(HEAD, () => head).replace('<!--app-->', () => html)
}

const write = (file, content) => {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, content)
}

// known routes -> dist/<route>/index.html (HTTP 200)
for (const { path } of pages) {
    write(join(dist, path, 'index.html'), page(path))
}

// unknown URLs -> 404.html (HTTP 404); NotFound page puts noindex into the static head
const notFound = page('/404')
if (!notFound.includes('content="noindex"')) throw new Error('prerender: 404.html lacks noindex')
write(join(dist, '404.html'), notFound)

// old URLs -> tiny redirect pages pointing at the new canonical URL
for (const [from, to] of Object.entries(redirects)) {
    const url = pageUrl(to)
    write(
        join(dist, from, 'index.html'),
        `<!doctype html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<title>Przekierowanie…</title>
<meta name="robots" content="noindex" />
<link rel="canonical" href="${url}" />
<meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body><a href="${url}">${url}</a></body>
</html>
`,
    )
}

// sitemap with image extension
const xml = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const urlEntry = ({ path, images }) =>
    [
        '  <url>',
        `    <loc>${xml(pageUrl(path))}</loc>`,
        ...images.map(
            ({ src }) => `    <image:image><image:loc>${xml(absUrl(src))}</image:loc></image:image>`,
        ),
        '  </url>',
    ].join('\n')
writeFileSync(
    join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages.map(urlEntry).join('\n')}
</urlset>
`,
)

writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

rmSync(ssrDir, { recursive: true, force: true })

const imageCount = pages.reduce((n, p) => n + p.images.length, 0)
console.log(
    `prerender: ${pages.length} pages + 404.html, ${Object.keys(redirects).length} redirects, sitemap (${imageCount} images)`,
)
