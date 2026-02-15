import { motion } from "framer-motion"
import { Code, Cpu, Calculator, Terminal, Database, Layers, PenTool, Zap } from "lucide-react"

interface Skill {
    name: string
    level: number
    icon: React.ReactNode
}

interface SkillCategory {
    title: string
    icon: React.ReactNode
    skills: Skill[]
}

const skillCategories: SkillCategory[] = [
    {
        title: "Programming",
        icon: <Code className="w-6 h-6" />,
        skills: [
            { name: "React / TypeScript", level: 95, icon: <Layers className="w-4 h-4" /> },
            { name: "Node.js / Backend", level: 85, icon: <Terminal className="w-4 h-4" /> },
            { name: "Python Intermediate", level: 70, icon: <Database className="w-4 h-4" /> },
            { name: "Matlab Beginner", level: 50, icon: <Calculator className="w-4 h-4" /> },
            { name: "Shopify Integrations", level: 75, icon: <Code className="w-4 h-4" /> },
            { name: "Handwritten Logic", level: 100, icon: <PenTool className="w-4 h-4" /> }
        ]
    },
    {
        title: "Mechanical",
        icon: <Cpu className="w-6 h-6" />,
        skills: [
            { name: "CAD Design", level: 85, icon: <PenTool className="w-4 h-4" /> },
            { name: "Structural Analysis", level: 75, icon: <Layers className="w-4 h-4" /> },
            { name: "Robotics / IoT", level: 80, icon: <Cpu className="w-4 h-4" /> },
            { name: "Systems Engineering", level: 90, icon: <Zap className="w-4 h-4" /> }
        ]
    },
    {
        title: "Mathematics",
        icon: <Calculator className="w-6 h-6" />,
        skills: [
            { name: "Differential Calculus", level: 95, icon: <Calculator className="w-4 h-4" /> },
            { name: "Linear Algebra", level: 90, icon: <Calculator className="w-4 h-4" /> },
            { name: "Vector Calculus", level: 85, icon: <Calculator className="w-4 h-4" /> },
            { name: "Computational Math", level: 80, icon: <Calculator className="w-4 h-4" /> }
        ]
    }
]

export function Skills() {
    return (
        <section id="skills" className="py-24 bg-brand-dark/50 relative overflow-hidden">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brand-accent text-sm font-bold uppercase tracking-[0.4em] mb-4 block"
                    >
                        Core Competencies
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Technical Proficiency
                    </motion.h2>
                    <div className="h-1 w-24 bg-brand-accent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {skillCategories.map((category, catIndex) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: catIndex * 0.1 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-sm">
                                    {category.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-wider italic">
                                    {category.title}
                                </h3>
                            </div>

                            <div className="space-y-8">
                                {category.skills.map((skill, skillIndex) => (
                                    <div key={skill.name} className="group">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3 text-white/80 group-hover:text-brand-accent transition-colors duration-300">
                                                {skill.icon}
                                                <span className="text-sm font-medium tracking-wide">{skill.name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-brand-accent/60 group-hover:text-brand-accent transition-all duration-300">
                                                {skill.level}%
                                            </span>
                                        </div>
                                        <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, ease: "easeOut", delay: catIndex * 0.1 + skillIndex * 0.1 }}
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-accent/40 to-brand-accent"
                                            />
                                            {/* Glow effect */}
                                            <motion.div
                                                initial={{ left: "-100%" }}
                                                whileInView={{ left: "100%" }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                                                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
