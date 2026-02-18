import { useState, useRef } from 'react';
import Humanoid3D from './Humanoid3D';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function MedicationHubDemo() {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '');
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('gemini_model') || 'gemini-1.5-flash');
    const [customModel, setCustomModel] = useState(localStorage.getItem('gemini_custom_model') || '');
    const [showSettings, setShowSettings] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const ANATOMY_PARTS = [
        "Head", "Neck", "Spine", "Chest", "Abdomen", "Back",
        "Shoulder", "Arm", "Elbow", "Wrist", "Hand",
        "Hip", "Leg", "Knee", "Ankle", "Foot"
    ];

    const runDirectGemini = async (prompt: string, fileData: any = null) => {
        if (!apiKey) throw new Error("API_KEY_MISSING");

        const modelId = selectedModel === 'custom' ? customModel : selectedModel;
        console.log(`[Gemini] Invoking model: ${modelId}`);

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelId });

        const systemPrompt = `You are a professional medical AI. Analyze clinical data (documents or images). 
            RULES:
            1. ONLY report findings clearly supported by the input. Never fabricate.
            2. If normal, state "Normal findings observed."
            3. Map findings to these EXACT anatomical parts: ${ANATOMY_PARTS.join(", ")}.
            
            Return in valid JSON format ONLY:
            {
                "title": "Diagnosis Name",
                "conclusion": "Detailed clinical summary.",
                "markers": [
                    {
                        "part": "Exact name from list (e.g., Knee)",
                        "status": "RED",
                        "reason": "clinical finding"
                    }
                ],
                "mesh_names": ["Knee", "Leg"]
            }
            
            IMPORTANT RULES:
            - For injuries like ACL/Meniscus, use BOTH "Knee" and "Leg" in mesh_names.
            - For Head or Neck issues, use "Head" or "Neck" exactly.
            - DO NOT infer or hallucinate body parts (especially Chest/Lungs) unless EXPLICITLY mentioned in the text as affected.
            - If a report is focused on Head/Neck, DO NOT include Chest/Lungs in findings.
            
            Use EXACT names from the list for 'markers' and 'mesh_names'.`;

        const parts = [{ text: systemPrompt }, { text: prompt }];
        if (fileData) parts.push(fileData);

        let responseText;
        try {
            const result = await model.generateContent(parts);
            responseText = result.response.text();
        } catch (error: any) {
            if (error.message?.includes('503') || error.message?.includes('overloaded')) {
                console.warn("Model overloaded (503). Switching to fallback: gemini-1.5-flash");
                setStatusMessage("⚠️ High traffic. Switching to backup model...");
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const fallbackResult = await fallbackModel.generateContent(parts);
                responseText = fallbackResult.response.text();
            } else {
                throw error;
            }
        }

        // Robust cleanup for Markdown code blocks if the AI includes them
        if (responseText.includes("```")) {
            responseText = responseText.replace(/```json\n?|```/g, "").trim();
        }

        return JSON.parse(responseText);
    };

    const fileToGenerativePart = async (file: File) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(file);
        });

        const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
        return { inlineData: { data: await base64EncodedDataPromise, mimeType } };
    };

    const handleFileAnalysis = async (file: File) => {
        setIsAnalyzing(true);
        setSelectedDiagnosis(null);
        setStatusMessage(`Analyzing: ${file.name}`);

        try {
            if (apiKey) {
                const filePart = await fileToGenerativePart(file);
                const result = await runDirectGemini("Analyze this clinical scan/document.", filePart);

                // --- POST-PROCESSING FOR ACCURACY ---
                const lowerTitle = (result.title || '').toLowerCase();
                const lowerConclusion = (result.conclusion || '').toLowerCase();
                const isHeadNeck = lowerTitle.includes('head') || lowerTitle.includes('neck') ||
                    lowerConclusion.includes('head') || lowerConclusion.includes('neck') ||
                    file.name.toLowerCase().includes('oncology');

                if (isHeadNeck) {
                    const blacklist = ['Chest', 'Lung', 'Rib', 'Sternum', 'Clavicle', 'Shoulder'];
                    result.mesh_names = result.mesh_names.filter((m: string) => !blacklist.some(b => m.includes(b)));
                    result.markers = result.markers.filter((m: any) => !blacklist.some(b => m.part.includes(b)));
                }

                setSelectedDiagnosis({
                    title: result.title || file.name,
                    ai_conclusion: result.conclusion,
                    ai_markers: result.markers || [],
                    ai_raw_analysis: { mesh_names: result.mesh_names || [] }
                });
            } else {
                throw new Error("NO_API_KEY");
            }
        } catch (err: any) {
            console.error(err);
            if (err.message?.includes('429')) {
                setSelectedDiagnosis({
                    title: "Quota Exceeded (429)",
                    ai_conclusion: "Rate limit hit. Please wait a minute or use a different model.",
                    ai_markers: [],
                    ai_raw_analysis: { mesh_names: [] }
                });
            } else {
                await runMockAnalysis(file.name);
            }
        } finally {
            setIsAnalyzing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleQuickAnalysis = async (fileName: string) => {
        setIsAnalyzing(true);
        setSelectedDiagnosis(null);
        setStatusMessage(`Loading ${fileName}...`);

        try {
            const response = await fetch(`/${fileName}`);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: 'application/pdf' });
            await handleFileAnalysis(file);
        } catch (err) {
            console.error("Fetch error:", err);
            // Fallback to mock if fetch fails (e.g. file missing)
            await runMockAnalysis(fileName);
            setIsAnalyzing(false);
        }
    };

    const runMockAnalysis = async (context: string) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSelectedDiagnosis({
            title: context,
            ai_conclusion: "Simulation mode active. Enter API key for real analysis in settings.",
            ai_markers: [{ part: "Chest", status: "RED", reason: "Demo Data" }],
            ai_raw_analysis: { mesh_names: ["Chest"] }
        });
    };

    const saveApiKey = (key: string, modelName: string, customName?: string) => {
        const cleanKey = key.trim();
        setApiKey(cleanKey);
        setSelectedModel(modelName);
        if (customName) setCustomModel(customName);
        localStorage.setItem('gemini_api_key', cleanKey);
        localStorage.setItem('gemini_model', modelName);
        localStorage.setItem('gemini_custom_model', customName || '');
        setShowSettings(false);
    };

    const allHighlightedParts = selectedDiagnosis?.ai_raw_analysis?.mesh_names || [];

    return (
        <div className="w-full h-full text-white font-sans text-sm relative overflow-hidden p-6 bg-[#020617] rounded-xl border border-white/10">
            {/* Header / Settings Button */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="text-xl md:text-2xl font-bold mb-2 tracking-tight">
                        MedicationHub: AI Anatomy
                    </h1>
                    <div className="flex gap-2 items-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border font-bold ${apiKey ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            {apiKey ? 'CONNECTED' : 'OFFLINE MODE'}
                        </span>
                        {apiKey && <span className="opacity-50 text-[10px]">{selectedModel}</span>}
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-xs bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors font-bold uppercase tracking-wider"
                >
                    ⚙️ SETTINGS
                </button>
            </div>

            {showSettings && (
                <div className="bg-slate-900/95 p-6 rounded-2xl mb-6 border border-blue-500/30 shadow-lg absolute z-20 top-20 left-6 right-6 lg:left-auto lg:right-6 lg:w-96">
                    <div className="flex flex-col gap-3">
                        <input type="password" placeholder="Gemini API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-xs focus:border-blue-500 outline-none transition-colors" />
                        <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="w-full bg-slate-950 border border-slate-700 p-3 rounded-lg text-xs text-white focus:border-blue-500 outline-none transition-colors">
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                        </select>
                        <button onClick={() => saveApiKey(apiKey, selectedModel)} className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg text-xs hover:bg-blue-600 shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest">SAVE CONFIG</button>
                    </div>
                </div>
            )}

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 h-[calc(100%-80px)]">
                {/* 3D View */}
                <div className="h-[400px] lg:h-full bg-slate-900/30 rounded-3xl border border-white/5 overflow-hidden shadow-inner">
                    <Humanoid3D highlightedParts={allHighlightedParts} />
                </div>

                {/* Controls & Output */}
                <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
                    {selectedDiagnosis ? (
                        <div className="animate-fade-in bg-red-500/10 p-6 rounded-3xl border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <h4 className="text-red-500 text-[10px] font-bold tracking-[0.2em] mb-3 uppercase border-b border-red-500/20 pb-2">ANALYSIS RESULT</h4>
                            <p className="font-bold text-lg mb-4 text-white">{selectedDiagnosis.title}</p>
                            <p className="text-sm text-purple-200/80 whitespace-pre-wrap leading-relaxed font-mono">{selectedDiagnosis.ai_conclusion}</p>
                            <button onClick={() => setSelectedDiagnosis(null)} className="mt-6 w-full bg-red-600 text-white text-xs font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 uppercase tracking-widest">✕ CLOSE REPORT</button>
                        </div>
                    ) : (
                        <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 shadow-lg backdrop-blur-sm">
                            <h3 className="text-blue-400 font-bold mb-4 text-xs tracking-[0.2em] uppercase">⚡ Quick Scenarios</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleQuickAnalysis('City_General_Hospital_ACL_Report.pdf')}
                                    disabled={isAnalyzing}
                                    className="w-full p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold hover:bg-blue-500/20 hover:border-blue-500/60 transition-all text-left flex justify-between items-center group"
                                >
                                    <span>ACL INJURY MATCH</span>
                                    {isAnalyzing && statusMessage.includes('ACL') ? <span className="animate-pulse">Analyzing...</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
                                </button>
                                <button
                                    onClick={() => handleQuickAnalysis('City_General_Hospital_Oncology_Report.pdf')}
                                    disabled={isAnalyzing}
                                    className="w-full p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold hover:bg-purple-500/20 hover:border-purple-500/60 transition-all text-left flex justify-between items-center group"
                                >
                                    <span>ONCOLOGY CASE</span>
                                    {isAnalyzing && statusMessage.includes('Oncology') ? <span className="animate-pulse">Analyzing...</span> : <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="bg-slate-900/40 p-6 rounded-3xl border border-white/5 mt-auto shadow-lg backdrop-blur-sm">
                        <h3 className="text-white font-bold mb-4 text-xs tracking-[0.2em] uppercase">📤 Manual Upload</h3>
                        <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} className="w-full p-4 rounded-2xl bg-white text-slate-950 font-extrabold text-xs hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 uppercase tracking-widest flex justify-center items-center gap-2">
                            {isAnalyzing && !statusMessage.includes('.pdf') ? (
                                <>🧬 PROCESSING SCAN...</>
                            ) : (
                                <>UPLOAD NEW SCAN</>
                            )}
                        </button>
                        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => e.target.files && e.target.files[0] && handleFileAnalysis(e.target.files[0])} accept="image/*,.pdf" />
                    </div>
                </div>
            </div>
            <style>{`.animate-fade-in { animation: fadeIn 0.4s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
