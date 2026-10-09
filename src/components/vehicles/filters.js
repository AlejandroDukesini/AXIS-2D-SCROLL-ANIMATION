import { VEHICLES } from '../../data/vehicles'

// Lógica de filtrado pura (sin React): fácil de testear y reutilizable.

export const PRICE_BOUNDS = {
  min: Math.floor(Math.min(...VEHICLES.map((v) => v.price)) / 5000) * 5000,
  max: Math.ceil(Math.max(...VEHICLES.map((v) => v.price)) / 5000) * 5000,
}

export const BRANDS = [...new Set(VEHICLES.map((v) => v.brand))].sort((a, b) => a.localeCompare(b, 'es'))
export const YEARS = [...new Set(VEHICLES.map((v) => v.year))].sort((a, b) => b - a)
export const KM_OPTIONS = [
  { value: null, label: 'Cualquiera' },
  { value: 10000, label: 'Hasta 10.000 km' },
  { value: 20000, label: 'Hasta 20.000 km' },
  { value: 35000, label: 'Hasta 35.000 km' },
]
export const SORTS = [
  { value: 'relevance', label: 'Destacados' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'year-desc', label: 'Año: más reciente' },
  { value: 'km-asc', label: 'Kilometraje: menor' },
  { value: 'power-desc', label: 'Potencia: mayor' },
]

export const EMPTY_FILTERS = {
  q: '',
  brands: [],
  maxPrice: null,
  minYear: null,
  maxKm: null,
  fuels: [],
  transmissions: [],
  bodies: [],
  conditions: [],
  sort: 'relevance',
}

/** Nº de filtros activos (para el badge del botón "Filtros" en móvil). */
export function activeCount(f) {
  return (
    f.brands.length + f.fuels.length + f.transmissions.length + f.bodies.length + f.conditions.length +
    (f.maxPrice != null) + (f.minYear != null) + (f.maxKm != null) + (f.q.trim() ? 1 : 0)
  )
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function applyFilters(list, category, f) {
  const q = norm(f.q.trim())
  const out = list.filter(
    (v) =>
      (category === 'all' || v.category === category) &&
      (!q || norm(`${v.brand} ${v.model} ${v.trim} ${v.body}`).includes(q)) &&
      (!f.brands.length || f.brands.includes(v.brand)) &&
      (f.maxPrice == null || v.price <= f.maxPrice) &&
      (f.minYear == null || v.year >= f.minYear) &&
      (f.maxKm == null || v.mileage <= f.maxKm) &&
      (!f.fuels.length || f.fuels.includes(v.fuel)) &&
      (!f.transmissions.length || f.transmissions.includes(v.transmission)) &&
      (!f.bodies.length || f.bodies.includes(v.body)) &&
      (!f.conditions.length || f.conditions.includes(v.condition)),
  )
  const by = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'year-desc': (a, b) => b.year - a.year || a.mileage - b.mileage,
    'km-asc': (a, b) => a.mileage - b.mileage,
    'power-desc': (a, b) => b.power - a.power,
  }[f.sort]
  // "Destacados": orden editorial del inventario (featured primero).
  return by ? out.sort(by) : out.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
}

export const toggleIn = (arr, value) =>
  arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]
