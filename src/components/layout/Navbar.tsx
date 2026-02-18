import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "../ui/Logo"

const navLinks = [
    { name: "Projects", href: "#projects" },
    { name: "GitHub", href: "https://github.com/yousef469", external: true },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "backdrop-blur-xl bg-brand-black/90 border-b border-white/5"
                : "bg-transparent border-b border-transparent"
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <motion.a
                    href="#hero"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Logo />
                </motion.a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, i) => (
                        <motion.a
                            key={link.name}
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="text-xs font-mono uppercase tracking-[0.2em] text-brand-muted/50 hover:text-brand-accent transition-colors"
                        >
                            {link.name}
                        </motion.a>
                    ))}
                    <motion.a
                        href="mailto:youseflovemessi41@gmail.com"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="px-5 py-2 text-xs font-mono uppercase tracking-widest border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 transition-all"
                    >
                        Contact
                    </motion.a>
                </div>

                {/* Mobile Nav Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-brand-muted/50 hover:text-brand-text transition-colors">
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="md:hidden bg-brand-black/95 backdrop-blur-xl border-b border-white/5"
                >
                    <div className="px-6 py-8 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-mono uppercase tracking-widest text-brand-muted/60 hover:text-brand-accent transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                        <a
                            href="mailto:youseflovemessi41@gmail.com"
                            className="px-5 py-3 text-xs font-mono uppercase tracking-widest border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/10 transition-all text-center"
                        >
                            Contact
                        </a>
                    </div>
                </motion.div>
            )}
        </nav>
    )
}
