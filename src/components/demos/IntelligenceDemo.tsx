import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

const bootSequence = [
    { text: "> atlas.init()", delay: 0 },
    { text: "  Loading Qwen 2.5 Coder 7B...", delay: 400 },
    { text: "  ✓ Brain engine online", delay: 1000 },
    { text: "  ✓ ChromaDB memory loaded (∞ context)", delay: 1500 },
    { text: "  ✓ Whisper STT ready", delay: 1900 },
    { text: "  ✓ Piper TTS initialized", delay: 2200 },
    { text: "  ✓ OmniParser vision linked", delay: 2500 },
    { text: "  ✓ ComfyUI image gen standby", delay: 2800 },
    { text: "", delay: 3000 },
    { text: "  ATLAS v24.5 — All systems nominal.", delay: 3200 },
    { text: "  Cognitive pipeline: 6-step loop active", delay: 3600 },
    { text: "", delay: 3800 },
    { text: "> _", delay: 4000 },
]

const conversationDemo = [
    { role: "user" as const, text: "Atlas, analyze this codebase for security vulnerabilities." },
    { role: "ai" as const, text: "Scanning... I found 3 exposed API keys in .env, 1 SQL injection risk in /api/users, and an unvalidated file upload endpoint. Shall I patch them?" },
    { role: "user" as const, text: "Patch them all." },
    { role: "ai" as const, text: "Done. Rotated all 3 API keys, parameterized the SQL query, added MIME validation + size limits to the upload handler. Memory updated: 'Always validate file uploads in this project.'" },
]

export function IntelligenceDemo() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [visibleLines, setVisibleLines] = useState<number>(0)
    const [showConversation, setShowConversation] = useState(false)
    const [visibleMessages, setVisibleMessages] = useState(0)
    const [cursorBlink, setCursorBlink] = useState(true)

    // Boot sequence animation
    useEffect(() => {
        if (!isInView) return

        bootSequence.forEach((line, i) => {
            setTimeout(() => {
                setVisibleLines(i + 1)
            }, line.delay)
        })

        // After boot, show conversation
        setTimeout(() => {
            setShowConversation(true)
        }, 4500)
    }, [isInView])

    // Conversation animation
    useEffect(() => {
        if (!showConversation) return

        conversationDemo.forEach((_, i) => {
            setTimeout(() => {
                setVisibleMessages(i + 1)
            }, i * 1200)
        })
    }, [showConversation])

    // Cursor blink
    useEffect(() => {
        const interval = setInterval(() => setCursorBlink(b => !b), 530)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full min-h-[500px] flex items-center justify-center"
        >
            <div className="w-full max-w-md bg-brand-black border border-white/10 overflow-hidden">
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] font-mono text-brand-muted/40 ml-2 uppercase tracking-widest">
                        atlas v24.5 — cognitive terminal
                    </span>
                </div>

                {/* Terminal body */}
                <div className="p-4 space-y-0 h-80 overflow-y-auto no-scrollbar font-mono text-xs">
                    {/* Boot sequence */}
                    {bootSequence.slice(0, visibleLines).map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`leading-relaxed ${line.text.includes("✓") ? "text-green-400/70" :
                                    line.text.includes(">") ? "text-brand-accent" :
                                        line.text.includes("ATLAS") ? "text-brand-text font-bold" :
                                            "text-brand-muted/60"
                                }`}
                        >
                            {line.text === "> _" ? (
                                <span className="text-brand-accent">
                                    {">"} <span className={cursorBlink ? "opacity-100" : "opacity-0"}>_</span>
                                </span>
                            ) : (
                                line.text || <br />
                            )}
                        </motion.div>
                    ))}

                    {/* Conversation demo */}
                    {showConversation && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                            {conversationDemo.slice(0, visibleMessages).map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className={`p-2.5 rounded-sm text-[11px] leading-relaxed ${msg.role === "user"
                                            ? "bg-brand-accent/10 border border-brand-accent/20 text-brand-text ml-6"
                                            : "bg-white/[0.03] border border-white/5 text-brand-muted mr-6"
                                        }`}
                                >
                                    <span className={`text-[9px] uppercase tracking-widest block mb-1 ${msg.role === "user" ? "text-brand-accent/50" : "text-brand-muted/40"
                                        }`}>
                                        {msg.role === "user" ? "You" : "Atlas"}
                                    </span>
                                    {msg.text}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
