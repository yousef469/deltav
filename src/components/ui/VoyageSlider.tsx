import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, ArrowLeft, Github, ExternalLink } from 'lucide-react'

interface Project {
    tag: string
    name: string
    description: string
    techTags: string[]
    image: string
    demo: React.ReactNode
    githubUrl?: string
    liveUrl?: string
}

interface VoyageSliderProps {
    projects: Project[]
    onEnterDemo?: (index: number) => void
}

export function VoyageSlider({ projects }: VoyageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [activeDemoIndex, setActiveDemoIndex] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const nextSlide = () => {
        if (activeDemoIndex !== null) return
        setCurrentIndex((prev) => (prev + 1) % projects.length)
    }

    const prevSlide = () => {
        if (activeDemoIndex !== null) return
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
    }

    // Sync with Background Simulation
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('projectChange', { detail: currentIndex }))
    }, [currentIndex])

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current || activeDemoIndex !== null) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        setMousePos({ x, y })
    }

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 })
    }

    const getSlideStatus = (index: number) => {
        if (index === currentIndex) return 'current'
        if (index === (currentIndex + 1) % projects.length) return 'next'
        if (index === (currentIndex - 1 + projects.length) % projects.length) return 'previous'
        return 'hidden'
    }

    const isDemoMode = activeDemoIndex !== null

    useEffect(() => {
        window.dispatchEvent(new CustomEvent('demoStateChange', { detail: isDemoMode }))
    }, [isDemoMode])

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative w-full h-[80vh] flex items-center justify-center transition-all duration-700 ${isDemoMode ? 'bg-brand-black' : ''}`}
        >
            {/* Background Blur Overlay for Current Slide */}
            <AnimatePresence mode="wait">
                {!isDemoMode && (
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 z-0 pointer-events-none"
                    >
                        <div
                            className="absolute inset-x-[-10%] inset-y-[-10%] bg-cover bg-center blur-3xl opacity-20"
                            style={{ backgroundImage: `url(${projects[currentIndex].image})` }}
                        />
                        <div className="absolute inset-0 bg-brand-black/40" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons (Hidden in Demo Mode) */}
            <AnimatePresence>
                {!isDemoMode && (
                    <>
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onClick={prevSlide}
                            className="absolute left-8 z-50 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-brand-accent/50 transition-all active:scale-95 group"
                        >
                            <ChevronLeft className="w-8 h-8 group-hover:text-brand-accent transition-colors" />
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onClick={nextSlide}
                            className="absolute right-8 z-50 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-brand-accent/50 transition-all active:scale-95 group"
                        >
                            <ChevronRight className="w-8 h-8 group-hover:text-brand-accent transition-colors" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            {/* Demo Header Toolbar (Only in Demo Mode) */}
            <AnimatePresence>
                {isDemoMode && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-0 left-0 right-0 z-[110] flex items-center justify-between px-8 py-6 bg-brand-black/80 backdrop-blur-md border-b border-white/5"
                    >
                        <button
                            onClick={() => setActiveDemoIndex(null)}
                            className="flex items-center gap-2 text-brand-muted hover:text-brand-accent transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-mono text-[10px] tracking-widest uppercase">EXIT SYSTEM</span>
                        </button>
                        <div className="flex flex-col items-end">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">
                                {projects[currentIndex].name}
                            </h3>
                            <div className="flex gap-4 mt-1">
                                {projects[currentIndex].githubUrl && (
                                    <a href={projects[currentIndex].githubUrl} target="_blank" className="text-brand-muted hover:text-white transition-colors">
                                        <Github className="w-4 h-4" />
                                    </a>
                                )}
                                {projects[currentIndex].liveUrl && (
                                    <a href={projects[currentIndex].liveUrl} target="_blank" className="text-brand-muted hover:text-white transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Slides Container */}
            <div className={`relative w-full ${isDemoMode ? 'h-full' : 'max-w-6xl h-full'} flex items-center justify-center perspective-[1000px]`}>
                {projects.map((project, index) => {
                    const status = getSlideStatus(index)
                    if (status === 'hidden') return null

                    const isCurrent = status === 'current'
                    const isNext = status === 'next'
                    const isSlideActive = activeDemoIndex === index

                    // Morph/Tilt Math
                    const rotX = isDemoMode ? 0 : (isCurrent ? mousePos.y * -15 : 0)
                    const rotY = isDemoMode ? 0 : (isCurrent ? mousePos.x * 15 : (isNext ? -45 : 45))
                    const translateX = isDemoMode ? 0 : (isCurrent ? mousePos.x * 20 : (isNext ? '120%' : '-120%'))
                    const translateZ = isDemoMode ? 0 : (isCurrent ? 100 : -200)
                    const scale = isDemoMode ? (isSlideActive ? 1 : 0.8) : (isCurrent ? 1.1 : 0.8)
                    const opacity = isDemoMode ? (isSlideActive ? 1 : 0) : (isCurrent ? 1 : 0.4)

                    return (
                        <motion.div
                            key={project.name}
                            initial={false}
                            animate={{
                                x: translateX,
                                z: translateZ,
                                rotateY: rotY,
                                rotateX: rotX,
                                scale: scale,
                                opacity: opacity,
                                width: isSlideActive ? '100%' : '300px',
                                height: isSlideActive ? '100%' : '450px',
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: isDemoMode ? 70 : 100,
                                damping: isDemoMode ? 15 : 20,
                                mass: 1
                            }}
                            className={`absolute ${isSlideActive ? 'fixed inset-0 z-[100] cursor-default' : 'cursor-pointer preserve-3d group'}`}
                            onClick={() => !isDemoMode && isCurrent && setActiveDemoIndex(index)}
                        >
                            <div className={`relative w-full h-full ${isSlideActive ? '' : 'rounded-2xl overflow-hidden border border-white/10'} bg-brand-dark shadow-2xl overflow-hidden`}>
                                {/* Image Overlay (Only visible when demo is NOT active) */}
                                <AnimatePresence>
                                    {!isSlideActive && (
                                        <motion.div
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 z-10"
                                        >
                                            <div className="absolute inset-0 overflow-hidden">
                                                <motion.div
                                                    animate={{
                                                        x: isCurrent ? mousePos.x * -30 : 0,
                                                        y: isCurrent ? mousePos.y * -30 : 0,
                                                    }}
                                                    className="w-full h-full"
                                                >
                                                    <img
                                                        src={project.image}
                                                        alt={project.name}
                                                        className="w-full h-full object-cover scale-125"
                                                    />
                                                </motion.div>
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent flex flex-col justify-end p-8">
                                                <div className="space-y-2 preserve-3d">
                                                    <span className="text-brand-accent text-[10px] font-mono tracking-[0.3em] uppercase">
                                                        {project.tag}
                                                    </span>
                                                    <h3 className="text-3xl font-bold text-white tracking-tighter">
                                                        {project.name}
                                                    </h3>

                                                    {isCurrent && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="pt-4 flex items-center gap-2 text-brand-accent font-mono text-[10px] tracking-widest group-hover:gap-4 transition-all"
                                                        >
                                                            <Play className="w-4 h-4 fill-current" />
                                                            INTERACTIVE SYSTEM
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Demo Content Layer */}
                                <div className={`w-full h-full ${isSlideActive ? 'pt-24' : ''}`}>
                                    {project.demo}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Bottom Info Panel (Hidden in Demo Mode) */}
            <AnimatePresence>
                {!isDemoMode && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-12 text-center z-20 pointer-events-none"
                    >
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 max-w-xl mx-auto px-6"
                        >
                            <p className="text-brand-muted text-lg font-light leading-relaxed">
                                {projects[currentIndex].description}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {projects[currentIndex].techTags.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-[8px] font-mono tracking-widest border border-white/5 text-brand-muted/40 uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
