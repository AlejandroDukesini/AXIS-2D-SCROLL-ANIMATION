import { Gauge } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-panel/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-electric" strokeWidth={1.5} />
          <span className="font-display text-xl tracking-mega text-chrome">
            AXIS<span className="text-electric">.</span> MOTORS
          </span>
        </div>
        <p className="text-xs text-chromeDim">
          © {new Date().getFullYear()} AXIS Motors · Experiencia demo · Diseño
          scroll-driven.
        </p>
        <div className="flex gap-6 text-sm text-chromeDim">
          <a href="#gamas" className="hover:text-chrome">Gamas</a>
          <a href="#modelos" className="hover:text-chrome">Modelos</a>
          <a href="#testdrive" className="hover:text-chrome">Contacto</a>
        </div>
      </div>
    </footer>
  )
}
