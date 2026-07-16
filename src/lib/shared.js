import { useEffect, useState } from 'react'

// Ruta de la imagen protagonista (servida desde /public)
export const CAR_IMG = '/scroll-img/mazda-remove-bk.png'

// ---------------------------------------------------------------------------
// DATOS DEL NEGOCIO — reemplazar por los reales antes de publicar.
// ---------------------------------------------------------------------------
export const BUSINESS = {
  // Formato internacional, solo dígitos: 57 = Colombia.
  whatsapp: '573000000000',
  instagram: 'axismotors',
  representante: {
    nombre: 'Nombre del Representante',
    cargo: 'Representante Legal · AXIS Motors',
    // Colocar la foto en public/equipo/representante.jpg
    foto: '/equipo/representante.jpg',
  },
}

export const INSTAGRAM_URL = `https://instagram.com/${BUSINESS.instagram}`

/** Enlace de WhatsApp con mensaje previo según el contexto del botón. */
export function waLink(mensaje) {
  const url = `https://wa.me/${BUSINESS.whatsapp}`
  return mensaje ? `${url}?text=${encodeURIComponent(mensaje)}` : url
}

/**
 * Devuelve true solo si el dispositivo tiene un puntero fino (mouse/trackpad)
 * y el usuario no pidió movimiento reducido. Se usa para desactivar los
 * efectos basados en el cursor en móvil / táctil.
 */
export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setFine(mq.matches && !rm.matches)
    update()
    mq.addEventListener('change', update)
    rm.addEventListener('change', update)
    return () => {
      mq.removeEventListener('change', update)
      rm.removeEventListener('change', update)
    }
  }, [])
  return fine
}

// Gamas del concesionario. Cada una con su imagen real (fondo transparente).
export const GAMAS = [
  {
    id: 'baja',
    tier: 'Gama Baja',
    name: 'AXIS City',
    tagline: 'Agilidad urbana, eficiencia total.',
    accent: '#22D3EE',
    img: '/marcas/renault.png',
    price: 'Desde $18.900',
    stats: { potencia: 120, velocidad: 190, consumo: 21 },
  },
  {
    id: 'media',
    tier: 'Gama Media',
    name: 'AXIS Vantage',
    tagline: 'El equilibrio entre confort y carácter.',
    accent: '#C9CED6',
    img: '/marcas/bmw.png',
    price: 'Desde $34.500',
    stats: { potencia: 250, velocidad: 240, consumo: 15 },
  },
  {
    id: 'alta',
    tier: 'Gama Alta',
    name: 'AXIS Sovereign',
    tagline: 'Ingeniería sin concesiones. Lujo absoluto.',
    accent: '#E7C98A',
    img: '/marcas/mercedes-sunset.png',
    price: 'Desde $92.000',
    stats: { potencia: 620, velocidad: 330, consumo: 11 },
  },
]

// Colores del simulador de pintura
export const PAINTS = [
  { id: 'pearl', name: 'Blanco Perla', body: '#e9ecf1', finish: 'metálico', amb: '#3a4658' },
  { id: 'obsidian', name: 'Negro Obsidiana', body: '#1c1f27', finish: 'mate', amb: '#141821' },
  { id: 'champagne', name: 'Dorado Champán', body: '#e7c98a', finish: 'metálico', amb: '#5a4a24' },
  { id: 'electric', name: 'Cian Eléctrico', body: '#22d3ee', finish: 'metálico', amb: '#0b3b45' },
  { id: 'crimson', name: 'Rojo Soul', body: '#c1121f', finish: 'metálico', amb: '#4a0d13' },
  { id: 'graphite', name: 'Grafito', body: '#5b6067', finish: 'mate', amb: '#2b2f36' },
]
