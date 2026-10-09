import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import ResponsiveImage from './media/ResponsiveImage'
import { GAMAS, useFinePointer } from '../lib/shared'
import { categoryStats, formatPrice } from '../data/vehicles'
import { actions } from '../lib/store'

const STATS = Object.fromEntries(GAMAS.map((g) => [g.id, categoryStats(g.id)]))

/**
 * Tres tarjetas. Con ratón, la activa crece (flex-grow) y las demás se atenúan.
 *
 * Cambios de rendimiento respecto a la versión anterior:
 *  - El atenuado ya NO usa `filter: grayscale() blur() brightness()` animado
 *    (repintado completo de cada tarjeta en cada frame); ahora es una capa
 *    negra encima cuya `opacity` se anima en el compositor.
 *  - El texto extra no anima `height: auto` (layout por frame): se revela con
 *    opacity/transform y su espacio está siempre reservado.
 *  - Las transiciones son CSS: sin JavaScript por frame.
 *  - `flex-grow` sí provoca layout, pero solo durante 0,6 s tras un hover,
 *    nunca durante el scroll, y `contain: layout paint` lo acota a la tarjeta.
 *    Es la interacción insignia de la sección y se conserva.
 *
 * Accesibilidad: cada tarjeta es un botón real que lleva al inventario filtrado.
 */
export default function GamaCategorizer() {
  const fine = useFinePointer()
  const [active, setActive] = useState(null)

  return (
    <section id="gamas" className="section-anchor container-x py-24 md:py-28" aria-labelledby="gamas-title">
      <header className="mb-12 max-w-2xl">
        <span className="eyebrow">01 — Elige tu gama</span>
        <h2 id="gamas-title" className="section-title mt-3">
          Tres mundos, <span className="text-gold-fill">un estándar</span>
        </h2>
        <p className="mt-4 text-chromeDim">
          Cada gama está pensada para un tipo distinto de conductor. Elige una y te
          mostramos solo los vehículos que encajan.
        </p>
      </header>

      <ul className="flex flex-col gap-4 md:h-[520px] md:flex-row" onMouseLeave={() => fine && setActive(null)}>
        {GAMAS.map((g) => {
          const st = STATS[g.id]
          const isActive = active === g.id
          const dimmed = fine && active !== null && !isActive
          const expanded = !fine || isActive
          return (
            <li
              key={g.id}
              className="relative flex min-h-[340px] flex-1 basis-0 transition-[flex-grow] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] [contain:layout_paint]"
              style={{ flexGrow: isActive ? 2.4 : 1 }}
              onMouseEnter={() => fine && setActive(g.id)}
            >
              <button
                type="button"
                onClick={() => actions.browseCategory(g.id)}
                onFocus={() => fine && setActive(g.id)}
                className="group relative flex w-full flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-panel p-6 text-left"
                aria-label={`${g.tier}: ver ${st.count} vehículos desde ${formatPrice(st.minPrice)}`}
              >
                {/* Glow radial de la gama activa */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 30%, ${g.accent}33, transparent 60%)`,
                    opacity: expanded ? 1 : 0,
                  }}
                />

                {/* Foto de ambiente de la gama */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[14%] flex justify-center px-6 transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: isActive ? 'translateY(-6px) scale(1.08)' : 'scale(0.96)' }}
                >
                  <span className="relative w-full max-w-[300px]">
                    <span className="floor-shadow absolute inset-x-[8%] bottom-[-6%] h-[18%]" />
                    <ResponsiveImage
                      name={g.img}
                      alt={g.imgAlt}
                      sizes="300px"
                      className="relative h-auto w-full"
                    />
                  </span>
                </span>

                {/* Atenuado de las no activas: opacity de una capa (compositor) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[5] bg-obsidian transition-opacity duration-500"
                  style={{ opacity: dimmed ? 0.55 : 0 }}
                />

                <span className="relative z-10 flex items-start justify-between">
                  <span className="text-xs uppercase tracking-mega" style={{ color: g.accent }}>
                    {g.tier}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-chromeDim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>

                <span className="relative z-10 block">
                  <span className="block font-display text-3xl tracking-wide text-chrome md:text-4xl">{g.name}</span>
                  <span
                    className="block transition-[opacity,transform] duration-500"
                    style={{ opacity: expanded ? 1 : 0, transform: expanded ? 'none' : 'translateY(8px)' }}
                  >
                    <span className="mt-2 block max-w-sm text-sm text-chromeDim">{g.tagline}</span>
                    <span className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <Stat label="Vehículos" value={st.count} />
                      <Stat label="Hasta" value={`${st.maxPower} hp`} />
                      <Stat label="Desde" value={formatPrice(st.minPrice)} accent={g.accent} />
                    </span>
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Stat({ label, value, accent }) {
  return (
    <span className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wider text-chromeDim">{label}</span>
      <span className="font-medium" style={{ color: accent || '#C9CED6' }}>
        {value}
      </span>
    </span>
  )
}
