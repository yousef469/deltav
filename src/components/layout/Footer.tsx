import { Github, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-brand-black border-t border-white/5 py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-8">
                {/* Name */}
                <h3
                    className="text-2xl font-bold text-brand-text tracking-tight"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    Yousef Ammar
                </h3>

                {/* Links */}
                <div className="flex items-center gap-8">
                    <a
                        href="https://github.com/yousef469"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-brand-muted/50 hover:text-brand-accent transition-colors text-sm"
                    >
                        <Github className="w-4 h-4" />
                        <span className="font-mono text-xs">GitHub</span>
                    </a>
                    <a
                        href="mailto:youseflovemessi41@gmail.com"
                        className="flex items-center gap-2 text-brand-muted/50 hover:text-brand-accent transition-colors text-sm"
                    >
                        <Mail className="w-4 h-4" />
                        <span className="font-mono text-xs">Email</span>
                    </a>
                </div>

                {/* Divider */}
                <div className="h-[1px] w-24 bg-white/5" />

                {/* Built with line */}
                <p className="text-[11px] text-brand-muted/30 font-mono text-center leading-relaxed">
                    Built with React 19, Tailwind, Framer Motion, Three.js. Every line written by hand.
                </p>
            </div>
        </footer>
    )
}
