import { useRef } from 'react'
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { CAR_IMG } from '../lib/shared'
import { useRichMotion } from '../lib/device'
import { categoryStats, formatPrice } from '../data/vehicles'

const ECO = categoryStats('economico')
const MID = categoryStats('media')
const LUX = categoryStats('lujo')

// Hitos que el auto va "pasando" a lo largo de la ruta (progreso 0..1).
// Las cifras salen del inventario: si cambia el stock, cambian aquí.
const MILESTONES = [
  {
    at: 0.16,
    side: 'left',
    kicker: 'Gama Económica',
    title: 'AXIS City',
    text: `${ECO.count} urbanos eficientes desde ${formatPrice(ECO.minPrice)}. Ligeros, ágiles y fáciles de mantener.`,
    accent: '#22D3EE',
  },
  {
    at: 0.42,
    side: 'right',
    kicker: 'Gama Media · Premium',
    title: 'AXIS Vantage',
    text: `El punto dulce: ${MID.brands.slice(0, 3).join(', ')} y más, con hasta ${MID.maxPower} hp.`,
    accent: '#C9CED6',
  },
  {
    at: 0.68,
    side: 'left',
    kicker: 'Lujo · Alto rendimiento',
    title: 'AXIS Sovereign',
    text: `La cima: hasta ${LUX.maxPower} hp de ingeniería obsesiva y lujo sin límites.`,
    accent: '#E7C98A',
  },
  {
    at: 0.9,
    side: 'right',
    kicker: 'Destino',
    title: 'Tu garaje',
    text: 'El viaje termina donde empieza el tuyo. Agenda un test drive.',
    accent: '#22D3EE',
  },
]

const DASH_PERIOD = 160 // px: debe coincidir con background-size de .road-dashes

export default function RoadJourney() {
  const rich = useRichMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Suavizado del progreso. En gama baja / reduced-motion se usa el progreso
  // directo: el spring añade trabajo por frame y una inercia que no es la del
  // gesto del usuario.
  const spring = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 })
  const p = rich ? spring : scrollYProgress

  // --- Movimiento del auto (solo transform: acelerado por hardware) ---
  const carY = useTransform(p, [0, 1], ['-6vh', '64vh'])
  const carX = useTransform(p, (v) => Math.sin(v * Math.PI * 2.2) * 26)
  const carRot = useTransform(p, (v) => Math.cos(v * Math.PI * 2.2) * 3.5)

  // Línea discontinua: antes animaba background-position (repintado por
  // frame); ahora es un translateY en módulo del periodo del patrón, así el
  // compositor solo mueve una textura ya rasterizada.
  const dashY = useTransform(p, (v) => -((v * 2200) % DASH_PERIOD))

  // Velocímetro (HUD): escritura directa al nodo, sin re-render de React.
  const speedRef = useRef(null)
  useMotionValueEvent(p, 'change', (v) => {
    const kmh = Math.round(Math.abs(Math.sin(v * Math.PI)) * 240 + v * 60)
    if (speedRef.current) speedRef.current.textContent = kmh
  })

  return (
    <section id="ruta" ref={sectionRef} className="section-anchor relative h-[280vh] md:h-[340vh]" aria-labelledby="ruta-title">
      {/* Escenario fijo (sticky) donde ocurre la conducción */}
      <div className="h-stage sticky top-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.06),transparent_70%)]" />

        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+1rem)] z-30 px-4 text-center">
          <span className="eyebrow">04 — La Ruta</span>
          <h2 id="ruta-title" className="mt-2 font-display text-4xl tracking-wide text-chrome md:text-5xl">
            Conduce con el scroll
          </h2>
        </div>

        {/* --- CARRETERA --- */}
        <div className="absolute inset-y-0 left-1/2 z-10 w-[min(46vw,340px)] -translate-x-1/2" aria-hidden="true">
          <div className="road-surface relative h-full w-full overflow-hidden rounded-[40px]">
            <div className="road-edge absolute inset-y-0 left-3 w-px" />
            <div className="road-edge absolute inset-y-0 right-3 w-px" />
            <m.div
              style={{ y: dashY }}
              className="road-dashes absolute -bottom-[160px] left-1/2 top-0 -ml-[3px] w-[6px] opacity-80 will-change-transform"
            />
          </div>
        </div>

        {MILESTONES.map((ms) => (
          <Milestone key={ms.title} progress={p} {...ms} />
        ))}

        {/* --- AUTO PROTAGONISTA --- (sombra = gradiente, no filter) */}
        <m.div
          style={{ y: carY, x: carX, rotate: carRot }}
          className="absolute left-1/2 top-0 z-20 -ml-[min(20vw,125px)] w-[min(40vw,250px)] will-change-transform"
          aria-hidden="true"
        >
          <div className="floor-shadow absolute inset-x-[38%] inset-y-[10%] translate-y-[5%]" />
          <img src={CAR_IMG} alt="" width={669} height={373} loading="lazy" decoding="async" className="relative w-full" />
        </m.div>

        {/* HUD velocímetro */}
        <div
          className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-end gap-2 rounded-2xl border border-white/10 bg-black/70 px-5 py-3"
          aria-hidden="true"
        >
          <span ref={speedRef} className="font-display text-4xl leading-none text-electric">
            0
          </span>
          <span className="mb-1 text-xs uppercase tracking-widest text-chromeDim">km/h</span>
        </div>
      </div>
    </section>
  )
}

/**
 * Tarjeta-hito que aparece cuando el auto pasa por su punto de la ruta.
 * Móvil: a lo ancho, sobre el HUD (no tapa el auto). ≥ md: a los costados.
 * Sin backdrop-filter: sobre un fondo que se mueve en cada frame, el blur se
 * recalcula continuamente; un panel casi opaco se ve igual sobre fondo oscuro.
 */
function Milestone({ progress, at, side, kicker, title, text, accent }) {
  const w = 0.14 // ancho de la ventana de aparición
  const opacity = useTransform(progress, [at - w, at - w / 2, at + w / 2, at + w], [0, 1, 1, 0])
  const x = useTransform(progress, [at - w, at], [side === 'left' ? -60 : 60, 0])

  return (
    // El centrado vertical (translate) va en el contenedor y el movimiento en
    // el hijo: si comparten elemento, el transform inline de Framer pisa al
    // de la clase y la tarjeta queda descolocada.
    <div
      className={`absolute inset-x-4 bottom-28 z-30 md:inset-x-auto md:bottom-auto md:top-1/2 md:w-[300px] md:-translate-y-1/2 ${
        side === 'left' ? 'md:left-[8%] md:text-left lg:left-[12%]' : 'md:right-[8%] md:text-right lg:right-[12%]'
      }`}
    >
      <m.div style={{ opacity, x }} className="rounded-2xl border border-white/10 bg-panel/95 p-5 shadow-card">
        <span
          className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-mega ${side === 'right' ? 'md:flex-row-reverse' : ''}`}
          style={{ color: accent }}
        >
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {kicker}
        </span>
        <h3 className="mt-2 font-display text-3xl tracking-wide text-chrome">{title}</h3>
        <p className="mt-1.5 text-sm text-chromeDim">{text}</p>
      </m.div>
    </div>
  )
}
