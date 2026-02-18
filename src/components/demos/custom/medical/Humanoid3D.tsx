// @ts-nocheck
import React, { useMemo, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, useGLTF, Environment, Html, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const PARTS = {
    SKULL: `/public/skeleton_parts/skull.glb`,
    VERTEBRAE: `/public/skeleton_parts/vertebrae.glb`,
    CENTRAL: `/public/skeleton_parts/central_skeleton.glb`,
    ARM: `/public/skeleton_parts/arm_left.glb`,
    LEG: `/public/skeleton_parts/leg_left.glb`,
    HAND: `/public/skeleton_parts/hand_left.glb`,
    SKULL_COLORED: `/public/skeleton_parts/skull_detailed/overview-colored-skull.glb`,
    SKULL_BASE: `/public/skeleton_parts/skull_detailed/colored-skull-base.glb`
};

// Fix paths if needed - standard Vite public handling means we drop /public usually, checking...
// User copied to /Users/yousef/delta v/public/skeleton_parts
// So URL should be /skeleton_parts/...
const CORRECTED_PARTS = {
    SKULL: `/skeleton_parts/skull.glb`,
    VERTEBRAE: `/skeleton_parts/vertebrae.glb`,
    CENTRAL: `/skeleton_parts/central_skeleton.glb`,
    ARM: `/skeleton_parts/arm_left.glb`,
    LEG: `/skeleton_parts/leg_left.glb`,
    HAND: `/skeleton_parts/hand_left.glb`,
    SKULL_COLORED: `/skeleton_parts/skull_detailed/overview-colored-skull.glb`,
    SKULL_BASE: `/skeleton_parts/skull_detailed/colored-skull-base.glb`
};

interface BonePartProps {
    url: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    texture?: THREE.Texture | null;
    highlightTexture?: THREE.Texture | null;
    materialType?: string;
    excludeNames?: string[];
    highlightedParts?: any[];
    visualMode?: string;
    showVessels?: boolean;
}

const BonePart = ({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], texture, highlightTexture, materialType = 'muscle', excludeNames = [], highlightedParts = [], visualMode = 'WHITE_SKELETON', showVessels = true }: BonePartProps) => {
    // Enable DRACO support for compressed models
    const { scene } = useGLTF(url, 'https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

    const localScene = useMemo(() => {
        if (!scene) return null;
        return scene.clone();
    }, [scene]);

    React.useEffect(() => {
        if (!localScene) return;

        const veinMaterial = new THREE.MeshStandardMaterial({
            color: '#2563eb',
            emissive: '#1e3a8a',
            emissiveIntensity: 0.3,
            roughness: 0.3,
            metalness: 0.6,
        });

        const skeletonMaterial = new THREE.MeshStandardMaterial({
            color: '#f8fafc',
            roughness: 0.8,
            metalness: 0.05,
        });

        localScene.traverse((child: any) => {
            if (child.isMesh) {
                // Ensure shadows and performance optimizations
                child.castShadow = true;
                child.receiveShadow = true;

                const isVein = child.name.toLowerCase().includes('vein');

                if (isVein && (visualMode !== 'RED_MUSCLE' || !showVessels)) {
                    child.visible = false;
                    return;
                }
                if (excludeNames.includes(child.name)) {
                    child.visible = false;
                    return;
                }

                const checkHighlight = () => {
                    return highlightedParts.some(hp => {
                        const target = (typeof hp === 'object' ? hp.part : hp).toLowerCase();
                        const meshRaw = child.name.toLowerCase();

                        const aliases: Record<string, string[]> = {
                            'knee': ['leg', 'tibia', 'femur', 'patella', 'knee'],
                            'shoulder': ['arm', 'humerus', 'scapula', 'clavicle', 'shoulder'],
                            'hip': ['leg', 'pelvis', 'hip', 'femur'],
                            'chest': ['central', 'rib', 'sternum', 'chest', 'lung'],
                            'head': ['skull', 'head', 'face', 'temporal'],
                            'neck': ['neck', 'vertebrae', 'cervical'],
                            'spine': ['vertebrae', 'spine', 'back', 'neck'],
                            'back': ['back', 'vertebrae', 'spine']
                        };

                        const matchesAlias = Object.entries(aliases).some(([key, keywords]) => {
                            if (target.includes(key)) {
                                return keywords.some(k => meshRaw.includes(k));
                            }
                            return false;
                        });

                        return meshRaw.includes(target) || target.includes(meshRaw) || matchesAlias;
                    });
                };

                const isHighlighted = checkHighlight();

                if (isVein) {
                    child.material = veinMaterial;
                    child.visible = true;
                } else if (visualMode === 'RED_MUSCLE') {
                    child.material = new THREE.MeshStandardMaterial({
                        map: highlightTexture || texture || null,
                        color: isHighlighted ? '#ef4444' : '#991b1b',
                        emissive: isHighlighted ? '#ef4444' : '#7f1d1d',
                        emissiveIntensity: isHighlighted ? 0.8 : 0.2,
                        roughness: 0.4,
                        metalness: 0.1,
                    });
                    child.visible = true;
                } else if (isHighlighted) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: highlightTexture || texture || null,
                        color: '#ef4444',
                        emissive: '#ef4444',
                        emissiveIntensity: 0.6,
                        roughness: 0.2,
                        metalness: 0.1,
                    });
                    child.visible = true;
                } else {
                    child.material = skeletonMaterial;
                    child.visible = true;
                }
            }
        });
    }, [localScene, texture, highlightTexture, materialType, excludeNames, highlightedParts, visualMode, showVessels]);

    if (!localScene) return null;

    return <primitive object={localScene} position={position} rotation={rotation} scale={scale} />;
};

// Loader Component
const LoadingScreen = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-4 bg-brand-black/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 min-w-[300px]">
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-brand-accent shadow-[0_0_20px_rgba(77,178,255,0.5)]"
                    />
                </div>
                <div className="flex justify-between w-full font-mono text-[10px] tracking-widest text-brand-muted">
                    <span>ANALYZING BIOMETRICS</span>
                    <span className="text-brand-accent">{Math.round(progress)}%</span>
                </div>
            </div>
        </Html>
    );
};


const AnatomySystem = ({ highlightedParts = [], visualMode = 'WHITE_SKELETON', showVessels = true }: any) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1, 6.5]} />
            <ambientLight intensity={1.5} />
            <hemisphereLight args={[0xffffff, 0x444444, 1.0]} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <Environment preset="city" />

            <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
                <group position={[0, -0.65, 0]}>
                    <BonePart url={CORRECTED_PARTS.CENTRAL} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={CORRECTED_PARTS.CENTRAL} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={CORRECTED_PARTS.VERTEBRAE} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={CORRECTED_PARTS.SKULL_BASE} position={[0, 0, -0.02]} highlightedParts={highlightedParts} visualMode={visualMode} />

                    <BonePart url={CORRECTED_PARTS.ARM} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={CORRECTED_PARTS.ARM} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />

                    <BonePart url={CORRECTED_PARTS.HAND} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={CORRECTED_PARTS.HAND} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />

                    <BonePart url={CORRECTED_PARTS.LEG} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={CORRECTED_PARTS.LEG} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                </group>
            </Float>
            <OrbitControls enablePan={false} minDistance={2} maxDistance={12} autoRotate autoRotateSpeed={0.5} makeDefault />
        </>
    );
};

interface Humanoid3DProps {
    markers?: any[];
    highlightedParts?: string[];
    role?: string;
}

const Humanoid3D = ({ markers = [], highlightedParts = [], role: _role = 'DOCTOR' }: Humanoid3DProps) => {
    const [visualMode, setVisualMode] = useState('WHITE_SKELETON');
    const [showVessels] = useState(true);

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '500px', background: '#020617', borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => setVisualMode(v => v === 'RED_MUSCLE' ? 'WHITE_SKELETON' : 'RED_MUSCLE')} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid white', borderRadius: '8px', cursor: 'pointer', fontSize: '10px' }}>
                    TOGGLE LAYERS
                </button>
            </div>
            <Canvas dpr={[1, 2]}>
                <Suspense fallback={<LoadingScreen />}>
                    <AnatomySystem markers={markers} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Humanoid3D;

