import { motion } from "framer-motion"
import { Award, Download, ExternalLink } from "lucide-react"

export function Certifications() {
    return (
        <section id="certifications" className="py-24 bg-brand-dark/50 relative overflow-hidden">
            {/* Background Decorative Blur */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-cyan/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-brand-accent text-sm font-bold uppercase tracking-[0.4em] mb-4 block"
                    >
                        Professional Credentials
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-bold text-white mb-6"
                    >
                        Certifications
                    </motion.h2>
                    <div className="h-1 w-24 bg-brand-accent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative bg-white/5 border border-white/10 p-8 hover:border-brand-accent/50 transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-sm">
                                    <Award className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">MATLAB</h3>
                                    <p className="text-sm text-white/60">Programming Certification</p>
                                </div>
                            </div>

                            <p className="text-white/70 mb-6 text-sm leading-relaxed">
                                Official MATLAB programming certification demonstrating proficiency in numerical computing, data analysis, and algorithm development.
                            </p>

                            <a
                                href="/assets/engineerium/certificate.pdf"
                                download
                                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent/10 text-brand-accent border border-brand-accent/30 hover:bg-brand-accent hover:text-black transition-all duration-300 group/btn"
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-sm font-medium">Download Certificate</span>
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
