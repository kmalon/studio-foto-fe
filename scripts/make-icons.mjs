// One-off icon generator (run after editing public/favicon.svg, commit the outputs):
//   node scripts/make-icons.mjs
// -> public/favicon.ico (48×48, Google search favicon), apple-touch-icon.png (180),
//    icon-192.png + icon-512.png (site.webmanifest).
import { readFileSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

const svg = readFileSync('public/favicon.svg')
const png = (size) => sharp(svg, { density: (72 * size) / 32 }).resize(size, size).png().toBuffer()

for (const [file, size] of [
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
]) {
    writeFileSync(`public/${file}`, await png(size))
}

// ICO = 6-byte header + 16-byte directory entry per image + PNG payloads
const icoSizes = [48, 32, 16]
const images = await Promise.all(icoSizes.map(png))
const header = Buffer.alloc(6 + 16 * images.length)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(images.length, 4)
let offset = header.length
images.forEach((data, i) => {
    const e = 6 + 16 * i
    header.writeUInt8(icoSizes[i], e) // width
    header.writeUInt8(icoSizes[i], e + 1) // height
    header.writeUInt8(0, e + 2) // palette
    header.writeUInt8(0, e + 3) // reserved
    header.writeUInt16LE(1, e + 4) // color planes
    header.writeUInt16LE(32, e + 6) // bits per pixel
    header.writeUInt32LE(data.length, e + 8)
    header.writeUInt32LE(offset, e + 12)
    offset += data.length
})
writeFileSync('public/favicon.ico', Buffer.concat([header, ...images]))
console.log('icons written to public/')
