import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function StarfieldBackground() {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        // Scene setup
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000)
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        container.appendChild(renderer.domElement)

        // ── Stars ──
        const starCount = 1500
        const starGeo = new THREE.BufferGeometry()
        const starPos = new Float32Array(starCount * 3)
        const starSizes = new Float32Array(starCount)

        for (let i = 0; i < starCount; i++) {
            starPos[i * 3] = (Math.random() - 0.5) * 40
            starPos[i * 3 + 1] = (Math.random() - 0.5) * 40
            starPos[i * 3 + 2] = (Math.random() - 0.5) * 40
            starSizes[i] = Math.random() * 2 + 0.5
        }

        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
        starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))

        const starMat = new THREE.PointsMaterial({
            color: 0xE8F0F8,
            size: 0.08,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
        })

        const stars = new THREE.Points(starGeo, starMat)
        scene.add(stars)

        // ── Orbital rings ──
        const createOrbitRing = (radius: number, opacity: number) => {
            const ringGeo = new THREE.RingGeometry(radius - 0.005, radius + 0.005, 128)
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x00C8FF,
                side: THREE.DoubleSide,
                transparent: true,
                opacity,
            })
            const ring = new THREE.Mesh(ringGeo, ringMat)
            ring.rotation.x = Math.PI / 2.5
            return ring
        }

        const ring1 = createOrbitRing(2.5, 0.08)
        const ring2 = createOrbitRing(3.8, 0.05)
        const ring3 = createOrbitRing(5.2, 0.03)
        scene.add(ring1, ring2, ring3)

        // ── Small orbiting bodies (planets) ──
        const createOrbiter = (orbitRadius: number, size: number, speed: number, color: number) => {
            const geo = new THREE.SphereGeometry(size, 16, 16)
            const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 })
            const mesh = new THREE.Mesh(geo, mat)

            // Glow
            const glowGeo = new THREE.SphereGeometry(size * 2.5, 16, 16)
            const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1 })
            const glow = new THREE.Mesh(glowGeo, glowMat)
            mesh.add(glow)

            return { mesh, orbitRadius, speed, angle: Math.random() * Math.PI * 2 }
        }

        const orbiters = [
            createOrbiter(2.5, 0.06, 0.3, 0x00C8FF),
            createOrbiter(3.8, 0.04, 0.2, 0xE8F0F8),
            createOrbiter(5.2, 0.05, 0.12, 0x00C8FF),
        ]

        orbiters.forEach(o => scene.add(o.mesh))

        // ── Animation ──
        let animId: number
        const clock = new THREE.Clock()

        const animate = () => {
            animId = requestAnimationFrame(animate)
            const elapsed = clock.getElapsedTime()

            // Rotate starfield slowly
            stars.rotation.y = elapsed * 0.02
            stars.rotation.x = elapsed * 0.005

            // Tilt orbit rings gently
            ring1.rotation.z = Math.sin(elapsed * 0.1) * 0.05
            ring2.rotation.z = Math.sin(elapsed * 0.08 + 1) * 0.04
            ring3.rotation.z = Math.sin(elapsed * 0.06 + 2) * 0.03

            // Move orbiters
            orbiters.forEach(o => {
                o.angle += o.speed * 0.005
                o.mesh.position.x = Math.cos(o.angle) * o.orbitRadius
                o.mesh.position.z = Math.sin(o.angle) * o.orbitRadius * 0.4
                o.mesh.position.y = Math.sin(o.angle) * o.orbitRadius * Math.sin(Math.PI / 2.5)
            })

            // Gentle camera float
            camera.position.x = Math.sin(elapsed * 0.05) * 0.3
            camera.position.y = Math.cos(elapsed * 0.04) * 0.2

            renderer.render(scene, camera)
        }

        animate()

        // ── Resize handler ──
        const handleResize = () => {
            if (!container) return
            camera.aspect = container.clientWidth / container.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(container.clientWidth, container.clientHeight)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', handleResize)
            renderer.dispose()
            container.removeChild(renderer.domElement)
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    )
}
