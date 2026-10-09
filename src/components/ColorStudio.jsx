import { useState } from 'react'
import { m, useMotionValue } from 'framer-motion'
import { RotateCw, Check } from 'lucide-react'
import { CAR_IMG, PAINTS } from '../lib/shared'

/**
 * Simulador de pintura. Recolorea el ÚNICO PNG blanco (vista cenital) usando:
 *  - una silueta enmascarada (mask-image) que aporta el color de carrocería,
 *  - el PNG encima con mix-blend-mode multiply para conservar vidrios/reflejos.
 * El cambio de iluminación ambiental interpola la variable --amb (registrada
 * con @property en index.css): un gradiente normal no se puede transicionar y
 * saltaba de golpe.
 * Se puede arrastrar el auto para girarlo (efecto 360°).
 */
export default function ColorStudio() {
  const [paint, setPaint] = useState(PAINTS[0])
  const rotate = useMotionValue(0)

  const maskStyle = {
    WebkitMaskImage: `url(${CAR_IMG})`,
    maskImage: `url(${CAR_IMG})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
  }

  return (
    <section
      id="color"
      className="section-anchor relative overflow-hidden py-24 md:py-28"
      style={{ '--amb': paint.amb }}
      aria-labelledby="color-title"
    >
      {/* Iluminación ambiental que cambia con el color elegido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-[--amb] duration-700"
        style={{ background: 'radial-gradient(circle at 50% 45%, var(--amb), transparent 60%)' }}
      />

      <div className="container-x relative max-w-5xl text-center">
        <span className="eyebrow">05 — Color Studio</span>
        <h2 id="color-title" className="section-title mt-2">
          Píntalo a tu manera
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-chromeDim">
          Elige un acabado y míralo cambiar en tiempo real. Arrastra el auto para
          girarlo.
        </p>

        {/* Escenario del auto */}
        <div className="relative mx-auto mt-10 flex h-[340px] w-full max-w-[420px] items-center justify-center md:h-[420px]">
          {/* halo bajo el auto: gradiente radial, sin filter: blur */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 h-16 w-[70%] transition-opacity duration-700"
            style={{ background: `radial-gradient(closest-side, ${paint.body}66, transparent)` }}
          />

          <m.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            style={{ rotate }}
            onDrag={(e, info) => rotate.set(info.offset.x * 0.6)}
            onDragEnd={() => rotate.set(0)}
            className="relative h-full w-full cursor-grab active:cursor-grabbing"
          >
            {/* Capa 1: color de carrocería (silueta enmascarada) */}
            <div
              className="absolute inset-0 transition-colors duration-700"
              style={{ ...maskStyle, backgroundColor: paint.body }}
            />
            {/* Capa 2: detalle real del PNG (vidrios, reflejos) */}
            <img
              src={CAR_IMG}
              alt={`Vista cenital de un SUV en ${paint.name}, acabado ${paint.finish}`}
              width={669}
              height={373}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
              style={{ filter: paint.finish === 'mate' ? 'contrast(0.9)' : 'contrast(1.05)' }}
              draggable={false}
            />
          </m.div>

          <span className="pointer-events-none absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 text-[11px] uppercase tracking-widest text-chromeDim">
            <RotateCw className="h-3 w-3" /> Arrastra para girar
          </span>
        </div>

        {/* Nombre del acabado */}
        <div className="mt-6 flex items-center justify-center gap-3" aria-live="polite">
          <span className="font-display text-2xl tracking-wide text-chrome">
            {paint.name}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-0.5 text-xs uppercase tracking-wider text-chromeDim">
            {paint.finish}
          </span>
        </div>

        {/* Paleta de colores */}
        <div role="group" aria-label="Color de carrocería" className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {PAINTS.map((c) => {
            const isActive = c.id === paint.id
            return (
              <button
                key={c.id}
                type="button"
                onMouseEnter={() => setPaint(c)}
                onClick={() => setPaint(c)}
                aria-label={`${c.name}, ${c.finish}`}
                aria-pressed={isActive}
                className="relative grid h-11 w-11 place-items-center rounded-full transition-transform hover:scale-110"
                style={{
                  background: c.body,
                  boxShadow: isActive
                    ? `0 0 0 2px #0B0C10, 0 0 0 4px ${c.body}, 0 0 22px ${c.body}88`
                    : `inset 0 0 0 1px rgba(255,255,255,0.15)`,
                }}
              >
                {isActive && (
                  <Check
                    className="h-4 w-4"
                    style={{
                      color:
                        c.id === 'obsidian' || c.id === 'graphite' || c.id === 'crimson'
                          ? '#fff'
                          : '#0B0C10',
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
