"use client"

import { useEffect, useRef, useState, useSyncExternalStore, Suspense, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { useSceneRegistry } from "./SceneRegistry"
import { SceneObjectRegistryProvider } from "./SceneObjectRegistry"
import SceneLoader from "./SceneLoader"
import AdaptiveCamera from "./AdaptiveCamera.client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface SceneProps {
  id: string
  scrollHeight?: string
  background?: string
  fog?: { near: number; far: number; color: string }
  environment?: "studio" | "city" | "dawn" | "night" | "sunset" | "warehouse"
  pixelRatio?: number
  shadows?: boolean
  camera?: { fov?: number; position?: [number, number, number] }
  loadingStyle?: "spinner" | "bar" | "pulse"
  loadingColor?: string
  mobilePoster?: string
  children?: ReactNode
}

function getCanRender3D() {
  if (typeof window === "undefined") return false
  const concurrency = navigator.hardwareConcurrency ?? 4
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  return concurrency >= 4 && !prefersReduced && window.innerWidth >= 768
}

const subscribe = () => () => {}

export default function Scene({
  id,
  scrollHeight,
  background = "transparent",
  fog,
  environment,
  pixelRatio,
  shadows = false,
  camera,
  loadingStyle = "pulse",
  loadingColor,
  mobilePoster,
  children,
}: SceneProps) {
  const registry = useSceneRegistry()
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef(registry.registerScene(id))
  const [isVisible, setIsVisible] = useState(false)

  const canRender = useSyncExternalStore(subscribe, getCanRender3D, () => false)

  // Lazy mount: only create the Canvas when near the viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el || !canRender) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px 0px" } // Start mounting 200px before visible
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [canRender])

  // ScrollTrigger for scroll progress (only when using scrollHeight)
  useEffect(() => {
    if (!canRender || !containerRef.current || !scrollHeight) return

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressRef.current.current = self.progress
      },
    })

    return () => {
      trigger.kill()
      registry.unregisterScene(id)
    }
  }, [id, canRender, registry, scrollHeight])

  if (!canRender) {
    if (mobilePoster) {
      return (
        <div style={{ height: scrollHeight ?? "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mobilePoster} alt="" className="w-full h-full object-cover" />
        </div>
      )
    }
    return <div style={{ height: scrollHeight ?? "100%" }} />
  }

  const dpr: [number, number] = [1, Math.min(pixelRatio ?? (typeof window !== "undefined" ? window.devicePixelRatio : 1), 2)]

  // When used inside a GridStage cell (no scrollHeight), render just the canvas
  // When standalone (with scrollHeight), wrap in scroll container + sticky
  const canvas = isVisible ? (
    <Suspense fallback={<SceneLoader style={loadingStyle} color={loadingColor} />}>
      <Canvas
        className="h-full w-full"
        shadows={shadows}
        dpr={dpr}
        camera={{
          fov: camera?.fov ?? 50,
          position: camera?.position ?? [0, 0, 5],
        }}
        style={{ background }}
      >
        {fog && <fog attach="fog" args={[fog.color, fog.near, fog.far]} />}
        {environment && <Environment preset={environment} />}
        <AdaptiveCamera />
        <SceneObjectRegistryProvider>
          {children}
        </SceneObjectRegistryProvider>
      </Canvas>
    </Suspense>
  ) : (
    <SceneLoader style={loadingStyle} color={loadingColor} />
  )

  // Inside a grid cell — no scroll container needed
  if (!scrollHeight) {
    return (
      <div ref={containerRef} className="h-full w-full" role="img" aria-label={`3D scene: ${id}`}>
        {canvas}
      </div>
    )
  }

  // Standalone — scroll container with sticky
  return (
    <div ref={containerRef} style={{ height: scrollHeight }} role="img" aria-label={`3D scene: ${id}`}>
      <div className="sticky top-0 h-screen w-full">
        {canvas}
      </div>
    </div>
  )
}
