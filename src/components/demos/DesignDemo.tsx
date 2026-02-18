import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

const menuCategories = ["All", "Grills", "Mezze", "Mains", "Desserts"]

const menuItems = [
    { name: "Mixed Grill Platter", cat: "Grills", price: "28", desc: "Lamb kofta, shish taouk, chicken wings" },
    { name: "Shawarma Royale", cat: "Mains", price: "18", desc: "Slow-roasted beef, garlic sauce, pickles" },
    { name: "Hummus Beiruti", cat: "Mezze", price: "12", desc: "Classic chickpea blend, olive oil, pine nuts" },
    { name: "Fattoush Garden", cat: "Mezze", price: "14", desc: "Crispy pita, sumac dressing, fresh herbs" },
    { name: "Lamb Chops", cat: "Grills", price: "32", desc: "New Zealand rack, herbs de Provence" },
    { name: "Kunafa", cat: "Desserts", price: "15", desc: "Crispy semolina, Nabulsi cheese, rose syrup" },
    { name: "Seafood Tajine", cat: "Mains", price: "26", desc: "Shrimp, calamari, saffron broth" },
    { name: "Baklava Selection", cat: "Desserts", price: "12", desc: "Pistachio, walnut, cashew — house made" },
]

export function DesignDemo() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const [activeCategory, setActiveCategory] = useState("All")

    const filtered = activeCategory === "All"
        ? menuItems
        : menuItems.filter(item => item.cat === activeCategory)

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center"
        >
            {/* Restaurant branding */}
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-brand-text tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    ولا أطيب
                </h3>
                <p className="text-brand-muted/40 text-[10px] font-mono uppercase tracking-[0.4em] mt-1">
                    Lebanese Kitchen & Lounge
                </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex gap-1 mb-6 flex-wrap justify-center">
                {menuCategories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all duration-300 ${activeCategory === cat
                                ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                                : "border-white/5 text-brand-muted/40 hover:border-white/20 hover:text-brand-muted"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Menu items */}
            <div className="w-full max-w-sm space-y-1">
                {filtered.map((item, i) => (
                    <motion.div
                        key={item.name}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.05 }}
                        className="group flex items-start justify-between p-3 border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all cursor-default"
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-brand-text group-hover:text-amber-400 transition-colors">
                                    {item.name}
                                </h4>
                                <span className="text-[8px] font-mono uppercase tracking-widest text-brand-muted/30 border border-white/5 px-1.5 py-0.5">
                                    {item.cat}
                                </span>
                            </div>
                            <p className="text-[11px] text-brand-muted/40 mt-0.5">{item.desc}</p>
                        </div>
                        <span className="text-sm font-mono text-amber-400/60 group-hover:text-amber-400 transition-colors ml-4">
                            ${item.price}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Bilingual badge */}
            <div className="mt-6 flex gap-3">
                <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest border border-white/5 text-brand-muted/30">
                    EN / عربي
                </span>
                <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest border border-white/5 text-brand-muted/30">
                    Responsive
                </span>
                <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest border border-white/5 text-brand-muted/30">
                    Dark Theme
                </span>
            </div>
        </motion.div>
    )
}
