import { Gauge } from 'lucide-react'
import { INSTAGRAM_URL, waLink } from '../lib/shared'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-panel/40">
      <div className="container-x flex flex-col items-center justify-between gap-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:flex-row">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-electric" strokeWidth={1.5} aria-hidden="true" />
          <span className="font-display text-xl tracking-mega text-chrome">
            AXIS<span className="text-electric">.</span> MOTORS
          </span>
        </div>
        <p className="text-xs text-chromeDim">
          © {new Date().getFullYear()} AXIS Motors · Precios en USD, sujetos a
          disponibilidad. Imágenes ilustrativas.
        </p>
        <nav aria-label="Pie de página" className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-chromeDim">
          <a href="#gamas" className="py-2 hover:text-chrome">Gamas</a>
          <a href="#inventario" className="py-2 hover:text-chrome">Inventario</a>
          <a
            href={waLink('Hola, quiero información sobre AXIS Motors.')}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 hover:text-chrome"
          >
            WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 hover:text-chrome"
          >
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  )
}
