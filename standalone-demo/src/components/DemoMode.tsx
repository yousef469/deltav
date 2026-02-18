import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GeminiService } from '../services/GeminiService'
import type { GeminiPlan, GeminiStep } from '../services/GeminiService'

interface CognitiveStep extends GeminiStep {
    status: 'pending' | 'active' | 'completed'
}

export default function DemoMode() {
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
    const [tempKey, setTempKey] = useState('')
    const [userPrompt, setUserPrompt] = useState('Analyze my Martian Habitat project results')
    const [steps, setSteps] = useState<CognitiveStep[]>([])
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

            // Step 1: Planning (Real AI with Memory Context)
            const plan: GeminiPlan = await gemini.generatePlan(userPrompt, memory)
            setReasoning(plan.reasoning)
            setActiveModel(gemini.getActiveModel())
            const localSteps: CognitiveStep[] = plan.steps.map(s => {
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
                // Set current step to active
                setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'active' } : s))
                addLog(`Processing ${localSteps[i].title}...`)

                // Simulate execution duration based on complexity
                await new Promise(r => setTimeout(r, 2000))

                // Special visual triggers
                if (localSteps[i].id === 2) {
                    if (plan.workers.includes('vision')) {
                        setShowVision(true)
                        addLog("VisionWorker: Screen context captured and parsed.")
                    }
                    if (plan.workers.includes('automation')) {
                        addLog("AutomationWorker: System-level command queued.")
                    }
                }

                // Set current step to completed
                setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'completed' } : s))
            }

            // Step 5: Synthesis (Real AI)
            addLog("Finalizing results. Synthesizing response...")
            const synthesis = await gemini.generateSynthesis(userPrompt, plan, memory)
            setFinalSynthesis(synthesis)

            // Step 6: Memory Extraction (Post-Synthesis)
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
        <div className="h-full w-full bg-[var(--bg-app)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-glow)] overflow-hidden flex flex-col p-6 gap-6">
            {/* API Key Modal / Overlay if missing */}
            {!apiKey && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Gemini API Key Required</h2>
                        <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                            To run the real-time cognitive workflow, please provide a Gemini API Key.
                            Your key is stored locally in your browser.
                        </p>
                        <input
                            type="password"
                            autoFocus
                            value={tempKey}
                            placeholder="Paste your API key here..."
                            className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-primary)] outline-none mb-4 text-white"
                            onChange={(e) => setTempKey(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => {
                                    if (tempKey.trim()) {
                                        saveApiKey(tempKey.trim());
                                        window.location.reload();
                                    }
                                }}
                                className="bg-[var(--accent-primary)] text-black px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header / Command Center */}
            <div className="flex flex-col bg-[var(--bg-surface)] p-5 rounded-2xl border border-[var(--border-subtle)] shadow-2xl gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-[var(--jarvis-cyan)] to-[var(--jarvis-blue)] bg-clip-text text-transparent">
                            Autonomous Cognitive Pipeline
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-[var(--text-secondary)]">Real-time reasoning</p>
                            {activeModel && (
                                <span className="text-[10px] bg-[var(--accent-glow)] text-[var(--text-accent)] px-2 py-0.5 rounded-full font-mono uppercase">
                                    {activeModel}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => { localStorage.removeItem('gemini_api_key'); setApiKey(''); }}
                            className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Change API Key
                        </button>
                        <div className="w-px h-3 bg-[var(--border-subtle)]" />
                        <button
                            onClick={() => { localStorage.removeItem('jarvis_memory'); setMemory(''); addLog("Memory wiped."); }}
                            className="text-[10px] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        >
                            Wipe Memory
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <input
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="What should JARVIS do?"
                        disabled={isRunning}
                        className="flex-1 bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:border-[var(--accent-primary)] outline-none transition-all"
                    />
                    <button
                        onClick={runRealDemo}
                        disabled={isRunning || !apiKey}
                        className={`px-8 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${isRunning
                            ? 'bg-[var(--bg-surface-2)] text-[var(--text-muted)] cursor-not-allowed'
                            : 'bg-[var(--accent-primary)] hover:opacity-90 text-black shadow-[var(--shadow-glow)]'
                            }`}
                    >
                        {isRunning ? <span className="animate-spin text-lg">⚙️</span> : '▶'} {isRunning ? 'Processing...' : 'Execute Loop'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 flex-1 gap-6 min-h-0">
                {/* Left: Pipeline Visualizer */}
                <div className="col-span-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] p-6 flex flex-col gap-4 overflow-y-auto relative">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Cognitive Steps</h3>
                        {reasoning && <span className="text-[9px] text-[var(--text-accent)]/80 font-mono italic truncate max-w-[150px]">{reasoning}</span>}
                    </div>

                    <div className="flex flex-col gap-3">
                        {steps.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20">
                                <div className="text-4xl mb-4">🧠</div>
                                <p className="text-xs italic text-center">Enter a prompt and hit Execute<br />to generate a real plan.</p>
                            </div>
                        ) : (
                            steps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        scale: step.status === 'active' ? 1.02 : 1,
                                        borderColor: step.status === 'active' ? 'var(--border-active)' : 'var(--border-subtle)'
                                    }}
                                    className={`p-4 rounded-xl border transition-colors ${step.status === 'completed' ? 'bg-[var(--accent-glow)]' :
                                        step.status === 'active' ? 'bg-[var(--accent-glow-strong)]' : 'bg-white/2'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{step.icon}</span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm font-semibold ${step.status === 'active' ? 'text-[var(--text-accent)]' : ''}`}>
                                                    {step.title}
                                                </span>
                                                {step.status === 'completed' && <span className="text-[var(--text-accent)]">✓</span>}
                                            </div>
                                            <p className="text-[10px] text-[var(--text-secondary)] mt-1 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                    {step.status === 'active' && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 2, ease: "linear" }}
                                            className="h-1 bg-[var(--accent-primary)] mt-3 rounded-full"
                                        />
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Workspace Preview */}
                <div className="col-span-8 flex flex-col gap-6 min-h-0">
                    {/* Vision / Results Area */}
                    <div className="flex-1 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-subtle)] relative overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-[var(--border-subtle)] bg-black/20 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Workspace Monitoring</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-[var(--jarvis-cyan)] animate-pulse shadow-[0_0_8px_var(--jarvis-cyan)]" />
                                <div className="text-[10px] text-[var(--text-accent)] font-mono">LIVE_FEED</div>
                            </div>
                        </div>

                        <div className="flex-1 relative overflow-y-auto">
                            <AnimatePresence mode="wait">
                                {finalSynthesis ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-8 h-full flex flex-col items-center justify-center text-center"
                                    >
                                        <div className="text-3xl mb-4">✨</div>
                                        <h4 className="text-[var(--text-accent)] font-bold mb-3 uppercase tracking-widest text-xs">Synthesis Complete</h4>
                                        <p className="text-lg leading-relaxed max-w-lg font-serif italic text-[var(--text-primary)]/90">
                                            "{finalSynthesis}"
                                        </p>
                                    </motion.div>
                                ) : showVision ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full h-full p-6"
                                    >
                                        <div className="w-full h-full rounded-lg border border-[var(--accent-glow)] bg-black/40 relative overflow-hidden">
                                            {/* Mock Vision Artifacts */}
                                            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-5">
                                                {Array.from({ length: 64 }).map((_, i) => (
                                                    <div key={i} className="border border-white/20" />
                                                ))}
                                            </div>

                                            <motion.div
                                                animate={{
                                                    top: ["10%", "80%", "10%"]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-px bg-[var(--accent-primary)]/50 shadow-[0_0_10px_var(--accent-primary)]"
                                            />

                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                                <div className="w-32 h-32 border-2 border-dashed border-[var(--accent-primary)]/20 rounded-full animate-spin-slow" />
                                                <span className="text-[10px] font-mono text-[var(--text-muted)] animate-pulse">Scanning Active Window...</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] opacity-30 gap-3">
                                        <div className="text-5xl">🔭</div>
                                        <span className="text-sm font-mono tracking-widest">Feed Standby</span>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Stream Logs */}
                    <div className="h-48 bg-[var(--bg-app)] rounded-2xl border border-[var(--border-subtle)] p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-2 px-2">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Cognitive Stream (Real-Time)</h3>
                            <div className="text-[9px] font-mono text-[var(--text-muted)]">{apiKey ? 'API: CONNECTED' : 'API: OFFLINE'}</div>
                        </div>
                        <div className="flex-1 overflow-y-auto font-mono text-[11px] text-[var(--text-secondary)] px-2 flex flex-col-reverse gap-1">
                            {currentLog.map((log, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className="border-l border-[var(--border-subtle)] pl-3 py-0.5"
                                >
                                    <span className="text-[var(--text-accent)]/50 mr-2">[{i}]</span>
                                    {log}
                                </motion.div>
                            ))}
                            {currentLog.length === 0 && <span className="opacity-10 italic mt-auto">Awaiting command input...</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
