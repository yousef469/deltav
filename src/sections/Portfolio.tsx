import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, ExternalLink, Play, Info, Code, Cpu, Calculator } from "lucide-react"

interface PortfolioItem {
    id: string
    name: string
    shortDesc: string
    longDesc: string
    image: string
    link: string
    category: 'programming' | 'mechanical' | 'calculus'
    subcategory?: 'big' | 'handwritten'
}

const portfolioData: PortfolioItem[] = [
    // --- PROGRAMMING: BIG PROJECTS (10) ---
    {
        id: "p-big-1",
        category: 'programming',
        subcategory: 'big',
        name: "Nexus OS",
        shortDesc: "High-latency resilient cloud operating system interface.",
        longDesc: "Nexus OS is designed for environments with intermittent connectivity, providing a seamless desktop-like experience in the browser with local-first data synchronization.",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
        link: "https://nexus-os.demo"
    },
    {
        id: "p-big-2",
        category: 'programming',
        subcategory: 'big',
        name: "Survival Ark",
        shortDesc: "Offline-first survival and educational toolkit for Android.",
        longDesc: "A ruggedized application suite containing medical guides, offline maps, and celestial navigation tools for disaster scenarios.",
        image: "https://images.unsplash.com/photo-1532054241088-402b4150db33?auto=format&fit=crop&q=80&w=2000",
        link: "https://survival-ark.app"
    },
    ...Array.from({ length: 8 }).map((_, i) => ({
        id: `p-big-${i + 3}`,
        category: 'programming' as const,
        subcategory: 'big' as const,
        name: `Enterprise System ${i + 1}`,
        shortDesc: "Massive scale architecture for distributed computing.",
        longDesc: "A core project focused on maximizing throughput and minimizing latency across global edge nodes.",
        image: "https://images.unsplash.com/photo-1451187534669-459247814a6d?auto=format&fit=crop&q=80&w=2000",
        link: "#"
    })),

    // --- PROGRAMMING: HANDWRITTEN (10) ---
    ...Array.from({ length: 10 }).map((_, i) => ({
        id: `p-hand-${i + 1}`,
        category: 'programming' as const,
        subcategory: 'handwritten' as const,
        name: `Handwritten Algorithm ${i + 1}`,
        shortDesc: "Low-level logic derived from first principles.",
        longDesc: "Conceptual code sketches and logic flows documented on paper before digital implementation.",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=2000",
        link: "#"
    })),

    // --- MECHANICAL (10) ---
    ...Array.from({ length: 10 }).map((_, i) => ({
        id: `m-${i + 1}`,
        category: 'mechanical' as const,
        name: `Mechanical Design ${i + 1}`,
        shortDesc: "CAD model and physical engineering prototype.",
        longDesc: "Detailed mechanical engineering project involving structural analysis, material science, and precision manufacturing.",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000",
        link: "#"
    })),

    // --- CALCULUS (10) ---
    ...Array.from({ length: 10 }).map((_, i) => ({
        id: `c-${i + 1}`,
        category: 'calculus' as const,
        name: `Calculus Theorem ${i + 1}`,
        shortDesc: "Mathematical derivation and complex modeling.",
        longDesc: "Analysis of dynamic systems using advanced calculus, differential equations, and computational mathematics.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=2000",
        link: "#"
    }))
]

export function Portfolio() {
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)

    const renderGrid = (items: PortfolioItem[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % 3) * 0.1 }}
                    onClick={() => setSelectedItem(item)}
                    className="group relative cursor-pointer overflow-hidden border border-white/5 bg-white/5 aspect-video"
                >
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-40 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 flex flex-col justify-end">
                        <h4 className="text-lg font-bold text-white group-hover:text-brand-accent transition-colors mb-1">
                            {item.name}
                        </h4>
                        <p className="text-sm text-white/60 line-clamp-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 uppercase tracking-widest text-[10px]">
                            {item.shortDesc}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )

    return (
        <section id="work" className="py-24 bg-brand-black relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-24 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-brand-accent text-sm font-bold uppercase tracking-[0.4em] mb-4 block"
                    >
                        Archive Repository
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-8xl font-bold text-white mb-4"
                    >
                        Portfolio
                    </motion.h2>
                    <div className="h-1 w-32 bg-brand-accent mx-auto" />
                </div>

                {/* PROGRAMMING SECTION */}
                <div className="mb-32">
                    <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4">
                        <Code className="text-brand-accent w-10 h-10" />
                        <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter italic">PROGRAMMING</h3>
                    </div>

                    <div className="space-y-20">
                        <div>
                            <h4 className="text-xl font-bold text-brand-accent mb-8 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-brand-accent" /> BIG PROJECTS
                            </h4>
                            {renderGrid(portfolioData.filter(i => i.category === 'programming' && i.subcategory === 'big'))}
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-brand-accent mb-8 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-brand-accent" /> HANDWRITTEN CODE
                            </h4>
                            {renderGrid(portfolioData.filter(i => i.category === 'programming' && i.subcategory === 'handwritten'))}
                        </div>
                    </div>
                </div>

                {/* MECHANICAL SECTION */}
                <div className="mb-32">
                    <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4">
                        <Cpu className="text-brand-accent w-10 h-10" />
                        <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter italic">MECHANICAL</h3>
                    </div>
                    {renderGrid(portfolioData.filter(i => i.category === 'mechanical'))}
                </div>

                {/* CALCULUS SECTION */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-16 border-b border-white/10 pb-4">
                        <Calculator className="text-brand-accent w-10 h-10" />
                        <h3 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter italic">CALCULUS</h3>
                    </div>
                    {renderGrid(portfolioData.filter(i => i.category === 'calculus'))}
                </div>
            </div>

            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-brand-black/95 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-brand-dark border border-white/10 shadow-2xl flex flex-col md:flex-row no-scrollbar"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-white hover:text-brand-accent transition-colors rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="w-full md:w-2/5 p-8 md:p-12 border-b md:border-b-0 md:border-r border-white/5">
                                <div className="flex items-center gap-2 text-brand-accent mb-6">
                                    <Info className="w-5 h-5" />
                                    <span className="text-xs font-bold uppercase tracking-[0.2em]">{selectedItem.category} {selectedItem.subcategory && `/ ${selectedItem.subcategory}`}</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tighter uppercase leading-none">
                                    {selectedItem.name}
                                </h3>
                                <p className="text-white/60 leading-relaxed mb-10 text-lg font-light">
                                    {selectedItem.longDesc}
                                </p>

                                <a
                                    href={selectedItem.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-black font-bold hover:bg-white transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs"
                                >
                                    Launch Project <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="w-full md:w-3/5 p-8 md:p-12 space-y-10 bg-black/40">
                                {Array.from({ length: 2 }).map((_, i) => (
                                    <div key={i}>
                                        <div className="flex items-center gap-3 text-white/30 mb-4">
                                            <Play className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Module Stream {i + 1}</span>
                                        </div>
                                        <div className="aspect-video bg-white/5 border border-white/5 flex flex-col items-center justify-center group hover:bg-white/10 transition-all duration-500 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                            <div className="text-white/10 group-hover:text-brand-accent transition-colors flex flex-col items-center relative z-10">
                                                <Play className="w-10 h-10 mb-3" />
                                                <p className="text-[10px] tracking-[0.4em] font-medium">AWAITING VIDEO DATA</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
