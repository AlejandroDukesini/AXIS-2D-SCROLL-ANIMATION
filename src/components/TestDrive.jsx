import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Send, Check } from 'lucide-react'
import { GAMAS, useFinePointer } from '../lib/shared'

export default function TestDrive() {
  const [sent, setSent] = useState(false)

  return (
    <section id="testdrive" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(231,201,138,0.08),transparent_55%)]" />
      <div className="relative mx-auto max-w-2xl px-6">
        <header className="text-center">
          <span className="eyebrow">05 — Test Drive</span>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-chrome md:text-5xl">
            Vívelo en persona
          </h2>
          <p className="mx-auto mt-3 max-w-md text-chromeDim">
            Reserva tu experiencia de conducción. Te contactamos en menos de 24h.
          </p>
        </header>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-electric/30 bg-electric/5 p-10 text-center"
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-electric/15 text-electric shadow-neon">
              <Check className="h-7 w-7" />
            </div>
            <p className="font-display text-3xl tracking-wide text-chrome">
              ¡Reserva recibida!
            </p>
            <p className="text-chromeDim">Nos pondremos en contacto muy pronto.</p>
          </motion.div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
            className="mt-10 flex flex-col gap-5"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="nombre" label="Nombre completo" />
              <Field id="email" label="Correo electrónico" type="email" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="tel" label="Teléfono" type="tel" />
              <SelectField id="gama" label="Gama de interés" />
            </div>
            <Field id="msg" label="Mensaje (opcional)" textarea />

            <MagneticButton />
          </form>
        )}
      </div>
    </section>
  )
}

/** Input con floating label + borde LED animado al hacer focus. */
function Field({ id, label, type = 'text', textarea = false }) {
  const [val, setVal] = useState('')
  const active = val.length > 0
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className="led-border relative rounded-xl">
      <Tag
        id={id}
        type={type}
        rows={textarea ? 3 : undefined}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder=" "
        className="peer w-full resize-none rounded-xl border border-white/10 bg-panel/60 px-4 pb-2 pt-6 text-chrome outline-none transition-colors placeholder-shown:pt-4 focus:border-transparent"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 text-chromeDim transition-all duration-200 ${
          active
            ? 'top-2 text-xs text-electric'
            : 'top-4 text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-electric'
        }`}
      >
        {label}
      </label>
    </div>
  )
}

function SelectField({ id, label }) {
  return (
    <div className="led-border relative rounded-xl">
      <select
        id={id}
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-white/10 bg-panel/60 px-4 pb-2 pt-6 text-chrome outline-none focus:border-transparent"
      >
        <option value="" disabled hidden></option>
        {GAMAS.map((g) => (
          <option key={g.id} value={g.id} className="bg-panel text-chrome">
            {g.tier} — {g.name}
          </option>
        ))}
      </select>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2 text-xs text-electric"
      >
        {label}
      </label>
    </div>
  )
}

/** Botón con atracción magnética hacia el cursor (< ~90px). */
function MagneticButton() {
  const fine = useFinePointer()
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18 })
  const sy = useSpring(y, { stiffness: 260, damping: 18 })

  function onMove(e) {
    if (!fine) return
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    const radius = r.width / 2 + 60 // zona de atracción
    if (dist < radius) {
      x.set(dx * 0.4)
      y.set(dy * 0.4)
    } else {
      x.set(0)
      y.set(0)
    }
  }
  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className="mt-2 flex justify-center py-4"
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      <motion.button
        ref={ref}
        type="submit"
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.95 }}
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-electric to-champagne px-8 py-4 font-medium text-obsidian shadow-neon transition-shadow hover:shadow-gold"
      >
        Reservar Test Drive
        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  )
}
