import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

// Rocket parts that can be exploded
const rocketParts = [
    { id: "nosecone", label: "Nose Cone", y: 0, h: 15, color: "#E8F0F8", detail: "Aerodynamic fairing • Payload protection • Composite shell", explodeY: -40 },
    { id: "payload", label: "Payload Bay", y: 15, h: 12, color: "#00C8FF", detail: "Satellite deployment • 2.5m fairing diameter • Separation bolts", explodeY: -20 },
    { id: "tank_lox", label: "LOX Tank", y: 27, h: 18, color: "#5588AA", detail: "Liquid Oxygen • -183°C cryogenic • Aluminum-Lithium alloy", explodeY: 5 },
    { id: "intertank", label: "Intertank", y: 45, h: 5, color: "#334455", detail: "Structural connection • Avionics bay • Flight computers", explodeY: 20 },
    { id: "tank_rp1", label: "RP-1 Tank", y: 50, h: 18, color: "#886644", detail: "Rocket-grade kerosene • Dense fuel • Stable at room temp", explodeY: 35 },
    { id: "engines", label: "Engine Cluster", y: 68, h: 15, color: "#FF8844", detail: "Merlin-class × 9 • 845 kN thrust each • Turbopump-fed", explodeY: 55 },
    { id: "fins", label: "Grid Fins", y: 78, h: 7, color: "#667788", detail: "Titanium • Aerodynamic steering • Reentry control surfaces", explodeY: 70 },
]

export function EducationDemo() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [isExploded, setIsExploded] = useState(false)
    const [activePart, setActivePart] = useState<string | null>("engines")

    const selectedPart = rocketParts.find(p => p.id === activePart)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full min-h-[500px] flex items-center justify-center gap-6"
        >
            {/* Rocket SVG */}
            <div className="relative flex-shrink-0" style={{ width: 100, height: 400 }}>
                <svg viewBox="0 0 60 100" className="w-full h-full">
                    {rocketParts.map((part) => {
                        const isActive = activePart === part.id
                        const yOffset = isExploded ? part.explodeY - part.y : 0

                        return (
                            <g key={part.id}>
                                <motion.rect
                                    x={part.id === "fins" ? 8 : part.id === "nosecone" ? 18 : 12}
                                    y={part.y}
                                    width={part.id === "fins" ? 44 : part.id === "nosecone" ? 24 : 36}
                                    height={part.h}
                                    rx={part.id === "nosecone" ? 12 : 1}
                                    fill={isActive ? "rgba(0,200,255,0.15)" : "rgba(255,255,255,0.03)"}
                                    stroke={isActive ? "#00C8FF" : "rgba(255,255,255,0.1)"}
                                    strokeWidth={isActive ? 0.8 : 0.3}
                                    className="cursor-pointer transition-colors"
                                    onClick={() => setActivePart(part.id)}
                                    animate={{ y: yOffset }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                />
                                {/* Part label (only when exploded) */}
                                {isExploded && (
                                    <motion.text
                                        x="62"
                                        y={part.y + part.h / 2 + yOffset}
                                        fill={isActive ? "#00C8FF" : "#667788"}
                                        fontSize="2.5"
                                        dominantBaseline="middle"
                                        fontFamily="'JetBrains Mono', monospace"
                                        animate={{ opacity: isExploded ? 1 : 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {part.label}
                                    </motion.text>
                                )}
                            </g>
                        )
                    })}

                    {/* Engine exhaust glow (when not exploded) */}
                    {!isExploded && (
                        <motion.ellipse
                            cx="30" cy="88" rx="8" ry="12"
                            fill="url(#exhaustGlow)"
                            animate={{ opacity: [0.3, 0.7, 0.3], ry: [10, 14, 10] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}

                    <defs>
                        <radialGradient id="exhaustGlow">
                            <stop offset="0%" stopColor="#FF8844" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#FF4400" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#FF4400" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Controls + Info panel */}
            <div className="flex-1 max-w-xs space-y-6">
                {/* Explode toggle */}
                <button
                    onClick={() => setIsExploded(!isExploded)}
                    className={`w-full px-4 py-3 font-mono text-xs uppercase tracking-widest border transition-all duration-300 ${isExploded
                            ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                            : "border-white/10 text-brand-muted hover:border-brand-accent/30"
                        }`}
                >
                    {isExploded ? "◈ Collapse View" : "◇ Explode View"}
                </button>

                {/* Part detail */}
                {selectedPart && (
                    <motion.div
                        key={selectedPart.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 p-4 border border-white/5 bg-white/[0.02]"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: selectedPart.color }} />
                            <h4 className="font-bold text-brand-text text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {selectedPart.label}
                            </h4>
                        </div>
                        <p className="text-brand-muted text-xs font-mono leading-relaxed">
                            {selectedPart.detail}
                        </p>
                    </motion.div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: "Lessons", value: "100+" },
                        { label: "Tracks", value: "5" },
                        { label: "3D Models", value: "Live" },
                        { label: "AI Tutor", value: "EnGo" },
                    ].map(stat => (
                        <div key={stat.label} className="p-2.5 border border-white/5 bg-white/[0.01]">
                            <div className="text-sm font-bold text-brand-text">{stat.value}</div>
                            <div className="text-[9px] font-mono uppercase tracking-widest text-brand-muted/50">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    )
}
