import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ChevronDown, Sparkles } from 'lucide-react'
import { CAR_IMG, useFinePointer } from '../lib/shared'

/**
 * Hero con:
 *  - Parallax 3D basado en el cursor (capas se mueven en direcciones opuestas).
 *  - Scroll-reveal del texto (opacidad + desplazamiento hacia arriba al cargar).
 * En móvil / táctil el parallax de cursor se desactiva automáticamente.
 */
export default function Hero() {
  const fine = useFinePointer()
  const ref = useRef(null)

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

  function handleMove(e) {
    if (!fine) return
    const r = ref.current.getBoundingClientRect()
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
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Fondo: glow radial + rejilla de perspectiva (capa lejana) */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.18),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45vh] overflow-hidden opacity-60">
          <div className="grid-floor absolute inset-x-[-50%] bottom-[-20%] h-full" />
        </div>
      </motion.div>

      {/* Glow que sigue al cursor */}
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/10 blur-[120px]"
      />

      {/* Título imponente detrás del auto */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute z-0 select-none text-center font-display leading-[0.8] tracking-mega"
      >
        <span className="block text-[22vw] text-chrome-fill opacity-90 md:text-[16vw]">
          SOVEREIGN
        </span>
      </motion.h1>

      {/* Auto protagonista (capa cercana, parallax inverso) */}
      <motion.img
        src={CAR_IMG}
        alt="Mazda AXIS Sovereign — vista cenital"
        fetchpriority="high"
        decoding="async"
        style={{ x: carX, y: carY, rotate: carRot }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-[min(78vw,520px)] drop-shadow-[0_50px_60px_rgba(0,0,0,0.7)] animate-floaty"
      />

      {/* Copy inferior */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-24 z-20 flex flex-col items-center gap-4 px-6 text-center"
      >
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Concesionario Premium · Multi-Gama
        </span>
        <p className="max-w-xl text-balance text-lg text-chromeDim md:text-xl">
          Tres gamas. Una obsesión por la ingeniería. Descubre el auto que te
          mueve — literalmente, con cada scroll.
        </p>
      </motion.div>

      {/* Indicador de scroll */}
      <motion.a
        href="#gamas"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="absolute bottom-6 z-20 flex flex-col items-center text-chromeDim"
      >
        <span className="text-[10px] uppercase tracking-mega">Scroll</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </motion.a>
    </section>
  )
}
