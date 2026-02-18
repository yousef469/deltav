import React, { useState, useRef, useEffect } from 'react';
import Humanoid3D from './Humanoid3D';
import { GoogleGenerativeAI } from "@google/generative-ai";

const MedicationHubDemo = () => {
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('gemini_model') || 'gemini-1.5-flash');
    const [customModel, setCustomModel] = useState(localStorage.getItem('gemini_custom_model') || '');
    const [showSettings, setShowSettings] = useState(!apiKey);
    const fileInputRef = useRef(null);

    const ANATOMY_PARTS = [
        "Head", "Neck", "Spine", "Chest", "Abdomen", "Back",
        "Shoulder", "Arm", "Elbow", "Wrist", "Hand",
        "Hip", "Leg", "Knee", "Ankle", "Foot"
    ];

    const runDirectGemini = async (prompt, fileData = null) => {
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
        } catch (error) {
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

    const fileToGenerativePart = async (file) => {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
        return { inlineData: { data: await base64EncodedDataPromise, mimeType } };
    };

    const handleFileAnalysis = async (file) => {
        setIsAnalyzing(true);
        setSelectedDiagnosis(null);
        setStatusMessage(`Analyzing: ${file.name}`);

        try {
            if (apiKey) {
                const filePart = await fileToGenerativePart(file);
                const result = await runDirectGemini("Analyze this clinical scan/document.", filePart);

                // --- POST-PROCESSING FOR ACCURACY ---
                // Force-remove Chest/Lungs if the diagnosis is Head/Neck or includes those terms.
                // This prevents AI hallucinations from showing unrelated organs.
                const lowerTitle = (result.title || '').toLowerCase();
                const lowerConclusion = (result.conclusion || '').toLowerCase();
                const isHeadNeck = lowerTitle.includes('head') || lowerTitle.includes('neck') ||
                    lowerConclusion.includes('head') || lowerConclusion.includes('neck') ||
                    file.name.toLowerCase().includes('oncology');

                if (isHeadNeck) {
                    const blacklist = ['Chest', 'Lung', 'Rib', 'Sternum', 'Clavicle', 'Shoulder'];
                    result.mesh_names = result.mesh_names.filter(m => !blacklist.some(b => m.includes(b)));
                    result.markers = result.markers.filter(m => !blacklist.some(b => m.part.includes(b)));
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
        } catch (err) {
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

    const handleQuickAnalysis = async (fileName) => {
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
            setIsAnalyzing(false);
        }
    };

    const runMockAnalysis = async (context) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSelectedDiagnosis({
            title: context,
            ai_conclusion: "Simulation mode active. Enter API key for real analysis.",
            ai_markers: [{ part: "Chest", status: "RED", reason: "Demo Data" }],
            ai_raw_analysis: { mesh_names: ["Chest"] }
        });
    };

    const saveApiKey = (key, modelName, customName) => {
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
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', color: 'white', fontFamily: 'sans-serif', minHeight: '100vh', background: '#020617' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>
                        MedicationHub: AI Anatomy Demo
                    </h1>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                        <span style={{ padding: '4px 12px', background: apiKey ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: apiKey ? '#22c55e' : '#ef4444', borderRadius: '100px', fontSize: '0.8rem', border: `1px solid ${apiKey ? '#22c55e' : '#ef4444'}` }}>
                            {apiKey ? 'API CONNECTED' : 'OFFLINE MODE'}
                        </span>
                        {apiKey && <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>{selectedModel}</span>}
                    </div>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    ⚙️ SETTINGS
                </button>
            </header>

            {showSettings && (
                <div style={{ background: 'rgba(30, 41, 59, 0.95)', padding: '2rem', borderRadius: '24px', marginBottom: '2rem', border: '1px solid #60a5fa' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                        <input type="password" placeholder="Gemini API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                        <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ padding: '12px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}>
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                            <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                        </select>
                        <button onClick={() => saveApiKey(apiKey, selectedModel)} style={{ padding: '12px 24px', borderRadius: '8px', background: '#60a5fa', border: 'none', color: 'white', fontWeight: 'bold' }}>SAVE</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
                <div style={{ height: '80vh', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <Humanoid3D highlightedParts={allHighlightedParts} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedDiagnosis ? (
                        <div className="fade-in" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1.5rem', borderRadius: '24px', border: '1px solid #ef4444' }}>
                            <h4 style={{ color: '#ef4444', fontSize: '0.7rem', margin: '0 0 10px 0' }}>ANALYSIS RESULT</h4>
                            <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>{selectedDiagnosis.title}</p>
                            <p style={{ fontSize: '0.9rem', color: '#cdb5e1', whiteSpace: 'pre-wrap' }}>{selectedDiagnosis.ai_conclusion}</p>
                            <button onClick={() => setSelectedDiagnosis(null)} style={{ marginTop: '1rem', width: '100%', background: '#ef4444', border: 'none', color: 'white', padding: '10px', borderRadius: '10px', fontWeight: 'bold' }}>✕ CLOSE</button>
                        </div>
                    ) : (
                        <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ margin: '0 0 1rem 0', color: '#60a5fa' }}>⚡ Quick Start</h3>
                            <button
                                onClick={() => handleQuickAnalysis('City_General_Hospital_ACL_Report.pdf')}
                                disabled={isAnalyzing}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(96, 165, 250, 0.1)', border: '1px solid #60a5fa', color: '#60a5fa', fontWeight: 'bold', marginBottom: '10px', cursor: 'pointer' }}
                            >
                                {isAnalyzing && statusMessage.includes('ACL') ? 'ANALYZING...' : 'ACL INJURY MATCH'}
                            </button>
                            <button
                                onClick={() => handleQuickAnalysis('City_General_Hospital_Oncology_Report.pdf')}
                                disabled={isAnalyzing}
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(167, 139, 250, 0.1)', border: '1px solid #a78bfa', color: '#a78bfa', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {isAnalyzing && statusMessage.includes('Oncology') ? 'ANALYZING...' : 'ONCOLOGY CASE'}
                            </button>
                        </div>
                    )}

                    <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>📤 Manual Upload</h3>
                        <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', background: 'white', border: 'none', color: '#020617', fontWeight: '800', cursor: 'pointer' }}>
                            {isAnalyzing && !statusMessage.includes('.pdf') ? '🧬 ANALYZING...' : 'UPLOAD NEW SCAN'}
                        </button>
                        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={(e) => e.target.files[0] && handleFileAnalysis(e.target.files[0])} accept="image/*,.pdf" />
                    </div>
                </div>
            </div>

            <style>{`.fade-in { animation: fadeIn 0.4s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

export default MedicationHubDemo;
