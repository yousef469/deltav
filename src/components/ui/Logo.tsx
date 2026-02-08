import { motion } from "framer-motion"

export function Logo() {
    return (
        <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Glowing Background Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-brand-accent/10 blur-xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10"
                >
                    {/* Delta Triangle Background */}
                    <motion.path
                        d="M50 15L15 85H85L50 15Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-white/20"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />

                    {/* Sharp Chevron V - Blue Accent */}
                    <motion.path
                        d="M25 40L50 75L75 40"
                        stroke="var(--color-brand-accent)"
                        strokeWidth="6"
                        strokeLinecap="square"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    />

                    {/* Precision Dot */}
                    <motion.circle
                        cx="50"
                        cy="15"
                        r="3"
                        fill="var(--color-brand-accent)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                    />

                    {/* Glowing Filter (Internal) */}
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                </svg>
            </div>

            <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold tracking-[0.2em] text-white">
                    DELTA<span className="text-brand-accent">V</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-mono">
                    Systems Engineering
                </span>
            </div>
        </div>
    )
}
