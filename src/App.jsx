import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'

// Secciones bajo el fold: se cargan de forma diferida (code-splitting).
// El Hero y la Nav entran en el bundle inicial porque son lo primero visible;
// el resto se descarga en chunks separados mientras el usuario ve el Hero.
const GamaCategorizer = lazy(() => import('./components/GamaCategorizer'))
const RoadJourney = lazy(() => import('./components/RoadJourney'))
const Showcase = lazy(() => import('./components/Showcase'))
const ColorStudio = lazy(() => import('./components/ColorStudio'))
const Contacto = lazy(() => import('./components/Contacto'))
const Footer = lazy(() => import('./components/Footer'))

export default function App() {
  return (
    <div className="relative min-h-screen bg-obsidian">
      {/* Grano / viñeta sutil para acabado premium */}
      <div className="pointer-events-none fixed inset-0 z-[60] bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.55))]" />

      <Nav />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <GamaCategorizer />
          <RoadJourney />
          <Showcase />
          <ColorStudio />
          <Contacto />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
