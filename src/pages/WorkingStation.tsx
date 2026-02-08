import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ArrowLeft, Check, Clock, DollarSign, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "../components/ui/Button"
import { cn } from "../lib/utils"

interface WorkingStationProps {
    onBack: () => void
}

type ServiceType = "website" | "ai_privacy" | "workflow" | "games" | "systems"
type Category = "logo" | "shopify" | "medical" | "school" | "market" | "course" | "engineering" | "offline_ai" | "focus_system" | "knowledge_map" | "builder" | "voxel_2d" | "voxel_3d" | "desktop_app" | "mobile_app"

type TechStack = {
    frontend?: string
    backend?: string
    css?: string
}

export function WorkingStation({ onBack }: WorkingStationProps) {
    const [step, setStep] = useState(1)
    const [service, setService] = useState<ServiceType | null>(null)
    const [isOffline, setIsOffline] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
    const [days, setDays] = useState(3)
    const [details, setDetails] = useState("")
    const [pages, setPages] = useState(1)
    const [techStack, setTechStack] = useState<TechStack>({ frontend: 'React', backend: 'Node.js', css: 'Tailwind CSS' })
    const [isOrdering, setIsOrdering] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)

    // Compatibility Logic
    const isCompatible = (fe: string, be: string) => {
        if (fe === 'Vanilla JS' && be === 'Python (Django)') return false // Example of specific incompatibility
        return true
    }

    // Pricing Logic
    let basePrice = 300
    if (service === "systems" || service === "games") basePrice = 800
    if (isOffline) basePrice += 500

    const urgencyFee = Math.max(0, (5 - days) * 50)
    const categoryFee = selectedCategories.length * 100
    const pagesFee = service === "website" ? (pages - 1) * 50 : 0

    const totalPrice = basePrice + urgencyFee + categoryFee + pagesFee

    const toggleCategory = (cat: Category) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(prev => prev.filter(c => c !== cat))
        } else {
            setSelectedCategories(prev => [...prev, cat])
        }
    }

    const handleOrder = () => {
        setIsOrdering(true)
        setTimeout(() => {
            setIsOrdering(false)
            setOrderComplete(true)
        }, 2500)
    }

    const getCategories = () => {
        switch (service) {
            case "website":
                return [
                    { id: "course", label: "Course Platform" },
                    { id: "market", label: "Market System" },
                    { id: "engineering", label: "Engineering Portfolio" },
                    { id: "shopify", label: "Shopify Integration" },
                    { id: "logo", label: "Brand Identity" },
                ]
            case "ai_privacy":
                return [
                    { id: "offline_ai", label: "Offline LLM" },
                    { id: "knowledge_map", label: "Knowledge Mapping" },
                ]
            case "workflow":
                return [
                    { id: "focus_system", label: "Focus/Study System" },
                    { id: "knowledge_map", label: "Knowledge Mapping" },
                    { id: "builder", label: "AI Workflow Builder" },
                    { id: "desktop_app", label: "Desktop App" },
                    { id: "mobile_app", label: "Mobile App" },
                ]
            case "games":
                return [
                    { id: "voxel_2d", label: "2D Voxel Style" },
                    { id: "voxel_3d", label: "3D Voxel World" },
                ]
            case "systems":
                return [
                    { id: "medical", label: "Medical System" },
                    { id: "school", label: "School Management" },
                ]
            default:
                return []
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-brand-black text-white p-6 md:p-12 relative overflow-y-auto"
        >
            {/* Background Tech GFX */}
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10 pb-20">
                <Button variant="ghost" onClick={onBack} className="mb-8 pl-0 hover:bg-transparent hover:text-brand-accent">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Return to Base
                </Button>

                <div className="space-y-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">System Configuration</h1>
                        <p className="text-white/50 text-sm font-mono tracking-widest uppercase">Phase: 0{step} / 03</p>
                    </div>

                    {step === 1 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                            <h3 className="text-xl font-semibold text-brand-accent">Select Primary Architecture</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: "website", label: "Web Platforms", desc: "React 19, High-Performance" },
                                    { id: "ai_privacy", label: "Local AI & Privacy", desc: "Offline, Secure, Private" },
                                    { id: "workflow", label: "Workflow Automation", desc: "Focus Systems, Knowledge Maps" },
                                    { id: "games", label: "Interactive Media", desc: "2D/3D Voxel Games" },
                                    { id: "systems", label: "Specialized Systems", desc: "Medical, School, Enterprise" },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setService(item.id as ServiceType)
                                            if (item.id === "website") setIsOffline(false)
                                        }}
                                        className={cn(
                                            "p-6 border border-white/10 rounded-sm text-left hover:border-brand-accent/50 transition-all group",
                                            service === item.id && "bg-brand-accent/10 border-brand-accent"
                                        )}
                                    >
                                        <span className="text-lg font-medium block mb-1 group-hover:text-brand-accent transition-colors">{item.label}</span>
                                        <span className="text-sm text-white/40">{item.desc}</span>
                                    </button>
                                ))}
                            </div>

                            {service && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-8 border-t border-white/5 space-y-6">
                                    {service !== "website" && (
                                        <div>
                                            <h3 className="text-lg font-medium text-white mb-4">Deployment Environment</h3>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => setIsOffline(false)}
                                                    className={cn(
                                                        "px-6 py-3 border border-white/10 rounded-sm text-sm transition-all",
                                                        !isOffline && "bg-brand-accent/10 border-brand-accent text-brand-accent"
                                                    )}
                                                >
                                                    Cloud Host (Online)
                                                </button>
                                                <button
                                                    onClick={() => setIsOffline(true)}
                                                    className={cn(
                                                        "px-6 py-3 border border-white/10 rounded-sm text-sm transition-all",
                                                        isOffline && "bg-brand-accent/10 border-brand-accent text-brand-accent"
                                                    )}
                                                >
                                                    Local Host (Offline)
                                                </button>
                                            </div>
                                            {isOffline && <p className="text-xs text-brand-accent/70 mt-2">Offline configuration requires advanced local architecture setup (+500 USD).</p>}
                                        </div>
                                    )}

                                    <Button onClick={() => setStep(2)} className="w-full md:w-auto">Initialize Sub-Systems</Button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                            <h3 className="text-xl font-semibold text-brand-accent">Technical Specifications</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Frontend */}
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-mono">Frontend</label>
                                    <select
                                        value={techStack.frontend}
                                        onChange={(e) => setTechStack({ ...techStack, frontend: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-sm focus:border-brand-accent outline-none"
                                    >
                                        <option>React (Recommended)</option>
                                        <option>Vue.js</option>
                                        <option>Vanilla JS</option>
                                    </select>
                                </div>

                                {/* Backend */}
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-mono">Backend</label>
                                    <select
                                        value={techStack.backend}
                                        onChange={(e) => setTechStack({ ...techStack, backend: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-sm focus:border-brand-accent outline-none"
                                    >
                                        <option>Node.js</option>
                                        <option>Python (FastAPI)</option>
                                        <option>Python (Django)</option>
                                        <option>Go</option>
                                    </select>
                                </div>

                                {/* Styling */}
                                <div className="space-y-3">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-mono">Styling</label>
                                    <select
                                        value={techStack.css}
                                        onChange={(e) => setTechStack({ ...techStack, css: e.target.value })}
                                        className="w-full bg-brand-dark border border-white/10 rounded-sm p-3 text-sm focus:border-brand-accent outline-none"
                                    >
                                        <option>Tailwind CSS</option>
                                        <option>Vanilla CSS</option>
                                        <option>SASS</option>
                                    </select>
                                </div>
                            </div>

                            {!isCompatible(techStack.frontend!, techStack.backend!) && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-center gap-3 text-red-500 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    Specific architectural mapping may require custom adaptation for these technical choices.
                                </div>
                            )}

                            <div className="pt-8 border-t border-white/5 space-y-8">
                                <h3 className="text-xl font-semibold text-brand-accent">Module Integration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {getCategories().map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleCategory(cat.id as Category)}
                                            className={cn(
                                                "p-4 border border-white/10 rounded-sm text-left hover:border-brand-accent/50 transition-all flex items-center justify-between",
                                                selectedCategories.includes(cat.id as Category) && "bg-brand-accent/10 border-brand-accent text-brand-accent"
                                            )}
                                        >
                                            {cat.label}
                                            {selectedCategories.includes(cat.id as Category) && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {service === 'website' && (
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <h3 className="text-lg font-medium text-white">Scale (Pages)</h3>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={pages}
                                            onChange={(e) => setPages(parseInt(e.target.value))}
                                            className="flex-1 accent-brand-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="font-mono text-xl w-12 text-center">{pages}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <h3 className="text-lg font-medium text-white">Timeline Strategy</h3>
                                <div className="flex items-center gap-4">
                                    <Clock className="w-5 h-5 text-white/50" />
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={days}
                                        onChange={(e) => setDays(parseInt(e.target.value))}
                                        className="flex-1 accent-brand-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="font-mono text-xl w-12 text-center">{days}d</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={() => setStep(3)} className="flex-1">Finalize Specs</Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                            <h3 className="text-xl font-semibold text-brand-accent">Manifest</h3>
                            <textarea
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-sm p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-accent"
                                placeholder="Additional mission parameters or specific requirements..."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-brand-accent/5 rounded-sm border border-brand-accent/20">
                                    <h4 className="font-mono uppercase tracking-widest text-xs text-brand-accent mb-4">Selected Stack</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-white/40">Frontend</span>
                                            <span>{techStack.frontend}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-white/5 pb-2">
                                            <span className="text-white/40">Backend</span>
                                            <span>{techStack.backend}</span>
                                        </div>
                                        <div className="flex justify-between pb-2">
                                            <span className="text-white/40">Styling</span>
                                            <span>{techStack.css}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-brand-accent/5 rounded-sm border border-brand-accent/20 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <h4 className="font-mono uppercase tracking-widest text-xs text-brand-accent">Resources</h4>
                                        <div className="flex items-end gap-1">
                                            <DollarSign className="w-5 h-5 text-brand-accent mb-1" />
                                            <span className="text-3xl font-bold text-white tracking-tighter">{totalPrice}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest text-center border-t border-brand-accent/10 pt-4">Engagement Phase: Deployment Initiated</p>
                                </div>
                            </div>

                            {/* PayPal Simulation */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white">Payment Method</h3>
                                <button
                                    disabled
                                    className="w-full p-4 border border-white/10 rounded-sm flex items-center justify-between opacity-50 cursor-not-allowed group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#003087] rounded-full flex items-center justify-center font-bold text-xs italic">PP</div>
                                        <span>PayPal</span>
                                    </div>
                                    <span className="text-xs text-brand-accent/50 group-hover:text-brand-accent transition-colors">Offline Maintenance</span>
                                </button>
                                <p className="text-[10px] text-white/40 italic">Note: PayPal integration is currently undergoing engineering updates.</p>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                                <Button className="flex-1" size="lg" onClick={handleOrder} disabled={isOrdering}>
                                    {isOrdering ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Initiate Contract"}
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* Success Overlay */}
                    <AnimatePresence>
                        {orderComplete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[100] bg-brand-black/95 backdrop-blur-md flex items-center justify-center p-6 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="max-w-md space-y-6"
                                >
                                    <div className="w-20 h-20 bg-brand-accent/10 rounded-full flex items-center justify-center mx-auto border border-brand-accent/50">
                                        <Check className="w-10 h-10 text-brand-accent" />
                                    </div>
                                    <h2 className="text-4xl font-bold">Building Your Dream</h2>
                                    <p className="text-white/60 leading-relaxed">
                                        Your architectural manifest has been received. Our systems are now calculating the optimal development trajectory.
                                    </p>
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-sm text-yellow-500 text-xs">
                                        System Notice: PayPal integration is currently being optimized. Official invoices will be routed shortly via encrypted channel.
                                    </div>
                                    <Button onClick={onBack} className="w-full">Return to Mission Control</Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
