import { useEffect, useState } from 'react'
import { PERF_LITE } from './device'

// Ruta de la imagen protagonista (servida desde /public)
export const CAR_IMG = '/scroll-img/mazda-remove-bk.webp'

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
    // Ruta de la foto (p. ej. '/equipo/representante.jpg' en public/). Mientras
    // sea null se muestran las iniciales, sin pedir un archivo inexistente (404).
    foto: null,
  },
}

// ---------------------------------------------------------------------------
// VALIDACIÓN DE LA CONFIGURACIÓN (frontera de confianza)
// ---------------------------------------------------------------------------
// Los valores de BUSINESS se interpolan dentro de URLs que van a `href`. Si un
// día alguien pega ahí un valor con `/`, `?`, `#`, `@` o `..` (un copy-paste de
// un enlace completo, un CMS, una variable de entorno), la URL resultante deja
// de apuntar a wa.me / instagram.com y el botón se convierte en un redirect
// abierto hacia el sitio del atacante — con la credibilidad de esta marca
// detrás (phishing). Validar aquí, en el único punto donde se construyen las
// URLs, hace que eso sea imposible por construcción y no por disciplina.
//
// Ante un valor inválido se devuelve '#' (enlace inerte) en lugar de navegar a
// un destino inesperado: fallar cerrado es preferible a fallar hacia fuera.
const RE_TELEFONO = /^[0-9]{8,15}$/ // E.164 sin '+', solo dígitos
const RE_INSTAGRAM = /^[A-Za-z0-9._]{1,30}$/ // reglas de handle de Instagram

const LINK_INERTE = '#'

function avisar(campo, valor) {
  // En producción Vite elimina esta rama por completo (import.meta.env.DEV es
  // una constante en build), así que no filtra configuración al usuario final.
  if (import.meta.env.DEV) {
    console.warn(
      `[shared] BUSINESS.${campo} no es válido (${JSON.stringify(valor)}); ` +
        'el enlace queda inerte para no redirigir a un destino no previsto.',
    )
  }
}

export const INSTAGRAM_URL = RE_INSTAGRAM.test(BUSINESS.instagram)
  ? `https://instagram.com/${BUSINESS.instagram}`
  : (avisar('instagram', BUSINESS.instagram), LINK_INERTE)

/** Enlace de WhatsApp con mensaje previo según el contexto del botón. */
export function waLink(mensaje) {
  if (!RE_TELEFONO.test(BUSINESS.whatsapp)) {
    avisar('whatsapp', BUSINESS.whatsapp)
    return LINK_INERTE
  }
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
    // En dispositivos de baja capacidad tampoco: el parallax de cursor es puro
    // adorno y cuesta trabajo de estilo/composición en cada mousemove.
    const update = () => setFine(mq.matches && !rm.matches && !PERF_LITE)
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

// Gamas del concesionario. `id` enlaza con CATEGORIES del inventario; las
// cifras (nº de vehículos, precio desde, potencia máx.) se DERIVAN del
// inventario en categoryStats(), nunca se escriben a mano.
// `img` es la foto de ambiente de la gama (clave del image-manifest) y su
// `imgAlt` describe lo que realmente aparece en la foto.
export const GAMAS = [
  {
    id: 'economico',
    tier: 'Gama Económica',
    name: 'AXIS City',
    tagline: 'Agilidad urbana, consumo bajo y mantenimiento sencillo.',
    accent: '#22D3EE',
    img: 'marcas/volkswagen-taigo',
    imgAlt: 'SUV compacto Volkswagen azul, vista frontal',
  },
  {
    id: 'media',
    tier: 'Gama Media · Premium',
    name: 'AXIS Vantage',
    tagline: 'El equilibrio entre confort, equipamiento y carácter.',
    accent: '#C9CED6',
    img: 'marcas/bmw-serie-2-coupe',
    imgAlt: 'BMW Serie 2 Coupé plateado, vista frontal',
  },
  {
    id: 'lujo',
    tier: 'Lujo · Alto rendimiento',
    name: 'AXIS Sovereign',
    tagline: 'Ingeniería sin concesiones. Lujo y prestaciones absolutas.',
    accent: '#E7C98A',
    img: 'marcas/mercedes-amg-a45',
    imgAlt: 'Mercedes-AMG A 45 negro, vista tres cuartos',
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
