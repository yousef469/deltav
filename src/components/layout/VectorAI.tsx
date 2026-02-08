import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Terminal, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "")

const SYSTEM_PROMPT = `You are VEKTOR, a high-end engineering AI assistant for "DELTA V", a branding engineering firm. 
Your personality is professional, precise, technical, and slightly futuristic (like JARVIS).
Your goal is to assist clients in configuring their projects (Websites, AI systems, Games, Specialized Software).
Keep responses concise, technical, and helpful. Use engineering terminology where appropriate.`

export function VectorAI() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: "assistant", content: "System initialized. VEKTOR online. How can I assist with your architectural trajectory today?" }
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!input.trim() || isTyping) return

        const userMessage = { role: "user", content: input }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                systemInstruction: SYSTEM_PROMPT
            })

            // Gemini requires the first message in history to be from 'user'
            const history = messages
                .slice(1) // Skip the initial system greeting
                .map(m => ({
                    role: m.role === "assistant" ? "model" : "user",
                    parts: [{ text: m.content }]
                }))

            const chat = model.startChat({ history })
            const result = await chat.sendMessage(input)
            const response = await result.response
            const text = response.text()

            setMessages(prev => [...prev, { role: "assistant", content: text }])
        } catch (error: any) {
            console.error("VEKTOR_AI_ERROR:", error)
            const errorMessage = error?.message || "Unknown neural link failure"
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Neural link interrupted: ${errorMessage}. Please check API configuration.`
            }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-brand-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.4)] z-50 text-brand-black"
            >
                <MessageSquare className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="fixed bottom-24 right-8 w-80 md:w-96 h-[500px] bg-brand-dark border border-brand-accent/30 rounded-sm shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-brand-accent/10 border-b border-brand-accent/20 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-brand-accent" />
                                <span className="text-xs font-mono tracking-widest uppercase">Vektor Terminal v1.2</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={i}
                                    className={cn(
                                        "max-w-[85%] p-3 rounded-sm text-sm font-light leading-relaxed",
                                        m.role === 'user'
                                            ? "ml-auto bg-brand-accent/20 border border-brand-accent/30 text-white"
                                            : "mr-auto bg-white/5 border border-white/10 text-white/80"
                                    )}
                                >
                                    {m.content}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-2 text-brand-accent/50 text-[10px] font-mono animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" /> PROCESSING TRAJECTORY...
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-brand-accent/20 bg-brand-black/50">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Enter command..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="flex-1 bg-white/5 border border-brand-accent/20 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-accent transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={isTyping}
                                    className="bg-brand-accent text-brand-black p-2 rounded-sm hover:bg-brand-cyan transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
