import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

// Interactive body demo — click body parts to see what the system detects
const bodyParts = [
    { id: "head", label: "Cranial", x: 50, y: 8, w: 14, h: 10, detail: "Neurology • Imaging • Brain CT" },
    { id: "chest", label: "Thoracic", x: 50, y: 24, w: 22, h: 14, detail: "Cardiology • Respiratory • ECG" },
    { id: "abdomen", label: "Abdominal", x: 50, y: 40, w: 20, h: 12, detail: "Gastro • Liver • Kidney Function" },
    { id: "armL", label: "Left Arm", x: 28, y: 30, w: 8, h: 22, detail: "Orthopedic • Fracture Detection" },
    { id: "armR", label: "Right Arm", x: 72, y: 30, w: 8, h: 22, detail: "Orthopedic • Vascular Access" },
    { id: "legL", label: "Left Leg", x: 40, y: 60, w: 10, h: 30, detail: "ACL • Meniscus • Joint Scan" },
    { id: "legR", label: "Right Leg", x: 60, y: 60, w: 10, h: 30, detail: "ACL • Meniscus • Joint Scan" },
]

export function MedicalDemo() {
    const [activeRegion, setActiveRegion] = useState<string | null>("chest")
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    const activePart = bodyParts.find(p => p.id === activeRegion)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full min-h-[500px] flex items-center justify-center"
        >
            {/* Body silhouette */}
            <div className="relative w-48 md:w-56">
                <svg viewBox="0 0 100 100" className="w-full" style={{ filter: "drop-shadow(0 0 20px rgba(0,200,255,0.1))" }}>
                    {/* Head */}
                    <ellipse cx="50" cy="10" rx="7" ry="8"
                        fill="none" stroke={activeRegion === "head" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("head")}
                    />
                    {/* Neck */}
                    <line x1="50" y1="18" x2="50" y2="20" stroke="#1a2a3a" strokeWidth="0.5" />
                    {/* Torso */}
                    <path d="M38 20 L62 20 L60 45 L40 45 Z"
                        fill="none" stroke={activeRegion === "chest" || activeRegion === "abdomen" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("chest")}
                    />
                    {/* Pelvis */}
                    <path d="M40 45 L60 45 L58 55 L42 55 Z"
                        fill="none" stroke={activeRegion === "abdomen" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("abdomen")}
                    />
                    {/* Left Arm */}
                    <path d="M38 20 L28 25 L24 50 L28 50 L30 28 L38 24"
                        fill="none" stroke={activeRegion === "armL" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("armL")}
                    />
                    {/* Right Arm */}
                    <path d="M62 20 L72 25 L76 50 L72 50 L70 28 L62 24"
                        fill="none" stroke={activeRegion === "armR" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("armR")}
                    />
                    {/* Left Leg */}
                    <path d="M42 55 L38 90 L44 90 L48 55"
                        fill="none" stroke={activeRegion === "legL" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("legL")}
                    />
                    {/* Right Leg */}
                    <path d="M52 55 L56 90 L62 90 L58 55"
                        fill="none" stroke={activeRegion === "legR" ? "#00C8FF" : "#1a2a3a"} strokeWidth="0.8"
                        className="transition-all duration-500 cursor-pointer"
                        onClick={() => setActiveRegion("legR")}
                    />

                    {/* Highlight glow for active region */}
                    {activeRegion && (() => {
                        const part = bodyParts.find(p => p.id === activeRegion)
                        if (!part) return null
                        return (
                            <circle cx={part.x} cy={part.y} r="12"
                                fill="rgba(0,200,255,0.05)"
                                stroke="none"
                                className="animate-pulse"
                            />
                        )
                    })()}
                </svg>

                {/* Scan lines animation */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ y: ["-100%", "100%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent/30 to-transparent" />
                </motion.div>
            </div>

            {/* Info panel */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 md:w-56 space-y-4">
                {activePart && (
                    <motion.div
                        key={activePart.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                            <span className="text-brand-accent font-mono text-xs uppercase tracking-widest">
                                Region Active
                            </span>
                        </div>
                        <h4 className="text-xl font-bold text-brand-text" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {activePart.label}
                        </h4>
                        <p className="text-brand-muted text-xs font-mono leading-relaxed">
                            {activePart.detail}
                        </p>
                        <div className="h-[1px] w-full bg-brand-accent/20" />
                        <p className="text-[10px] text-brand-muted/50 font-mono uppercase tracking-widest">
                            Gemini AI · 3D Mapping · QR Pharmacy
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
