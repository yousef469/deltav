import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function Hero() {
    return (
        <section id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
            {/* Three.js Orbital Background - Now handled globally in App.tsx */}

            {/* Overlays removed for maximum video sharpness */}

            <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
                {/* Name — large, commanding */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] text-brand-text"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Yousef{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-cyan">
                        Ammar
                    </span>
                </motion.h1>

                {/* One line only */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                    className="mt-8 text-brand-muted text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Self-taught engineer. Built 5 production systems. Obsessed with aerospace.
                </motion.p>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-muted/50 font-mono">
                    Scroll
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ChevronDown className="w-5 h-5 text-brand-accent/40" />
                </motion.div>
            </motion.div>
        </section>
    )
}
