import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, ExternalLink, Play, Info } from "lucide-react"

interface Project {
    id: number
    name: string
    shortDesc: string
    longDesc: string
    image: string
    link: string
}

const projects: Project[] = [
    {
        id: 1,
        name: "Nexus OS",
        shortDesc: "High-latency resilient cloud operating system interface.",
        longDesc: "Nexus OS is designed for environments with intermittent connectivity, providing a seamless desktop-like experience in the browser with local-first data synchronization.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
        link: "https://nexus-os.demo"
    },
    {
        id: 2,
        name: "Survival Ark",
        shortDesc: "Offline-first survival and educational toolkit for Android.",
        longDesc: "A ruggedized application suite containing medical guides, offline maps, and celestial navigation tools for disaster scenarios.",
        image: "https://images.unsplash.com/photo-1532054241088-402b4150db33?auto=format&fit=crop&q=80&w=2000",
        link: "https://survival-ark.app"
    },
    {
        id: 3,
        name: "AeroMed 3D",
        shortDesc: "Futuristic 3D medical visualization and diagnostic engine.",
        longDesc: "Real-time 3D rendering of anatomical data using WebGL and AI-driven diagnostic assistance for field medics.",
        image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=2000",
        link: "https://aeromed-3d.io"
    },
    // Placeholders for the remaining 7 projects
    ...Array.from({ length: 7 }).map((_, i) => ({
        id: i + 4,
        name: `Project Delta ${i + 1}`,
        shortDesc: "Upcoming technical innovation in the delta-v ecosystem.",
        longDesc: "Details for this project are currently under development. It will feature advanced integration with our core AI and resilient infrastructure.",
        image: "https://images.unsplash.com/photo-1451187534669-459247814a6d?auto=format&fit=crop&q=80&w=2000",
        link: "#"
    }))
]

export function Portfolio() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    return (
        <section id="work" className="py-24 bg-brand-black relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-4"
                    >
                        Project Portfolio
                    </motion.h2>
                    <div className="h-1 w-20 bg-brand-accent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => setSelectedProject(project)}
                            className="group relative cursor-pointer overflow-hidden border border-white/5 bg-white/5 aspect-video"
                        >
                            {/* Project Image */}
                            <img
                                src={project.image}
                                alt={project.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                <h3 className="text-xl font-bold text-white group-hover:text-brand-accent transition-colors mb-1">
                                    {project.name}
                                </h3>
                                <p className="text-sm text-white/60 line-clamp-2 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    {project.shortDesc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-brand-black/95 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-brand-dark border border-white/10 shadow-2xl flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-white hover:text-brand-accent transition-colors rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Info Section */}
                            <div className="w-full md:w-2/5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5">
                                <div className="flex items-center gap-2 text-brand-accent mb-4">
                                    <Info className="w-5 h-5" />
                                    <span className="text-sm font-bold uppercase tracking-widest">Project Details</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                    {selectedProject.name}
                                </h3>
                                <p className="text-white/70 leading-relaxed mb-8 text-lg">
                                    {selectedProject.longDesc}
                                </p>

                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-brand-black font-bold hover:bg-white transition-colors uppercase tracking-wider text-sm"
                                >
                                    Visit Website <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            {/* Video Placeholders Section */}
                            <div className="w-full md:w-3/5 p-8 md:p-12 space-y-8 bg-black/30">
                                <div>
                                    <div className="flex items-center gap-2 text-white/40 mb-4">
                                        <Play className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Demonstration Video 1</span>
                                    </div>
                                    <div className="aspect-video bg-white/5 border border-white/5 border-dashed flex flex-center flex-col items-center justify-center group hover:bg-white/10 transition-colors">
                                        <div className="text-white/20 group-hover:text-brand-accent transition-colors">
                                            <Play className="w-12 h-12 mb-2" />
                                            <p className="text-sm">Video Placement 1</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 text-white/40 mb-4">
                                        <Play className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Demonstration Video 2</span>
                                    </div>
                                    <div className="aspect-video bg-white/5 border border-white/5 border-dashed flex flex-center flex-col items-center justify-center group hover:bg-white/10 transition-colors">
                                        <div className="text-white/20 group-hover:text-brand-accent transition-colors">
                                            <Play className="w-12 h-12 mb-2" />
                                            <p className="text-sm">Video Placement 2</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
