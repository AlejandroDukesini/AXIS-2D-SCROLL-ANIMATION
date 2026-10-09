import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { m, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Calendar, Gauge, Zap } from 'lucide-react'
import VehicleMedia from './media/VehicleMedia'
import { CATEGORY_BY_ID, VEHICLES, formatKm, formatPrice, fullName } from '../data/vehicles'
import { actions } from '../lib/store'
import { waLink } from '../lib/shared'
import { useMediaQuery, useRichMotion } from '../lib/device'

const FEATURED = VEHICLES.filter((v) => v.featured)

/**
 * Destacados — galería horizontal.
 *
 *  - Desktop/tablet capaz: track sticky que se desplaza con el scroll vertical.
 *    La altura de la sección se calcula a partir del ancho REAL del track
 *    (ResizeObserver), de modo que 1 px de scroll = 1 px de desplazamiento:
 *    se siente natural y no depende de un "-72%" fijo que se rompía al cambiar
 *    el número de tarjetas o el ancho de pantalla.
 *  - Móvil, gama baja o reduced-motion: carrusel nativo con scroll-snap. El
 *    gesto horizontal es del usuario y lo resuelve el compositor: 0 JS.
 */
export default function Showcase() {
  const rich = useRichMotion()
  const wide = useMediaQuery('(min-width: 768px)')
  const cinematic = rich && wide

  return (
    <section id="modelos" className="section-anchor relative" aria-labelledby="dest-title">
      {cinematic ? <StickyTrack /> : <SnapTrack />}
    </section>
  )
}

function Heading() {
  return (
    <div className="container-x mb-8">
      <span className="eyebrow">03 — Destacados</span>
      <h2 id="dest-title" className="section-title mt-2">
        La selección del mes
      </h2>
    </div>
  )
}

function StickyTrack() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)
  const dist = useMotionValue(0)

  useLayoutEffect(() => {
    const track = trackRef.current
    const measure = () => {
      const d = Math.max(0, track.scrollWidth - document.documentElement.clientWidth)
      setDistance(d)
      dist.set(d)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    return () => ro.disconnect()
  }, [dist])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const x = useTransform([p, dist], ([v, d]) => -v * d)

  return (
    <div ref={sectionRef} style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="h-stage sticky top-0 flex flex-col justify-center overflow-hidden pt-[var(--nav-h)]">
        <Heading />
        <m.ul ref={trackRef} style={{ x }} className="flex w-max gap-6 px-[clamp(1rem,4vw,2.5rem)] will-change-transform">
          {FEATURED.map((v) => (
            <li key={v.slug} className="w-[min(46vw,40rem)] shrink-0">
              <FeaturedCard v={v} />
            </li>
          ))}
          <li className="w-[min(30vw,26rem)] shrink-0">
            <EndCard />
          </li>
        </m.ul>
      </div>
    </div>
  )
}

function SnapTrack() {
  return (
    <div className="py-24">
      <Heading />
      <ul
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1rem,4vw,2.5rem)] pb-4 [scrollbar-width:none]"
        style={{ scrollPaddingInline: 'clamp(1rem, 4vw, 2.5rem)', overscrollBehaviorX: 'contain' }}
        aria-label="Vehículos destacados, desplazable"
      >
        {FEATURED.map((v) => (
          <li key={v.slug} className="w-[min(86vw,26rem)] shrink-0 snap-start">
            <FeaturedCard v={v} />
          </li>
        ))}
        <li className="w-[min(70vw,20rem)] shrink-0 snap-start">
          <EndCard />
        </li>
      </ul>
    </div>
  )
}

function FeaturedCard({ v }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4, once: true })
  const cat = CATEGORY_BY_ID[v.category]

  return (
    <article
      ref={ref}
      className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-panel shadow-card"
      aria-label={fullName(v)}
    >
      <div
        className="transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateX(-6%)' }}
      >
        <VehicleMedia vehicle={v} sizes="(min-width: 768px) 46vw, 86vw" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="text-xs uppercase tracking-mega" style={{ color: cat.accent }}>
          {cat.short} · {v.condition}
        </span>
        <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-chrome md:text-5xl">
          {fullName(v)}
        </h3>
        <p className="mt-1 text-sm text-chromeDim">{v.trim}</p>

        <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
          <div className="flex flex-col gap-1">
            <dt className="order-last text-[11px] uppercase tracking-wider text-chromeDim">Potencia</dt>
            <dd className="font-display text-2xl tracking-wide md:text-3xl" style={{ color: cat.accent }}>
              <Zap className="mb-1 block h-4 w-4" style={{ color: cat.accent }} aria-hidden="true" />
              <Counter to={v.power} play={inView} />
              <span className="text-base text-chromeDim"> hp</span>
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="order-last text-[11px] uppercase tracking-wider text-chromeDim">Año</dt>
            <dd className="font-display text-2xl tracking-wide text-chrome md:text-3xl">
              <Calendar className="mb-1 block h-4 w-4" style={{ color: cat.accent }} aria-hidden="true" />
              {v.year}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="order-last text-[11px] uppercase tracking-wider text-chromeDim">Recorrido</dt>
            <dd className="font-display text-2xl tracking-wide text-chrome md:text-3xl">
              <Gauge className="mb-1 block h-4 w-4" style={{ color: cat.accent }} aria-hidden="true" />
              {formatKm(v.mileage)}
            </dd>
          </div>
        </dl>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
          <p className="font-display text-3xl tracking-wide text-chrome">{formatPrice(v.price)}</p>
          <button type="button" onClick={() => actions.openVehicle(v.slug)} className="btn-ghost">
            Ver ficha <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}

/**
 * Contador que sube al entrar en viewport. Escribe el texto directamente en
 * el nodo con rAF en vez de hacer setState por frame (antes: un re-render de
 * React por frame y por contador). El valor final está en el HTML desde el
 * principio, así que lectores de pantalla y buscadores ven el número real.
 */
function Counter({ to, play }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!play || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    const t0 = performance.now()
    const dur = 1100
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur)
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.textContent = to
    }
  }, [play, to])
  return <span ref={ref}>{to}</span>
}

function EndCard() {
  return (
    <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 rounded-[2rem] border border-electric/20 bg-electric/5 p-8 text-center">
      <p className="font-display text-5xl tracking-wide text-chrome-fill md:text-6xl">¿Buscas otro?</p>
      <p className="max-w-xs text-sm text-chromeDim">
        Tenemos {VEHICLES.length} vehículos en stock y conseguimos el que necesitas.
      </p>
      <a href="#inventario" className="btn-primary">
        Ver todo el inventario
      </a>
      <a
        href={waLink('Hola, vi los destacados en la web y quiero ver el catálogo completo.')}
        target="_blank"
        rel="noopener noreferrer"
        className="link-btn"
      >
        Pedir catálogo por WhatsApp
      </a>
    </div>
  )
}
