/**
 * optimize-images.mjs
 * ------------------------------------------------------------------
 * Pipeline reproducible e idempotente de imágenes (sharp).
 *
 *  assets-src/scroll-img/*.png  ->  public/scroll-img/*.webp
 *     Imagen única: se usa también como máscara CSS y favicon, así que se
 *     conserva su lienzo original (el layout del Hero depende de él).
 *
 *  assets-src/marcas/*.png      ->  public/img/marcas/<nombre>-<ancho>.{avif,webp}
 *  assets-src/vehiculos/*.{png,jpg,jpeg,webp}
 *                               ->  public/img/vehiculos/<slug>-<ancho>.{avif,webp}
 *     Imágenes responsive:
 *      1. `trim()` elimina el margen transparente/uniforme, de modo que todos
 *         los autos quedan encuadrados igual y centrados (antes cada PNG tenía
 *         un margen distinto y el auto aparecía desplazado).
 *      2. Se generan anchos de ladder fijo SIN superar el ancho real del
 *         fuente: nunca se reescala hacia arriba (eso solo produce una imagen
 *         más pesada e igual de borrosa).
 *      3. AVIF + WebP; el <picture> deja que el navegador elija.
 *      4. Se escribe src/data/image-manifest.json con anchos y dimensiones
 *         intrínsecas, que el componente <ResponsiveImage> usa para emitir
 *         srcset/sizes/width/height correctos (sin CLS).
 *
 * Uso:  npm run optimize:images
 */
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const SINGLE = [['assets-src/scroll-img', 'public/scroll-img']]
const RESPONSIVE = [
  ['assets-src/marcas', 'public/img/marcas', 'marcas'],
  ['assets-src/vehiculos', 'public/img/vehiculos', 'vehiculos'],
]
const LADDER = [320, 480, 640, 960, 1280, 1600]
const WEBP_Q = 80
const AVIF_Q = 55
const INPUT_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp'])

const kb = (b) => (b / 1024).toFixed(1)
let totalIn = 0
let totalOut = 0
const rows = []
const manifest = {}

async function list(dir) {
  try {
    return (await readdir(dir)).filter((f) => INPUT_EXT.has(extname(f).toLowerCase()))
  } catch {
    return []
  }
}

for (const [srcDir, outDir] of SINGLE) {
  const files = await list(srcDir)
  if (files.length) await mkdir(outDir, { recursive: true })
  for (const file of files) {
    const src = join(srcDir, file)
    const out = join(outDir, basename(file, extname(file)) + '.webp')
    await sharp(src).webp({ quality: 82, effort: 6 }).toFile(out)
    const before = (await stat(src)).size
    const after = (await stat(out)).size
    totalIn += before
    totalOut += after
    rows.push({ file: out.replace('public/', ''), before, after })
  }
}

for (const [srcDir, outDir, group] of RESPONSIVE) {
  const files = await list(srcDir)
  if (files.length) await mkdir(outDir, { recursive: true })
  for (const file of files) {
    const name = basename(file, extname(file))
    const src = join(srcDir, file)
    const before = (await stat(src)).size
    // trim() sobre el borde transparente (o del color de la esquina en JPG).
    const trimmed = await sharp(src).trim({ threshold: 12 }).toBuffer({ resolveWithObject: true })
    const { width, height } = trimmed.info
    const widths = LADDER.filter((w) => w <= width * 0.8)
    widths.push(width) // siempre el ancho nativo, nunca más
    let after = 0
    for (const w of widths) {
      const base = sharp(trimmed.data).resize({ width: w, withoutEnlargement: true })
      const webp = join(outDir, `${name}-${w}.webp`)
      const avif = join(outDir, `${name}-${w}.avif`)
      await base.clone().webp({ quality: WEBP_Q, effort: 6 }).toFile(webp)
      await base.clone().avif({ quality: AVIF_Q, effort: 6 }).toFile(avif)
      after += (await stat(webp)).size
    }
    manifest[`${group}/${name}`] = { width, height, widths }
    totalIn += before
    totalOut += after
    rows.push({ file: `img/${group}/${name}-{${widths.join(',')}}.webp`, before, after })
  }
}

await writeFile('src/data/image-manifest.json', JSON.stringify(manifest, null, 2) + '\n')

console.log('\n  archivo'.padEnd(48), 'fuente'.padStart(10), 'salida'.padStart(10))
console.log('  ' + '-'.repeat(68))
for (const r of rows) {
  console.log('  ' + r.file.padEnd(46), (kb(r.before) + ' KB').padStart(10), (kb(r.after) + ' KB').padStart(10))
}
console.log('  ' + '-'.repeat(68))
console.log(
  `  ${rows.length} imágenes · fuente ${kb(totalIn)} KB · WebP generado ${kb(totalOut)} KB ` +
    '(suma de todas las variantes; cada visitante descarga solo una)\n',
)
