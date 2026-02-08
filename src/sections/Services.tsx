import { motion } from "framer-motion"
import { Cpu, Globe, Layers, Gamepad2, Shield, Brain } from "lucide-react"

const services = [
    {
        icon: <Globe className="w-8 h-8" />,
        title: "Web Platforms",
        description: "Engineering courses, market systems, and high-fidelity React 19 websites (Online Only)."
    },
    {
        icon: <Shield className="w-8 h-8" />,
        title: "Local AI & Privacy",
        description: "Offline-first AI assistants and privacy tools. Secure, local processing."
    },
    {
        icon: <Brain className="w-8 h-8" />,
        title: "Workflow Automation",
        description: "Knowledge mapping, focus systems, and AI-driven cross-platform tools (Desktop & Mobile)."
    },
    {
        icon: <Gamepad2 className="w-8 h-8" />,
        title: "Interactive Media",
        description: "2D and 3D Voxel-style game development and immersive experiences."
    },
    {
        icon: <Cpu className="w-8 h-8" />,
        title: "System Architecture",
        description: "Robust specialized systems for medical, educational, and enterprise use."
    },
    {
        icon: <Layers className="w-8 h-8" />,
        title: "Visual Engineering",
        description: "Merging technical precision with high-end aesthetic direction."
    }
]

export function Services() {
    return (
        <section id="services" className="py-24 bg-brand-dark relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                    >
                        Core Capabilities
                    </motion.h2>
                    <div className="h-1 w-20 bg-brand-accent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/5 p-8 hover:bg-white/10 hover:border-brand-accent/30 transition-all duration-300 group cursor-default"
                        >
                            <div className="text-brand-accent mb-6 bg-brand-accent/10 w-fit p-3 rounded-sm group-hover:scale-110 transition-transform duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
