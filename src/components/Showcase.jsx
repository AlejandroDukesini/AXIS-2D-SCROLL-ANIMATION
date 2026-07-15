import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  animate,
} from 'framer-motion'
import { Gauge, Zap, Tag } from 'lucide-react'
import { GAMAS } from '../lib/shared'

// Modelos de la galería (reusamos el Mazda con distintos tintes)
const MODELS = GAMAS.map((g) => ({
  ...g,
  specs: [
    { icon: Zap, label: 'Potencia', value: g.stats.potencia, suffix: ' hp' },
    { icon: Gauge, label: 'Vel. máx', value: g.stats.velocidad, suffix: ' km/h' },
    { icon: Tag, label: 'Consumo', value: g.stats.consumo, suffix: ' km/l' },
  ],
}))

export default function Showcase() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.5 })
  // Desplaza el track horizontalmente según el scroll vertical.
  const x = useTransform(p, [0, 1], ['2%', '-72%'])

  return (
    <section id="modelos" ref={ref} className="relative" style={{ height: '320vh' }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-8 w-full max-w-7xl px-6">
          <span className="eyebrow">03 — La Colección</span>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-chrome md:text-5xl">
            Desliza para descubrir
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 will-change-transform">
          {MODELS.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
          <EndCard />
        </motion.div>
      </div>
    </section>
  )
}

function ModelCard({ model }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.5 })

  return (
    <article
      ref={ref}
      className="relative flex h-[70vh] w-[85vw] shrink-0 flex-col justify-between overflow-hidden rounded-[32px] border border-white/5 bg-panel p-8 shadow-card md:w-[46vw]"
    >
      {/* glow de fondo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 20%, ${model.accent}22, transparent 55%)`,
        }}
      />

      {/* revelado tipo máscara del auto */}
      <motion.img
        src={model.img}
        alt={model.name}
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={
          inView
            ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 }
            : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }
        }
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`absolute drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)] ${
          model.view === 'top'
            ? 'right-[-4%] top-1/2 w-[52%] -translate-y-1/2 rotate-90'
            : 'right-[-4%] top-[42%] w-[86%] -translate-y-1/2'
        }`}
      />

      <div className="relative z-10">
        <span
          className="text-xs uppercase tracking-mega"
          style={{ color: model.accent }}
        >
          {model.tier}
        </span>
        <h3 className="mt-1 font-display text-5xl tracking-wide text-chrome">
          {model.name}
        </h3>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
        {model.specs.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <s.icon className="h-4 w-4" style={{ color: model.accent }} />
            <Counter
              to={s.value}
              suffix={s.suffix}
              play={inView}
              accent={model.accent}
            />
            <span className="text-[10px] uppercase tracking-wider text-chromeDim/70">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

/** Contador numérico que sube desde cero al entrar en viewport. */
function Counter({ to, suffix = '', play, accent }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!play) return
    const controls = animate(0, to, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [play, to])

  return (
    <span className="font-display text-3xl tracking-wide" style={{ color: accent }}>
      {val}
      <span className="text-lg text-chromeDim">{suffix}</span>
    </span>
  )
}

function EndCard() {
  return (
    <article className="flex h-[70vh] w-[70vw] shrink-0 flex-col items-center justify-center gap-4 rounded-[32px] border border-electric/20 bg-electric/5 p-8 text-center md:w-[30vw]">
      <p className="font-display text-6xl tracking-wide text-chrome-fill">
        ¿Listo?
      </p>
      <a
        href="#testdrive"
        className="rounded-full border border-electric/40 bg-electric/10 px-6 py-3 text-sm font-medium text-electric shadow-neon transition-transform hover:scale-105"
      >
        Agenda tu Test Drive
      </a>
    </article>
  )
}
