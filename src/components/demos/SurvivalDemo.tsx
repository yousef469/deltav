import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// Animated counter that counts up when in view
function AnimatedCounter({ target, suffix = "", duration = 2000, className = "" }: {
    target: number
    suffix?: string
    duration?: number
    className?: string
}) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const startTime = useRef<number>(0)

    useEffect(() => {
        if (!isInView) return
        startTime.current = Date.now()

        const animate = () => {
            const elapsed = Date.now() - startTime.current
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))

            if (progress < 1) {
                requestAnimationFrame(animate)
            } else {
                setCount(target)
            }
        }

        requestAnimationFrame(animate)
    }, [isInView, target, duration])

    return (
        <span ref={ref} className={className}>{count}{suffix}</span>
    )
}

const metrics = [
    { label: "Cold Boot", value: 1.2, suffix: "s", desc: "< 1.2 second startup" },
    { label: "RAM Usage", value: 150, suffix: "MB", desc: "Runtime average" },
    { label: "External APIs", value: 0, suffix: "", desc: "Zero cloud dependency" },
    { label: "Languages", value: 6, suffix: "", desc: "Polyglot support" },
]

export function SurvivalDemo() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [hoveredMetric, setHoveredMetric] = useState<number | null>(null)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center gap-10"
        >
            {/* The dramatic APK size stat */}
            <div className="text-center space-y-3">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative"
                >
                    <span className="text-7xl md:text-9xl font-bold tracking-tighter text-brand-text text-glow-cyan" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        <AnimatedCounter target={6} duration={1500} />.
                        <AnimatedCounter target={7} duration={2000} />
                    </span>
                    <span className="text-3xl md:text-5xl font-bold text-brand-accent ml-2">MB</span>
                </motion.div>
                <p className="text-brand-muted text-sm font-mono uppercase tracking-[0.3em]">
                    Complete survival system. One APK.
                </p>
            </div>

            {/* Performance dashboard */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.8 + i * 0.15 }}
                        onMouseEnter={() => setHoveredMetric(i)}
                        onMouseLeave={() => setHoveredMetric(null)}
                        className={`p-4 border transition-all duration-300 cursor-default ${hoveredMetric === i
                                ? "border-brand-accent/50 bg-brand-accent/5"
                                : "border-white/5 bg-white/[0.02]"
                            }`}
                    >
                        <div className="text-2xl font-bold text-brand-text tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {metric.value === 0 ? "0" : <AnimatedCounter target={metric.value} suffix={metric.suffix} duration={1500 + i * 300} />}
                            {metric.value === 0 && metric.suffix}
                        </div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-brand-muted mt-1">
                            {metric.label}
                        </div>
                        {hoveredMetric === i && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] text-brand-accent/60 font-mono mt-2"
                            >
                                {metric.desc}
                            </motion.p>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Module list */}
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
                {["Emergency SOS", "Offline Maps", "Celestial Nav", "Medical AI", "Survival Vaults", "Chess Engine"].map((mod, i) => (
                    <motion.span
                        key={mod}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1.5 + i * 0.1 }}
                        className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-white/10 text-brand-muted/60 hover:border-brand-accent/30 hover:text-brand-accent transition-all cursor-default"
                    >
                        {mod}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    )
}
