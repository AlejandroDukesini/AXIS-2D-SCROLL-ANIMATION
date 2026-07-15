import Nav from './components/Nav'
import Hero from './components/Hero'
import GamaCategorizer from './components/GamaCategorizer'
import RoadJourney from './components/RoadJourney'
import Showcase from './components/Showcase'
import ColorStudio from './components/ColorStudio'
import TestDrive from './components/TestDrive'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen bg-obsidian">
      {/* Grano / viñeta sutil para acabado premium */}
      <div className="pointer-events-none fixed inset-0 z-[60] bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(0,0,0,0.55))]" />

      <Nav />
      <main>
        <Hero />
        <GamaCategorizer />
        <RoadJourney />
        <Showcase />
        <ColorStudio />
        <TestDrive />
      </main>
      <Footer />
    </div>
  )
}
