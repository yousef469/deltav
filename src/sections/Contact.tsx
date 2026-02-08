import { motion } from "framer-motion"
import { Button } from "../components/ui/Button"

interface ContactProps {
    onStart: () => void
}

export function Contact({ onStart }: ContactProps) {
    return (
        <section className="py-24 bg-brand-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold mb-6"
                >
                    Ready to <span className="text-brand-accent">Engage</span>?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-white/60 mb-10 max-w-2xl mx-auto"
                >
                    Initiate protocol for your next project. Let's engineer your visual trajectory. <br />
                    <span className="text-brand-accent text-sm font-mono mt-4 block">youseflovemessi41@gmail.com</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Button size="lg" className="w-full md:w-auto min-w-[200px]" onClick={onStart}>
                        Start Communication
                    </Button>
                </motion.div>
            </div>
        </section>
    )
}
