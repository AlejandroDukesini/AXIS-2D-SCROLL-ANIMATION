import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

/**
 * Diálogo modal sobre <dialog> nativo + showModal().
 *
 * El navegador ya resuelve lo difícil y lo hace bien: top layer (sin guerras
 * de z-index), foco atrapado, Esc para cerrar, `inert` del resto de la página
 * y retorno del foco al disparador. Cero dependencias.
 *
 * variant:
 *  - 'sheet'  → bottom sheet en móvil, panel lateral derecho en ≥ md.
 *  - 'center' → ficha centrada en desktop, pantalla completa en móvil.
 */
// Nombres de clase literales: Tailwind elimina del build las clases de
// @layer components que no encuentra escritas tal cual en el código, así que
// `ui-dialog-${variant}` hacía desaparecer los estilos de ambas variantes.
const VARIANT_CLASS = {
  center: 'ui-dialog-center',
  sheet: 'ui-dialog-sheet',
}

export default function Dialog({ open, onClose, title, variant = 'center', children, footer, labelledBy }) {
  const ref = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`ui-dialog ${VARIANT_CLASS[variant]}`}
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : title}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      // Clic en el fondo (fuera de la caja) cierra.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {open && (
        <div className="ui-dialog-box">
          <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <h2 id={labelledBy} className="font-display text-2xl tracking-wide text-chrome">
              {title}
            </h2>
            <button type="button" onClick={onClose} className="icon-btn" aria-label="Cerrar">
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="ui-dialog-body">{children}</div>
          {footer && <footer className="border-t border-white/10 px-5 py-4">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
