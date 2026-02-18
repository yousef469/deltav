// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { Upload, ArrowLeft, Loader2, Crosshair, RotateCcw, Scan, Cpu, Maximize, Lock, Crown } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { generateResponse } from './services/gemini';

// --- HUD Overlay (Visuals) ---
const HUDOverlay = ({ selectedPartName, modelType, isAnalyzing, hoveredPartName, mousePosition }) => (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Tech Corners */}
        <div className="absolute top-6 left-6 w-32 h-32 border-l-2 border-t-2 border-cyan-500/40 rounded-tl-3xl opacity-80" />
        <div className="absolute bottom-6 right-6 w-32 h-32 border-r-2 border-b-2 border-cyan-500/40 rounded-br-3xl opacity-80" />

        {/* Crosshair Lines */}
        <div className="absolute top-1/2 left-0 w-12 h-[1px] bg-cyan-500/50" />
        <div className="absolute top-1/2 right-0 w-12 h-[1px] bg-cyan-500/50" />
        <div className="absolute top-0 left-1/2 w-[1px] h-12 bg-cyan-500/50" />
        <div className="absolute bottom-0 left-1/2 w-[1px] h-12 bg-cyan-500/50" />

        {/* Floating Hover Label */}
        {hoveredPartName && !selectedPartName && mousePosition && (
            <div
                className="absolute pointer-events-none animate-fade-in"
                style={{
                    left: `${mousePosition.x + 20}px`,
                    top: `${mousePosition.y - 10}px`,
                    transform: 'translateY(-100%)'
                }}
            >
                <div className="bg-gradient-to-r from-cyan-500/90 to-blue-500/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.5)] border border-cyan-300/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
                        <span className="text-white font-bold text-sm tracking-wide">
                            {hoveredPartName}
                        </span>
                    </div>
                    <div className="text-xs text-cyan-100 mt-1 opacity-80">
                        Click to inspect
                    </div>
                </div>
                <div className="absolute left-4 bottom-0 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-cyan-500/90 transform translate-y-full" />
            </div>
        )}

        {/* Center Status */}
        {(selectedPartName || isAnalyzing) && (
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                <div className="bg-black/80 border border-cyan-400/50 px-8 py-3 rounded backdrop-blur-md shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                    <div className="flex items-center gap-3">
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                                <span className="text-cyan-400 font-mono font-bold tracking-[0.15em] text-sm">
                                    IDENTIFYING BLUEPRINT...
                                </span>
                            </>
                        ) : (
                            <>
                                <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                                <span className="text-cyan-400 font-mono font-bold tracking-[0.15em] text-sm">
                                    ANALYZING: {selectedPartName ? selectedPartName.toUpperCase() : "SYSTEM READY"}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
);

export default function ExplodeViewer() {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const fileInputRef = useRef(null);

    const hoveredPartRef = useRef(null);
    const selectedPartRef = useRef(null);

    // State
    const [parts, setParts] = useState([]);
    const [originalStates, setOriginalStates] = useState(new Map());
    const [explodeVectors, setExplodeVectors] = useState(new Map());
    const [isExploded, setIsExploded] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);
    const [hoveredPart, setHoveredPart] = useState(null);
    const [partExplanations, setPartExplanations] = useState(new Map());
    const [loadingExplanation, setLoadingExplanation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modelLoaded, setModelLoaded] = useState(false);
    const [modelType, setModelType] = useState('');
    const [modelInfo, setModelInfo] = useState(null);
    const [analyzingModel, setAnalyzingModel] = useState(false);
    const [originalCenter, setOriginalCenter] = useState(new THREE.Vector3());
    const [mousePosition, setMousePosition] = useState(null);
    const [autoRotate, setAutoRotate] = useState(true);

    // --- 1. Setup Scene ---
    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x05070a);
        scene.fog = new THREE.FogExp2(0x05070a, 0.002);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            50,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            10000
        );
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 1.0;
        controlsRef.current = controls;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const blueRim = new THREE.SpotLight(0x00ffff, 50);
        blueRim.position.set(-20, 0, -10);
        scene.add(blueRim);

        const grid = new THREE.GridHelper(1000, 100, 0x1a1a1a, 0x0a0a0a);
        grid.position.y = -10;
        scene.add(grid);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();

            const currentHover = hoveredPartRef.current;
            if (currentHover && !selectedPartRef.current) {
                const materials = Array.isArray(currentHover.material) ? currentHover.material : [currentHover.material];
                materials.forEach(mat => {
                    if (mat && mat.emissive && mat.userData.isHovered) {
                        const pulse = (Math.sin(Date.now() * 0.005) + 1) * 0.5;
                        mat.emissiveIntensity = 0.2 + (pulse * 0.2);
                    }
                });
            }

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Initial Load (Saturn V default)
        loadModel('/saturn-v.glb', 'Saturn V');

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    const handleMouseMove = (e) => {
        if (!parts.length || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        const intersects = raycasterRef.current.intersectObjects(parts, false);

        const currentHover = hoveredPartRef.current;
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (currentHover !== obj) {
                if (currentHover && currentHover !== selectedPartRef.current) {
                    const mats = Array.isArray(currentHover.material) ? currentHover.material : [currentHover.material];
                    mats.forEach(mat => { if (mat.emissive) { mat.emissive.setHex(0x000000); mat.emissiveIntensity = 0; mat.userData.isHovered = false; } });
                }
                if (obj !== selectedPartRef.current) {
                    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
                    mats.forEach(mat => { if (mat.emissive) { mat.emissive.setHex(0x00ffff); mat.emissiveIntensity = 0.3; mat.userData.isHovered = true; } });
                }
                hoveredPartRef.current = obj;
                setHoveredPart(obj);
                containerRef.current.style.cursor = 'pointer';
            }
        } else if (currentHover) {
            const mats = Array.isArray(currentHover.material) ? currentHover.material : [currentHover.material];
            mats.forEach(mat => { if (mat.emissive && currentHover !== selectedPartRef.current) { mat.emissive.setHex(0x000000); mat.emissiveIntensity = 0; mat.userData.isHovered = false; } });
            hoveredPartRef.current = null;
            setHoveredPart(null);
            containerRef.current.style.cursor = 'default';
        }
    };

    const handleClick = (e) => {
        if (hoveredPartRef.current) {
            handlePartSelect(hoveredPartRef.current);
        } else {
            handleResetSelection();
        }
    };

    const loadModel = (url, name) => {
        setIsLoading(true);
        setModelInfo(null);
        setModelType(name);

        const extension = url.split('.').pop().toLowerCase();
        let loader = extension === 'fbx' ? new FBXLoader() : new GLTFLoader();

        if (extension !== 'fbx') {
            const draco = new DRACOLoader();
            draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
            loader.setDRACOLoader(draco);
        }

        loader.load(url, (gltf) => {
            const root = extension === 'fbx' ? gltf : gltf.scene;

            // Cleanup old
            if (sceneRef.current) {
                const toRemove = [];
                sceneRef.current.traverse(c => { if (c.userData.isPart) toRemove.push(c) });
                toRemove.forEach(c => sceneRef.current.remove(c));
            }

            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scaleFactor = 100 / maxDimension;
            root.scale.multiplyScalar(scaleFactor);
            root.updateMatrixWorld(true);

            const scaledBox = new THREE.Box3().setFromObject(root);
            const scaledSize = scaledBox.getSize(new THREE.Vector3());
            const scaledCenter = scaledBox.getCenter(new THREE.Vector3());

            const meshes = [];
            root.traverse(child => { if (child.isMesh) meshes.push(child) });

            const newParts = [];
            const states = new Map();
            const vectors = new Map();

            meshes.forEach((mesh, i) => {
                if (mesh.material) {
                    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                    const cloned = mats.map(m => {
                        const c = m.clone();
                        c.side = THREE.DoubleSide;
                        if (c.isMeshStandardMaterial) { c.metalness = 0.5; c.roughness = 0.4; }
                        if (!c.map && (!c.color || (c.color.r === 0 && c.color.g === 0 && c.color.b === 0))) c.color.setHex(0x888888);
                        c.needsUpdate = false;
                        return c;
                    });
                    mesh.material = Array.isArray(mesh.material) ? cloned : cloned[0];
                }

                mesh.updateMatrixWorld(true);
                const worldPos = new THREE.Vector3();
                const worldQuat = new THREE.Quaternion();
                const worldScale = new THREE.Vector3();
                mesh.matrixWorld.decompose(worldPos, worldQuat, worldScale);

                mesh.removeFromParent();
                mesh.position.copy(worldPos);
                mesh.quaternion.copy(worldQuat);
                mesh.scale.copy(worldScale);

                mesh.userData.isPart = true;
                mesh.userData.partName = mesh.name.replace(/_/g, ' ') || `Part ${i}`;

                const explodeDir = new THREE.Vector3().subVectors(worldPos, scaledCenter).normalize();
                if (explodeDir.lengthSq() === 0) explodeDir.set(Math.random(), Math.random(), Math.random()).normalize();
                const explodeDist = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) * 0.5;

                vectors.set(mesh, explodeDir.multiplyScalar(explodeDist));
                states.set(mesh, { pos: worldPos.clone(), rot: mesh.rotation.clone(), scale: worldScale.clone() });

                sceneRef.current.add(mesh);
                newParts.push(mesh);
            });

            setParts(newParts);
            setOriginalStates(states);
            setExplodeVectors(vectors);
            setOriginalCenter(scaledCenter.clone());

            const dist = 200;
            cameraRef.current.position.set(scaledCenter.x + dist, scaledCenter.y + dist / 2, scaledCenter.z + dist);
            cameraRef.current.lookAt(scaledCenter);
            controlsRef.current.target.copy(scaledCenter);
            controlsRef.current.update();

            setModelLoaded(true);
            setIsLoading(false);

            // Auto-analyze model
            analyzeModel(name, newParts);
        }, undefined, (e) => {
            console.error(e);
            setIsLoading(false);
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        loadModel(url, file.name.split('.')[0]);
    };

    const analyzeModel = async (name, partsList) => {
        setAnalyzingModel(true);
        try {
            const prompt = `Identify this 3D model: ${name}. Provide a technical overview in JSON format.
            {
              "modelName": "Full Name",
              "transportation": "Purpose",
              "engine": "Engine Specs",
              "thrust": "Thrust if rocket",
              "hp": "Horsepower if car",
              "topSpeed": "Max speed",
              "history": "Short history",
              "notableFacts": "Interesting fact"
            }`;
            const response = await generateResponse(prompt);
            try {
                const json = JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
                setModelInfo(json);
                setModelType(json.modelName);
            } catch (e) {
                setModelInfo({ history: response });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzingModel(false);
        }
    };

    const handleExplode = () => {
        if (!modelLoaded) return;
        if (selectedPartRef.current) handleResetSelection();

        if (isExploded) {
            parts.forEach((part, i) => {
                const state = originalStates.get(part);
                gsap.to(part.position, { x: state.pos.x, y: state.pos.y, z: state.pos.z, duration: 1, ease: "power2.inOut" });
                gsap.to(part.rotation, { x: state.rot.x, y: state.rot.y, z: state.rot.z, duration: 1 });
            });
            setIsExploded(false);
        } else {
            parts.forEach((part, i) => {
                const state = originalStates.get(part);
                const vec = explodeVectors.get(part);
                gsap.to(part.position, { x: state.pos.x + vec.x, y: state.pos.y + vec.y, z: state.pos.z + vec.z, duration: 1.5, ease: "elastic.out(1, 0.75)" });
                gsap.to(part.rotation, { x: state.rot.x + Math.random(), y: state.rot.y + Math.random(), duration: 1.5 });
            });
            setIsExploded(true);
        }
    };

    const handlePartSelect = async (part) => {
        if (selectedPartRef.current === part) return;
        if (selectedPartRef.current) handleResetSelection();

        selectedPartRef.current = part;
        setSelectedPart(part);

        parts.forEach(p => {
            const mats = Array.isArray(p.material) ? p.material : [p.material];
            mats.forEach(mat => {
                mat.transparent = true;
                gsap.to(mat, { opacity: p === part ? 1 : 0.2, duration: 0.5 });
                if (p === part && mat.emissive) { mat.emissive.setHex(0x00ffff); mat.emissiveIntensity = 0.5; }
            });
        });

        const box = new THREE.Box3().setFromObject(part);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const zoomDist = Math.max(Math.max(size.x, size.y, size.z) * 4, 30);
        const offset = new THREE.Vector3().subVectors(cameraRef.current.position, center).normalize().multiplyScalar(zoomDist);

        gsap.to(cameraRef.current.position, { x: center.x + offset.x, y: center.y + offset.y, z: center.z + offset.z, duration: 1, ease: "power3.out" });
        gsap.to(controlsRef.current.target, { x: center.x, y: center.y, z: center.z, duration: 1 });

        setLoadingExplanation(true);
        try {
            const prompt = `Analyze this engineering part: ${part.userData.partName}. Provide: 1. Purpose 2. Common Materials 3. Maintenance Tip.`;
            const response = await generateResponse(prompt);
            setPartExplanations(prev => new Map(prev).set(part.userData.partName, response));
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingExplanation(false);
        }
    };

    const handleResetSelection = () => {
        if (!selectedPartRef.current) return;

        parts.forEach(p => {
            const mats = Array.isArray(p.material) ? p.material : [p.material];
            mats.forEach(mat => {
                gsap.to(mat, { opacity: 1, duration: 0.5, onComplete: () => { if (!selectedPartRef.current) mat.transparent = false; } });
                if (mat.emissive) { mat.emissive.setHex(0x000000); mat.emissiveIntensity = 0; }
            });
            const state = originalStates.get(p);
            gsap.to(p.position, { x: state.pos.x, y: state.pos.y, z: state.pos.z, duration: 1 });
            gsap.to(p.rotation, { x: state.rot.x, y: state.rot.y, z: state.rot.z, duration: 1 });
        });

        const dist = 200;
        gsap.to(cameraRef.current.position, { x: originalCenter.x + dist, y: originalCenter.y + dist / 2, z: originalCenter.z + dist, duration: 1.2 });
        gsap.to(controlsRef.current.target, { x: originalCenter.x, y: originalCenter.y, z: originalCenter.z, duration: 1.2 });

        selectedPartRef.current = null;
        setSelectedPart(null);
    };

    return (
        <div className="relative w-full h-full bg-[#05070a] text-white font-sans overflow-hidden">
            {/* 3D Container */}
            <div
                ref={containerRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            />

            <HUDOverlay
                selectedPartName={selectedPart?.userData?.partName}
                modelType={modelType}
                isAnalyzing={analyzingModel}
                hoveredPartName={hoveredPart?.userData?.partName}
                mousePosition={mousePosition}
            />

            {/* Top Bar Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-6 py-2 rounded text-xs flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" /> UPLOAD MODEL
                    </button>
                    <div className="flex gap-2 bg-black/40 backdrop-blur-md p-1 rounded border border-white/10">
                        <button
                            onClick={() => loadModel('/saturn-v.glb', 'Saturn V')}
                            className="px-4 py-1.5 rounded text-[10px] font-bold tracking-widest bg-white/5 hover:bg-cyan-900/30 transition-colors border border-white/5"
                        >
                            SATURN V
                        </button>
                        <button
                            onClick={() => loadModel('/falcon9-spacex.glb', 'Falcon 9')}
                            className="px-4 py-1.5 rounded text-[10px] font-bold tracking-widest bg-white/5 hover:bg-cyan-900/30 transition-colors border border-white/5"
                        >
                            FALCON 9
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    <button
                        onClick={() => {
                            const newAuto = !autoRotate;
                            setAutoRotate(newAuto);
                            controlsRef.current.autoRotate = newAuto;
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded border font-bold tracking-widest transition-all text-xs ${autoRotate ? 'border-cyan-500 text-cyan-500 bg-cyan-950/20' : 'border-gray-500 text-gray-500'}`}
                    >
                        <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} /> AUTO
                    </button>
                    <button
                        onClick={handleExplode}
                        disabled={!modelLoaded}
                        className={`flex items-center gap-2 px-6 py-2 rounded border font-bold tracking-widest transition-all text-xs ${isExploded ? 'border-red-500 text-red-500 bg-red-950/20' : 'border-cyan-500 text-cyan-500 bg-cyan-950/20'} disabled:opacity-30`}
                    >
                        {isExploded ? <RotateCcw className="w-4 h-4" /> : <Scan className="w-4 h-4" />}
                        {isExploded ? 'REASSEMBLE' : 'INITIATE EXPLODE'}
                    </button>
                </div>
            </div>

            <input ref={fileInputRef} type="file" accept=".glb,.gltf,.fbx" onChange={handleFileUpload} className="hidden" />

            {/* Sidebar */}
            <div className={`w-96 border-l border-cyan-900/30 bg-black/80 backdrop-blur absolute right-0 top-0 bottom-0 z-30 transition-transform duration-500 flex flex-col ${modelLoaded || modelInfo ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 border-b border-cyan-900/30 bg-gradient-to-r from-cyan-950/50 to-blue-950/50">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <h2 className="text-cyan-400 text-sm font-bold tracking-wider uppercase">J.A.R.V.I.S. Analysis</h2>
                    </div>
                    {modelType && <p className="text-xs text-cyan-300/60 mt-1 font-mono uppercase">{modelType}</p>}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                    {/* Model Info (Colored Sections) */}
                    {modelInfo && (
                        <div className="space-y-4 animate-fade-in">
                            {modelInfo.engine && (
                                <div className="bg-purple-950/20 p-4 rounded border border-purple-500/20">
                                    <div className="text-purple-400 font-bold mb-2 text-xs tracking-widest uppercase">🔧 Propulsion System</div>
                                    <div className="space-y-1.5 text-xs">
                                        <div><span className="text-purple-300">Engine:</span> <span className="text-white">{modelInfo.engine}</span></div>
                                        {modelInfo.thrust && <div><span className="text-purple-300">Thrust:</span> <span className="text-white">{modelInfo.thrust}</span></div>}
                                        {modelInfo.hp && <div><span className="text-purple-300">Power:</span> <span className="text-white">{modelInfo.hp}</span></div>}
                                    </div>
                                </div>
                            )}

                            {modelInfo.topSpeed && (
                                <div className="bg-cyan-950/20 p-4 rounded border border-cyan-500/20">
                                    <div className="text-cyan-400 font-bold mb-2 text-xs tracking-widest uppercase">⚡ Performance Specs</div>
                                    <div className="space-y-1.5 text-xs">
                                        <div><span className="text-cyan-300">Top Speed:</span> <span className="text-white tracking-widest">{modelInfo.topSpeed}</span></div>
                                        {modelInfo.transportation && <div><span className="text-cyan-300">Role:</span> <span className="text-white">{modelInfo.transportation}</span></div>}
                                    </div>
                                </div>
                            )}

                            {modelInfo.history && (
                                <div className="bg-blue-950/20 p-4 rounded border border-blue-500/20">
                                    <div className="text-blue-400 font-bold mb-2 text-xs tracking-widest uppercase">📜 Historical Context</div>
                                    <p className="text-gray-300 text-xs leading-relaxed font-mono">{modelInfo.history}</p>
                                    {modelInfo.notableFacts && (
                                        <p className="text-blue-300 text-[10px] mt-3 italic">💡 {modelInfo.notableFacts}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Component Info */}
                    {selectedPart && (
                        <div className="mt-8 pt-8 border-t border-cyan-900/30 animate-slide-in-right">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-cyan-400 font-mono text-xs tracking-widest uppercase">Component Focus</h3>
                                <button onClick={handleResetSelection} className="text-white/40 hover:text-white transition-colors">
                                    <RotateCcw className="w-3 h-3" />
                                </button>
                            </div>
                            <h2 className="text-xl font-bold mb-4 uppercase text-white tracking-tight">{selectedPart.userData.partName}</h2>
                            {loadingExplanation ? (
                                <div className="flex flex-col items-center py-12 gap-4">
                                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                                    <p className="text-[10px] text-cyan-400/60 font-mono tracking-widest uppercase">Analyzing Blueprint...</p>
                                </div>
                            ) : (
                                <div className="text-white/80 text-xs leading-relaxed font-mono whitespace-pre-wrap bg-cyan-950/10 p-4 rounded border border-cyan-500/10">
                                    {partExplanations.get(selectedPart.userData.partName) || "Initiating component scan..."}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State */}
            {!modelLoaded && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center opacity-20 group">
                        <Scan className="w-24 h-24 mx-auto mb-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                        <p className="tracking-[0.8em] font-bold text-sm text-cyan-400">INITIALIZING SYSTEMS...</p>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-[#05070a]/90 backdrop-blur-xl flex flex-col items-center justify-center z-50">
                    <div className="relative">
                        <div className="w-32 h-32 border-2 border-cyan-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                        </div>
                    </div>
                    <p className="mt-12 text-cyan-400 font-mono tracking-[0.4em] text-xs animate-pulse font-bold">UPLOADING NEURAL BLUEPRINT...</p>
                </div>
            )}
        </div>
    );
}
