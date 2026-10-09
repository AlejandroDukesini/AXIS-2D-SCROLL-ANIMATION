import { memo, useId } from 'react'

// ---------------------------------------------------------------------------
// ILUSTRACIÓN DE ESTUDIO (placeholder coherente)
// ---------------------------------------------------------------------------
// Mientras no haya fotos reales de cada unidad, todas las cards usan la MISMA
// dirección de arte: perfil lateral mirando a la derecha, mismo encuadre,
// misma luz cenital y misma sombra de suelo; solo cambian la carrocería y el
// color real del vehículo. Es preferible a mezclar fotos de bancos de imágenes
// con ángulos, fondos y resoluciones distintos (o que no correspondan al modelo).
//
// Ventajas técnicas: SVG en línea → 0 peticiones de red, nítido a cualquier
// densidad de píxeles (también 4K) y con caja fija (viewBox) → sin CLS.
// Cuando exista assets-src/vehiculos/<slug>.png, <VehicleMedia> usa la foto.

const W = 480
const H = 210

// Contorno superior (de la base trasera a la base delantera); los pasos de
// rueda se generan a partir de la posición de las ruedas.
const PROFILES = {
  Sedán: {
    r: 33, by: 152, wheels: [118, 364],
    upper: 'M46 152 L40 132 C40 118 48 112 64 109 L130 103 C158 88 184 67 216 63 L290 61 C318 61 336 80 358 98 L420 106 C438 109 448 118 448 132 L446 146 Q445 152 438 152',
    glass: 'M144 102 C168 88 192 71 220 68 L286 66 C308 66 324 81 341 99 L341 101 Z',
    pillars: [258], doors: [200, 302], belt: 'M64 116 L440 118',
    head: 'M430 112 Q442 113 447 118 L447 122 L430 120 Z',
    tail: 'M41 118 L58 116 L58 123 L41 125 Z',
  },
  Hatchback: {
    r: 31, by: 152, wheels: [130, 352],
    upper: 'M66 152 L62 128 C62 114 68 104 80 96 C96 82 126 66 160 62 L268 60 C294 61 314 78 336 97 L404 106 C421 109 430 118 430 131 L428 146 Q427 152 420 152',
    glass: 'M88 98 C104 85 132 70 164 67 L266 66 C287 67 303 80 320 98 Z',
    pillars: [234], doors: [200, 292], belt: 'M70 112 L424 117',
    head: 'M414 112 Q425 113 430 118 L430 122 L414 120 Z',
    tail: 'M63 110 L77 109 L77 119 L63 120 Z',
  },
  SUV: {
    r: 37, by: 152, lift: 6, wheels: [120, 362],
    upper: 'M42 154 L40 112 C40 100 46 92 56 88 L76 64 C82 57 92 53 104 53 L300 51 C318 51 330 59 344 75 L362 97 L424 105 C440 107 450 117 450 129 L448 146 Q447 152 440 152',
    glass: 'M64 94 L82 70 C87 64 94 60 106 60 L296 59 C310 59 320 65 330 77 L346 97 L64 97 Z',
    pillars: [156, 254], doors: [200, 300], belt: 'M44 106 L446 110',
    rail: 'M110 49 L292 47', cladding: true,
    head: 'M428 110 Q442 111 450 117 L450 121 L428 119 Z',
    tail: 'M41 100 L53 99 L53 116 L41 117 Z',
  },
  Coupé: {
    r: 33, by: 152, wheels: [124, 366],
    upper: 'M50 152 L46 134 C46 121 56 113 72 109 C110 99 150 72 200 63 C232 58 262 59 288 69 C312 78 334 92 352 102 L424 111 C440 114 450 123 450 135 L448 147 Q447 152 440 152',
    glass: 'M132 101 C160 85 184 71 208 68 C236 65 262 67 282 75 C300 82 315 91 328 100 Z',
    pillars: [246], doors: [262], belt: 'M70 117 L444 121',
    head: 'M430 115 Q443 117 450 123 L450 127 L430 124 Z',
    tail: 'M47 120 L64 117 L64 124 L47 127 Z',
  },
  Familiar: {
    r: 33, by: 152, wheels: [118, 364],
    upper: 'M40 152 L38 120 C38 108 44 100 54 95 L70 70 C76 62 86 59 98 59 L292 59 C318 60 336 78 358 98 L422 106 C440 109 448 118 448 132 L446 146 Q445 152 438 152',
    glass: 'M62 96 L78 73 C82 67 90 65 100 65 L288 65 C308 66 324 81 341 99 L60 98 Z',
    pillars: [150, 254], doors: [196, 302], belt: 'M44 114 L442 118',
    rail: 'M104 57 L286 57',
    head: 'M428 112 Q441 113 447 118 L447 122 L428 120 Z',
    tail: 'M39 104 L51 103 L51 118 L39 119 Z',
  },
}

/** Contorno completo: parte superior + base con los dos pasos de rueda. */
function bodyPath(p) {
  const ar = p.r + 6
  const [xr, xf] = p.wheels
  const y = p.by
  return `${p.upper} L${xf + ar} ${y} A${ar} ${ar} 0 0 0 ${xf - ar} ${y} L${xr + ar} ${y} A${ar} ${ar} 0 0 0 ${xr - ar} ${y} Z`
}

// Mezcla lineal de un color hex con blanco/negro (sombreado del volumen).
function mix(hex, target, t) {
  const n = parseInt(hex.slice(1), 16)
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  const to = target === 'white' ? 255 : 0
  return `rgb(${c.map((v) => Math.round(v + (to - v) * t)).join(',')})`
}

function spokes(cx, cy, rHub, rRim, count = 5) {
  let d = ''
  for (let i = 0; i < count; i++) {
    const a = (i * 2 * Math.PI) / count - Math.PI / 2
    const pt = (r, da) => `${(cx + r * Math.cos(a + da)).toFixed(1)} ${(cy + r * Math.sin(a + da)).toFixed(1)}`
    d += `M${pt(rHub, -0.42)} L${pt(rRim, -0.17)} L${pt(rRim, 0.17)} L${pt(rHub, 0.42)} Z `
  }
  return d
}

function VehicleArt({ body = 'Sedán', color = '#C9CED6', label, className }) {
  const p = PROFILES[body] || PROFILES.Sedán
  const uid = useId().replace(/:/g, '')
  const id = (k) => `${k}${uid}`
  const outline = bodyPath(p)
  const cy = p.by + 2 + (p.lift || 0)
  const ground = cy + p.r
  const ar = p.r + 6
  const rimR = p.r * 0.66

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={id('paint')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mix(color, 'white', 0.38)} />
          <stop offset="0.42" stopColor={color} />
          <stop offset="0.75" stopColor={mix(color, 'black', 0.25)} />
          <stop offset="1" stopColor={mix(color, 'black', 0.55)} />
        </linearGradient>
        <linearGradient id={id('glass')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b3442" />
          <stop offset="0.55" stopColor="#10141b" />
          <stop offset="1" stopColor="#1c232e" />
        </linearGradient>
        <radialGradient id={id('rim')} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#e6e9ee" />
          <stop offset="0.6" stopColor="#9aa1ab" />
          <stop offset="1" stopColor="#4b5059" />
        </radialGradient>
        <radialGradient id={id('shadow')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.7" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id('gloss')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={id('glassClip')}>
          <path d={p.glass} />
        </clipPath>
        <clipPath id={id('clip')}>
          <path d={outline} />
        </clipPath>
      </defs>

      {/* Sombra de contacto */}
      <ellipse cx={W / 2} cy={ground + 2} rx={W * 0.44} ry="11" fill={`url(#${id('shadow')})`} />

      {/* Pasos de rueda (fondo oscuro) */}
      {p.wheels.map((x) => (
        <circle key={x} cx={x} cy={p.by} r={ar - 1} fill="#06070a" />
      ))}

      {/* Carrocería */}
      <path d={outline} fill={`url(#${id('paint')})`} />
      <g clipPath={`url(#${id('clip')})`}>
        {/* Reflejo del techo/hombro: luz cenital de estudio */}
        <path d={p.belt} stroke="#fff" strokeOpacity="0.28" strokeWidth="1.4" fill="none" />
        <rect x="0" y="0" width={W} height={p.by - 58} fill="#fff" opacity="0.06" />
        {/* Reflejo de softbox de estudio en el lateral */}
        <rect x="0" y={p.by - 34} width={W} height="9" fill={`url(#${id('gloss')})`} />
        {p.cladding && <rect x="0" y={p.by - 16} width={W} height="20" fill="#000" opacity="0.38" />}
        <rect x="0" y={p.by - 6} width={W} height="8" fill="#000" opacity="0.28" />
        {p.doors.map((x) => (
          <path key={x} d={`M${x} ${p.by - 52} L${x + 2} ${p.by - 4}`} stroke="#000" strokeOpacity="0.35" strokeWidth="1.2" />
        ))}
        {p.doors.map((x) => (
          <rect key={`h${x}`} x={x + 22} y={p.by - 38} width="16" height="3" rx="1.5" fill="#000" opacity="0.35" />
        ))}
      </g>

      {p.cladding &&
        p.wheels.map((x) => (
          <path key={`c${x}`} d={`M${x + ar + 3} ${p.by} A${ar + 3} ${ar + 3} 0 0 0 ${x - ar - 3} ${p.by}`} fill="none" stroke="#0d0f12" strokeWidth="6" />
        ))}

      {/* Ventanas */}
      <path d={p.glass} fill={`url(#${id('glass')})`} />
      <path d={p.glass} fill="none" stroke="#000" strokeOpacity="0.45" strokeWidth="1" />
      {p.pillars.map((x) => (
        <rect key={x} x={x - 3} y="40" width="6" height="70" fill={mix(color, 'black', 0.5)} clipPath={`url(#${id('glassClip')})`} />
      ))}
      {p.rail && <path d={p.rail} stroke="#0c0e12" strokeWidth="3.5" strokeLinecap="round" />}

      {/* Ópticas */}
      <path d={p.head} fill="#eef6ff" />
      <path d={p.head} fill="none" stroke="#9fd8ff" strokeOpacity="0.6" />
      <path d={p.tail} fill="#c3141f" />

      {/* Ruedas */}
      {p.wheels.map((x) => (
        <g key={`w${x}`}>
          <circle cx={x} cy={cy} r={p.r} fill="#0b0d10" />
          <circle cx={x} cy={cy} r={p.r - 4} fill="none" stroke="#1d2127" strokeWidth="2" />
          <circle cx={x} cy={cy} r={rimR} fill="#16191e" />
          <path d={spokes(x, cy, rimR * 0.28, rimR * 0.96)} fill={`url(#${id('rim')})`} />
          <circle cx={x} cy={cy} r={rimR - 1.5} fill="none" stroke={`url(#${id('rim')})`} strokeWidth="3" />
          <circle cx={x} cy={cy} r={rimR * 0.24} fill="#c9ced6" stroke="#2a2e35" />
        </g>
      ))}
    </svg>
  )
}

export default memo(VehicleArt)
