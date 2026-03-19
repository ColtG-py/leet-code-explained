"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useGLTF, Environment } from "@react-three/drei"
import type { Group } from "three"
import { useFrame } from "@react-three/fiber"

interface ThumbnailCanvasProps {
  model: string
  camera?: { position: number[] }
  autoRotate?: boolean
  lighting?: string
}

function ThumbnailModel({
  src,
  autoRotate,
}: {
  src: string
  autoRotate?: boolean
}) {
  const { scene } = useGLTF(src)
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

export default function ThumbnailCanvas({
  model,
  camera,
  autoRotate = true,
  lighting = "studio",
}: ThumbnailCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "100px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
    >
      {isVisible && (
        <Canvas
          dpr={0.75}
          camera={{
            position: (camera?.position as [number, number, number]) ?? [0, 1, 5],
            fov: 40,
          }}
          gl={{ antialias: false }}
        >
          <Suspense fallback={null}>
            <ThumbnailModel src={model} autoRotate={autoRotate} />
            <Environment preset={lighting as "studio" | "city" | "dawn" | "night"} />
          </Suspense>
        </Canvas>
      )}
    </div>
  )
}
