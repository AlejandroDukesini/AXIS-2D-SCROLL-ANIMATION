import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { BUSINESS, INSTAGRAM_URL, waLink } from '../lib/shared'

const MSG =
  'Hola, vengo de la web de AXIS Motors y quiero más información sobre los modelos disponibles.'

export default function Contacto() {
  return (
    <section id="contacto" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(231,201,138,0.08),transparent_55%)]" />

      <div className="relative mx-auto max-w-3xl px-6">
        <header className="text-center">
          <span className="eyebrow">05 — Contacto</span>
          <h2 className="mt-2 font-display text-4xl tracking-wide text-chrome md:text-5xl">
            Hablemos directamente
          </h2>
          <p className="mx-auto mt-3 max-w-md text-chromeDim">
            Sin formularios ni esperas. Escríbenos y te atendemos en persona.
          </p>
        </header>

        <Representante />

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <ContactCard
            href={waLink(MSG)}
            label="WhatsApp"
            desc="Respuesta en minutos"
            icon={<WhatsAppIcon className="h-7 w-7" />}
            accent="#25D366"
            glow="rgba(37,211,102,0.55)"
            iconBg="linear-gradient(140deg, #25D366, #128C7E)"
          />
          <ContactCard
            href={INSTAGRAM_URL}
            label="Instagram"
            desc={`@${BUSINESS.instagram}`}
            icon={<InstagramIcon className="h-7 w-7" />}
            accent="#E1306C"
            glow="rgba(221,42,123,0.55)"
            iconBg="linear-gradient(140deg, #F58529, #DD2A7B 55%, #8134AF)"
          />
        </div>
      </div>
    </section>
  )
}

/** Retrato del representante legal: pone cara al negocio antes del CTA. */
function Representante() {
  const [failed, setFailed] = useState(false)
  const { nombre, cargo, foto } = BUSINESS.representante
  const iniciales = nombre
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 flex flex-col items-center"
    >
      <div className="relative">
        {/* Halo champán detrás del retrato */}
        <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(231,201,138,0.22),transparent_70%)] blur-xl" />
        <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-champagne via-champagneDeep to-champagne p-[2px] shadow-gold md:h-36 md:w-36">
          {failed ? (
            <div className="grid h-full w-full place-items-center rounded-full bg-panel2 font-display text-4xl tracking-wide text-champagne">
              {iniciales}
            </div>
          ) : (
            <img
              src={foto}
              alt={nombre}
              onError={() => setFailed(true)}
              className="h-full w-full rounded-full object-cover"
            />
          )}
        </div>
        <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-obsidian bg-electric text-obsidian">
          <BadgeCheck className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-5 font-display text-3xl tracking-wide text-chrome">
        {nombre}
      </p>
      <p className="mt-1 text-sm text-chromeDim">{cargo}</p>
    </motion.div>
  )
}

/** Tarjeta de canal: el color e icono de marca la identifican de un vistazo. */
function ContactCard({ href, label, desc, icon, accent, glow, iconBg }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-panel/60 p-6 transition-colors"
    >
      {/* Baño de color de marca al pasar el cursor */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 20% 0%, ${glow}, transparent 65%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `0 0 0 1px ${accent}, 0 22px 45px -18px ${glow}` }}
      />

      <div className="relative flex items-center gap-4">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105"
          style={{ background: iconBg }}
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block font-display text-2xl tracking-wide text-chrome">
            {label}
          </span>
          <span className="block truncate text-sm text-chromeDim">{desc}</span>
        </span>
        <ArrowUpRight className="ml-auto h-5 w-5 shrink-0 text-chromeDim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-chrome" />
      </div>
    </motion.a>
  )
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
    </svg>
  )
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0m0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881" />
    </svg>
  )
}
