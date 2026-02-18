import { motion } from "framer-motion"
import { Github, ExternalLink, Play } from "lucide-react"

interface ProjectData {
    tag: string
    name: string
    description: string
    techTags: string[]
    githubUrl?: string
    liveUrl?: string
    demoUrl?: string
    image: string
}

const projects: ProjectData[] = [
    {
        tag: "MEDICAL",
        name: "MedicationSystem",
        description: "Clinical coordination platform with Gemini AI analysis and 3D bio-anatomy mapping. Five user roles. QR pharmacy flow.",
        techTags: ["React", "FastAPI", "Gemini AI", "Supabase", "Three.js"],
        githubUrl: "https://github.com/yousef469/medication-system",
        liveUrl: "https://medication-system.vercel.app/",
        image: "/assets/medication/project-overview.jpg",
    },
    {
        tag: "SURVIVAL",
        name: "Nova",
        description: "Offline survival ark for Android. Emergency SOS, celestial navigation, medical AI, and 6 languages — in 6.7 MB.",
        techTags: ["Kotlin", "SQLite", "OSM", "Canvas"],
        githubUrl: "https://github.com/yousef469",
        image: "/assets/nova/project-overview.jpg",
    },
    {
        tag: "INTELLIGENCE",
        name: "Atlas",
        description: "Offline AI assistant with 6-step cognitive pipeline, infinite memory, voice interaction, vision, and image generation.",
        techTags: ["React", "Electron", "Python", "Qwen 7B", "ChromaDB"],
        githubUrl: "https://github.com/yousef469",
        image: "/assets/atlas/project-overview.jpg",
    },
    {
        tag: "EDUCATION",
        name: "Engineerium",
        description: "Interactive STEM platform — 5 engineering tracks, 100+ lessons, AI tutor, 3D models with explode mode, and gamification.",
        techTags: ["React", "Three.js", "Gemini AI", "Supabase"],
        githubUrl: "https://github.com/yousef469/Engineeruim",
        liveUrl: "https://engineeruim-p8ti.vercel.app/",
        image: "/assets/engineerium/project-overview.jpg",
    },
]

export function Projects() {
    return (
        <section id="projects" className="relative z-10 w-full py-24 px-6 md:px-12 lg:px-20">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-[1px] w-8 bg-brand-accent/50" />
                    <span className="text-brand-accent text-[10px] font-mono uppercase tracking-[0.4em] font-medium">
                        Engineering Portfolio
                    </span>
                    <div className="h-[1px] w-8 bg-brand-accent/50" />
                </div>
                <h2
                    className="text-5xl md:text-6xl font-bold text-white tracking-tighter"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Case Studies
                </h2>
            </motion.div>

            {/* Project Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative rounded-2xl overflow-hidden border border-white/10 bg-brand-dark/60 backdrop-blur-sm hover:border-brand-accent/30 transition-all duration-500"
                    >
                        {/* Project Image */}
                        <div className="relative overflow-hidden aspect-video">
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />

                            {/* Tag badge */}
                            <span className="absolute top-4 left-4 px-3 py-1 text-[9px] font-mono tracking-[0.3em] uppercase bg-brand-accent/10 border border-brand-accent/30 text-brand-accent rounded-full backdrop-blur-sm">
                                {project.tag}
                            </span>
                        </div>

                        {/* Project Info */}
                        <div className="p-6 space-y-4">
                            <h3
                                className="text-2xl font-bold text-white tracking-tight"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                {project.name}
                            </h3>

                            <p className="text-brand-muted text-sm leading-relaxed">
                                {project.description}
                            </p>

                            {/* Tech Tags */}
                            <div className="flex flex-wrap gap-2">
                                {project.techTags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-[9px] font-mono tracking-widest border border-white/5 text-brand-muted/60 uppercase rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-brand-muted hover:text-white transition-colors text-sm"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span className="font-mono text-[10px] tracking-wider uppercase">Source</span>
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition-colors text-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        <span className="font-mono text-[10px] tracking-wider uppercase">Live</span>
                                    </a>
                                )}
                                {project.demoUrl && (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-brand-muted hover:text-green-400 transition-colors text-sm"
                                    >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span className="font-mono text-[10px] tracking-wider uppercase">Demo</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
