import { useEffect, useState } from 'react'

// ---------------------------------------------------------------------------
// CAPACIDAD DEL DISPOSITIVO
// ---------------------------------------------------------------------------
// Se evalúa una sola vez al arrancar y se publica como `data-perf` en <html>,
// de modo que el CSS puede recortar efectos sin JS adicional por frame.
//
// "lite" no significa "sin diseño": se conservan layout, tipografía, imágenes
// y transiciones cortas; solo se quitan los efectos cuyo coste crece con el
// tamaño de pantalla o se paga en cada frame de scroll (filtros, springs que
// suavizan el scroll, parallax de cursor, animaciones infinitas).
//
// Señales usadas (todas opcionales; si el navegador no las expone se asume
// "full", que es lo que ya funcionaba antes):
//  - Save-Data activado por el usuario.
//  - Red 2G / slow-2G.
//  - ≤ 2 GB de RAM (navigator.deviceMemory, Chromium).
//  - ≤ 2 núcleos lógicos.
function detectLite() {
  if (typeof navigator === 'undefined') return false
  const conn = navigator.connection
  if (conn?.saveData) return true
  if (conn && /(^|-)2g$/.test(conn.effectiveType || '')) return true
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true
  return false
}

export const PERF_LITE = detectLite()

export function applyPerfTier() {
  document.documentElement.dataset.perf = PERF_LITE ? 'lite' : 'full'
}

/** Suscripción reactiva a una media query (resize, rotación, preferencias). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/**
 * true cuando conviene usar los efectos "cinemáticos" dirigidos por scroll
 * (springs, tracks horizontales sticky): dispositivo capaz y sin preferencia
 * de movimiento reducido.
 */
export function useRichMotion() {
  const reduced = useReducedMotion()
  return !PERF_LITE && !reduced
}
