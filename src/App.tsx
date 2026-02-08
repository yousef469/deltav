import { useState } from "react"
import { Navbar } from "./components/layout/Navbar"
import { Footer } from "./components/layout/Footer"
import { Hero } from "./sections/Hero"
import { Services } from "./sections/Services"
import { About } from "./sections/About"
import { Contact } from "./sections/Contact"
import { WorkingStation } from "./pages/WorkingStation"
import { VectorAI } from "./components/layout/VectorAI"

function App() {
  const [showWorkingStation, setShowWorkingStation] = useState(false)

  if (showWorkingStation) {
    return <WorkingStation onBack={() => setShowWorkingStation(false)} />
  }

  return (
    <div className="bg-brand-black min-h-screen w-full text-white selection:bg-brand-accent selection:text-brand-black">
      <Navbar />
      <main>
        <Hero onStart={() => setShowWorkingStation(true)} />
        <Services />
        <About />
        <Contact onStart={() => setShowWorkingStation(true)} />
      </main>
      <VectorAI />
      <Footer />
    </div>
  )
}

export default App
