import { useRef, useEffect } from 'react'

export function SpaceBackground() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            // Raw playback speed for maximum stability
            videoRef.current.play().catch(err => {
                console.warn("Background video autoplay failed:", err)
            })
        }
    }, [])

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden">
            {/* Pristine Background Feed - Optimized for High-DPI/Retina Displays */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-screen h-screen object-cover pointer-events-none"
                style={{
                    imageRendering: '-webkit-optimize-contrast',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                }}
            >
                <source src="/assets/backgrounds/new-space-bg.mp4" type="video/mp4" />
            </video>
        </div>
    )
}
