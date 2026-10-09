import { memo } from 'react'
import { Calendar, Gauge, Cog, Fuel, Plus, Check, ArrowRight } from 'lucide-react'
import VehicleMedia from '../media/VehicleMedia'
import { CATEGORY_BY_ID, formatKm, formatPrice } from '../../data/vehicles'
import { actions, useStore, MAX_COMPARE } from '../../lib/store'
import { waLink } from '../../lib/shared'

// Ancho real de la card en la grilla (ver .inventory-grid): 1 col en móvil,
// ~2 en tablet, ~3 en desktop con sidebar. El navegador elige la variante.
const CARD_SIZES = '(min-width: 1280px) 340px, (min-width: 640px) 45vw, 92vw'

function VehicleCard({ vehicle, index = 0 }) {
  const v = vehicle
  const cat = CATEGORY_BY_ID[v.category]
  const comparing = useStore((s) => s.compare.includes(v.slug))
  const compareFull = useStore((s) => s.compare.length >= MAX_COMPARE)
  const title = `${v.brand} ${v.model}`
  const titleId = `vc-${v.slug}`

  return (
    <article
      className="vehicle-card group"
      aria-labelledby={titleId}
      style={{ '--i': Math.min(index, 8), '--accent': cat.accent }}
    >
      <div className="relative">
        <VehicleMedia vehicle={v} sizes={CARD_SIZES} />

        {/* Estado + etiquetas: lo primero que escanea el comprador */}
        <ul className="absolute left-3 top-3 flex flex-wrap gap-1.5" aria-label="Etiquetas">
          <li className={`badge ${v.condition === 'Nuevo' ? 'badge-new' : 'badge-used'}`}>
            {v.condition}
          </li>
          {v.tags.slice(0, 2).map((t) => (
            <li key={t} className={`badge ${/oferta/i.test(t) ? 'badge-offer' : ''}`}>
              {t}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => actions.toggleCompare(v.slug)}
          disabled={!comparing && compareFull}
          aria-pressed={comparing}
          aria-label={`${comparing ? 'Quitar' : 'Añadir'} ${title} ${comparing ? 'del' : 'al'} comparador`}
          title={!comparing && compareFull ? `Máximo ${MAX_COMPARE} vehículos` : 'Comparar'}
          className="compare-toggle"
        >
          {comparing ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          <span className="text-xs">Comparar</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] uppercase tracking-mega" style={{ color: cat.accent }}>
          {cat.short}
        </p>
        <h3 id={titleId} className="mt-1 font-display text-[1.75rem] leading-none tracking-wide text-chrome">
          {title}
        </h3>
        <p className="mt-1 truncate text-sm text-chromeDim">
          {v.trim} · {v.power} hp
        </p>

        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-chrome/90">
          <Spec icon={Calendar} label="Año">{v.year}</Spec>
          <Spec icon={Gauge} label="Kilometraje">{formatKm(v.mileage)}</Spec>
          <Spec icon={Cog} label="Transmisión">{v.transmission}</Spec>
          <Spec icon={Fuel} label="Combustible">{v.fuel}</Spec>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <div className="min-w-0">
            {v.oldPrice && (
              <p className="text-xs text-chromeDim line-through">
                <span className="sr-only">Antes </span>
                {formatPrice(v.oldPrice)}
              </p>
            )}
            <p className="font-display text-3xl leading-none tracking-wide text-chrome">
              <span className="sr-only">Precio </span>
              {formatPrice(v.price)}
            </p>
          </div>
          <a
            href={waLink(`Hola, me interesa el ${title} ${v.trim} ${v.year} (${formatPrice(v.price)}). ¿Sigue disponible?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            aria-label={`Consultar por WhatsApp el ${title}`}
          >
            <WaGlyph />
          </a>
        </div>

        <button
          type="button"
          onClick={() => actions.openVehicle(v.slug)}
          className="btn-primary mt-4 w-full"
          aria-describedby={titleId}
        >
          Ver vehículo
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  )
}

function Spec({ icon: Icon, label, children }) {
  return (
    <li className="flex min-w-0 items-center gap-2">
      <Icon className="h-4 w-4 shrink-0 text-chromeDim" aria-hidden="true" />
      <span className="sr-only">{label}: </span>
      <span className="truncate">{children}</span>
    </li>
  )
}

export function WaGlyph({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91A9.86 9.86 0 0 0 12.04 2Zm5.8 14.06c-.24.68-1.42 1.32-1.97 1.37-.5.05-1.13.07-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.15-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18.01.42-.07.66.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.1.19-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.45.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.7-.17 1.38Z" />
    </svg>
  )
}

export default memo(VehicleCard)
