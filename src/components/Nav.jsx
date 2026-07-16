import { motion } from 'framer-motion'
import { Gauge, MessageCircle } from 'lucide-react'
import { waLink } from '../lib/shared'

const links = [
  { label: 'Gamas', href: '#gamas' },
  { label: 'La Ruta', href: '#ruta' },
  { label: 'Modelos', href: '#modelos' },
  { label: 'Color Studio', href: '#color' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <Gauge className="h-6 w-6 text-electric" strokeWidth={1.5} />
          <span className="font-display text-2xl tracking-mega text-chrome">
            AXIS<span className="text-electric">.</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm text-chromeDim transition-colors hover:text-chrome"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-electric transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <a
          href={waLink('Hola, quiero información sobre los autos de AXIS Motors.')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-5 py-2 text-sm font-medium text-electric shadow-neon transition-transform hover:scale-105"
        >
          <MessageCircle className="h-4 w-4" />
          Escríbenos
        </a>
      </div>
    </motion.header>
  )
}
