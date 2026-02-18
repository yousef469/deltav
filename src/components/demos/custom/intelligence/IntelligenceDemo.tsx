import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GeminiService } from './services/GeminiService'
import type { GeminiPlan, GeminiStep } from './services/GeminiService'

// Sidebar Component
function Sidebar({ activeMode }: { activeMode: string }) {
    const modes = [
        { id: 'chat', icon: '💬', label: 'AI Chat' },
        { id: '3d', icon: '🧊', label: '3D Viewer' },
        { id: 'sim', icon: '🔬', label: 'Simulations' },
        { id: 'image', icon: '🎨', label: 'Image Creation' },
        { id: 'demo', icon: '🚀', label: 'System Demo' },
        { id: 'video', icon: '🎬', label: 'Video Creation' },
        { id: '3dgen', icon: '🛠️', label: '3D Modeling' },
    ]

    return (
        <div className="w-16 bg-[#0a0a12] border-r border-[#ffffff10] flex flex-col items-center py-4 gap-4">
            {modes.map(mode => (
                <button
                    key={mode.id}
                    className={`p-3 rounded-lg relative group transition-colors ${activeMode === mode.id ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-gray-500 hover:text-white'}`}
                >
                    {mode.icon}
                    <span className="absolute left-14 bg-black px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {mode.label}
                    </span>
                </button>
            ))}
            <div className="mt-auto">
                <button className="p-3 text-gray-500 hover:text-white transition-colors">⚙️</button>
            </div>
        </div>
    )
}

// Main Intelligence Demo Component
export default function IntelligenceDemo() {
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '')
    const [tempKey, setTempKey] = useState('')
    const [userPrompt, setUserPrompt] = useState('Analyze my Martian Habitat project results')
    const [steps, setSteps] = useState<GeminiStep[]>([])
    const [isRunning, setIsRunning] = useState(false)
    const [currentLog, setCurrentLog] = useState<string[]>([])
    const [showVision, setShowVision] = useState(false)
    const [finalSynthesis, setFinalSynthesis] = useState<string | null>(null)
    const [reasoning, setReasoning] = useState<string | null>(null)
    const [activeModel, setActiveModel] = useState<string | null>(null)
    const [memory, setMemory] = useState(localStorage.getItem('jarvis_memory') || '')

    const gemini = useMemo(() => new GeminiService(apiKey), [apiKey])

    const addLog = (msg: string) => {
        setCurrentLog(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15))
    }

    const saveApiKey = (key: string) => {
        setApiKey(key)
        localStorage.setItem('gemini_api_key', key)
    }

    const runRealDemo = async () => {
        if (isRunning || !apiKey) return
        setIsRunning(true)
        setCurrentLog([])
        setFinalSynthesis(null)
        setReasoning(null)
        setShowVision(false)

        try {
            addLog("Brain: Initializing cognitive handshake with Gemini...")

            const plan: GeminiPlan = await gemini.generatePlan(userPrompt, memory)
            setReasoning(plan.reasoning)
            setActiveModel(gemini.getActiveModel())
            const localSteps: GeminiStep[] = plan.steps.map(s => {
                let description = s.description;
                if (s.id === 0 && memory) {
                    const facts = memory.split('\n').slice(-2).join('; ');
                    description = `Retrieved: ${facts}...`;
                }
                return { ...s, description, status: 'pending' };
            })
            setSteps(localSteps)

            addLog(`Plan generated. Reasoning: ${plan.reasoning}`)
            addLog(`Workers assigned: ${plan.workers.join(', ')}`)

            for (let i = 0; i < localSteps.length; i++) {
                setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'active' } : s))
                addLog(`Processing ${localSteps[i].title}...`)
                await new Promise(r => setTimeout(r, 2000))

                if (localSteps[i].id === 2) {
                    if (plan.workers.includes('vision')) {
                        setShowVision(true)
                        addLog("VisionWorker: Screen context captured and parsed.")
                    }
                }

                setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s))
            }

            addLog("Finalizing results. Synthesizing response...")
            const synthesis = await gemini.generateSynthesis(userPrompt, plan, memory)
            setFinalSynthesis(synthesis)

            addLog("MemoryWorker: Extracting long-term facts...")
            const newFact = await gemini.extractMemory(userPrompt, synthesis)
            if (newFact) {
                const updatedMemory = memory ? `${memory}\n${newFact}` : newFact;
                setMemory(updatedMemory);
                localStorage.setItem('jarvis_memory', updatedMemory);
                addLog(`Memory Updated: ${newFact}`);
            }

            addLog("Workflow Complete. Sir, your systems are updated.")
        } catch (error: any) {
            addLog(`Error: ${error.message}`)
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <div className="h-full w-full bg-[#0a0a12] text-[#e8e8f0] font-sans overflow-hidden flex flex-col relative rounded-xl border border-white/10 shadow-2xl">
            {/* API Key Modal */}
            {!apiKey && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-[#12121e] border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-4 text-[#00f0ff]">Gemini API Key Required</h2>
                        <input
                            type="password"
                            autoFocus
                            value={tempKey}
                            placeholder="Paste API key..."
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00f0ff] outline-none mb-4 text-white"
                            onChange={(e) => setTempKey(e.target.value)}
                        />
                        <button
                            onClick={() => { if (tempKey.trim()) saveApiKey(tempKey.trim()) }}
                            className="w-full bg-[#00f0ff] text-black px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
                        >
                            Initialize System
                        </button>
                    </div>
                </div>
            )}

            {/* Window Layout */}
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeMode="demo" />

                <div className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
                    {/* Header */}
                    <div className="flex flex-col bg-[#12121e] p-5 rounded-2xl border border-white/10 shadow-lg gap-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold bg-gradient-to-r from-[#00f0ff] to-[#0066ff] bg-clip-text text-transparent uppercase tracking-wider">
                                    Autonomous Cognitive Pipeline
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-xs text-gray-400">Real-time reasoning engine</p>
                                    {activeModel && (
                                        <span className="text-[10px] bg-[#0066ff]/20 text-[#0066ff] px-2 py-0.5 rounded-full font-mono uppercase border border-[#0066ff]/30">
                                            {activeModel}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => { localStorage.removeItem('gemini_api_key'); setApiKey(''); }} className="text-[10px] text-gray-500 hover:text-white transition-colors">RESET KEY</button>
                                <div className="w-px h-3 bg-white/10" />
                                <button onClick={() => { localStorage.removeItem('jarvis_memory'); setMemory(''); addLog("Memory wiped."); }} className="text-[10px] text-gray-500 hover:text-red-400 transition-colors">WIPE MEMORY</button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <input
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder="What should JARVIS do?"
                                disabled={isRunning}
                                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#00f0ff] outline-none transition-all placeholder:text-gray-600"
                            />
                            <button
                                onClick={runRealDemo}
                                disabled={isRunning || !apiKey}
                                className={`px-8 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 text-sm ${isRunning ? 'bg-white/5 text-gray-500 cursor-not-allowed' : 'bg-[#00f0ff] hover:opacity-90 text-black shadow-[0_0_20px_rgba(0,240,255,0.3)]'}`}
                            >
                                {isRunning ? <span className="animate-spin">⚙️</span> : '▶'} {isRunning ? 'PROCESSING' : 'EXECUTE LOOP'}
                            </button>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-12 flex-1 gap-6 min-h-0">
                        {/* Step Visualization */}
                        <div className="col-span-4 bg-[#12121e] rounded-2xl border border-white/10 p-4 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                            <div className="flex justify-between items-center mb-1 border-b border-white/5 pb-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Cognitive Steps</h3>
                                {reasoning && <span className="text-[9px] text-[#00f0ff]/80 font-mono italic truncate max-w-[120px]">{reasoning}</span>}
                            </div>
                            <div className="flex flex-col gap-3">
                                {steps.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-20">
                                        <div className="text-4xl mb-4">🧠</div>
                                        <p className="text-xs italic text-center">Awaiting Input...</p>
                                    </div>
                                ) : (
                                    steps.map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1, x: 0,
                                                borderColor: step.status === 'active' ? '#00f0ff' : 'rgba(255,255,255,0.1)'
                                            }}
                                            className={`p-3 rounded-xl border transition-colors ${step.status === 'completed' ? 'bg-[#00f0ff]/10' : step.status === 'active' ? 'bg-[#00f0ff]/20' : 'bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{step.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <span className={`text-xs font-semibold ${step.status === 'active' ? 'text-[#00f0ff]' : 'text-gray-300'}`}>{step.title}</span>
                                                        {step.status === 'completed' && <span className="text-[#00f0ff] text-xs">✓</span>}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-1 leading-tight">{step.description}</p>
                                                </div>
                                            </div>
                                            {step.status === 'active' && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, ease: "linear" }} className="h-0.5 bg-[#00f0ff] mt-2 rounded-full" />}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Area */}
                        <div className="col-span-8 flex flex-col gap-6 min-h-0">
                            {/* Vision Area */}
                            <div className="flex-1 bg-[#12121e] rounded-2xl border border-white/10 relative overflow-hidden flex flex-col">
                                <div className="p-3 border-b border-white/5 bg-black/20 flex justify-between items-center">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Workspace Monitoring</span>
                                    <div className="flex gap-2 items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]" />
                                        <div className="text-[9px] text-[#00f0ff] font-mono">LIVE_FEED</div>
                                    </div>
                                </div>
                                <div className="flex-1 relative overflow-y-auto p-6 flex flex-col items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        {finalSynthesis ? (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
                                                <div className="text-4xl mb-4">✨</div>
                                                <h4 className="text-[#00f0ff] font-bold mb-3 uppercase tracking-widest text-xs">Synthesis Complete</h4>
                                                <p className="text-base leading-relaxed font-serif italic text-gray-300">"{finalSynthesis}"</p>
                                            </motion.div>
                                        ) : showVision ? (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative border border-[#00f0ff]/30 rounded-lg bg-black/40 overflow-hidden">
                                                <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10 pointer-events-none">
                                                    {Array.from({ length: 64 }).map((_, i) => <div key={i} className="border border-white/20" />)}
                                                </div>
                                                <motion.div animate={{ top: ["0%", "100%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-px bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                    <div className="w-24 h-24 border-2 border-dashed border-[#00f0ff]/30 rounded-full animate-spin-slow" />
                                                    <span className="text-[10px] font-mono text-[#00f0ff] animate-pulse">Scanning Visual Context...</span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-700 opacity-50 gap-3">
                                                <div className="text-4xl">🔭</div>
                                                <span className="text-xs font-mono tracking-widest">Awaiting Visual Task</span>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Logs */}
                            <div className="h-40 bg-[#0a0a12] rounded-2xl border border-white/10 p-4 flex flex-col font-mono text-[10px]">
                                <div className="flex justify-between items-center mb-2 px-1 border-b border-white/5 pb-2">
                                    <h3 className="font-bold uppercase tracking-widest text-gray-500">System Logs</h3>
                                    <div className="text-gray-600">{apiKey ? 'ONLINE' : 'OFFLINE'}</div>
                                </div>
                                <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-1 pr-2 custom-scrollbar">
                                    {currentLog.map((log, i) => (
                                        <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} key={i} className="text-gray-400 border-l-2 border-white/10 pl-2 py-0.5">
                                            <span className="text-[#00f0ff]/50 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                            {log.replace(/\[.*?\] /, '')}
                                        </motion.div>
                                    ))}
                                    {currentLog.length === 0 && <span className="opacity-20 italic mt-auto p-2">System idle.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.animate-spin-slow { animation: spin 8s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
