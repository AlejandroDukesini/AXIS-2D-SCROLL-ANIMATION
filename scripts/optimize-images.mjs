/**
 * optimize-images.mjs
 * ------------------------------------------------------------------
 * Lee los PNG fuente de /assets-src (fuera de la carpeta servida) y
 * genera sus equivalentes WebP en /public (calidad 82, esfuerzo 6).
 * De este modo solo los WebP acaban en el bundle de producción.
 * Reejecutable e idempotente.
 *
 * Uso:  npm run optimize:images
 *
 * Imprime una tabla ANTES/DESPUÉS con el % de reducción por archivo,
 * que es la fuente de las métricas documentadas en el README.
 */
import { readdir, stat, mkdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import sharp from 'sharp'

// [dir fuente PNG]  ->  [dir destino WebP servido por Vite]
const DIRS = [
  ['assets-src/marcas', 'public/marcas'],
  ['assets-src/scroll-img', 'public/scroll-img'],
]
const QUALITY = 82

const kb = (b) => (b / 1024).toFixed(1)
let totalIn = 0
let totalOut = 0
const rows = []

for (const [srcDir, outDir] of DIRS) {
  let files = []
  try {
    files = await readdir(srcDir)
  } catch {
    continue
  }
  await mkdir(outDir, { recursive: true })
  for (const file of files) {
    if (extname(file).toLowerCase() !== '.png') continue
    const src = join(srcDir, file)
    const out = join(outDir, file.replace(/\.png$/i, '.webp'))
    const before = (await stat(src)).size
    await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(out)
    const after = (await stat(out)).size
    totalIn += before
    totalOut += after
    rows.push({
      file: out.replace('public/', ''),
      before,
      after,
      saved: (((before - after) / before) * 100).toFixed(1),
    })
  }
}

console.log('\n  archivo'.padEnd(34), 'PNG'.padStart(9), 'WebP'.padStart(9), 'ahorro'.padStart(9))
console.log('  ' + '-'.repeat(60))
for (const r of rows) {
  console.log(
    '  ' + r.file.padEnd(30),
    (kb(r.before) + ' KB').padStart(9),
    (kb(r.after) + ' KB').padStart(9),
    ('-' + r.saved + '%').padStart(9),
  )
}
console.log('  ' + '-'.repeat(60))
const totalSaved = (((totalIn - totalOut) / totalIn) * 100).toFixed(1)
console.log(
  '  ' + 'TOTAL'.padEnd(30),
  (kb(totalIn) + ' KB').padStart(9),
  (kb(totalOut) + ' KB').padStart(9),
  ('-' + totalSaved + '%').padStart(9),
)
console.log(`\n  ${rows.length} imágenes → ${kb(totalIn)} KB reducidos a ${kb(totalOut)} KB (-${totalSaved}%)\n`)
