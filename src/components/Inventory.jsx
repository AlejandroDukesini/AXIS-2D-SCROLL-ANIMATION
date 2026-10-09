import { useDeferredValue, useMemo, useRef, useState, useId } from 'react'
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react'
import VehicleCard from './vehicles/VehicleCard'
import FilterPanel from './vehicles/FilterPanel'
import Dialog from './ui/Dialog'
import { CATEGORIES, VEHICLES } from '../data/vehicles'
import { EMPTY_FILTERS, SORTS, activeCount, applyFilters } from './vehicles/filters'
import { actions, prefersReducedMotion, useStore } from '../lib/store'

const CATEGORY_TABS = [{ id: 'all', label: 'Todos' }, ...CATEGORIES]

/**
 * Inventario: Descubrir → Filtrar → Comparar → Ver ficha → Contactar.
 *
 * Rendimiento:
 *  - 20 cards no justifican virtualización (añadiría JS y complejidad sin
 *    beneficio medible); en su lugar cada card usa `content-visibility: auto`,
 *    así el navegador no hace layout/paint de las que están fuera de pantalla.
 *  - El filtrado usa useDeferredValue: el input/slider responde al instante
 *    (buen INP) y la grilla se recalcula como trabajo de menor prioridad.
 *  - Cambiar de gama no anima el layout: las cards nuevas entran con una
 *    animación CSS de opacity/transform (compositor) y no hay parpadeo porque
 *    las que se mantienen conservan su key y su nodo DOM.
 */
export default function Inventory() {
  const category = useStore((s) => s.category)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sheetOpen, setSheetOpen] = useState(false)
  const sectionRef = useRef(null)
  const searchId = useId()
  const sortId = useId()

  const deferredFilters = useDeferredValue(filters)
  const deferredCategory = useDeferredValue(category)
  const results = useMemo(
    () => applyFilters(VEHICLES, deferredCategory, deferredFilters),
    [deferredCategory, deferredFilters],
  )

  // Recuentos por gama y marca respetando el resto de filtros activos.
  const counts = useMemo(() => {
    const byCat = { all: applyFilters(VEHICLES, 'all', filters).length }
    CATEGORIES.forEach((c) => (byCat[c.id] = applyFilters(VEHICLES, c.id, filters).length))
    const brands = {}
    applyFilters(VEHICLES, category, { ...filters, brands: [] }).forEach(
      (v) => (brands[v.brand] = (brands[v.brand] || 0) + 1),
    )
    return { byCat, brands }
  }, [filters, category])

  const nActive = activeCount(filters)
  const update = (patch) => setFilters((f) => ({ ...f, ...patch }))
  const reset = () => {
    setFilters(EMPTY_FILTERS)
    actions.setCategory('all')
  }

  // Si el usuario ya bajó dentro de la grilla y cambia de gama, la lista puede
  // encogerse bajo sus pies; se le devuelve al inicio del inventario para que
  // vea el resultado en lugar de un hueco (respuesta a su acción, no scroll
  // automático).
  function selectCategory(id) {
    actions.setCategory(id)
    const el = sectionRef.current
    if (el && el.getBoundingClientRect().top < -80) {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    }
  }

  return (
    <section id="inventario" ref={sectionRef} className="section-anchor relative py-24 md:py-28" aria-labelledby="inv-title">
      <div className="container-x">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">02 — Inventario</span>
            <h2 id="inv-title" className="section-title mt-3">
              Encuentra tu próximo <span className="text-gold-fill">vehículo</span>
            </h2>
            <p className="mt-3 text-chromeDim">
              {VEHICLES.length} vehículos nuevos y usados, revisados y listos para entrega.
              Filtra, compara hasta 3 y consulta por WhatsApp en un clic.
            </p>
          </div>
        </header>

        {/* Barra de herramientas: sticky bajo la navegación */}
        <div className="inventory-toolbar">
          <div role="group" aria-label="Gama" className="segmented">
            {CATEGORY_TABS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={category === c.id}
                onClick={() => selectCategory(c.id)}
                className="segmented-btn"
              >
                {c.label}
                <span className="segmented-count">{counts.byCat[c.id]}</span>
              </button>
            ))}
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
            <div className="relative min-w-0 flex-1 basis-full sm:basis-0 lg:w-64 lg:flex-none">
              <label htmlFor={searchId} className="sr-only">
                Buscar por marca o modelo
              </label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-chromeDim" aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                inputMode="search"
                autoComplete="off"
                placeholder="Marca o modelo"
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                className="field w-full pl-9"
              />
            </div>
            <label htmlFor={sortId} className="sr-only">
              Ordenar
            </label>
            <select
              id={sortId}
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="field min-w-0 flex-1 sm:max-w-[13rem] sm:flex-none"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="btn-ghost lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {nActive > 0 && <span className="count-pill">{nActive}</span>}
            </button>
          </div>
        </div>

        {/* minmax(0,1fr) también en móvil: con la columna implícita (auto) el
            min-content de los textos `truncate` ensanchaba la grilla más allá
            del viewport y recortaba las cards. */}
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          {/* Sidebar de filtros (desktop) */}
          <aside className="hidden lg:block" aria-label="Filtros">
            <div className="filters-aside">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-2xl tracking-wide text-chrome">Filtros</p>
                {nActive > 0 && (
                  <button type="button" onClick={reset} className="link-btn">
                    <RotateCcw className="h-3.5 w-3.5" /> Limpiar
                  </button>
                )}
              </div>
              <FilterPanel filters={filters} onChange={update} counts={counts} />
            </div>
          </aside>

          <div className="min-w-0">
            <p className="mb-4 text-sm text-chromeDim" role="status" aria-live="polite">
              {results.length === 1 ? '1 vehículo encontrado' : `${results.length} vehículos encontrados`}
            </p>

            {results.length > 0 ? (
              <ul className="inventory-grid" aria-label="Resultados">
                {results.map((v, i) => (
                  <li key={v.slug} className="flex">
                    <VehicleCard vehicle={v} index={i} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 px-6 py-16 text-center">
                <p className="font-display text-3xl tracking-wide text-chrome">Sin coincidencias</p>
                <p className="mx-auto mt-2 max-w-sm text-chromeDim">
                  Ningún vehículo cumple todos los filtros. Prueba a ampliar el precio o el kilometraje.
                </p>
                <button type="button" onClick={reset} className="btn-primary mx-auto mt-6">
                  <RotateCcw className="h-4 w-4" /> Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet de filtros (móvil / tablet) */}
      <Dialog
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filtros"
        variant="sheet"
        footer={
          <div className="flex gap-3">
            <button type="button" onClick={reset} className="btn-ghost flex-1" disabled={nActive === 0}>
              Limpiar
            </button>
            <button type="button" onClick={() => setSheetOpen(false)} className="btn-primary flex-[2]">
              Ver {results.length} {results.length === 1 ? 'vehículo' : 'vehículos'}
            </button>
          </div>
        }
      >
        <FilterPanel filters={filters} onChange={update} counts={counts} />
      </Dialog>
    </section>
  )
}
