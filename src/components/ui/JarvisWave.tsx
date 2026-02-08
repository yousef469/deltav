import { motion } from "framer-motion"

export function JarvisWave() {
    const bars = Array.from({ length: 40 })

    return (
        <div className="flex items-center justify-center gap-[2px] h-32 w-full max-w-md">
            {bars.map((_, i) => (
                <motion.div
                    key={i}
                    className="w-[2px] bg-brand-accent/40 rounded-full"
                    animate={{
                        height: [
                            "20%",
                            `${Math.random() * 60 + 20}%`,
                            `${Math.random() * 40 + 10}%`,
                            "30%"
                        ],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05
                    }}
                />
            ))}
        </div>
    )
}
