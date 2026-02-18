import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Trail() {
    const pointsRef = useRef<THREE.Points>(null)
    const count = 40
    const positions = useMemo(() => new Float32Array(count * 3), [count])
    const mouse = useRef(new THREE.Vector3())

    useFrame((state) => {
        // Interpolate mouse position to screen space
        mouse.current.x = (state.mouse.x * state.viewport.width) / 2
        mouse.current.y = (state.mouse.y * state.viewport.height) / 2

        // Update trail positions
        for (let i = count - 1; i > 0; i--) {
            positions[i * 3] = positions[(i - 1) * 3]
            positions[i * 3 + 1] = positions[(i - 1) * 3 + 1]
            positions[i * 3 + 2] = positions[(i - 1) * 3 + 2]
        }

        positions[0] = mouse.current.x
        positions[1] = mouse.current.y
        positions[2] = 0

        if (pointsRef.current) {
            pointsRef.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#4DB2FF"
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
            />
        </points>
    )
}

export function NeonCursor() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[999]">
            <Canvas
                orthographic
                camera={{ zoom: 100, position: [0, 0, 10] }}
                style={{ pointerEvents: 'none' }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance'
                }}
            >
                <Trail />
            </Canvas>
        </div>
    )
}
