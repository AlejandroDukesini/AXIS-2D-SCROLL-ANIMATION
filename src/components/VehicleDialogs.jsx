import { useEffect } from 'react'
import { CalendarCheck, Check, X, ArrowLeftRight } from 'lucide-react'
import Dialog from './ui/Dialog'
import VehicleMedia from './media/VehicleMedia'
import { WaGlyph } from './vehicles/VehicleCard'
import { CATEGORY_BY_ID, VEHICLES, formatKm, formatPrice, fullName } from '../data/vehicles'
import { actions, useStore, MAX_COMPARE } from '../lib/store'
import { waLink } from '../lib/shared'

const BY_SLUG = Object.fromEntries(VEHICLES.map((v) => [v.slug, v]))

/** Ficha de vehículo + comparador + bandeja de comparación (montados una vez). */
export default function VehicleDialogs() {
  const openSlug = useStore((s) => s.openSlug)
  const compare = useStore((s) => s.compare)
  const compareOpen = useStore((s) => s.compareOpen)

  // Enlace profundo: /#vehiculo/<slug> abre la ficha al cargar.
  useEffect(() => {
    const m = location.hash.match(/^#vehiculo\/([\w-]+)$/)
    if (m && BY_SLUG[m[1]]) actions.openVehicle(m[1])
  }, [])

  const vehicle = openSlug ? BY_SLUG[openSlug] : null
  const compared = compare.map((s) => BY_SLUG[s]).filter(Boolean)

  return (
    <>
      <Dialog
        open={Boolean(vehicle)}
        onClose={actions.closeVehicle}
        title={vehicle ? fullName(vehicle) : ''}
        labelledBy="vehicle-dialog-title"
      >
        {vehicle && <VehicleDetail v={vehicle} />}
      </Dialog>

      <Dialog
        open={compareOpen && compared.length > 0}
        onClose={() => actions.setCompareOpen(false)}
        title="Comparar vehículos"
        labelledBy="compare-dialog-title"
      >
        <CompareTable list={compared} />
      </Dialog>

      {compared.length > 0 && <CompareTray list={compared} />}
    </>
  )
}

function VehicleDetail({ v }) {
  const cat = CATEGORY_BY_ID[v.category]
  const name = `${fullName(v)} ${v.trim} ${v.year}`
  const specs = [
    ['Año', v.year],
    ['Kilometraje', formatKm(v.mileage)],
    ['Estado', v.condition],
    ['Carrocería', v.body],
    ['Motor', v.engine],
    ['Potencia', `${v.power} hp`],
    ['Combustible', v.fuel],
    ['Transmisión', v.gearbox],
    ['Tracción', v.drivetrain],
    ['Color', v.color.name],
  ]
  return (
    <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-8">
      <div>
        <VehicleMedia vehicle={v} sizes="(min-width: 768px) 560px, 100vw" priority className="rounded-2xl" />
        <p className="mt-2 text-xs text-chromeDim">
          Imagen ilustrativa del modelo y color. Pide fotos y video reales de esta unidad por WhatsApp.
        </p>
        <h3 className="mt-6 text-xs uppercase tracking-mega text-chromeDim">Equipamiento destacado</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {v.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-chrome">
              <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: cat.accent }} aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-mega" style={{ color: cat.accent }}>
          {cat.short} · {v.condition}
        </p>
        <p className="mt-1 text-chromeDim">{v.trim}</p>
        <div className="mt-4">
          {v.oldPrice && (
            <p className="text-sm text-chromeDim line-through">
              <span className="sr-only">Antes </span>
              {formatPrice(v.oldPrice)}
            </p>
          )}
          <p className="font-display text-5xl leading-none tracking-wide text-chrome">{formatPrice(v.price)}</p>
          {v.oldPrice && (
            <p className="mt-1 text-sm text-champagne">Ahorras {formatPrice(v.oldPrice - v.price)}</p>
          )}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-5 text-sm">
          {specs.map(([k, val]) => (
            <div key={k} className="min-w-0">
              <dt className="text-xs text-chromeDim">{k}</dt>
              <dd className="truncate text-chrome">{val}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto grid gap-3 pt-6">
          <a
            href={waLink(`Hola, me interesa el ${name} publicado en ${formatPrice(v.price)}. ¿Sigue disponible?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <WaGlyph className="h-5 w-5" /> Me interesa
          </a>
          <a
            href={waLink(`Hola, quiero agendar un test drive del ${name}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <CalendarCheck className="h-4 w-4" /> Agendar test drive
          </a>
        </div>
      </div>
    </div>
  )
}

function CompareTable({ list }) {
  // La fila se resalta cuando un valor es el mejor de la comparación.
  const best = (key, dir) => {
    const vals = list.map((v) => v[key])
    return dir === 'min' ? Math.min(...vals) : Math.max(...vals)
  }
  const rows = [
    ['Precio', (v) => formatPrice(v.price), 'price', 'min'],
    ['Año', (v) => v.year, 'year', 'max'],
    ['Kilometraje', (v) => formatKm(v.mileage), 'mileage', 'min'],
    ['Potencia', (v) => `${v.power} hp`, 'power', 'max'],
    ['Combustible', (v) => v.fuel],
    ['Transmisión', (v) => v.gearbox],
    ['Tracción', (v) => v.drivetrain],
    ['Carrocería', (v) => v.body],
    ['Estado', (v) => v.condition],
  ]
  return (
    <div className="overflow-x-auto p-5" tabIndex={0} aria-label="Tabla comparativa, desplazable">
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        <caption className="sr-only">Comparación de {list.length} vehículos</caption>
        <thead>
          <tr>
            <td className="w-32" />
            {list.map((v) => (
              <th key={v.slug} scope="col" className="px-3 pb-4 text-left align-bottom font-normal">
                <VehicleMedia vehicle={v} sizes="200px" className="mb-3 rounded-xl" />
                <span className="block font-display text-xl tracking-wide text-chrome">{fullName(v)}</span>
                <span className="block text-xs text-chromeDim">{v.trim}</span>
                <button type="button" onClick={() => actions.toggleCompare(v.slug)} className="link-btn mt-2">
                  <X className="h-3.5 w-3.5" /> Quitar
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fmt, key, dir]) => {
            const b = key && list.length > 1 ? best(key, dir) : null
            return (
              <tr key={label} className="border-t border-white/10">
                <th scope="row" className="py-3 pr-3 text-left text-xs font-normal uppercase tracking-wider text-chromeDim">
                  {label}
                </th>
                {list.map((v) => {
                  const isBest = b != null && v[key] === b
                  return (
                    <td key={v.slug} className={`px-3 py-3 ${isBest ? 'font-medium text-electric' : 'text-chrome'}`}>
                      {fmt(v)}
                      {isBest && <span className="sr-only"> (mejor)</span>}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CompareTray({ list }) {
  return (
    <div className="compare-tray" role="region" aria-label="Comparador">
      <p className="min-w-0 truncate text-sm text-chrome">
        <span className="font-medium">{list.length}</span>/{MAX_COMPARE}
        <span className="hidden sm:inline"> · {list.map((v) => v.model).join(', ')}</span>
      </p>
      <button type="button" onClick={actions.clearCompare} className="link-btn">
        Vaciar
      </button>
      <button
        type="button"
        onClick={() => actions.setCompareOpen(true)}
        className="btn-primary !min-h-10 !px-4 !py-2"
        disabled={list.length < 2}
        title={list.length < 2 ? 'Selecciona al menos 2 vehículos' : undefined}
      >
        <ArrowLeftRight className="h-4 w-4" /> Comparar
      </button>
    </div>
  )
}
