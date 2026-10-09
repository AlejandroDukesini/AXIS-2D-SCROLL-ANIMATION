import { useId } from 'react'
import { BODY_TYPES, CONDITIONS, FUELS, TRANSMISSIONS, formatPrice } from '../../data/vehicles'
import { BRANDS, KM_OPTIONS, PRICE_BOUNDS, YEARS, toggleIn } from './filters'

/**
 * Panel de filtros. El mismo componente se monta en el sidebar (≥ lg) y en
 * el bottom sheet (móvil/tablet); el estado vive en <Inventory>, así que
 * ambos están siempre sincronizados.
 */
export default function FilterPanel({ filters: f, onChange, counts }) {
  const uid = useId()
  const priceId = `${uid}-price`
  const price = f.maxPrice ?? PRICE_BOUNDS.max

  return (
    <div className="space-y-7">
      <ChipGroup
        legend="Estado"
        options={CONDITIONS}
        selected={f.conditions}
        onToggle={(v) => onChange({ conditions: toggleIn(f.conditions, v) })}
      />

      <fieldset>
        <legend className="filter-legend">Precio máximo</legend>
        <div className="flex items-baseline justify-between">
          <label htmlFor={priceId} className="text-sm text-chromeDim">
            Hasta
          </label>
          <output htmlFor={priceId} className="font-display text-xl tracking-wide text-chrome">
            {f.maxPrice == null ? 'Sin límite' : formatPrice(price)}
          </output>
        </div>
        <input
          id={priceId}
          type="range"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={5000}
          value={price}
          onChange={(e) => {
            const n = Number(e.target.value)
            onChange({ maxPrice: n >= PRICE_BOUNDS.max ? null : n })
          }}
          aria-valuetext={f.maxPrice == null ? 'Sin límite' : formatPrice(price)}
          className="range mt-3 w-full"
        />
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Año desde"
          value={f.minYear ?? ''}
          onChange={(v) => onChange({ minYear: v === '' ? null : Number(v) })}
          options={[{ value: '', label: 'Cualquiera' }, ...YEARS.map((y) => ({ value: y, label: y }))]}
        />
        <Select
          label="Kilometraje"
          value={f.maxKm ?? ''}
          onChange={(v) => onChange({ maxKm: v === '' ? null : Number(v) })}
          options={KM_OPTIONS.map((o) => ({ value: o.value ?? '', label: o.label }))}
        />
      </div>

      <ChipGroup
        legend="Carrocería"
        options={BODY_TYPES}
        selected={f.bodies}
        onToggle={(v) => onChange({ bodies: toggleIn(f.bodies, v) })}
      />
      <ChipGroup
        legend="Combustible"
        options={FUELS}
        selected={f.fuels}
        onToggle={(v) => onChange({ fuels: toggleIn(f.fuels, v) })}
      />
      <ChipGroup
        legend="Transmisión"
        options={TRANSMISSIONS}
        selected={f.transmissions}
        onToggle={(v) => onChange({ transmissions: toggleIn(f.transmissions, v) })}
      />

      <fieldset>
        <legend className="filter-legend">Marca</legend>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
          {BRANDS.map((b) => (
            <li key={b}>
              <label className="check-row">
                <input
                  type="checkbox"
                  checked={f.brands.includes(b)}
                  onChange={() => onChange({ brands: toggleIn(f.brands, b) })}
                />
                <span className="min-w-0 flex-1 truncate">{b}</span>
                <span className="text-xs text-chromeDim">{counts.brands[b] ?? 0}</span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>
    </div>
  )
}

function ChipGroup({ legend, options, selected, onToggle }) {
  return (
    <fieldset>
      <legend className="filter-legend">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="chip-label">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={selected.includes(o)}
              onChange={() => onToggle(o)}
            />
            <span className="chip">{o}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Select({ label, value, onChange, options }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="filter-legend block">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field w-full">
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
