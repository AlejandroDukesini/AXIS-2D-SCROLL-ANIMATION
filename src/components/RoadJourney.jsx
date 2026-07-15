import { useRef } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useMotionValue,
} from 'framer-motion'
import { MapPin } from 'lucide-react'
import { CAR_IMG } from '../lib/shared'

// Hitos que el auto va "pasando" a lo largo de la ruta (progreso 0..1)
const MILESTONES = [
  {
    at: 0.16,
    side: 'left',
    kicker: 'Gama Baja',
    title: 'AXIS City',
    text: 'Nace la aventura urbana: ligera, ágil, eléctricamente eficiente.',
    accent: '#22D3EE',
  },
  {
    at: 0.42,
    side: 'right',
    kicker: 'Gama Media',
    title: 'AXIS Vantage',
    text: 'El punto dulce. Confort premium con un motor que responde.',
    accent: '#C9CED6',
  },
  {
    at: 0.68,
    side: 'left',
    kicker: 'Gama Alta',
    title: 'AXIS Sovereign',
    text: 'La cima. 620 hp de ingeniería obsesiva y lujo sin límites.',
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

export default function RoadJourney() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Suavizado del progreso para movimiento fluido a 60fps.
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.5,
  })

  // --- Movimiento del auto (solo transform: acelerado por hardware) ---
  // Desvío lateral sutil: casi recto, con leves correcciones de carril.
  const carY = useTransform(p, [0, 1], ['-6vh', '64vh'])
  const carX = useTransform(p, (v) => Math.sin(v * Math.PI * 2.2) * 26)
  const carRot = useTransform(p, (v) => Math.cos(v * Math.PI * 2.2) * 3.5)

  // Línea discontinua central: se desplaza con el scroll (sensación de avance).
  const dashY = useTransform(p, [0, 1], ['0px', '-2200px'])

  // Velocímetro (HUD)
  const speed = useMotionValue(0)
  const speedRef = useRef(null)
  useMotionValueEvent(p, 'change', (v) => {
    // Curva de velocidad: acelera y desacelera durante el trayecto.
    const kmh = Math.round(Math.abs(Math.sin(v * Math.PI)) * 240 + v * 60)
    speed.set(kmh)
    if (speedRef.current) speedRef.current.textContent = kmh
  })

  return (
    <section
      id="ruta"
      ref={sectionRef}
      className="relative"
      style={{ height: '360vh' }}
    >
      {/* Escenario fijo (sticky) donde ocurre la conducción */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Ambiente */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.06),transparent_70%)]" />

        {/* Encabezado de la sección */}
        <div className="pointer-events-none absolute left-1/2 top-8 z-30 -translate-x-1/2 text-center">
          <span className="eyebrow">02 — La Ruta</span>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-chrome md:text-5xl">
            Conduce con el scroll
          </h2>
        </div>

        {/* --- CARRETERA --- */}
        <div className="absolute inset-y-0 left-1/2 z-10 w-[min(46vw,340px)] -translate-x-1/2">
          <div className="road-surface relative h-full w-full rounded-[40px]">
            {/* bordes */}
            <div className="road-edge absolute inset-y-0 left-3 w-px" />
            <div className="road-edge absolute inset-y-0 right-3 w-px" />
            {/* línea central discontinua animada */}
            <motion.div
              style={{ backgroundPositionY: dashY }}
              className="road-dashes absolute inset-y-[-20%] left-1/2 w-[6px] -translate-x-1/2 opacity-80"
            />
          </div>
        </div>

        {/* Hitos a los costados */}
        {MILESTONES.map((m, i) => (
          <Milestone key={i} progress={p} {...m} />
        ))}

        {/* --- AUTO PROTAGONISTA --- */}
        <motion.img
          src={CAR_IMG}
          alt="Mazda recorriendo la ruta"
          style={{ y: carY, x: carX, rotate: carRot }}
          className="absolute left-1/2 top-0 z-20 w-[min(40vw,250px)] -translate-x-1/2 drop-shadow-[0_35px_45px_rgba(0,0,0,0.75)]"
        />

        {/* HUD velocímetro */}
        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-end gap-2 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md">
          <span
            ref={speedRef}
            className="font-display text-4xl leading-none text-electric"
          >
            0
          </span>
          <span className="mb-1 text-xs uppercase tracking-widest text-chromeDim">
            km/h
          </span>
        </div>
      </div>
    </section>
  )
}

/** Tarjeta-hito que aparece cuando el auto pasa por su punto de la ruta. */
function Milestone({ progress, at, side, kicker, title, text, accent }) {
  const w = 0.14 // ancho de la ventana de aparición
  const opacity = useTransform(
    progress,
    [at - w, at - w / 2, at + w / 2, at + w],
    [0, 1, 1, 0]
  )
  const x = useTransform(
    progress,
    [at - w, at],
    [side === 'left' ? -60 : 60, 0]
  )

  return (
    <motion.div
      style={{ opacity, x }}
      className={`absolute top-1/2 z-30 w-[min(80vw,300px)] -translate-y-1/2 ${
        side === 'left'
          ? 'left-4 md:left-[10%] md:right-auto text-left'
          : 'right-4 md:right-[10%] md:left-auto text-right'
      }`}
    >
      <div className="rounded-2xl border border-white/10 bg-panel/70 p-5 shadow-card backdrop-blur-md">
        <span
          className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-mega ${
            side === 'right' ? 'flex-row-reverse' : ''
          }`}
          style={{ color: accent }}
        >
          <MapPin className="h-3.5 w-3.5" /> {kicker}
        </span>
        <h3 className="mt-2 font-display text-3xl tracking-wide text-chrome">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-chromeDim">{text}</p>
      </div>
    </motion.div>
  )
}
