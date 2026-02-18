// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS, SURVIVAL_CONTENT, EMERGENCY_TREES, AI_PROTOCOLS } from './translations';
import { findNearestCivilization, getCelestialGuidance, validateMove, RESCUE_POINTS, calculateBearing } from './engine';

declare const L: any;

export default function NovaDemo() {
    const [lang, setLang] = useState<'en' | 'ar' | 'zh'>('en');
    const [tab, setTab] = useState('DASHBOARD');
    const [stats, setStats] = useState({ bat: 84, signal: 92, temp: 24, alt: 145 });
    const [location, setLocation] = useState({ lat: 30.044, lon: 31.235, heading: 0 }); // Default Cairo
    const [nearestRescue, setNearestRescue] = useState<any>(null);
    const [celestial, setCelestial] = useState<any>(null);
    const [emergencyNode, setEmergencyNode] = useState<string>('start');
    const [emergencyTree, setEmergencyTree] = useState<any>(null);
    const [chessBoard, setChessBoard] = useState(Array(8).fill(Array(8).fill('.')));
    const [selectedSquare, setSelectedSquare] = useState<any>(null);
    const [turn, setTurn] = useState('white');
    const [timer, setTimer] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [aiQuery, setAiQuery] = useState('');
    const [aiResult, setAiResult] = useState('');

    const mapRef = useRef<any>(null);

    const t = TRANSLATIONS[lang];

    // --- 1. SENSORS (Mock) ---
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                bat: Math.max(10, prev.bat - 0.01),
                signal: Math.min(100, Math.max(0, prev.signal + (Math.random() - 0.5) * 5)),
                temp: 24 + (Math.random() - 0.5),
                alt: 145 + (Math.random() - 0.5)
            }));

            // Sim heading change
            setLocation(prev => ({ ...prev, heading: (prev.heading + (Math.random() - 0.5) * 2 + 360) % 360 }));
        }, 2000);

        // Geolocation
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    setLocation(prev => ({
                        ...prev,
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude,
                        heading: pos.coords.heading || prev.heading
                    }));
                },
                (err) => console.log("GPS Error (Demo Mode Active):", err),
                { enableHighAccuracy: true }
            );
        }

        return () => clearInterval(interval);
    }, []);

    // --- 2. ENGINE UPDATE ---
    useEffect(() => {
        const rescue = findNearestCivilization(location.lat, location.lon);
        setNearestRescue(rescue);

        if (rescue) {
            const guidance = getCelestialGuidance(location.lat, location.lon, rescue.point.lat, rescue.point.lon, lang);
            setCelestial(guidance);
        }
    }, [location, lang]);

    // --- 3. MAP INIT ---
    useEffect(() => {
        if (tab === 'NAV' && !mapRef.current && document.getElementById('map')) {
            try {
                // @ts-ignore
                const map = L.map('map').setView([location.lat, location.lon], 6);
                // @ts-ignore
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // User marker
                const userIcon = L.divIcon({ className: 'user-marker', html: '<div style="width:10px;height:10px;background:#00f0ff;border-radius:50%;box-shadow:0 0 10px #00f0ff;"></div>' });
                const marker = L.marker([location.lat, location.lon], { icon: userIcon }).addTo(map);

                // Rescue Markers
                RESCUE_POINTS.forEach(p => {
                    L.circleMarker([p.lat, p.lon], {
                        radius: 4,
                        color: '#00ff00',
                        fillColor: '#00ff00',
                        fillOpacity: 0.5
                    }).addTo(map).bindPopup(p.name);
                });

                // Line to nearest
                if (nearestRescue) {
                    L.polyline([
                        [location.lat, location.lon],
                        [nearestRescue.point.lat, nearestRescue.point.lon]
                    ], { color: '#00f0ff', dashArray: '5, 10', weight: 1 }).addTo(map);
                }

                mapRef.current = map;
            } catch (e) {
                console.log("Leaflet not loaded yet");
            }
        }
    }, [tab, location, nearestRescue]);


    // --- 4. CHESS INIT ---
    useEffect(() => {
        const initialBoard = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ];
        setChessBoard(initialBoard);
    }, []);

    const handleChessClick = (r: number, c: number) => {
        if (selectedSquare) {
            const piece = chessBoard[selectedSquare.r][selectedSquare.c];
            if (validateMove(piece, selectedSquare, { r, c }, chessBoard)) {
                const newBoard = chessBoard.map(row => [...row]);
                newBoard[r][c] = piece;
                newBoard[selectedSquare.r][selectedSquare.c] = '.';
                setChessBoard(newBoard);
                setTurn(turn === 'white' ? 'black' : 'white');
                setSelectedSquare(null);
            } else {
                setSelectedSquare(null); // Invalid move deselect
            }
        } else {
            const piece = chessBoard[r][c];
            if (piece !== '.' && ((turn === 'white' && piece === piece.toUpperCase()) || (turn === 'black' && piece === piece.toLowerCase()))) {
                setSelectedSquare({ r, c });
            }
        }
    };

    const handleAiSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = aiQuery.toLowerCase();
        let result = "Searching Offline Database...";

        // Simple keyword matching for demo
        for (const [key, val] of Object.entries(AI_PROTOCOLS[lang])) {
            if (q.includes(key) || val.toLowerCase().includes(q)) {
                result = val;
                break;
            }
        }
        if (result === "Searching Offline Database...") {
            result = lang === 'ar' ? "لم يتم العثور على بيانات. استخدم البروتوكولات اليدوية." : "No specific protocol found. Refer to general manual.";
        }
        setAiResult(result);
    };

    // --- RENDER HELPERS ---
    const renderStatPill = (label: string, val: string | number, unit = '', color = 'text-cyan-400') => (
        <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-700 flex flex-col items-center min-w-[70px]">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest">{label}</span>
            <span className={`text-sm font-bold font-mono ${color}`}>{typeof val === 'number' ? val.toFixed(0) : val}{unit}</span>
        </div>
    );

    return (
        <div className={`w-full h-full bg-slate-950 text-slate-200 font-sans overflow-hidden flex flex-col relative ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>

            {/* Status Bar */}
            <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-3 text-[10px] font-mono">
                <div className="flex gap-4">
                    <span className="text-cyan-400">NOVA OS v2.2</span>
                    <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-white' : 'text-slate-500'}>EN</button>
                    <button onClick={() => setLang('ar')} className={lang === 'ar' ? 'text-white' : 'text-slate-500'}>AR</button>
                    <button onClick={() => setLang('zh')} className={lang === 'zh' ? 'text-white' : 'text-slate-500'}>ZH</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">

                {/* 1. DASHBOARD TAB */}
                {tab === 'DASHBOARD' && (
                    <div className="grid grid-cols-2 gap-3 h-full">
                        {/* Stats Panel */}
                        <div className="col-span-2 bg-slate-900/40 rounded-xl p-3 border border-cyan-500/20 flex gap-2 justify-between">
                            {renderStatPill("BAT", stats.bat, "%", stats.bat < 20 ? 'text-red-500' : 'text-green-400')}
                            {renderStatPill("SIG", stats.signal, "%")}
                            {renderStatPill("TEMP", stats.temp, "°C")}
                            {renderStatPill("ALT", stats.alt, "m")}
                        </div>

                        {/* Rescue Compass */}
                        <div className="col-span-2 bg-slate-900/40 rounded-xl p-4 border border-cyan-500/30 flex items-center gap-4 relative overflow-hidden group hover:border-cyan-500/60 transition-colors cursor-pointer" onClick={() => setTab('NAV')}>
                            <div className="relative w-20 h-20 border-2 border-slate-600 rounded-full flex items-center justify-center bg-slate-950">
                                <div className="absolute w-1 h-2 bg-red-500 -mt-10"></div>
                                <div className="text-xs font-bold text-slate-500">N</div>
                                {/* Bearing Arrow */}
                                {nearestRescue && (
                                    <div
                                        className="absolute w-1 h-8 bg-cyan-400 origin-bottom"
                                        style={{ transform: `rotate(${calculateBearing(location.lat, location.lon, nearestRescue.point.lat, nearestRescue.point.lon) - location.heading}deg) translateY(-50%)` }}
                                    ></div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-cyan-400 text-xs font-bold tracking-widest mb-1">{t.nearest}</h3>
                                {nearestRescue ? (
                                    <>
                                        <div className="text-2xl font-bold font-mono">{nearestRescue.point.name}</div>
                                        <div className="text-sm text-slate-400 font-mono">{nearestRescue.distance.toFixed(1)} km</div>
                                    </>
                                ) : <div className="animate-pulse">Scanning...</div>}
                            </div>
                            <div className="absolute right-2 top-2 text-cyan-500/20 text-[40px] font-bold opacity-10 font-mono">NAV</div>
                        </div>

                        {/* Emergency Button */}
                        <button onClick={() => setTab('EMERGENCY')} className="col-span-1 bg-red-900/20 border border-red-500/50 rounded-xl flex flex-col items-center justify-center gap-2 p-4 hover:bg-red-900/40 transition-colors">
                            <span className="text-2xl">🆘</span>
                            <span className="text-xs font-bold text-red-400 tracking-widest">{t.emergency}</span>
                        </button>

                        {/* Vault Button */}
                        <button onClick={() => setTab('VAULT')} className="col-span-1 bg-blue-900/20 border border-blue-500/50 rounded-xl flex flex-col items-center justify-center gap-2 p-4 hover:bg-blue-900/40 transition-colors">
                            <span className="text-2xl">📦</span>
                            <span className="text-xs font-bold text-blue-400 tracking-widest">{t.vault}</span>
                        </button>

                        {/* AI Query */}
                        <div className="col-span-2 mt-auto">
                            <form onSubmit={handleAiSearch} className="relative">
                                <input
                                    value={aiQuery}
                                    onChange={e => setAiQuery(e.target.value)}
                                    placeholder={t.search_placeholder}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-xs focus:border-cyan-500 outline-none"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-1 text-cyan-500">🔍</button>
                            </form>
                            {aiResult && (
                                <div className="mt-2 p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-xs text-cyan-100 animate-slide-up">
                                    {aiResult}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. NAV TAB */}
                {tab === 'NAV' && (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xs font-bold text-cyan-400 tracking-widest">{t.survival_nav}</h2>
                            <button onClick={() => setTab('DASHBOARD')} className="bg-slate-800 px-3 py-1 rounded text-[10px] hover:bg-slate-700">{t.back}</button>
                        </div>
                        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
                            <div id="map" className="absolute inset-0 z-0"></div>
                            {/* Overlay Info */}
                            <div className="absolute bottom-4 left-4 z-[9999] bg-slate-900/80 p-3 rounded backdrop-blur border border-white/10 max-w-[200px]">
                                {celestial && (
                                    <>
                                        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{t.celestial}</div>
                                        <div className="text-xs text-yellow-400 font-bold mb-1">⭐ {celestial.star}</div>
                                        <div className="text-[10px] leading-tight">{celestial.instruction}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. VAULT TAB */}
                {tab === 'VAULT' && (
                    <div className="h-full flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-bold text-amber-500 tracking-widest">{t.vault}</h2>
                            <button onClick={() => setTab('DASHBOARD')} className="bg-slate-800 px-3 py-1 rounded text-[10px]">{t.back}</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto">
                            {['farming', 'repairing', 'education', 'coding'].map(cat => (
                                <div key={cat} className="space-y-2 col-span-2">
                                    <h3 className="text-[10px] uppercase text-slate-500 font-bold sticky top-0 bg-slate-950 py-1">{t[cat]}</h3>
                                    {SURVIVAL_CONTENT[cat][lang].map((item: any) => (
                                        <div key={item.id} className="bg-slate-900 p-3 rounded border border-slate-800 text-xs">
                                            <div className="font-bold text-cyan-100 mb-1">{item.title}</div>
                                            <div className="text-slate-400 leading-relaxed font-mono text-[10px]">{item.content}</div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. EMERGENCY TAB */}
                {tab === 'EMERGENCY' && (
                    <div className="h-full flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xs font-bold text-red-500 tracking-widest animate-pulse">{t.emergency}</h2>
                            <button onClick={() => setTab('DASHBOARD')} className="bg-slate-800 px-3 py-1 rounded text-[10px]">{t.back}</button>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                            {!emergencyTree ? (
                                <button onClick={() => setEmergencyTree(EMERGENCY_TREES[lang].bleeding)} className="bg-red-600 w-full py-6 rounded-xl font-bold text-lg animate-pulse hover:bg-red-500 transition-colors">
                                    {t.emergency.split(' / ')[0]}
                                </button>
                            ) : (
                                <div className="space-y-6 w-full max-w-sm">
                                    <h3 className="text-xl font-bold text-red-400 border-b border-red-500/30 pb-2">{emergencyTree.title}</h3>

                                    {emergencyTree.nodes[emergencyNode].type === 'END' ? (
                                        <div className="bg-green-900/20 border border-green-500 p-4 rounded-xl">
                                            <div className="text-4xl mb-2">✅</div>
                                            <div className="font-bold text-green-400">{emergencyTree.nodes[emergencyNode].q}</div>
                                            <button onClick={() => { setEmergencyTree(null); setEmergencyNode('start'); }} className="mt-4 bg-slate-800 px-6 py-2 rounded text-xs font-bold">{t.done}</button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="text-lg font-bold">{emergencyTree.nodes[emergencyNode].q}</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button onClick={() => setEmergencyNode(emergencyTree.nodes[emergencyNode].yes)} className="bg-red-600 py-3 rounded font-bold hover:bg-red-500">{t.yes}</button>
                                                <button onClick={() => setEmergencyNode(emergencyTree.nodes[emergencyNode].no)} className="bg-slate-700 py-3 rounded font-bold hover:bg-slate-600">{t.no}</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
