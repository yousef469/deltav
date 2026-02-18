import { Navbar } from "./components/layout/Navbar"
import { Footer } from "./components/layout/Footer"
import { Hero } from "./sections/Hero"
import { Projects } from "./sections/Projects"
import { VectorAI } from "./components/layout/VectorAI"
import { SpaceBackground } from './components/layout/SpaceBackground'

function App() {
  return (
    <div className="min-h-screen w-full text-brand-text relative">
      <SpaceBackground />

      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Projects />
      </main>
      <VectorAI />
      <Footer />
    </div>
  )
}

export default App
