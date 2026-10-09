import manifest from '../../data/image-manifest.json'

/**
 * <picture> AVIF/WebP a partir del manifest que genera el pipeline de imágenes.
 *
 *  - `srcset` con todos los anchos disponibles (nunca mayores que el fuente).
 *  - `sizes` lo decide quien la usa: es el ancho real en el layout.
 *  - `width`/`height` intrínsecos: el navegador reserva el hueco antes de
 *    descargar → sin layout shift.
 *  - `priority` para imágenes above-the-fold (eager + fetchpriority=high);
 *    el resto, lazy + decoding async.
 */
export function hasImage(key) {
  return Boolean(manifest[key])
}

export default function ResponsiveImage({
  name, // p. ej. 'marcas/bmw-serie-2-coupe'
  alt,
  sizes,
  className,
  style,
  priority = false,
}) {
  const entry = manifest[name]
  if (!entry) return null
  const base = `/img/${name}`
  const set = (ext) => entry.widths.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ')
  const fallback = `${base}-${entry.widths[entry.widths.length - 1]}.webp`

  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={fallback}
        srcSet={set('webp')}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        className={className}
        style={style}
      />
    </picture>
  )
}
