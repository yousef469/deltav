import { motion } from "framer-motion"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "../components/ui/Button"

interface HeroProps {
    onStart: () => void
}

export function Hero({ onStart }: HeroProps) {
    return (
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-brand-black text-white p-6">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[100px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-block"
                >
                    <div className="flex items-center gap-2 justify-center mb-6">
                        <div className="h-[1px] w-12 bg-brand-accent/50" />
                        <span className="text-brand-accent/80 text-sm tracking-[0.2em] uppercase font-mono">System Online</span>
                        <div className="h-[1px] w-12 bg-brand-accent/50" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight"
                >
                    Changing Trajectories <br />
                    Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-brand-accent">Engineering</span> <br />
                    Visual Direction
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide"
                >
                    Building systems that move ideas forward.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex flex-col md:flex-row gap-4 justify-center pt-8"
                >
                    {/* Nova v5.0 Release Deployment */}
                    <Button size="lg" className="group" onClick={onStart}>
                        Start Your Experience <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <a href="https://github.com/yousef469/deltav/raw/main/nova-v2.2-hud.apk" target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" size="lg" className="group border-brand-accent/30 hover:border-brand-accent/60 transition-colors">
                            <span className="flex items-center gap-2">
                                Download Nova v2.2 (HUD Compass)
                                <div className="p-1 bg-brand-accent/10 rounded-full group-hover:bg-brand-accent/20 transition-colors">
                                    <ChevronDown className="w-3 h-3 text-brand-accent" />
                                </div>
                            </span>
                        </Button>
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-12 flex items-center justify-center gap-6"
                >
                    <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-xs font-mono uppercase tracking-widest text-white/50">NEW: NOVA AI OFFLINE ASSISTANT</span>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
            >
                <span className="text-xs uppercase tracking-widest">Scroll to Navigate</span>
                <ChevronDown className="animate-bounce" />
            </motion.div>
        </section>
    )
}
