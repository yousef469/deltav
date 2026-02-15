import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, ExternalLink, Info, Code, Cpu, Calculator, Github, FileText, Image as ImageIcon, Video } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PortfolioAsset {
    type: 'video' | 'image' | 'file';
    url: string;
    label: string;
    thumbnail?: string;
}

interface PortfolioItem {
    id: string
    name: string
    shortDesc: string
    longDesc: string
    image: string
    link: string
    githubLink?: string
    readme?: string
    assets?: PortfolioAsset[]
    category: 'programming' | 'mechanical' | 'calculus'
    subcategory?: 'big' | 'handwritten'
}

const portfolioData: PortfolioItem[] = [
    // --- PROGRAMMING: BIG PROJECTS ---
    {
        id: "p-big-engineerium",
        category: 'programming',
        subcategory: 'big',
        name: "Engineerium",
        shortDesc: "Interactive STEM Education Platform with 3D Models & AI",
        longDesc: "Engineerium is a comprehensive STEM education platform that combines 5 engineering disciplines with 100+ lessons, AI-powered tutoring (EnGo), and interactive 3D models with JARVIS explode mode.",
        image: "/assets/engineerium/project-overview.jpg",
        link: "https://engineeruim-p8ti.vercel.app/",
        githubLink: "https://github.com/yousef469/Engineeruim",
        readme: `# 🚀 Engineerium - The Ultimate Interactive STEM Education Platform

> Master engineering through interactive 3D models, AI-powered tutoring, gamified learning, and real-world projects

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://engineeruim-p8ti.vercel.app/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-4285F4)](https://ai.google.dev/)

---

## 🌟 Platform Overview

Engineerium is a comprehensive STEM education platform that combines:
- **5 Engineering Disciplines** with 100+ lessons
- **AI-Powered Tutoring** (EnGo - powered by Google Gemini 2.0 Flash)
- **Interactive 3D Models** with JARVIS explode mode
- **Real-time Progress Tracking** with XP and leveling
- **Community Features** for collaborative learning
- **Career Projects** for portfolio building
- **25+ Engineering Calculators** and 200+ formulas

---

## 🎯 Project Vision & Impact

### The "Why": The Reason for Creation
Engineerium was created to bridge the massive gap between **dense theoretical math/physics** and **real-world engineering**. Traditional textbooks are static; Engineerium was built to make engineering "alive," allowing students to interact with the same formulas (like the Tsiolkovsky Rocket Equation) used at NASA and SpaceX in a visual, low-risk environment.

### 📈 Evolution and Improvements
The project has evolved from a simple model viewer into a **comprehensive career-ready curriculum**:
- **Foundation Depth**: Curriculum sections like \`Unit 0: Foundations\` include **MIT-quality content** covering Vectors, Newton’s Laws, and Thermodynamics.
- **Technical Fidelity**: 3D models moved from simple shapes to **high-fidelity components** (like the Falcon 9 Octaweb and Merlin Engines) with dedicated "JARVIS" modes that analyze parts in real-time.
- **AI Integration**: The tutoring system moved from simple chat to **EnGo Tutor**, which is context-aware—meaning it knows exactly which lesson you are on and can explain complex derivations step-by-step.

### 🎓 How It Transforms Student Learning
1.  **Visual Intuition**: Instead of just reading "Thrust = Force," students see the vectors acting on a 3D car or rocket. The **Explode View** lets them see the "guts" of an engine, building spatial awareness.
2.  **Instant Feedback**: Every lesson contains a **5-question quiz** with immediate explanations. This "micro-learning" prevents knowledge gaps from forming.
3.  **Variable Complexity**: It starts with "Beginner Units" (Foundations) and scales all the way to **Capstone Projects**, allowing a student to grow from a hobbyist to a career-ready engineer.

---

## ✨ Complete Feature List

### 🎓 Learning System
| Feature | Description |
|---------|-------------|
| **5 Learning Tracks** | Rockets, Planes, Cars, Electronics, Civil Engineering |
| **100+ Lessons** | Comprehensive curriculum from basics to advanced |
| **Game-Style Maps** | Visual progression with unlockable content |
| **Interactive Quizzes** | End-of-lesson assessments with instant feedback |

### 🤖 AI Features (EnGo Tutor)
| Feature | Description |
|---------|-------------|
| **Floating AI Helper** | Accessible from any page |
| **Context-Aware** | Knows current lesson and subject |
| **Quick Actions** | Explain Concept, Help with Math, Draw Diagram, Real Examples |

### 🎮 Gamification
| Feature | Description |
|---------|-------------|
| **XP System** | Earn XP for completing lessons |
| **Leveling** | 1000 XP = 1 Level |
| **Achievements** | 20+ unlockable badges |
| **Streak System** | Daily learning streaks with fire counter |

---

## 🛠️ Tech Stack

### Frontend
- **React 18.x**
- **Vite 5.x**
- **Tailwind CSS 3.x**
- **Three.js** (WebGL 3D)
- **GSAP** (Animations)

### Backend & Services
- **Supabase** (Auth, Database, Storage)
- **Google Gemini 2.0 Flash** (AI)
- **Stripe** (Payments)
- **Vercel** (Hosting)

---

## 🚀 Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/yousef469/Engineeruim.git
cd Engineeruim

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

---

**Built with ❤️ for engineering education**`,
        assets: [
            {
                type: 'video',
                url: '/assets/engineerium/video.mp4',
                label: 'Platform Demo Walkthrough'
            }
        ]
    },
    {
        id: "p-big-walaatyeb",
        category: 'programming',
        subcategory: 'big',
        name: "Wala Atyab Restaurant",
        shortDesc: "Modern Lebanese Restaurant Website with Bilingual Support",
        longDesc: "A sophisticated restaurant website for Wala Atyab, a Lebanese restaurant and lounge. Features an elegant dark theme with gold accents, interactive menu system with category filtering, bilingual support (English/Arabic), and responsive design for optimal viewing across all devices.",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000",
        link: "https://walaatyeb.vercel.app/",
        githubLink: "https://github.com/yousef469/walaatyeb"
    },
    {
        id: "p-big-medication-system",
        category: 'programming',
        subcategory: 'big',
        name: "MedicationSystem",
        shortDesc: "Clinical Coordination Platform with Gemini AI & 3D Anatomy",
        longDesc: "MedicationSystem (MediHealth Global) is a next-generation clinical coordination platform designed to unify the workflows of Patients, Coordinators, Nurses, Doctors, and Hospital Administrators. It bridges the gap between patient reporting and clinical action using Gemini AI and high-fidelity 3D Bio-Anatomy.",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2000",
        link: "https://medication-system.vercel.app/",
        githubLink: "https://github.com/yousef469/medication-system",
        assets: [
            {
                type: 'video',
                url: '/assets/medication/video.mp4',
                label: 'System Demo Walkthrough'
            },
            {
                type: 'image',
                url: '/assets/medication/project-overview.jpg',
                label: 'Project Architecture Diagram'
            },
            {
                type: 'file',
                url: '/assets/medication/flashcards.csv',
                label: 'Medical Flashcards Dataset'
            }
        ],
        readme: `# MedicationSystem (MediHealth Global)

**Built: January 2025**  
**Status: v0.1 - Active Development (UX Refinement in Progress)**

MedicationSystem is a next-generation clinical coordination platform designed to unify the workflows of **Patients, Coordinators, Nurses, Doctors, and Hospital Administrators**. It bridges the gap between patient reporting and clinical action using **Gemini AI** and high-fidelity **3D Bio-Anatomy**.

---

## 📱 Android App
The ecosystem includes a dedicated **Android App** for Patients/Users, allowing them to:
- Submit requests (Text/Voice/PDF) on the go.
- Track their medical journey and 3D diagnostics.
- Access their secure **Pharmacy Wallet** for QR-based medication pickup.

---

## 🧪 Testing & Setup Guide

To test the full system, follow this end-to-end flow:

### 1. Hospital Creation & Staff Onboarding
1. **Create Hospital**: Log in and register a new Hospital Node.
2. **Invite Staff**: From the Hospital Admin dashboard, generate invite links for:
   - **Coordinator** (Secretary)
   - **Nurse**
   - **Doctor**
3. **Connect**: Once these users register via the invite, they are automatically linked to your hospital's private ecosystem.

### 2. The Clinical Journey (Example: ACL Injury)
1. **User Request**: A user logs into the app/portal, selects your hospital, and submits a request: *"I think I have an ACL injury."* They can also attach a PDF medical report.
2. **Coordinator Triage**: The Coordinator receives the request first. They review the AI urgency score and assign a **Nurse** and **Doctor** to the case.
3. **Nurse Intake**: The Nurse opens the case, registers the patient's **Vitals** and **Triage Notes**, then passes the case to the assigned Doctor.
4. **Doctor Consultation**: 
   - The Doctor reviews the clinical synthesis.
   - **3D AI Analysis**: If a PDF or text was provided and a Gemini API Key is in the \`.env\`, the system performs a deep analysis.
   - **Anatomical Mapping**: The problem area (e.g., the Knee) is highlighted on the **3D Humanoid**. **Red areas** indicate damaged tissue/bone as identified by the AI.

### 3. Pharmacy QR Flow
- After the consultation, the Doctor prescribes medication.
- The user receives a **QR Code** in their digital wallet.
- **Dispensing**: The pharmacist scans this QR code.
- **Verification**: Upon scanning, the pharmacist sees the **Hospital Name**, **Doctor Name**, and **Exact Medication** (Patient diagnosis remains private).

---

## 🧬 Gemini-Powered 3D Anatomy

- **Automated Analysis**: Gemini 1.5 Flash/Pro converts complex medical jargon into 3D mesh coordinates.
- **Visual Diagnostics**: Highlights specific parts (e.g., \`LegL: ACL\`, \`Vertebrae: L4\`) in red to represent pathology.
- **Workflow Integration**: Accessible by both the patient (for understanding) and the clinical staff (for precision).

---

## 📡 Connectivity & Tunnels

> [!IMPORTANT]
> For the real-time link between Users/Patients and Hospital Staff to function (especially when using the Android App or Vercel), **the Backend Tunnel must be running**.

Run the tunnel in your terminal:
\`\`\`bash
lt --port 8001 --subdomain medical-hub-brain
\`\`\`

### 🔓 Remote Configuration
To ensure seamless connectivity across Web and Android:
1. **Frontend**: Set \`VITE_TUNNEL_URL=https://medical-hub-brain.loca.lt\` in your \`.env\` (or your chosen subdomain).
2. **Android**: The app is pre-configured to allow traffic from \`loca.lt\` domains. If testing on a physical device, ensure your phone can reach the tunnel URL.
3. **Local Checks**: If the backend is running locally, the system automatically defaults to \`localhost\`.

---

## 🛠 Tech Stack

- **Frontend**: React + Vite (Vercel).
- **Backend Logic**: FastAPI (Python) + Gemini AI.
- **Database**: Supabase (PostgreSQL + RLS).
- **Communication**: Real-time subscriptions via Supabase.

---
*Note: Some UI components are currently being redesigned for enhanced clinical efficiency. We are still working on the final polish.*`
    },
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

    // --- PROGRAMMING: HANDWRITTEN CODE ---
    {
        id: "p-handwritten-snake",
        category: 'programming',
        subcategory: 'handwritten',
        name: "Snake Game",
        shortDesc: "Classic Snake Game Built from Scratch",
        longDesc: "A classic Snake game implementation built entirely from scratch using vanilla JavaScript and HTML5 Canvas. Features smooth animations, score tracking, and increasing difficulty.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2000",
        link: "#",
        githubLink: "https://github.com/yousef469"
    },
    {
        id: "p-handwritten-mario",
        category: 'programming',
        subcategory: 'handwritten',
        name: "Mario Game",
        shortDesc: "Super Mario-Style Platformer",
        longDesc: "A Super Mario-inspired platformer game with custom physics engine, collision detection, and level design. Built with JavaScript and Canvas API.",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=2000",
        link: "#",
        githubLink: "https://github.com/yousef469"
    },
    {
        id: "p-handwritten-geometry-dash",
        category: 'programming',
        subcategory: 'handwritten',
        name: "Geometry Dash",
        shortDesc: "Rhythm-Based Platformer Clone",
        longDesc: "A Geometry Dash-inspired rhythm platformer with procedural level generation, obstacle patterns, and synchronized music. Features custom physics and collision systems.",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2000",
        link: "#",
        githubLink: "https://github.com/yousef469"
    },

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

                                <div className="flex flex-wrap gap-4">
                                    <a
                                        href={selectedItem.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-accent text-brand-black font-bold hover:bg-white transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs"
                                    >
                                        Launch Project <ExternalLink className="w-4 h-4" />
                                    </a>
                                    {selectedItem.githubLink && (
                                        <a
                                            href={selectedItem.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-bold hover:bg-white/20 transition-all transform hover:-translate-y-1 uppercase tracking-widest text-xs border border-white/10"
                                        >
                                            GitHub Repo <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>

                                {selectedItem.assets && selectedItem.assets.length > 0 && (
                                    <div className="pt-8 border-t border-white/5">
                                        <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Project Assets</h4>
                                        <div className="space-y-4">
                                            {selectedItem.assets.map((asset, idx) => (
                                                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded hover:bg-white/10 transition-colors">
                                                    {asset.type === 'video' && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-brand-accent text-xs uppercase tracking-wider mb-2">
                                                                <Video className="w-3 h-3" /> Video Demo
                                                            </div>
                                                            <video controls className="w-full rounded border border-white/10 max-h-48 object-cover">
                                                                <source src={asset.url} type="video/mp4" />
                                                                Your browser does not support the video tag.
                                                            </video>
                                                            <p className="text-xs text-white/50">{asset.label}</p>
                                                        </div>
                                                    )}
                                                    {asset.type === 'image' && (
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-brand-accent text-xs uppercase tracking-wider mb-2">
                                                                <ImageIcon className="w-3 h-3" /> Image Asset
                                                            </div>
                                                            <img src={asset.url} alt={asset.label} className="w-full rounded border border-white/10" />
                                                            <p className="text-xs text-white/50">{asset.label}</p>
                                                        </div>
                                                    )}
                                                    {asset.type === 'file' && (
                                                        <a href={asset.url} download className="flex items-center justify-between group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-brand-accent/10 rounded group-hover:bg-brand-accent/20 transition-colors">
                                                                    <FileText className="w-5 h-5 text-brand-accent" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-white/40">Click to download</p>
                                                                </div>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
                                                        </a>

                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-3/5 bg-black/20 p-8 md:p-12 overflow-y-auto border-l border-white/5 custom-scrollbar">
                                <img
                                    src={selectedItem.image}
                                    alt={selectedItem.name}
                                    className="w-full h-auto rounded-lg shadow-2xl mb-8 border border-white/10 object-cover aspect-video"
                                />
                                {selectedItem.readme && (
                                    <div className="prose prose-invert max-w-none prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedItem.readme}</ReactMarkdown>
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}


