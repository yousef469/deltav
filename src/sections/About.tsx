import { motion } from "framer-motion"
import { JarvisWave } from "../components/ui/JarvisWave"

export function About() {
    return (
        <section id="philosophy" className="py-24 bg-brand-black relative">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        The Philosophy of <br />
                        <span className="text-brand-accent">Precision</span>
                    </h2>
                    <div className="h-1 w-20 bg-brand-white/10 mb-8" />

                    <div className="space-y-6 text-white/70 text-lg leading-relaxed font-light">
                        <p>
                            Delta V is an ongoing engineering project focused on building intelligent systems, simulations, and software that turn ideas into real-world solutions.
                        </p>
                        <p>
                            The name comes from spaceflight, where <span className="text-brand-accent">delta-v</span> represents the change required to reach a new trajectory. Engineering works the same way — small, precise changes can lead to entirely different outcomes.
                        </p>
                        <p>
                            This platform documents the development of AI systems, experimental simulations, and tools designed to improve how people think, work, and build. The focus is on systems over features, long-term thinking over trends, and engineering over hype.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-square flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-brand-accent/5 rounded-full blur-3xl" />
                    <div className="relative z-10 w-full h-full border border-brand-accent/20 rounded-sm flex items-center justify-center overflow-hidden bg-brand-dark/50 backdrop-blur-sm p-4">
                        <JarvisWave />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
