import { useRef } from 'react'
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react'
import { CAR_IMG, useFinePointer, waLink } from '../lib/shared'
import { VEHICLES } from '../data/vehicles'

/**
 * Hero:
 *  - Entrada por CSS (keyframes de transform/opacity): arranca con el primer
 *    paint, sin esperar a que cargue JavaScript de animación.
 *  - Parallax 3D por cursor (solo puntero fino, sin reduced-motion y en
 *    equipos capaces). Cada capa de transform está en su propio elemento:
 *    antes la animación CSS `floaty` y el parallax escribían el mismo
 *    `transform` del <img> y la animación CSS anulaba al parallax.
 */
export default function Hero() {
  const fine = useFinePointer()
  const rect = useRef(null)

  // Posición normalizada del mouse: -0.5 .. 0.5
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 20, mass: 0.4 })
  const sy = useSpring(my, { stiffness: 120, damping: 20, mass: 0.4 })

  // Capas: el auto y el fondo se desplazan en sentido opuesto -> profundidad.
  const carX = useTransform(sx, [-0.5, 0.5], [40, -40])
  const carY = useTransform(sy, [-0.5, 0.5], [30, -30])
  const carRot = useTransform(sx, [-0.5, 0.5], [-6, 6])
  const bgX = useTransform(sx, [-0.5, 0.5], [-30, 30])
  const bgY = useTransform(sy, [-0.5, 0.5], [-20, 20])
  const glowX = useTransform(sx, [-0.5, 0.5], [-60, 60])

  // El rect se cachea al entrar: leerlo en cada mousemove forzaría layout
  // si algo invalidó estilos en ese frame.
  function handleEnter(e) {
    if (fine) rect.current = e.currentTarget.getBoundingClientRect()
  }
  function handleMove(e) {
    const r = rect.current
    if (!fine || !r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function reset() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="top"
      onPointerEnter={handleEnter}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className="relative isolate flex min-h-stage flex-col overflow-hidden pt-[var(--nav-h)]"
    >
      {/* Fondo: glow radial + rejilla de perspectiva (capa lejana) */}
      <m.div style={{ x: bgX, y: bgY }} className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] overflow-hidden opacity-60">
          <div className="grid-floor absolute inset-x-[-50%] bottom-[-20%] h-full" />
        </div>
      </m.div>

      {/* Glow que sigue al cursor: gradiente radial en lugar de filter: blur(120px)
          (un blur de ese radio sobre 520 px es de lo más caro que hay en GPU) */}
      <m.div
        style={{ x: glowX }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] -z-10 -ml-[320px] -mt-[320px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.13),transparent)]"
      />

      {/* Escenario del auto */}
      <div className="relative grid flex-1 place-items-center py-6">
        {/* Tipografía decorativa detrás del auto */}
        <span
          aria-hidden="true"
          className="hero-in pointer-events-none absolute select-none text-center font-display text-[22vw] leading-[0.8] tracking-mega text-chrome-fill opacity-90 md:text-[15vw] 3xl:text-[13vw]"
          style={{ '--d': '0.1s' }}
        >
          SOVEREIGN
        </span>

        <m.div style={{ x: carX, y: carY, rotate: carRot }} className="relative">
          <div className="animate-floaty">
            <div aria-hidden="true" className="floor-shadow absolute left-1/2 top-[14%] h-[82%] w-[30%] -translate-x-1/2 translate-y-[6%]" />
            <img
              src={CAR_IMG}
              alt="SUV blanco vista cenital, protagonista del concesionario AXIS Motors"
              width={669}
              height={373}
              fetchpriority="high"
              decoding="async"
              draggable={false}
              className="hero-car-in relative h-[clamp(220px,40svh,400px)] w-auto max-w-none"
            />
          </div>
        </m.div>
      </div>

      {/* Copy + CTAs */}
      <div className="container-x relative z-10 flex flex-col items-center pb-10 text-center md:pb-14">
        <span className="eyebrow hero-in text-balance" style={{ '--d': '0.3s' }}>
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> Concesionario premium · Nuevos y usados
        </span>
        <h1
          className="hero-in mt-4 max-w-3xl font-display text-[clamp(2.25rem,1.5rem+3.5vw,4.25rem)] leading-[0.95] tracking-wide text-chrome"
          style={{ '--d': '0.4s', textWrap: 'balance' }}
        >
          Tu próximo vehículo, elegido con criterio
        </h1>
        <p className="hero-in mt-4 max-w-xl text-balance text-chromeDim md:text-lg" style={{ '--d': '0.5s' }}>
          De urbanos eficientes a deportivos de alto rendimiento. Precios claros,
          fichas completas y atención directa por WhatsApp.
        </p>
        <div className="hero-in mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row" style={{ '--d': '0.6s' }}>
          <a href="#inventario" className="btn-primary px-7">
            Ver inventario <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={waLink('Hola, quiero asesoría para elegir un vehículo.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-7"
          >
            Hablar con un asesor
          </a>
        </div>
        <p className="hero-in mt-6 text-xs uppercase tracking-[0.14em] text-chromeDim" style={{ '--d': '0.7s' }}>
          {VEHICLES.length} vehículos disponibles · 3 gamas · Nuevos y usados
        </p>
      </div>

      {/* Indicador de scroll (solo pantallas altas, donde hay sitio) */}
      <a
        href="#gamas"
        aria-label="Ir a las gamas"
        className="absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 rounded-full p-2 text-chromeDim tall:block"
      >
        <span className="hero-in block" style={{ '--d': '1.1s' }}>
          <ChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
        </span>
      </a>
    </section>
  )
}
