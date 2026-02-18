import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import DemoMode from './components/DemoMode'

function App() {
  const [theme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app-container" data-theme={theme}>
      {/* Titlebar */}
      <div className="titlebar">
        <div className="titlebar-left">
          <div className="titlebar-brand">
            <span className="brand-icon">◈</span>
            <span>JARVIS SYSTEM DEMO</span>
          </div>
        </div>
        <div className="titlebar-center">
          Cognitive Automation Workflow
        </div>
        <div className="titlebar-right">
          <button title="Toggle theme">☀️</button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main-layout">
        <Sidebar activeMode="demo" />
        <div className="content-area">
          <DemoMode />
        </div>
      </div>

      {/* Status Bar */}
      <div className="statusbar">
        <div className="statusbar-left">
          <span>
            <span className="status-dot connected"></span>
            Jarvis Online
          </span>
        </div>
        <div className="statusbar-right">
          <span>Mode: Demo</span>
          <span>Gemini 1.5 Flash</span>
        </div>
      </div>
    </div>
  )
}

export default App
