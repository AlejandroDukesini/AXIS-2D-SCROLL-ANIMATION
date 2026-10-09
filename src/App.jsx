import { lazy, Suspense, useEffect } from 'react'
import { LazyMotion, MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import InventorySkeleton from './components/InventorySkeleton'

// Secciones bajo el fold: se cargan de forma diferida (code-splitting).
// El Hero y la Nav entran en el bundle inicial porque son lo primero visible;
// el resto se descarga en chunks separados mientras el usuario ve el Hero.
const GamaCategorizer = lazy(() => import('./components/GamaCategorizer'))
const Inventory = lazy(() => import('./components/Inventory'))
const Showcase = lazy(() => import('./components/Showcase'))
const RoadJourney = lazy(() => import('./components/RoadJourney'))
const ColorStudio = lazy(() => import('./components/ColorStudio'))
const Contacto = lazy(() => import('./components/Contacto'))
const Footer = lazy(() => import('./components/Footer'))
const VehicleDialogs = lazy(() => import('./components/VehicleDialogs'))

// El motor de animación/gestos de Framer Motion (~25 KB gz) se descarga en
// paralelo y fuera de la ruta crítica; el primer render solo usa `m` + hooks.
const loadMotionFeatures = () => import('./lib/motionFeatures').then((m) => m.default)

export default function App() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      {/* reducedMotion="user": Framer respeta prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen bg-obsidian">
          <a href="#inventario" className="skip-link">
            Saltar al inventario
          </a>

          {/* Viñeta sutil para acabado premium (capa fija, solo composición) */}
          <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_50%_50%,transparent_62%,rgba(0,0,0,0.45))]"
          />

          <Nav />
          <main id="contenido">
            <Hero />
            <Suspense fallback={<InventorySkeleton />}>
              <GamaCategorizer />
              <Inventory />
            </Suspense>
            <Suspense fallback={null}>
              <Showcase />
              <RoadJourney />
              <ColorStudio />
              <Contacto />
              <HashScroll />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <Footer />
            <VehicleDialogs />
          </Suspense>
        </div>
      </MotionConfig>
    </LazyMotion>
  )
}

/**
 * Las secciones llegan en diferido, así que si se entra con un ancla
 * (/#inventario, /#contacto…) el navegador no encuentra el destino al cargar.
 * Este componente se monta cuando ya existen y repite la navegación al ancla.
 */
function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id || id.startsWith('vehiculo/')) return
    document.getElementById(id)?.scrollIntoView()
  }, [])
  return null
}
