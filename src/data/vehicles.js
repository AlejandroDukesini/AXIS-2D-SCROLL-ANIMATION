// ---------------------------------------------------------------------------
// INVENTARIO — única fuente de verdad de los vehículos.
// ---------------------------------------------------------------------------
// Módulo de datos puro (sin React ni APIs del navegador): lo importa la app y
// también vite.config.js para generar el JSON-LD en el build, así que no debe
// depender de nada que no exista en Node.
//
// Para añadir fotos reales de un vehículo basta con dejar un PNG/JPG con su
// `slug` como nombre en assets-src/vehiculos/ y ejecutar `npm run optimize:images`:
// el pipeline genera las variantes AVIF/WebP y la card deja de usar la ilustración.

/** Gamas del concesionario (orden = orden de los filtros). */
export const CATEGORIES = [
  { id: 'economico', label: 'Económicos', short: 'Económica', accent: '#22D3EE' },
  { id: 'media', label: 'Gama media', short: 'Media · Premium', accent: '#C9CED6' },
  { id: 'lujo', label: 'Premium / Lujo', short: 'Lujo · Alto rendimiento', accent: '#E7C98A' },
]

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

/** Carrocerías soportadas por la ilustración (VehicleArt). */
export const BODY_TYPES = ['Sedán', 'Hatchback', 'SUV', 'Coupé', 'Familiar']
export const FUELS = ['Gasolina', 'Híbrido', 'Híbrido ligero']
export const TRANSMISSIONS = ['Automática', 'Manual']
export const CONDITIONS = ['Nuevo', 'Usado']

/**
 * Campos:
 *  price / oldPrice  USD. `oldPrice` solo si hay rebaja real (se muestra tachado).
 *  power             hp.
 *  transmission      familia (filtro); `gearbox` es el detalle técnico.
 *  color             nombre comercial + hex para la ilustración.
 *  featured          aparece en "Destacados".
 */
export const VEHICLES = [
  // ---------------------------------------------------------------- ECONÓMICA
  {
    slug: 'toyota-yaris-sedan-xls-2025',
    brand: 'Toyota', model: 'Yaris Sedán', trim: 'XLS 1.5',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 21900, category: 'economico', body: 'Sedán',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'CVT de 7 relaciones',
    power: 106, engine: '1.5 L 4 cil.', drivetrain: 'Delantera',
    color: { name: 'Rojo Metálico', hex: '#B3202A' },
    tags: ['Más vendido'],
    features: ['7 airbags', 'Toyota Safety Sense', 'Pantalla 9" con CarPlay', 'Cámara de reversa'],
  },
  {
    slug: 'kia-picanto-gt-line-2024',
    brand: 'Kia', model: 'Picanto', trim: 'GT-Line 1.2',
    year: 2024, condition: 'Usado', mileage: 18400,
    price: 13500, category: 'economico', body: 'Hatchback',
    fuel: 'Gasolina', transmission: 'Manual', gearbox: 'Manual de 5 vel.',
    power: 83, engine: '1.2 L 4 cil.', drivetrain: 'Delantera',
    color: { name: 'Amarillo Shiny', hex: '#E9B824' },
    tags: ['Bajo kilometraje'],
    features: ['Rines 16"', 'Sensor de parqueo', 'Pantalla 8"', 'Un solo dueño'],
  },
  {
    slug: 'hyundai-creta-limited-2025',
    brand: 'Hyundai', model: 'Creta', trim: 'Limited 1.5',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 26900, oldPrice: 28400, category: 'economico', body: 'SUV',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'IVT',
    power: 113, engine: '1.5 L 4 cil.', drivetrain: 'Delantera',
    color: { name: 'Gris Titanio', hex: '#6B7178' },
    tags: ['Oferta'],
    features: ['Hyundai SmartSense', 'Techo panorámico', 'Cargador inalámbrico', 'Tablero digital 10.25"'],
    featured: true,
  },
  {
    slug: 'chevrolet-onix-rs-2024',
    brand: 'Chevrolet', model: 'Onix', trim: 'RS 1.0 Turbo',
    year: 2024, condition: 'Usado', mileage: 22100,
    price: 17800, category: 'economico', body: 'Hatchback',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'Automática de 6 vel.',
    power: 115, engine: '1.0 L turbo 3 cil.', drivetrain: 'Delantera',
    color: { name: 'Negro Ouro', hex: '#1E2024' },
    tags: [],
    features: ['Wi-Fi nativo', 'Alerta de punto ciego', 'Rines 16" negros', 'Garantía vigente'],
  },
  {
    slug: 'renault-duster-intens-2025',
    brand: 'Renault', model: 'Duster', trim: 'Intens 1.3 TCe',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 24500, category: 'economico', body: 'SUV',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'CVT X-Tronic',
    power: 150, engine: '1.3 L turbo 4 cil.', drivetrain: 'Delantera',
    color: { name: 'Verde Kaki', hex: '#5E6B4E' },
    tags: [],
    features: ['Cámara 360°', 'Pantalla 10"', 'Arranque sin llave', '6 airbags'],
  },
  {
    slug: 'nissan-kicks-exclusive-2024',
    brand: 'Nissan', model: 'Kicks', trim: 'Exclusive 1.6',
    year: 2024, condition: 'Usado', mileage: 31000,
    price: 19900, oldPrice: 21300, category: 'economico', body: 'SUV',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'CVT Xtronic',
    power: 118, engine: '1.6 L 4 cil.', drivetrain: 'Delantera',
    color: { name: 'Naranja Monarca', hex: '#C8561E' },
    tags: ['Oferta especial'],
    features: ['Visión 360° inteligente', 'Frenado de emergencia', 'Audio Bose', 'Mantenimientos al día'],
  },
  {
    slug: 'mazda-2-sedan-grand-touring-2024',
    brand: 'Mazda', model: '2 Sedán', trim: 'Grand Touring 1.5',
    year: 2024, condition: 'Usado', mileage: 15200,
    price: 18700, category: 'economico', body: 'Sedán',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'Automática de 6 vel.',
    power: 110, engine: '1.5 L Skyactiv-G', drivetrain: 'Delantera',
    color: { name: 'Azul Profundo', hex: '#1F3A5F' },
    tags: ['Bajo kilometraje'],
    features: ['Head-up display', 'Asientos en cuero', 'Mazda Connect', 'Un solo dueño'],
  },

  // ----------------------------------------------------- MEDIA / PREMIUM
  {
    slug: 'mazda-cx-5-signature-2025',
    brand: 'Mazda', model: 'CX-5', trim: 'Signature 2.5 Turbo AWD',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 41900, category: 'media', body: 'SUV',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'Automática de 6 vel.',
    power: 227, engine: '2.5 L turbo 4 cil.', drivetrain: 'AWD',
    color: { name: 'Soul Red Crystal', hex: '#9E1B24' },
    tags: ['Más vendido'],
    features: ['Cuero Nappa', 'Audio Bose 10 parlantes', 'Cámara 360°', 'Crucero adaptativo'],
    featured: true,
  },
  {
    slug: 'toyota-rav4-hybrid-limited-2025',
    brand: 'Toyota', model: 'RAV4 Hybrid', trim: 'Limited AWD',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 43500, category: 'media', body: 'SUV',
    fuel: 'Híbrido', transmission: 'Automática', gearbox: 'e-CVT',
    power: 219, engine: '2.5 L híbrido', drivetrain: 'AWD-i',
    color: { name: 'Blanco Perlado', hex: '#E6E8EA' },
    tags: ['Eficiente'],
    features: ['Consumo 19 km/l', 'JBL 11 parlantes', 'Portón eléctrico', 'Toyota Safety Sense 3.0'],
  },
  {
    slug: 'honda-accord-hybrid-touring-2024',
    brand: 'Honda', model: 'Accord Hybrid', trim: 'Touring',
    year: 2024, condition: 'Usado', mileage: 24000,
    price: 36900, category: 'media', body: 'Sedán',
    fuel: 'Híbrido', transmission: 'Automática', gearbox: 'e-CVT',
    power: 204, engine: '2.0 L híbrido', drivetrain: 'Delantera',
    color: { name: 'Gris Meteoro', hex: '#4A4F57' },
    tags: [],
    features: ['Google integrado', 'Head-up display', 'Asientos ventilados', 'Honda Sensing'],
  },
  {
    slug: 'volkswagen-tiguan-r-line-2024',
    brand: 'Volkswagen', model: 'Tiguan', trim: 'R-Line 2.0 TSI 4Motion',
    year: 2024, condition: 'Usado', mileage: 19800,
    price: 38900, oldPrice: 41200, category: 'media', body: 'SUV',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'DSG de 7 vel.',
    power: 184, engine: '2.0 L TSI 4 cil.', drivetrain: '4Motion',
    color: { name: 'Azul Lapiz', hex: '#244A86' },
    tags: ['Oferta'],
    features: ['Digital Cockpit Pro', 'Faros IQ.Light', 'Techo panorámico', 'Garantía de fábrica'],
  },
  {
    slug: 'volvo-xc40-b4-plus-2025',
    brand: 'Volvo', model: 'XC40', trim: 'B4 Plus Dark',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 47900, category: 'media', body: 'SUV',
    fuel: 'Híbrido ligero', transmission: 'Automática', gearbox: 'Automática de 8 vel.',
    power: 197, engine: '2.0 L mild hybrid', drivetrain: 'Delantera',
    color: { name: 'Vapour Grey', hex: '#8D939A' },
    tags: ['Premium'],
    features: ['Harman Kardon', 'Google built-in', 'Pilot Assist', 'Techo panorámico'],
  },
  {
    slug: 'audi-a3-sedan-40-tfsi-2024',
    brand: 'Audi', model: 'A3 Sedán', trim: '40 TFSI S line',
    year: 2024, condition: 'Usado', mileage: 12500,
    price: 39500, category: 'media', body: 'Sedán',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'S tronic de 7 vel.',
    power: 204, engine: '2.0 L TFSI 4 cil.', drivetrain: 'Delantera',
    color: { name: 'Gris Daytona', hex: '#3C3F44' },
    tags: ['Bajo kilometraje'],
    features: ['Virtual cockpit plus', 'Paquete S line', 'Faros Matrix LED', 'Un solo dueño'],
  },
  {
    slug: 'bmw-220i-coupe-m-sport-2024',
    brand: 'BMW', model: '220i Coupé', trim: 'M Sport',
    year: 2024, condition: 'Usado', mileage: 16900,
    price: 44900, category: 'media', body: 'Coupé',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'Steptronic de 8 vel.',
    power: 184, engine: '2.0 L TwinPower Turbo', drivetrain: 'Trasera',
    color: { name: 'Blanco Alpino', hex: '#ECEDEE' },
    tags: ['Premium'],
    features: ['Paquete M Sport', 'Live Cockpit Professional', 'Harman Kardon', 'Mantenimiento BSI'],
    featured: true,
  },

  // ------------------------------------------- LUJO / ALTO RENDIMIENTO
  {
    slug: 'mercedes-benz-gle-450-4matic-2025',
    brand: 'Mercedes-Benz', model: 'GLE 450', trim: '4MATIC',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 89900, category: 'lujo', body: 'SUV',
    fuel: 'Híbrido ligero', transmission: 'Automática', gearbox: '9G-TRONIC',
    power: 381, engine: '3.0 L 6 cil. EQ Boost', drivetrain: '4MATIC',
    color: { name: 'Negro Obsidiana', hex: '#15171B' },
    tags: ['Lujo'],
    features: ['MBUX Superscreen', 'Suspensión AIRMATIC', 'Burmester 3D', 'Asientos con masaje'],
    featured: true,
  },
  {
    slug: 'bmw-m3-competition-xdrive-2025',
    brand: 'BMW', model: 'M3 Competition', trim: 'xDrive',
    year: 2025, condition: 'Usado', mileage: 8500,
    price: 96500, category: 'lujo', body: 'Sedán',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'M Steptronic de 8 vel.',
    power: 523, engine: '3.0 L 6 cil. biturbo', drivetrain: 'M xDrive',
    color: { name: 'Isle of Man Green', hex: '#1F5A45' },
    tags: ['Alto rendimiento', 'Bajo kilometraje'],
    features: ['0-100 km/h en 3,5 s', 'Asientos M Carbon', 'Frenos M Compound', 'Escape M Sport'],
    featured: true,
  },
  {
    slug: 'audi-rs-6-avant-performance-2024',
    brand: 'Audi', model: 'RS 6 Avant', trim: 'performance',
    year: 2024, condition: 'Usado', mileage: 14000,
    price: 129900, category: 'lujo', body: 'Familiar',
    fuel: 'Híbrido ligero', transmission: 'Automática', gearbox: 'tiptronic de 8 vel.',
    power: 621, engine: '4.0 L V8 TFSI biturbo', drivetrain: 'quattro',
    color: { name: 'Gris Nardo', hex: '#7E8287' },
    tags: ['Alto rendimiento'],
    features: ['0-100 km/h en 3,4 s', 'Dirección integral', 'Bang & Olufsen 3D', 'Suspensión DRC'],
  },
  {
    slug: 'porsche-911-carrera-s-2025',
    brand: 'Porsche', model: '911 Carrera S', trim: '992.2',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 149900, category: 'lujo', body: 'Coupé',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'PDK de 8 vel.',
    power: 473, engine: '3.0 L bóxer 6 cil. biturbo', drivetrain: 'Trasera',
    color: { name: 'Guards Red', hex: '#C1121F' },
    tags: ['Lujo', 'Nuevo modelo'],
    features: ['Sport Chrono', 'PASM deportivo', 'Escape deportivo', 'Bose Surround'],
    featured: true,
  },
  {
    slug: 'lexus-lx-600-luxury-2024',
    brand: 'Lexus', model: 'LX 600', trim: 'Luxury',
    year: 2024, condition: 'Usado', mileage: 9800,
    price: 112500, category: 'lujo', body: 'SUV',
    fuel: 'Gasolina', transmission: 'Automática', gearbox: 'Automática de 10 vel.',
    power: 409, engine: '3.5 L V6 biturbo', drivetrain: '4x4 permanente',
    color: { name: 'Plata Atómica', hex: '#A9ADB2' },
    tags: ['Bajo kilometraje'],
    features: ['Mark Levinson 25 parlantes', 'Suspensión adaptativa', '7 puestos', 'Garantía Lexus'],
  },
  {
    slug: 'range-rover-sport-p400-dynamic-se-2025',
    brand: 'Range Rover', model: 'Sport', trim: 'P400 Dynamic SE',
    year: 2025, condition: 'Nuevo', mileage: 0,
    price: 108900, category: 'lujo', body: 'SUV',
    fuel: 'Híbrido ligero', transmission: 'Automática', gearbox: 'Automática de 8 vel.',
    power: 395, engine: '3.0 L 6 cil. MHEV', drivetrain: 'AWD',
    color: { name: 'Varesine Blue', hex: '#2B3A55' },
    tags: ['Lujo'],
    features: ['Suspensión neumática', 'Meridian 3D', 'Pivi Pro 13.1"', 'Terrain Response 2'],
  },
]

// --------------------------------------------------------------- helpers ---

export const fullName = (v) => `${v.brand} ${v.model}`

const priceFmt = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const numFmt = new Intl.NumberFormat('es-CO')

export const formatPrice = (n) => priceFmt.format(n)
export const formatKm = (n) => (n === 0 ? '0 km' : `${numFmt.format(n)} km`)
export const formatNumber = (n) => numFmt.format(n)

/** Resumen por gama derivado del inventario (nada de cifras escritas a mano). */
export function categoryStats(categoryId) {
  const list = VEHICLES.filter((v) => v.category === categoryId)
  return {
    count: list.length,
    minPrice: Math.min(...list.map((v) => v.price)),
    maxPower: Math.max(...list.map((v) => v.power)),
    brands: [...new Set(list.map((v) => v.brand))],
  }
}
