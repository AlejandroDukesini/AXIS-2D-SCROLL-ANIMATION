import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { GAMAS, useFinePointer } from '../lib/shared'

/**
 * Tres tarjetas verticales. Al hacer hover, la activa crece (flex-grow) y las
 * otras se contraen con blur + escala de grises. La activa gana un glow radial
 * y su auto se acerca (scale + translateY).
 */
export default function GamaCategorizer() {
  const fine = useFinePointer()
  const [active, setActive] = useState(fine ? null : 'media')

  return (
    <section id="gamas" className="relative mx-auto max-w-7xl px-6 py-28">
      <header className="mb-12 max-w-2xl">
        <span className="eyebrow">01 — Elige tu gama</span>
        <h2 className="mt-3 font-display text-5xl tracking-wide text-chrome md:text-6xl">
          Tres mundos, <span className="text-gold-fill">un estándar</span>
        </h2>
        <p className="mt-4 text-chromeDim">
          Pasa el cursor sobre cada gama para explorarla. Cada una está diseñada
          para un tipo distinto de conductor.
        </p>
      </header>

      <div
        className="flex flex-col gap-4 md:h-[520px] md:flex-row"
        onMouseLeave={() => fine && setActive(null)}
      >
        {GAMAS.map((g) => {
          const isActive = active === g.id
          const dimmed = active !== null && !isActive
          return (
            <motion.article
              key={g.id}
              onMouseEnter={() => fine && setActive(g.id)}
              onClick={() => setActive(g.id)}
              animate={{
                flexGrow: isActive ? 2.4 : 1,
                filter: dimmed
                  ? 'grayscale(0.85) blur(2px) brightness(0.7)'
                  : 'grayscale(0) blur(0px) brightness(1)',
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="group relative min-h-[320px] flex-1 cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-panel"
              style={{ flexBasis: 0 }}
            >
              {/* Glow radial personalizado de la gama activa */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${g.accent}33, transparent 60%)`,
                }}
              />

              {/* Auto real de la gama */}
              <motion.img
                src={g.img}
                alt={g.name}
                animate={{
                  scale: isActive ? 1.12 : 0.94,
                  y: isActive ? -8 : 0,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-1/2 top-1/2 w-[92%] max-w-[380px] -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
              />

              {/* Contenido */}
              <div className="relative z-10 flex h-full flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span
                    className="text-xs uppercase tracking-mega"
                    style={{ color: g.accent }}
                  >
                    {g.tier}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-chromeDim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>

                <div>
                  <h3 className="font-display text-3xl tracking-wide text-chrome md:text-4xl">
                    {g.name}
                  </h3>
                  <motion.div
                    animate={{
                      height: isActive ? 'auto' : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 max-w-sm text-sm text-chromeDim">
                      {g.tagline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      <Stat label="Potencia" value={`${g.stats.potencia} hp`} />
                      <Stat label="Vel. máx" value={`${g.stats.velocidad} km/h`} />
                      <span
                        className="font-medium"
                        style={{ color: g.accent }}
                      >
                        {g.price}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <span className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-chromeDim/70">
        {label}
      </span>
      <span className="text-chrome">{value}</span>
    </span>
  )
}
