import { useEffect, useRef, useState } from 'react'
import { Gauge, Menu, MessageCircle, X } from 'lucide-react'
import { waLink } from '../lib/shared'

const links = [
  { label: 'Gamas', href: '#gamas' },
  { label: 'Inventario', href: '#inventario' },
  { label: 'Destacados', href: '#modelos' },
  { label: 'La Ruta', href: '#ruta' },
  { label: 'Color Studio', href: '#color' },
  { label: 'Contacto', href: '#contacto' },
]

/**
 * Navegación fija.
 *  - Se vuelve sólida al salir del Hero. Se detecta con IntersectionObserver
 *    sobre un centinela de 1px, no con un listener de scroll: cero trabajo
 *    por frame mientras se desplaza.
 *  - En < lg, menú desplegable accesible (aria-expanded, Esc, cierre al navegar).
 */
export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const sentinel = useRef(null)
  const toggleRef = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting))
    if (sentinel.current) io.observe(sentinel.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[80px] w-px" />
      <header className="site-nav fixed inset-x-0 top-0 z-50" data-solid={solid || open}>
        <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2 rounded-lg" aria-label="AXIS Motors, inicio">
            <Gauge className="h-6 w-6 text-electric" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-display text-2xl tracking-mega text-chrome">
              AXIS<span className="text-electric">.</span>
            </span>
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative py-2 text-sm text-chromeDim transition-colors hover:text-chrome"
              >
                {l.label}
                <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-electric transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={waLink('Hola, quiero información sobre los autos de AXIS Motors.')}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-electric/40 bg-electric/10 px-4 text-sm font-medium text-electric shadow-neon transition-transform hover:scale-[1.03] sm:px-5"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span className="hidden xs:inline">Escríbenos</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="icon-btn lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" aria-label="Principal" className="border-t border-white/5 bg-obsidian lg:hidden">
            <ul className="container-x grid gap-1 py-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-12 items-center rounded-xl px-3 font-display text-2xl tracking-wide text-chrome hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}
