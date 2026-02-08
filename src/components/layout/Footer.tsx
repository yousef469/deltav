import { Youtube, Linkedin, Github } from "lucide-react"

export function Footer() {
    const socials = [
        { icon: Youtube, href: "https://www.youtube.com/@Local_Intelligence" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/yousef-ammar-6281a5385" },
        { icon: Github, href: "#" },
    ]

    return (
        <footer className="bg-brand-black border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-white/40 text-sm">
                    © {new Date().getFullYear()} DELTA V SYSTEM. All rights reserved.
                </div>

                <div className="flex gap-6">
                    {socials.map((social, i) => (
                        <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-brand-accent transition-colors"
                        >
                            <social.icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    )
}
