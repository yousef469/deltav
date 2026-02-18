import React, { useMemo, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, useGLTF, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const MAPPING = {
    'Head': [0, 2.22, 0.05],
    'Chest': [0, 1.45, 0.22],
    'Abdomen': [0, 0.85, 0.22],
    'Neck': [0, 1.85, 0.08],
    'Left Arm': [-0.52, 1.38, 0.05],
    'Right Arm': [0.52, 1.38, 0.05],
    'Left Leg': [-0.22, -0.35, 0.05],
    'Right Leg': [0.22, -0.35, 0.05],
    'Back': [0, 1.45, -0.25]
};

const PARTS = {
    SKULL: `/skeleton_parts/skull.glb`,
    VERTEBRAE: `/skeleton_parts/vertebrae.glb`,
    CENTRAL: `/skeleton_parts/central_skeleton.glb`,
    ARM: `/skeleton_parts/arm_left.glb`,
    LEG: `/skeleton_parts/leg_left.glb`,
    HAND: `/skeleton_parts/hand_left.glb`,
    SKULL_COLORED: `/skeleton_parts/skull_detailed/overview-colored-skull.glb`,
    SKULL_BASE: `/skeleton_parts/skull_detailed/colored-skull-base.glb`
};

const BonePart = ({ url, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], texture, highlightTexture, materialType = 'muscle', excludeNames = [], highlightedParts = [], visualMode = 'WHITE_SKELETON', showVessels = true }) => {
    const { scene } = useGLTF(url);

    // Memory Optimization: We clone the object hierarchy ONCE per instance.
    // Three.js primitives cannot have multiple parents, so unique instances are required for 
    // mirroring (Left/Right) while still sharing geometries and textures for low RAM usage.
    const localScene = React.useMemo(() => {
        if (!scene) return null;
        return scene.clone();
    }, [scene]);

    React.useEffect(() => {
        if (!localScene) return;

        const redDyeMaterial = new THREE.MeshStandardMaterial({
            color: '#991b1b',
            emissive: '#991b1b',
            emissiveIntensity: 0.1,
            roughness: 0.4,
            metalness: 0.2,
        });

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

        localScene.traverse((child) => {
            if (child.isMesh) {
                const isVein = child.name.toLowerCase().includes('vein');

                // Visibility Logic
                if (isVein && (visualMode !== 'RED_MUSCLE' || !showVessels)) {
                    child.visible = false;
                    return;
                }
                if (excludeNames.includes(child.name)) {
                    child.visible = false;
                    return;
                }

                // Highlighting Logic - Aggressive matching for joint/cancer regions
                const checkHighlight = () => {
                    return highlightedParts.some(hp => {
                        const target = (typeof hp === 'object' ? hp.part : hp).toLowerCase();
                        const meshRaw = child.name.toLowerCase();

                        // Broad anatomical mapping
                        const aliases = {
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
                    // Hybrid Highlight: Switch to muscle look only for the problem area
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

const AnatomySystem = ({ markers = [], highlightedParts = [], visualMode = 'WHITE_SKELETON', showVessels = true }) => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 1, 6.5]} />
            <ambientLight intensity={1.5} />
            <hemisphereLight skyColor={0xffffff} groundColor={0x444444} intensity={1.0} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            <Environment preset="city" />

            <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
                <group position={[0, -0.65, 0]}>
                    <BonePart url={PARTS.CENTRAL} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={PARTS.CENTRAL} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={PARTS.VERTEBRAE} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={PARTS.SKULL_BASE} position={[0, 0, -0.02]} highlightedParts={highlightedParts} visualMode={visualMode} />

                    <BonePart url={PARTS.ARM} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={PARTS.ARM} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />

                    <BonePart url={PARTS.HAND} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={PARTS.HAND} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />

                    <BonePart url={PARTS.LEG} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                    <BonePart url={PARTS.LEG} scale={[-1, 1, 1]} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                </group>
            </Float>
            <OrbitControls enablePan={false} minDistance={2} maxDistance={12} autoRotate autoRotateSpeed={0.5} makeDefault />
        </>
    );
};

const Humanoid3D = ({ markers = [], highlightedParts = [], role = 'DOCTOR' }) => {
    const [visualMode, setVisualMode] = useState('WHITE_SKELETON');
    const [showVessels, setShowVessels] = useState(true);

    return (
        <div style={{ width: '100%', height: '100%', minHeight: '600px', background: '#020617', borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={() => setVisualMode(v => v === 'RED_MUSCLE' ? 'WHITE_SKELETON' : 'RED_MUSCLE')} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid white', borderRadius: '8px', cursor: 'pointer' }}>
                    TOGGLE LAYERS
                </button>
            </div>
            <Canvas dpr={[1, 2]}>
                <Suspense fallback={null}>
                    <AnatomySystem markers={markers} highlightedParts={highlightedParts} visualMode={visualMode} showVessels={showVessels} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Humanoid3D;
