import { useSyncExternalStore } from 'react'

// ---------------------------------------------------------------------------
// Estado de UI compartido entre secciones (gama activa, comparador, ficha).
// ---------------------------------------------------------------------------
// Las secciones son chunks diferidos independientes (Gamas, Inventario,
// Destacados, diálogos) que necesitan comunicarse. Un Context en App obligaría
// a re-renderizar todo el árbol en cada cambio; con useSyncExternalStore cada
// componente se suscribe solo al trozo que lee (selector) y únicamente él se
// vuelve a pintar.

const MAX_COMPARE = 3

let state = {
  category: 'all', // 'all' | id de CATEGORIES
  compare: [], // slugs, máx. MAX_COMPARE
  openSlug: null, // ficha abierta
  compareOpen: false,
}
const listeners = new Set()

function set(patch) {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}

export function useStore(selector) {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => selector(state),
  )
}

export const getState = () => state

export const actions = {
  setCategory(category) {
    set({ category })
  },
  /** Fija la gama y lleva al inventario (desde Gamas / Ruta). */
  browseCategory(category) {
    set({ category })
    const el = document.getElementById('inventario')
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  },
  toggleCompare(slug) {
    const { compare } = state
    if (compare.includes(slug)) set({ compare: compare.filter((s) => s !== slug) })
    else if (compare.length < MAX_COMPARE) set({ compare: [...compare, slug] })
  },
  clearCompare() {
    set({ compare: [], compareOpen: false })
  },
  openVehicle(slug) {
    set({ openSlug: slug })
    // URL compartible de la ficha, sin crear entradas de historial ni saltar.
    history.replaceState(null, '', `#vehiculo/${slug}`)
  },
  closeVehicle() {
    set({ openSlug: null })
    if (location.hash.startsWith('#vehiculo/')) {
      history.replaceState(null, '', location.pathname + location.search)
    }
  },
  setCompareOpen(compareOpen) {
    set({ compareOpen })
  },
}

export { MAX_COMPARE }

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
